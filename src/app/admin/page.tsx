import Link from "next/link";
import { Bot, CalendarDays, ExternalLink, PenSquare, Radio, Sparkles, SquarePen } from "lucide-react";

import { AdminShell } from "@/components/admin/admin-shell";
import { AiDraftActions } from "@/components/admin/ai-draft-actions";
import { AutoPublishCountdown } from "@/components/admin/auto-publish-countdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getAdminNewsList, getAdminSummary, getAiDraftQueue } from "@/lib/news";
import { getAdminEventsList, getAiEventDraftQueue } from "@/lib/events";

const ITEMS_PER_PAGE = 8;
const AI_QUEUE_PER_PAGE = 5;

type AdminDashboardPageProps = {
  searchParams: Promise<{
    filter?: string;
    page?: string;
    aiPage?: string;
    evPage?: string;
  }>;
};

type Params = {
  filter?: string;
  page?: string;
  aiPage?: string;
  evPage?: string;
};

function buildHref(current: Params, overrides: Partial<Params>) {
  const merged = { ...current, ...overrides };
  const params = new URLSearchParams();
  if (merged.filter && merged.filter !== "all") params.set("filter", merged.filter);
  if (merged.page && Number(merged.page) > 1) params.set("page", merged.page);
  if (merged.aiPage && Number(merged.aiPage) > 1) params.set("aiPage", merged.aiPage);
  if (merged.evPage && Number(merged.evPage) > 1) params.set("evPage", merged.evPage);
  const query = params.toString();
  return query ? `/admin?${query}` : "/admin";
}

