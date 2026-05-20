"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, CreditCard, Lock, Shield, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

const PRESET_AMOUNTS = [5, 10, 25, 50];

type Method = "stripe" | "paypal" | "mbway";

const METHODS: { id: Method; label: string; sub: string }[] = [
  { id: "stripe", label: "Cartão", sub: "Visa · Mastercard · Amex" },
  { id: "paypal", label: "PayPal", sub: "Conta PayPal" },
  { id: "mbway", label: "MB Way", sub: "Telemóvel PT" },
];

const PROCESSING_STEPS = [
  { label: "A verificar os dados...", duration: 800 },
  { label: "A processar o pagamento...", duration: 1000 },
  { label: "A confirmar a transação...", duration: 700 },
  { label: "Concluído!", duration: 400 },
];

function fmtCard(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
}

function fmtExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  if (d.length > 2) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return d;
}

const fieldCls =
  "h-12 w-full rounded-[1rem] border border-foreground/10 bg-white px-4 text-sm text-foreground outline-none transition focus:border-[var(--dt-color-accent)] focus:ring-4 focus:ring-[var(--dt-color-accent)]/10 placeholder:text-muted-foreground/70";

function StripeLogo() {
  return (
    <svg width="52" height="22" viewBox="0 0 52 22" aria-label="Stripe">
      <text x="0" y="17" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="700" fontSize="20" fill="#635BFF">stripe</text>
    </svg>
  );
}

function PayPalLogo() {
  return (
    <span className="text-[17px] font-black leading-none tracking-tight">
      <span style={{ color: "#003087" }}>Pay</span>
      <span style={{ color: "#009cde" }}>Pal</span>
    </span>
  );
}

function MbWayLogo() {
  return (
    <span className="text-[13px] font-black tracking-[0.14em]" style={{ color: "#009640" }}>
      MB WAY
    </span>
  );
}

function MethodMark({ id }: { id: Method }) {
  if (id === "stripe") return <StripeLogo />;
  if (id === "paypal") return <PayPalLogo />;
  return <MbWayLogo />;
}

