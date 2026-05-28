import { NextResponse } from "next/server";

import { getCurrentUserWithRole } from "@/lib/auth";
import { eventFormSchema, normalizeEventFormValues } from "@/lib/event-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
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

  // Editors can only edit their own events
  if (role === "editor") {
    const { data: existing } = await supabase
      .from("events")
      .select("author_id")
      .eq("id", id)
      .maybeSingle();

    if (!existing || existing.author_id !== user.id) {
      return NextResponse.json({ error: "Sem permissao para editar este evento." }, { status: 403 });
    }
  }

  const payload = await request.json().catch(() => null);
  const parsed = eventFormSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados invalidos." },
      { status: 400 }
    );
  }

  const values = normalizeEventFormValues(parsed.data);

  // Editors cannot publish
  const status = role === "editor" ? "draft" : values.status;

  const { error } = await supabase
    .from("events")
    .update({
      slug: values.slug,
      title: values.title,
      description: values.description,
      location: values.location,
      starts_at: new Date(values.startsAt).toISOString(),
      ends_at: values.endsAt ? new Date(values.endsAt).toISOString() : null,
      cover_image_url: values.coverImageUrl,
      cover_image_path: values.coverImagePath,
      source_name: values.sourceName,
      source_url: values.sourceUrl,
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

  if (role === "editor") {
    const { data: existing } = await supabase
      .from("events")
      .select("author_id")
      .eq("id", id)
      .maybeSingle();

    if (!existing || existing.author_id !== user.id) {
      return NextResponse.json({ error: "Sem permissao para apagar este evento." }, { status: 403 });
    }
  }

  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
