import { Container } from "@/components/layout/container";
import { PartnerCard } from "@/components/cards/partner-card";
import { Reveal } from "@/components/shared/reveal";
import { partners } from "@/data/partners";

export function PartnersSection() {
  return (
    <Reveal as="section" className="border-t border-border py-10 sm:py-14">
      <Container>
        <div className="flex items-end justify-between border-b-2 border-foreground pb-3 mb-8">
          <h2 className="font-heading text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Parceiros Institucionais
          </h2>
        </div>

        <p className="text-sm leading-6 text-muted-foreground max-w-xl mb-8">
          O bloco institucional reforça credibilidade, proximidade com o território e espaço para logos reais numa fase seguinte.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {partners.map((item) => (
            <PartnerCard key={item.name} item={item} />
          ))}
        </div>
      </Container>
    </Reveal>
  );
}
