"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { LoaderCircle } from "lucide-react";

type Utilizador = {
  id: string;
  fullName: string | null;
  email: string | null;
  role: "admin" | "editor" | "cronista";
  createdAt: string;
};

type UserRoleManagerProps = {
  utilizadores: Utilizador[];
  currentUserId: string;
};

const roleLabels: Record<Utilizador["role"], string> = {
  admin: "Administrador",
  editor: "Editor",
  cronista: "Cronista",
};

export function UserRoleManager({ utilizadores, currentUserId }: UserRoleManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [savingId, setSavingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleRoleChange(userId: string, newRole: Utilizador["role"]) {
    setSavingId(userId);
    setErrors((prev) => ({ ...prev, [userId]: "" }));

    const response = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });

    setSavingId(null);

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setErrors((prev) => ({ ...prev, [userId]: data?.error ?? "Erro ao atualizar role." }));
      return;
    }

    startTransition(() => {
      router.refresh();
    });
  }

  if (!utilizadores.length) {
    return (
      <div className="py-8 text-sm text-muted-foreground">
        Nenhum utilizador encontrado.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <th className="py-4">Utilizador</th>
            <th className="py-4">Email</th>
            <th className="py-4">Membro desde</th>
            <th className="py-4 w-52">Permissao</th>
          </tr>
        </thead>
        <tbody>
    <div className="space-y-4">
      {currentUserRole === "admin" && (
        <Link
          href="/admin/configuracoes"
          className="inline-flex h-10 items-center gap-2 border border-border px-4 text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-muted"
        >
          <Settings className="size-4" />
          Configurações
        </Link>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <th className="py-4">Utilizador</th>
              <th className="py-4">Email</th>
              <th className="py-4">Membro desde</th>
              <th className="py-4 w-52">Permissao</th>
              <th className="py-4 w-20">Ações</th>
            </tr>
          </thead>
          <tbody>
            {utilizadores.map((u) => {
              const isSelf = u.id === currentUserId;
              const isSaving = savingId === u.id || isPending;

              return (
                <tr key={u.id} className="border-b border-border/70 align-middle">
                  <td className="py-4 pr-6">
                    <div className="font-medium">{u.fullName ?? "—"}</div>
                    {isSelf && (
                      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        Voce
                      </div>
                    )}
                  </td>
                  <td className="py-4 pr-6 text-sm text-muted-foreground">{u.email ?? "—"}</td>
                  <td className="py-4 pr-6 text-sm text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString("pt-PT")}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <select
                        defaultValue={u.role}
                        disabled={isSelf || isSaving}
                        onChange={(e) =>
                          void handleRoleChange(u.id, e.target.value as Utilizador["role"])
                        }
                        className="h-9 w-full border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {(Object.keys(roleLabels) as Utilizador["role"][]).map((r) => (
                          <option key={r} value={r}>
                            {roleLabels[r]}
                          </option>
                        ))}
                      </select>
                      {isSaving && <LoaderCircle className="size-4 shrink-0 animate-spin text-muted-foreground" />}
                    </div>
                    {errors[u.id] ? (
                      <p className="mt-1 text-xs text-red-600">{errors[u.id]}</p>
                    ) : null}
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-primary"
                        disabled={isSelf || isSaving}
                        onClick={() => setEditingId(u.id)}
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-destructive"
                        disabled={isSelf || isSaving}
                        onClick={() => void handleDelete(u.id)}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                  {editingId === u.id && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                      <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h3 className="mb-4 text-lg font-medium">Editar utilizador</h3>
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const form = e.currentTarget as HTMLFormElement;
                            const nameInput = form.elements.namedItem('fullName') as HTMLInputElement;
                            const roleSelect = form.elements.namedItem('role') as HTMLSelectElement;
                            await handleUserUpdate(u.id, nameInput.value, roleSelect.value as Utilizador["role"]);
                            setEditingId(null);
                          }}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-sm font-medium mb-1">Nome</label>
                            <input
                              type="text"
                              name="fullName"
                              defaultValue={u.fullName ?? ''}
                              className="w-full border border-input rounded px-2 py-1 text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Permissão</label>
                            <select
                              name="role"
                              defaultValue={u.role}
                              className="w-full border border-input rounded px-2 py-1 text-sm"
                            >
                              {(Object.keys(roleLabels) as Utilizador["role"][]).map((r) => (
                                <option key={r} value={r}>
                                  {roleLabels[r]}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              className="px-4 py-1 text-sm bg-muted rounded"
                              onClick={() => setEditingId(null)}
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-1 text-sm bg-primary text-primary-foreground rounded"
                            >
                              Salvar
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
