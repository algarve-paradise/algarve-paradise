"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, Newspaper, X } from "lucide-react";

import { navigationMain } from "@/data/navigation";
import { fadeIn, fadeUp, staggerContainer } from "@/lib/motion";
import { siteRoutes } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";
import { LanguageSwitcher } from "@/components/shared/language-switcher";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50 w-full pt-3 sm:pt-4">
      <Container>
        <motion.header
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "relative flex items-center justify-between gap-4 rounded-full border border-white/60 px-3 py-2 sm:px-4",
            "transition-all duration-500",
            scrolled
              ? "bg-white/70 shadow-[0_18px_40px_-22px_rgba(10,10,10,0.45)] backdrop-blur-xl backdrop-saturate-150"
              : "bg-white/35 backdrop-blur-md backdrop-saturate-150"
          )}
          style={{
            WebkitBackdropFilter: scrolled ? "blur(22px) saturate(180%)" : "blur(14px) saturate(160%)",
          }}
        >
          {/* Logo */}
          <Link href={siteRoutes.home} className="flex items-center gap-2 pl-2 group">
            <span className="relative inline-flex size-8 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-500 group-hover:rotate-[18deg]">
              <span className="absolute inset-0 rounded-full bg-[var(--dt-color-accent)] opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-60" />
              <span className="relative font-heading text-sm font-semibold">A</span>
            </span>
            <div className="leading-tight">
              <div className="font-heading text-sm sm:text-[15px] tracking-tight text-foreground">
                Portal do <span className="italic">Algarve</span>
              </div>
              <div className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                Media regional
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 rounded-full border border-white/60 bg-white/40 px-1.5 py-1 backdrop-blur-md">
            {navigationMain
              .filter((item) => !item.cta)
              .map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative px-3 py-1.5 text-[12.5px] font-medium tracking-tight transition-colors rounded-full",
                      active
                        ? "text-background"
                        : "text-foreground/75 hover:text-foreground"
                    )}
                  >
                    {active ? (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-foreground"
                        transition={{ type: "spring", stiffness: 320, damping: 32 }}
                      />
                    ) : null}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
          </nav>

          {/* Right CTA */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground border border-white/70">
              <span className="relative inline-flex size-1.5 rounded-full bg-[var(--dt-color-accent)]">
                <span className="absolute inset-0 rounded-full bg-[var(--dt-color-accent)] animate-pulse-dot" />
              </span>
              <Newspaper className="size-3" />
              <span>Atualizado</span>
            </div>

            <LanguageSwitcher />

            <Link
              href={siteRoutes.support}
              className="group relative inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[12px] font-semibold text-background transition-all duration-300 hover:bg-[var(--dt-color-accent)] hover:shadow-[0_10px_30px_-10px_rgba(29,111,209,0.55)]"
            >
              Apoiar
              <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>

            <button
              type="button"
              className="lg:hidden inline-flex size-9 items-center justify-center rounded-full border border-white/70 bg-white/50 text-foreground"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "Fechar navegacao" : "Abrir navegacao"}
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </motion.header>
      </Container>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={fadeIn}
            id="mobile-navigation"
            className="lg:hidden mt-3"
          >
            <Container>
              <motion.div
                variants={staggerContainer}
                className="surface-acrylic rounded-3xl p-3"
              >
                {navigationMain.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <motion.div key={item.href} variants={fadeUp}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                          active ? "bg-foreground text-background" : "text-foreground hover:bg-white/60"
                        )}
                        onClick={() => setOpen(false)}
                      >
                        <span>{item.label}</span>
                        <ArrowUpRight className="size-4 opacity-50" />
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
