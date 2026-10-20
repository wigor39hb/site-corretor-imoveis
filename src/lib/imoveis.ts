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

// Opções dos Destaques.
export const SITUACOES = ["Pronta para morar", "Em construção", "Na planta"];

// Opções da Ficha do imóvel.
export const PERFIS = ["Residencial", "Comercial", "Residencial e comercial", "Rural"];
export const POSICOES_SOLARES = ["Nascente (sol da manhã)", "Poente (sol da tarde)", "Norte", "Sul"];

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
  caracteristicas: string[]; // lista livre: "Armários planejados", "Gás individual"...
  proximidades: string[]; // lista livre: "Shopping Pantanal", "Escola a 200 m"...
  comodos: string[]; // lista livre: "3 quartos", "Suíte master", "Lavabo"...
  condominio: string[]; // lista livre: "Piscina", "Academia", "Portaria 24h"...
  descricao: string;
  destaque: boolean;
  visivel: boolean;
  // Destaques (informações rápidas do cartão do imóvel)
  garagens: number | null;
  situacao: string;
  dormitorios: number | null;
  suites: number | null;
  // Ficha do imóvel (sim/não = null quando não informado)
  unidadesPorAndar: number | null;
  perfil: string;
  posicaoSolar: string;
  escriturado: boolean | null;
  averbado: boolean | null;
  temFinanciamento: boolean | null;
  aceitaFinanciamento: boolean | null;
  areaTerreno: number | null;
  areaConstruida: number | null;
  areaPrivativa: number | null;
  areaTotal: number | null;
  capa: string | null; // caminho da 1ª foto (só leitura; preenchido na lista do painel)
}

// Foto já salva. No Storage, cada foto é uma pasta com 3 versões: <caminho>/p.webp, m.webp, g.webp.
export interface FotoImovel {
  id: string;
  caminho: string; // imoveis/<id do imóvel>/<id da foto>
  ordem: number;
}

export const arquivosDaFoto = (caminho: string) => ["p", "m", "g"].map((v) => `${caminho}/${v}.webp`);

