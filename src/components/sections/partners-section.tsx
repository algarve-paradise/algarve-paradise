import { Container } from "@/components/layout/container";
import { PartnerCard } from "@/components/cards/partner-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/shared/reveal";
import { partners } from "@/data/partners";

export function PartnersSection() {
  return (
    <Reveal as="section" className="border-y border-slate-200/80 bg-slate-50/70 py-14 sm:py-18">
      <Container className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <SectionHeading
            eyebrow="Parcerias"
            title="Em parceria com entidades que contribuem para o desenvolvimento do Algarve"
            description="O bloco institucional reforca credibilidade, proximidade com o territorio e espaco para logos reais numa fase seguinte."
          />

          <StaggerGroup className="grid gap-4 sm:grid-cols-3">
            {partners.map((item) => (
              <StaggerItem key={item.name}>
                <MediaPlaceholder
                  label={item.tier}
                  title={item.name}
                  tone="logo"
                  className="min-h-[150px] shadow-[0_16px_36px_rgba(7,32,67,0.08)]"
                />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        <StaggerGroup className="grid gap-6 md:grid-cols-3">
          {partners.map((item) => (
            <StaggerItem key={item.name}>
              <PartnerCard item={item} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </Reveal>
  );
}
