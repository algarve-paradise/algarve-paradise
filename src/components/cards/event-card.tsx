"use client";

import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";

import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { cn } from "@/lib/utils";
import type { EventItem } from "@/types/content";

type EventCardProps = {
  item: EventItem;
  anchorId?: string;
};

export function EventCard({ item, anchorId }: EventCardProps) {
  return (
    <Link
      href={item.href}
      id={anchorId}
      className={cn(
        "group block border-b border-border pb-5 transition-colors",
        anchorId && "scroll-mt-32"
      )}
    >
      <MediaPlaceholder label={item.date} title={item.imageLabel} className="min-h-[200px] mb-4" />
      <div className="space-y-2">
        <h3 className="font-heading text-lg leading-tight font-medium text-foreground group-hover:underline decoration-foreground/30 underline-offset-2">
          {item.title}
        </h3>
        <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3" />
            {item.date}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3" />
            {item.location}
          </span>
        </div>
        <p className="text-sm leading-6 text-muted-foreground line-clamp-2">{item.description}</p>
      </div>
    </Link>
  );
}
