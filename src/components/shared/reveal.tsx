"use client";

import type { PropsWithChildren, ReactNode } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type RevealProps = PropsWithChildren<{
  className?: string;
  delay?: number;
  as?: "div" | "section";
}>;

type StaggerGroupProps = {
  className?: string;
  children: ReactNode;
  delay?: number;
};

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: RevealProps) {
  const Component = as === "section" ? motion.section : motion.div;

  return (
    <Component
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </Component>
  );
}

export function StaggerGroup({
  className,
  children,
  delay = 0,
}: StaggerGroupProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.14 }}
      variants={{
        hidden: {},
        show: {
          transition: {
            delayChildren: delay,
            staggerChildren: 0.08,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.42 } },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
