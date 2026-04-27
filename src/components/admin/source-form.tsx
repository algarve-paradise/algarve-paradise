"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Plus, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SourceFormValues = {
  name: string;
  url: string;
  type: "rss" | "sitemap" | "html" | "ical" | "api";
  region: string;
  content_kind: "news" | "events";
  default_category: "Algarve" | "Municipios" | "Economia" | "Turismo" | "Seguranca" | "Eventos";
  enabled: boolean;
  rate_limit_seconds: number;
};

type SourceFormProps = {
  mode: "add" | "edit";
  sourceId?: string;
  initial?: SourceFormValues;
  onClose: () => void;
};

const typeOptions: Array<{
  value: SourceFormValues["type"];
  label: string;
  hint: string;
}> = [
  { value: "rss", label: "RSS", hint: "Feed RSS 2.0 ou Atom — recomendado para noticias." },
  {
    value: "sitemap",
    label: "Sitemap",
    hint: "sitemap.xml + scraping de cada pagina (sem RSS disponivel).",
  },
  { value: "html", label: "HTML", hint: "Pagina unica monitorizada (artigo ou agenda)." },
  { value: "ical", label: "iCal", hint: "Calendario .ics — para eventos e agendas municipais." },
  {
    value: "api",
    label: "API JSON",
    hint: 'Endpoint publico que devolve [{url,title,summary?,published_at?}].',
  },
];

const categoryOptions: SourceFormValues["default_category"][] = [
  "Algarve",
  "Municipios",
  "Economia",
  "Turismo",
  "Seguranca",
  "Eventos",
];

const defaultValues: SourceFormValues = {
  name: "",
  url: "",
  type: "rss",
  region: "algarve",
  content_kind: "news",
  default_category: "Algarve",
  enabled: true,
  rate_limit_seconds: 300,
};

export function SourceForm({ mode, sourceId, initial, onClose }: SourceFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<SourceFormValues>(initial ?? defaultValues);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof SourceFormValues>(key: K, value: SourceFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const url = mode === "edit" ? `/api/admin/sources/${sourceId}` : "/api/admin/sources";
      const method = mode === "edit" ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "Nao foi possivel guardar a fonte.");
        return;
      }

      router.refresh();
      onClose();
    });
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-5 border border-border bg-muted/30 p-5"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-[0.24em]">
          {mode === "add" ? "Adicionar nova fonte" : "Editar fonte"}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Nome
          </label>
          <Input
            required
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Sul Informacao"
            className="h-10 rounded-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            URL
          </label>
          <Input
            required
            type="url"
            value={values.url}
            onChange={(e) => set("url", e.target.value)}
            placeholder="https://exemplo.pt/feed"
            className="h-10 rounded-none"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Tipo de fonte
        </label>
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {typeOptions.map((opt) => (
            <label
              key={opt.value}
              className={[
                "flex cursor-pointer flex-col gap-1 border p-3 transition-colors",
                values.type === opt.value
                  ? "border-foreground bg-muted/60"
                  : "border-border hover:bg-muted/20",
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value={opt.value}
                  checked={values.type === opt.value}
                  onChange={() => set("type", opt.value)}
                />
                <span className="text-xs font-semibold">{opt.label}</span>
              </div>
              <p className="pl-5 text-[11px] text-muted-foreground">{opt.hint}</p>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Conteudo
          </label>
          <select
            value={values.content_kind}
            onChange={(e) =>
              set("content_kind", e.target.value as SourceFormValues["content_kind"])
            }
            className="h-10 w-full border border-border bg-background px-3 text-sm"
          >
            <option value="news">Noticias</option>
            <option value="events">Eventos</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Categoria padrao
          </label>
          <select
            value={values.default_category}
            onChange={(e) =>
              set(
                "default_category",
                e.target.value as SourceFormValues["default_category"]
              )
            }
            className="h-10 w-full border border-border bg-background px-3 text-sm"
          >
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Regiao
          </label>
          <Input
            required
            value={values.region}
            onChange={(e) => set("region", e.target.value)}
            placeholder="algarve"
            className="h-10 rounded-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Intervalo minimo entre buscas (seg)
          </label>
          <Input
            type="number"
            min={0}
            max={86400}
            value={values.rate_limit_seconds}
            onChange={(e) => set("rate_limit_seconds", Number(e.target.value))}
            className="h-10 rounded-none"
          />
          <p className="text-[11px] text-muted-foreground">
            300 = respeitar 5 min entre runs. 0 = sem limite.
          </p>
        </div>
        <div className="flex items-end pb-2">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={values.enabled}
              onChange={(e) => set("enabled", e.target.checked)}
              className="size-4"
            />
            <span className="text-sm font-medium">Activa (incluir nos cron jobs)</span>
          </label>
        </div>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <div className="flex items-center gap-3 border-t border-border pt-4">
        <Button type="submit" className="rounded-none" disabled={isPending}>
          {isPending ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : mode === "add" ? (
            <Plus className="size-4" />
          ) : (
            <Save className="size-4" />
          )}
          {mode === "add" ? "Adicionar fonte" : "Guardar alteracoes"}
        </Button>
        <button
          type="button"
          onClick={onClose}
          className="text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
