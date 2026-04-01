"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent } from "@/components/ui/card";
import type { SupportCard as SupportCardType } from "@/types/content";

type SupportCardProps = {
  item: SupportCardType;
};

export function SupportCard({ item }: SupportCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="border border-[#10345f] bg-[#04162f] text-white shadow-[0_24px_60px_rgba(4,22,47,0.35)]">
        <CardContent className="space-y-4 pt-5">
          <h3 className="font-heading text-2xl">{item.title}</h3>
          <p className="text-sm leading-6 text-white/74">{item.description}</p>
          <ButtonLink
            href={item.cta.href}
            variant={item.cta.variant ?? "default"}
            className="w-fit rounded-full"
          >
            {item.cta.label}
            <ArrowUpRight className="size-4" />
          </ButtonLink>
        </CardContent>
      </Card>
    </motion.div>
  );
}
