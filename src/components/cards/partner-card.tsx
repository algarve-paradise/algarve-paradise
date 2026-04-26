"use client";

import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import type { PartnerItem } from "@/types/content";

type PartnerCardProps = {
  item: PartnerItem;
};

export function PartnerCard({ item }: PartnerCardProps) {
  return (
    <div className="border border-border p-4 group hover:bg-muted/20 transition-colors">
      <MediaPlaceholder
        label={item.tier}
        title={item.name}
        tone="logo"
        className="min-h-[120px] mb-3"
      />
      <div className="space-y-1">
        <h3 className="font-heading text-base font-medium text-foreground">{item.name}</h3>
        <p className="text-xs leading-5 text-muted-foreground">{item.hint}</p>
      </div>
    </div>
  );
}
