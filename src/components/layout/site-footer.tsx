import Link from "next/link";
import {
  ArrowUpRight,
  Globe,
  Mail,
  MapPin,
  MonitorPlay,
  Phone,
  Video,
} from "lucide-react";

import { contactLinks } from "@/data/contacts";
import { navigationFooter } from "@/data/navigation";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/layout/container";
import { BrandMark } from "@/components/shared/brand-mark";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#04162f] text-white">
      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <BrandMark inverted />
            <p className="max-w-xl text-sm leading-6 text-white/72">{siteConfig.description}</p>
            <div className="flex flex-wrap gap-2 text-sm text-white/74">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1">
                <Mail className="size-4" />
                {siteConfig.email}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1">
                <Phone className="size-4" />
                {siteConfig.phone}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1">
                <MapPin className="size-4" />
                {siteConfig.location}
              </span>
            </div>
            <div className="flex gap-3">
              <Link
                href={siteConfig.social.instagram}
                aria-label="Instagram da Algarve Paradise Media"
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/6 transition hover:bg-white/12"
              >
                <Globe className="size-4" />
              </Link>
              <Link
                href={siteConfig.social.facebook}
                aria-label="Facebook da Algarve Paradise Media"
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/6 transition hover:bg-white/12"
              >
                <MonitorPlay className="size-4" />
              </Link>
              <Link
                href={siteConfig.social.youtube}
                aria-label="YouTube da Algarve Paradise Media"
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/6 transition hover:bg-white/12"
              >
                <Video className="size-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-4">
              <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.24em] text-white/50">
                Navegacao
              </h2>
              <div className="grid gap-2 text-sm">
                {navigationFooter.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 text-white/78 transition hover:text-white"
                  >
                    <ArrowUpRight className="size-4" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.24em] text-white/50">
                Contacto
              </h2>
              <div className="grid gap-2 text-sm">
                {contactLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 transition hover:bg-white/10"
                  >
                    <div className="text-xs uppercase tracking-[0.24em] text-white/45">
                      {item.label}
                    </div>
                    <div className="mt-1 font-medium text-white">{item.value}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="flex flex-col gap-3 text-sm text-white/52 sm:flex-row sm:items-center sm:justify-between">
          <p>Algarve Paradise Media. Informacao regional, comunidade e agenda do Algarve.</p>
          <p>Primeira versao preparada para receber conteudos e imagem final.</p>
        </div>
      </Container>
    </footer>
  );
}
