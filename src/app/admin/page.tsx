import Link from "next/link";
import { Bot, CalendarDays, ExternalLink, PenSquare, Radio, Sparkles, SquarePen } from "lucide-react";

import { AdminShell } from "@/components/admin/admin-shell";
import { AiDraftActions } from "@/components/admin/ai-draft-actions";
import { AutoPublishCountdown } from "@/components/admin/auto-publish-countdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getAdminNewsList, getAdminSummary, getAiDraftQueue } from "@/lib/news";
import { getAiEventDraftQueue } from "@/lib/events";

const ITEMS_PER_PAGE = 8;

type AdminDashboardPageProps = {
  searchParams: Promise<{
    filter?: string;
    page?: string;
  }>;
};

function buildDashboardHref(filter: string, page: number) {
  const params = new URLSearchParams();

  if (filter !== "all") {
    params.set("filter", filter);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `/admin?${query}` : "/admin";
}

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  const user = await requireUser();
  const [params, items, summary, aiQueue, aiEventQueue] = await Promise.all([
    searchParams,
    getAdminNewsList(),
    getAdminSummary(),
    getAiDraftQueue(),
    getAiEventDraftQueue(),
  ]);
  const activeFilter = params.filter === "published" || params.filter === "draft" ? params.filter : "all";
  const filteredItems =
    activeFilter === "all"
      ? items
      : items.filter((item) => item.status === activeFilter);
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(
    Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1),
    totalPages
  );
  const pageItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const filterOptions = [
    { key: "all", label: "Todas", count: items.length },
    { key: "published", label: "Publicadas", count: summary.published },
    { key: "draft", label: "Rascunhos", count: items.length - summary.published },
  ] as const;

  return (
    <AdminShell
      title="Dashboard editorial"
      description="Area preparada para gerir noticias manualmente e supervisionar a automacao por IA."
      userLabel={user.email ?? "utilizador autenticado"}
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Total de noticias", value: summary.total, icon: SquarePen },
          { label: "Publicadas", value: summary.published, icon: Sparkles },
          { label: "Destaques", value: summary.featured, icon: PenSquare },
          { label: "Em foco", value: summary.live, icon: Radio },
          { label: "Pendentes da IA", value: summary.aiPending + aiEventQueue.length, icon: Bot },
        ].map((item) => (
          <Card key={item.label} className="rounded-none border border-border shadow-none">
            <CardContent className="flex items-center justify-between pt-6">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="font-heading text-4xl">{item.value}</p>
              </div>
              <item.icon className="size-6 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </section>

      {aiQueue.length ? (
        <Card className="mt-8 rounded-none border border-border shadow-none">
          <CardHeader className="flex-row items-center justify-between gap-4 border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <Bot className="size-5" />
              Fila de revisao da IA — Noticias
            </CardTitle>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Itens nao revistos sao auto-publicados ao fim da janela.
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    <th className="py-4">Titulo</th>
                    <th className="py-4">Categoria</th>
                    <th className="py-4">Confianca</th>
                    <th className="py-4">Fonte</th>
                    <th className="py-4">Auto-publicacao</th>
                    <th className="py-4">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {aiQueue.map((item) => (
                    <tr key={item.id} className="border-b border-border/70 align-top">
                      <td className="py-4 pr-6">
                        <div className="space-y-1">
                          <Link
                            href={`/admin/noticias/${item.id}`}
                            className="font-medium hover:underline"
                          >
                            {item.title}
                          </Link>
                          <div className="max-w-md text-sm text-muted-foreground">
                            {item.excerpt}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-6 text-sm">{item.category}</td>
                      <td className="py-4 pr-6 text-sm">
                        {item.aiConfidence != null
                          ? `${Math.round(Number(item.aiConfidence) * 100)}%`
                          : "-"}
                      </td>
                      <td className="py-4 pr-6 text-sm">
                        {item.sourceUrl ? (
                          <a
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 hover:underline"
                          >
                            {item.sourceName ?? "fonte"}
                            <ExternalLink className="size-3" />
                          </a>
                        ) : (
                          item.sourceName ?? "-"
                        )}
                      </td>
                      <td className="py-4 pr-6">
                        <AutoPublishCountdown deadline={item.aiReviewDeadline ?? null} />
                      </td>
                      <td className="py-4">
                        {item.id ? <AiDraftActions postId={item.id} /> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {aiEventQueue.length ? (
        <Card className="mt-8 rounded-none border border-border shadow-none">
          <CardHeader className="flex-row items-center justify-between gap-4 border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="size-5" />
              Fila de revisao da IA — Eventos
            </CardTitle>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Eventos nao revistos sao auto-publicados ao fim da janela.
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    <th className="py-4">Evento</th>
                    <th className="py-4">Data</th>
                    <th className="py-4">Local</th>
                    <th className="py-4">Confianca</th>
                    <th className="py-4">Auto-publicacao</th>
                    <th className="py-4">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {aiEventQueue.map((event) => (
                    <tr key={event.id} className="border-b border-border/70 align-top">
                      <td className="py-4 pr-6">
                        <div className="font-medium">{event.title}</div>
                        <div className="max-w-md text-sm text-muted-foreground">
                          {event.description}
                        </div>
                      </td>
                      <td className="py-4 pr-6 text-sm">{event.date}</td>
                      <td className="py-4 pr-6 text-sm">{event.location}</td>
                      <td className="py-4 pr-6 text-sm">
                        {event.aiConfidence != null
                          ? `${Math.round(Number(event.aiConfidence) * 100)}%`
                          : "-"}
                      </td>
                      <td className="py-4 pr-6">
                        <AutoPublishCountdown deadline={event.aiReviewDeadline ?? null} />
                      </td>
                      <td className="py-4">
                        {event.id ? <AiDraftActions postId={event.id} kind="event" /> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card className="mt-8 rounded-none border border-border shadow-none">
        <CardHeader className="border-b border-border">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle>Noticias cadastradas</CardTitle>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => {
                const isActive = activeFilter === option.key;

                return (
                  <Link
                    key={option.key}
                    href={buildDashboardHref(option.key, 1)}
                    className={[
                      "inline-flex h-9 items-center gap-2 border px-3 text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
                      isActive
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-foreground hover:bg-muted",
                    ].join(" ")}
                  >
                    {option.label}
                    <span className={isActive ? "text-background/80" : "text-muted-foreground"}>
                      {option.count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {pageItems.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    <th className="py-4">Titulo</th>
                    <th className="py-4">Categoria</th>
                    <th className="py-4">Estado</th>
                    <th className="py-4">Atualizacao</th>
                    <th className="py-4">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((item) => (
                    <tr key={item.id} className="border-b border-border/70 align-top">
                      <td className="py-4 pr-6">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium">{item.title}</span>
                            {item.aiGenerated ? (
                              <span className="inline-flex items-center gap-1 border border-border bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]">
                                <Bot className="size-3" /> IA
                              </span>
                            ) : null}
                          </div>
                          <div className="max-w-md text-sm text-muted-foreground">
                            {item.excerpt}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-6 text-sm">{item.category}</td>
                      <td className="py-4 pr-6 text-sm capitalize">
                        {item.status === "published" ? "Publicado" : "Rascunho"}
                      </td>
                      <td className="py-4 pr-6 text-sm text-muted-foreground">
                        {new Date(item.date).toLocaleDateString("pt-PT")}
                      </td>
                      <td className="py-4">
                        <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em]">
                          <Link href={`/admin/noticias/${item.id}`} className="hover:underline">
                            Editar
                          </Link>
                          <Link href={item.href} className="hover:underline">
                            Ver no site
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-sm text-muted-foreground">
              Nenhuma noticia encontrada neste filtro. Ajuste a visualizacao ou crie um novo conteudo.
            </div>
          )}
          {filteredItems.length ? (
            <div className="flex flex-col gap-4 border-t border-border pt-5 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
              <p>
                A mostrar {pageItems.length} de {filteredItems.length} noticia(s) no filtro atual.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={buildDashboardHref(activeFilter, Math.max(1, currentPage - 1))}
                  aria-disabled={currentPage === 1}
                  className={[
                    "inline-flex h-9 items-center border px-3 text-xs font-semibold uppercase tracking-[0.18em]",
                    currentPage === 1
                      ? "pointer-events-none border-border text-muted-foreground/50"
                      : "border-border text-foreground hover:bg-muted",
                  ].join(" ")}
                >
                  Anterior
                </Link>
                <span className="px-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Pagina {currentPage} de {totalPages}
                </span>
                <Link
                  href={buildDashboardHref(activeFilter, Math.min(totalPages, currentPage + 1))}
                  aria-disabled={currentPage === totalPages}
                  className={[
                    "inline-flex h-9 items-center border px-3 text-xs font-semibold uppercase tracking-[0.18em]",
                    currentPage === totalPages
                      ? "pointer-events-none border-border text-muted-foreground/50"
                      : "border-border text-foreground hover:bg-muted",
                  ].join(" ")}
                >
                  Seguinte
                </Link>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