export function urlFoto(caminho: string, versao: "p" | "m" | "g" = "m") {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/fotos/${caminho}/${versao}.webp`;
}

export const COLUNAS_IMOVEL =
  "id, corretor_id, empreendimento_id, titulo, tipo, finalidade, status, preco, caracteristicas, proximidades, comodos, condominio, descricao, destaque, visivel, garagens, situacao, dormitorios, suites, unidades_por_andar, perfil, posicao_solar, escriturado, averbado, tem_financiamento, aceita_financiamento, area_terreno, area_construida, area_privativa, area_total";

export interface LinhaImovel {
  id: string;
  corretor_id: string;
  empreendimento_id: string | null;
  titulo: string;
  tipo: TipoImovel;
  finalidade: Finalidade;
  status: StatusImovel;
  preco: number | string | null; // o Supabase devolve numeric como texto
  caracteristicas: string[] | null;
  proximidades: string[] | null;
  comodos: string[] | null;
  condominio: string[] | null;
  descricao: string | null;
  destaque: boolean;
  visivel: boolean;
  garagens: number | null;
  situacao: string | null;
  dormitorios: number | null;
  suites: number | null;
  unidades_por_andar: number | null;
  perfil: string | null;
  posicao_solar: string | null;
  escriturado: boolean | null;
  averbado: boolean | null;
  tem_financiamento: boolean | null;
  aceita_financiamento: boolean | null;
  area_terreno: number | string | null;
  area_construida: number | string | null;
  area_privativa: number | string | null;
  area_total: number | string | null;
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
    caracteristicas: l.caracteristicas ?? [],
    proximidades: l.proximidades ?? [],
    comodos: l.comodos ?? [],
    condominio: l.condominio ?? [],
    descricao: l.descricao ?? "",
    destaque: l.destaque,
    visivel: l.visivel,
    garagens: l.garagens,
    situacao: l.situacao ?? "",
    dormitorios: l.dormitorios,
    suites: l.suites,
    unidadesPorAndar: l.unidades_por_andar,
    perfil: l.perfil ?? "",
    posicaoSolar: l.posicao_solar ?? "",
    escriturado: l.escriturado,
    averbado: l.averbado,
    temFinanciamento: l.tem_financiamento,
    aceitaFinanciamento: l.aceita_financiamento,
    areaTerreno: numero(l.area_terreno),
    areaConstruida: numero(l.area_construida),
    areaPrivativa: numero(l.area_privativa),
    areaTotal: numero(l.area_total),
    capa: null,
  };
}

// Campos vazios viram null no banco.
export function paraLinha(i: Imovel) {
  const texto = (v: string) => v.trim() || null;
  const lista = (itens: string[]) => itens.map((c) => c.trim()).filter(Boolean);
  return {
    corretor_id: i.corretorId,
    empreendimento_id: i.empreendimentoId || null,
    titulo: i.titulo.trim(),
    tipo: i.tipo,
    finalidade: i.finalidade,
    status: i.status,
    preco: i.preco,
    caracteristicas: lista(i.caracteristicas),
    proximidades: lista(i.proximidades),
    comodos: lista(i.comodos),
    condominio: lista(i.condominio),
    descricao: texto(i.descricao),
    destaque: i.destaque,
    visivel: i.visivel,
    garagens: i.garagens,
    situacao: texto(i.situacao),
    dormitorios: i.dormitorios,
    suites: i.suites,
    unidades_por_andar: i.unidadesPorAndar,
    perfil: texto(i.perfil),
    posicao_solar: texto(i.posicaoSolar),
    escriturado: i.escriturado,
    averbado: i.averbado,
    tem_financiamento: i.temFinanciamento,
    aceita_financiamento: i.aceitaFinanciamento,
    area_terreno: i.areaTerreno,
    area_construida: i.areaConstruida,
    area_privativa: i.areaPrivativa,
    area_total: i.areaTotal,
  };
}

// Linha da lista: "Apartamento · 98 m²" (área total da Ficha do imóvel)
export function resumoImovel(i: Imovel): string {
  return [
    tipoLabel[i.tipo],
    i.areaTotal ? `${i.areaTotal.toLocaleString("pt-BR")} m²` : "",
  ].filter(Boolean).join(" · ");
}

// Destaques prontos para mostrar: ["2 garagens", "105 m²", "Pronta para morar", "2 dormitórios, 2 suítes"].
export function destaquesImovel(i: Imovel): string[] {
  const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;
  const quartos = [
    i.dormitorios ? plural(i.dormitorios, "dormitório", "dormitórios") : "",
    i.suites ? plural(i.suites, "suíte", "suítes") : "",
  ].filter(Boolean).join(", ");
  return [
    i.garagens ? plural(i.garagens, "garagem", "garagens") : "",
    i.areaPrivativa ? `${i.areaPrivativa.toLocaleString("pt-BR")} m²` : "",
    i.situacao,
    quartos,
  ].filter(Boolean);
}

// ---- Site público ----

// "R$ 850.000" (centavos só quando houver); aluguel ganha "/mês".
export function precoSite(i: Imovel): string {
  if (i.preco === null) return "Consulte";
  const valor = new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL", minimumFractionDigits: i.preco % 1 ? 2 : 0, maximumFractionDigits: 2,
  }).format(i.preco);
  return i.finalidade === "aluguel" ? `${valor}/mês` : valor;
}

export const rotuloPreco: Record<Finalidade, string> = {
  venda: "Valor de venda",
  aluguel: "Aluguel mensal",
  venda_aluguel: "Venda ou aluguel",
};

// Selo no canto da foto. O estilo (cor) é escolhido pela tela.
export function seloImovel(i: Imovel): { texto: string; estilo: "venda" | "aluguel" | "lancamento" } {
  if (i.status === "lancamento") return { texto: "Lançamento", estilo: "lancamento" };
  if (i.status === "reservado") return { texto: "Reservado", estilo: "aluguel" };
  if (i.status === "vendido") return { texto: i.finalidade === "aluguel" ? "Alugado" : "Vendido", estilo: "aluguel" };
  if (i.finalidade === "aluguel") return { texto: "Para alugar", estilo: "aluguel" };
  return { texto: i.finalidade === "venda" ? "À venda" : "Venda e aluguel", estilo: "venda" };
}

const m2 = (n: number) => `${n.toLocaleString("pt-BR")} m²`;

// Números do imóvel para os cartões e a barra da página do imóvel (só os preenchidos).
export function numerosImovel(i: Imovel): { valor: string; rotulo: string }[] {
  const n = (valor: number | null, um: string, varios: string) =>
    valor ? [{ valor: String(valor), rotulo: valor === 1 ? um : varios }] : [];
  return [
    ...n(i.dormitorios, "Dormitório", "Dormitórios"),
    ...n(i.suites, "Suíte", "Suítes"),
    ...n(i.garagens, "Garagem", "Garagens"),
    ...(i.areaPrivativa ? [{ valor: m2(i.areaPrivativa), rotulo: "Área privativa" }] : []),
    ...(i.areaTotal ? [{ valor: m2(i.areaTotal), rotulo: "Área total" }] : []),
  ];
}

// Tabela "Detalhes do imóvel": só as linhas preenchidas.
export function fichaImovel(i: Imovel): [string, string][] {
  const simNao = (v: boolean | null) => (v === null ? "" : v ? "Sim" : "Não");
  const linhas: [string, string][] = [
    ["Tipo", tipoLabel[i.tipo]],
    ["Finalidade", finalidadeLabel[i.finalidade]],
    ["Situação", i.situacao],
    ["Perfil", i.perfil],
    ["Posição solar", i.posicaoSolar],
    ["Unidades por andar", i.unidadesPorAndar === null ? "" : String(i.unidadesPorAndar)],
    ["Terreno", i.areaTerreno ? m2(i.areaTerreno) : ""],
    ["Área construída", i.areaConstruida ? m2(i.areaConstruida) : ""],
    ["Área privativa", i.areaPrivativa ? m2(i.areaPrivativa) : ""],
    ["Área total", i.areaTotal ? m2(i.areaTotal) : ""],
    ["Escriturado", simNao(i.escriturado)],
    ["Averbado", simNao(i.averbado)],
    ["Tem financiamento", simNao(i.temFinanciamento)],
    ["Aceita financiamento", simNao(i.aceitaFinanciamento)],
  ];
  return linhas.filter(([, valor]) => valor);
}

// Fotos responsivas: o navegador escolhe a versão (800, 1600 ou 2560 px) pelo tamanho da tela.
export const srcSetFoto = (caminho: string) =>
  `${urlFoto(caminho, "p")} 800w, ${urlFoto(caminho, "m")} 1600w, ${urlFoto(caminho, "g")} 2560w`;

// Preço digitado só com números: "85000000" → "R$ 850.000,00" (os 2 últimos são centavos).
export function precoDeDigitos(digitos: string): number | null {
  const d = digitos.replace(/\D/g, "").slice(0, 14);
  return d ? Number(d) / 100 : null;
}

export function precoParaCampo(valor: number | null): string {
  if (valor === null) return "";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
}
