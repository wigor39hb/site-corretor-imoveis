export interface Imovel {
  id: string;
  titulo: string;
  tipo: "apartamento" | "casa" | "terreno" | "comercial";
  status: "disponivel" | "vendido" | "reservado" | "lancamento";
  preco: number | null;
  area: number | null;
  quartos: number;
  banheiros: number;
  vagas: number;
  endereco: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
  descricao: string | null;
  fotos: string[];
  destaque: boolean;
  empreendimento_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Empreendimento {
  id: string;
  nome: string;
  tipo: string;
  status: "em-construcao" | "pronto" | "lancamento";
  descricao: string | null;
  localizacao: string | null;
  capa_url: string | null;
  galeria: string[];
  diferenciais: string[];
  entrega_prevista: string | null;
  created_at: string;
  updated_at: string;
}

export interface Perfil {
  id: string;
  nome: string | null;
  creci: string | null;
  foto_url: string | null;
  bio: string | null;
  especialidades: string[];
  whatsapp: string | null;
  email: string | null;
  instagram: string | null;
  linkedin: string | null;
}
