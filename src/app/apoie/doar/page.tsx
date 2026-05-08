import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Globe2, Heart, Shield } from "lucide-react";

import { DonationForm } from "@/components/forms/donation-form";
import { Container } from "@/components/layout/container";
import { siteConfig, siteRoutes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Fazer Donativo · Apoie",
  description: "Contribua para a informação regional do Algarve de forma simples e segura.",
};

const IMPACT_ITEMS = [
  { value: "€5", label: "Cobre 1 dia de custos de servidor" },
  { value: "€10", label: "Financia uma notícia local completa" },
  { value: "€25", label: "Apoia uma semana de cobertura editorial" },
  { value: "€50", label: "Patrocina uma reportagem regional" },
];

const TRUST_ITEMS = [
  { icon: Shield, label: "Pagamentos seguros", sub: "Dados encriptados via SSL" },
  { icon: CheckCircle2, label: "Recibo automático", sub: "Enviado para o seu email" },
  { icon: Globe2, label: "Plataforma aberta", sub: "Acesso gratuito para todos" },
];

export default function DonationPage() {
  return (
    <div className="min-h-screen bg-[var(--dt-color-bg)]">
      {/* Top bar */}
      <div className="border-b border-foreground/8 bg-white">
        <Container>
          <div className="flex h-14 items-center justify-between">
            <Link
              href={siteRoutes.support}
              className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
              Voltar ao apoio
            </Link>
            <span className="font-heading text-sm text-foreground">
              Portal do <span className="italic text-[var(--dt-color-accent)]">Algarve</span>
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Shield className="size-3" />
              Pagamento seguro
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-10 sm:py-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-start xl:gap-16">

            {/* LEFT — Form */}
            <div>
              <div className="mb-8 space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--dt-color-accent)]/20 bg-[var(--dt-color-accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--dt-color-accent)]">
                  <Heart className="size-3" />
                  Donativo
                </div>
                <h1 className="font-heading text-4xl leading-tight text-foreground sm:text-5xl">
                  Apoie o jornalismo<br />
                  <span className="text-[var(--dt-color-accent)]">regional</span>
                </h1>
                <p className="max-w-md text-[15px] leading-7 text-muted-foreground">
                  O seu donativo ajuda a manter a plataforma ativa, gratuita e independente.
                  Cada contribuição faz a diferença para a cobertura do Algarve.
                </p>
              </div>

              <div className="rounded-[2rem] border border-foreground/8 bg-white p-6 shadow-[0_24px_60px_rgba(7,32,67,0.07)] sm:p-8">
                <DonationForm />
              </div>
            </div>

            {/* RIGHT — Sidebar */}
            <div className="space-y-5 lg:sticky lg:top-8">

              {/* Impact */}
              <div className="rounded-[1.75rem] bg-[#04162f] p-6 text-white">
                <div className="mb-5 space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/50">
                    Impacto do seu donativo
                  </p>
                  <h2 className="font-heading text-2xl">O que o seu apoio permite</h2>
                </div>
                <div className="space-y-3">
                  {IMPACT_ITEMS.map((item) => (
                    <div
                      key={item.value}
                      className="flex items-start gap-4 rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <span className="font-heading text-2xl text-[var(--dt-color-accent)]">
                        {item.value}
                      </span>
                      <span className="mt-1 text-sm leading-5 text-white/75">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust */}
              <div className="space-y-3">
                {TRUST_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-4 rounded-[1.4rem] border border-foreground/8 bg-white px-4 py-3 shadow-[0_4px_16px_rgba(7,32,67,0.05)]"
                    >
                      <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand-50)] text-[var(--color-brand-700)]">
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.label}</p>
                        <p className="text-[12px] text-muted-foreground">{item.sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Demo notice */}
              <div className="rounded-[1.4rem] border border-amber-200 bg-amber-50 px-4 py-4">
                <p className="text-[12px] leading-5 text-amber-700">
                  <span className="font-semibold">Modo demonstração:</span> Este fluxo ilustra
                  como seria a integração com Stripe, PayPal ou MB Way. Nenhum dado
                  financeiro é transmitido nem cobrado.
                </p>
              </div>

              {/* Contact fallback */}
              <p className="text-center text-xs text-muted-foreground">
                Prefere outro método?{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="font-medium text-foreground underline underline-offset-2 hover:text-[var(--dt-color-accent)]"
                >
                  Contacte-nos por email
                </a>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
