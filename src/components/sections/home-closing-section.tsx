import { ArrowRight, Mail, MessageSquareMore } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { homeClosing } from "@/data/home";
import { ButtonLink } from "@/components/ui/button-link";

export function HomeClosingSection() {
  return (
    <Reveal
      as="section"
      className="relative overflow-hidden border-t border-white/10 bg-[linear-gradient(135deg,#04162f,#08264e_55%,#0d3a74)] py-16 text-white sm:py-20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(204,20,57,0.18),transparent_26%)]" />
      <Container className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <SectionHeading
          eyebrow={homeClosing.eyebrow}
          title={homeClosing.title}
          description={homeClosing.description}
          className="text-white"
        />

        <div className="grid gap-4">
          <div className="rounded-[2rem] border border-white/10 bg-white/8 p-6 backdrop-blur">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-white/10">
                  <Mail className="size-5 text-white" />
                </div>
                <h3 className="font-heading text-2xl">Contacto institucional</h3>
                <p className="text-sm leading-6 text-white/74">
                  Para parcerias, patrocinio, colaboracoes ou ligacao com entidades regionais.
                </p>
              </div>
              <div className="space-y-3">
                <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-white/10">
                  <MessageSquareMore className="size-5 text-white" />
                </div>
                <h3 className="font-heading text-2xl">Participacao da comunidade</h3>
                <p className="text-sm leading-6 text-white/74">
                  Para mensagens, sugestoes e proximidade com a atualidade e os eventos do Algarve.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={homeClosing.primaryCta.href} className="rounded-full bg-white text-[#052247] hover:bg-white/92">
                {homeClosing.primaryCta.label}
                <ArrowRight className="size-4" />
              </ButtonLink>
              {homeClosing.secondaryCta ? (
                <ButtonLink
                  href={homeClosing.secondaryCta.href}
                  variant="outline"
                  className="rounded-full border-white/18 bg-white/5 text-white hover:bg-white/10"
                >
                  {homeClosing.secondaryCta.label}
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </Reveal>
  );
}
