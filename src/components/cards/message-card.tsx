"use client";

import { Quote } from "lucide-react";

import type { CommunityMessage } from "@/types/content";

type MessageCardProps = {
  item: CommunityMessage;
};

export function MessageCard({ item }: MessageCardProps) {
  return (
    <div className="border-b border-border py-5">
      <Quote className="size-4 text-muted-foreground/40 mb-3" />
      <p className="text-sm leading-6 text-foreground italic">{item.message}</p>
      <div className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground">
        <span className="font-bold text-foreground">{item.name}</span> · {item.municipality}
      </div>
    </div>
  );
}
