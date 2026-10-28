import { createClient } from "@/lib/supabase/server";
import { COLUNAS_IMOVEL, deImovel, type FotoImovel, type Imovel, type LinhaImovel, type Opcao } from "@/lib/imoveis";

// Quem está logado no painel. Devolve o cliente da sessão, o id, se é admin
// e se mexe em imóveis (a assistente não mexe) e em empreendimentos (só admin e assistente).
export async function usuarioPainel() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: perfil } = await supabase.from("perfis").select("papel, ativo").eq("id", user.id).single();
  if (!perfil?.ativo) return null;
  return {
    supabase,
    uid: user.id,
    isAdmin: perfil.papel === "admin",
    cuidaDeImoveis: perfil.papel !== "assistente",
    cuidaDeEmpreendimentos: perfil.papel === "admin" || perfil.papel === "assistente",
  };
}

// O admin vê todos; o corretor, só os próprios. (O filtro é necessário porque
// as regras do banco também deixam qualquer um ver os imóveis visíveis do site.)
export async function listarImoveisPainel(): Promise<Imovel[]> {
  const sessao = await usuarioPainel();
  if (!sessao?.cuidaDeImoveis) return [];
  let consulta = sessao.supabase.from("imoveis").select(COLUNAS_IMOVEL).order("created_at", { ascending: false });
  if (!sessao.isAdmin) consulta = consulta.eq("corretor_id", sessao.uid);
  const { data, error } = await consulta;
  if (error) throw error;
  const imoveis = (data as LinhaImovel[]).map(deImovel);

  // Capa de cada imóvel = foto de menor ordem.
  if (imoveis.length) {
    const { data: fotos } = await sessao.supabase
      .from("fotos").select("imovel_id, caminho").in("imovel_id", imoveis.map((i) => i.id)).order("ordem");
    const capas = new Map<string, string>();
    for (const f of fotos ?? []) if (!capas.has(f.imovel_id)) capas.set(f.imovel_id, f.caminho);
    for (const i of imoveis) i.capa = capas.get(i.id) ?? null;
  }
  return imoveis;
}

export async function buscarImovel(id: string): Promise<Imovel | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("imoveis").select(COLUNAS_IMOVEL).eq("id", id).maybeSingle();
  return data ? deImovel(data as LinhaImovel) : null;
}

export async function listarFotosImovel(id: string): Promise<FotoImovel[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("fotos").select("id, caminho, ordem").eq("imovel_id", id).order("ordem");
  return data ?? [];
}

// Pessoas que podem ser "corretor responsável" (só o admin escolhe; o corretor publica em nome próprio).
// Assistentes ficam de fora: não anunciam imóveis.
export async function listarOpcoesCorretores(): Promise<Opcao[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("perfis").select("id, nome, ativo").neq("papel", "assistente").order("nome");
  return (data ?? []).map((p) => ({ id: p.id, nome: p.nome || "(sem nome)", ativo: p.ativo }));
}
