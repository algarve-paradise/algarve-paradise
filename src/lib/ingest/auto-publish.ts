/**
 * Auto-publish AI-generated drafts whose review window has elapsed
 * and whose confidence meets the configured threshold.
 *
 * Tunable via env:
 *   AUTO_PUBLISH_AFTER_HOURS      grace window (set per-row at insert time)
 *   AUTO_PUBLISH_MIN_CONFIDENCE   gate; 0 disables and publishes everything
 *
 * Runs against both `news_posts` and `events`.
 */
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAppSettings } from "@/lib/settings";
import { bumpSourceCounter } from "./repository";

export type AutoPublishReport = {
  startedAt: string;
  finishedAt: string;
  news: TablePublishReport;
  events: TablePublishReport;
};

type TablePublishReport = {
  candidates: number;
  published: number;
  skippedLowConfidence: number;
  errors: string[];
};

export async function runAutoPublish(): Promise<AutoPublishReport> {
  const startedAt = new Date();
  const settings = await getAppSettings();

  const news = await publishExpiredDrafts("news_posts", settings.autoPublishMinConfidence);
  const events = await publishExpiredDrafts("events", settings.autoPublishMinConfidence);

  return {
    startedAt: startedAt.toISOString(),
    finishedAt: new Date().toISOString(),
    news,
    events,
  };
}

async function publishExpiredDrafts(
  table: "news_posts" | "events",
  minConfidence: number
): Promise<TablePublishReport> {
  const report: TablePublishReport = {
    candidates: 0,
    published: 0,
    skippedLowConfidence: 0,
    errors: [],
  };

  const supabase = createSupabaseAdminClient();
  const { data: candidates, error } = await supabase
    .from(table)
    .select("id, ai_confidence, slug, ingest_item_id")
    .eq("ai_generated", true)
    .eq("status", "draft")
    .lte("ai_review_deadline", new Date().toISOString())
    .order("ai_review_deadline", { ascending: true })
    .limit(50);

  if (error) {
    report.errors.push(`[${table}] query: ${error.message}`);
    return report;
  }

  report.candidates = candidates?.length ?? 0;

  for (const row of candidates ?? []) {
    const confidence = Number(row.ai_confidence ?? 0);
    if (confidence < minConfidence) {
      report.skippedLowConfidence += 1;
      continue;
    }

    const { error: updateError } = await supabase
      .from(table)
      .update({ status: "published", published_at: new Date().toISOString() })
      .eq("id", row.id)
      .eq("status", "draft");

    if (updateError) {
      report.errors.push(`[${table}] publish ${row.slug}: ${updateError.message}`);
      continue;
    }

    report.published += 1;
    // Bump the source counter so quality_score reflects auto-publishes.
    if (row.ingest_item_id) {
      const { data: item } = await supabase
        .from("ingest_items")
        .select("source_id")
        .eq("id", row.ingest_item_id)
        .maybeSingle();
      await bumpSourceCounter(item?.source_id ?? null, "published");
    }
  }

  return report;
}
