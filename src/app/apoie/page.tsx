import type { Metadata } from "next";
import { ArrowRight, Building2, CheckCircle2, HandHeart, Heart, Landmark, Mail, Megaphone, ReceiptText, Shield, Zap } from "lucide-react";
import Link from "next/link";

import { PageShell } from "@/components/shared/page-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button-link";
import { SponsorshipForm } from "@/components/forms/sponsorship-form";
import { siteConfig, siteRoutes } from "@/lib/site";

const HOW_IT_WORKS = [
  { icon: Heart, step: "01", title: "Escolha o valor", desc: "€5, €10, €25, €50 ou outro valor à sua escolha." },
  { icon: Shield, step: "02", title: "Pague com segurança", desc: "Cartão, PayPal ou MB Way — rápido e encriptado." },
  { icon: CheckCircle2, step: "03", title: "Receba confirmação", desc: "Recibo enviado por email com referência da transação." },
];

export const metadata: Metadata = {
  title: "Apoie",
  description:
    "Formas de apoiar o Algarve TV Paradise através de donativos, patrocínios e parcerias institucionais.",
};

const supportWays = [
  {
    icon: HandHeart,
    title: "Doação pontual",
    description:
      "Contribuição direta para apoiar a manutenção da plataforma, produção editorial e cobertura regional.",
    details: ["Ideal para leitores e comunidade", "Apoio simples e direto", "Ajuda a manter o acesso aberto"],
  },
  {
    icon: Megaphone,
    title: "Patrocínio editorial",
    description:
      "Presença institucional em áreas estratégicas do site, com enquadramento claro e alinhado à identidade regional.",
    details: ["Destaque para marcas locais", "Associação a conteúdos regionais", "Visibilidade junto da comunidade"],
  },
  {
    icon: Building2,
    title: "Parceria institucional",
    description:
      "Colaboração com entidades, municípios, associações e empresas que querem valorizar o Algarve.",
    details: ["Projetos especiais", "Cobertura de iniciativas", "Relação contínua com a plataforma"],
  },
];

const donationChannels = [
  {
    label: "Transferência bancária",
    value: "IBAN disponível mediante contacto",
    icon: Landmark,
  },
  {
    label: "Pedido de fatura / recibo",
    value: siteConfig.email,
    icon: ReceiptText,
  },
];

const sponsorTiers = [
  {
    name: "Apoiante Local",
    description: "Para pequenos negócios e profissionais que querem apoiar a informação regional.",
    benefits: ["Menção em página de apoio", "Contacto direto com a equipa", "Presença associada à comunidade"],
  },
  {
    name: "Parceiro Regional",
    description: "Para empresas e entidades com presença regular no Algarve.",
    benefits: ["Destaque institucional", "Possibilidade de campanhas temáticas", "Relatórios simples de presença"],
  },
  {
    name: "Patrocinador Principal",
    description: "Para investidores e marcas que querem ligação forte ao crescimento da plataforma.",
    benefits: ["Presença prioritária", "Projetos editoriais especiais", "Planeamento de ativação com a equipa"],
  },
];

export default function SupportPage() {
  return (
    <PageShell
      eyebrow="Apoie"
      title="Ajude a fortalecer a informação regional do Algarve"
      description="O Algarve TV Paradise cresce com o apoio da comunidade, empresas e instituições que acreditam numa plataforma útil, simples e focada na região."
      primaryCta={{ label: "Falar sobre patrocínio", href: `mailto:${siteConfig.email}` }}
      secondaryCta={{ label: "Enviar sugestão", href: siteRoutes.community }}
    >
      {/* Donation CTA hero */}
      <section className="overflow-hidden rounded-[2rem] bg-[#04162f] p-8 text-white shadow-[0_24px_60px_rgba(4,22,47,0.28)] sm:p-10 lg:p-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
              <Zap className="size-3 text-[var(--dt-color-accent)]" />
              Donativo online
            </div>
            <div className="space-y-3">
              <h2 className="font-heading text-4xl leading-tight sm:text-5xl">
                Faça um donativo<br />
                <span className="text-[var(--dt-color-accent)]">agora</span>
              </h2>
              <p className="max-w-md text-[15px] leading-7 text-white/70">
                Em menos de um minuto pode contribuir para manter o Algarve TV Paradise
                gratuito, independente e focado na região.
              </p>
            </div>
            {/* Steps */}
            <div className="grid gap-4 sm:grid-cols-3">
              {HOW_IT_WORKS.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className="space-y-2 rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-white/40">{item.step}</span>
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
              className="group inline-flex items-center gap-3 rounded-[1.4rem] bg-white px-8 py-5 font-heading text-2xl text-[#04162f] shadow-[0_8px_32px_rgba(255,255,255,0.15)] transition-all duration-300 hover:shadow-[0_16px_48px_rgba(255,255,255,0.25)] hover:scale-[1.02]"
            >
              Fazer donativo
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="mt-3 text-center text-[12px] text-white/40">
              A partir de €1 · Seguro · Sem subscrição
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {supportWays.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
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
              <h2 className="font-heading text-3xl">Como doar</h2>
              <p className="text-sm leading-7 text-white/74">
                Para donativos, patrocínios ou apoio recorrente, entre em contacto com a equipa.
                Confirmamos o melhor meio de pagamento e enviamos os dados necessários.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <ButtonLink href={`mailto:${siteConfig.email}`} variant="secondary">
                <Mail className="size-4" />
                Enviar email
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
          eyebrow="Patrocínio"
          title="Modelos de apoio para marcas e instituições"
          description="A presença de patrocinadores deve ser clara, credível e útil para quem acompanha o Algarve."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {sponsorTiers.map((tier) => (
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

      {/* Sponsorship contact form */}
      <section className="py-4">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div className="space-y-4">
            <SectionHeading
              eyebrow="Contacto direto"
              title="Envie o seu pedido de patrocínio"
              description="Preencha o formulário e a nossa equipa responderá em até 48 horas úteis."
            />
            <div className="space-y-3 rounded-[1.4rem] border border-foreground/8 bg-white p-5 shadow-sm">
              {sponsorTiers.map((tier) => (
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
