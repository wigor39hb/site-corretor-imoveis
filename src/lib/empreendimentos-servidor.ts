import { createClient } from "@/lib/supabase/server";
import { usuarioPainel } from "@/lib/imoveis-servidor";
import {
  COLUNAS_EMPREENDIMENTO, deEmpreendimento, type Empreendimento, type FotoEmpreendimento, type LinhaEmpreendimento,
} from "@/lib/empreendimentos";

// Leituras do painel. Só admin e assistente veem os empreendimentos (as regras do banco garantem).

export async function listarEmpreendimentosPainel(): Promise<Empreendimento[]> {
  const sessao = await usuarioPainel();
  if (!sessao?.cuidaDeEmpreendimentos) return [];
  const { data, error } = await sessao.supabase
    .from("empreendimentos").select(COLUNAS_EMPREENDIMENTO).order("created_at", { ascending: false });
  if (error) throw error;
  const lista = (data as LinhaEmpreendimento[]).map(deEmpreendimento);

  // Capa de cada empreendimento = foto de menor ordem.
  if (lista.length) {
    const { data: fotos } = await sessao.supabase
      .from("fotos").select("empreendimento_id, caminho").in("empreendimento_id", lista.map((e) => e.id)).order("ordem");
    const capas = new Map<string, string>();
    for (const f of fotos ?? []) if (!capas.has(f.empreendimento_id)) capas.set(f.empreendimento_id, f.caminho);
    for (const e of lista) e.capa = capas.get(e.id) ?? null;
  }
  return lista;
}

export async function buscarEmpreendimento(id: string): Promise<Empreendimento | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("empreendimentos").select(COLUNAS_EMPREENDIMENTO).eq("id", id).maybeSingle();
  return data ? deEmpreendimento(data as LinhaEmpreendimento) : null;
}

export async function listarFotosEmpreendimento(id: string): Promise<FotoEmpreendimento[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("fotos").select("id, caminho, ordem, legenda").eq("empreendimento_id", id).order("ordem");
  return data ?? [];
}
