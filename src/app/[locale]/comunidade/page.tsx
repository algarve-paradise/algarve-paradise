import type { Metadata } from "next";
import { HeartHandshake, MessageSquareShare } from "lucide-react";

import { MessageCard } from "@/components/cards/message-card";
import { CommunityForm } from "@/components/forms/community-form";
import { PageShell } from "@/components/shared/page-shell";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { communityMessages as fallbackMessages, communityIntro } from "@/data/community";
import { getApprovedCommunityMessages } from "@/lib/community";
import { siteRoutes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Comunidade",
  description: "Partilhe a sua voz com a comunidade do Algarve — opiniões, sugestões e testemunhos da região.",
};

export default async function CommunityPage() {
  const dbMessages = await getApprovedCommunityMessages();
  const messages = dbMessages.length > 0 ? dbMessages : fallbackMessages;

  return (
    <PageShell
      eyebrow={communityIntro.eyebrow}
      title={communityIntro.title}
      description={communityIntro.description}
      primaryCta={{ label: "Ver notícias", href: siteRoutes.news }}
      secondaryCta={{ label: "Contactos", href: siteRoutes.contact }}
    >
      <Reveal className="grid gap-8 md:grid-cols-2">
        <Card className="border border-white/10 bg-[#04162f] text-white shadow-[0_24px_60px_rgba(4,22,47,0.24)]">
          <CardContent className="space-y-4 pt-6">
            <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/10">
              <HeartHandshake className="size-5 text-white" />
            </div>
            <h2 className="font-heading text-3xl">A comunidade constrói o portal</h2>
            <p className="text-sm leading-7 text-white/74">
              A participação da comunidade é parte integrante do projeto. Esta secção acolhe
              mensagens, sugestões e testemunhos dos residentes e visitantes do Algarve.
            </p>
          </CardContent>
        </Card>
        <Card className="border border-white/10 bg-white shadow-[0_16px_40px_rgba(7,32,67,0.08)]">
          <CardContent className="space-y-4 pt-6">
            <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[var(--color-brand-50)] text-[var(--color-brand-700)]">
              <MessageSquareShare className="size-5" />
            </div>
            <h2 className="font-heading text-3xl text-foreground">Participação direta</h2>
            <p className="text-sm leading-7 text-muted-foreground">
              Envie a sua mensagem e faça parte da conversa regional. As contribuições são revistas
              pela redação antes de serem publicadas.
            </p>
          </CardContent>
        </Card>
      </Reveal>

      <Reveal className="grid gap-10 py-6 sm:py-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Vozes da comunidade"
            title="O que diz a região"
            description="Opiniões, sugestões e testemunhos partilhados por residentes e visitantes do Algarve."
          />
          <div className="grid gap-4">
            {messages.map((item) => (
              <MessageCard key={`${item.name}-${item.municipality}`} item={item} />
            ))}
          </div>
        </div>
        <CommunityForm />
      </Reveal>
    </PageShell>
  );
}
