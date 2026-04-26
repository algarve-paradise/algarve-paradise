/**
 * AI Rewriter — pluggable interface used by the ingestion pipeline to
 * convert a raw scraped item into an editorially safe Portuguese article.
 *
 * Two implementations live in ./providers:
 *   - anthropic.ts (Claude Haiku 4.5, default)
 *   - openai.ts    (GPT-4o-mini)
 *
 * Selection is controlled by the AI_PROVIDER env var.
 */
import { z } from "zod";
import type { NewsCategory } from "@/types/content";
import type { RewrittenArticle } from "@/lib/ingest/types";
import { newsCategories, slugifyNewsTitle } from "@/lib/news-shared";
import { getAiProvider } from "@/lib/settings";

import { RewriterError } from "./errors";
import { rewriteWithAnthropic } from "./providers/anthropic";
import { rewriteWithOpenAI } from "./providers/openai";
import { rewriteWithGemini } from "./providers/gemini";

export { RewriterError } from "./errors";

export type RewriterInput = {
  sourceName: string;
  sourceUrl: string;
  rawTitle: string;
  rawSummary: string | null;
  defaultCategory: NewsCategory;
  publishedAt: Date | null;
};

export const rewriterOutputSchema = z.object({
  title: z.string().trim().min(6).max(220),
  excerpt: z.string().trim().min(20).max(320),
  content: z.string().trim().min(200),
  category: z.enum(newsCategories as [NewsCategory, ...NewsCategory[]]),
  slug: z.string().trim().min(3).max(80).optional(),
  confidence: z.number().min(0).max(1).optional(),
  needsImage: z.boolean().optional(),
  imageQuery: z.string().trim().min(2).max(120).optional(),
});

export type RewriterOutput = z.infer<typeof rewriterOutputSchema>;

export const SYSTEM_PROMPT = `Es um editor e jornalista profissional do portal regional "O Portal do Algarve".
Reescreves noticias em portugues europeu (PT-PT), com linguagem clara, objetiva e jornalistica.

REGRAS OBRIGATORIAS:
1. NUNCA copies frases do texto original. Reescreve sempre por palavras tuas.
2. Mantem-te 100% fiel aos factos: nomes, datas, locais, numeros.
3. Se algum facto nao estiver claro no original, NAO inventes — escreve apenas o que e seguro.
4. Atribui sempre a fonte no final do conteudo, no formato: "Com informacao de [nome da fonte]."
5. Usa categoria APENAS de uma destas: Algarve, Municipios, Economia, Turismo, Seguranca, Eventos.
6. O resumo (excerpt) tem que ser uma unica frase, ate 220 caracteres.
7. O corpo (content) deve ter entre 3 e 5 paragrafos curtos, separados por linha em branco.
8. NAO uses markdown, apenas texto puro com paragrafos separados por \\n\\n.

DECISAO DE IMAGEM:
Decides se a noticia beneficia de uma foto de capa de banco de imagens.
Devolve "needsImage": true APENAS quando:
  - O tema e visualmente identificavel (turismo, evento publico, obras, natureza,
    eventos culturais, gastronomia, desporto, urbanismo, transportes).
  - Uma foto generica relevante NAO induz o leitor em erro.
Devolve "needsImage": false quando:
  - E uma noticia institucional, administrativa, juridica, eleitoral, financeira,
    politica, ou de pessoas/organizacoes especificas (uma foto stock generica seria
    desonesta ou enganadora).
  - O texto original e curto / faltam factos para descrever uma cena visual segura.
Quando needsImage = true, sugere "imageQuery" — 2 a 5 palavras em ingles para
pesquisar no banco de imagens (ex: "algarve coastline", "lisbon city hall",
"beach festival crowd"). Sem nomes proprios.

Devolves SEMPRE um objeto JSON valido com este formato exato:
{
  "title": "string",
  "excerpt": "string",
  "content": "string",
  "category": "string",
  "slug": "string opcional",
  "confidence": 0.0 a 1.0,
  "needsImage": true | false,
  "imageQuery": "string em ingles (so quando needsImage=true)"
}

A confidence reflete o quao confortavel estas com a reescrita. Usa < 0.5 quando
faltam factos chave ou o original e ambiguo.`;

export function buildUserPrompt(input: RewriterInput): string {
  const datePart = input.publishedAt
    ? `Data original: ${input.publishedAt.toISOString()}\n`
    : "";

  return `Reescreve a seguinte noticia para o portal "O Portal do Algarve".
Categoria sugerida: ${input.defaultCategory}
Fonte: ${input.sourceName}
URL da fonte: ${input.sourceUrl}
${datePart}
Titulo original:
${input.rawTitle}

Conteudo original (resumo):
${input.rawSummary ?? "(nao disponivel)"}

Devolve apenas o objeto JSON, sem prefixos, sem suffixos, sem code fences.`;
}

export async function rewriteArticle(input: RewriterInput): Promise<RewrittenArticle> {
  const provider = await getAiProvider();
  const userPrompt = buildUserPrompt(input);

  let raw: unknown;
  try {
    if (provider === "openai") {
      raw = await rewriteWithOpenAI({ system: SYSTEM_PROMPT, user: userPrompt });
    } else if (provider === "gemini") {
      raw = await rewriteWithGemini({ system: SYSTEM_PROMPT, user: userPrompt });
    } else {
      raw = await rewriteWithAnthropic({ system: SYSTEM_PROMPT, user: userPrompt });
    }
  } catch (error) {
    throw new RewriterError(
      `Provider ${provider} falhou: ${(error as Error).message}`,
      "provider_error"
    );
  }

  const parsed = rewriterOutputSchema.safeParse(raw);
  if (!parsed.success) {
    throw new RewriterError(
      `Resposta da IA invalida: ${parsed.error.issues.map((i) => i.message).join(", ")}`,
      "schema_error"
    );
  }

  const slug = parsed.data.slug?.trim()
    ? slugifyNewsTitle(parsed.data.slug)
    : slugifyNewsTitle(parsed.data.title);

  return {
    title: parsed.data.title,
    excerpt: parsed.data.excerpt,
    content: parsed.data.content,
    category: parsed.data.category,
    slug,
    confidence: parsed.data.confidence ?? 0.6,
    needsImage: parsed.data.needsImage ?? false,
    imageQuery: parsed.data.imageQuery,
  };
}

