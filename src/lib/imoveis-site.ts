import { createClient } from "@supabase/supabase-js";
import { COLUNAS_IMOVEL, deImovel, type Imovel, type LinhaImovel } from "@/lib/imoveis";
import { COLUNAS_PERFIL, dePerfil, type Corretor, type LinhaPerfil } from "@/lib/corretores";

// Leituras do site público. Usa a chave pública SEM a sessão de quem está logado,
// para o site mostrar exatamente o que um visitante vê (só imóveis visíveis de
// corretores ativos), mesmo que o admin esteja logado no mesmo navegador.
export function clienteVisitante() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

type Supabase = ReturnType<typeof clienteVisitante>;

async function preencherCapas(supabase: Supabase, imoveis: Imovel[]) {
  if (!imoveis.length) return imoveis;
  const { data } = await supabase
    .from("fotos").select("imovel_id, caminho").in("imovel_id", imoveis.map((i) => i.id)).order("ordem");
  const capas = new Map<string, string>();
  for (const f of data ?? []) if (!capas.has(f.imovel_id)) capas.set(f.imovel_id, f.caminho);
  for (const i of imoveis) i.capa = capas.get(i.id) ?? null;
  return imoveis;
}

// Imóveis do site: os marcados como destaque primeiro, depois os mais novos.
export async function listarImoveisSite(): Promise<Imovel[]> {
  const supabase = clienteVisitante();
  const { data, error } = await supabase
    .from("imoveis").select(COLUNAS_IMOVEL)
    .order("destaque", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Erro ao ler os imóveis:", error.message);
    return [];
  }
  return preencherCapas(supabase, (data as LinhaImovel[]).map(deImovel));
}

// Página inicial: até `limite` imóveis, os em destaque primeiro (completa com os mais novos).
export async function listarDestaquesSite(limite = 3): Promise<Imovel[]> {
  return (await listarImoveisSite()).slice(0, limite);
}

export type ImovelDetalhe = { imovel: Imovel; fotos: string[]; corretor: Corretor | null; similares: Imovel[] };

export async function buscarImovelSite(id: string): Promise<ImovelDetalhe | null> {
  const supabase = clienteVisitante();
  const { data } = await supabase.from("imoveis").select(COLUNAS_IMOVEL).eq("id", id).maybeSingle();
  if (!data) return null; // inclui id inválido (ex.: link antigo) e imóvel fora do site
  const imovel = deImovel(data as LinhaImovel);

  const [{ data: fotos }, { data: perfil }, todos] = await Promise.all([
    supabase.from("fotos").select("caminho").eq("imovel_id", id).order("ordem"),
    supabase.from("perfis").select(COLUNAS_PERFIL).eq("id", imovel.corretorId).maybeSingle(),
    listarImoveisSite(),
  ]);

  // Similares: mesmo tipo primeiro, depois os demais.
  const outros = todos.filter((i) => i.id !== id);
  const similares = [...outros.filter((i) => i.tipo === imovel.tipo), ...outros.filter((i) => i.tipo !== imovel.tipo)].slice(0, 3);

  return {
    imovel,
    fotos: (fotos ?? []).map((f) => f.caminho),
    corretor: perfil ? dePerfil(perfil as LinhaPerfil) : null,
    similares,
  };
}
