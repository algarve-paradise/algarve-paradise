import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { siteConfig, siteRoutes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: `Como o ${siteConfig.name} utiliza cookies e tecnologias similares.`,
};

const LAST_UPDATED = "20 de maio de 2026";

const COOKIE_TABLE = [
  {
    category: "Essenciais",
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    cookies: [
      { name: "algarve_consent", purpose: "Regista a sua escolha de consentimento de cookies.", duration: "1 ano" },
      { name: "sb-*", purpose: "Sessão de autenticação Supabase (apenas utilizadores registados).", duration: "Sessão" },
    ],
  },
  {
    category: "Analytics",
    color: "text-blue-700 bg-blue-50 border-blue-200",
    cookies: [
      { name: "_ga, _gid", purpose: "Google Analytics — métricas de uso anónimas.", duration: "2 anos / 24h" },
      { name: "_gat", purpose: "Throttle de pedidos ao Google Analytics.", duration: "1 minuto" },
    ],
  },
  {
    category: "Marketing",
    color: "text-amber-700 bg-amber-50 border-amber-200",
    cookies: [
      { name: "fbp", purpose: "Facebook Pixel — rastreamento para campanhas.", duration: "3 meses" },
      { name: "yt-*", purpose: "YouTube — funcionalidade de vídeos incorporados.", duration: "Variável" },
    ],
  },
];

export default function CookiePolicyPage() {
  return (
    <Container>
      <div className="mx-auto max-w-3xl py-14 sm:py-20">
        {/* Header */}
        <div className="mb-10 space-y-3">
          <span className="inline-block rounded-full border border-foreground/10 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            LGPD · RGPD
          </span>
          <h1 className="font-heading text-4xl text-foreground sm:text-5xl">
            Política de Cookies
          </h1>
          <p className="text-sm text-muted-foreground">
            Última atualização: <strong>{LAST_UPDATED}</strong>
          </p>
        </div>

        <div className="space-y-8 text-[15px] leading-7 text-foreground/80">

          <section>
            <h2 className="font-heading text-2xl text-foreground">O que são cookies?</h2>
            <p className="mt-3">
              Cookies são pequenos ficheiros de texto armazenados no seu dispositivo quando visita um site.
              São amplamente utilizados para fazer os sites funcionarem de forma eficiente e para fornecer
              informações aos seus proprietários. No <strong>{siteConfig.name}</strong>, utilizamos cookies
              para garantir o funcionamento da plataforma e, com o seu consentimento, para melhorar a sua experiência.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-foreground">Categorias de cookies que utilizamos</h2>
            <p className="mt-3 mb-5">
              Organizamos os nossos cookies em três categorias. Pode gerir as suas preferências a qualquer
              momento através do banner de cookies ou{" "}
              <Link href={siteRoutes.privacyPolicy} className="text-[var(--dt-color-accent)] underline underline-offset-2">
                Política de Privacidade
              </Link>
              .
            </p>

            <div className="space-y-5">
              {COOKIE_TABLE.map((group) => (
                <div key={group.category} className="overflow-hidden rounded-[1.4rem] border border-foreground/10 bg-white">
                  <div className={`flex items-center gap-2 border-b border-foreground/8 px-5 py-3 ${group.color} border`}>
                    <span className="text-sm font-semibold">{group.category}</span>
                    {group.category === "Essenciais" && (
                      <span className="rounded-full border border-current/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider opacity-70">
                        Sempre ativos
                      </span>
                    )}
                  </div>
                  <div className="divide-y divide-foreground/6">
                    {group.cookies.map((cookie) => (
                      <div key={cookie.name} className="grid grid-cols-[auto_1fr_auto] gap-4 px-5 py-4 text-sm">
                        <code className="self-start rounded bg-[var(--dt-color-bg)] px-2 py-0.5 font-mono text-[12px] text-foreground">
                          {cookie.name}
                        </code>
                        <span className="text-muted-foreground">{cookie.purpose}</span>
                        <span className="shrink-0 text-[12px] text-muted-foreground">{cookie.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-foreground">Como gerir as suas preferências</h2>
            <p className="mt-3">
              Pode alterar as suas preferências de cookies a qualquer momento clicando em "Gerir cookies"
              no rodapé do site, ou limpando os cookies do seu browser nas definições do mesmo.
            </p>
            <p className="mt-3">
              Note que desativar certos cookies pode afetar a funcionalidade do site. Os cookies essenciais
              não podem ser desativados pois são necessários para o funcionamento básico da plataforma.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-foreground">Cookies de terceiros</h2>
            <p className="mt-3">
              Alguns cookies são colocados por serviços de terceiros que aparecem nas nossas páginas
              (ex: vídeos do YouTube, mapas). Estes cookies estão sujeitos às políticas de privacidade
              desses terceiros e apenas são ativados com o seu consentimento explícito na categoria
              respetiva.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-foreground">Contacto</h2>
            <p className="mt-3">
              Para questões sobre o uso de cookies, contacte-nos em{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-[var(--dt-color-accent)] underline underline-offset-2">
                {siteConfig.email}
              </a>
              {" "}ou consulte a nossa{" "}
              <Link href={siteRoutes.privacyPolicy} className="text-[var(--dt-color-accent)] underline underline-offset-2">
                Política de Privacidade
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
