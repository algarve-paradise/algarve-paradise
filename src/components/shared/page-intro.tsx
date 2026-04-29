import { ArrowRight, Sparkles } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";
import { TiltCard } from "@/components/shared/tilt-card";
import type { CtaLink, Stat } from "@/types/content";
import { cn } from "@/lib/utils";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
  stats?: Stat[];
  className?: string;
};

export function PageIntro({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  stats,
  className,
}: PageIntroProps) {
  return (
    <section className={cn("relative py-6 sm:py-8", className)}>
      <div className="relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-[0_24px_70px_-34px_rgba(10,10,10,0.3)] sm:rounded-[2.5rem] sm:p-10 lg:p-12">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
        <div className="pointer-events-none absolute inset-x-0 -top-48 h-96 opacity-35">
          <div className="mx-auto size-[520px] rounded-full bg-aurora" />
        </div>

        <div className="relative grid gap-8 lg:grid-cols-[1fr_0.78fr] lg:items-end">
          <div className="max-w-3xl space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="rounded-full border-transparent bg-[var(--dt-color-accent-soft)] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[var(--dt-color-accent)]"
              >
                <Sparkles className="mr-1 size-3" />
                {eyebrow}
              </Badge>
              <span className="pill bg-white/70 backdrop-blur-md">Portal regional</span>
            </div>

            <div className="space-y-4">
              <h1 className="font-heading text-[2.35rem] leading-[1.03] font-semibold text-balance sm:text-5xl lg:text-[3.45rem]">
                {title}
              </h1>
              <p className="max-w-2xl text-[15px] leading-7 text-muted-foreground sm:text-lg">
                {description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {primaryCta ? (
                <ButtonLink href={primaryCta.href} variant={primaryCta.variant ?? "default"}>
                  {primaryCta.label}
                  <ArrowRight className="size-4" />
                </ButtonLink>
              ) : null}
              {secondaryCta ? (
                <ButtonLink href={secondaryCta.href} variant={secondaryCta.variant ?? "outline"}>
                  {secondaryCta.label}
                </ButtonLink>
              ) : null}
            </div>
          </div>

          <div className="relative min-h-44 overflow-hidden rounded-[1.75rem] bg-[#0A0A0A] p-5 text-white sm:p-6">
            <div className="absolute inset-0 bg-grid-dark opacity-45" />
            <div className="absolute -right-16 -top-16 size-52 rounded-full bg-[var(--dt-color-accent)]/35 blur-3xl" />
            <div className="relative flex h-full flex-col justify-between gap-8">
              <div className="surface-acrylic-dark inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                <span className="relative inline-flex size-1.5 rounded-full bg-[var(--dt-color-accent)]">
                  <span className="absolute inset-0 rounded-full bg-[var(--dt-color-accent)] animate-pulse-dot" />
                </span>
                Em atualização
              </div>
              <p className="max-w-sm font-heading text-2xl leading-tight">
                Informação, agenda e comunidade com presença editorial forte.
              </p>
            </div>
          </div>
        </div>

        {stats?.length ? (
          <div className="relative mt-8 grid gap-4 border-t border-foreground/8 pt-6 sm:grid-cols-3">
            {stats.map((stat) => (
              <TiltCard
                key={stat.label}
                intensity={3}
                traceRadius={22}
                className="rounded-[1.4rem] bg-white/78 p-5 backdrop-blur-md"
              >
                <div className="font-heading text-2xl font-semibold text-[var(--color-brand-800)]">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </TiltCard>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
