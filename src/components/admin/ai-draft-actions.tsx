"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, LoaderCircle, XCircle } from "lucide-react";

type AiDraftActionsProps = {
  postId: string;
  /** Which API namespace to hit. */
  kind?: "post" | "event";
};

export function AiDraftActions({ postId, kind = "post" }: AiDraftActionsProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function call(action: "approve" | "reject") {
    setError(null);
    startTransition(async () => {
      const namespace = kind === "event" ? "events" : "posts";
      const response = await fetch(`/api/admin/${namespace}/${postId}/${action}`, {
        method: "POST",
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "Operacao falhou.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => call("approve")}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 border border-emerald-700 bg-emerald-700 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-emerald-800 disabled:opacity-50"
        >
          {isPending ? (
            <LoaderCircle className="size-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="size-3.5" />
          )}
          Aprovar
        </button>
        <button
          type="button"
          onClick={() => call("reject")}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 border border-red-700 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
        >
          <XCircle className="size-3.5" />
          Rejeitar
        </button>
      </div>
      {error ? <p className="text-[11px] text-red-700">{error}</p> : null}
    </div>
  );
}
