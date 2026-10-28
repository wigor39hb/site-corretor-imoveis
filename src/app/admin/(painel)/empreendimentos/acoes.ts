"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { BUCKET_FOTOS } from "@/lib/helpers/imagem";
import { arquivosDaFoto } from "@/lib/imoveis";
import { paraLinhaEmpreendimento, statusEmpLabel, type Empreendimento } from "@/lib/empreendimentos";

// Ações da tela Empreendimentos. Usam a sessão de quem está logado, então as regras
// do banco valem: só admin e assistente criam, editam e excluem.

type Resultado = { erro?: string; id?: string };

function atualizarTelas() {
  revalidatePath("/admin/empreendimentos");
  revalidatePath("/admin");
}

export async function salvarEmpreendimento(dados: Empreendimento): Promise<Resultado> {
  if (!dados.nome.trim()) return { erro: "Preencha o nome do empreendimento." };
  if (!(dados.status in statusEmpLabel)) return { erro: "Situação inválida." };

  const supabase = await createClient();
  const linha = paraLinhaEmpreendimento(dados);
  const { data, error } = dados.id
    ? await supabase.from("empreendimentos").update(linha).eq("id", dados.id).select("id").maybeSingle()
    : await supabase.from("empreendimentos").insert(linha).select("id").single();
  if (error || !data) {
    return { erro: dados.id ? "Não foi possível salvar. Tente novamente." : "Não foi possível cadastrar o empreendimento." };
  }
  atualizarTelas();
  return { id: data.id };
}

// As linhas das fotos saem junto (o banco apaga em cascata); os arquivos do
// Storage são apagados depois, só dos empreendimentos que foram mesmo excluídos.
export async function excluirEmpreendimento(id: string): Promise<Resultado> {
  const supabase = await createClient();
  const { data: fotos } = await supabase.from("fotos").select("caminho").eq("empreendimento_id", id);
  const { data: excluidos, error } = await supabase.from("empreendimentos").delete().eq("id", id).select("id");
  if (error || !excluidos?.length) return { erro: "Não foi possível excluir." };

  const arquivos = (fotos ?? []).flatMap((f) => arquivosDaFoto(f.caminho));
  if (arquivos.length) await supabase.storage.from(BUCKET_FOTOS).remove(arquivos);

  atualizarTelas();
  return {};
}
