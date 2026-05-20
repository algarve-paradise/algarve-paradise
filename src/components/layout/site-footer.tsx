import Link from "next/link";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";

import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/shared/social-icons";

import { contactLinks } from "@/data/contacts";
import { navigationFooter } from "@/data/navigation";
import { siteConfig, siteRoutes } from "@/lib/site";
import { Container } from "@/components/layout/container";

export function SiteFooter() {
  return (
    <footer className="relative mt-10">
      <Container>
        <div className="relative overflow-hidden rounded-t-[2.5rem] border border-foreground/10 border-b-0 bg-white p-8 sm:p-12 lg:p-16">
          <div className="absolute -right-32 -top-32 size-72 rounded-full bg-[var(--dt-color-accent-soft)] blur-3xl pointer-events-none" />
          <div className="absolute -left-32 bottom-0 size-80 rounded-full bg-[var(--dt-color-mint)]/40 blur-3xl pointer-events-none" />

          <div className="relative grid gap-12 lg:grid-cols-[1.2fr_0.4fr_0.4fr]">
            <div className="space-y-5">
              <Link href="/" className="inline-flex items-center gap-2 group">
                <span className="relative inline-flex size-10 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-500 group-hover:rotate-[18deg]">
                  <span className="font-heading text-base font-semibold">A</span>
                </span>
                <span className="font-heading text-2xl tracking-tight">
                  Portal do <span className="italic">Algarve</span>
                </span>
              </Link>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                {siteConfig.description}
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-white px-3 py-1.5 text-xs text-foreground">
                  <Mail className="size-3" />
                  {siteConfig.email}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-white px-3 py-1.5 text-xs text-foreground">
                  <MapPin className="size-3" />
                  {siteConfig.location}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex size-10 items-center justify-center rounded-full border border-foreground/10 text-foreground transition-all duration-300 hover:bg-foreground hover:text-background hover:scale-110"
                >
                  <InstagramIcon className="size-4" />
                </a>
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex size-10 items-center justify-center rounded-full border border-foreground/10 text-foreground transition-all duration-300 hover:bg-foreground hover:text-background hover:scale-110"
                >
                  <FacebookIcon className="size-4" />
                </a>
                <a
                  href={siteConfig.social.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex size-10 items-center justify-center rounded-full border border-foreground/10 text-foreground transition-all duration-300 hover:bg-foreground hover:text-background hover:scale-110"
                >
                  <YoutubeIcon className="size-4" />
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Navegação
              </h2>
              <div className="grid gap-1">
                {navigationFooter.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-foreground transition-colors hover:text-[var(--dt-color-accent)]"
                  >
                    <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    <span className="link-tech">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Contacto
              </h2>
              <div className="grid gap-2">
                {contactLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="rounded-2xl border border-foreground/10 bg-[var(--dt-color-bg)] px-4 py-3 transition-all duration-300 hover:border-foreground hover:bg-white"
                  >
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {item.label}
                    </div>
                    <div className="mt-0.5 text-sm font-medium text-foreground">{item.value}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="relative mt-12 flex flex-col gap-3 border-t border-foreground/8 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} O Portal do Algarve. Informação regional, comunidade e agenda.</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <Link href={siteRoutes.privacyPolicy} className="hover:text-foreground transition-colors">
                Política de Privacidade
              </Link>
              <Link href={siteRoutes.cookiePolicy} className="hover:text-foreground transition-colors">
                Política de Cookies
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
