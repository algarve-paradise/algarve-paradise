import type { NewsCategory } from "@/types/content";

export type IngestSourceType = "rss" | "sitemap" | "html" | "ical" | "api";
export type IngestContentKind = "news" | "events";

export type IngestSourceRow = {
  id: string;
  name: string;
  url: string;
  type: IngestSourceType;
  region: string;
  default_category: NewsCategory;
  enabled: boolean;
  rate_limit_seconds: number;
  last_fetched_at: string | null;
  last_error: string | null;
  content_kind: IngestContentKind;
  total_rewritten: number;
  total_rejected: number;
  total_published: number;
  total_failed: number;
};

export type IngestItemStatus =
  | "pending"
  | "rewritten"
  | "rejected"
  | "duplicate"
  | "failed";

export type IngestItemKind = "news" | "event";

export type IngestItemRow = {
  id: string;
  source_id: string | null;
  hash: string;
  raw_url: string;
  raw_title: string | null;
  raw_summary: string | null;
  raw_published_at: string | null;
  raw_payload: Record<string, unknown> | null;
  status: IngestItemStatus;
  failure_reason: string | null;
  news_post_id: string | null;
  event_id: string | null;
  kind: IngestItemKind;
  raw_starts_at: string | null;
  raw_ends_at: string | null;
  raw_location: string | null;
  created_at: string;
  processed_at: string | null;
};

/** A single normalized news item produced by a parser. */
export type RawIngestedItem = {
  url: string;
  title: string;
  summary: string | null;
  publishedAt: Date | null;
  /** Free-form payload for audit / future re-processing (RSS entry, etc.). */
  payload?: Record<string, unknown>;
};

/** A single normalized event produced by an iCal/HTML parser. */
export type RawIngestedEvent = {
  url: string;
  title: string;
  summary: string | null;
  startsAt: Date;
  endsAt: Date | null;
  location: string | null;
  payload?: Record<string, unknown>;
};

/** Output expected from the news AI rewriter. */
export type RewrittenArticle = {
  title: string;
  excerpt: string;
  content: string;
  category: NewsCategory;
  slug: string;
  confidence: number;
};

/** Output expected from the event AI rewriter. */
export type RewrittenEvent = {
  title: string;
  description: string;
  location: string;
  slug: string;
  confidence: number;
};
