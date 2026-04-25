/**
 * Lightweight HTML article extractor.
 *
 * Strategy: prefer JSON-LD (NewsArticle / Article) → OpenGraph meta →
 * <article> tag → first long <p> sequence. We intentionally avoid pulling
 * cheerio/@mozilla/readability into the runtime bundle — those are heavy
 * deps and the AI rewriter only needs a clean title + 1-2 paragraphs to
 * work, not perfect article body extraction.
 *
 * If a portal turns out to need full readability extraction (paywalls,
 * lazy-loaded content), add cheerio + @mozilla/readability to package.json
 * and replace this implementation.
 */
import type { RawIngestedItem } from "../types";

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code: string) =>
      String.fromCharCode(parseInt(code, 16))
    );
}

function stripTags(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pickMeta(html: string, attrName: string, attrValue: string): string | null {
  const re = new RegExp(
    `<meta[^>]+${attrName}=["']${attrValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*content=["']([^"']+)["']`,
    "i"
  );
  const direct = html.match(re);
  if (direct) return decodeEntities(direct[1]);

  const reverse = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]*${attrName}=["']${attrValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`,
    "i"
  );
  const flip = html.match(reverse);
  return flip ? decodeEntities(flip[1]) : null;
}

function pickJsonLd(html: string): { title?: string; description?: string; date?: string } | null {
  const blocks =
    html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) ?? [];
  for (const block of blocks) {
    const inner = block.replace(/^[\s\S]*?>/, "").replace(/<\/script>$/, "");
    try {
      const data = JSON.parse(inner) as
        | Record<string, unknown>
        | Record<string, unknown>[];
      const candidates = Array.isArray(data) ? data : [data];
      for (const candidate of candidates) {
        const type = candidate["@type"];
        const types = Array.isArray(type) ? type : [type];
        if (
          types.some(
            (t) => typeof t === "string" && /Article|NewsArticle|BlogPosting/i.test(t)
          )
        ) {
          return {
            title: typeof candidate.headline === "string" ? candidate.headline : undefined,
            description:
              typeof candidate.description === "string" ? candidate.description : undefined,
            date:
              typeof candidate.datePublished === "string"
                ? candidate.datePublished
                : undefined,
          };
        }
      }
    } catch {
      // Ignore malformed JSON-LD blocks.
    }
  }
  return null;
}

function extractMainBody(html: string): string | null {
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  const candidate = articleMatch ? articleMatch[1] : html;
  const paragraphs = candidate.match(/<p[^>]*>[\s\S]*?<\/p>/gi) ?? [];
  if (!paragraphs.length) return null;

  const text = paragraphs
    .map((p) => stripTags(p))
    .filter((p) => p.length > 60)
    .slice(0, 6)
    .join("\n\n");

  return text || null;
}

export type ExtractedArticle = {
  title: string;
  summary: string | null;
  publishedAt: Date | null;
};

export function extractArticle(html: string): ExtractedArticle | null {
  const jsonLd = pickJsonLd(html);

  const title =
    jsonLd?.title ??
    pickMeta(html, "property", "og:title") ??
    pickMeta(html, "name", "twitter:title") ??
    (html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "").trim();

  if (!title) return null;

  const description =
    jsonLd?.description ??
    pickMeta(html, "property", "og:description") ??
    pickMeta(html, "name", "description") ??
    extractMainBody(html);

  const publishedRaw =
    jsonLd?.date ??
    pickMeta(html, "property", "article:published_time") ??
    pickMeta(html, "name", "pubdate");

  const publishedAt = publishedRaw ? new Date(publishedRaw) : null;

  return {
    title: decodeEntities(title.trim()),
    summary: description ? stripTags(description).slice(0, 2000) : null,
    publishedAt: publishedAt && !Number.isNaN(publishedAt.getTime()) ? publishedAt : null,
  };
}

/** Convert sitemap entries + their HTML pages into RawIngestedItems. */
export function articleToRawItem(
  url: string,
  extracted: ExtractedArticle,
  fallbackPublishedAt: Date | null
): RawIngestedItem {
  return {
    url,
    title: extracted.title,
    summary: extracted.summary,
    publishedAt: extracted.publishedAt ?? fallbackPublishedAt,
    payload: { source: "html" },
  };
}
