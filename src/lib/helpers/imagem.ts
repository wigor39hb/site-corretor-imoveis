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
