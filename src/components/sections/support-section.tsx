import { SupportCard } from "@/components/cards/support-card";
import { SectionShell } from "@/components/shared/section-shell";
import { supportOptions } from "@/data/support";
import { siteRoutes } from "@/lib/site";

export function SupportSection() {
  return (
    <SectionShell
      eyebrow="Apoie o projeto"
      title={
        <>
          Junte-se ao <em className="not-italic text-[var(--dt-color-accent)]">movimento</em> pelo jornalismo regional
        </>
      }
      description="Com o apoio da comunidade e dos seus parceiros, a plataforma ganha força para levar mais informação, mais voz e mais proximidade a toda a região."
      cta={{ label: "Conhecer apoio", href: siteRoutes.support }}
      withDivider={false}
    >
      <div data-reveal-grid className="grid gap-6 md:grid-cols-2">
        {supportOptions.map((item) => (
          <SupportCard key={item.title} item={item} />
        ))}
      </div>
    </SectionShell>
  );
}
