import { createClient } from "@/lib/supabase/server";
import { COLUNAS_IMOVEL, deImovel, type Imovel, type LinhaImovel, type Opcao } from "@/lib/imoveis";

// Quem está logado no painel. Devolve o cliente da sessão, o id e se é admin.
export async function usuarioPainel() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: perfil } = await supabase.from("perfis").select("papel, ativo").eq("id", user.id).single();
  if (!perfil?.ativo) return null;
  return { supabase, uid: user.id, isAdmin: perfil.papel === "admin" };
}

// O admin vê todos; o corretor, só os próprios. (O filtro é necessário porque
// as regras do banco também deixam qualquer um ver os imóveis visíveis do site.)
export async function listarImoveisPainel(): Promise<Imovel[]> {
  const sessao = await usuarioPainel();
  if (!sessao) return [];
  let consulta = sessao.supabase.from("imoveis").select(COLUNAS_IMOVEL).order("created_at", { ascending: false });
  if (!sessao.isAdmin) consulta = consulta.eq("corretor_id", sessao.uid);
  const { data, error } = await consulta;
  if (error) throw error;
  return (data as LinhaImovel[]).map(deImovel);
}

export async function buscarImovel(id: string): Promise<Imovel | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("imoveis").select(COLUNAS_IMOVEL).eq("id", id).maybeSingle();
  return data ? deImovel(data as LinhaImovel) : null;
}

// Pessoas que podem ser "corretor responsável" (só o admin escolhe; o corretor publica em nome próprio).
export async function listarOpcoesCorretores(): Promise<Opcao[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("perfis").select("id, nome, ativo").order("nome");
  return (data ?? []).map((p) => ({ id: p.id, nome: p.nome || "(sem nome)", ativo: p.ativo }));
}

export async function listarOpcoesEmpreendimentos(): Promise<Opcao[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("empreendimentos").select("id, nome").order("nome");
  return data ?? [];
}
