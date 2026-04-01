import { ArrowRight, PlayCircle, Radio, Waves } from "lucide-react";

import { Container } from "@/components/layout/container";
import { LiveIndicator } from "@/components/shared/live-indicator";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/shared/reveal";
import { ButtonLink } from "@/components/ui/button-link";
import { homeEditorialLabels, homeHero, homePillars } from "@/data/home";

export function HomeHeroSection() {
  return (
    <Reveal
      as="section"
      className="relative overflow-hidden border-b border-white/10 bg-[#04162f] py-14 text-white sm:py-20 lg:py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(11,139,217,0.38),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(204,20,57,0.24),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_30%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)]" />
      <Container className="relative space-y-6">
        <div className="flex flex-wrap gap-2">
          {homeEditorialLabels.map((label) => (
            <span
              key={label}
              className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/72"
            >
              {label}
            </span>
          ))}
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-7">
            <div className="flex flex-wrap items-center gap-3">
              <LiveIndicator />
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/68">
                <Radio className="size-3.5 text-[var(--color-signal)]" />
                Edicao regional
              </span>
            </div>

            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.24em] text-white/70">{homeHero.eyebrow}</p>
              <h1 className="max-w-4xl font-heading text-4xl leading-[1.02] font-semibold text-balance sm:text-5xl lg:text-6xl xl:text-[4.5rem]">
                {homeHero.title}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-white/76 sm:text-lg">
                {homeHero.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <ButtonLink
                href={homeHero.primaryCta.href}
                className="rounded-full bg-white text-[#052247] hover:bg-white/92"
              >
                {homeHero.primaryCta.label}
                <ArrowRight className="size-4" />
              </ButtonLink>
              {homeHero.secondaryCta ? (
                <ButtonLink
                  href={homeHero.secondaryCta.href}
                  variant="outline"
                  className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  {homeHero.secondaryCta.label}
                </ButtonLink>
              ) : null}
            </div>

            <StaggerGroup className="grid gap-4 sm:grid-cols-3">
              {homeHero.stats.map((stat) => (
                <StaggerItem key={stat.label}>
                  <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-5 backdrop-blur">
                    <div className="font-heading text-2xl font-semibold">{stat.value}</div>
                    <div className="mt-1 text-sm leading-6 text-white/70">{stat.label}</div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>

          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/15 p-3 shadow-[0_40px_100px_rgba(2,20,43,0.4)] backdrop-blur">
              <div className="mb-3 flex items-center justify-between rounded-[1.25rem] border border-white/10 bg-white/8 px-4 py-3">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-white/72">
                  <span className="size-2 rounded-full bg-[var(--color-signal)] shadow-[0_0_16px_var(--color-signal)]" />
                  Sinal editorial
                </div>
                <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-white/60">
                  <Waves className="size-3.5" />
                  Algarve
                </div>
              </div>

              <MediaPlaceholder
                label="Grande plano"
                title="Placeholder premium para imagem hero do Algarve com overlay editorial e linguagem televisiva."
                tone="hero"
                className="min-h-[440px]"
              />

              <div className="mt-3 grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/7 px-4 py-4">
                  <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/55">
                    <PlayCircle className="size-4 text-[var(--color-signal)]" />
                    Cobertura regional
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/74">{homeHero.highlight}</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.03))] px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-white/55">Em foco</div>
                  <div className="mt-2 text-sm leading-6 text-white/80">
                    Praia, cidades, reportagens, eventos e comunidade com imagem forte e leitura clara.
                  </div>
                </div>
              </div>
            </div>

            <StaggerGroup className="grid gap-3 md:grid-cols-3">
              {homePillars.map((item) => (
                <StaggerItem key={item.title}>
                  <div className="rounded-[1.6rem] border border-white/10 bg-white/6 p-4 backdrop-blur">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-white/55">{item.tag}</div>
                    <h2 className="mt-2 font-heading text-lg leading-tight">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-white/68">{item.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </Container>
    </Reveal>
  );
}
