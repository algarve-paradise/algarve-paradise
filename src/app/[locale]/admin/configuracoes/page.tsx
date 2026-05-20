import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const user = await requireUser();

  return (
    <AdminShell
      title="Configuracoes"
      description="Parametros gerais da plataforma."
      userLabel={user.email ?? "utilizador autenticado"}
    >
      <Card className="rounded-none border border-border shadow-none">
        <CardHeader className="border-b border-border">
          <CardTitle>Plataforma</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            Esta versao da plataforma utiliza cadastro editorial manual.
            O conteudo e gerido diretamente pelo painel de administracao.
          </p>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
