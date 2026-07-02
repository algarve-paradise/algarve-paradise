"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { siteRoutes, withPreviewPrefix } from "@/lib/site";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace(withPreviewPrefix(siteRoutes.login));
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="rounded-none"
      onClick={handleSignOut}
      disabled={loading}
    >
      {loading ? "A sair..." : "Terminar sessao"}
    </Button>
  );
}
