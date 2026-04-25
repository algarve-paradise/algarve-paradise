import { AdminShell } from "@/components/admin/admin-shell";
import { NewsEditorForm } from "@/components/admin/news-editor-form";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";

export default async function CreateNewsPage() {
  const user = await requireUser();

  return (
    <AdminShell
      title="Nova noticia"
      description="Preencha os campos editoriais e publique diretamente no portal quando o conteudo estiver pronto."
      userLabel={user.email ?? "utilizador autenticado"}
    >
      <Card className="rounded-none border border-border shadow-none">
        <CardContent className="pt-6">
          <NewsEditorForm mode="create" />
        </CardContent>
      </Card>
    </AdminShell>
  );
}
