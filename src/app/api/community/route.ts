import { NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const { name, municipality, message } = body as Record<string, string>;

  if (!name?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "Nome e mensagem são obrigatórios." },
      { status: 400 }
    );
  }

  if (message.trim().length > 600) {
    return NextResponse.json(
      { error: "Mensagem demasiado longa (máximo 600 caracteres)." },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("community_messages").insert({
    name: name.trim(),
    municipality: municipality?.trim() || null,
    message: message.trim(),
    approved: false,
  });

  if (error) {
    console.error("Failed to insert community message", error);
    return NextResponse.json(
      { error: "Erro ao guardar mensagem. Tente novamente." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
