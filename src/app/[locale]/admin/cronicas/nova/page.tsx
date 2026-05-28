import { AdminShell } from "@/components/admin/admin-shell";
import { CronicaEditorForm } from "@/components/admin/cronica-editor-form";
import { Card, CardContent } from "@/components/ui/card";
import { requireUserWithRole } from "@/lib/auth";

export default async function CreateCronicaPage() {
  const { user, role } = await requireUserWithRole();

  return (
    <AdminShell
      title="Nova cronica"
      description="Escreva a cronica da semana e publique diretamente na homepage do portal."
      userLabel={user.email ?? "utilizador autenticado"}
      role={role}
    >
      <Card className="rounded-none border border-border shadow-none">
        <CardContent className="pt-6">
          <CronicaEditorForm mode="create" />
        </CardContent>
      </Card>
    </AdminShell>
  );
}
