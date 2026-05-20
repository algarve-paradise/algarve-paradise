import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Landmark, Signal, Users } from "lucide-react";

import { FounderCard } from "@/components/cards/founder-card";
import { PageShell } from "@/components/shared/page-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { aboutStory, founders, missionVisionValues } from "@/data/about";
import { editorialStats } from "@/data/site";
import { siteRoutes } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.about" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AboutPage() {
  const t = await getTranslations("pages.about");

  return (
    <PageShell
      eyebrow={aboutStory.eyebrow}
      title={aboutStory.title}
      description={aboutStory.description}
      primaryCta={{ label: t("seeNews"), href: siteRoutes.news }}
      secondaryCta={{ label: t("contacts"), href: siteRoutes.contact }}
      stats={editorialStats}
    >
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="border border-white/10 bg-[#04162f] text-white shadow-[0_24px_60px_rgba(4,22,47,0.24)]">
          <CardContent className="space-y-5 pt-6">
            <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/10">
              <Landmark className="size-5 text-white" />
            </div>
            <div className="space-y-3">
              <h2 className="font-heading text-3xl">História do projeto</h2>
              <p className="text-sm leading-7 text-white/74">
                A Algarve Paradise Media nasce com o objetivo de dar voz à região do Algarve,
                criando uma ponte entre a comunidade, as instituições e a informação relevante.
              </p>
              <p className="text-sm leading-7 text-white/74">
                O projeto responde à necessidade de modernizar a comunicação regional com um
                formato mais acessível, dinâmico e próximo das pessoas, sem perder rigor
                institucional.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="border border-white/10 bg-white shadow-[0_16px_40px_rgba(7,32,67,0.08)] sm:col-span-2">
            <CardContent className="grid gap-5 pt-6 md:grid-cols-3">
              <div className="space-y-3">
                <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[var(--color-brand-50)] text-[var(--color-brand-700)]">
                  <Signal className="size-5" />
                </div>
                <h3 className="font-heading text-xl text-foreground">Comunicação regional</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  Estrutura digital desenhada para notícias, informação útil e agenda do território.
                </p>
              </div>
              <div className="space-y-3">
                <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[var(--color-brand-50)] text-[var(--color-brand-700)]">
                  <Users className="size-5" />
                </div>
                <h3 className="font-heading text-xl text-foreground">Proximidade humana</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  A comunidade participa, acompanha e encontra um espaço de representação.
                </p>
              </div>
              <div className="space-y-3">
                <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[var(--color-brand-50)] text-[var(--color-brand-700)]">
                  <Landmark className="size-5" />
                </div>
                <h3 className="font-heading text-xl text-foreground">Credibilidade institucional</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  O tom e a estrutura visual foram pensados para dialogar com entidades locais.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-6 py-4">
        <SectionHeading
          eyebrow="Missão, visão e valores"
          title="Fundação institucional preparada para uma comunicação regional moderna"
          description="Os blocos abaixo definem o enquadramento editorial e institucional da associação."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {missionVisionValues.map((value) => (
            <Card
              key={value.title}
              className="border border-white/10 bg-white shadow-[0_16px_40px_rgba(7,32,67,0.08)]"
            >
              <CardContent className="space-y-4 pt-6">
                <div className="text-xs uppercase tracking-[0.24em] text-[var(--color-brand-700)]">
                  {value.tag}
                </div>
                <h2 className="font-heading text-2xl text-foreground">{value.title}</h2>
                <p className="text-sm leading-6 text-muted-foreground">{value.description}</p>
                <ul className="grid gap-2 text-sm text-slate-700">
                  {value.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-6 py-8">
        <SectionHeading
          eyebrow="Fundadores"
          title="Equipa fundadora com enquadramento profissional e institucional"
          description="Os retratos e descrições estão preparados para receber fotografia real e informação final."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {founders.map((item) => (
            <FounderCard key={item.name} item={item} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
