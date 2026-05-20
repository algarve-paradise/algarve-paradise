"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

type FormState = "idle" | "loading" | "success" | "error";

const fieldClass =
  "w-full rounded-2xl border border-foreground/10 bg-[var(--dt-color-bg)] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all duration-200 focus:outline-none focus:border-foreground focus:bg-white focus:ring-4 focus:ring-foreground/5 disabled:opacity-50";

export function CommunityForm() {
  const t = useTranslations("forms.community");
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setErrorMsg("");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("nome"),
          municipality: data.get("municipio") || undefined,
          message: data.get("mensagem"),
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setErrorMsg(json.error ?? t("errorConn"));
        setState("error");
        return;
      }

      setState("success");
      form.reset();
    } catch {
      setErrorMsg(t("errorConn"));
      setState("error");
    }
  }

  return (
    <form id="participar" className="space-y-3" onSubmit={handleSubmit}>
      <label className="grid gap-1.5 text-sm">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {t("nameLabel")} *
        </span>
        <input
          type="text"
          name="nome"
          placeholder={t("namePlaceholder")}
          className={fieldClass}
          required
          disabled={state === "loading" || state === "success"}
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {t("municipalityLabel")}
        </span>
        <input
          type="text"
          name="municipio"
          placeholder={t("municipalityPlaceholder")}
          className={fieldClass}
          disabled={state === "loading" || state === "success"}
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {t("messageLabel")} *
        </span>
        <textarea
          name="mensagem"
          placeholder={t("messagePlaceholder")}
          className={`${fieldClass} min-h-28 resize-none`}
          required
          disabled={state === "loading" || state === "success"}
        />
      </label>

      {state === "success" ? (
        <p className="rounded-2xl border border-[var(--dt-color-mint)] bg-[var(--dt-color-mint)]/40 px-4 py-3 text-xs text-foreground">
          {t("success")}
        </p>
      ) : null}

      {state === "error" ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
          {errorMsg}
        </p>
      ) : null}

      {state !== "success" ? (
        <button
          type="submit"
          disabled={state === "loading"}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-[12px] font-semibold text-background transition-all duration-300 hover:bg-[var(--dt-color-accent)] hover:shadow-[0_18px_40px_-14px_rgba(29,111,209,0.55)] disabled:opacity-60"
        >
          {state === "loading" ? t("submitting") : t("submit")}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      ) : null}
    </form>
  );
}
