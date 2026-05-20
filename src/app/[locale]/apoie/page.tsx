import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Building2, CheckCircle2, HandHeart, Heart, Landmark, Mail, Megaphone, ReceiptText, Shield, Zap } from "lucide-react";
import Link from "next/link";

import { PageShell } from "@/components/shared/page-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button-link";
import { SponsorshipForm } from "@/components/forms/sponsorship-form";
import { siteConfig, siteRoutes } from "@/lib/site";

const STEP_ICONS = [Heart, Shield, CheckCircle2];
const WAY_ICONS = [HandHeart, Megaphone, Building2];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.support" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function SupportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const t = await getTranslations("pages.support");

  const steps = t.raw("steps") as Array<{ title: string; desc: string }>;
  const ways = t.raw("ways") as Array<{ title: string; description: string; details: string[] }>;
  const tiers = t.raw("tiers") as Array<{ name: string; description: string; benefits: string[] }>;

  const donationChannels = [
    { label: t("channelBankLabel"), value: t("channelBankValue"), icon: Landmark },
    { label: t("channelReceiptLabel"), value: siteConfig.email, icon: ReceiptText },
  ];

  return (
    <PageShell
      eyebrow={t("title")}
      title={t("heading")}
      description={t("description")}
      primaryCta={{ label: t("talkSponsorship"), href: `mailto:${siteConfig.email}` }}
      secondaryCta={{ label: t("sendSuggestion"), href: siteRoutes.community }}
    >
      {/* Donation CTA hero */}
      <section className="overflow-hidden rounded-[2rem] bg-[#04162f] p-8 text-white shadow-[0_24px_60px_rgba(4,22,47,0.28)] sm:p-10 lg:p-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
              <Zap className="size-3 text-[var(--dt-color-accent)]" />
              {t("donateBadge")}
            </div>
            <div className="space-y-3">
              <h2 className="font-heading text-4xl leading-tight sm:text-5xl">
                {t("donateHeading")}<br />
                <span className="text-[var(--dt-color-accent)]">{t("donateAccent")}</span>
              </h2>
              <p className="max-w-md text-[15px] leading-7 text-white/70">
                {t("donateDesc")}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {steps.map((item, index) => {
                const Icon = STEP_ICONS[index];
                const step = String(index + 1).padStart(2, "0");
                return (
                  <div key={index} className="space-y-2 rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-white/40">{step}</span>
                      <Icon className="size-4 text-[var(--dt-color-accent)]" />
                    </div>
                    <p className="font-heading text-base text-white">{item.title}</p>
                    <p className="text-[12px] leading-5 text-white/60">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="shrink-0">
            <Link
              href="/apoie/doar"
              className="group inline-flex items-center gap-3 rounded-[1.4rem] bg-white px-8 py-5 font-heading text-2xl text-[#04162f] shadow-[0_8px_32px_rgba(255,255,255,0.15)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_16px_48px_rgba(255,255,255,0.25)]"
            >
              {t("donateCta")}
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="mt-3 text-center text-[12px] text-white/40">
              {t("donateSubtext")}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {ways.map((item, index) => {
          const Icon = WAY_ICONS[index];
          return (
            <Card
              key={index}
              className="border border-white/10 bg-white shadow-[0_16px_40px_rgba(7,32,67,0.08)]"
            >
              <CardContent className="space-y-5 pt-6">
                <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[var(--color-brand-50)] text-[var(--color-brand-700)]">
                  <Icon className="size-5" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-heading text-2xl text-foreground">{item.title}</h2>
                  <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
                <ul className="grid gap-2 text-sm text-slate-700">
                  {item.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-8 py-4 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="border border-white/10 bg-[#04162f] text-white shadow-[0_24px_60px_rgba(4,22,47,0.24)]">
          <CardContent className="space-y-5 pt-6">
            <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/10">
              <HandHeart className="size-5 text-white" />
            </div>
            <div className="space-y-3">
              <h2 className="font-heading text-3xl">{t("howToDonateTitle")}</h2>
              <p className="text-sm leading-7 text-white/74">
                {t("howToDonateDesc")}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <ButtonLink href={`mailto:${siteConfig.email}`} variant="secondary">
                <Mail className="size-4" />
                {t("sendEmail")}
              </ButtonLink>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {donationChannels.map((channel) => {
            const Icon = channel.icon;
            return (
              <Card
                key={channel.label}
                className="border border-white/10 bg-white shadow-[0_16px_40px_rgba(7,32,67,0.08)]"
              >
                <CardContent className="flex items-start gap-4 pt-6">
                  <div className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-brand-50)] text-[var(--color-brand-700)]">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      {channel.label}
                    </div>
                    <div className="mt-2 font-heading text-xl text-foreground">{channel.value}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-6 py-4">
        <SectionHeading
          eyebrow={t("sponsorEyebrow")}
          title={t("sponsorTitle")}
          description={t("sponsorDesc")}
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className="border border-white/10 bg-white shadow-[0_16px_40px_rgba(7,32,67,0.08)]"
            >
              <CardContent className="space-y-4 pt-6">
                <h2 className="font-heading text-2xl text-foreground">{tier.name}</h2>
                <p className="text-sm leading-6 text-muted-foreground">{tier.description}</p>
                <ul className="grid gap-2 text-sm text-slate-700">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-4">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div className="space-y-4">
            <SectionHeading
              eyebrow={t("contactEyebrow")}
              title={t("contactTitle")}
              description={t("contactDesc")}
            />
            <div className="space-y-3 rounded-[1.4rem] border border-foreground/8 bg-white p-5 shadow-sm">
              {tiers.map((tier) => (
                <div key={tier.name} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--dt-color-accent)]" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{tier.name}</p>
                    <p className="text-[12px] leading-5 text-muted-foreground">{tier.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Card className="border border-foreground/8 bg-white shadow-[0_16px_40px_rgba(7,32,67,0.08)]">
            <CardContent className="pt-6">
              <SponsorshipForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}
