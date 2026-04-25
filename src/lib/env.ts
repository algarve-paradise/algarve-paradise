const requiredPublicEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://your-project.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "your-anon-key",
};

const requiredServerEnv = {
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "your-service-role-key",
  SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET ?? "news-covers",
};

// AI ingestion pipeline configuration. All optional at type level so the
// platform still boots without an AI key — the cron route validates them
// at runtime and returns 503 if not configured.
const ingestionEnv = {
  // Provider selection. "anthropic" (default) uses Claude Haiku 4.5;
  // "openai" uses GPT-4o-mini.
  AI_PROVIDER: (process.env.AI_PROVIDER ?? "anthropic") as "anthropic" | "openai",
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ?? "",
  ANTHROPIC_MODEL: process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5-20251001",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "",
  OPENAI_MODEL: process.env.OPENAI_MODEL ?? "gpt-4o-mini",

  // Cron auth: required header X-Cron-Secret on /api/cron/* routes.
  CRON_SECRET: process.env.CRON_SECRET ?? "",

  // Auto-publish window. After this many hours an AI-generated draft
  // with confidence >= AUTO_PUBLISH_MIN_CONFIDENCE will be published
  // automatically by the auto-publish cron. Set AUTO_PUBLISH_MIN_CONFIDENCE
  // to 0 to publish all drafts after the window regardless of confidence.
  AUTO_PUBLISH_AFTER_HOURS: Number(process.env.AUTO_PUBLISH_AFTER_HOURS ?? 6),
  AUTO_PUBLISH_MIN_CONFIDENCE: Number(process.env.AUTO_PUBLISH_MIN_CONFIDENCE ?? 0.75),

  // How many items per source per run, and how many sources per run.
  INGEST_MAX_ITEMS_PER_SOURCE: Number(process.env.INGEST_MAX_ITEMS_PER_SOURCE ?? 5),
  INGEST_MAX_SOURCES_PER_RUN: Number(process.env.INGEST_MAX_SOURCES_PER_RUN ?? 10),

  // Stock photo provider for AI-generated drafts.
  // "pexels" (default) or "unsplash" or "none" to disable cover lookup.
  IMAGE_PROVIDER: (process.env.IMAGE_PROVIDER ?? "pexels") as "pexels" | "unsplash" | "none",
  PEXELS_API_KEY: process.env.PEXELS_API_KEY ?? "",
  UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY ?? "",
};

export const env = {
  ...requiredPublicEnv,
  ...requiredServerEnv,
  ...ingestionEnv,
};
