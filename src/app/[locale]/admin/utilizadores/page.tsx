import { AdminShell } from "@/components/admin/admin-shell";
import { UserRoleManager } from "@/components/admin/user-role-manager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

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
          <CardTitle>Equipa editorial</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <UserRoleManager utilizadores={utilizadores} currentUserId={user.id} />
        </CardContent>
      </Card>
    </AdminShell>
  );
}
