import { getTranslations } from "next-intl/server";
import { ArrowRight, Mail, MessageSquareMore, Sparkles } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { homeClosing } from "@/data/home";

export async function HomeClosingSection() {
  const t = await getTranslations("home.closing");

  return (
    <section className="relative py-16 sm:py-24">
      <Container>
        <div
          data-reveal-clip
          className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.8rem] border border-foreground/10 bg-foreground text-background p-8 sm:p-12 lg:p-16"
        >
          {/* Decorative gradients */}
          <div className="absolute -right-32 -top-32 size-[420px] rounded-full bg-[var(--dt-color-accent)]/30 blur-3xl" />
          <div className="absolute -left-20 bottom-0 size-72 rounded-full bg-[var(--dt-color-sky)]/20 blur-3xl" />
          <div className="absolute inset-0 bg-grid-dark opacity-30" />

          <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div data-reveal-children className="space-y-6">
              <span data-reveal-child className="pill pill-glass text-foreground inline-flex w-fit">
                <Sparkles className="size-3" />
                {t("missionPill")}
              </span>
              <h2
                data-reveal-child
                className="font-heading text-[2rem] sm:text-4xl lg:text-[2.8rem] leading-[1.05] tracking-tight"
              >
                {homeClosing.title}
              </h2>
              <p data-reveal-child className="max-w-md text-[15px] leading-relaxed text-white/75">
                {homeClosing.description}
              </p>

              <div data-reveal-child className="flex flex-wrap gap-3 pt-2">
                <Link
                  href={homeClosing.primaryCta.href}
                  className="group inline-flex items-center gap-2 rounded-full bg-white text-foreground px-5 py-3 text-[13px] font-semibold transition-all duration-300 hover:bg-[var(--dt-color-accent)] hover:text-white"
                >
                  {homeClosing.primaryCta.label}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
                {homeClosing.secondaryCta ? (
                  <Link
                    href={homeClosing.secondaryCta.href}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-[13px] font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/40"
                  >
                    {homeClosing.secondaryCta.label}
                  </Link>
                ) : null}
              </div>
            </div>

            <div data-reveal-grid className="grid gap-4 sm:grid-cols-2 self-end">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 transition-colors duration-300 hover:bg-white/10">
                <Mail className="size-5 text-[var(--dt-color-accent)]" />
                <h3 className="mt-3 font-heading text-lg">{t("contact1Title")}</h3>
                <p className="mt-1 text-xs leading-5 text-white/65">{t("contact1Desc")}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 transition-colors duration-300 hover:bg-white/10">
                <MessageSquareMore className="size-5 text-[var(--dt-color-accent)]" />
                <h3 className="mt-3 font-heading text-lg">{t("contact2Title")}</h3>
                <p className="mt-1 text-xs leading-5 text-white/65">{t("contact2Desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
