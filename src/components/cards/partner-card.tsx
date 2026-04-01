"use client";

import { motion } from "framer-motion";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { Card, CardContent } from "@/components/ui/card";
import type { PartnerItem } from "@/types/content";

type PartnerCardProps = {
  item: PartnerItem;
};

export function PartnerCard({ item }: PartnerCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="border border-white/10 bg-white shadow-[0_16px_40px_rgba(7,32,67,0.08)]">
        <CardContent className="space-y-4 pt-5">
          <MediaPlaceholder
            label={item.tier}
            title={item.name}
            tone="logo"
            className="min-h-[160px]"
          />
          <div className="space-y-2">
            <h3 className="font-heading text-lg text-foreground">{item.name}</h3>
            <p className="text-sm leading-6 text-muted-foreground">{item.hint}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
