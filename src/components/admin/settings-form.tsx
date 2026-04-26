"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AiProvider } from "@/lib/settings";

type SettingsFormProps = {
  initial: {
    aiProvider: AiProvider;
    autoPublishAfterHours: number;
    autoPublishMinConfidence: number;
  };
  providerStatus: {
    anthropic: boolean;
    openai: boolean;
    gemini: boolean;
  };
};

const providerOptions: Array<{ value: AiProvider; label: string; hint: string }> = [
  {
    value: "anthropic",
    label: "Anthropic — Claude Haiku 4.5",
    hint: "Default. Excelente em PT-PT, custo ~$0,001 por noticia.",
  },
  {
    value: "openai",
    label: "OpenAI — GPT-4o-mini",
    hint: "Fallback solido, custo similar.",
  },
  {
    value: "gemini",
    label: "Google Gemini — 2.0 Flash",
    hint: "Custo muito baixo, suporta JSON nativo.",
  },
];

export function SettingsForm({ initial, providerStatus }: SettingsFormProps) {
  const router = useRouter();
  const [aiProvider, setAiProvider] = useState<AiProvider>(initial.aiProvider);
  const [hours, setHours] = useState(String(initial.autoPublishAfterHours));
  const [confidence, setConfidence] = useState(String(initial.autoPublishMinConfidence));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedProviderConfigured = providerStatus[aiProvider];

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const parsedHours = Number(hours);
    const parsedConfidence = Number(confidence);

    if (!Number.isFinite(parsedHours) || parsedHours < 0 || parsedHours > 168) {
      setError("Janela de auto-publicacao tem que estar entre 0 e 168 horas.");
      return;
    }
    if (!Number.isFinite(parsedConfidence) || parsedConfidence < 0 || parsedConfidence > 1) {
      setError("Confianca minima tem que estar entre 0 e 1.");
      return;
    }

    startTransition(async () => {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aiProvider,
          autoPublishAfterHours: parsedHours,
          autoPublishMinConfidence: parsedConfidence,
        }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "Nao foi possivel guardar as configuracoes.");
        return;
      }
      setSuccess("Configuracoes guardadas. As proximas execucoes ja usam o novo provider.");
      router.refresh();
    });
  }

  return (
    <form className="space-y-8" onSubmit={submit}>
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Provider de IA padrao
        </label>
        <div className="space-y-2">
          {providerOptions.map((option) => {
            const configured = providerStatus[option.value];
            const checked = aiProvider === option.value;
            return (
              <label
                key={option.value}
                className={[
                  "flex cursor-pointer flex-col gap-1 border p-4 transition-colors",
                  checked ? "border-foreground bg-muted/40" : "border-border hover:bg-muted/20",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="aiProvider"
                      value={option.value}
                      checked={checked}
                      onChange={() => setAiProvider(option.value)}
                    />
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                  <span
                    className={[
                      "text-[10px] font-semibold uppercase tracking-[0.16em]",
                      configured ? "text-emerald-700" : "text-amber-700",
                    ].join(" ")}
                  >
                    {configured ? "API key configurada" : "Falta API key"}
                  </span>
                </div>
                <p className="pl-7 text-xs text-muted-foreground">{option.hint}</p>
              </label>
            );
          })}
        </div>
        {!selectedProviderConfigured ? (
          <p className="text-xs text-amber-700">
            Atencao: a chave do provider selecionado nao esta definida. As proximas execucoes vao
            falhar ate adicionar a env var correspondente no Vercel.
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Janela de revisao (horas)
          </label>
          <Input
            type="number"
            min={0}
            max={168}
            step={0.5}
            value={hours}
            onChange={(event) => setHours(event.target.value)}
            className="h-11 rounded-none"
          />
          <p className="text-xs text-muted-foreground">
            Tempo que cada rascunho da IA aguarda revisao manual antes da auto-publicacao.
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Confianca minima para auto-publicar
          </label>
          <Input
            type="number"
            min={0}
            max={1}
            step={0.05}
            value={confidence}
            onChange={(event) => setConfidence(event.target.value)}
            className="h-11 rounded-none"
          />
          <p className="text-xs text-muted-foreground">
            Entre 0 e 1. Use 0 para publicar tudo ao fim da janela; 0.75 e o default.
          </p>
        </div>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-700">{success}</p> : null}

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <Button type="submit" className="rounded-none" disabled={isPending}>
          {isPending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
          Guardar configuracoes
        </Button>
      </div>
    </form>
  );
}
