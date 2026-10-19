import type { CorretorMock } from "@/lib/mock/corretores";

// Pessoa do painel (admin ou corretor) como as telas usam.
export type Corretor = CorretorMock & { fotoUrl: string | null; apareceNoSite: boolean };

export const COLUNAS_PERFIL =
  "id, nome, creci, especialidade, whatsapp, email, foto_url, bio, instagram, papel, ativo, aparece_no_site";

export interface LinhaPerfil {
  id: string;
  nome: string;
  creci: string | null;
  especialidade: string | null;
  whatsapp: string | null;
  email: string | null;
  foto_url: string | null;
  bio: string | null;
  instagram: string | null;
  papel: "admin" | "corretor";
  ativo: boolean;
  aparece_no_site?: boolean;
}

// Converte a linha da tabela perfis. O e-mail de login fica no Authentication,
// por isso vem à parte.
export function dePerfil(p: LinhaPerfil, emailAcesso = ""): Corretor {
  return {
    id: p.id,
    nome: p.nome,
    creci: p.creci ?? "",
    especialidade: p.especialidade ?? "",
    whatsapp: p.whatsapp ?? "",
    email: p.email ?? "",
    emailAcesso,
    papel: p.papel,
    ativo: p.ativo,
    bio: p.bio ?? "",
    instagram: p.instagram ?? "",
    fotoUrl: p.foto_url,
    apareceNoSite: p.aparece_no_site ?? true,
  };
}
