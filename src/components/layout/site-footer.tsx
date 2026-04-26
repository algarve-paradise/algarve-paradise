import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

import { contactLinks } from "@/data/contacts";
import { navigationFooter } from "@/data/navigation";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/layout/container";

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-foreground bg-background">
      <Container className="py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <Link href="/" className="font-heading text-3xl sm:text-4xl tracking-tight text-foreground">
              O Portal do Algarve
            </Link>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">{siteConfig.description}</p>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="size-3" />
                {siteConfig.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="size-3" />
                {siteConfig.phone}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3" />
                {siteConfig.location}
              </span>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Navegação
              </h2>
              <div className="grid gap-2 text-sm">
                {navigationFooter.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-1.5 text-foreground hover:text-muted-foreground transition-colors"
                  >
                    <ArrowUpRight className="size-3" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Contacto
              </h2>
              <div className="grid gap-2 text-sm">
                {contactLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="border border-border px-3 py-2.5 hover:bg-muted/30 transition-colors"
                  >
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {item.label}
                    </div>
                    <div className="mt-0.5 text-sm font-medium text-foreground">{item.value}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} O Portal do Algarve. Informação regional, comunidade e agenda do Algarve.</p>
          <p>Primeira versão preparada para receber conteúdos e imagem final.</p>
        </div>
      </Container>
    </footer>
  );
}
