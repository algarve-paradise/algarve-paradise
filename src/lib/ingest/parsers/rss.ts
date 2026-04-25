/**
 * Minimal RSS 2.0 / Atom parser.
 *
 * We avoid pulling a full XML parser dep — Portuguese news portals all
 * emit well-formed RSS/Atom and we only need title, link, description and
 * pubDate from each item. If a feed turns out to be malformed in practice,
 * swap this for `fast-xml-parser` and update accordingly.
 */
import type { RawIngestedItem } from "../types";

function decodeEntities(input: string): string {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code: string) =>
      String.fromCharCode(parseInt(code, 16))
    );
}

function stripCData(value: string): string {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
}

function stripTags(value: string): string {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function pickFirst(block: string, tags: string[]): string | null {
  for (const tag of tags) {
    const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i");
    const match = block.match(re);
    if (match) {
      return decodeEntities(stripCData(match[1])).trim();
    }
  }
  return null;
}

function pickAttr(block: string, tag: string, attr: string): string | null {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?\\s${attr}="([^"]+)"`, "i");
  const match = block.match(re);
  return match ? decodeEntities(match[1]) : null;
}

function parseDate(value: string | null): Date | null {
  if (!value) return null;
  const ts = Date.parse(value);
  return Number.isNaN(ts) ? null : new Date(ts);
}

export function parseFeed(xml: string): RawIngestedItem[] {
  const items: RawIngestedItem[] = [];

  // RSS 2.0: <item>...</item>
  const itemBlocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  for (const block of itemBlocks) {
    const title = pickFirst(block, ["title"]);
    const link = pickFirst(block, ["link", "guid"]);
    const description = pickFirst(block, ["description", "content:encoded", "summary"]);
    const pubDate = pickFirst(block, ["pubDate", "dc:date", "published"]);

    if (!title || !link) continue;

    items.push({
      url: link,
      title: stripTags(title),
      summary: description ? stripTags(description).slice(0, 1500) : null,
      publishedAt: parseDate(pubDate),
      payload: { source: "rss-item", raw: block.slice(0, 4000) },
    });
  }

  // Atom: <entry>...</entry>
  const entryBlocks = xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) ?? [];
  for (const block of entryBlocks) {
    const title = pickFirst(block, ["title"]);
    // Atom uses <link href="..." />
    const link = pickAttr(block, "link", "href") ?? pickFirst(block, ["id"]);
    const description = pickFirst(block, ["summary", "content"]);
    const pubDate = pickFirst(block, ["updated", "published"]);

    if (!title || !link) continue;

    items.push({
      url: link,
      title: stripTags(title),
      summary: description ? stripTags(description).slice(0, 1500) : null,
      publishedAt: parseDate(pubDate),
      payload: { source: "atom-entry", raw: block.slice(0, 4000) },
    });
  }

  return items;
}
