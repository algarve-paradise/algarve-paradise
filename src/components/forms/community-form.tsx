"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";

type FormState = "idle" | "loading" | "success" | "error";

export function CommunityForm() {
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
        setErrorMsg(json.error ?? "Erro ao enviar mensagem.");
        setState("error");
        return;
      }

      setState("success");
      form.reset();
    } catch {
      setErrorMsg("Erro de ligação. Tente novamente.");
      setState("error");
    }
  }

  return (
    <div id="participar">
      <h3 className="font-heading text-xl font-medium text-foreground mb-2">
        Partilhar com a comunidade
      </h3>
      <p className="text-sm leading-6 text-muted-foreground mb-6">
        A sua opinião, sugestão ou testemunho é bem-vindo. As mensagens são revistas antes de serem publicadas.
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="grid gap-1.5 text-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Nome *
          </span>
          <input
            type="text"
            name="nome"
            placeholder="O seu nome"
            className="border border-border bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground"
            required
            disabled={state === "loading" || state === "success"}
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Município
          </span>
          <input
            type="text"
            name="municipio"
            placeholder="Ex: Faro, Lagos, Albufeira…"
            className="border border-border bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground"
            disabled={state === "loading" || state === "success"}
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Mensagem *
          </span>
          <textarea
            name="mensagem"
            placeholder="Partilhe a sua opinião, sugestão ou mensagem para a região."
            className="min-h-32 border border-border bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
            required
            disabled={state === "loading" || state === "success"}
          />
        </label>

        {state === "success" ? (
          <p className="border border-border px-3 py-2.5 text-xs text-foreground bg-muted/40">
            Mensagem recebida. Obrigado pela sua participação — será publicada após revisão editorial.
          </p>
        ) : null}

        {state === "error" ? (
          <p className="border border-red-200 px-3 py-2.5 text-xs text-red-600 bg-red-50">
            {errorMsg}
          </p>
        ) : null}

        {state !== "success" ? (
          <button
            type="submit"
            disabled={state === "loading"}
            className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-muted-foreground transition-colors disabled:opacity-50"
          >
            {state === "loading" ? "A enviar…" : "Enviar"}
            <MessageSquare className="size-3" />
          </button>
        ) : null}
      </form>
    </div>
  );
}
