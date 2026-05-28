import { AdminShell } from "@/components/admin/admin-shell";
import { EventEditorForm } from "@/components/admin/event-editor-form";
import { Card, CardContent } from "@/components/ui/card";
import { requireUserWithRole } from "@/lib/auth";

export default async function CreateEventPage() {
  const { user, role } = await requireUserWithRole();

  return (
    <AdminShell
      title="Novo evento"
      description="Cadastre manualmente eventos para a agenda publica do portal."
      userLabel={user.email ?? "utilizador autenticado"}
      role={role}
    >
      <Card className="rounded-none border border-border shadow-none">
        <CardContent className="pt-6">
          <EventEditorForm mode="create" />
        </CardContent>
      </Card>
    </AdminShell>
  );
}
