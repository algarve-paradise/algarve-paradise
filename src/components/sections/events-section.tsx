import { ArrowRight, CalendarDays } from "lucide-react";

import { Container } from "@/components/layout/container";
import { EventCard } from "@/components/cards/event-card";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { events } from "@/data/events";
import { siteRoutes } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button-link";

export function EventsSection() {
  const [firstEvent, ...otherEvents] = events;

  return (
    <Reveal as="section" className="py-14 sm:py-18">
      <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Proximos eventos"
            title="Agenda regional preparada para cultura, territorio e comunidade"
            description="A Home apresenta os proximos eventos com datas claras, ritmo visual editorial e ligacao direta para a agenda completa."
            action={{ label: "Ver todos os eventos", href: siteRoutes.events }}
          />

          <div className="rounded-[2rem] border border-slate-200/80 bg-slate-50/80 p-5 shadow-[0_16px_40px_rgba(7,32,67,0.06)]">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[var(--color-brand-700)]">
              <CalendarDays className="size-4" />
              Lista rapida
            </div>
            <div className="mt-4 grid gap-4">
              {events.map((item) => (
                <div
                  key={item.slug}
                  className="flex items-start justify-between gap-4 rounded-[1.5rem] border border-white bg-white px-4 py-4"
                >
                  <div>
                    <div className="font-heading text-lg text-foreground">{item.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{item.location}</div>
                  </div>
                  <div className="shrink-0 rounded-full bg-[var(--color-brand-50)] px-3 py-1 text-sm font-medium text-[var(--color-brand-700)]">
                    {item.date}
                  </div>
                </div>
              ))}
            </div>
            <ButtonLink href={siteRoutes.events} variant="outline" className="mt-5 w-fit rounded-full">
              Ver agenda completa
              <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </div>
        <StaggerGroup className="grid gap-6 md:grid-cols-2">
          <StaggerItem>
            <EventCard item={firstEvent} />
          </StaggerItem>
          <StaggerItem>
            <div className="grid gap-6">
              {otherEvents.map((item) => (
                <EventCard key={item.slug} item={item} />
              ))}
            </div>
          </StaggerItem>
        </StaggerGroup>
      </Container>
    </Reveal>
  );
}
