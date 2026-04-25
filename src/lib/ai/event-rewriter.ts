import { z } from "zod";
import { env } from "@/lib/env";
import { slugifyNewsTitle } from "@/lib/news-shared";
import type { RewrittenEvent } from "@/lib/ingest/types";

import { RewriterError } from "./errors";
import { rewriteWithAnthropic } from "./providers/anthropic";
import { rewriteWithOpenAI } from "./providers/openai";

export type EventRewriterInput = {
  sourceName: string;
  sourceUrl: string;
  rawTitle: string;
  rawSummary: string | null;
  rawLocation: string | null;
  startsAt: Date;
  endsAt: Date | null;
};

const eventOutputSchema = z.object({
  title: z.string().trim().min(4).max(180),
  description: z.string().trim().min(40).max(800),
  location: z.string().trim().min(2).max(200),
  slug: z.string().trim().min(3).max(80).optional(),
  confidence: z.number().min(0).max(1).optional(),
});

const SYSTEM_PROMPT = `Es um editor profissional do portal regional "O Portal do Algarve".
Reescreves entradas de agenda (eventos) em portugues europeu (PT-PT), curtas e claras.

REGRAS OBRIGATORIAS:
1. NUNCA copies frases do texto original. Reescreve com palavras tuas.
2. Mantem-te 100% fiel aos factos: nome do evento, data, local, organizador.
3. NAO inventes informacao que nao esteja no original.
4. A descricao deve ter 2-3 frases curtas, jornalisticas e neutras.
5. O local deve ser conciso (cidade ou recinto + cidade).
6. NAO uses markdown.

Devolves SEMPRE um objeto JSON valido:
{
  "title": "string",
  "description": "string",
  "location": "string",
  "slug": "string opcional",
  "confidence": 0.0 a 1.0
}`;

function buildUserPrompt(input: EventRewriterInput): string {
  return `Reescreve este evento para a agenda do portal:
Fonte: ${input.sourceName}
URL: ${input.sourceUrl}
Inicio: ${input.startsAt.toISOString()}
${input.endsAt ? `Fim: ${input.endsAt.toISOString()}\n` : ""}
Titulo original: ${input.rawTitle}
Local original: ${input.rawLocation ?? "(nao especificado)"}
Descricao original: ${input.rawSummary ?? "(nao disponivel)"}

Devolve apenas o objeto JSON.`;
}

export async function rewriteEvent(input: EventRewriterInput): Promise<RewrittenEvent> {
  const provider = env.AI_PROVIDER;
  const userPrompt = buildUserPrompt(input);

  let raw: unknown;
  try {
    raw =
      provider === "openai"
        ? await rewriteWithOpenAI({ system: SYSTEM_PROMPT, user: userPrompt })
        : await rewriteWithAnthropic({ system: SYSTEM_PROMPT, user: userPrompt });
  } catch (error) {
    throw new RewriterError(
      `Provider ${provider} falhou (evento): ${(error as Error).message}`,
      "provider_error"
    );
  }

  const parsed = eventOutputSchema.safeParse(raw);
  if (!parsed.success) {
    throw new RewriterError(
      `Resposta da IA invalida (evento): ${parsed.error.issues.map((i) => i.message).join(", ")}`,
      "schema_error"
    );
  }

  const slug = parsed.data.slug?.trim()
    ? slugifyNewsTitle(parsed.data.slug)
    : slugifyNewsTitle(parsed.data.title);

  return {
    title: parsed.data.title,
    description: parsed.data.description,
    location: parsed.data.location,
    slug,
    confidence: parsed.data.confidence ?? 0.6,
  };
}
