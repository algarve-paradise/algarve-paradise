import { NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function POST(request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const { name, comment } = body as Record<string, string>;
  const cleanName = name?.trim();
  const cleanComment = comment?.trim();

  if (!cleanName || cleanName.length < 2) {
    return NextResponse.json({ error: "Indique um nome válido." }, { status: 400 });
  }

  if (!cleanComment || cleanComment.length < 3) {
    return NextResponse.json({ error: "Escreva um comentário válido." }, { status: 400 });
  }

  if (cleanName.length > 80 || cleanComment.length > 800) {
    return NextResponse.json(
      { error: "Nome ou comentário acima do limite permitido." },
      { status: 400 },
    );
  }

  const supabase = createSupabaseAdminClient();
  const { data: article } = await supabase
    .from("news_posts")
    .select("slug")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!article) {
    return NextResponse.json({ error: "Notícia não encontrada." }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("news_comments")
    .insert({
      article_slug: slug,
      name: cleanName,
      comment: cleanComment,
      approved: true,
    })
    .select("id, article_slug, name, comment, created_at")
    .single();

  if (error) {
    console.error("Failed to insert news comment", error);
    return NextResponse.json(
      { error: "Erro ao guardar comentário. Tente novamente." },
      { status: 500 },
    );
  }

  return NextResponse.json({ comment: data });
}

