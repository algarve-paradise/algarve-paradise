import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUserWithRole } from "@/lib/auth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AccountSettingsForm } from "@/components/admin/account-settings-form";
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const { user, role } = await requireUserWithRole();

  return (
    <AdminShell
      title="Configuracoes"
      description="Parametros gerais da plataforma."
      userLabel={user.email ?? "utilizador autenticado"}
      role={role}
    >
      <div className="space-y-8">
        <Tabs defaultValue="platform">
          <TabsList>
            <TabsTrigger value="platform">Plataforma</TabsTrigger>
            <TabsTrigger value="account">Segurança da Conta</TabsTrigger>
          </TabsList>
          <TabsContent value="platform">
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
          </TabsContent>
          <TabsContent value="account">
            <Card className="rounded-none border border-border shadow-none">
              <CardHeader className="border-b border-border">
                <CardTitle>Segurança da Conta</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <AccountSettingsForm currentEmail={user.email ?? ""} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminShell>
  );
}
