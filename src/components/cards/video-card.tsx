"use client";

import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

import { TiltCard } from "@/components/shared/tilt-card";
import { cn } from "@/lib/utils";
import type { VideoItem } from "@/types/content";

type VideoCardProps = {
  item: VideoItem;
  featured?: boolean;
  anchorId?: string;
};

export function VideoCard({ item, featured = false, anchorId }: VideoCardProps) {
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
          featured ? "aspect-[16/10]" : "aspect-[4/3]",
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
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="pill pill-glass text-foreground">{item.category}</span>
          <span className="pill pill-glass text-foreground">{item.duration}</span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="surface-acrylic-dark flex size-16 items-center justify-center rounded-full text-white transition-all duration-500 group-hover/tilt:scale-110 group-hover/tilt:rotate-12">
            <Play className="size-6 fill-current ml-0.5" />
          </span>
        </div>
      </div>

      <div className={cn("relative space-y-3 px-2 pt-5 pb-3 sm:pb-4", featured && "sm:px-4 sm:pt-6")}>
        <h3
          className={cn(
            "font-heading leading-[1.12] tracking-tight text-foreground",
            featured ? "text-2xl sm:text-3xl" : "text-lg",
          )}
        >
          {item.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">{item.excerpt}</p>
        <div className="flex items-center gap-2 pt-1">
          <span className="pill pill-soft">
            <Play className="size-3" />
            Ver reportagem
          </span>
        </div>
      </div>
    </TiltCard>
  );
}
