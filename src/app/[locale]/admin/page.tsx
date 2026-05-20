import Link from "next/link";
import { CalendarDays, NotebookPen, PenSquare, Sparkles, SquarePen } from "lucide-react";

import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getAdminCronicas } from "@/lib/cronicas";
import { getAdminNewsList, getAdminSummary } from "@/lib/news";
import { getAdminEventsList } from "@/lib/events";

const ITEMS_PER_PAGE = 8;

type AdminDashboardPageProps = {
  searchParams: Promise<{
    filter?: string;
    page?: string;
  }>;
};

type Params = {
  filter?: string;
  page?: string;
};

function buildHref(current: Params, overrides: Partial<Params>) {
  const merged = { ...current, ...overrides };
  const params = new URLSearchParams();
  if (merged.filter && merged.filter !== "all") params.set("filter", merged.filter);
  if (merged.page && Number(merged.page) > 1) params.set("page", merged.page);
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
  const [params, items, events, summary, cronicas] = await Promise.all([
    searchParams,
    getAdminNewsList(),
    getAdminEventsList(),
    getAdminSummary(),
    getAdminCronicas(),
  ]);

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

  const eventNewsItems = items.filter((item) => item.category === "Eventos");
  const dashboardEventRows = [
    ...events.map((event) => ({
      id: event.id ?? event.slug,
      title: event.title,
      description: event.description,
      date: event.date,
      sortDate: event.startsAt ?? "",
      location: event.location,
      status: event.status ?? "draft",
      href: event.href,
      editHref: `/admin/eventos/${event.id}`,
    })),
    ...eventNewsItems.map((item) => ({
      id: item.id ?? item.slug,
      title: item.title,
      description: item.excerpt,
      date: new Date(item.date).toLocaleDateString("pt-PT"),
      sortDate: item.date,
      location: item.region ?? "Algarve",
      status: item.status ?? "draft",
      href: item.href,
      editHref: `/admin/noticias/${item.id}`,
    })),
  ].sort((a, b) => {
    const dateA = a.sortDate ? new Date(a.sortDate).getTime() : 0;
    const dateB = b.sortDate ? new Date(b.sortDate).getTime() : 0;
    return dateB - dateA;
  });

  const filterOptions = [
    { key: "all", label: "Todas", count: items.length },
    { key: "published", label: "Publicadas", count: summary.published },
    { key: "draft", label: "Rascunhos", count: items.length - summary.published },
  ] as const;

  return (
    <AdminShell
      title="Dashboard editorial"
      description="Area de gestao editorial de noticias, eventos e cronicas."
      userLabel={user.email ?? "utilizador autenticado"}
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {[
          { label: "Total de noticias", value: summary.total, icon: SquarePen },
          { label: "Eventos", value: dashboardEventRows.length, icon: CalendarDays },
          { label: "Publicadas", value: summary.published, icon: Sparkles },
          { label: "Destaques", value: summary.featured, icon: PenSquare },
          { label: "Cronicas", value: cronicas.length, icon: NotebookPen },
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
          {dashboardEventRows.length ? (
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
                  {dashboardEventRows.slice(0, ITEMS_PER_PAGE).map((event) => (
                    <tr key={event.id} className="border-b border-border/70 align-top">
                      <td className="py-4 pr-6">
                        <div className="space-y-1">
                          <span className="font-medium">{event.title}</span>
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
                          <Link href={event.editHref} className="hover:underline">
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
              Nenhum evento cadastrado ainda. Use o formulario para criar o primeiro.
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
                          <span className="font-medium">{item.title}</span>
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
              Nenhuma noticia encontrada neste filtro.
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
