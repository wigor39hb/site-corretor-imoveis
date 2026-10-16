// Corretores de exemplo. Provisório: na etapa do banco de dados,
// cada corretor é cadastrado pelo painel admin e esses dados vêm de lá.
export type Papel = "admin" | "corretor";

export interface CorretorMock {
  id: string;
  nome: string;
  creci: string;
  especialidade: string;
  whatsapp: string; // só números, com DDI e DDD: 5511999999999
  email: string; // e-mail de contato (aparece no site)
  emailAcesso: string; // e-mail usado para entrar no painel
  papel: Papel;
  ativo: boolean; // inativo = não entra no painel e some do site
  bio: string;
  instagram: string;
}

export const corretores: CorretorMock[] = [
  { id: "1", nome: "Ana Souza", creci: "CRECI-SP 000001-F", especialidade: "Alto padrão · Jardins e Itaim", whatsapp: "5511999990001", email: "ana@exemplo.com.br", emailAcesso: "ana@exemplo.com.br", papel: "admin", ativo: true, bio: "Atua há mais de 10 anos no segmento de alto padrão em São Paulo.", instagram: "@ana.imoveis" },
  { id: "2", nome: "Bruno Lima", creci: "CRECI-SP 000002-F", especialidade: "Lançamentos e empreendimentos", whatsapp: "5511999990002", email: "bruno@exemplo.com.br", emailAcesso: "bruno@exemplo.com.br", papel: "corretor", ativo: true, bio: "Especialista em imóveis na planta e lançamentos.", instagram: "" },
  { id: "3", nome: "Carla Rocha", creci: "CRECI-SP 000003-F", especialidade: "Locação e investimentos", whatsapp: "5511999990003", email: "carla@exemplo.com.br", emailAcesso: "carla@exemplo.com.br", papel: "corretor", ativo: true, bio: "Ajuda investidores a encontrar imóveis com boa rentabilidade.", instagram: "" },
];

export function getCorretor(id: string) {
  return corretores.find((c) => c.id === id) ?? corretores[0];
}

export const papelLabel: Record<Papel, string> = {
  admin: "Administrador",
  corretor: "Corretor",
};
