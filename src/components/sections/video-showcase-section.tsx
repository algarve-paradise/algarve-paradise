import { ArrowRight, Clapperboard } from "lucide-react";

import { Container } from "@/components/layout/container";
import { VideoCard } from "@/components/cards/video-card";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { videoItems } from "@/data/videos";
import { siteRoutes } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button-link";

export function VideoShowcaseSection() {
  const [featured, ...rest] = videoItems;

  return (
    <Reveal as="section" className="bg-[#04162f] py-14 text-white sm:py-18">
      <Container className="space-y-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/6 p-5 backdrop-blur sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Reportagens / Videos"
              title="Thumbnails, destaques e ritmo visual de canal digital"
              description="A secao de video reforca a linguagem media do projeto com destaque principal, cards secundarios e leitura rapida."
              className="text-white"
            />
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/66">
                <Clapperboard className="size-3.5 text-[var(--color-signal)]" />
                Formato TV
              </span>
              <ButtonLink href={siteRoutes.tv} variant="secondary" className="w-fit rounded-full">
                Ver todos os videos
                <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <VideoCard item={featured} featured />
          <StaggerGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {rest.slice(0, 3).map((item) => (
              <StaggerItem key={item.slug}>
                <VideoCard item={item} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </Container>
    </Reveal>
  );
}
