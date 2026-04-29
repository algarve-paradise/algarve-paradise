import { PartnerCard } from "@/components/cards/partner-card";
import { SectionShell } from "@/components/shared/section-shell";
import { partners } from "@/data/partners";

export function PartnersSection() {
  return (
    <SectionShell
      eyebrow="Parceiros institucionais"
      title={
        <>
          Construído com quem <em className="not-italic text-[var(--dt-color-accent)]">acredita</em> no território
        </>
      }
      description="O bloco institucional reforça credibilidade, proximidade com a região e abre espaço para os parceiros que tornam o projeto possível."
      withDivider={false}
    >
      <div data-reveal-grid className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((item) => (
          <PartnerCard key={item.name} item={item} />
        ))}
      </div>
    </SectionShell>
  );
}
