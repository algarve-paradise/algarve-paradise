import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type RouteContext = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  url: z.string().url().optional(),
  type: z.enum(["rss", "sitemap", "html", "ical", "api"]).optional(),
  region: z.string().min(2).max(60).optional(),
  content_kind: z.enum(["news", "events"]).optional(),
  default_category: z
    .enum(["Algarve", "Municipios", "Economia", "Turismo", "Seguranca", "Eventos", "Reportagem"])
    .optional(),
  enabled: z.boolean().optional(),
  rate_limit_seconds: z.number().int().min(0).max(86400).optional(),
});

export async function PATCH(request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados invalidos." },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("ingest_sources")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    const msg = error.code === "23505" ? "Ja existe uma fonte com este URL." : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  return NextResponse.json({ id });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

  const { id } = await context.params;
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase.from("ingest_sources").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ deleted: id });
}
