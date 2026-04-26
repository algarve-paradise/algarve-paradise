/**
 * Orchestrates one ingestion run end-to-end:
 *   sources -> fetch -> parse -> dedupe -> AI rewrite -> draft news_posts
 *
 * Designed to be safe to call repeatedly: dedupe + idempotent inserts +
 * source counter bumps that feed quality_score.
 */
import { env } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { rewriteArticle } from "@/lib/ai/rewriter";
import { findCoverImage } from "@/lib/images";
import { slugifyNewsTitle } from "@/lib/news-shared";
import { getAppSettings } from "@/lib/settings";

import { politeFetch } from "./fetcher";
import { parseFeed } from "./parsers/rss";
import { parseSitemap } from "./parsers/sitemap";
import { extractArticle, articleToRawItem } from "./parsers/html";
import {
  bumpSourceCounter,
  insertNewIngestItems,
  listEnabledSources,
  markIngestItem,
  markSourceFetched,
} from "./repository";
import type { IngestItemRow, IngestSourceRow, RawIngestedItem } from "./types";

export type RunOptions = {
  region?: string | "all";
  /** Limit total items processed by AI in this run (cost guard). */
  maxItems?: number;
  /** If true, skip AI step — useful for smoke tests. */
  dryRun?: boolean;
};

export type RunReport = {
  startedAt: string;
  finishedAt: string;
  region: string;
  sourcesProcessed: number;
  newRawItems: number;
  rewrittenCount: number;
  rejectedCount: number;
  failedCount: number;
  errors: string[];
};

