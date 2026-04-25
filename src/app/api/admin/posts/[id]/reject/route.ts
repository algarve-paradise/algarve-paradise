import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { bumpSourceCounter } from "@/lib/ingest/repository";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * Reject (delete) an AI-generated draft. Marks the originating ingest_item
 * as 'rejected' so it never re-enters the pipeline, and bumps the source
 * rejection counter for the quality score.
 */
export async function POST(_request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
  }

  const { id } = await context.params;
  const supabase = await createSupabaseServerClient();

  const { data: post, error: readError } = await supabase
    .from("news_posts")
    .select("id, ingest_item_id, ai_generated, status")
    .eq("id", id)
    .maybeSingle();

  if (readError || !post) {
    return NextResponse.json(
      { error: readError?.message ?? "Noticia nao encontrada." },
      { status: 404 }
    );
  }

  if (post.status !== "draft") {
    return NextResponse.json({ error: "So e possivel rejeitar rascunhos." }, { status: 400 });
  }

  const { error: deleteError } = await supabase.from("news_posts").delete().eq("id", id);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 400 });
  }

  if (post.ingest_item_id) {
    const admin = createSupabaseAdminClient();
    const { data: item } = await admin
      .from("ingest_items")
      .update({
        status: "rejected",
        processed_at: new Date().toISOString(),
        failure_reason: "Rejeitado manualmente no painel admin.",
      })
      .eq("id", post.ingest_item_id)
      .select("source_id")
      .maybeSingle();
    await bumpSourceCounter(item?.source_id ?? null, "rejected");
  }

  return NextResponse.json({ id, status: "rejected" });
}
