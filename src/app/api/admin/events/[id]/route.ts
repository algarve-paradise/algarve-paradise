import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { eventFormSchema, normalizeEventFormValues } from "@/lib/event-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
  }

  const { id } = await context.params;
  const payload = await request.json().catch(() => null);
  const parsed = eventFormSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados invalidos." },
      { status: 400 }
    );
  }

  const values = normalizeEventFormValues(parsed.data);
  const supabase = await createSupabaseServerClient();

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
      status: values.status,
      published_at: values.status === "published" ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ id });
}
