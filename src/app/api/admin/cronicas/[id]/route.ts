import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth";
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
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

  const { id } = await params;
  const payload = await request.json();
  const parsed = patchSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados invalidos." },
      { status: 400 }
    );
  }

  const values = parsed.data;
  const supabase = await createSupabaseServerClient();

  const updateData: Record<string, unknown> = {};
  if (values.title !== undefined) updateData.title = values.title;
  if (values.content !== undefined) updateData.content = values.content;
  if (values.authorName !== undefined) updateData.author_name = values.authorName;
  if (values.authorRole !== undefined) updateData.author_role = values.authorRole;
  if (values.authorAvatarUrl !== undefined) updateData.author_avatar_url = values.authorAvatarUrl;
  if (values.weekLabel !== undefined) updateData.week_label = values.weekLabel;
  if (values.status !== undefined) {
    updateData.status = values.status;
    if (values.status === "published") {
      updateData.published_at = new Date().toISOString();
    }
  }

  const { error } = await supabase.from("cronicas").update(updateData).eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("cronicas").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
