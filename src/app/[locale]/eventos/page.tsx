import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CalendarRange, MapPinned } from "lucide-react";

import { EventCard } from "@/components/cards/event-card";
import { PageShell } from "@/components/shared/page-shell";
import { EventsCalendar } from "@/components/shared/events-calendar";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { events as fallbackEvents } from "@/data/events";
import { getPublishedEvents } from "@/lib/events";
import { getPublishedEventNews } from "@/lib/news";
import { siteRoutes } from "@/lib/site";
import type { EventItem, NewsItem } from "@/types/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.events" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

function newsToEventItem(news: NewsItem): EventItem {
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
  };
}

export default async function EventsPage() {
  const t = await getTranslations("pages.events");
  const [dbEvents, eventNews] = await Promise.all([
    getPublishedEvents(),
    getPublishedEventNews(),
  ]);

  const convertedNews = eventNews.map(newsToEventItem);
  const seen = new Set<string>();
  const allEvents: EventItem[] = [];

  for (const ev of [...dbEvents, ...convertedNews]) {
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

  const events = allEvents.length > 0 ? allEvents : fallbackEvents;

  return (
    <PageShell
      eyebrow={t("title")}
      title={t("heading")}
      description={t("description")}
      primaryCta={{ label: t("seeNews"), href: siteRoutes.news }}
      secondaryCta={{ label: t("seeCommunity"), href: siteRoutes.community }}
    >
      <Reveal className="grid gap-8 md:grid-cols-2">
        <Card className="border border-white/10 bg-[#04162f] text-white shadow-[0_24px_60px_rgba(4,22,47,0.24)]">
          <CardContent className="space-y-4 pt-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/60">
              <CalendarRange className="size-4 text-[var(--color-signal)]" />
              Agenda ativa
            </div>
            <h2 className="font-heading text-3xl">Eventos regionais com cobertura editorial</h2>
            <p className="text-sm leading-7 text-white/74">
              Da cultura à gastronomia, do desporto às iniciativas institucionais — todos os eventos
              relevantes do Algarve com informação clara e atualizada.
            </p>
          </CardContent>
        </Card>
        <Card className="border border-white/10 bg-white shadow-[0_16px_40px_rgba(7,32,67,0.08)]">
          <CardContent className="space-y-4 pt-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[var(--color-brand-700)]">
              <MapPinned className="size-4" />
              Cobertura territorial
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              Eventos de todos os municípios do Algarve, organizados por data e local para facilitar
              o planeamento de residentes, visitantes e parceiros institucionais.
            </p>
          </CardContent>
        </Card>
      </Reveal>

      <Reveal className="grid gap-10 py-2 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Agenda"
            title={t("upcomingEvents")}
            description="Selecção editorial dos eventos mais relevantes para residentes, visitantes e parceiros institucionais."
          />
          <StaggerGroup className="grid gap-8 md:grid-cols-2">
            {events.map((item) => (
              <StaggerItem key={item.slug}>
                <EventCard item={item} anchorId={item.slug} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        <Card className="border border-white/10 bg-white shadow-[0_16px_40px_rgba(7,32,67,0.08)]">
          <CardContent className="pt-6">
            <div className="text-xs uppercase tracking-[0.24em] text-[var(--color-brand-700)] mb-5">
              Calendário mensal
            </div>
            <EventsCalendar events={events} />
          </CardContent>
        </Card>
      </Reveal>
    </PageShell>
  );
}
