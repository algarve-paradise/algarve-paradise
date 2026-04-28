"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Pencil, Power, Trash2 } from "lucide-react";

import { SourceForm } from "./source-form";

type SourceActionsProps = {
  source: {
    id: string;
    name: string;
    url: string;
    type: "rss" | "sitemap" | "html" | "ical" | "api";
    region: string;
    content_kind: "news" | "events";
    default_category:
      | "Algarve"
      | "Municipios"
      | "Economia"
      | "Turismo"
      | "Seguranca"
      | "Eventos"
      | "Reportagem";
    enabled: boolean;
    rate_limit_seconds: number;
  };
};

export function SourceActions({ source }: SourceActionsProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [isToggling, startToggle] = useTransition();
  const [isDeleting, startDelete] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle() {
    setError(null);
    startToggle(async () => {
      const response = await fetch(`/api/admin/sources/${source.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !source.enabled }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "Erro ao alterar estado.");
        return;
      }
      router.refresh();
    });
  }

  function confirmDelete() {
    setError(null);
    startDelete(async () => {
      const response = await fetch(`/api/admin/sources/${source.id}`, { method: "DELETE" });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "Erro ao eliminar fonte.");
        setConfirming(false);
        return;
      }
      router.refresh();
    });
  }

  if (editing) {
    return (
      <td colSpan={99} className="py-3 pr-4">
        <SourceForm
          mode="edit"
          sourceId={source.id}
          initial={{
            name: source.name,
            url: source.url,
            type: source.type,
            region: source.region,
            content_kind: source.content_kind,
            default_category: source.default_category,
            enabled: source.enabled,
            rate_limit_seconds: source.rate_limit_seconds,
          }}
          onClose={() => setEditing(false)}
        />
      </td>
    );
  }

  return (
    <td className="py-4">
      <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em]">
        <button
          type="button"
          onClick={toggle}
          disabled={isToggling}
          title={source.enabled ? "Desactivar" : "Activar"}
          className={[
            "inline-flex items-center gap-1 disabled:opacity-50",
            source.enabled
              ? "text-muted-foreground hover:text-foreground"
              : "text-emerald-700 hover:text-emerald-900",
          ].join(" ")}
        >
          {isToggling ? (
            <LoaderCircle className="size-3.5 animate-spin" />
          ) : (
            <Power className="size-3.5" />
          )}
          {source.enabled ? "Pausar" : "Activar"}
        </button>

        <button
          type="button"
          onClick={() => setEditing(true)}
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <Pencil className="size-3.5" />
          Editar
        </button>

        {confirming ? (
          <span className="flex items-center gap-2">
            <button
              type="button"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-1 text-red-700 hover:text-red-900 disabled:opacity-50"
            >
              {isDeleting ? <LoaderCircle className="size-3.5 animate-spin" /> : null}
              Confirmar
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancelar
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-red-700"
          >
            <Trash2 className="size-3.5" />
            Eliminar
          </button>
        )}

        {error ? <span className="text-xs text-red-700">{error}</span> : null}
      </div>
    </td>
  );
}
