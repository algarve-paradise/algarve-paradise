import Link from "next/link";

import { Container } from "@/components/layout/container";
import { NewsCard } from "@/components/cards/news-card";
import { Reveal } from "@/components/shared/reveal";
import { newsItems } from "@/data/news";
import { siteRoutes } from "@/lib/site";

export function NewsHighlightsSection() {
  const featured = newsItems.filter((item) => item.featured);
  const secondary = newsItems.filter((item) => !item.featured).slice(0, 3);

  return (
    <Reveal as="section" className="py-10 sm:py-14">
      <Container>
        {/* Section header */}
        <div className="flex items-end justify-between border-b-2 border-foreground pb-3 mb-8">
          <h2 className="font-heading text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Destaques
          </h2>
          <Link
            href={siteRoutes.news}
            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Ver todas →
          </Link>
        </div>

        {/* Main grid */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Featured - large article */}
          <div>
            <NewsCard item={featured[0]} featured />
          </div>

          {/* Sidebar - stacked articles */}
          <div className="border-l border-border pl-8 hidden lg:block">
            <div className="space-y-0">
              {featured.slice(1).map((item) => (
                <NewsCard key={item.slug} item={item} />
              ))}
            </div>
          </div>
          {/* Mobile fallback for sidebar */}
          <div className="lg:hidden space-y-0">
            {featured.slice(1).map((item) => (
              <NewsCard key={item.slug} item={item} />
            ))}
          </div>
        </div>

        {/* Secondary row */}
        <div className="grid gap-8 md:grid-cols-3 mt-8 pt-8 border-t border-border">
          {secondary.map((item) => (
            <NewsCard key={item.slug} item={item} />
          ))}
        </div>
      </Container>
    </Reveal>
  );
}
