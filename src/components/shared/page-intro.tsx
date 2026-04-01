import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";
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
    <section className={cn("space-y-8 py-10 sm:py-14", className)}>
      <div className="max-w-3xl space-y-5">
        <Badge
          variant="outline"
          className="rounded-full border-[color:var(--color-brand-200)] bg-white px-3 py-1 uppercase tracking-[0.24em] text-[var(--color-brand-700)]"
        >
          {eyebrow}
        </Badge>
        <div className="space-y-4">
          <h1 className="font-heading text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
            {title}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {description}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {primaryCta ? (
            <ButtonLink href={primaryCta.href} variant={primaryCta.variant ?? "default"}>
              {primaryCta.label}
            </ButtonLink>
          ) : null}
          {secondaryCta ? (
            <ButtonLink href={secondaryCta.href} variant={secondaryCta.variant ?? "outline"}>
              {secondaryCta.label}
            </ButtonLink>
          ) : null}
        </div>
      </div>
      {stats?.length ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[1.75rem] border border-white/10 bg-white p-5 shadow-[0_16px_40px_rgba(7,32,67,0.08)]"
            >
              <div className="font-heading text-2xl font-semibold text-[var(--color-brand-800)]">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
