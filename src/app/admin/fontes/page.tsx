import { AlertCircle, CheckCircle2, Clock, Globe, Rss } from "lucide-react";

import { AdminShell } from "@/components/admin/admin-shell";
import { AddSourceButton } from "@/components/admin/add-source-button";
import { SourceActions } from "@/components/admin/source-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { IngestSourceType, IngestContentKind } from "@/lib/ingest/types";
import type { NewsCategory } from "@/types/content";

export const dynamic = "force-dynamic";

type SourceRow = {
  id: string;
  name: string;
  url: string;
  type: IngestSourceType;
  region: string;
  content_kind: IngestContentKind;
  default_category: NewsCategory;
  enabled: boolean;
  rate_limit_seconds: number;
  last_fetched_at: string | null;
  last_error: string | null;
  total_rewritten: number;
  total_published: number;
  total_rejected: number;
  total_failed: number;
  quality_score: number | null;
};

type CategoryStat = {
  category: string;
  total: number;
  published: number;
  rejected: number;
};

const TYPE_LABELS: Record<IngestSourceType, string> = {
  rss: "RSS",
  sitemap: "Sitemap",
  html: "HTML",
  ical: "iCal",
  api: "API JSON",
};

const TYPE_DESCRIPTIONS: Record<IngestSourceType, { what: string; example: string; best: string }> = {
  rss: {
    what: "Feed RSS 2.0 ou Atom publicado pelo site de origem.",
    example: "https://sulinformacao.pt/feed/",
    best: "Noticias. Recomendado sempre que disponivel.",
  },
  sitemap: {
    what: "Ficheiro sitemap.xml — o pipeline visita cada URL e extrai o artigo.",
    example: "https://exemplo.pt/sitemap.xml",
    best: "Noticias em sites sem RSS. Mais lento (1 pedido por artigo).",
  },
  html: {
    what: "Pagina HTML unica monitorizada (ex.: pagina de comunicados).",
    example: "https://cm-faro.pt/noticias/recentes",
    best: "Noticias de uma pagina especifica. Limite: 1 artigo por run.",
  },
  ical: {
    what: "Calendario iCalendar (.ics) com eventos futuros.",
    example: "https://cm-faro.pt/agenda.ics",
    best: "Eventos e agenda cultural/municipal.",
  },
  api: {
    what: 'Endpoint JSON publico. Espera array: [{url, title, summary?, published_at?}].',
    example: "https://api.visitalgarve.pt/events",
    best: "Integracoes oficiais (Visit Algarve, parceiros com API).",
  },
};

async function getSources(): Promise<SourceRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("ingest_source_quality")
    .select("*")
    .order("content_kind", { ascending: true })
    .order("enabled", { ascending: false })
    .order("quality_score", { ascending: false, nullsFirst: false });
  return (data ?? []) as SourceRow[];
}

