import Link from "next/link";
import { PenSquare, Radio, Sparkles, SquarePen } from "lucide-react";

import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getAdminNewsList, getAdminSummary } from "@/lib/news";

export default async function AdminDashboardPage() {
  const user = await requireUser();
  const [items, summary] = await Promise.all([getAdminNewsList(), getAdminSummary()]);

  return (
    <AdminShell
      title="Dashboard editorial"
      description="Area preparada para gerir noticias manualmente e servir de base para a automacao futura com IA."
      userLabel={user.email ?? "utilizador autenticado"}
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total de noticias", value: summary.total, icon: SquarePen },
          { label: "Publicadas", value: summary.published, icon: Sparkles },
          { label: "Destaques", value: summary.featured, icon: PenSquare },
          { label: "Em foco", value: summary.live, icon: Radio },
        ].map((item) => (
          <Card key={item.label} className="rounded-none border border-border shadow-none">
            <CardContent className="flex items-center justify-between pt-6">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="font-heading text-4xl">{item.value}</p>
              </div>
              <item.icon className="size-6 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="mt-8 rounded-none border border-border shadow-none">
        <CardHeader className="border-b border-border">
          <CardTitle>Noticias cadastradas</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {items.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    <th className="py-4">Titulo</th>
                    <th className="py-4">Categoria</th>
                    <th className="py-4">Estado</th>
                    <th className="py-4">Atualizacao</th>
                    <th className="py-4">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-border/70 align-top">
                      <td className="py-4 pr-6">
                        <div className="space-y-1">
                          <div className="font-medium">{item.title}</div>
                          <div className="max-w-md text-sm text-muted-foreground">
                            {item.excerpt}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-6 text-sm">{item.category}</td>
                      <td className="py-4 pr-6 text-sm capitalize">
                        {item.status === "published" ? "Publicado" : "Rascunho"}
                      </td>
                      <td className="py-4 pr-6 text-sm text-muted-foreground">
                        {new Date(item.date).toLocaleDateString("pt-PT")}
                      </td>
                      <td className="py-4">
                        <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em]">
                          <Link href={`/admin/noticias/${item.id}`} className="hover:underline">
                            Editar
                          </Link>
                          <Link href={item.href} className="hover:underline">
                            Ver no site
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-sm text-muted-foreground">
              Ainda nao existem noticias cadastradas. Use o botao &quot;Nova noticia&quot; para criar a primeira.
            </div>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
