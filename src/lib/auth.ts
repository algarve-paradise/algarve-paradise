import { redirect } from "next/navigation";

import { siteRoutes } from "@/lib/site";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type UserRole = "admin" | "editor" | "cronista";

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentUserWithRole(): Promise<{
  user: Awaited<ReturnType<typeof getCurrentUser>>;
  role: UserRole;
}> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, role: "editor" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = (profile?.role as UserRole) ?? "editor";

  return { user, role };
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(siteRoutes.login);
  }

  return user;
}

export async function requireUserWithRole(): Promise<{
  user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;
  role: UserRole;
}> {
  const { user, role } = await getCurrentUserWithRole();

  if (!user) {
    redirect(siteRoutes.login);
  }

  return { user, role };
}

export async function requireRole(allowedRoles: UserRole[]) {
  const { user, role } = await getCurrentUserWithRole();

  if (!user) {
    redirect(siteRoutes.login);
  }

  if (!allowedRoles.includes(role)) {
    redirect(siteRoutes.admin);
  }

  return { user, role };
}
