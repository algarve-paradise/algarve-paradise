import { CalendarDays } from "lucide-react";
import Link from "next/link";

import { EventCard } from "@/components/cards/event-card";
import { SectionShell } from "@/components/shared/section-shell";
import { events as fallbackEvents } from "@/data/events";
import { getHomepageEvents } from "@/lib/events";
import { getPublishedEventNews } from "@/lib/news";
import { siteRoutes } from "@/lib/site";
import type { EventItem, NewsItem } from "@/types/content";

function newsItemToEvent(news: NewsItem): EventItem {
  return {
    slug: `news-${news.slug}`,
    title: news.title,
    description: news.excerpt,
    date: new Date(news.date).toLocaleDateString("pt-PT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    startsAt: news.date,
    location: news.region ?? "Algarve",
    href: news.href,
    imageLabel: news.title,
    imageUrl: news.imageUrl,
    status: news.status,
    region: news.region,
    sourceName: news.sourceName,
    sourceUrl: news.sourceUrl,
  };
}

export async function EventsSection() {
  const [dbEvents, eventNews] = await Promise.all([
    getHomepageEvents(),
    getPublishedEventNews(),
  ]);

  const convertedEventNews = eventNews.map(newsItemToEvent);
  const seen = new Set<string>();
  const allEvents: EventItem[] = [];

  for (const ev of [...dbEvents, ...convertedEventNews]) {
    if (!seen.has(ev.slug)) {
      seen.add(ev.slug);
      allEvents.push(ev);
    }
  }

  allEvents.sort((a, b) => {
    const dateA = a.startsAt ? new Date(a.startsAt).getTime() : 0;
    const dateB = b.startsAt ? new Date(b.startsAt).getTime() : 0;
    return dateA - dateB;
  });

  const displayEvents = allEvents.length > 0 ? allEvents : fallbackEvents;
  const [firstEvent, ...otherEvents] = displayEvents;
  if (!firstEvent) return null;

  return (
    <SectionShell
      eyebrow="Agenda regional"
      title={
        <>
          O que está a <em className="not-italic text-[var(--dt-color-accent)]">acontecer</em> no Algarve
        </>
      }
      description="Descubra eventos culturais, desportivos e iniciativas locais em toda a região."
      cta={{ label: "Ver agenda", href: siteRoutes.events }}
      withDivider={false}
    >
      <div data-reveal-grid className="grid gap-6 lg:grid-cols-[0.55fr_0.45fr]">
        <EventCard item={firstEvent} variant="featured" />

        <div data-reveal-grid className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="pill pill-soft">
              <CalendarDays className="size-3" />
              Próximos
            </span>
            <Link
              href={siteRoutes.events}
              className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground link-tech"
            >
              Calendário
            </Link>
          </div>
          {otherEvents.slice(0, 5).map((item) => (
            <EventCard key={item.slug} item={item} variant="row" />
          ))}
        </div>
      </div>

      {otherEvents.length > 5 ? (
        <div data-reveal-grid className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {otherEvents.slice(5, 8).map((item) => (
            <EventCard key={item.slug} item={item} />
          ))}
        </div>
      ) : null}
    </SectionShell>
  );
}
