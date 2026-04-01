import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { NewsCard } from "@/components/cards/news-card";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { newsItems } from "@/data/news";
import { siteRoutes } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button-link";

export function NewsHighlightsSection() {
  const featured = newsItems.filter((item) => item.featured);
  const secondary = newsItems.filter((item) => !item.featured).slice(0, 3);

  return (
    <Reveal as="section" className="py-14 sm:py-18">
      <Container className="space-y-8">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-[0_16px_40px_rgba(7,32,67,0.08)] sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Destaques"
              title="Atualidade regional com leitura editorial forte e imediata"
              description="A Home abre a cobertura noticiosa com noticias em destaque, imagem relevante e estrutura clara de portal digital."
            />
            <ButtonLink href={siteRoutes.news} className="w-fit rounded-full">
              Ver todas as noticias
              <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <NewsCard item={featured[0]} featured />
          <div className="grid gap-6">
            {featured.slice(1).map((item) => (
              <NewsCard key={item.slug} item={item} />
            ))}
          </div>
        </div>

        <StaggerGroup className="grid gap-6 md:grid-cols-3">
          {secondary.map((item) => (
            <StaggerItem key={item.slug}>
              <NewsCard item={item} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </Reveal>
  );
}
