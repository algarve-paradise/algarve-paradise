import Link from "next/link";
import { UserPlus } from "lucide-react";

import { AdminShell } from "@/components/admin/admin-shell";
import { UserRoleManager } from "@/components/admin/user-role-manager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { siteRoutes, withPreviewPrefix } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function UtilizadoresPage() {
  const { user, role } = await requireRole(["admin"]);

  const supabase = await createSupabaseServerClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at")
    .order("created_at", { ascending: true });

  const adminClient = createSupabaseAdminClient();
  const { data: authData } = await adminClient.auth.admin.listUsers();
  const emailMap = new Map(authData?.users?.map((u) => [u.id, u.email]) ?? []);

  const utilizadores = (profiles ?? []).map((p) => ({
    id: p.id,
    fullName: p.full_name as string | null,
    email: emailMap.get(p.id) ?? null,
    role: p.role as "admin" | "editor" | "cronista",
    createdAt: p.created_at as string,
  }));

  return (
    <AdminShell
      title="Utilizadores"
      description="Gere os acessos e permissoes dos membros da equipa editorial."
      userLabel={user.email ?? "utilizador autenticado"}
      role={role}
    >
      <Card className="rounded-none border border-border shadow-none">
        <CardHeader className="border-b border-border">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Equipa editorial</CardTitle>
            <Link
              href={withPreviewPrefix(`${siteRoutes.admin}/utilizadores/novo`)}
              className="inline-flex h-9 w-fit items-center gap-2 border border-border px-3 text-xs font-semibold uppercase tracking-[0.18em] transition-colors hover:bg-muted"
            >
              <UserPlus className="size-4" />
              Novo utilizador
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <UserRoleManager utilizadores={utilizadores} currentUserId={user.id} />
        </CardContent>
      </Card>
    </AdminShell>
  );
}
