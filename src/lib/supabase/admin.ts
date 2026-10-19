import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente com a chave mestra (service role). Ignora as regras de segurança do banco,
// por isso SÓ pode ser usado no servidor e depois de conferir que quem pediu é admin.
// Serve para mexer nos logins (criar usuário, trocar e-mail ou senha de outra pessoa).
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
