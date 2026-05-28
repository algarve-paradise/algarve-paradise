import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUserWithRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const patchSchema = z.object({
  role: z.enum(["admin", "editor", "cronista"]),
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
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Role invalido." },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("profiles")
    .update({ role: parsed.data.role })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
