import { AdminShell } from "@/components/admin/admin-shell";
import { UserCreateForm } from "@/components/admin/user-create-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NovoUtilizadorPage() {
  const { user, role } = await requireRole(["admin"]);

  return (
    <AdminShell
      title="Novo Utilizador"
      description="Registe um novo membro para a equipa editorial."
      userLabel={user.email ?? "utilizador autenticado"}
      role={role}
    >
      <Card className="rounded-none border border-border shadow-none">
        <CardHeader className="border-b border-border">
          <CardTitle>Criar novo membro</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <UserCreateForm currentUserRole={role} />
        </CardContent>
      </Card>
    </AdminShell>
  );
}
