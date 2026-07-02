"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Save, Trash2 } from "lucide-react";

import { siteRoutes, withPreviewPrefix } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type CronicaFormValues = {
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  authorAvatarUrl: string;
  weekLabel: string;
  status: "draft" | "published";
};

type CronicaEditorFormProps = {
  mode: "create" | "edit";
  cronicaId?: string;
  initialValues?: Partial<CronicaFormValues>;
};

const defaultValues: CronicaFormValues = {
  title: "",
  content: "",
  authorName: "",
  authorRole: "",
  authorAvatarUrl: "",
  weekLabel: "",
  status: "draft",
};

export function CronicaEditorForm({ mode, cronicaId, initialValues }: CronicaEditorFormProps) {
  const [values, setValues] = useState<CronicaFormValues>({ ...defaultValues, ...initialValues });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function update<K extends keyof CronicaFormValues>(key: K, value: CronicaFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleDelete() {
    if (!cronicaId || !confirm("Tem certeza que deseja apagar esta cronica?")) return;

    const response = await fetch(`/api/admin/cronicas/${cronicaId}`, { method: "DELETE" });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Nao foi possivel apagar a cronica.");
      return;
    }

    router.replace(withPreviewPrefix(`${siteRoutes.admin}/cronicas`));
    router.refresh();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const payload = {
        title: values.title,
        content: values.content,
        authorName: values.authorName,
        authorRole: values.authorRole || null,
        authorAvatarUrl: values.authorAvatarUrl || null,
        weekLabel: values.weekLabel,
        status: values.status,
      };

      const response = await fetch(
        mode === "create" ? "/api/admin/cronicas" : `/api/admin/cronicas/${cronicaId}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = (await response.json().catch(() => null)) as
        | { error?: string; id?: string }
        | null;

      if (!response.ok) {
        setError(data?.error ?? "Nao foi possivel guardar a cronica.");
        return;
      }

      setSuccess(mode === "create" ? "Cronica criada com sucesso." : "Cronica atualizada com sucesso.");

      if (mode === "create") {
        router.replace(withPreviewPrefix(`${siteRoutes.admin}/cronicas`));
      } else {
        router.replace(withPreviewPrefix(`${siteRoutes.admin}/cronicas/${cronicaId}`));
      }

      router.refresh();
    });
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Titulo da cronica
            </label>
            <Input
              value={values.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Ex.: O Algarve que nao aparece nas revistas"
              className="h-12 rounded-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Texto da cronica
            </label>
            <Textarea
              value={values.content}
              onChange={(e) => update("content", e.target.value)}
              placeholder="Escreva o texto da cronica aqui..."
              className="min-h-72 rounded-none"
              required
            />
          </div>
        </div>

        <div className="space-y-6 border-l border-border pl-0 lg:pl-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Rotulo da semana
            </label>
            <Input
              value={values.weekLabel}
              onChange={(e) => update("weekLabel", e.target.value)}
              placeholder="Ex.: Semana de 6 a 12 de Maio, 2026"
              className="h-11 rounded-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Nome do autor
            </label>
            <Input
              value={values.authorName}
              onChange={(e) => update("authorName", e.target.value)}
              placeholder="Ex.: Maria Sousa"
              className="h-11 rounded-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Cargo / descricao do autor (opcional)
            </label>
            <Input
              value={values.authorRole}
              onChange={(e) => update("authorRole", e.target.value)}
              placeholder="Ex.: Cronista e jornalista"
              className="h-11 rounded-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              URL da foto do autor (opcional)
            </label>
            <Input
              value={values.authorAvatarUrl}
              onChange={(e) => update("authorAvatarUrl", e.target.value)}
              placeholder="https://..."
              className="h-11 rounded-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Estado
            </label>
            <select
              value={values.status}
              onChange={(e) => update("status", e.target.value as "draft" | "published")}
              className="h-11 w-full border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring"
            >
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </div>
        </div>
      </section>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-700">{success}</p> : null}

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <Button type="submit" className="rounded-none" disabled={isPending}>
          {isPending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
          {mode === "create" ? "Criar cronica" : "Guardar alteracoes"}
        </Button>

        {mode === "edit" && cronicaId ? (
          <Button
            type="button"
            variant="outline"
            className="rounded-none text-red-700 hover:bg-red-50"
            onClick={handleDelete}
            disabled={isPending}
          >
            <Trash2 className="size-4" />
            Apagar
          </Button>
        ) : null}
      </div>
    </form>
  );
}
