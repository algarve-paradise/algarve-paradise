"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { navigationMain } from "@/data/navigation";
import { fadeIn, fadeUp, staggerContainer } from "@/lib/motion";
import { siteRoutes } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-background">
      {/* Top Bar */}
      <div className="border-b border-border/80 hidden sm:block">
        <Container className="flex min-h-10 items-center justify-between text-[11px] uppercase tracking-widest text-muted-foreground">
          <div>{new Date().toLocaleDateString('pt-PT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div className="flex items-center gap-5">
            <Link href={siteRoutes.news} className="hover:text-foreground transition-colors">Edição de Hoje</Link>
            <Link href={siteRoutes.support} className="font-semibold text-foreground hover:underline underline-offset-2">Subscrever</Link>
          </div>
        </Container>
      </div>

      {/* Logo Bar */}
      <div className="flex flex-col items-center justify-center py-6 sm:py-8 border-b border-border sm:border-none relative">
        <Container className="flex items-center justify-between sm:justify-center w-full">
           <Button
            variant="ghost"
            size="icon"
            className="rounded-none sm:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Fechar navegacao" : "Abrir navegacao"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>

          <Link href="/" className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] tracking-tight text-foreground text-center">
            O Portal do Algarve
          </Link>

          <div className="w-10 sm:hidden"></div> {/* Spacer para centrar o logo em mobile */}
        </Container>
      </div>

      {/* Navigation Bar */}
      <div className="sticky top-0 z-50 border-t border-b border-border bg-background transition-all duration-300">
        <Container className="flex items-center justify-center py-3">
          <nav aria-label="Navegacao principal" className="hidden items-center justify-center gap-7 lg:flex flex-wrap">
            {navigationMain.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-xs font-semibold uppercase tracking-widest text-foreground hover:text-muted-foreground transition-colors",
                  pathname === item.href && "underline decoration-border underline-offset-4"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </Container>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={fadeIn}
            id="mobile-navigation"
            className="border-b border-border bg-background lg:hidden"
          >
            <Container className="py-4">
              <motion.div variants={staggerContainer} className="grid gap-2">
                {navigationMain.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <motion.div key={item.href} variants={fadeUp}>
                      <Link
                        href={item.href}
                        className={cn(
                          "block w-full text-left py-3 px-2 text-sm font-semibold uppercase tracking-widest text-foreground border-b border-border/40",
                          active && "bg-muted/30"
                        )}
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
