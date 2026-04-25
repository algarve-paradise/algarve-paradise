/**
 * Supabase data access for the ingestion pipeline.
 * Always uses the service-role client so we can bypass RLS from cron routes.
 */
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type {
  IngestContentKind,
  IngestItemKind,
  IngestItemRow,
  IngestItemStatus,
  IngestSourceRow,
  RawIngestedEvent,
  RawIngestedItem,
} from "./types";
import { itemHash } from "./dedupe";

export type SourceCounter = "rewritten" | "rejected" | "published" | "failed";

export async function listEnabledSources(opts: {
  region?: string | "all";
  contentKind?: IngestContentKind;
  limit: number;
}): Promise<IngestSourceRow[]> {
  const supabase = createSupabaseAdminClient();
  let query = supabase
    .from("ingest_source_quality")
    .select("*")
    .eq("enabled", true)
    // Best sources first; never-fetched sources go to the front.
    .order("quality_score", { ascending: false, nullsFirst: false })
    .order("last_fetched_at", { ascending: true, nullsFirst: true })
    .limit(opts.limit);

  if (opts.region && opts.region !== "all") {
    query = query.eq("region", opts.region);
  }
  if (opts.contentKind) {
    query = query.eq("content_kind", opts.contentKind);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`listEnabledSources: ${error.message}`);
  }

  return (data ?? []) as IngestSourceRow[];
}

export async function markSourceFetched(sourceId: string, error?: string | null) {
  const supabase = createSupabaseAdminClient();
  const { error: updateError } = await supabase
    .from("ingest_sources")
    .update({
      last_fetched_at: new Date().toISOString(),
      last_error: error ?? null,
    })
    .eq("id", sourceId);

  if (updateError) {
    console.error("markSourceFetched failed", updateError);
  }
}

export async function bumpSourceCounter(sourceId: string | null, field: SourceCounter) {
  if (!sourceId) return;
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.rpc("bump_source_counter", {
    p_source_id: sourceId,
    p_field: field,
  });
  if (error) {
    console.warn(`bumpSourceCounter(${field}) failed:`, error.message);
  }
}

/**
 * Insert a batch of newly discovered raw NEWS items, returning only the rows
 * that were actually new (dedupe is enforced by the unique hash index).
 */
export async function insertNewIngestItems(
  source: IngestSourceRow,
  items: RawIngestedItem[]
): Promise<IngestItemRow[]> {
  if (!items.length) return [];

  const supabase = createSupabaseAdminClient();
  const rows = items.map((item) => ({
    source_id: source.id,
    hash: itemHash({ url: item.url, title: item.title }),
    raw_url: item.url,
    raw_title: item.title,
    raw_summary: item.summary,
    raw_published_at: item.publishedAt?.toISOString() ?? null,
    raw_payload: item.payload ?? null,
    status: "pending" as IngestItemStatus,
    kind: "news" as IngestItemKind,
  }));

  const { data, error } = await supabase
    .from("ingest_items")
    .upsert(rows, { onConflict: "hash", ignoreDuplicates: true })
    .select("*");

  if (error) {
    throw new Error(`insertNewIngestItems: ${error.message}`);
  }

  return (data ?? []) as IngestItemRow[];
}

/** Insert a batch of newly discovered EVENT items. */
export async function insertNewIngestEvents(
  source: IngestSourceRow,
  events: RawIngestedEvent[]
): Promise<IngestItemRow[]> {
  if (!events.length) return [];

  const supabase = createSupabaseAdminClient();
  const rows = events.map((event) => ({
    source_id: source.id,
    hash: itemHash({ url: event.url, title: event.title }),
    raw_url: event.url,
    raw_title: event.title,
    raw_summary: event.summary,
    raw_published_at: null,
    raw_payload: event.payload ?? null,
    raw_starts_at: event.startsAt.toISOString(),
    raw_ends_at: event.endsAt?.toISOString() ?? null,
    raw_location: event.location,
    status: "pending" as IngestItemStatus,
    kind: "event" as IngestItemKind,
  }));

  const { data, error } = await supabase
    .from("ingest_items")
    .upsert(rows, { onConflict: "hash", ignoreDuplicates: true })
    .select("*");

  if (error) {
    throw new Error(`insertNewIngestEvents: ${error.message}`);
  }

  return (data ?? []) as IngestItemRow[];
}

export async function markIngestItem(
  id: string,
  patch: Partial<
    Pick<IngestItemRow, "status" | "failure_reason" | "news_post_id" | "event_id">
  >
) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("ingest_items")
    .update({
      ...patch,
      processed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("markIngestItem failed", error);
  }
}
