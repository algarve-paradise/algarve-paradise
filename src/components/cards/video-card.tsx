"use client";

import Link from "next/link";
import { Play } from "lucide-react";

import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { cn } from "@/lib/utils";
import type { VideoItem } from "@/types/content";

type VideoCardProps = {
  item: VideoItem;
  featured?: boolean;
  anchorId?: string;
};

export function VideoCard({ item, featured = false, anchorId }: VideoCardProps) {
  return (
    <Link
      href={item.href}
      id={anchorId}
      className={cn(
        "group block border-b border-border pb-5 transition-colors",
        anchorId && "scroll-mt-32"
      )}
    >
      <MediaPlaceholder
        label={`${item.category} · ${item.duration}`}
        title={item.imageLabel}
        imageUrl={item.imageUrl}
        tone={featured ? "hero" : "editorial"}
        className={featured ? "min-h-[300px] mb-4" : "min-h-[180px] mb-3"}
      />
      <div className="space-y-2">
        <h3 className={cn(
          "font-heading leading-tight font-medium text-foreground group-hover:underline decoration-foreground/30 underline-offset-2",
          featured ? "text-xl sm:text-2xl" : "text-base"
        )}>
          {item.title}
        </h3>
        <p className="text-sm leading-6 text-muted-foreground line-clamp-2">{item.excerpt}</p>
        <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground">
          <Play className="size-3" />
          Ver reportagem
        </div>
      </div>
    </Link>
  );
}
