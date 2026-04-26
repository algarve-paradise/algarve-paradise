import { ArrowRight, Mail, MessageSquareMore } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { homeClosing } from "@/data/home";

export function HomeClosingSection() {
  return (
    <Reveal
      as="section"
      className="border-t border-border py-12 sm:py-16"
    >
      <Container>
        <div className="flex items-end justify-between border-b-2 border-foreground pb-3 mb-8">
          <h2 className="font-heading text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            {homeClosing.title}
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-4">
            <p className="text-sm leading-6 text-muted-foreground">{homeClosing.description}</p>

            <div className="flex flex-wrap gap-4 mt-6">
              <Link
                href={homeClosing.primaryCta.href}
                className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-muted-foreground transition-colors"
              >
                {homeClosing.primaryCta.label}
                <ArrowRight className="size-3" />
              </Link>
              {homeClosing.secondaryCta ? (
                <Link
                  href={homeClosing.secondaryCta.href}
                  className="inline-flex items-center gap-2 border border-border px-6 py-3 text-xs font-bold uppercase tracking-widest text-foreground hover:bg-muted transition-colors"
                >
                  {homeClosing.secondaryCta.label}
                </Link>
              ) : null}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 border-l border-border pl-8 hidden lg:grid">
            <div className="space-y-3">
              <Mail className="size-5 text-foreground" />
              <h3 className="font-heading text-lg font-medium text-foreground">Contacto institucional</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                Para parcerias, patrocínio, colaborações ou ligação com entidades regionais.
              </p>
            </div>
            <div className="space-y-3">
              <MessageSquareMore className="size-5 text-foreground" />
              <h3 className="font-heading text-lg font-medium text-foreground">Participação da comunidade</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                Para mensagens, sugestões e proximidade com a atualidade e os eventos do Algarve.
              </p>
            </div>
          </div>

          {/* Mobile */}
          <div className="grid gap-6 sm:grid-cols-2 lg:hidden">
            <div className="space-y-3 border-t border-border pt-6">
              <Mail className="size-5 text-foreground" />
              <h3 className="font-heading text-lg font-medium text-foreground">Contacto institucional</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                Para parcerias, patrocínio, colaborações ou ligação com entidades regionais.
              </p>
            </div>
            <div className="space-y-3 border-t border-border pt-6">
              <MessageSquareMore className="size-5 text-foreground" />
              <h3 className="font-heading text-lg font-medium text-foreground">Participação da comunidade</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                Para mensagens, sugestões e proximidade com a atualidade e os eventos do Algarve.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Reveal>
  );
}
