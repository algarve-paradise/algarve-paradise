import type { Metadata } from "next";
import { HeartHandshake, MessageSquareShare } from "lucide-react";

import { MessageCard } from "@/components/cards/message-card";
import { CommunityForm } from "@/components/forms/community-form";
import { PageShell } from "@/components/shared/page-shell";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { communityFeatures, communityIntro, communityMessages } from "@/data/community";
import { siteRoutes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Comunidade",
  description: "Pagina de participacao e proximidade comunitaria da Algarve Paradise Media.",
};

export default function CommunityPage() {
  return (
    <PageShell
      eyebrow={communityIntro.eyebrow}
      title={communityIntro.title}
      description={communityIntro.description}
      primaryCta={{ label: "Ver noticias", href: siteRoutes.news }}
      secondaryCta={{ label: "Contactos", href: siteRoutes.contact }}
    >
      <Reveal className="grid gap-8 md:grid-cols-2">
        <Card className="border border-white/10 bg-[#04162f] text-white shadow-[0_24px_60px_rgba(4,22,47,0.24)]">
          <CardContent className="space-y-4 pt-6">
            <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/10">
              <HeartHandshake className="size-5 text-white" />
            </div>
            <h2 className="font-heading text-3xl">Comunicacao construida em conjunto</h2>
            <p className="text-sm leading-7 text-white/74">
              A comunidade e parte integrante do projeto. O objetivo desta pagina e acolher
              mensagens, sugestoes e pequenas interacoes com um enquadramento claro e respeitoso.
            </p>
          </CardContent>
        </Card>
        <Card className="border border-white/10 bg-white shadow-[0_16px_40px_rgba(7,32,67,0.08)]">
          <CardContent className="space-y-4 pt-6">
            <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[var(--color-brand-50)] text-[var(--color-brand-700)]">
              <MessageSquareShare className="size-5" />
            </div>
            <h2 className="font-heading text-3xl text-foreground">Participacao simples</h2>
            <p className="text-sm leading-7 text-muted-foreground">
              A primeira versao privilegia um formulario direto e exemplos de interacao para
              validar hierarquia, tom e proximidade antes de futuras integracoes.
            </p>
          </CardContent>
        </Card>
      </Reveal>

      <StaggerGroup className="grid gap-8 py-2 md:grid-cols-2">
        {communityFeatures.map((item) => (
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

      <Reveal className="grid gap-10 py-6 sm:py-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Mensagens"
            title="Mockup de participacao comunitaria"
            description="Mensagens exemplo para validar o tom, o espacamento e a hierarquia da pagina."
          />
          <div className="grid gap-4">
            {communityMessages.map((item) => (
              <MessageCard key={`${item.name}-${item.municipality}`} item={item} />
            ))}
          </div>
        </div>
        <CommunityForm />
      </Reveal>
    </PageShell>
  );
}
