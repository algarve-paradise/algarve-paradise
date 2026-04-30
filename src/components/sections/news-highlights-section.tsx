import { NewsCard } from "@/components/cards/news-card";
import { SectionShell } from "@/components/shared/section-shell";
import { getHomepageNews } from "@/lib/news";
import { siteRoutes } from "@/lib/site";

export async function NewsHighlightsSection() {
  const newsItems = await getHomepageNews();
  const featured = newsItems.filter((item) => item.featured);
  const featuredLead = featured[0] ?? newsItems[0];
  const sideItems = (featured.length > 1 ? featured.slice(1) : newsItems.slice(1, 5)).slice(0, 4);
  const usedSlugs = new Set([featuredLead?.slug, ...sideItems.map((i) => i.slug)].filter(Boolean));
  const secondary = newsItems.filter((item) => !usedSlugs.has(item.slug)).slice(0, 3);

  if (!newsItems.length || !featuredLead) {
    return null;
  }

  return (
    <SectionShell
      eyebrow="Destaques"
      title={
        <>
          Últimas notícias do <em className="not-italic text-[var(--dt-color-accent)]">Algarve</em>
        </>
      }
      description="Acompanhe as principais novidades da região de forma rápida, clara e acessível."
      cta={{ label: "Ver todas", href: siteRoutes.news }}
      withDivider={false}
    >
      <div data-reveal-grid className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <NewsCard item={featuredLead} featured />

        <div data-reveal-grid className="flex flex-col gap-2">
          {sideItems.map((item) => (
            <NewsCard key={item.slug} item={item} variant="row" />
          ))}
        </div>
      </div>

      {secondary.length > 0 ? (
        <div data-reveal-grid className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {secondary.map((item) => (
            <NewsCard key={item.slug} item={item} />
          ))}
        </div>
      ) : null}
    </SectionShell>
  );
}
