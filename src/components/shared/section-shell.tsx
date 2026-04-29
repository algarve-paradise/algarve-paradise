import type { PropsWithChildren, ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";

type SectionShellProps = PropsWithChildren<{
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  cta?: { label: string; href: string };
  align?: "between" | "center";
  className?: string;
  innerClassName?: string;
  withDivider?: boolean;
  badge?: ReactNode;
}>;

export function SectionShell({
  eyebrow,
  title,
  description,
  cta,
  align = "between",
  className,
  innerClassName,
  withDivider = true,
  badge,
  children,
}: SectionShellProps) {
  return (
    <section className={cn("relative py-12 sm:py-20", className)}>
      <Container>
        <div
          className={cn(
            "mb-8 sm:mb-12 flex flex-col gap-6",
            align === "center" ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between"
          )}
        >
          <div
            data-reveal-children
            className={cn("max-w-2xl space-y-4", align === "center" && "mx-auto")}
          >
            {(eyebrow || badge) && (
              <div
                data-reveal-child
                className={cn("flex items-center gap-2", align === "center" && "justify-center")}
              >
                {eyebrow ? (
                  <span className="pill pill-soft">
                    <span className="relative inline-flex size-1.5 rounded-full bg-current animate-pulse-dot" />
                    {eyebrow}
                  </span>
                ) : null}
                {badge}
              </div>
            )}
            <h2
              data-reveal-child
              className="font-heading text-[1.95rem] sm:text-4xl lg:text-[2.6rem] leading-[1.05] tracking-tight text-foreground"
            >
              {title}
            </h2>
            {description ? (
              <p
                data-reveal-child
                className="text-[15px] leading-relaxed text-muted-foreground"
              >
                {description}
              </p>
            ) : null}
          </div>

          {cta ? (
            <Link
              data-reveal
              href={cta.href}
              className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-foreground/15 bg-white/60 backdrop-blur-md px-5 py-2.5 text-[12px] font-semibold text-foreground transition-all duration-300 hover:border-foreground hover:bg-foreground hover:text-background"
            >
              {cta.label}
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          ) : null}
        </div>

        {withDivider ? (
          <div
            data-reveal-line
            className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-foreground/15 to-transparent origin-left"
          />
        ) : null}

        <div className={innerClassName}>{children}</div>
      </Container>
    </section>
  );
}
