import type { Metadata } from "next";
import { BadgeEuro, Landmark, ShieldCheck } from "lucide-react";

import { SupportCard } from "@/components/cards/support-card";
import { PageShell } from "@/components/shared/page-shell";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { supportIntro, supportOptions, supportReasons } from "@/data/support";
import { siteRoutes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Apoie",
  description: "Pagina de doacoes e patrocinios da Algarve Paradise Media.",
};

export default function SupportPage() {
  return (
    <PageShell
      eyebrow={supportIntro.eyebrow}
      title={supportIntro.title}
      description={supportIntro.description}
      primaryCta={{ label: "Contactar equipa", href: siteRoutes.contact }}
      secondaryCta={{ label: "Ver noticias", href: siteRoutes.news }}
    >
      <Reveal className="grid gap-8 md:grid-cols-3">
        <Card className="border border-white/10 bg-[#04162f] text-white shadow-[0_24px_60px_rgba(4,22,47,0.24)] md:col-span-2">
          <CardContent className="space-y-4 pt-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/60">
              <ShieldCheck className="size-4 text-[var(--color-signal)]" />
              Sustentacao do projeto
            </div>
            <h2 className="font-heading text-3xl">Apoio da comunidade e de parceiros com enquadramento credivel</h2>
            <p className="text-sm leading-7 text-white/74">
              Esta pagina foi desenhada para apresentar apoio financeiro e patrocinio com um tom
              institucional, claro e sem pressao comercial excessiva.
            </p>
          </CardContent>
        </Card>
        <Card className="border border-white/10 bg-white shadow-[0_16px_40px_rgba(7,32,67,0.08)]">
          <CardContent className="space-y-4 pt-6">
            <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[var(--color-brand-50)] text-[var(--color-brand-700)]">
              <BadgeEuro className="size-5" />
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              Base pronta para integrar mecanismos reais de apoio numa fase seguinte.
            </p>
            <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[var(--color-brand-50)] text-[var(--color-brand-700)]">
              <Landmark className="size-5" />
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              Estrutura adequada para apresentar patrocinadores e relacao com entidades locais.
            </p>
          </CardContent>
        </Card>
      </Reveal>

      <StaggerGroup className="grid gap-8 py-2 md:grid-cols-2">
        {supportOptions.map((item) => (
          <StaggerItem key={item.title}>
            <SupportCard item={item} />
          </StaggerItem>
        ))}
      </StaggerGroup>

      <Reveal className="space-y-6 py-6 sm:py-8">
        <SectionHeading
          eyebrow="Porque apoiar"
          title="Argumentos base para doacoes e patrocinio"
          description="Os blocos abaixo estruturam a proposta de valor institucional do projeto."
        />
        <StaggerGroup className="grid gap-8 md:grid-cols-2">
          {supportReasons.map((item) => (
            <StaggerItem key={item.title}>
              <Card className="border border-white/10 bg-white shadow-[0_16px_40px_rgba(7,32,67,0.08)]">
                <CardContent className="space-y-4 pt-6">
                  <div className="text-xs uppercase tracking-[0.24em] text-[var(--color-brand-700)]">
                    {item.tag}
                  </div>
                  <h2 className="font-heading text-2xl text-foreground">{item.title}</h2>
                  <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                  <ul className="grid gap-2 text-sm text-slate-700">
                    {item.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Reveal>
    </PageShell>
  );
}
