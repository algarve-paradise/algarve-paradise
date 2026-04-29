"use client";

import Link from "next/link";
import { ArrowUpRight, Heart } from "lucide-react";

import type { SupportCard as SupportCardType } from "@/types/content";

type SupportCardProps = {
  item: SupportCardType;
};

export function SupportCard({ item }: SupportCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-[1.6rem] border border-foreground/10 bg-white p-7 transition-all duration-500 hover:border-foreground hover:-translate-y-1 hover:shadow-[0_24px_60px_-22px_rgba(10,10,10,0.3)]">
      <div className="absolute -right-12 -top-12 size-44 rounded-full bg-[var(--dt-color-accent-soft)] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative space-y-4">
        <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-[var(--dt-color-accent-soft)] text-[var(--dt-color-accent)] transition-transform duration-500 group-hover:rotate-6">
          <Heart className="size-5" />
        </span>
        <h3 className="font-heading text-2xl text-foreground">{item.title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        <Link
          href={item.cta.href}
          className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-[12px] font-semibold text-background transition-all duration-300 group-hover:bg-[var(--dt-color-accent)]"
        >
          {item.cta.label}
          <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
