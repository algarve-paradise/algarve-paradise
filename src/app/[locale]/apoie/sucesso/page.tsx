import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Download, Heart, Mail } from "lucide-react";

import { Container } from "@/components/layout/container";
import { siteConfig, siteRoutes } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.success" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ valor?: string; metodo?: string }>;
};

function generateRef(valor: string, metodo: string): string {
  const seed = (valor + metodo).split("").reduce((acc, c) => acc + c.charCodeAt(0), 7342);
  const hex = seed.toString(16).toUpperCase().padStart(8, "0");
  return `ALG-${hex.slice(0, 4)}-${hex.slice(4, 8)}`;
}

export default async function SuccessPage({ params, searchParams }: Props) {
  await params;
  const t = await getTranslations("pages.success");

  const sp = await searchParams;
  const valor = parseFloat(sp.valor ?? "0");
  const metodo = sp.metodo ?? "stripe";

  const methodLabels: Record<string, string> = {
    stripe: t("methodStripe"),
    paypal: t("methodPaypal"),
    mbway: t("methodMbway"),
  };

  const methodLabel = methodLabels[metodo] ?? metodo;
  const txRef = generateRef(sp.valor ?? "0", metodo);
  const isValid = valor >= 1 && !isNaN(valor);

  return (
    <div className="min-h-screen bg-[var(--dt-color-bg)]">
      <Container>
        <div className="flex min-h-[80vh] flex-col items-center justify-center py-16">
          <div className="w-full max-w-lg space-y-8 text-center">

            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20" style={{ animationDuration: "2s" }} />
                <div className="relative inline-flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_16px_48px_rgba(52,211,153,0.4)]">
                  <CheckCircle2 className="size-12 text-white" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                <Heart className="size-3" />
                {t("badge")}
              </div>
              <h1 className="font-heading text-4xl leading-tight text-foreground sm:text-5xl">
                {t("heading")}
              </h1>
              <p className="text-[15px] leading-7 text-muted-foreground">
                {t("description")}
              </p>
            </div>

            {isValid && (
              <div className="overflow-hidden rounded-[1.75rem] border border-foreground/8 bg-white shadow-[0_16px_48px_rgba(7,32,67,0.08)]">
                <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-[var(--dt-color-accent)] to-emerald-400" />

                <div className="p-7">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1rem] bg-[var(--dt-color-bg)] px-4 py-3 text-left">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{t("labelAmount")}</p>
                      <p className="mt-1 font-heading text-3xl text-foreground">
                        €{valor.toFixed(2)}
                      </p>
                    </div>
                    <div className="rounded-[1rem] bg-[var(--dt-color-bg)] px-4 py-3 text-left">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{t("labelMethod")}</p>
                      <p className="mt-1 font-heading text-xl text-foreground">{methodLabel}</p>
                    </div>
                    <div className="col-span-full rounded-[1rem] bg-[var(--dt-color-bg)] px-4 py-3 text-left">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{t("labelRef")}</p>
                      <p className="mt-1 font-mono text-lg tracking-widest text-foreground">{txRef}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2 rounded-[1rem] border border-amber-200 bg-amber-50 px-4 py-3">
                    <p className="text-[12px] leading-5 text-amber-700">
                      {t("demoNotice")}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="size-4" />
                      {t("receiptSent")}{" "}
                      <span className="font-medium text-foreground">{siteConfig.email}</span>
                    </div>
                    <button
                      type="button"
                      className="flex items-center gap-2 text-sm text-[var(--dt-color-accent)] transition-opacity hover:opacity-70"
                    >
                      <Download className="size-4" />
                      {t("downloadReceipt")}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href={siteRoutes.home}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#04162f] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_12px_36px_rgba(4,22,47,0.3)]"
              >
                {t("goHome")}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href={siteRoutes.support}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/15 bg-white px-6 py-3 text-sm font-semibold text-foreground transition hover:border-foreground"
              >
                {t("otherSupport")}
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              {t("shareMessage")}{" "}
              <Link
                href={siteRoutes.news}
                className="font-medium text-[var(--dt-color-accent)] underline underline-offset-2"
              >
                {t("seeLatestNews")}
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
