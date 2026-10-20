// Compressão de imagens no navegador, antes do envio ao Storage.
import { createClient } from "@/lib/supabase/client";

export const BUCKET_FOTOS = "fotos";
export const TAMANHO_MAX_ARQUIVO = 15 * 1024 * 1024; // 15 MB, igual ao limite do bucket

// Recorta o centro da imagem num quadrado e reduz para `lado` px, em WebP.
// Usado na foto de perfil (aparece redonda no site e no painel).
export async function comprimirQuadrado(arquivo: File, lado = 600, qualidade = 0.85): Promise<Blob> {
  const bitmap = await createImageBitmap(arquivo);
  const corte = Math.min(bitmap.width, bitmap.height);
  const destino = Math.min(lado, corte);
  const canvas = document.createElement("canvas");
  canvas.width = destino;
  canvas.height = destino;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Navegador sem suporte a canvas");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    bitmap,
    (bitmap.width - corte) / 2, (bitmap.height - corte) / 2, corte, corte,
    0, 0, destino, destino,
  );
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Falha ao comprimir"))), "image/webp", qualidade),
  );
}

// Caminho do arquivo dentro do bucket, a partir do endereço público.
export function caminhoDoArquivo(url: string): string | null {
  const marcador = `/object/public/${BUCKET_FOTOS}/`;
  const i = url.indexOf(marcador);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marcador.length));
}

export async function apagarArquivo(url: string | null) {
  if (!url) return;
  const caminho = caminhoDoArquivo(url);
  if (!caminho) return;
  await createClient().storage.from(BUCKET_FOTOS).remove([caminho]);
}

function carregarCanvas(largura: number, altura: number) {
  const canvas = document.createElement("canvas");
  canvas.width = largura;
  canvas.height = altura;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Navegador sem suporte a canvas");
  ctx.imageSmoothingQuality = "high";
  return { canvas, ctx };
}

function paraBlob(canvas: HTMLCanvasElement, formato: string, qualidade?: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Falha ao comprimir"))), formato, qualidade),
  );
}

// Área da imagem sem as bordas transparentes (logos costumam vir com muita margem vazia).
function areaVisivel(bitmap: ImageBitmap) {
  const { ctx } = carregarCanvas(bitmap.width, bitmap.height);
  ctx.drawImage(bitmap, 0, 0);
  const { data, width, height } = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
  let x0 = width, y0 = height, x1 = -1, y1 = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 8) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) return { x: 0, y: 0, largura: width, altura: height }; // imagem toda transparente
  return { x: x0, y: y0, largura: x1 - x0 + 1, altura: y1 - y0 + 1 };
}

// Reduz a imagem para no máximo `ladoMaior` px (sem cortar), em WebP.
// Mantém fundo transparente; com `cortarBordas`, tira a margem transparente (logo).
export async function comprimir(arquivo: File, ladoMaior = 2560, qualidade = 0.85, cortarBordas = false): Promise<Blob> {
  const bitmap = await createImageBitmap(arquivo);
  const area = cortarBordas ? areaVisivel(bitmap) : { x: 0, y: 0, largura: bitmap.width, altura: bitmap.height };
  const escala = Math.min(1, ladoMaior / Math.max(area.largura, area.altura));
  const largura = Math.round(area.largura * escala);
  const altura = Math.round(area.altura * escala);
  const { canvas, ctx } = carregarCanvas(largura, altura);
  ctx.drawImage(bitmap, area.x, area.y, area.largura, area.altura, 0, 0, largura, altura);
  bitmap.close();
  return paraBlob(canvas, "image/webp", qualidade);
}

// Ícone do site: quadrado de `lado` px em PNG; a imagem é encaixada inteira,
// centralizada, com fundo transparente onde sobrar.
export async function iconeQuadrado(arquivo: File, lado = 512): Promise<Blob> {
  const bitmap = await createImageBitmap(arquivo);
  const escala = Math.min(lado / bitmap.width, lado / bitmap.height);
  const largura = bitmap.width * escala;
  const altura = bitmap.height * escala;
  const { canvas, ctx } = carregarCanvas(lado, lado);
  ctx.drawImage(bitmap, (lado - largura) / 2, (lado - altura) / 2, largura, altura);
  bitmap.close();
  return paraBlob(canvas, "image/png");
}

// Fotos de imóveis e empreendimentos: 3 versões em WebP, pelo lado maior.
// O navegador escolhe a versão certa para cada tela. Mude aqui para ajustar tamanho e qualidade.
export const VERSOES_FOTO = { p: 800, m: 1600, g: 2560 } as const;
export const QUALIDADE_FOTO = 0.85;
export type VersaoFoto = keyof typeof VERSOES_FOTO;

// Gera as 3 versões a partir de um único arquivo (sem aumentar fotos menores que a versão).
export async function comprimirVersoes(arquivo: File) {
  const bitmap = await createImageBitmap(arquivo);
  try {
    const versoes = {} as Record<VersaoFoto, Blob>;
    let largura = 0, altura = 0;
    for (const [versao, lado] of Object.entries(VERSOES_FOTO) as [VersaoFoto, number][]) {
      const escala = Math.min(1, lado / Math.max(bitmap.width, bitmap.height));
      const { canvas, ctx } = carregarCanvas(Math.round(bitmap.width * escala), Math.round(bitmap.height * escala));
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      versoes[versao] = await paraBlob(canvas, "image/webp", QUALIDADE_FOTO);
      largura = canvas.width;
      altura = canvas.height;
    }
    return { versoes, largura, altura }; // largura/altura da maior versão
  } finally {
    bitmap.close();
  }
}

// Envia o arquivo ao Storage e devolve o endereço público.
export async function enviarArquivo(caminho: string, arquivo: Blob): Promise<string> {
  const supabase = createClient();
  const { error } = await supabase.storage
    .from(BUCKET_FOTOS)
    .upload(caminho, arquivo, { contentType: arquivo.type, cacheControl: "31536000" });
  if (error) throw error;
  return supabase.storage.from(BUCKET_FOTOS).getPublicUrl(caminho).data.publicUrl;
}
