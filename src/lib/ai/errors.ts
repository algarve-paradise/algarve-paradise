export class RewriterError extends Error {
  constructor(
    message: string,
    public readonly code: "provider_error" | "schema_error" | "config_error"
  ) {
    super(message);
    this.name = "RewriterError";
  }
}

/** Extract a JSON object from a possibly-noisy LLM response. */
export function extractJsonObject(text: string): unknown {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenceMatch ? fenceMatch[1].trim() : trimmed;

  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("Resposta nao contem JSON.");
  }
  const json = candidate.slice(start, end + 1);
  return JSON.parse(json);
}
