"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, Radio, X } from "lucide-react";

import { navigationMain } from "@/data/navigation";
import { fadeIn, fadeUp, staggerContainer } from "@/lib/motion";
import { siteRoutes } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/layout/container";
import { BrandMark } from "@/components/shared/brand-mark";
import { LiveIndicator } from "@/components/shared/live-indicator";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-white/10 bg-background/92 backdrop-blur-xl transition-all duration-300",
        scrolled && "shadow-[0_18px_40px_rgba(7,32,67,0.08)]"
      )}
    >
      <div className={cn("border-b border-slate-200/80 bg-white/88 transition-all duration-300", scrolled && "bg-white/96")}>
        <Container className="flex min-h-11 items-center justify-between gap-3 text-xs uppercase tracking-[0.22em] text-slate-500">
          <div className="flex items-center gap-3">
            <LiveIndicator className="hidden sm:inline-flex" />
            <span className="inline-flex items-center gap-2">
              <Radio className="size-3.5 text-[var(--color-brand-700)]" />
              Informacao regional, comunidade e agenda do Algarve
            </span>
          </div>
          <span className="hidden sm:block">Edicao institucional e digital</span>
        </Container>
      </div>

      <Container className={cn("flex items-center justify-between gap-4 py-4 transition-all duration-300", scrolled && "py-3")}>
        <BrandMark compact />

        <nav aria-label="Navegacao principal" className="hidden items-center gap-1 lg:flex">
          {navigationMain.map((item) => {
            const active = pathname === item.href;
            return (
              <motion.div
                key={item.href}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.18 }}
                className="relative"
              >
                {active && !item.cta ? (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-[var(--color-brand-50)] shadow-[0_10px_24px_rgba(0,76,153,0.12)]"
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  />
                ) : null}
                <ButtonLink
                  href={item.href}
                  variant={active ? "secondary" : "ghost"}
                  className={cn(
                    "relative rounded-full px-4 transition-all duration-200",
                    !item.cta && "hover:bg-[var(--color-brand-50)] hover:text-[var(--color-brand-800)]",
                    item.cta &&
                      "bg-[var(--color-signal)] text-white shadow-[0_14px_28px_rgba(204,20,57,0.24)] hover:bg-[color:var(--color-signal-hover)] hover:shadow-[0_18px_34px_rgba(204,20,57,0.28)]",
                    active && !item.cta && "text-[var(--color-brand-800)] shadow-sm"
                  )}
                >
                  {item.label}
                </ButtonLink>
              </motion.div>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ButtonLink
            href={siteRoutes.contact}
            variant="outline"
            className="rounded-full transition-all duration-200 hover:-translate-y-0.5"
          >
            Contactar redacao
          </ButtonLink>
          <ButtonLink
            href={siteRoutes.support}
            className="rounded-full shadow-[0_14px_28px_rgba(0,76,153,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(0,76,153,0.28)]"
          >
            Apoiar projeto
            <ArrowRight className="size-4" />
          </ButtonLink>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="rounded-full lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Fechar navegacao" : "Abrir navegacao"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </Button>
      </Container>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={fadeIn}
            id="mobile-navigation"
            className="border-t border-border/50 bg-background/95 lg:hidden"
          >
            <Container className="py-4">
              <motion.div variants={staggerContainer} className="grid gap-2">
                {navigationMain.map((item) => {
                  const active = pathname === item.href;

                  return (
                    <motion.div key={item.href} variants={fadeUp}>
                      <ButtonLink
                        href={item.href}
                        variant={active ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start rounded-2xl px-4 py-6",
                          item.cta &&
                            "bg-[var(--color-signal)] text-white hover:bg-[color:var(--color-signal-hover)]"
                        )}
                      >
                        {item.label}
                      </ButtonLink>
                    </motion.div>
                  );
                })}
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  <ButtonLink href={siteRoutes.contact} variant="outline" className="rounded-2xl">
                    Contactar redacao
                  </ButtonLink>
                  <ButtonLink href={siteRoutes.support} className="rounded-2xl">
                    Apoiar projeto
                  </ButtonLink>
                </div>
              </motion.div>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
