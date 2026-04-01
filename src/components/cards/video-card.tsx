"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { VideoItem } from "@/types/content";

type VideoCardProps = {
  item: VideoItem;
  featured?: boolean;
  anchorId?: string;
};

export function VideoCard({ item, featured = false, anchorId }: VideoCardProps) {
  return (
    <Link href={item.href} className="block">
      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
        <Card
          id={anchorId}
          className={cn(
            "overflow-hidden border border-[#0b2244] bg-[#04162f] text-white shadow-[0_24px_60px_rgba(4,22,47,0.35)]",
            anchorId && "scroll-mt-32"
          )}
        >
          <MediaPlaceholder
            label={`${item.category} · ${item.duration}`}
            title={item.imageLabel}
            tone={featured ? "hero" : "editorial"}
            className={featured ? "min-h-[300px]" : "min-h-[220px]"}
          />
          <CardContent className="space-y-3 pt-5">
            <h3 className="font-heading text-xl leading-tight text-balance">{item.title}</h3>
            <p className="text-sm leading-6 text-white/72">{item.excerpt}</p>
            <div className="inline-flex items-center gap-2 text-sm font-medium text-white">
              <Play className="size-4" />
              Ver reportagem
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
