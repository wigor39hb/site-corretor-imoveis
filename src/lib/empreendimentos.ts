// Empreendimento como as telas usam, e a conversão de/para a tabela empreendimentos.
// As fotos usam as mesmas funções dos imóveis (urlFoto, srcSetFoto, arquivosDaFoto).

export type StatusEmpreendimento = "breve" | "lancamento" | "obras" | "pronto";

export const statusEmpLabel: Record<StatusEmpreendimento, string> = {
  breve: "Em breve",
  lancamento: "Lançamento",
  obras: "Em obras",
  pronto: "Pronto para morar",
};

export const corStatusEmp: Record<StatusEmpreendimento, string> = {
  breve: "#C9A96E",
  lancamento: "#2D5986",
  obras: "#D4900A",
  pronto: "#3DAA6F",
};

export interface Empreendimento {
  id: string;
  nome: string;
  status: StatusEmpreendimento;
  construtora: string;
  bairro: string;
  cidade: string;
  estado: string;
  tipologias: string; // resumo dos apartamentos: "2 quartos · 1 suíte"
  areaMin: number | null;
  areaMax: number | null;
  registroIncorporacao: string;
  descricao: string;
  destaque: boolean;
  visivel: boolean;
  capa: string | null; // caminho da 1ª foto (só leitura; preenchido nas listas)
}

// Foto já salva. A 1ª (menor ordem) é a capa, no topo da página; as outras formam a galeria.
export interface FotoEmpreendimento {
  id: string;
  caminho: string; // empreendimentos/<id do empreendimento>/<id da foto>
  ordem: number;
  legenda: string | null;
}

export const COLUNAS_EMPREENDIMENTO =
  "id, nome, status, construtora, bairro, cidade, estado, tipologias, area_min, area_max, registro_incorporacao, descricao, destaque, visivel";

export interface LinhaEmpreendimento {
  id: string;
  nome: string;
  status: StatusEmpreendimento;
  construtora: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  tipologias: string | null;
  area_min: number | string | null; // o Supabase devolve numeric como texto
  area_max: number | string | null;
  registro_incorporacao: string | null;
  descricao: string | null;
  destaque: boolean;
  visivel: boolean;
}

const numero = (v: number | string | null) => (v === null || v === "" ? null : Number(v));

export function deEmpreendimento(l: LinhaEmpreendimento): Empreendimento {
  return {
    id: l.id,
    nome: l.nome,
    status: l.status,
    construtora: l.construtora ?? "",
    bairro: l.bairro ?? "",
    cidade: l.cidade ?? "",
    estado: l.estado ?? "",
    tipologias: l.tipologias ?? "",
    areaMin: numero(l.area_min),
    areaMax: numero(l.area_max),
    registroIncorporacao: l.registro_incorporacao ?? "",
    descricao: l.descricao ?? "",
    destaque: l.destaque,
    visivel: l.visivel,
    capa: null,
  };
}

// Campos vazios viram null no banco.
export function paraLinhaEmpreendimento(e: Empreendimento) {
  const texto = (v: string) => v.trim() || null;
  return {
    nome: e.nome.trim(),
    status: e.status,
    construtora: texto(e.construtora),
    bairro: texto(e.bairro),
    cidade: texto(e.cidade),
    estado: texto(e.estado.toUpperCase()),
    tipologias: texto(e.tipologias),
    area_min: e.areaMin,
    area_max: e.areaMax,
    registro_incorporacao: texto(e.registroIncorporacao),
    descricao: texto(e.descricao),
    destaque: e.destaque,
    visivel: e.visivel,
  };
}

// "48 m²" ou "48 a 65 m²" (vazio se não informado).
export function metragemEmp(e: Empreendimento): string {
  const fmt = (n: number) => n.toLocaleString("pt-BR");
  const [min, max] = [e.areaMin, e.areaMax];
  if (min && max && min !== max) return `${fmt(Math.min(min, max))} a ${fmt(Math.max(min, max))} m²`;
  const unica = min || max;
  return unica ? `${fmt(unica)} m²` : "";
}

// "Goiabeiras · Cuiabá-MT"
export function localEmp(e: Empreendimento): string {
  const cidade = [e.cidade, e.estado].filter(Boolean).join("-");
  return [e.bairro, cidade].filter(Boolean).join(" · ");
}

// "PISCINAS E SOLARIUM" → "Piscinas e solarium" (legenda sugerida a partir do título do slide).
export function legendaDeTitulo(titulo: string): string {
  const t = titulo.trim().replace(/\s+/g, " ").toLocaleLowerCase("pt-BR");
  return t.charAt(0).toLocaleUpperCase("pt-BR") + t.slice(1);
}
