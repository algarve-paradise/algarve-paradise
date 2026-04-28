"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImagePlus, LoaderCircle, Save, Trash2 } from "lucide-react";

import { slugifyNewsTitle } from "@/lib/news-shared";
import { normalizeEventFormValues, type EventFormValues } from "@/lib/event-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type EventEditorFormProps = {
  mode: "create" | "edit";
  eventId?: string;
  initialValues?: Partial<EventFormValues>;
};

const defaultValues: EventFormValues = {
  title: "",
  slug: "",
  description: "",
  location: "",
  startsAt: "",
  endsAt: "",
  sourceName: "",
  sourceUrl: "",
  coverImageUrl: "",
  coverImagePath: "",
  status: "draft",
};

export function EventEditorForm({ mode, eventId, initialValues }: EventEditorFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<EventFormValues>({
    ...defaultValues,
    ...initialValues,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues?.slug));

  function updateValue<Key extends keyof EventFormValues>(key: Key, value: EventFormValues[Key]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleImageUpload(file: File) {
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
    setIsUploading(false);

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? "Nao foi possivel enviar a imagem.");
      return;
    }

    const body = (await response.json()) as { url: string; path: string };
    setValues((current) => ({
      ...current,
      coverImageUrl: body.url,
      coverImagePath: body.path,
    }));
  }

  function clearCoverImage() {
    setValues((current) => ({ ...current, coverImageUrl: "", coverImagePath: "" }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const payload = normalizeEventFormValues(values);
      const response = await fetch(
        mode === "create" ? "/api/admin/events" : `/api/admin/events/${eventId}`,
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
        setError(data?.error ?? "Nao foi possivel guardar o evento.");
        return;
      }

      const nextId = data?.id ?? eventId;
      setSuccess(mode === "create" ? "Evento criado com sucesso." : "Evento atualizado com sucesso.");

      if (mode === "create") {
        setValues(defaultValues);
        setSlugTouched(false);
        router.replace("/admin");
      } else if (nextId) {
        router.replace(`/admin/eventos/${nextId}`);
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
              Titulo
            </label>
            <Input
              value={values.title}
              onChange={(event) => {
                const nextTitle = event.target.value;
                setValues((current) => ({
                  ...current,
                  title: nextTitle,
                  slug: slugTouched ? current.slug : slugifyNewsTitle(nextTitle),
                }));
              }}
              className="h-12 rounded-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Slug
            </label>
            <Input
              value={values.slug ?? ""}
              onChange={(event) => {
                setSlugTouched(true);
                updateValue("slug", event.target.value);
              }}
              className="h-11 rounded-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Descricao
            </label>
            <Textarea
              value={values.description}
              onChange={(event) => updateValue("description", event.target.value)}
              className="min-h-44 rounded-none"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Inicio
              </label>
              <Input
                type="datetime-local"
                value={values.startsAt}
                onChange={(event) => updateValue("startsAt", event.target.value)}
                className="h-11 rounded-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Fim (opcional)
              </label>
              <Input
                type="datetime-local"
                value={values.endsAt ?? ""}
                onChange={(event) => updateValue("endsAt", event.target.value)}
                className="h-11 rounded-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6 border-l border-border pl-0 lg:pl-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Local
            </label>
            <Input
              value={values.location}
              onChange={(event) => updateValue("location", event.target.value)}
              className="h-11 rounded-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Fonte
            </label>
            <Input
              value={values.sourceName ?? ""}
              onChange={(event) => updateValue("sourceName", event.target.value)}
              className="h-11 rounded-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              URL da fonte
            </label>
            <Input
              value={values.sourceUrl ?? ""}
              onChange={(event) => updateValue("sourceUrl", event.target.value)}
              placeholder="https://..."
              className="h-11 rounded-none"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Imagem de capa
              </span>
              {values.coverImageUrl ? (
                <button
                  type="button"
                  onClick={clearCoverImage}
                  className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-red-700 hover:underline"
                >
                  <Trash2 className="size-3" /> Remover
                </button>
              ) : null}
            </div>
            <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-border bg-muted/40 px-5 text-center">
              <ImagePlus className="size-6 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {values.coverImageUrl ? "Substituir imagem" : "Selecionar imagem (opcional)"}
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG ou WebP. Eventos sem capa funcionam normalmente; o card mostra um
                  placeholder.
                </p>
              </div>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void handleImageUpload(file);
                }}
              />
            </label>
            {isUploading ? <p className="text-sm text-muted-foreground">A enviar imagem...</p> : null}
            {values.coverImageUrl ? (
              <Image
                src={values.coverImageUrl}
                alt={values.title || "Imagem de capa"}
                width={1200}
                height={675}
                className="h-52 w-full border border-border object-cover"
              />
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Estado
            </label>
            <select
              value={values.status}
              onChange={(event) =>
                updateValue("status", event.target.value as EventFormValues["status"])
              }
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
        <Button type="submit" className="rounded-none" disabled={isPending || isUploading}>
          {isPending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
          {mode === "create" ? "Criar evento" : "Guardar alteracoes"}
        </Button>
      </div>
    </form>
  );
}
