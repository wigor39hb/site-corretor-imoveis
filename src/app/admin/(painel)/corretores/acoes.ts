"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { adminLogado } from "@/lib/corretores-servidor";
import { whatsappValido } from "@/lib/helpers/formatters";
import type { Corretor } from "@/lib/corretores";

// Ações da tela Corretores. Rodam no servidor porque mexem nos logins
// (Authentication), o que exige a chave mestra.

type Resultado = { erro?: string; id?: string };

const SEM_PERMISSAO = { erro: "Só administradores podem fazer isso." };
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validar(dados: Corretor): string | null {
  if (!dados.nome.trim() || !dados.creci.trim() || !dados.whatsapp || !dados.emailAcesso.trim()) {
    return "Preencha nome, CRECI, WhatsApp e e-mail de acesso.";
  }
  if (!whatsappValido(dados.whatsapp)) return "WhatsApp incompleto. Digite o DDD e o número.";
  if (!EMAIL_VALIDO.test(dados.emailAcesso.trim())) return "E-mail de acesso inválido.";
  if (dados.email.trim() && !EMAIL_VALIDO.test(dados.email.trim())) return "E-mail de contato inválido.";
  return null;
}

function camposPerfil(dados: Corretor) {
  return {
    nome: dados.nome.trim(),
    creci: dados.creci.trim(),
    whatsapp: dados.whatsapp,
    email: dados.email.trim() || null,
    especialidade: dados.especialidade.trim() || null,
    bio: dados.bio.trim() || null,
    instagram: dados.instagram.trim() || null,
    aparece_no_site: dados.apareceNoSite,
  };
}

function atualizarTelas() {
  revalidatePath("/admin/corretores");
  revalidatePath("/contato");
}

export async function criarCorretor(dados: Corretor, senha: string): Promise<Resultado> {
  if (!(await adminLogado())) return SEM_PERMISSAO;
  const invalido = validar(dados);
  if (invalido) return { erro: invalido };
  if (senha.length < 8) return { erro: "A senha inicial precisa ter pelo menos 8 caracteres." };

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email: dados.emailAcesso.trim(),
    password: senha,
    email_confirm: true,
    user_metadata: { nome: dados.nome.trim() },
  });
  if (error || !data.user) {
    return { erro: error?.code === "email_exists" ? "Já existe uma conta com esse e-mail de acesso." : "Não foi possível criar o acesso." };
  }

  // O perfil nasce sozinho (gatilho do banco); aqui ele recebe os dados do formulário.
  const { error: erroPerfil } = await admin
    .from("perfis")
    .update({ ...camposPerfil(dados), papel: dados.papel, ativo: dados.ativo })
    .eq("id", data.user.id);
  if (erroPerfil) {
    await admin.auth.admin.deleteUser(data.user.id); // desfaz para não sobrar login sem perfil
    return { erro: "Não foi possível salvar o perfil. Nada foi criado." };
  }
  atualizarTelas();
  return { id: data.user.id };
}

export async function atualizarCorretor(id: string, dados: Corretor): Promise<Resultado> {
  const sessao = await adminLogado();
  if (!sessao) return SEM_PERMISSAO;
  const invalido = validar(dados);
  if (invalido) return { erro: invalido };

  // Usa a sessão do admin: o próprio banco impede mudar o próprio papel ou se desativar.
  const ehVoce = id === sessao.uid;
  const { error } = await sessao.supabase
    .from("perfis")
    .update({ ...camposPerfil(dados), ...(ehVoce ? {} : { papel: dados.papel, ativo: dados.ativo }) })
    .eq("id", id);
  if (error) return { erro: "Não foi possível salvar. Tente novamente." };

  const admin = createAdminClient();
  const { data } = await admin.auth.admin.getUserById(id);
  const novoEmail = dados.emailAcesso.trim().toLowerCase();
  if (data.user && data.user.email !== novoEmail) {
    const { error: erroEmail } = await admin.auth.admin.updateUserById(id, { email: novoEmail, email_confirm: true });
    if (erroEmail) {
      return { erro: erroEmail.code === "email_exists" ? "Dados salvos, mas já existe outra conta com esse e-mail de acesso." : "Dados salvos, mas não foi possível trocar o e-mail de acesso." };
    }
  }
  atualizarTelas();
  return {};
}

export async function definirSenha(id: string, senha: string): Promise<Resultado> {
  if (!(await adminLogado())) return SEM_PERMISSAO;
  if (senha.length < 8) return { erro: "A senha precisa ter pelo menos 8 caracteres." };
  const { error } = await createAdminClient().auth.admin.updateUserById(id, { password: senha });
  return error ? { erro: "Não foi possível trocar a senha." } : {};
}

export async function alternarAtivo(id: string, ativo: boolean): Promise<Resultado> {
  const sessao = await adminLogado();
  if (!sessao) return SEM_PERMISSAO;
  if (id === sessao.uid) return { erro: "Você não pode se desativar." };
  const { error } = await sessao.supabase.from("perfis").update({ ativo }).eq("id", id);
  if (error) return { erro: "Não foi possível mudar o status." };
  atualizarTelas();
  return {};
}
