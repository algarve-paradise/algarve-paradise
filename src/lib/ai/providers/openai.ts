import { env } from "@/lib/env";
import { extractJsonObject, RewriterError } from "../errors";

type OpenAIArgs = {
  system: string;
  user: string;
};

type OpenAIResponse = {
  choices: Array<{
    message: { content: string | null };
    finish_reason: string;
  }>;
};

const ENDPOINT = "https://api.openai.com/v1/chat/completions";

export async function rewriteWithOpenAI({ system, user }: OpenAIArgs): Promise<unknown> {
  if (!env.OPENAI_API_KEY) {
    throw new RewriterError(
      "OPENAI_API_KEY nao definida. Configure-a ou troque AI_PROVIDER para 'anthropic'.",
      "config_error"
    );
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`OpenAI ${response.status}: ${errorBody.slice(0, 500)}`);
  }

  const payload = (await response.json()) as OpenAIResponse;
  const text = payload.choices[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("OpenAI devolveu resposta vazia.");
  }

  return extractJsonObject(text);
}
