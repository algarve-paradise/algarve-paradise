import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { env } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function sanitizeFilename(value: string) {
  return value.replace(/[^a-zA-Z0-9.-]/g, "-").toLowerCase();
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Ficheiro invalido." }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "A imagem deve ter no maximo 5 MB." }, { status: 400 });
  }

  const extension = file.name.split(".").pop() || "jpg";
  const filePath = `news/${user.id}/${randomUUID()}-${sanitizeFilename(file.name || `cover.${extension}`)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const supabaseAdmin = createSupabaseAdminClient();

  const { error } = await supabaseAdmin.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .upload(filePath, buffer, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { data } = supabaseAdmin.storage.from(env.SUPABASE_STORAGE_BUCKET).getPublicUrl(filePath);

  return NextResponse.json({
    path: filePath,
    url: data.publicUrl,
  });
}
