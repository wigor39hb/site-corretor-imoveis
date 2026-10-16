import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Botão "Sair" do painel: encerra a sessão e volta para o login.
export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/admin/login", request.url), { status: 303 });
}
