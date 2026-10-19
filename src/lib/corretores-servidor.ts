import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { COLUNAS_PERFIL, dePerfil, type Corretor, type LinhaPerfil } from "@/lib/corretores";

// Confere se quem está logado é um administrador ativo.
// Devolve o cliente do Supabase da sessão e o id do usuário, ou null.
export async function adminLogado() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: perfil } = await supabase.from("perfis").select("papel, ativo").eq("id", user.id).single();
  if (!perfil || perfil.papel !== "admin" || !perfil.ativo) return null;
  return { supabase, uid: user.id };
}

// E-mails de login de todos os usuários (ficam no Authentication, não na tabela perfis).
async function emailsDeAcesso() {
  const { data, error } = await createAdminClient().auth.admin.listUsers({ perPage: 1000 });
  if (error) throw error;
  return new Map(data.users.map((u) => [u.id, u.email ?? ""]));
}

// Tela Corretores do painel (só admin): todos, com e-mail de acesso e nº de imóveis.
export async function listarCorretoresPainel(): Promise<(Corretor & { totalImoveis: number })[]> {
  const supabase = await createClient();
  const [{ data: perfis, error }, { data: imoveis }, emails] = await Promise.all([
    supabase.from("perfis").select(COLUNAS_PERFIL).order("nome"),
    supabase.from("imoveis").select("corretor_id"),
    emailsDeAcesso(),
  ]);
  if (error) throw error;
  return (perfis as LinhaPerfil[]).map((p) => ({
    ...dePerfil(p, emails.get(p.id)),
    totalImoveis: (imoveis ?? []).filter((im) => im.corretor_id === p.id).length,
  }));
}

export async function buscarCorretor(id: string): Promise<Corretor | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("perfis").select(COLUNAS_PERFIL).eq("id", id).maybeSingle();
  if (!data) return null;
  const { data: auth } = await createAdminClient().auth.admin.getUserById(id);
  return dePerfil(data as LinhaPerfil, auth.user?.email ?? "");
}

// Seção "Nossa Equipe" do site: só corretores ativos e marcados para aparecer.
export async function listarEquipe(): Promise<Corretor[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("perfis")
    .select(COLUNAS_PERFIL)
    .eq("ativo", true)
    .eq("aparece_no_site", true)
    .order("ordem")
    .order("nome");
  if (error) {
    console.error("Erro ao ler a equipe:", error.message);
    return [];
  }
  return (data as LinhaPerfil[]).map((p) => dePerfil(p));
}
