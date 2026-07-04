"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, KeyRound, Mail } from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AccountSettingsFormProps = {
  currentEmail: string;
};

export function AccountSettingsForm({ currentEmail }: AccountSettingsFormProps) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  // Email form state
  const [email, setEmail] = useState(currentEmail);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [isEmailPending, startEmailTransition] = useTransition();

  // Password form state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isPasswordPending, startPasswordTransition] = useTransition();

  function handleEmailUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmailError(null);
    setEmailSuccess(null);

    if (email === currentEmail) {
      setEmailError("Insira um endereço de email diferente do atual.");
      return;
    }

    startEmailTransition(async () => {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) {
        setEmailError(error.message);
        return;
      }
      setEmailSuccess(
        "Pedido enviado! Verifique as caixas de entrada de ambos os emails (antigo e novo) para confirmar a alteração."
      );
      router.refresh();
    });
  }

  function handlePasswordUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (password.length < 6) {
      setPasswordError("A nova palavra-passe deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("As palavras-passe não coincidem.");
      return;
    }

    startPasswordTransition(async () => {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setPasswordError(error.message);
        return;
      }
      setPasswordSuccess("Palavra-passe atualizada com sucesso!");
      setPassword("");
      setConfirmPassword("");
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      {/* Email Card Section */}
      <div className="border border-border/80 p-6">
        <h3 className="flex items-center gap-2 font-heading text-lg font-medium mb-1">
          <Mail className="size-4 text-muted-foreground" />
          Alterar Email
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Modifique o endereço de email de acesso à sua conta de administrador.
        </p>
        
        <form onSubmit={handleEmailUpdate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Novo Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="novo.email@portal.pt"
              className="h-11 rounded-none max-w-md"
              required
              disabled={isEmailPending}
            />
          </div>

          {emailError ? <p className="text-sm text-red-700">{emailError}</p> : null}
          {emailSuccess ? <p className="text-sm text-green-700">{emailSuccess}</p> : null}

          <Button
            type="submit"
            className="h-10 rounded-none px-6 text-xs uppercase tracking-[0.2em]"
            disabled={isEmailPending}
          >
            {isEmailPending ? (
              <>
                <LoaderCircle className="mr-2 size-4 animate-spin" />
                A Atualizar...
              </>
            ) : (
              "Atualizar Email"
            )}
          </Button>
        </form>
      </div>

      {/* Password Card Section */}
      <div className="border border-border/80 p-6">
        <h3 className="flex items-center gap-2 font-heading text-lg font-medium mb-1">
          <KeyRound className="size-4 text-muted-foreground" />
          Alterar Palavra-passe
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Defina uma nova palavra-passe de acesso segura.
        </p>

        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Nova Palavra-passe
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="h-11 rounded-none"
                required
                disabled={isPasswordPending}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Confirmar Nova Palavra-passe
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a palavra-passe"
                className="h-11 rounded-none"
                required
                disabled={isPasswordPending}
              />
            </div>
          </div>

          {passwordError ? <p className="text-sm text-red-700">{passwordError}</p> : null}
          {passwordSuccess ? <p className="text-sm text-green-700">{passwordSuccess}</p> : null}

          <Button
            type="submit"
            className="h-10 rounded-none px-6 text-xs uppercase tracking-[0.2em]"
            disabled={isPasswordPending}
          >
            {isPasswordPending ? (
              <>
                <LoaderCircle className="mr-2 size-4 animate-spin" />
                A Atualizar...
              </>
            ) : (
              "Atualizar Palavra-passe"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
