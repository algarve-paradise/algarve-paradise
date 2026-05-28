import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUserWithRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const cronicaSchema = z.object({
  title: z.string().trim().min(4, "Informe um titulo com pelo menos 4 caracteres."),
  content: z.string().trim().min(20, "Informe o texto da cronica com pelo menos 20 caracteres."),
  authorName: z.string().trim().min(2, "Informe o nome do autor."),
  authorRole: z.string().trim().optional().nullable(),
  authorAvatarUrl: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine((v) => !v || /^https?:\/\//.test(v), {
      message: "Informe um URL valido para o avatar.",
    }),
  weekLabel: z.string().trim().min(3, "Informe o rotulo da semana."),
  status: z.enum(["draft", "published"]).default("draft"),
});

export async function GET() {
  const { user, role } = await getCurrentUserWithRole();

  if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

  if (!["admin", "cronista"].includes(role)) {
    return NextResponse.json({ error: "Sem permissao." }, { status: 403 });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("cronicas")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { user, role } = await getCurrentUserWithRole();

  if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

  if (!["admin", "cronista"].includes(role)) {
    return NextResponse.json({ error: "Sem permissao." }, { status: 403 });
  }

  const payload = await request.json();
  const parsed = cronicaSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados invalidos." },
      { status: 400 }
    );
  }

  const values = parsed.data;

  // Cronistas cannot publish — force draft
  const status = role === "cronista" ? "draft" : values.status;

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("cronicas")
    .insert({
      author_id: user.id,
      title: values.title,
      content: values.content,
      author_name: values.authorName,
      author_role: values.authorRole ?? null,
      author_avatar_url: values.authorAvatarUrl ?? null,
      week_label: values.weekLabel,
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ id: data.id });
}
