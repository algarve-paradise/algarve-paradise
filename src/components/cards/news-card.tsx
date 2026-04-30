"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { TiltCard } from "@/components/shared/tilt-card";
import { formatNewsCategory } from "@/lib/news-shared";
import { cn } from "@/lib/utils";
import type { NewsItem } from "@/types/content";

type NewsCardProps = {
  item: NewsItem;
  featured?: boolean;
  anchorId?: string;
  variant?: "default" | "compact" | "row";
};

export function NewsCard({ item, featured = false, anchorId, variant = "default" }: NewsCardProps) {
  if (variant === "row") {
    return <NewsRowCard item={item} anchorId={anchorId} />;
  }

  return (
    <TiltCard
      as={Link}
      href={item.href}
      id={anchorId}
      intensity={featured ? 3 : 4}
      className={cn(
        "group flex flex-col",
        featured ? "rounded-[2rem] p-3 sm:p-4" : "rounded-[1.5rem] p-3",
        anchorId && "scroll-mt-32",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-[1.4rem] bg-muted",
          featured ? "aspect-[16/10] sm:aspect-[16/9]" : "aspect-[4/3]",
        )}
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes={featured ? "(max-width: 1024px) 100vw, 60vw" : "(max-width: 768px) 100vw, 33vw"}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover/tilt:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-grid opacity-50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="pill pill-glass text-foreground">{formatNewsCategory(item.category)}</span>
          {item.featured ? <span className="pill pill-accent">Destaque</span> : null}
        </div>

        <div className="absolute right-3 top-3 opacity-0 -translate-y-1 transition-all duration-500 group-hover/tilt:opacity-100 group-hover/tilt:translate-y-0">
          <span className="surface-acrylic-dark flex size-9 items-center justify-center rounded-full text-white">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>

      <div className={cn("relative space-y-3 px-2 pt-5 pb-3 sm:pb-4", featured && "sm:px-4 sm:pt-6")}>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          <span>{new Date(item.date).toLocaleDateString("pt-PT")}</span>
          {item.region ? (
            <>
              <span className="size-1 rounded-full bg-foreground/30" />
              <span>{item.region}</span>
            </>
          ) : null}
        </div>
        <h3
          className={cn(
            "font-heading leading-[1.12] tracking-tight text-foreground transition-colors group-hover/tilt:text-foreground",
            featured ? "text-2xl sm:text-3xl lg:text-[2rem]" : "text-lg sm:text-xl",
          )}
        >
          {item.title}
        </h3>
        <p
          className={cn(
            "text-sm leading-relaxed text-muted-foreground",
            featured ? "line-clamp-3" : "line-clamp-2",
          )}
        >
          {item.excerpt}
        </p>

        <div className="flex items-center gap-3 pt-2">
          <span className="size-7 rounded-full bg-muted ring-1 ring-foreground/10" />
          <div className="text-[11px] leading-tight">
            <div className="font-semibold text-foreground">
              {item.authorName ?? "Redação Algarve"}
            </div>
            <div className="text-muted-foreground">
              {item.sourceName ?? "Algarve Paradise"}
            </div>
          </div>
          <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-foreground link-tech">
            Ler
          </span>
        </div>
      </div>
    </TiltCard>
  );
}

function NewsRowCard({ item, anchorId }: { item: NewsItem; anchorId?: string }) {
  return (
    <Link
      id={anchorId}
      href={item.href}
      className={cn(
        "group flex items-center gap-4 rounded-2xl p-2 pr-4 transition-all duration-300",
        "hover:bg-white/70 hover:shadow-[0_10px_30px_-12px_rgba(10,10,10,0.18)]",
        anchorId && "scroll-mt-32",
      )}
    >
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="80px"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : null}
      </div>
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          <span>{formatNewsCategory(item.category)}</span>
          <span className="size-1 rounded-full bg-foreground/30" />
          <span>{new Date(item.date).toLocaleDateString("pt-PT")}</span>
        </div>
        <h3 className="font-heading text-[15px] leading-snug font-medium text-foreground line-clamp-2">
          {item.title}
        </h3>
      </div>
      <ArrowUpRight className="size-4 shrink-0 text-foreground/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
    </Link>
  );
}
