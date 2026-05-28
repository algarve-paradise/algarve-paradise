import { NextResponse } from "next/server";

import { getCurrentUserWithRole } from "@/lib/auth";
import { normalizeNewsFormValues, newsFormSchema } from "@/lib/news-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { user, role } = await getCurrentUserWithRole();

  if (!user) {
    return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
  }

  if (!["admin", "editor"].includes(role)) {
    return NextResponse.json({ error: "Sem permissao." }, { status: 403 });
  }

  const { id } = await context.params;
  const supabase = await createSupabaseServerClient();

  // Editors can only edit their own posts
  if (role === "editor") {
    const { data: existing } = await supabase
      .from("news_posts")
      .select("author_id")
      .eq("id", id)
      .maybeSingle();

    if (!existing || existing.author_id !== user.id) {
      return NextResponse.json({ error: "Sem permissao para editar esta noticia." }, { status: 403 });
    }
  }

  const payload = await request.json();
  const parsed = newsFormSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados invalidos." },
      { status: 400 }
    );
  }

  const values = normalizeNewsFormValues(parsed.data);

  // Editors cannot publish or set featured/live
  const status = role === "editor" ? "draft" : values.status;

  const { error } = await supabase
    .from("news_posts")
    .update({
      slug: values.slug,
      title: values.title,
      excerpt: values.excerpt,
      content: values.content,
      category: values.category,
      source_name: values.sourceName,
      source_url: values.sourceUrl,
      cover_image_url: values.coverImageUrl,
      cover_image_path: values.coverImagePath,
      youtube_url: values.youtubeUrl ?? null,
      featured: role === "admin" ? values.featured : undefined,
      live: role === "admin" ? values.live : undefined,
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ id });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { user, role } = await getCurrentUserWithRole();

  if (!user) {
    return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
  }

  if (!["admin", "editor"].includes(role)) {
    return NextResponse.json({ error: "Sem permissao." }, { status: 403 });
  }

  const { id } = await context.params;
  const supabase = await createSupabaseServerClient();

  // Editors can only delete their own posts
  if (role === "editor") {
    const { data: existing } = await supabase
      .from("news_posts")
      .select("author_id")
      .eq("id", id)
      .maybeSingle();

    if (!existing || existing.author_id !== user.id) {
      return NextResponse.json({ error: "Sem permissao para apagar esta noticia." }, { status: 403 });
    }
  }

  const { error } = await supabase.from("news_posts").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
