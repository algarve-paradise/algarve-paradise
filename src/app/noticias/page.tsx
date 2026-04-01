import type { Metadata } from "next";
import { ArrowRight, Radio } from "lucide-react";

import { NewsCard } from "@/components/cards/news-card";
import { PageShell } from "@/components/shared/page-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button-link";
import { newsCategories, newsItems } from "@/data/news";
import { editorialStats } from "@/data/site";
import { siteRoutes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Noticias",
  description: "Portal de noticias regionais da Algarve Paradise Media.",
};

export default function NewsPage() {
  const [lead, ...rest] = newsItems;
  const liveItems = newsItems.filter((item) => item.live);

  return (
    <PageShell
      eyebrow="Noticias"
      title="Portal editorial pensado para acompanhar a atualidade regional"
      description="A pagina organiza destaques, categorias e listagem noticiosa com uma hierarquia clara, preparada para receber conteudos finais."
      primaryCta={{ label: "Ver videos", href: siteRoutes.tv }}
      secondaryCta={{ label: "Eventos", href: siteRoutes.events }}
      stats={editorialStats}
    >
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <NewsCard item={lead} featured anchorId={lead.slug} />
        <Card className="border border-white/10 bg-[#04162f] text-white shadow-[0_24px_60px_rgba(4,22,47,0.24)]">
          <CardContent className="space-y-5 pt-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/60">
              <Radio className="size-4 text-[var(--color-signal)]" />
              Em foco
            </div>
            <div className="space-y-3">
              <h2 className="font-heading text-3xl">Edicao regional do momento</h2>
              <p className="text-sm leading-7 text-white/74">
                A pagina de noticias organiza a leitura editorial por categorias, destaques e
                atualidade recente, com uma linguagem de portal regional moderno.
              </p>
            </div>
            <div className="grid gap-3">
              {liveItems.length ? (
                liveItems.map((item) => (
                  <div
                    key={item.slug}
                    className="rounded-[1.5rem] border border-white/10 bg-white/7 px-4 py-4"
                  >
                    <div className="text-[11px] uppercase tracking-[0.24em] text-white/55">
                      {item.category}
                    </div>
                    <div className="mt-2 font-heading text-lg">{item.title}</div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-white/10 bg-white/7 px-4 py-4 text-sm text-white/72">
                  Sem emissoes em direto assinaladas nesta fase.
                </div>
              )}
            </div>
            <ButtonLink href={siteRoutes.tv} variant="secondary" className="w-fit rounded-full">
              Ver reportagens
              <ArrowRight className="size-4" />
            </ButtonLink>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Categorias"
          title="Leitura rapida por areas editoriais"
          description="Os filtros estao representados visualmente nesta fase, sem logica dinamica adicional."
        />
        <div className="flex flex-wrap gap-3">
          {newsCategories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-[color:var(--color-brand-200)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-brand-700)]"
            >
              {category}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-6 py-10">
        <SectionHeading
          eyebrow="Edicao atual"
          title="Destaques e noticias recentes"
          description="Estrutura modular pronta para futura paginacao, filtros reais e rotas individuais."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {rest.map((item) => (
            <NewsCard key={item.slug} item={item} featured={item.featured} anchorId={item.slug} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
