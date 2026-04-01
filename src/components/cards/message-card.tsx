"use client";

import { Quote } from "lucide-react";
import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import type { CommunityMessage } from "@/types/content";

type MessageCardProps = {
  item: CommunityMessage;
};

export function MessageCard({ item }: MessageCardProps) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
      <Card className="border border-white/10 bg-white shadow-[0_16px_40px_rgba(7,32,67,0.08)]">
        <CardContent className="space-y-4 pt-5">
          <Quote className="size-5 text-[var(--color-signal)]" />
          <p className="text-sm leading-6 text-slate-700">{item.message}</p>
          <div>
            <div className="font-heading text-base text-foreground">{item.name}</div>
            <div className="text-sm text-muted-foreground">{item.municipality}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
