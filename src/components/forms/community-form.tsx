"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";

export function CommunityForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div id="participar">
      <h3 className="font-heading text-xl font-medium text-foreground mb-2">
        Partilhar com a comunidade
      </h3>
      <p className="text-sm leading-6 text-muted-foreground mb-6">
        Formulário preparado para recolher mensagens, sugestões ou testemunhos numa integração futura.
      </p>
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <label className="grid gap-1.5 text-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nome</span>
          <input
            type="text"
            name="nome"
            placeholder="O seu nome"
            className="border border-border bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground"
            required
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mensagem</span>
          <textarea
            name="mensagem"
            placeholder="Partilhe a sua opinião, sugestão ou mensagem para a região."
            className="min-h-32 border border-border bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
            required
          />
        </label>
        {submitted ? (
          <p className="border border-border px-3 py-2.5 text-xs text-muted-foreground">
            Mensagem registada em modo demonstração. A integração final pode ser ligada depois.
          </p>
        ) : null}
        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-muted-foreground transition-colors"
        >
          Enviar
          <MessageSquare className="size-3" />
        </button>
      </form>
    </div>
  );
}
