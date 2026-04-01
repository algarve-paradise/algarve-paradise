"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";

import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { EventItem } from "@/types/content";

type EventCardProps = {
  item: EventItem;
  anchorId?: string;
};

export function EventCard({ item, anchorId }: EventCardProps) {
  return (
    <Link href={item.href} className="block">
      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
        <Card
          id={anchorId}
          className={cn(
            "overflow-hidden border border-white/10 bg-white shadow-[0_16px_40px_rgba(7,32,67,0.08)]",
            anchorId && "scroll-mt-32"
          )}
        >
          <MediaPlaceholder label={item.date} title={item.imageLabel} className="min-h-[220px]" />
          <CardContent className="space-y-4 pt-5">
            <h3 className="font-heading text-xl leading-tight text-foreground">{item.title}</h3>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="size-4 text-[var(--color-brand-700)]" />
                {item.date}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4 text-[var(--color-brand-700)]" />
                {item.location}
              </span>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
