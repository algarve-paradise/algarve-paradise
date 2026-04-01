"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { LiveIndicator } from "@/components/shared/live-indicator";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { NewsItem } from "@/types/content";

type NewsCardProps = {
  item: NewsItem;
  featured?: boolean;
  anchorId?: string;
};

export function NewsCard({ item, featured = false, anchorId }: NewsCardProps) {
  return (
    <Card
      id={anchorId}
      className={cn(
        "overflow-hidden border border-white/10 bg-white shadow-[0_16px_40px_rgba(7,32,67,0.08)]",
        anchorId && "scroll-mt-32"
      )}
    >
      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="contents">
        <MediaPlaceholder
          label={item.category}
          title={item.imageLabel}
          tone={featured ? "hero" : "editorial"}
          className={featured ? "min-h-[280px]" : "min-h-[220px]"}
        />
        <CardContent className="space-y-4 pt-5">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
            <span>{new Date(item.date).toLocaleDateString("pt-PT")}</span>
            {item.live ? <LiveIndicator className="px-2.5 py-0.5" /> : null}
          </div>
          <div className="space-y-3">
            <h3 className="font-heading text-xl leading-tight text-balance text-foreground">
              {item.title}
            </h3>
            <p className="text-sm leading-6 text-muted-foreground">{item.excerpt}</p>
          </div>
        </CardContent>
        <CardFooter className="justify-between border-t border-slate-200/80 bg-slate-50/70">
          <span className="text-sm font-medium text-slate-600">Ler mais</span>
          <Link
            href={item.href}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-700)] transition hover:text-[var(--color-signal)]"
          >
            Ler mais
            <ArrowUpRight className="size-4" />
          </Link>
        </CardFooter>
      </motion.div>
    </Card>
  );
}
