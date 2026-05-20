"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const LOCALES = [
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
] as const;

type Locale = typeof LOCALES[number]["code"];

function getPathWithoutLocale(pathname: string, currentLocale: string): string {
  if (currentLocale === "pt") return pathname;
  const prefix = `/${currentLocale}`;
  if (pathname.startsWith(prefix)) {
    return pathname.slice(prefix.length) || "/";
  }
  return pathname;
}

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchLocale(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    const pathWithoutLocale = getPathWithoutLocale(pathname, locale);
    const newPath = next === "pt" ? pathWithoutLocale : `/${next}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;
    router.push(newPath);
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[12px] font-medium transition-all duration-200",
          open
            ? "border-[var(--dt-color-accent)] bg-[var(--dt-color-accent-soft)] text-[var(--dt-color-accent)]"
            : "border-foreground/15 bg-white/60 text-foreground/75 hover:border-foreground/30 hover:text-foreground"
        )}
        aria-label="Selecionar idioma"
      >
        <Globe className="size-3.5" />
        <span>{current.flag}</span>
        <span className="uppercase">{current.code}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-2xl border border-foreground/10 bg-white shadow-[0_16px_40px_rgba(7,32,67,0.14)]"
          >
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => switchLocale(l.code)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-2.5 text-[13px] transition-colors hover:bg-[var(--dt-color-bg)]",
                  l.code === locale
                    ? "font-semibold text-[var(--dt-color-accent)]"
                    : "text-foreground/80"
                )}
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
                {l.code === locale && (
                  <span className="ml-auto size-1.5 rounded-full bg-[var(--dt-color-accent)]" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
