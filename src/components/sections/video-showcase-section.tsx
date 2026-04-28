import Link from "next/link";

import { Container } from "@/components/layout/container";
import { VideoCard } from "@/components/cards/video-card";
import { Reveal } from "@/components/shared/reveal";
import { videoItems as fallbackVideos } from "@/data/videos";
import { getPublishedReports } from "@/lib/news";
import { siteRoutes } from "@/lib/site";
import type { NewsItem } from "@/types/content";
import type { VideoItem } from "@/types/content";

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

  return (
    <Reveal as="section" className="py-10 sm:py-14 border-t border-border">
      <Container>
        <div className="flex items-end justify-between border-b-2 border-foreground pb-3 mb-8">
          <h2 className="font-heading text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Reportagens &amp; Vídeos
          </h2>
          <Link
            href={siteRoutes.tv}
            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Ver todos →
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <VideoCard item={featured} featured />
          <div className="border-l border-border pl-8 hidden lg:block space-y-0">
            {rest.slice(0, 3).map((item) => (
              <VideoCard key={item.slug} item={item} />
            ))}
          </div>
          <div className="lg:hidden space-y-0">
            {rest.slice(0, 3).map((item) => (
              <VideoCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </Container>
    </Reveal>
  );
}
