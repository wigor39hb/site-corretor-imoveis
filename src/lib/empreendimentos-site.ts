import { clienteVisitante } from "@/lib/imoveis-site";
import {
  COLUNAS_EMPREENDIMENTO, deEmpreendimento, type Empreendimento, type LinhaEmpreendimento,
} from "@/lib/empreendimentos";

// Leituras do site público: só o que um visitante vê (empreendimentos visíveis).

// Os marcados como destaque primeiro, depois os mais novos.
export async function listarEmpreendimentosSite(): Promise<Empreendimento[]> {
  const supabase = clienteVisitante();
  const { data, error } = await supabase
    .from("empreendimentos").select(COLUNAS_EMPREENDIMENTO)
    .order("destaque", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Erro ao ler os empreendimentos:", error.message);
    return [];
  }
  const lista = (data as LinhaEmpreendimento[]).map(deEmpreendimento);
  if (lista.length) {
    const { data: fotos } = await supabase
      .from("fotos").select("empreendimento_id, caminho").in("empreendimento_id", lista.map((e) => e.id)).order("ordem");
    const capas = new Map<string, string>();
    for (const f of fotos ?? []) if (!capas.has(f.empreendimento_id)) capas.set(f.empreendimento_id, f.caminho);
    for (const e of lista) e.capa = capas.get(e.id) ?? null;
  }
  return lista;
}

export type FotoSite = { caminho: string; legenda: string };
export type EmpreendimentoDetalhe = { empreendimento: Empreendimento; fotos: FotoSite[] };

export async function buscarEmpreendimentoSite(id: string): Promise<EmpreendimentoDetalhe | null> {
  const supabase = clienteVisitante();
  const { data } = await supabase.from("empreendimentos").select(COLUNAS_EMPREENDIMENTO).eq("id", id).maybeSingle();
  if (!data) return null; // inclui id inválido (ex.: link antigo) e empreendimento fora do site
  const { data: fotos } = await supabase
    .from("fotos").select("caminho, legenda").eq("empreendimento_id", id).order("ordem");
  return {
    empreendimento: deEmpreendimento(data as LinhaEmpreendimento),
    fotos: (fotos ?? []).map((f) => ({ caminho: f.caminho, legenda: f.legenda ?? "" })),
  };
}
