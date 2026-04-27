import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { homeHero, homePillars } from "@/data/home";
import { getPublishedNews } from "@/lib/news";

export async function HomeHeroSection() {
  const newsItems = await getPublishedNews();
  const featuredNews = newsItems.find((i) => i.featured) ?? newsItems[0] ?? null;
  const bottomNews = newsItems.slice(0, 4);

  return (
    <Reveal as="section" className="relative overflow-hidden py-8 sm:py-12">
      <Container className="space-y-12">
        {/* Top Grid */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">

          {/* Editorial intro (Left) */}
          <div className="space-y-4 border-b lg:border-b-0 lg:border-r border-border pb-8 lg:pb-0 lg:pr-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {homeHero.eyebrow}
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.1] font-medium tracking-tight text-foreground">
              {homeHero.title}
            </h1>
            <div className="flex gap-4">
              <p className="text-sm leading-relaxed text-muted-foreground w-1/2">
                {homeHero.description}
              </p>
              <p className="font-heading text-lg italic leading-tight text-foreground w-1/2 border-l border-border pl-4">
                &ldquo;{homeHero.highlight}&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <div className="size-8 rounded-full bg-muted border border-border" />
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Por <span className="font-bold text-foreground">REDAÇÃO ALGARVE</span>
              </div>
            </div>
          </div>

          {/* Featured news (Right) – dark card */}
          {featuredNews ? (
            <Link
              href={featuredNews.href}
              className="bg-[#111111] text-white p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group min-h-[280px]"
            >
              {featuredNews.imageUrl ? (
                <Image
                  src={featuredNews.imageUrl}
                  alt={featuredNews.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="absolute inset-0 h-full w-full object-cover opacity-30 group-hover:opacity-45 transition-opacity duration-500"
                />
              ) : null}
              <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="relative z-10 space-y-4 max-w-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                  {featuredNews.category}
                </p>
                <h2 className="font-heading text-3xl sm:text-4xl leading-[1.1] font-medium tracking-tight">
                  {featuredNews.title}
                </h2>
                <p className="text-sm leading-relaxed text-white/80 line-clamp-3">
                  {featuredNews.excerpt}
                </p>
              </div>
              <div className="relative z-10 flex items-center gap-3 mt-8">
                <div className="size-8 rounded-full bg-white/20" />
                <div className="text-[10px] uppercase tracking-widest text-white/70">
                  Por{" "}
                  <span className="font-bold text-white">
                    {featuredNews.authorName
                      ? featuredNews.authorName.toUpperCase()
                      : "REDAÇÃO ALGARVE"}
                  </span>
                  <br />
                  <span className="font-normal opacity-80">
                    {new Date(featuredNews.date).toLocaleDateString("pt-PT", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="bg-[#111111] text-white p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group min-h-[280px]">
              <div className="absolute inset-0 z-0 bg-gradient-to-t from-black to-transparent" />
              <div className="relative z-10 space-y-4 max-w-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                  ALGARVE
                </p>
                <h2 className="font-heading text-3xl sm:text-4xl leading-[1.1] font-medium tracking-tight">
                  O portal digital do sul do País
                </h2>
                <p className="text-sm leading-relaxed text-white/80">
                  Informação, eventos e comunidade reunidos numa só plataforma regional.
                </p>
              </div>
              <div className="relative z-10 flex items-center gap-3 mt-12">
                <div className="size-8 rounded-full bg-white/20" />
                <div className="text-[10px] uppercase tracking-widest text-white/70">
                  Por <span className="font-bold text-white">REDAÇÃO ALGARVE</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Row – latest news or static pillars */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 border-t border-b border-border py-6">
          {bottomNews.length > 0
            ? bottomNews.map((item) => (
                <Link key={item.slug} href={item.href} className="flex gap-4 group">
                  <div className="size-16 shrink-0 relative overflow-hidden bg-muted border border-border">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="64px"
                        className="object-cover grayscale group-hover:grayscale-0 transition-all"
                      />
                    ) : null}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {item.category}
                    </p>
                    <h3 className="font-heading text-base leading-snug font-medium text-foreground group-hover:underline decoration-foreground/30 underline-offset-2 line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))
            : homePillars.map((item) => (
                <div key={item.title} className="flex gap-4 group cursor-pointer">
                  <div className="size-16 shrink-0 bg-muted border border-border" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {item.tag}
                    </p>
                    <h3 className="font-heading text-base leading-snug font-medium text-foreground group-hover:underline decoration-foreground/30 underline-offset-2">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
        </div>
      </Container>
    </Reveal>
  );
}
