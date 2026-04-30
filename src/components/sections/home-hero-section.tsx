import Link from "next/link";

import { Container } from "@/components/layout/container";
import { HomeHeroBanner } from "@/components/sections/home-hero-banner";
import { homeHero } from "@/data/home";
import { getHomepageNews } from "@/lib/news";
import { siteRoutes } from "@/lib/site";

export async function HomeHeroSection() {
  const newsItems = await getHomepageNews();
  const featuredNews = newsItems.find((i) => i.featured) ?? newsItems[0] ?? null;
  const tickerItems = newsItems.slice(0, 6);

  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-20">
      {/* Aurora glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-40 h-[640px] -z-10">
        <div className="absolute left-1/2 top-0 size-[700px] -translate-x-1/2 rounded-full opacity-40 bg-aurora" />
      </div>

      <Container>
        <HomeHeroBanner
          eyebrow={homeHero.eyebrow}
          title={homeHero.title}
          description={homeHero.description}
          highlight={homeHero.highlight}
          stats={homeHero.stats}
          featured={featuredNews}
          primaryCta={{ label: "Ver notícias", href: siteRoutes.news }}
          secondaryCta={{ label: "Explorar conteúdos", href: siteRoutes.events }}
        />

        {tickerItems.length > 0 ? (
          <div data-reveal className="mt-8 sm:mt-12">
            <div className="surface-acrylic flex items-center gap-3 overflow-hidden rounded-full px-4 py-2.5">
              <span className="pill pill-accent shrink-0">
                <span className="size-1.5 rounded-full bg-white animate-pulse-dot" />
                Última hora
              </span>
              <div className="flex-1 overflow-hidden whitespace-nowrap">
                <div className="inline-flex animate-marquee gap-10 pr-10">
                  {[...tickerItems, ...tickerItems].map((item, idx) => (
                    <Link
                      key={`${item.slug}-${idx}`}
                      href={item.href}
                      className="inline-flex items-center gap-3 text-[12px] text-foreground/80 hover:text-foreground transition-colors"
                    >
                      <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        {item.category}
                      </span>
                      <span className="font-medium">{item.title}</span>
                      <span className="size-1 rounded-full bg-foreground/30" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
