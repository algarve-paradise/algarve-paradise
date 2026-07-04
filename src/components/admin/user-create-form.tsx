"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { siteRoutes, withPreviewPrefix } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UserCreateFormValues = {
  fullName: string;
  email: string;
  password: string;
  role: "admin" | "editor" | "cronista";
};

const defaultValues: UserCreateFormValues = {
  fullName: "",
  email: "",
  password: "",
  role: "editor",
};

export function UserCreateForm({ currentUserRole }: { currentUserRole: "admin" | "editor" | "cronista" }) {
  const router = useRouter();
  const [values, setValues] = useState<UserCreateFormValues>(defaultValues);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateValue<Key extends keyof UserCreateFormValues>(
    key: Key,
    value: UserCreateFormValues[Key]
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
        ok?: boolean;
      } | null;

      if (!response.ok) {
        setError(data?.error ?? "Não foi possível criar o utilizador.");
        return;
      }

      setSuccess("Utilizador criado com sucesso!");
      // Reset form values
      setValues(defaultValues);
      // Redirect back to utilizadores list after 1.5 seconds
      setTimeout(() => {
        router.push(withPreviewPrefix(`${siteRoutes.admin}/utilizadores`));
        router.refresh();
      }, 1500);
    });
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Nome Completo
          </label>
          <Input
            type="text"
            value={values.fullName}
            onChange={(e) => updateValue("fullName", e.target.value)}
            placeholder="Ex: João Silva"
            className="h-11 rounded-none"
            required
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Endereço de Email
          </label>
          <Input
            type="email"
            value={values.email}
            onChange={(e) => updateValue("email", e.target.value)}
            placeholder="Ex: joao.silva@portal.pt"
            className="h-11 rounded-none"
            required
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Palavra-passe
          </label>
          <Input
            type="password"
            value={values.password}
            onChange={(e) => updateValue("password", e.target.value)}
            placeholder="Mínimo 6 caracteres"
            className="h-11 rounded-none"
            required
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Permissão / Cargo
          </label>
          <select
            value={values.role}
            onChange={(e) =>
              updateValue("role", e.target.value as UserCreateFormValues["role"])
            }
            className="flex h-11 w-full rounded-none border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
            disabled={isPending}
          >
            <option value="editor">Editor</option>
            <option value="cronista">Cronista</option>
            {currentUserRole === "admin" && <option value="admin">Administrador</option>}
          </select>
        </div>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {success ? <p className="text-sm text-green-700">{success}</p> : null}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <Link
          href={withPreviewPrefix(`${siteRoutes.admin}/utilizadores`)}
          className="inline-flex h-10 items-center gap-2 border border-border px-4 text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-muted"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Link>

        <Button
          type="submit"
          className="h-10 rounded-none px-6 text-xs uppercase tracking-[0.2em]"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <LoaderCircle className="mr-2 size-4 animate-spin" />
              A Criar...
            </>
          ) : (
            <>
              <Save className="mr-2 size-4" />
              Criar Utilizador
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
