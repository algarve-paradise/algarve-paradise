"use client";

import Link from "next/link";

import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { cn } from "@/lib/utils";
import type { NewsItem } from "@/types/content";

type NewsCardProps = {
  item: NewsItem;
  featured?: boolean;
  anchorId?: string;
};

export function NewsCard({ item, featured = false, anchorId }: NewsCardProps) {
  return (
    <Link
      href={item.href}
      id={anchorId}
      className={cn(
        "group block border-b border-border pb-6 transition-colors",
        anchorId && "scroll-mt-32"
      )}
    >
      <MediaPlaceholder
        label={item.category}
        title={item.imageLabel}
        imageUrl={item.imageUrl}
        tone={featured ? "hero" : "editorial"}
        className={featured ? "min-h-[320px] mb-5" : "min-h-[200px] mb-4"}
      />
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <span>{item.category}</span>
          <span className="text-border">·</span>
          <span>{new Date(item.date).toLocaleDateString("pt-PT")}</span>
        </div>
        <h3 className={cn(
          "font-heading leading-tight font-medium text-foreground group-hover:underline decoration-foreground/30 underline-offset-2",
          featured ? "text-2xl sm:text-3xl" : "text-lg"
        )}>
          {item.title}
        </h3>
        <p className="text-sm leading-6 text-muted-foreground line-clamp-2">{item.excerpt}</p>
      </div>
    </Link>
  );
}
