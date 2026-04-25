import { env } from "@/lib/env";
import { extractJsonObject, RewriterError } from "../errors";

type AnthropicArgs = {
  system: string;
  user: string;
};

type AnthropicResponse = {
  content: Array<{ type: string; text?: string }>;
  stop_reason?: string;
  usage?: { input_tokens: number; output_tokens: number };
};

const ENDPOINT = "https://api.anthropic.com/v1/messages";

export async function rewriteWithAnthropic({ system, user }: AnthropicArgs): Promise<unknown> {
  if (!env.ANTHROPIC_API_KEY) {
    throw new RewriterError(
      "ANTHROPIC_API_KEY nao definida. Configure-a ou troque AI_PROVIDER para 'openai'.",
      "config_error"
    );
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: env.ANTHROPIC_MODEL,
      max_tokens: 1500,
      temperature: 0.4,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`Anthropic ${response.status}: ${errorBody.slice(0, 500)}`);
  }

  const payload = (await response.json()) as AnthropicResponse;
  const text = payload.content
    .filter((part) => part.type === "text")
    .map((part) => part.text ?? "")
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("Anthropic devolveu resposta vazia.");
  }

  return extractJsonObject(text);
}
