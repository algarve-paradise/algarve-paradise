import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarPlus, FilePlus2, LayoutDashboard, NotebookPen, Users, Settings } from "lucide-react";

import { SignOutButton } from "@/components/admin/sign-out-button";
import { Container } from "@/components/layout/container";
import { siteRoutes, withPreviewPrefix } from "@/lib/site";
import type { UserRole } from "@/lib/auth";

type AdminShellProps = {
  title: string;
  description: string;
  userLabel: string;
  role: UserRole;
  children: ReactNode;
};

export function AdminShell({ title, description, userLabel, role, children }: AdminShellProps) {
  const canManageNews = role === "admin" || role === "editor";
  const canManageCronicas = role === "admin" || role === "cronista";

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
              Sessao ativa: {userLabel}{" "}
              <span className="ml-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest">
                {role}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={withPreviewPrefix(siteRoutes.admin)}
              className="inline-flex h-10 items-center gap-2 border border-border px-4 text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-muted"
            >
              <LayoutDashboard className="size-4" />
              Painel
            </Link>
            {canManageNews && (
              <Link
                href={withPreviewPrefix(`${siteRoutes.admin}/noticias/nova`)}
                className="inline-flex h-10 items-center gap-2 bg-primary px-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground"
              >
                <FilePlus2 className="size-4" />
                Nova noticia
              </Link>
            )}
            {canManageNews && (
              <Link
                href={withPreviewPrefix(`${siteRoutes.admin}/eventos/novo`)}
                className="inline-flex h-10 items-center gap-2 border border-border px-4 text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-muted"
              >
                <CalendarPlus className="size-4" />
                Novo evento
              </Link>
            )}
            {canManageCronicas && (
              <Link
                href={withPreviewPrefix(`${siteRoutes.admin}/cronicas`)}
                className="inline-flex h-10 items-center gap-2 border border-border px-4 text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-muted"
              >
                <NotebookPen className="size-4" />
                Cronicas
              </Link>
            )}
            {role === "admin" && (
              <Link
                href={withPreviewPrefix(`${siteRoutes.admin}/utilizadores`)}
                className="inline-flex h-10 items-center gap-2 border border-border px-4 text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-muted"
              >
                <Users className="size-4" />
                Utilizadores
              </Link>
            )}
            <SignOutButton />
          </div>
        </div>
      </div>
      <div className="py-8">{children}</div>
    </Container>
  );
}
