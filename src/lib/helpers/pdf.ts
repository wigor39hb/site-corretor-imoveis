// Separa a apresentação em PDF de um empreendimento em fotos, no navegador.
// De cada página sai a maior imagem que está dentro dela, sem os textos escritos
// por cima (avisos, títulos). O PDF não é enviado para lugar nenhum.
import type { PDFPageProxy } from "pdfjs-dist";

export type FotoDoPdf = {
  pagina: number;
  arquivo: File;
  preview: string;
  legenda: string; // sugerida pelo título do slide (pode vir vazia)
  usar: boolean; // sugestão: vai para o site?
  capa: boolean; // sugestão: é a fachada?
};

const LADO_MAX = 2560; // maior versão das fotos do site
const LADO_MIN = 500; // imagens menores são logos e enfeites

// Textos que não são título: avisos legais e de treinamento.
const AVISO = /material|meramente|registro de incorpora|treinamento|uso (exclusivo|interno)|vedada|legisla|divulgar/i;
// Títulos de seção da apresentação (não são uma foto do lazer).
const SECAO = /^(\d+\s*[/-].*|sum[aá]rio|institucional|produto|comercial|plantas?|condi[cç][oõ]es|documentos?)$/i;
// Páginas que o site não mostra (decisão de 27/10: sem plantas, implantação e condições),
// além da capa e das capas de seção ("Material de treinamento comercial").
const NAO_USAR = /plantas?|implanta|condi[cç][oõ]es|financiamento|documentos|sum[aá]rio|institucional|treinamento comercial/i;

type ImagemPdf = { width: number; height: number; kind?: number; data?: Uint8ClampedArray; bitmap?: ImageBitmap };

function obterImagem(pagina: PDFPageProxy, nome: string): Promise<ImagemPdf | null> {
  const objetos = nome.startsWith("g_") ? pagina.commonObjs : pagina.objs;
  return new Promise((resolve) => objetos.get(nome, (img: ImagemPdf | null) => resolve(img)));
}

// Desenha a imagem num canvas (reduzida para no máximo LADO_MAX), com fundo branco
// onde ela for transparente.
function desenhar(img: ImagemPdf): HTMLCanvasElement | null {
  let origem: CanvasImageSource;
  if (img.bitmap) {
    origem = img.bitmap;
  } else if (img.data && (img.kind === 2 || img.kind === 3)) {
    // kind 2 = RGB (3 bytes por ponto), kind 3 = RGBA (4 bytes por ponto)
    const temp = document.createElement("canvas");
    temp.width = img.width;
    temp.height = img.height;
    const dados = new ImageData(img.width, img.height);
    if (img.kind === 3) dados.data.set(img.data);
    else for (let i = 0, j = 0; j < img.data.length; i += 4, j += 3) {
      dados.data[i] = img.data[j];
      dados.data[i + 1] = img.data[j + 1];
      dados.data[i + 2] = img.data[j + 2];
      dados.data[i + 3] = 255;
    }
    temp.getContext("2d")?.putImageData(dados, 0, 0);
    origem = temp;
  } else {
    return null;
  }
  const escala = Math.min(1, LADO_MAX / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * escala);
  canvas.height = Math.round(img.height * escala);
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(origem, 0, 0, canvas.width, canvas.height);
  return canvas;
}

// Título com letras espaçadas: "S A L Ã O  D E  F E S T A S" → "SALÃO DE FESTAS".
function juntarLetras(linha: string): string {
  const partes = linha.trim().split(/ +/);
  if (partes.length < 3 || !partes.every((p) => p.length === 1)) return linha;
  return linha.trim().split(/ {2,}/).map((palavra) => palavra.replace(/ /g, "")).join(" ");
}

// Texto da página em linhas. Uma linha nova começa no fim de linha do PDF ou
// quando o texto muda de altura (o título fica separado do aviso ao lado dele).
async function linhasDaPagina(pagina: PDFPageProxy): Promise<string[]> {
  const conteudo = await pagina.getTextContent();
  const linhas: string[] = [];
  let linha = "";
  let alturaAnterior: number | null = null;
  for (const item of conteudo.items) {
    if (!("str" in item)) continue;
    const altura = item.transform[5];
    if (alturaAnterior !== null && Math.abs(altura - alturaAnterior) > 2 && linha) {
      linhas.push(linha);
      linha = "";
    }
    alturaAnterior = altura;
    linha += item.str;
    if (item.hasEOL) {
      linhas.push(linha);
      linha = "";
    }
  }
  linhas.push(linha);
  return linhas.map((l) => juntarLetras(l).replace(/\s+/g, " ").trim()).filter(Boolean);
}

// Primeiro texto curto da página que não é aviso nem título de seção. Ex.: "PISCINAS E SOLARIUM".
function tituloDoSlide(linhas: string[]): string {
  return linhas.find((l) => l.length <= 40 && !AVISO.test(l) && !SECAO.test(l)) ?? "";
}

export async function extrairFotosDoPdf(
  arquivo: File,
  aoAvancar: (pagina: number, total: number) => void,
): Promise<FotoDoPdf[]> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
  // isEvalSupported: false fecha uma falha de segurança conhecida do pdf.js com PDFs maliciosos.
  const documento = await pdfjs.getDocument({ data: await arquivo.arrayBuffer(), isEvalSupported: false }).promise;
  const fotos: FotoDoPdf[] = [];
  try {
    for (let n = 1; n <= documento.numPages; n++) {
      aoAvancar(n, documento.numPages);
      // Uma página com problema é pulada; as outras continuam.
      let pagina: PDFPageProxy | null = null;
      try {
        pagina = await documento.getPage(n);
        const operacoes = await pagina.getOperatorList();
        const nomes = new Set<string>();
        operacoes.fnArray.forEach((fn, i) => {
          if (fn === pdfjs.OPS.paintImageXObject) nomes.add(operacoes.argsArray[i][0]);
        });
        let maior: ImagemPdf | null = null;
        for (const nome of Array.from(nomes)) {
          const img = await obterImagem(pagina, nome);
          if (img && (!maior || img.width * img.height > maior.width * maior.height)) maior = img;
        }
        if (!maior || Math.min(maior.width, maior.height) < LADO_MIN) continue;

        const canvas = desenhar(maior);
        if (!canvas) continue;
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
        if (!blob) continue;

        const linhas = await linhasDaPagina(pagina);
        const titulo = tituloDoSlide(linhas);
        const foto = new File([blob], `pagina-${n}.jpg`, { type: "image/jpeg" });
        fotos.push({
          pagina: n,
          arquivo: foto,
          preview: URL.createObjectURL(foto),
          legenda: titulo,
          usar: !!titulo && !NAO_USAR.test(linhas.join(" ")),
          capa: /fachada/i.test(titulo),
        });
      } catch (e) {
        console.error(`PDF: página ${n} não pôde ser lida:`, e);
      } finally {
        pagina?.cleanup();
      }
    }
  } finally {
    await documento.destroy();
  }
  return fotos;
}