async function getCategoryStats(): Promise<CategoryStat[]> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("news_posts")
    .select("category, status")
    .eq("ai_generated", true);

  const map = new Map<string, CategoryStat>();
  for (const row of data ?? []) {
    const cat = row.category as string;
    const existing = map.get(cat) ?? { category: cat, total: 0, published: 0, rejected: 0 };
    existing.total += 1;
    if (row.status === "published") existing.published += 1;
    map.set(cat, existing);
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function scoreColor(score: number | null): string {
  if (score === null) return "text-muted-foreground";
  if (score >= 0.7) return "text-emerald-700";
  if (score >= 0.4) return "text-amber-700";
  return "text-red-700";
}

export default async function AdminFontesPage() {
  const user = await requireUser();
  const [sources, categoryStats] = await Promise.all([getSources(), getCategoryStats()]);

  const newsSources = sources.filter((s) => s.content_kind === "news");
  const eventSources = sources.filter((s) => s.content_kind === "events");
  const activeSources = sources.filter((s) => s.enabled);

  return (
    <AdminShell
      title="Fontes de IA"
      description="Gere as fontes de onde a IA resgata noticias e eventos. O cron usa apenas as fontes activas."
      userLabel={user.email ?? "utilizador autenticado"}
    >
      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Total de fontes", value: sources.length, icon: Globe },
          { label: "Activas", value: activeSources.length, icon: CheckCircle2 },
          { label: "Noticias", value: newsSources.length, icon: Rss },
          { label: "Eventos", value: eventSources.length, icon: Clock },
        ].map((item) => (
          <Card key={item.label} className="rounded-none border border-border shadow-none">
            <CardContent className="flex items-center justify-between pt-6">
              <div className="space-y-1">
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

      {/* Supported types guide */}
      <Card className="mt-8 rounded-none border border-border shadow-none">
        <CardHeader className="border-b border-border">
          <CardTitle>Tipos de fonte suportados pela IA</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  <th className="py-3">Tipo</th>
                  <th className="py-3">O que e</th>
                  <th className="py-3">Exemplo de URL</th>
                  <th className="py-3">Melhor para</th>
                </tr>
              </thead>
              <tbody>
                {(Object.keys(TYPE_DESCRIPTIONS) as IngestSourceType[]).map((t) => (
                  <tr key={t} className="border-b border-border/50">
                    <td className="py-3 pr-6">
                      <span className="inline-block border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]">
                        {TYPE_LABELS[t]}
                      </span>
                    </td>
                    <td className="py-3 pr-6 text-sm text-muted-foreground">
                      {TYPE_DESCRIPTIONS[t].what}
                    </td>
                    <td className="py-3 pr-6 text-xs font-mono text-muted-foreground">
                      {TYPE_DESCRIPTIONS[t].example}
                    </td>
                    <td className="py-3 text-sm">{TYPE_DESCRIPTIONS[t].best}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Sources tables */}
      {(
        [
          { kind: "news" as const, label: "Fontes de noticias", rows: newsSources },
          { kind: "events" as const, label: "Fontes de eventos", rows: eventSources },
        ] as const
      ).map(({ kind, label, rows }) => (
        <Card key={kind} className="mt-8 rounded-none border border-border shadow-none">
          <CardHeader className="border-b border-border">
            <CardTitle>
              {label}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({rows.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {rows.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      <th className="py-4">Nome / URL</th>
                      <th className="py-4">Tipo</th>
                      <th className="py-4">Regiao</th>
                      <th className="py-4">Categoria</th>
                      <th className="py-4 text-right">Score</th>
                      <th className="py-4 text-right">Pub / Esc / Falha</th>
                      <th className="py-4">Ultima busca</th>
                      <th className="py-4">Estado</th>
                      <th className="py-4">Acoes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((source) => (
                      <tr
                        key={source.id}
                        className={[
                          "border-b border-border/70 align-top",
                          !source.enabled ? "opacity-50" : "",
                        ].join(" ")}
                      >
                        <td className="py-4 pr-4">
                          <div className="space-y-0.5">
                            <span className="block text-sm font-medium">{source.name}</span>
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block max-w-[220px] truncate text-xs text-muted-foreground hover:underline"
                            >
                              {source.url}
                            </a>
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          <span className="border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]">
                            {TYPE_LABELS[source.type]}
                          </span>
                        </td>
                        <td className="py-4 pr-4 text-sm capitalize">{source.region}</td>
                        <td className="py-4 pr-4 text-sm">{source.default_category}</td>
                        <td className="py-4 pr-4 text-right">
                          <span
                            className={[
                              "text-sm font-semibold tabular-nums",
                              scoreColor(source.quality_score),
                            ].join(" ")}
                          >
                            {source.quality_score !== null
                              ? `${Math.round(Number(source.quality_score) * 100)}%`
                              : "—"}
                          </span>
                        </td>
                        <td className="py-4 pr-4 text-right text-xs tabular-nums text-muted-foreground">
                          <span className="text-emerald-700">{source.total_published}</span>
                          {" / "}
                          <span className="text-amber-700">{source.total_rewritten}</span>
                          {" / "}
                          <span className="text-red-700">{source.total_failed}</span>
                        </td>
                        <td className="py-4 pr-4 text-xs text-muted-foreground">
                          <span className="block">{formatDate(source.last_fetched_at)}</span>
                          {source.last_error ? (
                            <span className="mt-0.5 flex items-center gap-1 text-red-700">
                              <AlertCircle className="size-3 shrink-0" />
                              <span className="max-w-[160px] truncate">{source.last_error}</span>
                            </span>
                          ) : null}
                        </td>
                        <td className="py-4 pr-4">
                          <span
                            className={[
                              "text-[10px] font-semibold uppercase tracking-[0.16em] border px-2 py-0.5",
                              source.enabled
                                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                                : "border-border bg-muted text-muted-foreground",
                            ].join(" ")}
                          >
                            {source.enabled ? "Activa" : "Pausada"}
                          </span>
                        </td>
                        <SourceActions
                          source={{
                            id: source.id,
                            name: source.name,
                            url: source.url,
                            type: source.type,
                            region: source.region,
                            content_kind: source.content_kind,
                            default_category: source.default_category,
                            enabled: source.enabled,
                            rate_limit_seconds: source.rate_limit_seconds,
                          }}
                        />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="py-6 text-sm text-muted-foreground">
                Nenhuma fonte de {kind === "news" ? "noticias" : "eventos"} cadastrada ainda.
              </p>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Add source */}
      <div className="mt-8">
        <AddSourceButton />
      </div>

      {/* Category performance */}
      {categoryStats.length > 0 ? (
        <Card className="mt-8 rounded-none border border-border shadow-none">
          <CardHeader className="border-b border-border">
            <CardTitle>Performance por categoria (noticias IA)</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    <th className="py-4">Categoria</th>
                    <th className="py-4 text-right">Total IA</th>
                    <th className="py-4 text-right">Publicadas</th>
                    <th className="py-4 text-right">Taxa de publicacao</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryStats.map((stat) => {
                    const rate = stat.total > 0 ? stat.published / stat.total : 0;
                    return (
                      <tr key={stat.category} className="border-b border-border/70">
                        <td className="py-3 pr-6 text-sm font-medium">{stat.category}</td>
                        <td className="py-3 pr-6 text-right text-sm tabular-nums">
                          {stat.total}
                        </td>
                        <td className="py-3 pr-6 text-right text-sm tabular-nums text-emerald-700">
                          {stat.published}
                        </td>
                        <td className="py-3 text-right">
                          <span
                            className={[
                              "text-sm font-semibold tabular-nums",
                              rate >= 0.7
                                ? "text-emerald-700"
                                : rate >= 0.4
                                  ? "text-amber-700"
                                  : "text-red-700",
                            ].join(" ")}
                          >
                            {stat.total > 0 ? `${Math.round(rate * 100)}%` : "—"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Taxa de publicacao = publicadas / total geradas pela IA. Inclui auto-publicadas e aprovadas manualmente.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </AdminShell>
  );
}
