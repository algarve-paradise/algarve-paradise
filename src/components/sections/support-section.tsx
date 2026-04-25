import { Container } from "@/components/layout/container";
import { SupportCard } from "@/components/cards/support-card";
import { Reveal } from "@/components/shared/reveal";
import { supportOptions } from "@/data/support";
import { siteRoutes } from "@/lib/site";
import Link from "next/link";

export function SupportSection() {
  return (
    <Reveal as="section" className="py-10 sm:py-14 border-t border-border">
      <Container>
        <div className="flex items-end justify-between border-b-2 border-foreground pb-3 mb-8">
          <h2 className="font-heading text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Apoie o Projeto
          </h2>
          <Link
            href={siteRoutes.support}
            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Conhecer apoio →
          </Link>
        </div>

        <p className="text-sm leading-6 text-muted-foreground max-w-xl mb-8">
          Com o apoio da comunidade e dos seus parceiros, a plataforma ganha força para levar mais informação, mais voz e mais proximidade a toda a região.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {supportOptions.map((item) => (
            <SupportCard key={item.title} item={item} />
          ))}
        </div>
      </Container>
    </Reveal>
  );
}
