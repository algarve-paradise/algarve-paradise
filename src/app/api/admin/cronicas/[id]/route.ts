import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUserWithRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const patchSchema = z.object({
  title: z.string().trim().min(4).optional(),
  content: z.string().trim().min(20).optional(),
  authorName: z.string().trim().min(2).optional(),
  authorRole: z.string().trim().nullable().optional(),
  authorAvatarUrl: z
    .string()
    .trim()
    .nullable()
    .optional()
    .refine((v) => !v || /^https?:\/\//.test(v), {
      message: "Informe um URL valido para o avatar.",
    }),
  weekLabel: z.string().trim().min(3).optional(),
  status: z.enum(["draft", "published"]).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  const { user, role } = await getCurrentUserWithRole();

  if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

  if (!["admin", "cronista"].includes(role)) {
    return NextResponse.json({ error: "Sem permissao." }, { status: 403 });
  }

  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  // Cronistas can only edit their own
  if (role === "cronista") {
    const { data: existing } = await supabase
      .from("cronicas")
      .select("author_id")
      .eq("id", id)
      .maybeSingle();

    if (!existing || existing.author_id !== user.id) {
      return NextResponse.json({ error: "Sem permissao para editar esta cronica." }, { status: 403 });
    }
  }

  const payload = await request.json();
  const parsed = patchSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados invalidos." },
      { status: 400 }
    );
  }

  const values = parsed.data;
  const updateData: Record<string, unknown> = {};

  if (values.title !== undefined) updateData.title = values.title;
  if (values.content !== undefined) updateData.content = values.content;
  if (values.authorName !== undefined) updateData.author_name = values.authorName;
  if (values.authorRole !== undefined) updateData.author_role = values.authorRole;
  if (values.authorAvatarUrl !== undefined) updateData.author_avatar_url = values.authorAvatarUrl;
  if (values.weekLabel !== undefined) updateData.week_label = values.weekLabel;

  if (values.status !== undefined) {
    // Cronistas cannot publish
    const status = role === "cronista" ? "draft" : values.status;
    updateData.status = status;
    if (status === "published") {
      updateData.published_at = new Date().toISOString();
    }
  }

  const { error } = await supabase.from("cronicas").update(updateData).eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { user, role } = await getCurrentUserWithRole();

  if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

  if (!["admin", "cronista"].includes(role)) {
    return NextResponse.json({ error: "Sem permissao." }, { status: 403 });
  }

  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  // Cronistas can only delete their own
  if (role === "cronista") {
    const { data: existing } = await supabase
      .from("cronicas")
      .select("author_id")
      .eq("id", id)
      .maybeSingle();

    if (!existing || existing.author_id !== user.id) {
      return NextResponse.json({ error: "Sem permissao para apagar esta cronica." }, { status: 403 });
    }
  }

  const { error } = await supabase.from("cronicas").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
