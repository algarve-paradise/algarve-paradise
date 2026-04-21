"use client";

import { ArrowUpRight } from "lucide-react";

import type { SupportCard as SupportCardType } from "@/types/content";

type SupportCardProps = {
  item: SupportCardType;
};

export function SupportCard({ item }: SupportCardProps) {
  return (
    <div className="border border-border p-6 group hover:bg-muted/30 transition-colors">
      <div className="space-y-3">
        <h3 className="font-heading text-xl font-medium text-foreground">{item.title}</h3>
        <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
        <a
          href={item.cta.href}
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
        >
          {item.cta.label}
          <ArrowUpRight className="size-3" />
        </a>
      </div>
    </div>
  );
}
