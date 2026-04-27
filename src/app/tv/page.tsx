import type { Metadata } from "next";
import { Clapperboard, PlayCircle } from "lucide-react";

import { VideoCard } from "@/components/cards/video-card";
import { PageShell } from "@/components/shared/page-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { videoItems as fallbackVideos } from "@/data/videos";
import { getPublishedNews } from "@/lib/news";
import { siteRoutes } from "@/lib/site";
import type { NewsItem, VideoItem } from "@/types/content";

export const metadata: Metadata = {
  title: "TV",
  description: "Reportagens, entrevistas e cobertura audiovisual do Algarve.",
};

function newsToVideoItem(news: NewsItem): VideoItem {
  return {
    slug: news.slug,
    title: news.title,
    excerpt: news.excerpt,
    duration: "Reportagem",
    category: news.category,
    href: news.href,
    imageLabel: news.title,
    imageUrl: news.imageUrl,
    featured: news.featured,
  };
}

export default async function TvPage() {
  const newsItems = await getPublishedNews();
  const videos =
    newsItems.length > 0 ? newsItems.slice(0, 9).map(newsToVideoItem) : fallbackVideos;

  const [featured, ...rest] = videos;

  return (
    <PageShell
      eyebrow="TV e Reportagens"
      title="Cobertura audiovisual do Algarve"
      description="Reportagens, entrevistas e conteúdos de proximidade sobre as histórias que moldam a região — com leitura rápida e formato editorial forte."
      primaryCta={{ label: "Ver notícias", href: siteRoutes.news }}
      secondaryCta={{ label: "Agenda de eventos", href: siteRoutes.events }}
    >
      <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <VideoCard item={featured} featured anchorId={featured.slug} />
        <Card className="border border-[#10345f] bg-[#04162f] text-white shadow-[0_24px_60px_rgba(4,22,47,0.24)]">
          <CardContent className="space-y-5 pt-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/60">
              <Clapperboard className="size-4 text-[var(--color-signal)]" />
              Canal digital
            </div>
            <h2 className="font-heading text-3xl">Reportagens e formatos de proximidade</h2>
            <p className="text-sm leading-7 text-white/74">
              Conteúdo editorial com cobertura regional real — das notícias de impacto às histórias
              de comunidade que raramente chegam aos meios nacionais.
            </p>
            <div className="grid gap-3">
              {rest.slice(0, 3).map((item) => (
                <div
                  key={item.slug}
                  className="flex items-start gap-3 rounded-[1.5rem] border border-white/10 bg-white/6 px-4 py-4"
                >
                  <PlayCircle className="mt-0.5 size-4 shrink-0 text-[var(--color-signal)]" />
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.24em] text-white/55">
                      {item.category} · {item.duration}
                    </div>
                    <div className="mt-1 font-heading text-lg">{item.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Destaque editorial"
          title="As últimas reportagens da região"
          description="Conteúdo atualizado com as histórias mais relevantes do Algarve."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {rest.slice(0, 3).map((item) => (
            <VideoCard key={item.slug} item={item} anchorId={item.slug} />
          ))}
        </div>
      </section>

      <section className="space-y-6 py-10">
        <SectionHeading
          eyebrow="Arquivo"
          title="Mais conteúdos da plataforma"
          description="Toda a cobertura editorial disponível, organizada por data de publicação."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {videos.map((item) => (
            <VideoCard key={item.slug} item={item} anchorId={item.slug} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
