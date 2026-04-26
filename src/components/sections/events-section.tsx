import Link from "next/link";
import { CalendarDays } from "lucide-react";

import { Container } from "@/components/layout/container";
import { EventCard } from "@/components/cards/event-card";
import { Reveal } from "@/components/shared/reveal";
import { events } from "@/data/events";
import { siteRoutes } from "@/lib/site";

export function EventsSection() {
  const [firstEvent, ...otherEvents] = events;

  return (
    <Reveal as="section" className="py-10 sm:py-14 border-t border-border">
      <Container>
        <div className="flex items-end justify-between border-b-2 border-foreground pb-3 mb-8">
          <h2 className="font-heading text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Agenda & Eventos
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
              {events.map((item) => (
                <div
                  key={item.slug}
                  className="flex items-start justify-between gap-4 border-b border-border py-4"
                >
                  <div>
                    <div className="font-heading text-base font-medium text-foreground">{item.title}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{item.location}</div>
                  </div>
                  <div className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                    {item.date}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cards (right) */}
          <div className="border-l border-border pl-8 hidden lg:block">
            <div className="grid gap-6 md:grid-cols-2">
              <EventCard item={firstEvent} />
              <div className="space-y-0">
                {otherEvents.map((item) => (
                  <EventCard key={item.slug} item={item} />
                ))}
              </div>
            </div>
          </div>
          <div className="lg:hidden">
            <div className="grid gap-6 sm:grid-cols-2">
              <EventCard item={firstEvent} />
              {otherEvents.map((item) => (
                <EventCard key={item.slug} item={item} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Reveal>
  );
}
