import { ArrowRight, ShieldCheck } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SupportCard } from "@/components/cards/support-card";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { supportOptions } from "@/data/support";
import { siteRoutes } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button-link";

export function SupportSection() {
  return (
    <Reveal as="section" className="bg-[#031224] py-14 text-white sm:py-18">
      <Container className="space-y-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/6 p-5 backdrop-blur sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Doacoes / Patrocinios"
              title="Este projeto e feito para o Algarve"
              description="Com o apoio da comunidade e dos seus parceiros, a plataforma ganha forca para levar mais informacao, mais voz e mais proximidade a toda a regiao."
              className="text-white"
            />
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/66">
                <ShieldCheck className="size-3.5 text-[var(--color-signal)]" />
                Apoio institucional
              </span>
              <ButtonLink href={siteRoutes.support} variant="secondary" className="w-fit rounded-full">
                Conhecer apoio
                <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          </div>
        </div>

        <StaggerGroup className="grid gap-6 md:grid-cols-2">
          {supportOptions.map((item) => (
            <StaggerItem key={item.title}>
              <SupportCard item={item} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </Reveal>
  );
}
