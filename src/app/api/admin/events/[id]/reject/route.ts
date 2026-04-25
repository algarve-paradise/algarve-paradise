import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { bumpSourceCounter } from "@/lib/ingest/repository";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
  }

  const { id } = await context.params;
  const supabase = await createSupabaseServerClient();

  const { data: row, error: readError } = await supabase
    .from("events")
    .select("id, ingest_item_id, status")
    .eq("id", id)
    .maybeSingle();

  if (readError || !row) {
    return NextResponse.json(
      { error: readError?.message ?? "Evento nao encontrado." },
      { status: 404 }
    );
  }
  if (row.status !== "draft") {
    return NextResponse.json({ error: "So e possivel rejeitar rascunhos." }, { status: 400 });
  }

  const { error: deleteError } = await supabase.from("events").delete().eq("id", id);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 400 });
  }

  if (row.ingest_item_id) {
    const admin = createSupabaseAdminClient();
    const { data: item } = await admin
      .from("ingest_items")
      .update({
        status: "rejected",
        processed_at: new Date().toISOString(),
        failure_reason: "Rejeitado manualmente no painel admin.",
      })
      .eq("id", row.ingest_item_id)
      .select("source_id")
      .maybeSingle();
    await bumpSourceCounter(item?.source_id ?? null, "rejected");
  }

  return NextResponse.json({ id, status: "rejected" });
}
