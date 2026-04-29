import { NewsCard } from "@/components/cards/news-card";
import { SectionShell } from "@/components/shared/section-shell";
import { getPublishedNews } from "@/lib/news";
import { siteRoutes } from "@/lib/site";

export async function NewsHighlightsSection() {
  const newsItems = await getPublishedNews();
  const featured = newsItems.filter((item) => item.featured);
  const featuredLead = featured[0] ?? newsItems[0];
  const sideItems = (featured.length > 1 ? featured.slice(1) : newsItems.slice(1, 5)).slice(0, 4);
  const secondary = newsItems
    .filter((item) => !item.featured && item.slug !== featuredLead?.slug)
    .slice(0, 3);

  if (!newsItems.length || !featuredLead) {
    return null;
  }

  return (
    <SectionShell
      eyebrow="Destaques"
      title={
        <>
          Notícias que estão a moldar o <em className="not-italic text-[var(--dt-color-accent)]">Algarve</em> agora
        </>
      }
      description="Uma curadoria editorial dos temas mais relevantes da semana, com cobertura regional e leitura clara."
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
