import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Globe2, Heart, Shield } from "lucide-react";

import { DonationForm } from "@/components/forms/donation-form";
import { Container } from "@/components/layout/container";
import { siteConfig, siteRoutes } from "@/lib/site";

const TRUST_ICONS = [Shield, CheckCircle2, Globe2];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.donate" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function DonationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const t = await getTranslations("pages.donate");

  const impactItems = t.raw("impactItems") as Array<{ value: string; label: string }>;
  const trustItems = t.raw("trust") as Array<{ label: string; sub: string }>;

  return (
    <div className="min-h-screen bg-[var(--dt-color-bg)]">
      <div className="border-b border-foreground/8 bg-white">
        <Container>
          <div className="flex h-14 items-center justify-between">
            <Link
              href={siteRoutes.support}
              className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
              {t("back")}
            </Link>
            <span className="font-heading text-sm text-foreground">
              Portal do <span className="italic text-[var(--dt-color-accent)]">Algarve</span>
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Shield className="size-3" />
              {t("secure")}
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-10 sm:py-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-start xl:gap-16">

            <div>
              <div className="mb-8 space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--dt-color-accent)]/20 bg-[var(--dt-color-accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--dt-color-accent)]">
                  <Heart className="size-3" />
                  {t("badge")}
                </div>
                <h1 className="font-heading text-4xl leading-tight text-foreground sm:text-5xl">
                  {t("heading")}<br />
                  <span className="text-[var(--dt-color-accent)]">{t("headingAccent")}</span>
                </h1>
                <p className="max-w-md text-[15px] leading-7 text-muted-foreground">
                  {t("description")}
                </p>
              </div>

              <div className="rounded-[2rem] border border-foreground/8 bg-white p-6 shadow-[0_24px_60px_rgba(7,32,67,0.07)] sm:p-8">
                <DonationForm />
              </div>
            </div>

            <div className="space-y-5 lg:sticky lg:top-8">
              <div className="rounded-[1.75rem] bg-[#04162f] p-6 text-white">
                <div className="mb-5 space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/50">
                    {t("impactLabel")}
                  </p>
                  <h2 className="font-heading text-2xl">{t("impactHeading")}</h2>
                </div>
                <div className="space-y-3">
                  {impactItems.map((item) => (
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

              <div className="space-y-3">
                {trustItems.map((item, index) => {
                  const Icon = TRUST_ICONS[index];
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

              <div className="rounded-[1.4rem] border border-amber-200 bg-amber-50 px-4 py-4">
                <p className="text-[12px] leading-5 text-amber-700">
                  {t("demoNotice")}
                </p>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                {t("preferOther")}{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="font-medium text-foreground underline underline-offset-2 hover:text-[var(--dt-color-accent)]"
                >
                  {t("contactEmail")}
                </a>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
