import type { Metadata } from "next";
import { Globe, Mail, MapPin, Phone, Video } from "lucide-react";
import Link from "next/link";

import { ContactForm } from "@/components/forms/contact-form";
import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { contactLinks, socialLinks } from "@/data/contacts";
import { siteRoutes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contactos",
  description: "Pagina de contactos institucionais da Algarve Paradise Media.",
};

const icons = {
  Email: Mail,
  Telefone: Phone,
  Localizacao: MapPin,
};

export default function ContactPage() {
  return (
    <PageShell
      eyebrow="Contactos"
      title="Entre em contacto"
      description="Para sugestões, envio de conteúdos ou parcerias, entre em contacto connosco através dos canais disponíveis."
      primaryCta={{ label: "Apoiar o projeto", href: siteRoutes.support }}
      secondaryCta={{ label: "Sobre o projeto", href: siteRoutes.about }}
    >
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-4">
          {contactLinks.map((item) => {
            const Icon = icons[item.label as keyof typeof icons];

            return (
              <Card
                key={item.label}
                className="border border-white/10 bg-white shadow-[0_16px_40px_rgba(7,32,67,0.08)]"
              >
                <CardContent className="space-y-3 pt-6">
                  <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[var(--color-brand-50)] text-[var(--color-brand-700)]">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      {item.label}
                    </div>
                    <div className="mt-2 font-heading text-xl text-foreground">{item.value}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Card className="border border-white/10 bg-[#04162f] text-white shadow-[0_24px_60px_rgba(4,22,47,0.24)]">
            <CardContent className="space-y-5 pt-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/60">
                <Globe className="size-4 text-[var(--color-signal)]" />
                Redes e canais
              </div>
              <div className="grid gap-3">
                {socialLinks.map((item, index) => {
                  const Icon = index === 2 ? Video : Globe;

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-white/6 px-4 py-4 transition hover:bg-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="inline-flex size-10 items-center justify-center rounded-2xl bg-white/10">
                          <Icon className="size-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{item.label}</div>
                          <div className="text-sm text-white/60">{item.handle}</div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        <ContactForm />
      </section>
    </PageShell>
  );
}
