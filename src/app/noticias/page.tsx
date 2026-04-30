import type { Metadata } from "next";
import Link from "next/link";
import { Radio, Search, X } from "lucide-react";

import { NewsCard } from "@/components/cards/news-card";
import { PageShell } from "@/components/shared/page-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { editorialStats } from "@/data/site";
import { getPublishedNews } from "@/lib/news";
import { newsCategories } from "@/lib/news-shared";
import { siteRoutes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Noticias",
  description: "Portal de noticias regionais da Algarve Paradise Media.",
};

type NewsPageProps = {
  searchParams: Promise<{
    categoria?: string;
    q?: string;
  }>;
};

function buildNewsHref(category?: string, query?: string) {
  const params = new URLSearchParams();
  if (category) params.set("categoria", category);
  if (query) params.set("q", query);
  const qs = params.toString();
  return qs ? `${siteRoutes.news}?${qs}` : siteRoutes.news;
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const allNewsItems = await getPublishedNews();
  const visibleCategories = newsCategories.filter((category) => category !== "Reportagem");
  const activeCategory = visibleCategories.includes(params.categoria as (typeof visibleCategories)[number])
    ? params.categoria
    : undefined;
  const query = (params.q ?? "").trim();
  const normalizedQuery = query.toLocaleLowerCase("pt-PT");

  const newsItems = allNewsItems.filter((item) => {
    const matchesCategory = !activeCategory || item.category === activeCategory;
    const searchable = [
      item.title,
      item.excerpt,
      item.content,
      item.category,
      item.region,
      item.sourceName,
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("pt-PT");
    const matchesSearch = !normalizedQuery || searchable.includes(normalizedQuery);

    return matchesCategory && matchesSearch;
  });

  const [lead, ...rest] = newsItems;
  const liveItems = newsItems.filter((item) => item.live);

  return (
    <PageShell
      eyebrow="Notícias"
      title="Notícias do Algarve"
      description="Acompanhe as principais notícias da região, organizadas de forma clara para facilitar o acesso à informação."
      primaryCta={{ label: "Ver eventos", href: siteRoutes.events }}
      secondaryCta={{ label: "Comunidade", href: siteRoutes.community }}
      stats={editorialStats}
    >
      {lead ? (
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
                  A pagina de noticias passa a consumir conteudo real do painel editorial e esta
                  pronta para receber automacao nas proximas fases.
                </p>
              </div>
              <div className="grid gap-3">
                {liveItems.length ? (
                  liveItems.map((item) => (
                    <Link
                      key={item.slug}
                      href={item.href}
                      className="rounded-[1.5rem] border border-white/10 bg-white/7 px-4 py-4 transition-colors hover:bg-white/12"
                    >
                      <div className="text-[11px] uppercase tracking-[0.24em] text-white/55">
                        {item.category}
                      </div>
                      <div className="mt-2 font-heading text-lg">{item.title}</div>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/7 px-4 py-4 text-sm text-white/72">
                    Sem noticias em foco neste momento.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      ) : (
        <Card className="rounded-none border border-border shadow-none">
          <CardContent className="pt-6 text-sm leading-7 text-muted-foreground">
            Ainda nao existem noticias publicadas. Assim que criar a primeira no painel administrativo,
            ela passara a aparecer automaticamente aqui.
          </CardContent>
        </Card>
      )}

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Categorias"
          title="Encontre notícias por tema ou palavra-chave"
          description="Use os filtros para consultar rapidamente as áreas editoriais e pesquisar conteúdos publicados."
        />
        <form action={siteRoutes.news} className="grid gap-3 rounded-[1.4rem] border border-foreground/10 bg-white p-4 shadow-[0_16px_40px_rgba(7,32,67,0.06)] sm:grid-cols-[1fr_auto]">
          {activeCategory ? (
            <input type="hidden" name="categoria" value={activeCategory} />
          ) : null}
          <label className="relative block">
            <span className="sr-only">Pesquisar notícias</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Pesquisar por tema, local ou palavra-chave"
              className="h-12 w-full rounded-full border border-foreground/10 bg-[var(--dt-color-bg)] pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-[var(--dt-color-accent)] focus:bg-white focus:ring-4 focus:ring-[var(--dt-color-accent)]/10"
            />
          </label>
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-semibold text-background transition hover:bg-[var(--dt-color-accent)]"
          >
            <Search className="size-4" />
            Pesquisar
          </button>
        </form>
        <div className="flex flex-wrap gap-3">
          <Link
            href={buildNewsHref(undefined, query)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
              !activeCategory
                ? "border-[var(--dt-color-accent)] bg-[var(--dt-color-accent)] text-white"
                : "border-[color:var(--color-brand-200)] bg-white text-[var(--color-brand-700)] hover:border-[var(--dt-color-accent)]"
            }`}
          >
            Todas
          </Link>
          {visibleCategories.map((category) => (
            <Link
              key={category}
              href={buildNewsHref(category, query)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                activeCategory === category
                  ? "border-[var(--dt-color-accent)] bg-[var(--dt-color-accent)] text-white"
                  : "border-[color:var(--color-brand-200)] bg-white text-[var(--color-brand-700)] hover:border-[var(--dt-color-accent)]"
              }`}
            >
              {category}
            </Link>
          ))}
          {(activeCategory || query) ? (
            <Link
              href={siteRoutes.news}
              className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-white px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-[var(--dt-color-accent)] hover:text-foreground"
            >
              <X className="size-4" />
              Limpar
            </Link>
          ) : null}
        </div>
      </section>

      <section className="space-y-6 py-10">
        <SectionHeading
          eyebrow="Edicao atual"
          title="Destaques e noticias recentes"
          description="Estrutura modular pronta para futura paginacao, filtros reais e rotas individuais."
        />
        {newsItems.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {rest.map((item) => (
              <NewsCard key={item.slug} item={item} featured={item.featured} anchorId={item.slug} />
            ))}
          </div>
        ) : (
          <Card className="rounded-[1.2rem] border border-foreground/10 bg-white shadow-none">
            <CardContent className="pt-6 text-sm leading-7 text-muted-foreground">
              Nenhuma notícia encontrada para os filtros atuais. Experimente outra categoria ou
              limpe a pesquisa.
            </CardContent>
          </Card>
        )}
      </section>
    </PageShell>
  );
}
