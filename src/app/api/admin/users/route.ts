import { NextResponse } from "next/server";

import { getCurrentUserWithRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { user, role } = await getCurrentUserWithRole();

  if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
  if (role !== "admin") return NextResponse.json({ error: "Sem permissao." }, { status: 403 });

  const supabase = await createSupabaseServerClient();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fetch emails from auth (requires admin client)
  const adminClient = createSupabaseAdminClient();
  const { data: authUsers } = await adminClient.auth.admin.listUsers();

  const emailMap = new Map(authUsers?.users?.map((u) => [u.id, u.email]) ?? []);

  const result = profiles.map((p) => ({
    id: p.id,
    fullName: p.full_name,
    email: emailMap.get(p.id) ?? null,
    role: p.role,
    createdAt: p.created_at,
  }));

  return NextResponse.json(result);
}
