import type { Metadata } from "next";
import { Building2, HandHeart, Landmark, Mail, Megaphone, ReceiptText } from "lucide-react";

import { PageShell } from "@/components/shared/page-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button-link";
import { siteConfig, siteRoutes } from "@/lib/site";

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
    </PageShell>
  );
}
