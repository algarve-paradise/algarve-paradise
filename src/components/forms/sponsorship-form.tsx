"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const TIERS = [
  { value: "apoiante_local", label: "Apoiante Local" },
  { value: "parceiro_regional", label: "Parceiro Regional" },
  { value: "patrocinador_principal", label: "Patrocinador Principal" },
  { value: "outro", label: "Outro / Personalizado" },
];

const fieldCls =
  "h-12 w-full rounded-[1rem] border border-foreground/10 bg-[var(--dt-color-bg)] px-4 text-sm text-foreground outline-none transition focus:border-[var(--dt-color-accent)] focus:ring-4 focus:ring-[var(--dt-color-accent)]/10 placeholder:text-muted-foreground/60";

type Status = "idle" | "loading" | "success" | "error";

export function SponsorshipForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [tier, setTier] = useState("apoiante_local");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const isValid = name.trim().length > 1 && email.includes("@") && message.trim().length > 10;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || status === "loading") return;
    setStatus("loading");

    try {
      const res = await fetch("/api/sponsorships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, phone, tier, message }),
      });

      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-5 py-10 text-center"
      >
        <div className="inline-flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-8" strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <p className="font-heading text-2xl text-foreground">Pedido recebido!</p>
          <p className="text-sm leading-6 text-muted-foreground">
            A nossa equipa analisará o seu pedido e entrará em contacto em breve pelo email indicado.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name + Email */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Nome *
          </label>
          <input
            className={fieldCls}
            placeholder="O seu nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Email *
          </label>
          <input
            className={fieldCls}
            type="email"
            placeholder="email@empresa.pt"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
      </div>

      {/* Company + Phone */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Empresa / Entidade
          </label>
          <input
            className={fieldCls}
            placeholder="Nome da empresa (opcional)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            autoComplete="organization"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Telefone
          </label>
          <input
            className={fieldCls}
            type="tel"
            placeholder="+351 9XX XXX XXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />
        </div>
      </div>

      {/* Tier */}
      <div className="space-y-1.5">
        <label className="text-[12px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Tipo de patrocínio *
        </label>
        <div className="grid gap-2 sm:grid-cols-2">
          {TIERS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTier(t.value)}
              className={cn(
                "rounded-[1rem] border px-4 py-3 text-left text-sm font-medium transition-all duration-150",
                tier === t.value
                  ? "border-[var(--dt-color-accent)] bg-[var(--dt-color-accent-soft)] text-[var(--dt-color-accent)]"
                  : "border-foreground/10 bg-[var(--dt-color-bg)] text-foreground hover:border-foreground/25"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <label className="text-[12px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Mensagem / Proposta *
        </label>
        <textarea
          rows={4}
          placeholder="Descreva brevemente o que procura e como pensa que podemos colaborar..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="w-full resize-none rounded-[1rem] border border-foreground/10 bg-[var(--dt-color-bg)] px-4 py-3 text-sm text-foreground outline-none transition focus:border-[var(--dt-color-accent)] focus:ring-4 focus:ring-[var(--dt-color-accent)]/10 placeholder:text-muted-foreground/60"
        />
      </div>

      {/* Error */}
      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            Ocorreu um erro ao enviar o pedido. Por favor tente novamente ou contacte-nos diretamente por email.
          </motion.p>
        )}
      </AnimatePresence>

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || status === "loading"}
        className={cn(
          "group flex w-full items-center justify-center gap-2 rounded-[1rem] py-3.5 font-heading text-lg transition-all duration-300",
          isValid && status !== "loading"
            ? "bg-[#04162f] text-white shadow-[0_8px_32px_rgba(4,22,47,0.18)] hover:shadow-[0_16px_48px_rgba(4,22,47,0.3)]"
            : "cursor-not-allowed bg-foreground/8 text-muted-foreground"
        )}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            A enviar...
          </>
        ) : (
          <>
            Enviar pedido de patrocínio
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}
