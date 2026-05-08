"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";

import type { NewsComment } from "@/lib/comments";
import { formatDateLong } from "@/lib/utils";

type FormState = "idle" | "loading" | "error";

type NewsCommentFormProps = {
  slug: string;
  initialComments: NewsComment[];
};

const fieldClass =
  "w-full rounded-2xl border border-foreground/10 bg-[var(--dt-color-bg)] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition focus:border-[var(--dt-color-accent)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[var(--dt-color-accent)]/10 disabled:opacity-60";

export function NewsCommentForm({ slug, initialComments }: NewsCommentFormProps) {
  const [comments, setComments] = useState(initialComments);
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setErrorMsg("");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch(`/api/news/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("nome"),
          comment: data.get("comentario"),
        }),
      });

      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        setErrorMsg(json.error ?? "Erro ao enviar comentário.");
        setState("error");
        return;
      }

      setComments((current) => [json.comment as NewsComment, ...current]);
      form.reset();
      setState("idle");
    } catch {
      setErrorMsg("Erro de ligação. Tente novamente.");
      setState("error");
    }
  }

  return (
    <section className="space-y-5 rounded-[1.6rem] border border-foreground/10 bg-white p-5 shadow-[0_16px_40px_rgba(7,32,67,0.06)] sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[var(--dt-color-accent)]">
            <MessageCircle className="size-4" />
            Comentários
          </div>
          <h2 className="mt-2 font-heading text-2xl text-foreground">Participe nesta notícia</h2>
        </div>
        <span className="rounded-full bg-[var(--dt-color-accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--dt-color-accent)]">
          {comments.length} comentário(s)
        </span>
      </div>

      <form className="grid gap-3" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nome"
          placeholder="O seu nome"
          className={fieldClass}
          maxLength={80}
          required
          disabled={state === "loading"}
        />
        <textarea
          name="comentario"
          placeholder="Escreva o seu comentário, sugestão ou complemento à notícia."
          className={`${fieldClass} min-h-28 resize-none`}
          maxLength={800}
          required
          disabled={state === "loading"}
        />
        {state === "error" ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
            {errorMsg}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={state === "loading"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:bg-[var(--dt-color-accent)] disabled:opacity-60 sm:w-fit"
        >
          {state === "loading" ? "A enviar..." : "Enviar comentário"}
          <Send className="size-4" />
        </button>
      </form>

      <div className="grid gap-3 pt-2">
        {comments.length ? (
          comments.map((item) => (
            <article
              key={item.id}
              className="rounded-[1.2rem] border border-foreground/8 bg-[var(--dt-color-bg)] p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-heading text-lg text-foreground">{item.name}</h3>
                <time className="text-xs text-muted-foreground">
                  {formatDateLong(item.created_at)}
                </time>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.comment}</p>
            </article>
          ))
        ) : (
          <p className="rounded-[1.2rem] border border-dashed border-foreground/12 bg-[var(--dt-color-bg)] p-4 text-sm text-muted-foreground">
            Ainda não há comentários nesta notícia. Seja a primeira pessoa a participar.
          </p>
        )}
      </div>
    </section>
  );
}