function StepNumber({ n }: { n: number }) {
  return (
    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[#04162f] text-[11px] font-bold text-white">
      {n}
    </span>
  );
}

function ProcessingOverlay({ amount, onDone }: { amount: number; onDone: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);

  useState(() => {
    let elapsed = 0;
    PROCESSING_STEPS.forEach((step, i) => {
      setTimeout(() => {
        setCurrentStep(i);
        if (i === PROCESSING_STEPS.length - 1) {
          setTimeout(() => {
            setDone(true);
            setTimeout(onDone, 500);
          }, step.duration);
        }
      }, elapsed);
      elapsed += step.duration;
    });
  });

  const progress = done ? 1 : currentStep / (PROCESSING_STEPS.length - 1);
  const circumference = 2 * Math.PI * 34;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-[2rem] bg-white"
    >
      <div className="w-full max-w-xs space-y-8 px-6 text-center">
        {/* Animated SVG ring */}
        <div className="flex justify-center">
          <div className="relative">
            <svg className="size-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="var(--dt-color-accent-soft)" strokeWidth="5" />
              <circle
                cx="40" cy="40" r="34" fill="none"
                stroke={done ? "#22c55e" : "var(--dt-color-accent)"}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
                style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.4s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {done ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <CheckCircle2 className="size-8 text-emerald-500" strokeWidth={1.5} />
                  </motion.div>
                ) : (
                  <motion.span
                    key={currentStep}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-mono text-sm font-semibold text-[var(--dt-color-accent)]"
                  >
                    {currentStep + 1}/{PROCESSING_STEPS.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Step label */}
        <AnimatePresence mode="wait">
          <motion.p
            key={done ? "done" : currentStep}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="font-heading text-xl text-foreground"
          >
            {done ? "Donativo confirmado!" : PROCESSING_STEPS[currentStep].label}
          </motion.p>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {PROCESSING_STEPS.map((_, i) => (
            <motion.span
              key={i}
              animate={{
                backgroundColor: done || i <= currentStep
                  ? (done ? "#22c55e" : "var(--dt-color-accent)")
                  : "var(--dt-color-accent-soft)",
                scale: !done && i === currentStep ? 1.3 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="size-2 rounded-full"
            />
          ))}
        </div>

        <p className="text-[12px] text-muted-foreground">
          Donativo de{" "}
          <span className="font-semibold text-foreground">€{amount.toFixed(2)}</span>
          {" "}— ambiente demonstrativo
        </p>
      </div>
    </motion.div>
  );
}

export function DonationForm() {
  const router = useRouter();

  const [amount, setAmount] = useState<number | null>(10);
  const [custom, setCustom] = useState("");
  const [method, setMethod] = useState<Method>("stripe");
  const [processing, setProcessing] = useState(false);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [ppEmail, setPpEmail] = useState("");
  const [phone, setPhone] = useState("");

  const finalAmount = amount ?? (custom ? parseFloat(custom) : 0);
  const isValid = finalAmount >= 1 && !isNaN(finalAmount);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || processing) return;
    setProcessing(true);
  }

  function handleProcessingDone() {
    router.push(`/apoie/sucesso?valor=${finalAmount.toFixed(2)}&metodo=${method}`);
  }

  return (
    <div className="relative">
      {processing && (
        <ProcessingOverlay amount={finalAmount} onDone={handleProcessingDone} />
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Step 1 — Amount */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <StepNumber n={1} />
            <h2 className="font-heading text-2xl text-foreground">Escolha o valor</h2>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {PRESET_AMOUNTS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => { setAmount(a); setCustom(""); }}
                className={cn(
                  "rounded-[1.2rem] border py-4 text-center font-heading text-2xl transition-all duration-200",
                  amount === a && !custom
                    ? "border-[var(--dt-color-accent)] bg-[var(--dt-color-accent)] text-white shadow-[0_8px_24px_rgba(29,111,209,0.32)]"
                    : "border-foreground/10 bg-white text-foreground hover:border-[var(--dt-color-accent)]/60",
                )}
              >
                €{a}
              </button>
            ))}
          </div>

          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-heading text-xl text-muted-foreground">
              €
            </span>
            <input
              type="number"
              min="1"
              step="1"
              placeholder="Outro valor"
              value={custom}
              onChange={(e) => { setCustom(e.target.value); setAmount(null); }}
              className="h-14 w-full rounded-[1.2rem] border border-foreground/10 bg-white pl-9 pr-4 font-heading text-xl text-foreground outline-none transition focus:border-[var(--dt-color-accent)] focus:ring-4 focus:ring-[var(--dt-color-accent)]/10 placeholder:text-muted-foreground/60"
            />
          </div>

          <AnimatePresence>
            {isValid && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="flex items-center gap-2 rounded-[1rem] border border-[var(--dt-color-accent)]/20 bg-[var(--dt-color-accent-soft)] px-4 py-3"
              >
                <span className="text-sm font-medium text-[var(--dt-color-accent)]">
                  Total a processar:
                </span>
                <span className="font-heading text-xl font-semibold text-[var(--dt-color-accent)]">
                  €{finalAmount.toFixed(2)}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step 2 — Method */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <StepNumber n={2} />
            <h2 className="font-heading text-2xl text-foreground">Método de pagamento</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className={cn(
                  "relative flex flex-col items-center gap-3 rounded-[1.4rem] border p-5 transition-all duration-200",
                  method === m.id
                    ? "border-[var(--dt-color-accent)] bg-[var(--dt-color-accent)]/5 shadow-[0_8px_24px_rgba(29,111,209,0.1)]"
                    : "border-foreground/10 bg-white hover:border-foreground/25",
                )}
              >
                {method === m.id && (
                  <span className="absolute right-3 top-3 flex size-4 items-center justify-center rounded-full bg-[var(--dt-color-accent)]">
                    <span className="size-1.5 rounded-full bg-white" />
                  </span>
                )}
                <MethodMark id={m.id} />
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">{m.label}</p>
                  <p className="text-[11px] text-muted-foreground">{m.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3 — Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <StepNumber n={3} />
            <h2 className="font-heading text-2xl text-foreground">
              {method === "stripe" && "Dados do cartão"}
              {method === "paypal" && "Conta PayPal"}
              {method === "mbway" && "Número MB Way"}
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {method === "stripe" && (
              <motion.div
                key="stripe"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="space-y-3 rounded-[1.4rem] border border-foreground/8 bg-[var(--dt-color-bg)] p-5"
              >
                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  <CreditCard className="size-3.5" />
                  Encriptação SSL · Ambiente demo
                </div>
                <input className={fieldCls} placeholder="Nome no cartão" value={cardName}
                  onChange={(e) => setCardName(e.target.value)} autoComplete="cc-name" />
                <input className={cn(fieldCls, "font-mono tracking-widest")} placeholder="0000 0000 0000 0000"
                  value={cardNumber} onChange={(e) => setCardNumber(fmtCard(e.target.value))}
                  inputMode="numeric" autoComplete="cc-number" />
                <div className="grid grid-cols-2 gap-3">
                  <input className={cn(fieldCls, "font-mono")} placeholder="MM/AA" value={cardExpiry}
                    onChange={(e) => setCardExpiry(fmtExpiry(e.target.value))}
                    inputMode="numeric" autoComplete="cc-exp" />
                  <input className={cn(fieldCls, "font-mono tracking-widest")} placeholder="CVV"
                    value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    inputMode="numeric" autoComplete="cc-csc" />
                </div>
              </motion.div>
            )}

            {method === "paypal" && (
              <motion.div key="paypal" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
                className="space-y-4 rounded-[1.4rem] border border-[#009cde]/25 bg-[#009cde]/5 p-5"
              >
                <PayPalLogo />
                <p className="text-sm leading-6 text-muted-foreground">
                  Introduza o email associado à sua conta PayPal para continuar com o pagamento de forma segura.
                </p>
                <input className={fieldCls} type="email" placeholder="email@exemplo.com"
                  value={ppEmail} onChange={(e) => setPpEmail(e.target.value)} autoComplete="email" />
              </motion.div>
            )}

            {method === "mbway" && (
              <motion.div key="mbway" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
                className="space-y-4 rounded-[1.4rem] border border-[#009640]/25 bg-[#009640]/5 p-5"
              >
                <div className="flex items-center gap-2">
                  <MbWayLogo />
                  <Smartphone className="ml-1 size-4 text-[#009640]" />
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  Receberá uma notificação push na aplicação MB Way para confirmar o pagamento.
                </p>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                    +351
                  </span>
                  <input className={cn(fieldCls, "pl-14 font-mono tracking-wider")} type="tel"
                    placeholder="9XX XXX XXX" value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
                    inputMode="numeric" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Submit */}
        <div className="space-y-3 border-t border-foreground/8 pt-6">
          <button
            type="submit"
            disabled={!isValid || processing}
            className={cn(
              "group w-full rounded-[1.2rem] py-4 font-heading text-xl transition-all duration-300",
              isValid && !processing
                ? "bg-[#04162f] text-white shadow-[0_8px_32px_rgba(4,22,47,0.18)] hover:shadow-[0_16px_48px_rgba(4,22,47,0.32)]"
                : "cursor-not-allowed bg-foreground/8 text-muted-foreground",
            )}
          >
            <span className="flex items-center justify-center gap-2">
              <Lock className="size-4" />
              {isValid
                ? `Confirmar donativo · €${finalAmount.toFixed(2)}`
                : "Selecione um valor para continuar"}
              {isValid && !processing && (
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              )}
            </span>
          </button>

          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <Shield className="size-3 shrink-0" />
            Ambiente demonstrativo — nenhum pagamento real será processado
          </p>
        </div>
      </form>
    </div>
  );
}
