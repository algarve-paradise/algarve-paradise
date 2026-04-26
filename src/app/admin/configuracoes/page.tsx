import { AdminShell } from "@/components/admin/admin-shell";
import { SettingsForm } from "@/components/admin/settings-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { env } from "@/lib/env";
import { getAppSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const user = await requireUser();
  const settings = await getAppSettings();

  const providerStatus = {
    anthropic: Boolean(env.ANTHROPIC_API_KEY),
    openai: Boolean(env.OPENAI_API_KEY),
    gemini: Boolean(env.GEMINI_API_KEY),
  };

  return (
    <AdminShell
      title="Configuracoes da automacao"
      description="Define o provider de IA e os parametros de auto-publicacao em tempo real, sem novo deploy."
      userLabel={user.email ?? "utilizador autenticado"}
    >
      <Card className="rounded-none border border-border shadow-none">
        <CardHeader className="border-b border-border">
          <CardTitle>Pipeline de IA</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <SettingsForm initial={settings} providerStatus={providerStatus} />
        </CardContent>
      </Card>
    </AdminShell>
  );
}
