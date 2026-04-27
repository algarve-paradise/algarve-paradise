import Link from "next/link";
import { CalendarDays } from "lucide-react";

import { Container } from "@/components/layout/container";
import { EventCard } from "@/components/cards/event-card";
import { Reveal } from "@/components/shared/reveal";
import { events as fallbackEvents } from "@/data/events";
import { getPublishedEvents } from "@/lib/events";
import { getPublishedEventNews } from "@/lib/news";
import { siteRoutes } from "@/lib/site";
import type { EventItem } from "@/types/content";
import type { NewsItem } from "@/types/content";

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
    getPublishedEvents(),
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

  return (
    <Reveal as="section" className="py-10 sm:py-14 border-t border-border">
      <Container>
        <div className="flex items-end justify-between border-b-2 border-foreground pb-3 mb-8">
          <h2 className="font-heading text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Agenda &amp; Eventos
          </h2>
          <Link
            href={siteRoutes.events}
            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Ver agenda →
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.45fr_0.55fr]">
          {/* Quick list (left) */}
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
              <CalendarDays className="size-3" />
              Próximos
            </div>
            <div className="space-y-0">
              {displayEvents.map((item) => (
                <Link
                  key={item.slug}
                  href={item.href}
                  className="flex items-start justify-between gap-4 border-b border-border py-4 hover:bg-muted/30 transition-colors px-1"
                >
                  <div>
                    <div className="font-heading text-base font-medium text-foreground">{item.title}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{item.location}</div>
                  </div>
                  <div className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                    {item.date}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Cards (right) */}
          <div className="border-l border-border pl-8 hidden lg:block">
            <div className="grid gap-6 md:grid-cols-2">
              <EventCard item={firstEvent} />
              <div className="space-y-0">
                {otherEvents.slice(0, 3).map((item) => (
                  <EventCard key={item.slug} item={item} />
                ))}
              </div>
            </div>
          </div>
          <div className="lg:hidden">
            <div className="grid gap-6 sm:grid-cols-2">
              <EventCard item={firstEvent} />
              {otherEvents.slice(0, 3).map((item) => (
                <EventCard key={item.slug} item={item} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Reveal>
  );
}
