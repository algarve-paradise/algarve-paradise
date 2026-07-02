"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImagePlus, LoaderCircle, Play, Save, Trash2 } from "lucide-react";

import { newsCategories, slugifyNewsTitle } from "@/lib/news-shared";
import { normalizeNewsFormValues, type NewsFormValues } from "@/lib/news-form";
import type { UserRole } from "@/lib/auth";
import { siteRoutes, withPreviewPrefix } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}

type NewsEditorFormProps = {
  mode: "create" | "edit";
  postId?: string;
  userRole?: UserRole;
  initialValues?: Partial<NewsFormValues>;
};

const defaultValues: NewsFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "Algarve",
  sourceName: "",
  sourceUrl: "",
  coverImageUrl: "",
  coverImagePath: "",
  youtubeUrl: "",
  featured: false,
  live: false,
  status: "draft",
};

export function NewsEditorForm({
  mode,
  postId,
  userRole = "admin",
  initialValues,
}: NewsEditorFormProps) {
  const isAdmin = userRole === "admin";
  const mergedInitialValues = { ...defaultValues, ...initialValues };

  const router = useRouter();
  const [values, setValues] = useState<NewsFormValues>(mergedInitialValues);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues?.slug));

  function updateValue<Key extends keyof NewsFormValues>(key: Key, value: NewsFormValues[Key]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleImageUpload(file: File) {
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    setIsUploading(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(payload?.error ?? "Nao foi possivel enviar a imagem.");
      return;
    }

    const payload = (await response.json()) as { url: string; path: string };
    setValues((current) => ({
      ...current,
      coverImageUrl: payload.url,
      coverImagePath: payload.path,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const payload = normalizeNewsFormValues(values);
      const response = await fetch(
        mode === "create" ? "/api/admin/posts" : `/api/admin/posts/${postId}`,
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
        setError(data?.error ?? "Nao foi possivel guardar a noticia.");
        return;
      }

      const nextId = data?.id ?? postId;
      setSuccess(mode === "create" ? "Noticia criada com sucesso." : "Noticia atualizada com sucesso.");

      if (mode === "create") {
        setValues(defaultValues);
        setSlugTouched(false);
        router.replace(withPreviewPrefix(siteRoutes.admin));
      } else if (postId) {
        router.replace(withPreviewPrefix(`${siteRoutes.admin}/noticias/${nextId}`));
      }

      router.refresh();
    });
  }

  const youtubePreviewId = values.youtubeUrl ? extractYouTubeId(values.youtubeUrl) : null;

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
              placeholder="Ex.: Faro reforca a agenda cultural da primavera"
              className="h-12 rounded-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Slug
            </label>
            <Input
              value={values.slug}
              onChange={(event) => {
                setSlugTouched(true);
                updateValue("slug", event.target.value);
              }}
              placeholder="faro-reforca-a-agenda-cultural-da-primavera"
              className="h-11 rounded-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Resumo
            </label>
            <Textarea
              value={values.excerpt}
              onChange={(event) => updateValue("excerpt", event.target.value)}
              placeholder="Resumo curto para os cards, homepage e listagens."
              className="min-h-28 rounded-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Corpo da noticia
            </label>
            <Textarea
              value={values.content}
              onChange={(event) => updateValue("content", event.target.value)}
              placeholder="Escreva o conteudo completo da noticia."
              className="min-h-72 rounded-none"
              required
            />
          </div>
        </div>

        <div className="space-y-6 border-l border-border pl-0 lg:pl-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Categoria
            </label>
            <select
              value={values.category}
              onChange={(event) =>
                updateValue("category", event.target.value as NewsFormValues["category"])
              }
              className="h-11 w-full border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring"
            >
              {newsCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Fonte
            </label>
            <Input
              value={values.sourceName ?? ""}
              onChange={(event) => updateValue("sourceName", event.target.value)}
              placeholder="Ex.: Redacao Algarve Portal"
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
                  onClick={() =>
                    setValues((current) => ({
                      ...current,
                      coverImageUrl: "",
                      coverImagePath: "",
                    }))
                  }
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
                  JPG, PNG ou WebP. A imagem e opcional — noticias institucionais ou
                  sem dimensao visual podem ficar sem capa.
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
            {isUploading ? (
              <p className="text-sm text-muted-foreground">A enviar imagem...</p>
            ) : null}
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

          {/* YouTube video */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              <Play className="size-3.5" />
              Video YouTube (opcional)
            </label>
            <Input
              value={values.youtubeUrl ?? ""}
              onChange={(event) => updateValue("youtubeUrl", event.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="h-11 rounded-none"
            />
            {youtubePreviewId ? (
              <div className="flex items-center gap-3 rounded border border-border bg-muted/40 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://img.youtube.com/vi/${youtubePreviewId}/mqdefault.jpg`}
                  alt="YouTube preview"
                  className="h-14 w-24 rounded object-cover"
                />
                <p className="text-xs text-muted-foreground">Video detectado. Sera incorporado na noticia.</p>
              </div>
            ) : values.youtubeUrl ? (
              <p className="text-xs text-red-600">Link do YouTube invalido.</p>
            ) : null}
          </div>

          {isAdmin && (
            <div className="grid gap-3">
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={values.featured}
                  onChange={(event) => updateValue("featured", event.target.checked)}
                />
                Destacar na homepage
              </label>
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={values.live}
                  onChange={(event) => updateValue("live", event.target.checked)}
                />
                Marcar como em foco / direto
              </label>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Estado
            </label>
            {isAdmin ? (
              <select
                value={values.status}
                onChange={(event) =>
                  updateValue("status", event.target.value as NewsFormValues["status"])
                }
                className="h-11 w-full border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring"
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
              </select>
            ) : (
              <div className="flex h-11 items-center border border-border bg-muted/40 px-3 text-sm text-muted-foreground">
                Rascunho — aguarda aprovacao do administrador
              </div>
            )}
          </div>
        </div>
      </section>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-700">{success}</p> : null}

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <Button type="submit" className="rounded-none" disabled={isPending || isUploading}>
          {isPending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
          {mode === "create" ? "Criar noticia" : "Guardar alteracoes"}
        </Button>
        {!isAdmin && (
          <p className="text-xs text-muted-foreground">
            O conteudo sera salvo como rascunho e publicado pelo administrador.
          </p>
        )}
      </div>
    </form>
  );
}
