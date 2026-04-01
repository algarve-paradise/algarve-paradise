import Link from "next/link";

import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  compact?: boolean;
  inverted?: boolean;
};

export function BrandMark({
  className,
  compact = false,
  inverted = false,
}: BrandMarkProps) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-3", className)}>
      <span className="grid size-11 place-items-center rounded-2xl border border-white/15 bg-[linear-gradient(135deg,rgba(0,76,153,0.95),rgba(0,34,87,0.95))] shadow-[0_20px_50px_rgba(4,31,64,0.28)]">
        <span className="relative block size-5">
          <span className="absolute inset-y-0 left-0 w-1.5 rounded-full bg-white" />
          <span className="absolute inset-y-0 right-0 w-2.5 rounded-full bg-[var(--color-signal)]" />
        </span>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading text-sm font-semibold tracking-[0.18em] uppercase",
            inverted ? "text-white" : "text-foreground"
          )}
        >
          {siteConfig.shortName}
        </span>
        {!compact ? (
          <span className={cn("text-xs", inverted ? "text-white/65" : "text-muted-foreground")}>
            {siteConfig.tagline}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
