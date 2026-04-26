import { env } from "@/lib/env";
import { extractJsonObject, RewriterError } from "../errors";

type GeminiArgs = {
  system: string;
  user: string;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  promptFeedback?: { blockReason?: string };
};

/**
 * Google Gemini provider.
 *
 * Uses the v1beta generateContent endpoint with responseMimeType=application/json
 * so the model returns a well-formed JSON object directly.
 */
export async function rewriteWithGemini({ system, user }: GeminiArgs): Promise<unknown> {
  if (!env.GEMINI_API_KEY) {
    throw new RewriterError(
      "GEMINI_API_KEY nao definida. Configure-a ou troque o provider em /admin/configuracoes.",
      "config_error"
    );
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    env.GEMINI_MODEL
  )}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { role: "system", parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1500,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`Gemini ${response.status}: ${errorBody.slice(0, 500)}`);
  }

  const payload = (await response.json()) as GeminiResponse;

  if (payload.promptFeedback?.blockReason) {
    throw new Error(`Gemini bloqueou o pedido: ${payload.promptFeedback.blockReason}`);
  }

  const text = payload.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => part.text ?? "")
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("Gemini devolveu resposta vazia.");
  }

  return extractJsonObject(text);
}
