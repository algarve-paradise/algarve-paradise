/**
 * Ingestion pipeline specialised for events. Mirrors the news pipeline but
 * targets the `events` table and uses the iCal parser.
 */
import { env } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { rewriteEvent } from "@/lib/ai/event-rewriter";
import { findCoverImage } from "@/lib/images";
import { slugifyNewsTitle } from "@/lib/news-shared";
import { getAppSettings } from "@/lib/settings";

import { politeFetch } from "./fetcher";
import { parseICal } from "./parsers/ical";
import {
  bumpSourceCounter,
  insertNewIngestEvents,
  listEnabledSources,
  markIngestItem,
  markSourceFetched,
} from "./repository";
import { ensureUniqueSlug } from "./pipeline";
import type { IngestItemRow, IngestSourceRow } from "./types";

export type EventsRunReport = {
  startedAt: string;
  finishedAt: string;
  region: string;
  sourcesProcessed: number;
  newRawItems: number;
  rewrittenCount: number;
  failedCount: number;
  errors: string[];
};

export async function runEventsPipeline(options: {
  region?: string | "all";
  dryRun?: boolean;
} = {}): Promise<EventsRunReport> {
  const startedAt = new Date();
  const region = options.region ?? "all";
  const report: EventsRunReport = {
    startedAt: startedAt.toISOString(),
    finishedAt: "",
    region,
    sourcesProcessed: 0,
    newRawItems: 0,
    rewrittenCount: 0,
    failedCount: 0,
    errors: [],
  };

  const sources = await listEnabledSources({
    region,
    contentKind: "events",
    limit: env.INGEST_MAX_SOURCES_PER_RUN,
  });

  let aiBudget = env.INGEST_MAX_ITEMS_PER_SOURCE * env.INGEST_MAX_SOURCES_PER_RUN;

  for (const source of sources) {
    if (aiBudget <= 0) break;
    report.sourcesProcessed += 1;

    try {
      const newItems = await collectEvents(source);
      report.newRawItems += newItems.length;

      if (options.dryRun) continue;

      for (const item of newItems) {
        if (aiBudget <= 0) break;
        aiBudget -= 1;

        const ok = await rewriteAndStoreEvent(source, item);
        if (ok) {
          report.rewrittenCount += 1;
          await bumpSourceCounter(source.id, "rewritten");
        } else {
          report.failedCount += 1;
          await bumpSourceCounter(source.id, "failed");
        }
      }
    } catch (error) {
      const message = (error as Error).message;
      report.errors.push(`[${source.name}] ${message}`);
      await markSourceFetched(source.id, message);
    }
  }

  report.finishedAt = new Date().toISOString();
  return report;
}

async function collectEvents(source: IngestSourceRow): Promise<IngestItemRow[]> {
  if (source.type !== "ical") {
    await markSourceFetched(source.id, `Tipo nao suportado para eventos: ${source.type}`);
    return [];
  }

  const fetched = await politeFetch(source.url, { ifModifiedSince: source.last_fetched_at });
  if (fetched.notModified) {
    await markSourceFetched(source.id, null);
    return [];
  }
  if (!fetched.ok) {
    throw new Error(`HTTP ${fetched.status} ao obter ${source.url}`);
  }

  const events = parseICal(fetched.body)
    .filter(
      (event) =>
        // Future events only, max 6 months ahead.
        event.startsAt.getTime() > Date.now() - 24 * 3600 * 1000 &&
        event.startsAt.getTime() < Date.now() + 180 * 24 * 3600 * 1000
    )
    .slice(0, env.INGEST_MAX_ITEMS_PER_SOURCE);

  const inserted = await insertNewIngestEvents(source, events);
  await markSourceFetched(source.id, null);
  return inserted;
}

async function rewriteAndStoreEvent(
  source: IngestSourceRow,
  item: IngestItemRow
): Promise<boolean> {
  if (!item.raw_starts_at) {
    await markIngestItem(item.id, {
      status: "failed",
      failure_reason: "Evento sem raw_starts_at.",
    });
    return false;
  }

  try {
    const startsAt = new Date(item.raw_starts_at);
    const endsAt = item.raw_ends_at ? new Date(item.raw_ends_at) : null;

    const rewritten = await rewriteEvent({
      sourceName: source.name,
      sourceUrl: item.raw_url,
      rawTitle: item.raw_title ?? "",
      rawSummary: item.raw_summary,
      rawLocation: item.raw_location,
      startsAt,
      endsAt,
    });

    const cover = await findCoverImage(`${rewritten.title} ${rewritten.location}`);
    const settings = await getAppSettings();
    const provider = settings.aiProvider;

    const supabase = createSupabaseAdminClient();
    const reviewDeadline = new Date(Date.now() + settings.autoPublishAfterHours * 3600 * 1000);
    const slug = await ensureUniqueSlug(rewritten.slug || slugifyNewsTitle(rewritten.title), "events");

    const description = cover
      ? `${rewritten.description}\n\n${cover.credit}`
      : rewritten.description;

    const { data, error } = await supabase
      .from("events")
      .insert({
        slug,
        title: rewritten.title,
        description,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt?.toISOString() ?? null,
        location: rewritten.location,
        category: "Eventos",
        cover_image_url: cover?.url ?? null,
        cover_image_path: null,
        source_name: source.name,
        source_url: item.raw_url,
        status: "draft",
        published_at: null,
        region: source.region,
        ai_generated: true,
        ai_provider: provider,
        ai_model: provider === "openai" ? env.OPENAI_MODEL : provider === "gemini" ? env.GEMINI_MODEL : env.ANTHROPIC_MODEL,
        ai_confidence: rewritten.confidence,
        ai_review_deadline: reviewDeadline.toISOString(),
        ingest_item_id: item.id,
      })
      .select("id")
      .single();

    if (error) {
      await markIngestItem(item.id, {
        status: "failed",
        failure_reason: `Insert events: ${error.message}`,
      });
      return false;
    }

    await markIngestItem(item.id, { status: "rewritten", event_id: data.id });
    return true;
  } catch (error) {
    await markIngestItem(item.id, {
      status: "failed",
      failure_reason: (error as Error).message.slice(0, 500),
    });
    return false;
  }
}
