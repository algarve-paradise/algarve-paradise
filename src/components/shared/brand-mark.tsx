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
    <Link href="/" className={cn("inline-flex items-center gap-2", className)}>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading text-lg font-medium tracking-tight",
            inverted ? "text-white" : "text-foreground"
          )}
        >
          {siteConfig.shortName}
        </span>
        {!compact ? (
          <span className={cn("text-[10px] uppercase tracking-widest", inverted ? "text-white/65" : "text-muted-foreground")}>
            {siteConfig.tagline}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
