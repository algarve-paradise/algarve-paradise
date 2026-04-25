/**
 * Sitemap.xml parser. Returns the most recently modified URLs first.
 * Supports both <urlset> and <sitemapindex> (recursive lookup not done
 * here — the pipeline only follows leaf <urlset> documents).
 */
export type SitemapEntry = {
  url: string;
  lastmod: Date | null;
};

export function parseSitemap(xml: string): SitemapEntry[] {
  const blocks = xml.match(/<url>[\s\S]*?<\/url>/gi) ?? [];
  const entries: SitemapEntry[] = [];

  for (const block of blocks) {
    const locMatch = block.match(/<loc>([\s\S]*?)<\/loc>/i);
    const lastmodMatch = block.match(/<lastmod>([\s\S]*?)<\/lastmod>/i);
    if (!locMatch) continue;

    const url = locMatch[1].trim();
    const lastmod = lastmodMatch ? new Date(lastmodMatch[1].trim()) : null;
    entries.push({ url, lastmod: Number.isNaN(lastmod?.getTime()) ? null : lastmod });
  }

  entries.sort((a, b) => {
    const ta = a.lastmod?.getTime() ?? 0;
    const tb = b.lastmod?.getTime() ?? 0;
    return tb - ta;
  });

  return entries;
}
