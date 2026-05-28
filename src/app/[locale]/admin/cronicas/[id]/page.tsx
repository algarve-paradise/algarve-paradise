import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { CronicaEditorForm } from "@/components/admin/cronica-editor-form";
import { Card, CardContent } from "@/components/ui/card";
import { requireUserWithRole } from "@/lib/auth";
import { getAdminCronicaById } from "@/lib/cronicas";

type Props = { params: Promise<{ id: string }> };

export default async function EditCronicaPage({ params }: Props) {
  const [{ user, role }, { id }] = await Promise.all([requireUserWithRole(), params]);
  const cronica = await getAdminCronicaById(id);

  if (!cronica) notFound();

  return (
    <AdminShell
      title="Editar cronica"
      description="Atualize o conteudo da cronica e guarde as alteracoes."
      userLabel={user.email ?? "utilizador autenticado"}
      role={role}
    >
      <Card className="rounded-none border border-border shadow-none">
        <CardContent className="pt-6">
          <CronicaEditorForm
            mode="edit"
            cronicaId={id}
            initialValues={{
              title: cronica.title,
              content: cronica.content,
              authorName: cronica.authorName,
              authorRole: cronica.authorRole ?? "",
              authorAvatarUrl: cronica.authorAvatarUrl ?? "",
              weekLabel: cronica.weekLabel,
              status: cronica.status,
            }}
          />
        </CardContent>
      </Card>
    </AdminShell>
  );
}
