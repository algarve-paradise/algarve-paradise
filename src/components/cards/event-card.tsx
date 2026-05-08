"use client";

import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";

import { SafeImage } from "@/components/shared/safe-image";
import { TiltCard } from "@/components/shared/tilt-card";
import { cn, formatMonthShort } from "@/lib/utils";
import type { EventItem } from "@/types/content";

type EventCardProps = {
  item: EventItem;
  anchorId?: string;
  variant?: "default" | "featured" | "row";
};

export function EventCard({ item, anchorId, variant = "default" }: EventCardProps) {
  if (variant === "row") {
    return <EventRow item={item} anchorId={anchorId} />;
  }

  const isFeatured = variant === "featured";

  return (
    <TiltCard
      as={Link}
      href={item.href}
      id={anchorId}
      intensity={4}
      className={cn(
        "group flex flex-col",
        isFeatured ? "rounded-[2rem] p-3 sm:p-4" : "rounded-[1.5rem] p-3",
        anchorId && "scroll-mt-32",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-[1.4rem] bg-muted",
          isFeatured ? "aspect-[16/11]" : "aspect-[4/3]",
        )}
      >
        <SafeImage
          src={item.imageUrl}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover/tilt:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div className="absolute left-3 top-3">
          <span className="pill pill-glass text-foreground">
            <CalendarDays className="size-3" />
            {item.date}
          </span>
        </div>
      </div>

      <div className={cn("relative space-y-3 px-2 pt-5 pb-3 sm:pb-4", isFeatured && "sm:px-4")}>
        <h3
          className={cn(
            "font-heading leading-[1.12] tracking-tight text-foreground",
            isFeatured ? "text-xl sm:text-2xl" : "text-lg",
          )}
        >
          {item.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center gap-3 pt-1 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3" />
            {item.location}
          </span>
        </div>
      </div>
    </TiltCard>
  );
}

function DateBadge({ startsAt }: { startsAt: string | null }) {
  if (!startsAt) {
    return (
      <div className="flex shrink-0 flex-col items-center justify-center rounded-2xl bg-foreground text-background size-16 transition-colors duration-300 group-hover:bg-[var(--dt-color-accent)]">
        <span className="text-[10px] uppercase tracking-[0.18em] opacity-70">—</span>
        <span className="font-heading text-xl leading-none">·</span>
      </div>
    );
  }
  const d = new Date(startsAt);
  return (
    <div className="flex shrink-0 flex-col items-center justify-center rounded-2xl bg-foreground text-background size-16 transition-colors duration-300 group-hover:bg-[var(--dt-color-accent)]">
      <span className="text-[10px] uppercase tracking-[0.18em] opacity-70">
        {formatMonthShort(d)}
      </span>
      <span className="font-heading text-xl leading-none">{d.getDate()}</span>
    </div>
  );
}

function EventRow({ item, anchorId }: { item: EventItem; anchorId?: string }) {
  return (
    <Link
      id={anchorId}
      href={item.href}
      className={cn(
        "group flex items-center gap-4 rounded-2xl border border-foreground/8 bg-white/60 backdrop-blur-md p-3 transition-all duration-300",
        "hover:border-foreground hover:bg-white hover:shadow-[0_10px_30px_-12px_rgba(10,10,10,0.18)]",
        anchorId && "scroll-mt-32",
      )}
    >
      <DateBadge startsAt={item.startsAt ?? null} />

      <div className="min-w-0 flex-1 space-y-1">
        <h3 className="font-heading text-[15px] leading-snug font-medium text-foreground line-clamp-2">
          {item.title}
        </h3>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <MapPin className="size-3" />
          {item.location}
        </div>
      </div>
    </Link>
  );
}
