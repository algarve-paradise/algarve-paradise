"use client";

import { Quote } from "lucide-react";

import type { CommunityMessage } from "@/types/content";

type MessageCardProps = {
  item: CommunityMessage;
};

const palette = [
  "var(--dt-color-accent-soft)",
  "var(--dt-color-mint)",
  "var(--dt-color-sky)",
  "var(--dt-color-violet)",
];

export function MessageCard({ item }: MessageCardProps) {
  const tint = palette[(item.name.charCodeAt(0) ?? 0) % palette.length];
  const initial = item.name.trim().charAt(0).toUpperCase();

  return (
    <div className="group relative rounded-[1.4rem] border border-foreground/8 bg-white p-5 transition-all duration-300 hover:border-foreground/20 hover:shadow-[0_18px_40px_-22px_rgba(10,10,10,0.25)] hover:-translate-y-0.5">
      <div
        className="absolute -top-4 left-5 flex size-9 items-center justify-center rounded-full text-foreground"
        style={{ backgroundColor: tint }}
      >
        <Quote className="size-4" />
      </div>
      <p className="mt-3 text-[15px] leading-relaxed text-foreground">
        “{item.message}”
      </p>
      <div className="mt-5 flex items-center gap-3 border-t border-foreground/8 pt-4">
        <span
          className="flex size-9 items-center justify-center rounded-full font-semibold text-foreground"
          style={{ backgroundColor: tint }}
        >
          {initial}
        </span>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-foreground">{item.name}</div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {item.municipality}
          </div>
        </div>
      </div>
    </div>
  );
}
