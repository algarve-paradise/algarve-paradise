"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { SourceForm } from "./source-form";

export function AddSourceButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-10 items-center gap-2 border border-foreground bg-foreground px-4 text-xs font-semibold uppercase tracking-[0.2em] text-background hover:bg-foreground/90"
        >
          <Plus className="size-4" />
          Adicionar fonte
        </button>
      ) : (
        <SourceForm mode="add" onClose={() => setOpen(false)} />
      )}
    </div>
  );
}
