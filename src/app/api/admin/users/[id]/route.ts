import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUserWithRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const patchSchema = z.object({
  role: z.enum(["admin", "editor", "cronista"]).optional(),
  fullName: z.string().min(2).optional(),
  email: z.string().email().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  const { user, role } = await getCurrentUserWithRole();

  if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
  if (role !== "admin") return NextResponse.json({ error: "Sem permissao." }, { status: 403 });

  const { id } = await params;
  const payload = await request.json();
  const parsed = patchSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Payload invalido." }, { status: 400 });
  }

  const { role: newRole, fullName, email } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const adminClient = createSupabaseAdminClient();

  // Update profile fields
  const updates: any = {};
  if (newRole) updates.role = newRole;
  if (fullName) updates.full_name = fullName;

  if (Object.keys(updates).length > 0) {
    const { error } = await supabase.from("profiles").update(updates).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Update email if provided
  if (email) {
    const { error: emailError } = await adminClient.auth.admin.updateUserById(id, { email });
    if (emailError) return NextResponse.json({ error: emailError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const { user, role } = await getCurrentUserWithRole();
  if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
  if (role !== "admin") return NextResponse.json({ error: "Sem permissao." }, { status: 403 });

  const { id } = await params;
  const adminClient = createSupabaseAdminClient();

  // Delete auth user
  const { error: authError } = await adminClient.auth.admin.deleteUser(id);
  if (authError) return NextResponse.json({ error: authError.message }, { status: 400 });

  // Delete profile row
  const { error: profileError } = await adminClient.from("profiles").delete().eq("id", id);
  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
