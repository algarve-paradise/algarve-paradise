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
    .select("id, ingest_item_id")
    .eq("id", id)
    .maybeSingle();

  if (readError || !row) {
    return NextResponse.json(
      { error: readError?.message ?? "Evento nao encontrado." },
      { status: 404 }
    );
  }

  const { error } = await supabase
    .from("events")
    .update({ status: "published", published_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (row.ingest_item_id) {
    const admin = createSupabaseAdminClient();
    const { data: item } = await admin
      .from("ingest_items")
      .select("source_id")
      .eq("id", row.ingest_item_id)
      .maybeSingle();
    await bumpSourceCounter(item?.source_id ?? null, "published");
  }

  return NextResponse.json({ id, status: "published" });
}
