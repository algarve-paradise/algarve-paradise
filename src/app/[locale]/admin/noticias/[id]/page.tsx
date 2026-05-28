import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { NewsEditorForm } from "@/components/admin/news-editor-form";
import { Card, CardContent } from "@/components/ui/card";
import { requireUserWithRole } from "@/lib/auth";
import { getAdminNewsById } from "@/lib/news";

type EditNewsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const { user, role } = await requireUserWithRole();
  const { id } = await params;
  const item = await getAdminNewsById(id);

  if (!item) {
    notFound();
  }

  return (
    <AdminShell
      title="Editar noticia"
      description="Atualize o conteudo, altere o estado da publicacao e mantenha a homepage sincronizada."
      userLabel={user.email ?? "utilizador autenticado"}
      role={role}
    >
      <Card className="rounded-none border border-border shadow-none">
        <CardContent className="pt-6">
          <NewsEditorForm
            mode="edit"
            postId={id}
            userRole={role}
            initialValues={{
              title: item.title,
              slug: item.slug,
              excerpt: item.excerpt,
              content: item.content,
              category: item.category,
              sourceName: item.sourceName ?? "",
              sourceUrl: item.sourceUrl ?? "",
              coverImageUrl: item.imageUrl ?? "",
              youtubeUrl: item.youtubeUrl ?? "",
              featured: item.featured ?? false,
              live: item.live ?? false,
              status: item.status ?? "draft",
            }}
          />
        </CardContent>
      </Card>
    </AdminShell>
  );
}
