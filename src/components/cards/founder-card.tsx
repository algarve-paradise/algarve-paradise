"use client";

import { motion } from "framer-motion";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { Card, CardContent } from "@/components/ui/card";
import type { FounderItem } from "@/types/content";

type FounderCardProps = {
  item: FounderItem;
};

export function FounderCard({ item }: FounderCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden border border-white/10 bg-white shadow-[0_16px_40px_rgba(7,32,67,0.08)]">
        <MediaPlaceholder
          label="Fundadores"
          title={item.imageLabel}
          tone="hero"
          className="min-h-[250px]"
        />
        <CardContent className="space-y-3 pt-5">
          <h3 className="font-heading text-xl text-foreground">{item.name}</h3>
          <p className="text-sm font-medium text-[var(--color-brand-700)]">{item.role}</p>
          <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