export async function runIngestionPipeline(options: RunOptions = {}): Promise<RunReport> {
  const startedAt = new Date();
  const region = options.region ?? "all";
  const maxItems =
    options.maxItems ?? env.INGEST_MAX_ITEMS_PER_SOURCE * env.INGEST_MAX_SOURCES_PER_RUN;

  const report: RunReport = {
    startedAt: startedAt.toISOString(),
    finishedAt: "",
    region: region,
    sourcesProcessed: 0,
    newRawItems: 0,
    rewrittenCount: 0,
    rejectedCount: 0,
    failedCount: 0,
    errors: [],
  };

  const sources = await listEnabledSources({
    region,
    contentKind: "news",
    limit: env.INGEST_MAX_SOURCES_PER_RUN,
  });

  let aiBudgetRemaining = maxItems;

  for (const source of sources) {
    if (aiBudgetRemaining <= 0) break;
    report.sourcesProcessed += 1;

    try {
      const newItems = await collectFromSource(source, options.dryRun);
      report.newRawItems += newItems.length;

      if (options.dryRun) continue;

      for (const item of newItems) {
        if (aiBudgetRemaining <= 0) break;
        aiBudgetRemaining -= 1;

        const { outcome, error: itemError } = await rewriteAndStore(source, item);
        if (outcome === "rewritten") {
          report.rewrittenCount += 1;
          await bumpSourceCounter(source.id, "rewritten");
        } else if (outcome === "rejected") {
          report.rejectedCount += 1;
          await bumpSourceCounter(source.id, "rejected");
        } else {
          report.failedCount += 1;
          await bumpSourceCounter(source.id, "failed");
          if (itemError) report.errors.push(`[${source.name}] ${itemError}`);
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

async function collectFromSource(source: IngestSourceRow, dryRun = false): Promise<IngestItemRow[]> {
  if (source.type === "rss") {
    return collectFromRss(source, dryRun);
  }
  if (source.type === "sitemap") {
    return collectFromSitemap(source, dryRun);
  }
  if (source.type === "html") {
    return collectFromSingleHtml(source, dryRun);
  }
  // Other types (ical/api) handled by their dedicated pipelines.
  if (!dryRun) await markSourceFetched(source.id, `Tipo de fonte nao suportado neste pipeline: ${source.type}`);
  return [];
}

async function collectFromRss(source: IngestSourceRow, dryRun = false): Promise<IngestItemRow[]> {
  const fetched = await politeFetch(source.url, { ifModifiedSince: source.last_fetched_at });

  if (fetched.notModified) {
    if (!dryRun) await markSourceFetched(source.id, null);
    return [];
  }
  if (!fetched.ok) {
    throw new Error(`HTTP ${fetched.status} ao obter ${source.url}`);
  }

  const items = parseFeed(fetched.body)
    .slice(0, env.INGEST_MAX_ITEMS_PER_SOURCE)
    .filter(isPlausibleItem);

  if (dryRun) return items as unknown as IngestItemRow[];

  const inserted = await insertNewIngestItems(source, items);
  await markSourceFetched(source.id, null);
  return inserted;
}

async function collectFromSitemap(source: IngestSourceRow, dryRun = false): Promise<IngestItemRow[]> {
  const fetched = await politeFetch(source.url, { ifModifiedSince: source.last_fetched_at });

  if (fetched.notModified) {
    if (!dryRun) await markSourceFetched(source.id, null);
    return [];
  }
  if (!fetched.ok) {
    throw new Error(`HTTP ${fetched.status} ao obter sitemap ${source.url}`);
  }

  const entries = parseSitemap(fetched.body).slice(0, env.INGEST_MAX_ITEMS_PER_SOURCE);
  const items: RawIngestedItem[] = [];

  for (const entry of entries) {
    try {
      const page = await politeFetch(entry.url, { timeoutMs: 12_000 });
      if (!page.ok) continue;
      const extracted = extractArticle(page.body);
      if (!extracted) continue;
      const item = articleToRawItem(entry.url, extracted, entry.lastmod);
      if (isPlausibleItem(item)) items.push(item);
    } catch {
      // Skip a single page failure but continue with the others.
    }
  }

  if (dryRun) return items as unknown as IngestItemRow[];

  const inserted = await insertNewIngestItems(source, items);
  await markSourceFetched(source.id, null);
  return inserted;
}

async function collectFromSingleHtml(source: IngestSourceRow, dryRun = false): Promise<IngestItemRow[]> {
  const fetched = await politeFetch(source.url, { ifModifiedSince: source.last_fetched_at });

  if (fetched.notModified) {
    if (!dryRun) await markSourceFetched(source.id, null);
    return [];
  }
  if (!fetched.ok) {
    throw new Error(`HTTP ${fetched.status} ao obter ${source.url}`);
  }

  const extracted = extractArticle(fetched.body);
  if (!extracted) {
    if (!dryRun) await markSourceFetched(source.id, "Nao foi possivel extrair artigo do HTML.");
    return [];
  }

  const item = articleToRawItem(source.url, extracted, null);
  if (dryRun) return isPlausibleItem(item) ? [item] as unknown as IngestItemRow[] : [];

  const inserted = isPlausibleItem(item) ? await insertNewIngestItems(source, [item]) : [];
  await markSourceFetched(source.id, null);
  return inserted;
}

function isPlausibleItem(item: RawIngestedItem): boolean {
  if (!item.url || !item.title) return false;
  if (item.title.length < 10) return false;

  if (item.publishedAt) {
    const ageMs = Date.now() - item.publishedAt.getTime();
    if (ageMs > 30 * 24 * 3600 * 1000) return false;
    if (ageMs < -3600 * 1000) return false;
  }

  return true;
}

type RewriteResult = { outcome: "rewritten" | "rejected" | "failed"; error?: string };

async function rewriteAndStore(
  source: IngestSourceRow,
  item: IngestItemRow
): Promise<RewriteResult> {
  try {
    const rewritten = await rewriteArticle({
      sourceName: source.name,
      sourceUrl: item.raw_url,
      rawTitle: item.raw_title ?? "",
      rawSummary: item.raw_summary,
      defaultCategory: source.default_category,
      publishedAt: item.raw_published_at ? new Date(item.raw_published_at) : null,
    });

    // The AI itself decides if a stock cover is appropriate. Skipping the
    // lookup saves an API call and avoids attaching a misleading photo to
    // institutional / administrative items.
    const cover = rewritten.needsImage
      ? await findCoverImage(rewritten.imageQuery ?? rewritten.title)
      : null;
    const settings = await getAppSettings();

    const supabase = createSupabaseAdminClient();
    const reviewDeadline = new Date(
      Date.now() + settings.autoPublishAfterHours * 3600 * 1000
    );

    const slug = await ensureUniqueSlug(rewritten.slug || slugifyNewsTitle(rewritten.title), "news_posts");

    const { data, error } = await supabase
      .from("news_posts")
      .insert({
        slug,
        title: rewritten.title,
        excerpt: rewritten.excerpt,
        content: cover
          ? `${rewritten.content}\n\n${cover.credit}`
          : rewritten.content,
        category: rewritten.category,
        cover_image_url: cover?.url ?? null,
        cover_image_path: null,
        source_name: source.name,
        source_url: item.raw_url,
        featured: false,
        live: false,
        status: "draft",
        published_at: null,
        region: source.region,
        ai_generated: true,
        ai_provider: settings.aiProvider,
        ai_model: modelForProvider(settings.aiProvider),
        ai_confidence: rewritten.confidence,
        ai_review_deadline: reviewDeadline.toISOString(),
        ingest_item_id: item.id,
      })
      .select("id")
      .single();

    if (error) {
      const msg = `Insert news_posts: ${error.message}`;
      await markIngestItem(item.id, { status: "failed", failure_reason: msg });
      return { outcome: "failed", error: msg };
    }

    await markIngestItem(item.id, { status: "rewritten", news_post_id: data.id });
    return { outcome: "rewritten" };
  } catch (error) {
    const msg = (error as Error).message.slice(0, 500);
    await markIngestItem(item.id, { status: "failed", failure_reason: msg });
    return { outcome: "failed", error: msg };
  }
}

function modelForProvider(provider: "anthropic" | "openai" | "gemini"): string {
  if (provider === "openai") return env.OPENAI_MODEL;
  if (provider === "gemini") return env.GEMINI_MODEL;
  return env.ANTHROPIC_MODEL;
}

export async function ensureUniqueSlug(base: string, table: "news_posts" | "events"): Promise<string> {
  const supabase = createSupabaseAdminClient();
  let candidate = base;
  let suffix = 2;

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const { data } = await supabase.from(table).select("id").eq("slug", candidate).maybeSingle();
    if (!data) return candidate;
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return `${base}-${Date.now().toString(36)}`;
}
