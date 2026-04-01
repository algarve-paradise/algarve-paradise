import { HeartHandshake } from "lucide-react";

import { Container } from "@/components/layout/container";
import { MessageCard } from "@/components/cards/message-card";
import { CommunityForm } from "@/components/forms/community-form";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { communityMessages } from "@/data/community";
import { siteRoutes } from "@/lib/site";

export function CommunitySection() {
  return (
    <Reveal as="section" className="py-14 sm:py-18">
      <Container className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_16px_40px_rgba(7,32,67,0.08)]">
            <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[var(--color-brand-50)] text-[var(--color-brand-700)]">
              <HeartHandshake className="size-5" />
            </div>
            <SectionHeading
              eyebrow="Comunidade"
              title="A sua voz tambem faz parte do Algarve"
              description="Partilhe a sua opiniao, sugestoes ou mensagens com a comunidade. Esta secao foi pensada para reforcar proximidade sem perder clareza institucional."
              action={{ label: "Ver pagina da comunidade", href: siteRoutes.community }}
              className="mt-5"
            />
          </div>

          <StaggerGroup className="grid gap-4">
            {communityMessages.map((item) => (
              <StaggerItem key={`${item.name}-${item.municipality}`}>
                <MessageCard item={item} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
        <CommunityForm />
      </Container>
    </Reveal>
  );
}
