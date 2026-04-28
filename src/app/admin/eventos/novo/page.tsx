import { AdminShell } from "@/components/admin/admin-shell";
import { EventEditorForm } from "@/components/admin/event-editor-form";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";

export default async function CreateEventPage() {
  const user = await requireUser();

  return (
    <AdminShell
      title="Novo evento"
      description="Cadastre manualmente eventos para a agenda publica do portal."
      userLabel={user.email ?? "utilizador autenticado"}
    >
      <Card className="rounded-none border border-border shadow-none">
        <CardContent className="pt-6">
          <EventEditorForm mode="create" />
        </CardContent>
      </Card>
    </AdminShell>
  );
}