function PaginationBar({
  currentPage,
  totalPages,
  prevHref,
  nextHref,
  label,
}: {
  currentPage: number;
  totalPages: number;
  prevHref: string;
  nextHref: string;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-border pt-5 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
      <p>{label}</p>
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={prevHref}
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
          href={nextHref}
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
  );
}

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  const user = await requireUser();
  const [params, items, events, summary, aiQueue, aiEventQueue] = await Promise.all([
    searchParams,
    getAdminNewsList(),
    getAdminEventsList(),
    getAdminSummary(),
    getAiDraftQueue(),
    getAiEventDraftQueue(),
  ]);

  // News list pagination
  const activeFilter = params.filter === "published" || params.filter === "draft" ? params.filter : "all";
  const filteredItems =
    activeFilter === "all" ? items : items.filter((item) => item.status === activeFilter);
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(
    Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1),
    totalPages
  );
  const pageItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // AI news queue pagination
  const aiTotalPages = Math.max(1, Math.ceil(aiQueue.length / AI_QUEUE_PER_PAGE));
  const aiCurrentPage = Math.min(
    Math.max(1, Number.parseInt(params.aiPage ?? "1", 10) || 1),
    aiTotalPages
  );
  const aiPageItems = aiQueue.slice(
    (aiCurrentPage - 1) * AI_QUEUE_PER_PAGE,
    aiCurrentPage * AI_QUEUE_PER_PAGE
  );

  // AI events queue pagination
  const evTotalPages = Math.max(1, Math.ceil(aiEventQueue.length / AI_QUEUE_PER_PAGE));
  const evCurrentPage = Math.min(
    Math.max(1, Number.parseInt(params.evPage ?? "1", 10) || 1),
    evTotalPages
  );
  const evPageItems = aiEventQueue.slice(
    (evCurrentPage - 1) * AI_QUEUE_PER_PAGE,
    evCurrentPage * AI_QUEUE_PER_PAGE
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
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {[
          { label: "Total de noticias", value: summary.total, icon: SquarePen },
          { label: "Reportagens", value: items.filter((item) => item.category === "Reportagem").length, icon: Radio },
          { label: "Eventos", value: events.length, icon: CalendarDays },
          { label: "Publicadas", value: summary.published, icon: Sparkles },
          { label: "Destaques", value: summary.featured, icon: PenSquare },
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
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                ({aiQueue.length})
              </span>
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
                  {aiPageItems.map((item) => (
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
            {aiTotalPages > 1 ? (
              <PaginationBar
                currentPage={aiCurrentPage}
                totalPages={aiTotalPages}
                prevHref={buildHref(params, { aiPage: String(Math.max(1, aiCurrentPage - 1)) })}
                nextHref={buildHref(params, { aiPage: String(Math.min(aiTotalPages, aiCurrentPage + 1)) })}
                label={`A mostrar ${aiPageItems.length} de ${aiQueue.length} rascunho(s) pendentes.`}
              />
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {aiEventQueue.length ? (
        <Card className="mt-8 rounded-none border border-border shadow-none">
          <CardHeader className="flex-row items-center justify-between gap-4 border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="size-5" />
              Fila de revisao da IA — Eventos
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                ({aiEventQueue.length})
              </span>
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
                  {evPageItems.map((event) => (
                    <tr key={event.id} className="border-b border-border/70 align-top">
                      <td className="py-4 pr-6">
                        <Link
                          href={`/admin/eventos/${event.id}`}
                          className="font-medium hover:underline"
                        >
                          {event.title}
                        </Link>
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
            {evTotalPages > 1 ? (
              <PaginationBar
                currentPage={evCurrentPage}
                totalPages={evTotalPages}
                prevHref={buildHref(params, { evPage: String(Math.max(1, evCurrentPage - 1)) })}
                nextHref={buildHref(params, { evPage: String(Math.min(evTotalPages, evCurrentPage + 1)) })}
                label={`A mostrar ${evPageItems.length} de ${aiEventQueue.length} evento(s) pendentes.`}
              />
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <Card className="mt-8 rounded-none border border-border shadow-none">
        <CardHeader className="border-b border-border">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle>Eventos cadastrados</CardTitle>
            <Link
              href="/admin/eventos/novo"
              className="inline-flex h-9 w-fit items-center gap-2 border border-border px-3 text-xs font-semibold uppercase tracking-[0.18em] transition-colors hover:bg-muted"
            >
              <CalendarDays className="size-4" />
              Novo evento
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {events.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    <th className="py-4">Evento</th>
                    <th className="py-4">Data</th>
                    <th className="py-4">Local</th>
                    <th className="py-4">Estado</th>
                    <th className="py-4">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {events.slice(0, ITEMS_PER_PAGE).map((event) => (
                    <tr key={event.id} className="border-b border-border/70 align-top">
                      <td className="py-4 pr-6">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium">{event.title}</span>
                            {event.aiGenerated ? (
                              <span className="inline-flex items-center gap-1 border border-border bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]">
                                <Bot className="size-3" /> IA
                              </span>
                            ) : null}
                          </div>
                          <div className="max-w-md text-sm text-muted-foreground">
                            {event.description}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-6 text-sm">{event.date}</td>
                      <td className="py-4 pr-6 text-sm">{event.location}</td>
                      <td className="py-4 pr-6 text-sm capitalize">
                        {event.status === "published" ? "Publicado" : "Rascunho"}
                      </td>
                      <td className="py-4">
                        <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em]">
                          <Link href={`/admin/eventos/${event.id}`} className="hover:underline">
                            Editar
                          </Link>
                          <Link href={event.href} className="hover:underline">
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
              Nenhum evento cadastrado ainda. Use o cadastro manual para alimentar a agenda.
            </div>
          )}
        </CardContent>
      </Card>

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
                    href={buildHref(params, { filter: option.key, page: "1" })}
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
            <PaginationBar
              currentPage={currentPage}
              totalPages={totalPages}
              prevHref={buildHref(params, { page: String(Math.max(1, currentPage - 1)) })}
              nextHref={buildHref(params, { page: String(Math.min(totalPages, currentPage + 1)) })}
              label={`A mostrar ${pageItems.length} de ${filteredItems.length} noticia(s) no filtro atual.`}
            />
          ) : null}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
