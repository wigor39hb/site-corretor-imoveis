// Configurações gerais do site (tabela configuracoes_site, sempre a linha id = 1).
// Editadas pelo admin em Configurações do site; lidas pelo site e pelo painel.
import type { SupabaseClient } from "@supabase/supabase-js";

export interface Numero {
  valor: string;
  rotulo: string;
}

export interface Depoimento {
  nome: string;
  texto: string;
}

export interface ItemSobre {
  titulo: string;
  descricao: string;
}

export interface ConfigSite {
  nome: string;
  nomeCurto: string;
  creci: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  whatsapp: string;
  email: string;
  endereco: string;
  horario: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
  heroFrase: string;
  heroTitulo: string;
  heroTexto: string;
  carrossel: string[];
  sobreFotoUrl: string | null;
  homeSobreTitulo: string;
  homeSobreTexto: string;
  homeSobreItens: ItemSobre[];
  sobreTexto: string;
  numeros: Numero[];
  depoimentos: Depoimento[];
}

// Linha como vem do banco.
export interface ConfigSiteLinha {
  nome: string;
  nome_curto: string | null;
  creci: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  whatsapp: string | null;
  email: string | null;
  endereco: string | null;
  horario: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  youtube: string | null;
  tiktok?: string | null; // existe depois de rodar supabase/003_tiktok.sql
  hero_frase: string | null;
  hero_titulo: string | null;
  hero_texto: string | null;
  carrossel: string[] | null;
  sobre_foto_url: string | null;
  home_sobre_titulo: string | null;
  home_sobre_texto: string | null;
  home_sobre_itens: ItemSobre[] | null;
  sobre_texto: string | null;
  numeros: Numero[] | null;
  depoimentos: Depoimento[] | null;
}

// Usado se o banco não responder, para o site nunca ficar quebrado.
const PADRAO: ConfigSite = {
  nome: "KL Investimentos Imobiliários",
  nomeCurto: "KL Investimentos",
  creci: "",
  logoUrl: null,
  faviconUrl: null,
  whatsapp: "",
  email: "",
  endereco: "",
  horario: "",
  instagram: "",
  facebook: "",
  linkedin: "",
  youtube: "",
  tiktok: "",
  heroFrase: "",
  heroTitulo: "",
  heroTexto: "",
  carrossel: [],
  sobreFotoUrl: null,
  homeSobreTitulo: "",
  homeSobreTexto: "",
  homeSobreItens: [],
  sobreTexto: "",
  numeros: [],
  depoimentos: [],
};

export function deLinha(l: ConfigSiteLinha): ConfigSite {
  return {
    nome: l.nome,
    nomeCurto: l.nome_curto || l.nome,
    creci: l.creci ?? "",
    logoUrl: l.logo_url,
    faviconUrl: l.favicon_url,
    whatsapp: l.whatsapp ?? "",
    email: l.email ?? "",
    endereco: l.endereco ?? "",
    horario: l.horario ?? "",
    instagram: l.instagram ?? "",
    facebook: l.facebook ?? "",
    linkedin: l.linkedin ?? "",
    youtube: l.youtube ?? "",
    tiktok: l.tiktok ?? "",
    heroFrase: l.hero_frase ?? "",
    heroTitulo: l.hero_titulo ?? "",
    heroTexto: l.hero_texto ?? "",
    carrossel: l.carrossel ?? [],
    sobreFotoUrl: l.sobre_foto_url,
    homeSobreTitulo: l.home_sobre_titulo ?? "",
    homeSobreTexto: l.home_sobre_texto ?? "",
    homeSobreItens: l.home_sobre_itens ?? [],
    sobreTexto: l.sobre_texto ?? "",
    numeros: l.numeros ?? [],
    depoimentos: l.depoimentos ?? [],
  };
}

export async function lerConfiguracoes(supabase: SupabaseClient): Promise<ConfigSite> {
  const { data } = await supabase.from("configuracoes_site").select("*").eq("id", 1).single();
  return data ? deLinha(data as ConfigSiteLinha) : PADRAO;
}

// Separa o texto em partes normais e partes *destacadas* (itálico dourado no site).
export function partesDestaque(texto: string): { texto: string; destaque: boolean }[] {
  return texto
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((p) => (p.startsWith("*") && p.endsWith("*") && p.length > 2
      ? { texto: p.slice(1, -1), destaque: true }
      : { texto: p, destaque: false }));
}

// Endereço completo de uma rede social a partir do que o admin digitou
// ("@kl.imoveis", "kl.imoveis" ou o link inteiro).
export type Rede = "instagram" | "facebook" | "linkedin" | "youtube" | "tiktok";

export const REDES: { rede: Rede; nome: string }[] = [
  { rede: "instagram", nome: "Instagram" },
  { rede: "facebook", nome: "Facebook" },
  { rede: "linkedin", nome: "LinkedIn" },
  { rede: "youtube", nome: "YouTube" },
  { rede: "tiktok", nome: "TikTok" },
];

// Redes preenchidas nas Configurações, já com o endereço completo.
export function redesDoSite(config: ConfigSite) {
  return REDES.map((r) => ({ ...r, usuario: config[r.rede], href: linkRede(r.rede, config[r.rede]) }))
    .filter((r): r is typeof r & { href: string } => r.href !== null);
}

export function linkRede(rede: Rede, valor: string): string | null {
  const v = valor.trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  if (/^(www\.)?[a-z0-9-]+\.[a-z]{2,}\//i.test(v)) return `https://${v}`;
  const usuario = v.replace(/^@/, "");
  const base = {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    linkedin: "https://linkedin.com/company/",
    youtube: "https://youtube.com/@",
    tiktok: "https://tiktok.com/@",
  }[rede];
  return base + usuario;
}
