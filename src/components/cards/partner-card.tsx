"use client";

import { Building2 } from "lucide-react";

import type { PartnerItem } from "@/types/content";

type PartnerCardProps = {
  item: PartnerItem;
};

export function PartnerCard({ item }: PartnerCardProps) {
  return (
    <div className="group flex flex-col rounded-[1.4rem] border border-foreground/8 bg-white p-5 transition-all duration-300 hover:border-foreground hover:shadow-[0_18px_40px_-22px_rgba(10,10,10,0.25)] hover:-translate-y-0.5">
      <div className="flex aspect-[3/2] items-center justify-center rounded-[1rem] border border-dashed border-foreground/15 bg-[var(--dt-color-bg)] transition-colors duration-300 group-hover:bg-foreground/5">
        <Building2 className="size-10 text-foreground/30" strokeWidth={1.4} />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <h3 className="font-heading text-base text-foreground">{item.name}</h3>
        <span className="pill pill-soft">{item.tier}</span>
      </div>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.hint}</p>
    </div>
  );
}
