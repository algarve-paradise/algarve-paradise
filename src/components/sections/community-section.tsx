import { Container } from "@/components/layout/container";
import { MessageCard } from "@/components/cards/message-card";
import { CommunityForm } from "@/components/forms/community-form";
import { Reveal } from "@/components/shared/reveal";
import { communityMessages as fallbackMessages } from "@/data/community";
import { getApprovedCommunityMessages } from "@/lib/community";

export async function CommunitySection() {
  const dbMessages = await getApprovedCommunityMessages();
  const messages = dbMessages.length > 0 ? dbMessages : fallbackMessages;

  return (
    <Reveal as="section" className="py-10 sm:py-14 border-t border-border">
      <Container>
        <div className="flex items-end justify-between border-b-2 border-foreground pb-3 mb-8">
          <h2 className="font-heading text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Vozes da Comunidade
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.55fr_0.45fr]">
          {/* Messages */}
          <div>
            <p className="text-sm leading-6 text-muted-foreground mb-6">
              Partilhe a sua opinião, sugestões ou mensagens com a comunidade do Algarve.
            </p>
            <div>
              {messages.map((item) => (
                <MessageCard key={`${item.name}-${item.municipality}`} item={item} />
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="border-l border-border pl-8 hidden lg:block">
            <CommunityForm />
          </div>
          <div className="lg:hidden">
            <CommunityForm />
          </div>
        </div>
      </Container>
    </Reveal>
  );
}
