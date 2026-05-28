import { AdminShell } from "@/components/admin/admin-shell";
import { NewsEditorForm } from "@/components/admin/news-editor-form";
import { Card, CardContent } from "@/components/ui/card";
import { requireUserWithRole } from "@/lib/auth";

export default async function CreateNewsPage() {
  const { user, role } = await requireUserWithRole();

  return (
    <AdminShell
      title="Nova noticia"
      description="Preencha os campos editoriais e publique diretamente no portal quando o conteudo estiver pronto."
      userLabel={user.email ?? "utilizador autenticado"}
      role={role}
    >
      <Card className="rounded-none border border-border shadow-none">
        <CardContent className="pt-6">
          <NewsEditorForm mode="create" userRole={role} />
        </CardContent>
      </Card>
    </AdminShell>
  );
}
