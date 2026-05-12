import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarPlus, Clapperboard, Database, FilePlus2, LayoutDashboard, NotebookPen, Settings } from "lucide-react";

import { SignOutButton } from "@/components/admin/sign-out-button";
import { Container } from "@/components/layout/container";
import { siteRoutes } from "@/lib/site";

type AdminShellProps = {
  title: string;
  description: string;
  userLabel: string;
  children: ReactNode;
};

export function AdminShell({ title, description, userLabel, children }: AdminShellProps) {
  return (
    <Container className="py-10">
      <div className="border-y border-border py-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Redacao interna
            </p>
            <div className="space-y-2">
              <h1 className="font-heading text-4xl leading-none sm:text-5xl">{title}</h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>
            </div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Sessao ativa: {userLabel}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={siteRoutes.admin}
              className="inline-flex h-10 items-center gap-2 border border-border px-4 text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-muted"
            >
              <LayoutDashboard className="size-4" />
              Painel
            </Link>
            <Link
              href={`${siteRoutes.admin}/fontes`}
              className="inline-flex h-10 items-center gap-2 border border-border px-4 text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-muted"
            >
              <Database className="size-4" />
              Fontes
            </Link>
            <Link
              href={`${siteRoutes.admin}/configuracoes`}
              className="inline-flex h-10 items-center gap-2 border border-border px-4 text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-muted"
            >
              <Settings className="size-4" />
              Configuracoes
            </Link>
            <Link
              href={`${siteRoutes.admin}/noticias/nova`}
              className="inline-flex h-10 items-center gap-2 bg-primary px-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground"
            >
              <FilePlus2 className="size-4" />
              Nova noticia
            </Link>
            <Link
              href={`${siteRoutes.admin}/eventos/novo`}
              className="inline-flex h-10 items-center gap-2 border border-border px-4 text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-muted"
            >
              <CalendarPlus className="size-4" />
              Novo evento
            </Link>
            <Link
              href={`${siteRoutes.admin}/reportagens/nova`}
              className="inline-flex h-10 items-center gap-2 border border-border px-4 text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-muted"
            >
              <Clapperboard className="size-4" />
              Nova reportagem
            </Link>
            <Link
              href={`${siteRoutes.admin}/cronicas`}
              className="inline-flex h-10 items-center gap-2 border border-border px-4 text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-muted"
            >
              <NotebookPen className="size-4" />
              Cronicas
            </Link>
            <SignOutButton />
          </div>
        </div>
      </div>
      <div className="py-8">{children}</div>
    </Container>
  );
}
