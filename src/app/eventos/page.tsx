import type { Metadata } from "next";
import { CalendarRange, MapPinned } from "lucide-react";

import { EventCard } from "@/components/cards/event-card";
import { PageShell } from "@/components/shared/page-shell";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { events as fallbackEvents } from "@/data/events";
import { getPublishedEvents } from "@/lib/events";
import { siteRoutes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Eventos",
  description: "Agenda regional de eventos da Algarve Paradise Media.",
};

export default async function EventsPage() {
  const dbEvents = await getPublishedEvents();
  const events = dbEvents.length ? dbEvents : fallbackEvents;

  return (
    <PageShell
      eyebrow="Eventos"
      title="Agenda regional com lista editorial e calendario visual"
      description="A pagina de eventos organiza atividades culturais, institucionais e comunitarias do Algarve numa base clara e expansivel."
      primaryCta={{ label: "Ver noticias", href: siteRoutes.news }}
      secondaryCta={{ label: "Comunidade", href: siteRoutes.community }}
    >
      <Reveal className="grid gap-8 md:grid-cols-2">
        <Card className="border border-white/10 bg-[#04162f] text-white shadow-[0_24px_60px_rgba(4,22,47,0.24)]">
          <CardContent className="space-y-4 pt-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/60">
              <CalendarRange className="size-4 text-[var(--color-signal)]" />
              Agenda ativa
            </div>
            <h2 className="font-heading text-3xl">Eventos regionais com leitura simples e util</h2>
            <p className="text-sm leading-7 text-white/74">
              A estrutura combina lista editorial e zona reservada para calendario visual, sem
              introduzir complexidade desnecessaria nesta primeira versao.
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
              Esta pagina ja esta pronta para evoluir para filtros por municipio, destaque por data
              e integracao futura com agendas regionais.
            </p>
          </CardContent>
        </Card>
      </Reveal>

      <Reveal className="grid gap-10 py-2 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Agenda"
            title="Lista principal de eventos"
            description="Cards preparados para integrar imagem, data, local e descricao resumida."
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
          <CardContent className="space-y-4 pt-6">
            <div className="text-xs uppercase tracking-[0.24em] text-[var(--color-brand-700)]">
              Calendario visual
            </div>
            <h2 className="font-heading text-2xl text-foreground">
              Espaco reservado para uma vista mensal numa fase seguinte
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              A pagina ja reserva uma zona clara para calendario, filtros por municipio ou destaques
              por data sem introduzir complexidade desnecessaria nesta etapa.
            </p>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 28 }, (_, index) => (
                <div
                  key={index}
                  className="grid aspect-square place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-500"
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Reveal>
    </PageShell>
  );
}
