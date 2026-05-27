"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, Newspaper, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { siteRoutes } from "@/lib/site";
import { fadeIn, fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";
import { LanguageSwitcher } from "@/components/shared/language-switcher";

const NAV_ITEMS = [
  { key: "home" as const, href: siteRoutes.home },
  { key: "about" as const, href: siteRoutes.about },
  { key: "news" as const, href: siteRoutes.news },
  { key: "events" as const, href: siteRoutes.events },
  { key: "community" as const, href: siteRoutes.community },
  { key: "contacts" as const, href: siteRoutes.contact },
];

const NAV_CTA = { key: "support" as const, href: siteRoutes.support };

export function SiteHeader() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tHeader = useTranslations("header");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Strip locale prefix for active matching
  const strippedPath = pathname.replace(/^\/(en|es)/, "") || "/";

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
          <Link href={siteRoutes.home} className="flex items-center gap-2 pl-1 group">
            <Image
              src="/logo.PNG"
              alt="Média Algarve Paradise"
              width={40}
              height={40}
              className="size-10 object-contain transition-transform duration-500 group-hover:scale-105"
              priority
            />
            <div className="leading-tight">
              <div className="font-heading text-sm sm:text-[15px] tracking-tight text-foreground">
                Média <span className="italic">Algarve Paradise</span>
              </div>
              <div className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                {tHeader("tagline")}
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 rounded-full border border-white/60 bg-white/40 px-1.5 py-1 backdrop-blur-md">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/"
                  ? strippedPath === "/"
                  : strippedPath.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-1.5 text-[12.5px] font-medium tracking-tight transition-colors rounded-full",
                    active ? "text-background" : "text-foreground/75 hover:text-foreground"
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-foreground"
                      transition={{ type: "spring", stiffness: 320, damping: 32 }}
                    />
                  ) : null}
                  <span className="relative z-10">{t(item.key)}</span>
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
              <span>{t("updated")}</span>
            </div>

            <LanguageSwitcher />

            <Link
              href={NAV_CTA.href}
              className="group relative inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[12px] font-semibold text-background transition-all duration-300 hover:bg-[var(--dt-color-accent)] hover:shadow-[0_10px_30px_-10px_rgba(29,111,209,0.55)]"
            >
              {t("supportBtn")}
              <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>

            <button
              type="button"
              className="lg:hidden inline-flex size-9 items-center justify-center rounded-full border border-white/70 bg-white/50 text-foreground"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Fechar navegação" : "Abrir navegação"}
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </motion.header>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={fadeIn}
            id="mobile-navigation"
            className="lg:hidden mt-3"
          >
            <Container>
              <motion.div variants={staggerContainer} className="surface-acrylic rounded-3xl p-3">
                {[...NAV_ITEMS, NAV_CTA].map((item) => {
                  const active = strippedPath === item.href;
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
                        <span>{t(item.key)}</span>
                        <ArrowUpRight className="size-4 opacity-50" />
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
