"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LoginFormProps = {
  nextUrl: string;
};

export function LoginForm({ nextUrl }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.replace(nextUrl);
    router.refresh();
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Email
        </label>
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="redacao@portal.pt"
          className="h-11 rounded-none"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Palavra-passe
        </label>
        <Input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Introduza a palavra-passe"
          className="h-11 rounded-none"
          required
        />
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <Button
        type="submit"
        className="h-11 w-full rounded-none text-xs uppercase tracking-[0.24em]"
        disabled={loading}
      >
        {loading ? "A entrar..." : "Entrar no painel"}
      </Button>
    </form>
  );
}
