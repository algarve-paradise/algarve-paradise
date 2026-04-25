/**
 * Static fallback registry of ingestion sources.
 *
 * In production sources are stored in the `ingest_sources` table — this file
 * is just a typed reference of what we ship by default and a way to seed
 * local dev databases without running the SQL seed manually.
 *
 * Add a new region by adding new entries with the matching `region` slug.
 * Add a new source type by extending IngestSourceType in ./types.ts and
 * registering a parser in ./parsers/index.ts.
 */
import type { NewsCategory } from "@/types/content";
import type { IngestSourceType } from "./types";

export type StaticSource = {
  name: string;
  url: string;
  type: IngestSourceType;
  region: string;
  defaultCategory: NewsCategory;
  enabled: boolean;
  rateLimitSeconds?: number;
};

export const staticSources: StaticSource[] = [
  // ---------- ALGARVE ----------
  {
    name: "Sul Informacao",
    url: "https://www.sulinformacao.pt/feed/",
    type: "rss",
    region: "algarve",
    defaultCategory: "Algarve",
    enabled: false,
    rateLimitSeconds: 300,
  },
  {
    name: "Postal do Algarve",
    url: "https://postal.pt/feed",
    type: "rss",
    region: "algarve",
    defaultCategory: "Algarve",
    enabled: false,
    rateLimitSeconds: 300,
  },
  {
    name: "Barlavento",
    url: "https://barlavento.pt/feed",
    type: "rss",
    region: "algarve",
    defaultCategory: "Algarve",
    enabled: false,
    rateLimitSeconds: 300,
  },
];

export const supportedRegions = Array.from(
  new Set(staticSources.map((source) => source.region))
);
