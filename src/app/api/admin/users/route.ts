import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUserWithRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const createUserSchema = z.object({
  email: z.string().email("Email inválido."),
  password: z.string().min(6, "A palavra-passe deve ter pelo menos 6 caracteres."),
  fullName: z.string().min(2, "O nome completo deve ter pelo menos 2 caracteres."),
  role: z.enum(["admin", "editor", "cronista"]),
});

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

export async function POST(request: Request) {
  const { user: currentUser, role: currentRole } = await getCurrentUserWithRole();

  if (!currentUser) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  if (currentRole !== "admin") return NextResponse.json({ error: "Sem permissão." }, { status: 403 });

  try {
    const payload = await request.json();
    const parsed = createUserSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
        { status: 400 }
      );
    }

    const { email, password, fullName, role } = parsed.data;

    const adminClient = createSupabaseAdminClient();

    // Create the user in Supabase auth
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authUser.user) {
      return NextResponse.json({ error: "Erro ao criar utilizador." }, { status: 500 });
    }

    // Update their profile with the specified role and full name
    // The DB trigger handles the initial profile insert, so we do an update/upsert
    const { error: profileError } = await adminClient
      .from("profiles")
      .update({ role, full_name: fullName })
      .eq("id", authUser.user.id);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, userId: authUser.user.id });
  } catch (err) {
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}
