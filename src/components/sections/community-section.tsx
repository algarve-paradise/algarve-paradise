import { MessageCircle } from "lucide-react";

import { MessageCard } from "@/components/cards/message-card";
import { CommunityForm } from "@/components/forms/community-form";
import { SectionShell } from "@/components/shared/section-shell";
import { communityMessages as fallbackMessages } from "@/data/community";
import { getApprovedCommunityMessages } from "@/lib/community";

export async function CommunitySection() {
  const dbMessages = await getApprovedCommunityMessages();
  const messages = dbMessages.length > 0 ? dbMessages : fallbackMessages;

  return (
    <SectionShell
      eyebrow="Comunidade"
      title={
        <>
          Partilhe <em className="not-italic text-[var(--dt-color-accent)]">connosco</em>
        </>
      }
      description="Tem uma notícia, evento ou sugestão? A sua participação ajuda a tornar este projeto mais completo."
      withDivider={false}
    >
      <div className="grid gap-8 lg:grid-cols-[0.58fr_0.42fr] lg:gap-12">
        <div data-reveal-grid className="grid gap-4 sm:grid-cols-2 content-start">
          {messages.slice(0, 6).map((item, idx) => (
            <MessageCard key={`${item.name}-${idx}`} item={item} />
          ))}
        </div>

        <div data-reveal-clip className="relative overflow-hidden rounded-[2rem] border border-foreground/10 bg-foreground p-7 sm:p-9 text-background">
          <div className="absolute -right-20 -top-20 size-60 rounded-full bg-[var(--dt-color-accent)]/30 blur-3xl" />
          <div className="absolute inset-0 bg-grid-dark opacity-30" />
          <div className="relative space-y-5">
            <span className="pill pill-glass text-foreground">
              <MessageCircle className="size-3" />
              Partilhe a sua voz
            </span>
            <h3 className="font-heading text-3xl leading-tight">
              Envie a sua mensagem para a comunidade
            </h3>
            <p className="text-sm leading-relaxed text-white/70">
              Curta, direta e com o seu nome — depois da revisão editorial, é publicada nesta secção.
            </p>
            <div className="rounded-[1.4rem] bg-white p-5 text-foreground">
              <CommunityForm />
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
