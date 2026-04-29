import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

import { VideoCard } from "@/components/cards/video-card";
import { SectionShell } from "@/components/shared/section-shell";
import { videoItems as fallbackVideos } from "@/data/videos";
import { getPublishedReports } from "@/lib/news";
import { siteRoutes } from "@/lib/site";
import type { NewsItem, VideoItem } from "@/types/content";

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

export async function VideoShowcaseSection() {
  const newsItems = await getPublishedReports();
  const videos = newsItems.length > 0
    ? newsItems.slice(0, 5).map(newsToVideoItem)
    : fallbackVideos;

  const [featured, ...rest] = videos;
  if (!featured) return null;

  return (
    <SectionShell
      eyebrow="Reportagens & Vídeos"
      title={
        <>
          Histórias contadas com <em className="not-italic text-[var(--dt-color-accent)]">câmara</em> e voz
        </>
      }
      description="Reportagens em vídeo produzidas no terreno, sobre as pessoas e acontecimentos que marcam a região."
      cta={{ label: "Ver todos", href: siteRoutes.tv }}
      withDivider={false}
    >
      <div data-reveal-grid className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <VideoCard item={featured} featured />

        <div data-reveal-grid className="flex flex-col gap-3">
          {rest.slice(0, 3).map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className="group flex items-stretch gap-4 rounded-[1.4rem] border border-foreground/8 bg-white p-3 transition-all duration-300 hover:border-foreground hover:shadow-[0_18px_40px_-22px_rgba(10,10,10,0.25)]"
            >
              <div className="relative aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-xl bg-muted">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="128px"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="surface-acrylic-dark flex size-8 items-center justify-center rounded-full text-white">
                    <Play className="size-3 fill-current ml-0.5" />
                  </span>
                </div>
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
                <span className="pill pill-soft self-start">{item.category}</span>
                <h3 className="font-heading text-[15px] leading-snug font-medium text-foreground line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {item.duration}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
