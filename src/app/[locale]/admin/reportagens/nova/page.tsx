import { AdminShell } from "@/components/admin/admin-shell";
import { NewsEditorForm } from "@/components/admin/news-editor-form";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";

export default async function CreateReportPage() {
  const user = await requireUser();

  return (
    <AdminShell
      title="Nova reportagem"
      description="Cadastre manualmente uma reportagem para aparecer na pagina TV."
      userLabel={user.email ?? "utilizador autenticado"}
    >
      <Card className="rounded-none border border-border shadow-none">
        <CardContent className="pt-6">
          <NewsEditorForm mode="create" initialValues={{ category: "Reportagem" }} />
        </CardContent>
      </Card>
    </AdminShell>
  );
}
