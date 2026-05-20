import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { EventEditorForm } from "@/components/admin/event-editor-form";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getAdminEventById } from "@/lib/events";

type EditEventPageProps = {
  params: Promise<{ id: string }>;
};

/** Convert ISO timestamp to the value format expected by <input type="datetime-local"> */
function toLocalInputValue(iso: string | undefined | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const user = await requireUser();
  const { id } = await params;
  const item = await getAdminEventById(id);

  if (!item) {
    notFound();
  }

  return (
    <AdminShell
      title="Editar evento"
      description="Atualize titulo, descricao, data, local, capa e estado de publicacao."
      userLabel={user.email ?? "utilizador autenticado"}
    >
      <Card className="rounded-none border border-border shadow-none">
        <CardContent className="pt-6">
          <EventEditorForm
            mode="edit"
            eventId={id}
            initialValues={{
              title: item.title,
              slug: item.slug,
              description: item.description,
              location: item.location,
              startsAt: toLocalInputValue(item.startsAt),
              endsAt: toLocalInputValue(item.endsAt),
              sourceName: item.sourceName ?? "",
              sourceUrl: item.sourceUrl ?? "",
              coverImageUrl: item.imageUrl ?? "",
              coverImagePath: "",
              status: item.status ?? "draft",
            }}
          />
        </CardContent>
      </Card>
    </AdminShell>
  );
}
