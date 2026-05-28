import Link from "next/link";
import { FilePlus2 } from "lucide-react";

import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUserWithRole } from "@/lib/auth";
import { getAdminCronicas } from "@/lib/cronicas";

export default async function CronicasListPage() {
  const { user, role } = await requireUserWithRole();
  const cronicas = await getAdminCronicas();

  return (
    <AdminShell
      title="Cronicas da Semana"
      description="Gerir as cronicas semanais publicadas na homepage do portal."
      userLabel={user.email ?? "utilizador autenticado"}
      role={role}
    >
      <Card className="rounded-none border border-border shadow-none">
        <CardHeader className="border-b border-border">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle>Cronicas cadastradas</CardTitle>
            <Link
              href="/admin/cronicas/nova"
              className="inline-flex h-9 w-fit items-center gap-2 bg-primary px-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground"
            >
              <FilePlus2 className="size-4" />
              Nova cronica
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {cronicas.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    <th className="py-4">Titulo</th>
                    <th className="py-4">Autor</th>
                    <th className="py-4">Semana</th>
                    <th className="py-4">Estado</th>
                    <th className="py-4">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {cronicas.map((cronica) => (
                    <tr key={cronica.id} className="border-b border-border/70 align-top">
                      <td className="py-4 pr-6">
                        <span className="font-medium">{cronica.title}</span>
                      </td>
                      <td className="py-4 pr-6 text-sm">
                        <div>{cronica.authorName}</div>
                        {cronica.authorRole ? (
                          <div className="text-xs text-muted-foreground">{cronica.authorRole}</div>
                        ) : null}
                      </td>
                      <td className="py-4 pr-6 text-sm text-muted-foreground">
                        {cronica.weekLabel}
                      </td>
                      <td className="py-4 pr-6 text-sm capitalize">
                        {cronica.status === "published" ? "Publicado" : "Rascunho"}
                      </td>
                      <td className="py-4">
                        <Link
                          href={`/admin/cronicas/${cronica.id}`}
                          className="text-xs uppercase tracking-[0.18em] hover:underline"
                        >
                          Editar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-sm text-muted-foreground">
              Nenhuma cronica cadastrada ainda. Crie a primeira cronica da semana.
            </div>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
