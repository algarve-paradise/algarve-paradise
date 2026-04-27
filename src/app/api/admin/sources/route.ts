import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const sourceSchema = z.object({
  name: z.string().min(2).max(120),
  url: z.string().url(),
  type: z.enum(["rss", "sitemap", "html", "ical", "api"]),
  region: z.string().min(2).max(60).default("algarve"),
  content_kind: z.enum(["news", "events"]).default("news"),
  default_category: z
    .enum(["Algarve", "Municipios", "Economia", "Turismo", "Seguranca", "Eventos"])
    .default("Algarve"),
  enabled: z.boolean().default(true),
  rate_limit_seconds: z.number().int().min(0).max(86400).default(300),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("ingest_source_quality")
    .select("*")
    .order("content_kind", { ascending: true })
    .order("quality_score", { ascending: false, nullsFirst: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = sourceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados invalidos." },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("ingest_sources")
    .insert({
      name: parsed.data.name,
      url: parsed.data.url,
      type: parsed.data.type,
      region: parsed.data.region,
      content_kind: parsed.data.content_kind,
      default_category: parsed.data.default_category,
      enabled: parsed.data.enabled,
      rate_limit_seconds: parsed.data.rate_limit_seconds,
    })
    .select("id")
    .single();

  if (error) {
    const msg = error.code === "23505" ? "Ja existe uma fonte com este URL." : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
