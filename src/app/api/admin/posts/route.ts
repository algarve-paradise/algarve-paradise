import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { normalizeNewsFormValues, newsFormSchema } from "@/lib/news-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
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
      featured: values.featured,
      live: values.live,
      status: values.status,
      published_at: values.status === "published" ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ id: data.id });
}
