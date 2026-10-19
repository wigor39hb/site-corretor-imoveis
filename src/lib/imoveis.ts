// Imóvel como as telas do painel usam, e a conversão de/para a tabela imoveis.

export type TipoImovel = "apartamento" | "casa" | "studio" | "cobertura" | "terreno" | "comercial" | "chacara";
export type Finalidade = "venda" | "aluguel" | "venda_aluguel";
export type StatusImovel = "disponivel" | "reservado" | "vendido" | "lancamento";

export const tipoLabel: Record<TipoImovel, string> = {
  apartamento: "Apartamento",
  casa: "Casa",
  studio: "Studio",
  cobertura: "Cobertura",
  terreno: "Terreno",
  comercial: "Comercial",
  chacara: "Chácara",
};

export const tipoIcone: Record<TipoImovel, string> = {
  apartamento: "🏢", casa: "🏡", studio: "🏢", cobertura: "🏙", terreno: "🌳", comercial: "🏬", chacara: "🌾",
};

export const finalidadeLabel: Record<Finalidade, string> = {
  venda: "Venda",
  aluguel: "Aluguel",
  venda_aluguel: "Venda e Aluguel",
};

export const statusLabel: Record<StatusImovel, string> = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
  lancamento: "Lançamento",
};

// A KL atua em Mato Grosso: o formulário já começa com MT.
export const ESTADO_PADRAO = "MT";
export const ESTADOS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

// Item de uma lista de escolha (corretor responsável, empreendimento).
export type Opcao = { id: string; nome: string; ativo?: boolean };

export interface Imovel {
  id: string;
  corretorId: string;
  empreendimentoId: string;
  titulo: string;
  tipo: TipoImovel;
  finalidade: Finalidade;
  status: StatusImovel;
  preco: number | null;
  area: number | null;
  quartos: number;
  suites: number;
  banheiros: number;
  vagas: number;
  andar: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  descricao: string;
  destaque: boolean;
  visivel: boolean;
}

export const COLUNAS_IMOVEL =
  "id, corretor_id, empreendimento_id, titulo, tipo, finalidade, status, preco, area, quartos, suites, banheiros, vagas, andar, cep, endereco, numero, complemento, bairro, cidade, estado, descricao, destaque, visivel";

export interface LinhaImovel {
  id: string;
  corretor_id: string;
  empreendimento_id: string | null;
  titulo: string;
  tipo: TipoImovel;
  finalidade: Finalidade;
  status: StatusImovel;
  preco: number | string | null; // o Supabase devolve numeric como texto
  area: number | string | null;
  quartos: number;
  suites: number;
  banheiros: number;
  vagas: number;
  andar: string | null;
  cep: string | null;
  endereco: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  descricao: string | null;
  destaque: boolean;
  visivel: boolean;
}

const numero = (v: number | string | null) => (v === null || v === "" ? null : Number(v));

export function deImovel(l: LinhaImovel): Imovel {
  return {
    id: l.id,
    corretorId: l.corretor_id,
    empreendimentoId: l.empreendimento_id ?? "",
    titulo: l.titulo,
    tipo: l.tipo,
    finalidade: l.finalidade,
    status: l.status,
    preco: numero(l.preco),
    area: numero(l.area),
    quartos: l.quartos,
    suites: l.suites,
    banheiros: l.banheiros,
    vagas: l.vagas,
    andar: l.andar ?? "",
    cep: l.cep ?? "",
    endereco: l.endereco ?? "",
    numero: l.numero ?? "",
    complemento: l.complemento ?? "",
    bairro: l.bairro ?? "",
    cidade: l.cidade ?? "",
    estado: (l.estado ?? "").trim(),
    descricao: l.descricao ?? "",
    destaque: l.destaque,
    visivel: l.visivel,
  };
}

// Campos vazios viram null no banco.
export function paraLinha(i: Imovel) {
  const texto = (v: string) => v.trim() || null;
  return {
    corretor_id: i.corretorId,
    empreendimento_id: i.empreendimentoId || null,
    titulo: i.titulo.trim(),
    tipo: i.tipo,
    finalidade: i.finalidade,
    status: i.status,
    preco: i.preco,
    area: i.area,
    quartos: i.quartos,
    suites: i.suites,
    banheiros: i.banheiros,
    vagas: i.vagas,
    andar: texto(i.andar),
    cep: texto(i.cep),
    endereco: texto(i.endereco),
    numero: texto(i.numero),
    complemento: texto(i.complemento),
    bairro: texto(i.bairro),
    cidade: texto(i.cidade),
    estado: texto(i.estado),
    descricao: texto(i.descricao),
    destaque: i.destaque,
    visivel: i.visivel,
  };
}

// Linha da lista: "Cuiabá · 98 m² · 3 quartos"
export function resumoImovel(i: Imovel): string {
  return [
    i.cidade,
    i.area ? `${i.area.toLocaleString("pt-BR")} m²` : "",
    i.quartos ? `${i.quartos} ${i.quartos === 1 ? "quarto" : "quartos"}` : "",
  ].filter(Boolean).join(" · ");
}

// Preço digitado só com números: "85000000" → "R$ 850.000,00" (os 2 últimos são centavos).
export function precoDeDigitos(digitos: string): number | null {
  const d = digitos.replace(/\D/g, "").slice(0, 14);
  return d ? Number(d) / 100 : null;
}

export function precoParaCampo(valor: number | null): string {
  if (valor === null) return "";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
}
