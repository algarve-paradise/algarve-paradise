"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Cookie, Shield, BarChart2, Megaphone, X } from "lucide-react";
import Link from "next/link";

import { useCookieConsent, type ConsentPrefs } from "@/hooks/use-cookie-consent";
import { cn } from "@/lib/utils";

type Panel = "bar" | "expanded";

export function CookieConsentBanner() {
  const { status, prefs, mounted, acceptAll, acceptEssential, saveCustom } = useCookieConsent();
  const [panel, setPanel] = useState<Panel>("bar");
  const [draft, setDraft] = useState<ConsentPrefs>({ analytics: false, marketing: false });

  if (!mounted || status === "saved") return null;

  function openExpanded() {
    setDraft(prefs);
    setPanel("expanded");
  }

  function handleSaveCustom() {
    saveCustom(draft);
  }

  return (
    <AnimatePresence>
      <motion.div
        key="cookie-banner"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-0 left-0 right-0 z-[100] p-3 sm:p-4"
      >
        <div className="mx-auto max-w-3xl overflow-hidden rounded-[1.75rem] border border-foreground/10 bg-white shadow-[0_-4px_32px_rgba(7,32,67,0.12),0_24px_60px_rgba(7,32,67,0.14)]">

          {/* Top accent strip */}
          <div className="h-1 w-full bg-gradient-to-r from-[#04162f] via-[var(--dt-color-accent)] to-[#04162f]" />

          <AnimatePresence mode="wait">
            {panel === "bar" ? (
              <motion.div
                key="bar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6"
              >
                {/* Icon + text */}
                <div className="flex items-start gap-3 sm:flex-1">
                  <div className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#04162f] text-white">
                    <Cookie className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Utilizamos cookies neste site
                    </p>
                    <p className="mt-0.5 text-[12px] leading-5 text-muted-foreground">
                      De acordo com a LGPD e o RGPD, precisamos do seu consentimento para usar cookies não essenciais.{" "}
                      <Link href="/politica-de-cookies" className="underline underline-offset-2 hover:text-foreground">
                        Saber mais
                      </Link>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <button
                    onClick={openExpanded}
                    className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 bg-transparent px-4 py-2 text-[12px] font-medium text-foreground transition hover:border-foreground"
                  >
                    Personalizar
                    <ChevronDown className="size-3" />
                  </button>
                  <button
                    onClick={acceptEssential}
                    className="inline-flex items-center rounded-full border border-foreground/15 bg-transparent px-4 py-2 text-[12px] font-medium text-foreground transition hover:border-foreground"
                  >
                    Apenas essenciais
                  </button>
                  <button
                    onClick={acceptAll}
                    className="inline-flex items-center rounded-full bg-[#04162f] px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-[#0b2a52]"
                  >
                    Aceitar todos
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-5 sm:p-6"
              >
                {/* Header */}
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="font-heading text-xl text-foreground">Preferências de cookies</p>
                    <p className="mt-0.5 text-[12px] text-muted-foreground">
                      Escolha quais categorias aceita. Os essenciais são sempre ativos.
                    </p>
                  </div>
                  <button
                    onClick={() => setPanel("bar")}
                    className="inline-flex size-8 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition hover:border-foreground hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  <CategoryRow
                    icon={Shield}
                    title="Essenciais"
                    description="Autenticação, preferências de sessão e segurança. Não podem ser desativados."
                    checked
                    disabled
                  />
                  <CategoryRow
                    icon={BarChart2}
                    title="Analytics"
                    description="Métricas de uso anónimas para melhorar a plataforma (ex: Google Analytics)."
                    checked={draft.analytics}
                    onChange={(v) => setDraft((d) => ({ ...d, analytics: v }))}
                  />
                  <CategoryRow
                    icon={Megaphone}
                    title="Marketing"
                    description="Publicidade personalizada e rastreamento de redes sociais."
                    checked={draft.marketing}
                    onChange={(v) => setDraft((d) => ({ ...d, marketing: v }))}
                  />
                </div>

                {/* Footer actions */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[11px] text-muted-foreground">
                    <Link href="/politica-de-privacidade" className="underline underline-offset-2 hover:text-foreground">
                      Política de privacidade
                    </Link>
                    {" · "}
                    <Link href="/politica-de-cookies" className="underline underline-offset-2 hover:text-foreground">
                      Política de cookies
                    </Link>
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={acceptEssential}
                      className="rounded-full border border-foreground/15 px-4 py-2 text-[12px] font-medium text-foreground transition hover:border-foreground"
                    >
                      Apenas essenciais
                    </button>
                    <button
                      onClick={handleSaveCustom}
                      className="rounded-full bg-[#04162f] px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-[#0b2a52]"
                    >
                      Guardar preferências
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

type CategoryRowProps = {
  icon: React.ElementType;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
};

function CategoryRow({ icon: Icon, title, description, checked, disabled, onChange }: CategoryRowProps) {
  return (
    <div className={cn(
      "flex items-start gap-4 rounded-[1.2rem] border p-4 transition-colors",
      checked && !disabled
        ? "border-[var(--dt-color-accent)]/30 bg-[var(--dt-color-accent-soft)]"
        : "border-foreground/8 bg-[var(--dt-color-bg)]"
    )}>
      <div className={cn(
        "mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl",
        disabled ? "bg-foreground/8 text-muted-foreground" : "bg-[#04162f] text-white"
      )}>
        <Icon className="size-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <Toggle checked={checked} disabled={disabled} onChange={onChange} />
        </div>
        <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

type ToggleProps = {
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
};

function Toggle({ checked, disabled, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        checked ? "bg-[var(--dt-color-accent)]" : "bg-foreground/20"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm transition-transform duration-200",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
}
