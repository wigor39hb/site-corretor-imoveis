"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { paraLinha, statusLabel, type Imovel, type StatusImovel } from "@/lib/imoveis";

// Ações da tela Imóveis. Usam a sessão de quem está logado, então as regras
// do banco valem: o corretor só mexe nos próprios imóveis e o admin em todos.

type Resultado = { erro?: string; id?: string };

function validar(i: Imovel): string | null {
  if (!i.titulo.trim() || !i.descricao.trim() || !i.endereco.trim() || !i.cidade.trim()) {
    return "Preencha título, descrição, endereço e cidade.";
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

// As fotos ligadas ao imóvel saem junto (o banco apaga em cascata).
// TODO etapa Fotos: apagar também os arquivos do Storage (pasta imoveis/<id>/).
export async function excluirImoveis(ids: string[]): Promise<Resultado> {
  const supabase = await createClient();
  const { error } = await supabase.from("imoveis").delete().in("id", ids);
  if (error) return { erro: "Não foi possível excluir." };
  atualizarTelas();
  return {};
}
