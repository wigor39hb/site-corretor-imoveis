"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BUCKET_FOTOS } from "@/lib/helpers/imagem";
import { arquivosDaFoto, paraLinha, statusLabel, type Imovel, type StatusImovel } from "@/lib/imoveis";

// Ações da tela Imóveis. Usam a sessão de quem está logado, então as regras
// do banco valem: o corretor só mexe nos próprios imóveis e o admin em todos.

type Resultado = { erro?: string; id?: string };

function validar(i: Imovel): string | null {
  if (!i.titulo.trim() || !i.descricao.trim()) {
    return "Preencha título e descrição.";
  }
  if (!i.preco) return "Informe o preço.";
  if (!i.corretorId) return "Escolha o corretor responsável.";
  if (!(i.status in statusLabel)) return "Status inválido.";
  return null;
}

function atualizarTelas() {
  revalidatePath("/admin/imoveis");
  revalidatePath("/admin");
}

export async function salvarImovel(dados: Imovel): Promise<Resultado> {
  const invalido = validar(dados);
  if (invalido) return { erro: invalido };

  const supabase = await createClient();
  const linha = paraLinha(dados);
  const { data, error } = dados.id
    ? await supabase.from("imoveis").update(linha).eq("id", dados.id).select("id").maybeSingle()
    : await supabase.from("imoveis").insert(linha).select("id").single();
  if (error || !data) {
    return { erro: dados.id ? "Não foi possível salvar. Tente novamente." : "Não foi possível cadastrar o imóvel." };
  }
  atualizarTelas();
  return { id: data.id };
}

export async function alterarStatusImoveis(ids: string[], status: StatusImovel): Promise<Resultado> {
  if (!(status in statusLabel)) return { erro: "Status inválido." };
  const supabase = await createClient();
  const { error } = await supabase.from("imoveis").update({ status }).in("id", ids);
  if (error) return { erro: "Não foi possível mudar o status." };
  atualizarTelas();
  return {};
}

// As linhas das fotos saem junto (o banco apaga em cascata); os arquivos do
// Storage são apagados depois, só dos imóveis que foram mesmo excluídos.
// Isso usa a chave mestra porque, sem o imóvel, a regra do Storage já não reconhece o dono.
export async function excluirImoveis(ids: string[]): Promise<Resultado> {
  const supabase = await createClient();
  const { data: fotos } = await supabase.from("fotos").select("imovel_id, caminho").in("imovel_id", ids);
  const { data: excluidos, error } = await supabase.from("imoveis").delete().in("id", ids).select("id");
  if (error) return { erro: "Não foi possível excluir." };

  const apagados = new Set((excluidos ?? []).map((i) => i.id));
  const arquivos = (fotos ?? []).filter((f) => apagados.has(f.imovel_id)).flatMap((f) => arquivosDaFoto(f.caminho));
  if (arquivos.length) await createAdminClient().storage.from(BUCKET_FOTOS).remove(arquivos);

  atualizarTelas();
  return {};
}
