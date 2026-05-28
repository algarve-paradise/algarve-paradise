import { NextResponse } from "next/server";

import { getCurrentUserWithRole } from "@/lib/auth";
import { normalizeNewsFormValues, newsFormSchema } from "@/lib/news-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { user, role } = await getCurrentUserWithRole();

  if (!user) {
    return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
  }

  if (!["admin", "editor"].includes(role)) {
    return NextResponse.json({ error: "Sem permissao." }, { status: 403 });
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

  // Editors cannot publish — force draft
  const status = role === "editor" ? "draft" : values.status;

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("news_posts")
    .insert({
      author_id: user.id,
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
      featured: role === "admin" ? values.featured : false,
      live: role === "admin" ? values.live : false,
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ id: data.id });
}
