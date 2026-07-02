import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { siteRoutes, withPreviewPrefix } from "@/lib/site";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();
  const params = await searchParams;
  const nextUrl = withPreviewPrefix(params.next || siteRoutes.admin);

  if (user) {
    redirect(nextUrl);
  }

  return (
    <Container className="py-14">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-5 border-y border-border py-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Acesso editorial
          </p>
          <h1 className="font-heading text-5xl leading-none sm:text-6xl">Painel de notícias</h1>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            Esta área foi preparada para a redação criar, editar e publicar notícias no portal,
            com suporte a autenticacao, base de dados e imagens centralizadas no Supabase.
          </p>
        </section>

        <Card className="rounded-none border border-border bg-card shadow-none">
          <CardContent className="pt-6">
            <LoginForm nextUrl={nextUrl} />
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
