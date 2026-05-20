import { NextResponse } from "next/server";
import { createSupabaseServerClient as createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, company, phone, tier, message } = body;

    if (!name || !email || !tier || !message) {
      return NextResponse.json({ error: "Campos obrigatórios em falta." }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("sponsorship_inquiries").insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company?.trim() || null,
      phone: phone?.trim() || null,
      tier,
      message: message.trim(),
    });

    if (error) {
      console.error("sponsorship insert error:", error);
      return NextResponse.json({ error: "Erro ao guardar o pedido." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }
}
