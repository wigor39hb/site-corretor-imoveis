import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { LOGIN_SIMULADO } from "@/lib/auth-config";

// Botão "Sair" do painel: encerra a sessão e volta para o login.
export async function POST(request: Request) {
  if (!LOGIN_SIMULADO) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  return NextResponse.redirect(new URL("/admin/login", request.url), { status: 303 });
}
