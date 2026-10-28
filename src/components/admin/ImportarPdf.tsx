"use client";

import { useEffect, useRef, useState } from "react";
import { extrairFotosDoPdf, type FotoDoPdf } from "@/lib/helpers/pdf";
import { legendaDeTitulo } from "@/lib/empreendimentos";
import { btnOutline, btnPrimary, fieldHint, fieldInput } from "@/components/admin/ui";

export type FotoImportada = { arquivo: File; preview: string; legenda: string; capa: boolean };

// Janela "Importar do PDF": lê a apresentação do empreendimento, mostra a foto de cada
// página e deixa escolher quais vão para o site, com a legenda. A foto marcada como
// capa vai para o topo da página.
export default function ImportarPdf({ onAdicionar, onFechar }: {
  onAdicionar: (fotos: FotoImportada[]) => void;
  onFechar: () => void;
}) {
  const [fase, setFase] = useState<"escolher" | "lendo" | "revisar">("escolher");
  const [progresso, setProgresso] = useState("");
  const [erro, setErro] = useState("");
  const [itens, setItens] = useState<FotoDoPdf[]>([]);
  const seletor = useRef<HTMLInputElement>(null);
  const usadas = useRef(new Set<string>());

  // Ao fechar, libera as fotos que não foram adicionadas.
  const itensRef = useRef(itens);
  itensRef.current = itens;
  useEffect(() => () => {
    for (const f of itensRef.current) if (!usadas.current.has(f.preview)) URL.revokeObjectURL(f.preview);
  }, []);

  const ler = async (arquivo: File | undefined) => {
    if (!arquivo) return;
    // Alguns Windows não informam o tipo do arquivo: aceita também pelo nome.
    if (arquivo.type !== "application/pdf" && !arquivo.name.toLowerCase().endsWith(".pdf")) {
      setErro("Escolha um arquivo PDF.");
      return;
    }
    setErro("");
    setFase("lendo");
    try {
      const fotos = await extrairFotosDoPdf(arquivo, (n, total) => setProgresso(`Lendo página ${n} de ${total}...`));
      // Só uma capa: a primeira página sugerida como fachada.
      let temCapa = false;
      setItens(fotos.map((f) => {
        const capa = f.capa && !temCapa;
        if (capa) temCapa = true;
        return { ...f, capa, usar: f.usar || capa, legenda: f.legenda ? legendaDeTitulo(f.legenda) : "" };
      }));
      setFase(fotos.length ? "revisar" : "escolher");
      if (!fotos.length) setErro("Não encontrei fotos neste PDF.");
    } catch (e) {
      console.error("Erro ao ler o PDF:", e);
      const motivo = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
      setFase("escolher");
      // Página do painel aberta antes de o site ser atualizado: o navegador não acha o leitor de PDF.
      if (/chunk|dynamically imported|loading.*failed|worker/i.test(motivo)) {
        setErro(`Não foi possível carregar o leitor de PDF. Recarregue a página (Ctrl + F5) e tente de novo. (${motivo})`);
      } else if (/password/i.test(motivo)) {
        setErro("Este PDF é protegido por senha. Peça à construtora uma versão sem senha.");
      } else {
        setErro(`Não foi possível ler este PDF. (${motivo})`);
      }
    }
  };

  const mudar = (i: number, campos: Partial<FotoDoPdf>) =>
    setItens((lista) => lista.map((f, j) => (j === i ? { ...f, ...campos } : f)));
  const marcarCapa = (i: number) =>
    setItens((lista) => lista.map((f, j) => ({ ...f, capa: j === i, usar: j === i ? true : f.usar })));
  const marcarTodas = (usar: boolean) => setItens((lista) => lista.map((f) => ({ ...f, usar: usar || f.capa })));

  const escolhidas = itens.filter((f) => f.usar);
  const adicionar = () => {
    // A capa vai primeiro; as outras seguem a ordem do PDF.
    const ordenadas = [...escolhidas.filter((f) => f.capa), ...escolhidas.filter((f) => !f.capa)];
    for (const f of ordenadas) usadas.current.add(f.preview);
    onAdicionar(ordenadas.map((f) => ({ arquivo: f.arquivo, preview: f.preview, legenda: f.legenda.trim(), capa: f.capa })));
  };

  const texto = (tamanho: string, cor = "var(--neutral-900)", peso = 400): React.CSSProperties =>
    ({ fontSize: tamanho, color: cor, fontWeight: peso, fontFamily: "var(--font-sans)" });

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(13,27,42,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ background: "#fff", borderRadius: "14px", width: "100%", maxWidth: "1100px", maxHeight: "92vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* TOPO */}
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--neutral-100)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
          <div>
            <div style={texto("16px", undefined, 600)}>Importar fotos do PDF</div>
            <div style={texto("13px", "var(--neutral-400)")}>
              {fase === "revisar"
                ? `${itens.length} fotos encontradas. Marque as que vão para o site e confira as legendas.`
                : "Escolha a apresentação do empreendimento. O PDF não é enviado: só as fotos que você escolher."}
            </div>
          </div>
          <button type="button" onClick={onFechar} aria-label="Fechar" style={{ border: "none", background: "none", fontSize: "26px", cursor: "pointer", color: "var(--neutral-400)", lineHeight: 1 }}>×</button>
        </div>

        {/* CONTEÚDO */}
        <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
          {fase === "escolher" && (
            <>
              <input ref={seletor} type="file" accept="application/pdf" hidden onChange={(e) => { ler(e.target.files?.[0]); e.target.value = ""; }} />
              <button type="button" onClick={() => seletor.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); ler(e.dataTransfer.files[0]); }}
                style={{ width: "100%", border: "2px dashed var(--neutral-200)", borderRadius: "12px", padding: "48px 24px", textAlign: "center", background: "none", cursor: "pointer" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>📄</div>
                <div style={{ ...texto("14px", undefined, 500), marginBottom: "4px" }}>Clique para escolher o PDF (ou arraste para cá)</div>
                <div style={texto("13px", "var(--neutral-400)")}>PDFs grandes podem levar um minuto para ler.</div>
              </button>
              {erro && <div style={{ ...texto("13px", "#C0392B"), marginTop: "12px" }}>{erro}</div>}
            </>
          )}

          {fase === "lendo" && (
            <div style={{ padding: "60px 0", textAlign: "center", ...texto("14px", "var(--neutral-600)") }}>⏳ {progresso || "Abrindo o PDF..."}</div>
          )}

          {fase === "revisar" && (
            <>
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                <button type="button" onClick={() => marcarTodas(true)} style={{ ...btnOutline, padding: "7px 12px" }}>Marcar todas</button>
                <button type="button" onClick={() => marcarTodas(false)} style={{ ...btnOutline, padding: "7px 12px" }}>Desmarcar todas</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "14px" }}>
                {itens.map((f, i) => (
                  <div key={f.preview} style={{ border: `2px solid ${f.capa ? "var(--gold-500)" : f.usar ? "#2D5986" : "var(--neutral-200)"}`, borderRadius: "10px", overflow: "hidden", opacity: f.usar ? 1 : 0.55 }}>
                    <div style={{ position: "relative", aspectRatio: "16 / 10", background: "var(--neutral-100)", cursor: "pointer" }} onClick={() => mudar(i, { usar: !f.usar || f.capa })}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.preview} alt={`Página ${f.pagina}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <span style={{ position: "absolute", top: "6px", left: "6px", background: "rgba(0,0,0,0.65)", color: "#fff", fontSize: "11px", padding: "2px 8px", borderRadius: "10px", fontFamily: "var(--font-sans)" }}>Página {f.pagina}</span>
                      {f.capa && <span style={{ position: "absolute", top: "6px", right: "6px", background: "var(--gold-500)", color: "#fff", fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "10px", fontFamily: "var(--font-sans)" }}>Capa</span>}
                    </div>
                    <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", ...texto("13px", undefined, 500) }}>
                        <input type="checkbox" checked={f.usar} disabled={f.capa} onChange={(e) => mudar(i, { usar: e.target.checked })} />
                        Usar no site
                      </label>
                      {f.usar && (
                        <>
                          <input type="text" style={{ ...fieldInput, padding: "8px 10px", fontSize: "13px" }} value={f.legenda} placeholder={f.capa ? "Legenda (opcional)" : "Legenda, ex.: Piscina"} onChange={(e) => mudar(i, { legenda: e.target.value })} />
                          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", ...texto("12px", "var(--neutral-600)") }}>
                            <input type="radio" name="capa-pdf" checked={f.capa} onChange={() => marcarCapa(i)} />
                            Usar como capa (topo da página)
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ ...fieldHint, marginTop: "14px" }}>As sugestões vêm do título escrito em cada slide. Plantas, implantação e condições já vêm desmarcadas.</div>
            </>
          )}
        </div>

        {/* RODAPÉ */}
        {fase === "revisar" && (
          <div style={{ padding: "14px 24px", borderTop: "1px solid var(--neutral-100)", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button type="button" onClick={onFechar} style={{ ...btnOutline, padding: "11px 18px" }}>Cancelar</button>
            <button type="button" onClick={adicionar} disabled={!escolhidas.length} style={{ ...btnPrimary, padding: "11px 18px", opacity: escolhidas.length ? 1 : 0.5 }}>
              Adicionar {escolhidas.length} {escolhidas.length === 1 ? "foto" : "fotos"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
