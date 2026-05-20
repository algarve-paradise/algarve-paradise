import { AdminShell } from "@/components/admin/admin-shell";
import { CronicaEditorForm } from "@/components/admin/cronica-editor-form";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";

export default async function CreateCronicaPage() {
  const user = await requireUser();

  return (
    <AdminShell
      title="Nova cronica"
      description="Escreva a cronica da semana e publique diretamente na homepage do portal."
      userLabel={user.email ?? "utilizador autenticado"}
    >
      <Card className="rounded-none border border-border shadow-none">
        <CardContent className="pt-6">
          <CronicaEditorForm mode="create" />
        </CardContent>
      </Card>
    </AdminShell>
  );
}
