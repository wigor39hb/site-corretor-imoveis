"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BUCKET_FOTOS, TAMANHO_MAX_ARQUIVO, comprimirVersoes, enviarArquivo } from "@/lib/helpers/imagem";
import { arquivosDaFoto, urlFoto } from "@/lib/imoveis";
import {
  corStatusEmp, localEmp, metragemEmp, statusEmpLabel,
  type Empreendimento, type FotoEmpreendimento, type StatusEmpreendimento,
} from "@/lib/empreendimentos";
import { salvarEmpreendimento } from "@/app/admin/(painel)/empreendimentos/acoes";
import ImportarPdf, { type FotoImportada } from "@/components/admin/ImportarPdf";
import {
  card, cardHeader, cardBody, cardTitle, cardSub, fieldGroup, fieldLabel, fieldInput, fieldHint,
  btnPrimary, btnOutline, Obrigatorio, Toggle, useToast,
} from "@/components/admin/ui";

const vazio: Empreendimento = {
  id: "", nome: "", status: "lancamento", construtora: "", bairro: "", cidade: "", estado: "MT",
  tipologias: "", areaMin: null, areaMax: null, registroIncorporacao: "", descricao: "",
  destaque: false, visivel: true, capa: null,
};

// Foto na tela: já salva (id + caminho) ou nova, ainda só no navegador (arquivo).
// Nada vai para o Storage antes de clicar em Salvar.
type FotoNaTela = {
  chave: string; preview: string; legenda: string;
  id?: string; caminho?: string; ordem?: number; legendaSalva?: string; arquivo?: File;
};

const FORMATOS_FOTO = ["image/jpeg", "image/png", "image/webp"];
const VOLTAR = "/admin/empreendimentos";

// Formulário de cadastro/edição de empreendimento (admin e assistente).
export default function EmpreendimentoForm({ inicial, fotosIniciais = [] }: {
  inicial?: Empreendimento;
  fotosIniciais?: FotoEmpreendimento[];
}) {
  const router = useRouter();
  const { toast, mostrar } = useToast();
  const novo = !inicial;
  const [dados, setDados] = useState<Empreendimento>(inicial ?? vazio);
  const [salvando, setSalvando] = useState(false);
  const [progresso, setProgresso] = useState("");
  const [fotos, setFotos] = useState<FotoNaTela[]>(() =>
    fotosIniciais.map((f) => ({
      chave: f.id, id: f.id, caminho: f.caminho, ordem: f.ordem,
      legenda: f.legenda ?? "", legendaSalva: f.legenda ?? "", preview: urlFoto(f.caminho, "p"),
    })),
  );
  const [removidas, setRemovidas] = useState<FotoEmpreendimento[]>([]);
  const [arrastando, setArrastando] = useState<number | null>(null);
  const [importando, setImportando] = useState(false);
  const seletorFotos = useRef<HTMLInputElement>(null);

  const set = <K extends keyof Empreendimento>(campo: K, valor: Empreendimento[K]) =>
    setDados((d) => ({ ...d, [campo]: valor }));
  const decimal = (v: string) => (v ? Math.max(0, Number(v)) : null);
  const resumo = [metragemEmp(dados), dados.tipologias.trim()].filter(Boolean);

  // ---- Fotos ----
  const adicionarFotos = (lista: FileList | null) => {
    if (!lista) return;
    const aceitas: FotoNaTela[] = [];
    const recusadas: string[] = [];
    for (const arquivo of Array.from(lista)) {
      if (!FORMATOS_FOTO.includes(arquivo.type)) recusadas.push(`${arquivo.name} (formato não aceito)`);
      else if (arquivo.size > TAMANHO_MAX_ARQUIVO) recusadas.push(`${arquivo.name} (maior que 15 MB)`);
      else aceitas.push({ chave: crypto.randomUUID(), arquivo, legenda: "", preview: URL.createObjectURL(arquivo) });
    }
    setFotos((f) => [...f, ...aceitas]);
    if (recusadas.length) mostrar(`Não adicionadas: ${recusadas.join(", ")}. Use JPG, PNG ou WebP.`, true);
  };

  // Fotos escolhidas no PDF: a capa entra na frente de todas; as outras, no fim.
  const adicionarDoPdf = (importadas: FotoImportada[]) => {
    const paraTela = (f: FotoImportada): FotoNaTela => ({ chave: crypto.randomUUID(), arquivo: f.arquivo, legenda: f.legenda, preview: f.preview });
    const capa = importadas.filter((f) => f.capa).map(paraTela);
    const outras = importadas.filter((f) => !f.capa).map(paraTela);
    setFotos((f) => [...capa, ...f, ...outras]);
    setImportando(false);
    mostrar(`${importadas.length} ${importadas.length === 1 ? "foto adicionada" : "fotos adicionadas"}. Elas são enviadas ao salvar.`);
  };

  const removerFoto = (indice: number) => {
    const foto = fotos[indice];
    if (foto.id && foto.caminho) setRemovidas((r) => [...r, { id: foto.id!, caminho: foto.caminho!, ordem: foto.ordem ?? 0, legenda: null }]);
    if (foto.arquivo) URL.revokeObjectURL(foto.preview);
    setFotos((f) => f.filter((_, i) => i !== indice));
  };

  const moverFoto = (de: number, para: number) => {
    if (para < 0 || para >= fotos.length || de === para) return;
    setFotos((f) => {
      const nova = [...f];
      const [item] = nova.splice(de, 1);
      nova.splice(para, 0, item);
      return nova;
    });
  };

  const mudarLegenda = (indice: number, legenda: string) =>
    setFotos((f) => f.map((foto, i) => (i === indice ? { ...foto, legenda } : foto)));

  // Aplica as mudanças de fotos depois que o empreendimento está salvo (precisa do id para a pasta).
  // Devolve quantas fotos falharam.
  async function salvarFotos(empreendimentoId: string): Promise<number> {
    const supabase = createClient();
    let falhas = 0;

    if (removidas.length) {
      const { error } = await supabase.from("fotos").delete().in("id", removidas.map((f) => f.id));
      if (error) falhas += removidas.length;
      else await supabase.storage.from(BUCKET_FOTOS).remove(removidas.flatMap((f) => arquivosDaFoto(f.caminho)));
    }

    const total = fotos.filter((f) => f.arquivo).length;
    let enviadas = 0;
    for (let ordem = 0; ordem < fotos.length; ordem++) {
      const foto = fotos[ordem];
      const legenda = foto.legenda.trim() || null;
      if (foto.id) {
        if (foto.ordem !== ordem || (foto.legendaSalva || null) !== legenda) {
          await supabase.from("fotos").update({ ordem, legenda }).eq("id", foto.id);
        }
        continue;
      }
      enviadas++;
      setProgresso(`Enviando foto ${enviadas} de ${total}...`);
      const fotoId = crypto.randomUUID();
      const caminho = `empreendimentos/${empreendimentoId}/${fotoId}`;
      try {
        const { versoes, largura, altura } = await comprimirVersoes(foto.arquivo!);
        for (const [versao, blob] of Object.entries(versoes)) await enviarArquivo(`${caminho}/${versao}.webp`, blob);
        const tamanho = Object.values(versoes).reduce((soma, b) => soma + b.size, 0);
        const { error } = await supabase.from("fotos").insert({
          id: fotoId, empreendimento_id: empreendimentoId, caminho, ordem, legenda, largura, altura, tamanho_bytes: tamanho,
        });
        if (error) throw error;
      } catch {
        falhas++;
        await supabase.storage.from(BUCKET_FOTOS).remove(arquivosDaFoto(caminho));
      }
    }
    return falhas;
  }

  const handleSalvar = async () => {
    setSalvando(true);
    const { erro, id } = await salvarEmpreendimento(dados);
    if (erro || !id) {
      setSalvando(false);
      mostrar(erro ?? "Não foi possível salvar.", true);
      return;
    }
    const falhas = await salvarFotos(id);
    setProgresso("");
    if (falhas) {
      // O empreendimento ficou salvo; recarrega a edição para mostrar as fotos que entraram e tentar de novo.
      mostrar(`Empreendimento salvo, mas ${falhas === 1 ? "1 foto não foi enviada" : `${falhas} fotos não foram enviadas`}. Tente de novo.`, true);
      setTimeout(() => window.location.assign(`/admin/empreendimentos/${id}/editar`), 2500);
      return;
    }
    setSalvando(false);
    mostrar(novo ? (dados.visivel ? "Empreendimento publicado!" : "Empreendimento salvo (fora do site).") : "Alterações salvas!");
    router.refresh();
    setTimeout(() => router.push(VOLTAR), 1500);
  };

  const grid = (colunas: string, mb = "16px"): React.CSSProperties => ({ display: "grid", gridTemplateColumns: colunas, gap: "16px", marginBottom: mb });
  const setaFoto: React.CSSProperties = { width: "26px", height: "26px", borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "16px", lineHeight: "24px", cursor: "pointer", padding: 0 };

  return (
    <>
      {toast}
      {importando && <ImportarPdf onAdicionar={adicionarDoPdf} onFechar={() => setImportando(false)} />}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px", alignItems: "start", maxWidth: "1200px" }} className="admin-form-grid">

        {/* COLUNA PRINCIPAL */}
        <div>
          {/* INFORMAÇÕES BÁSICAS */}
          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Informações básicas</div>
              <div style={cardSub}>Dados principais do empreendimento</div>
            </div>
            <div style={cardBody}>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Nome do empreendimento <Obrigatorio /></label>
                <input type="text" style={fieldInput} value={dados.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Ex: Liv Goiabeiras" />
              </div>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Construtora</label>
                <input type="text" style={fieldInput} value={dados.construtora} onChange={(e) => set("construtora", e.target.value)} placeholder="Ex: Vitta · Grupo Bild" />
              </div>
              <div>
                <label style={fieldLabel}>Texto de apresentação</label>
                <textarea style={{ ...fieldInput, resize: "vertical", minHeight: "100px", lineHeight: "1.6" }} value={dados.descricao} onChange={(e) => set("descricao", e.target.value)} placeholder="Opcional. Um texto curto sobre o empreendimento." />
                <div style={fieldHint}>Não coloque plantas, preços nem condições de pagamento: o cliente deve chamar a imobiliária para saber.</div>
              </div>
            </div>
          </div>

          {/* LOCALIZAÇÃO */}
          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Localização</div>
              <div style={cardSub}>Aparece no topo da página, abaixo do nome</div>
            </div>
            <div style={cardBody}>
              <div style={grid("1fr 1fr 100px", "0")}>
                <div>
                  <label style={fieldLabel}>Bairro</label>
                  <input type="text" style={fieldInput} value={dados.bairro} onChange={(e) => set("bairro", e.target.value)} placeholder="Ex: Goiabeiras" />
                </div>
                <div>
                  <label style={fieldLabel}>Cidade</label>
                  <input type="text" style={fieldInput} value={dados.cidade} onChange={(e) => set("cidade", e.target.value)} placeholder="Ex: Cuiabá" />
                </div>
                <div>
                  <label style={fieldLabel}>Estado</label>
                  <input type="text" maxLength={2} style={{ ...fieldInput, textTransform: "uppercase" }} value={dados.estado} onChange={(e) => set("estado", e.target.value.replace(/[^a-zA-Z]/g, ""))} />
                </div>
              </div>
              {localEmp(dados) && <div style={{ ...fieldHint, marginTop: "14px" }}>Como vai aparecer: <strong>📍 {localEmp(dados)}</strong></div>}
            </div>
          </div>

          {/* RESUMO */}
          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Resumo dos apartamentos</div>
              <div style={cardSub}>Números rápidos que aparecem no topo da página. Todos opcionais.</div>
            </div>
            <div style={cardBody}>
              <div style={grid("1fr 1fr")}>
                <div>
                  <label style={fieldLabel}>Área mínima (m²)</label>
                  <input type="number" min={0} step="0.01" style={fieldInput} value={dados.areaMin ?? ""} onChange={(e) => set("areaMin", decimal(e.target.value))} placeholder="Ex: 48" />
                </div>
                <div>
                  <label style={fieldLabel}>Área máxima (m²)</label>
                  <input type="number" min={0} step="0.01" style={fieldInput} value={dados.areaMax ?? ""} onChange={(e) => set("areaMax", decimal(e.target.value))} placeholder="Deixe vazio se for uma só" />
                </div>
              </div>
              <div>
                <label style={fieldLabel}>Quartos</label>
                <input type="text" style={fieldInput} value={dados.tipologias} onChange={(e) => set("tipologias", e.target.value)} placeholder="Ex: 2 quartos · 1 suíte" />
              </div>
              {resumo.length > 0 && <div style={{ ...fieldHint, marginTop: "14px" }}>Como vai aparecer: <strong>{resumo.join(" · ")}</strong></div>}
            </div>
          </div>

          {/* FOTOS */}
          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Fotos</div>
              <div style={cardSub}>A 1ª foto é a capa (topo da página). As outras formam a galeria de lazer, com a legenda embaixo.</div>
            </div>
            <div style={cardBody}>
              {fotos.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "14px", marginBottom: "16px" }}>
                  {fotos.map((foto, i) => (
                    <div key={foto.chave}>
                      <div draggable
                        onDragStart={() => setArrastando(i)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => { if (arrastando !== null) moverFoto(arrastando, i); setArrastando(null); }}
                        onDragEnd={() => setArrastando(null)}
                        style={{ position: "relative", borderRadius: "10px", overflow: "hidden", aspectRatio: "4 / 3", background: "var(--neutral-100, #f1f1f1)", border: i === 0 ? "2px solid var(--gold-500)" : "1px solid var(--neutral-200)", opacity: arrastando === i ? 0.4 : 1, cursor: "grab" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={foto.preview} alt={foto.legenda || `Foto ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
                        {i === 0 && (
                          <span style={{ position: "absolute", top: "6px", left: "6px", background: "var(--gold-500)", color: "#fff", fontSize: "11px", fontWeight: 600, padding: "3px 8px", borderRadius: "999px", fontFamily: "var(--font-sans)" }}>Capa</span>
                        )}
                        {!foto.id && (
                          <span style={{ position: "absolute", top: i === 0 ? "30px" : "6px", left: "6px", background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "11px", padding: "3px 8px", borderRadius: "999px", fontFamily: "var(--font-sans)" }}>Nova</span>
                        )}
                        <button type="button" onClick={() => removerFoto(i)} aria-label={`Remover foto ${i + 1}`} title="Remover"
                          style={{ ...setaFoto, position: "absolute", top: "6px", right: "6px" }}>×</button>
                        <div style={{ position: "absolute", bottom: "6px", right: "6px", display: "flex", gap: "4px" }}>
                          {[{ seta: "‹", para: i - 1, titulo: "Mover para trás" }, { seta: "›", para: i + 1, titulo: "Mover para frente" }].map((b) => (
                            <button key={b.seta} type="button" onClick={() => moverFoto(i, b.para)} disabled={b.para < 0 || b.para >= fotos.length} title={b.titulo} aria-label={b.titulo}
                              style={{ ...setaFoto, opacity: b.para < 0 || b.para >= fotos.length ? 0.3 : 1 }}>{b.seta}</button>
                          ))}
                        </div>
                      </div>
                      <input type="text" value={foto.legenda} onChange={(e) => mudarLegenda(i, e.target.value)}
                        placeholder={i === 0 ? "Legenda (opcional)" : "Legenda, ex.: Piscina"}
                        style={{ ...fieldInput, marginTop: "6px", padding: "8px 10px", fontSize: "13px" }} />
                    </div>
                  ))}
                </div>
              )}
              <input ref={seletorFotos} type="file" accept={FORMATOS_FOTO.join(",")} multiple hidden
                onChange={(e) => { adicionarFotos(e.target.files); e.target.value = ""; }} />
              <div style={grid("1fr 1fr", "0")} className="admin-fotos-botoes">
                <button type="button" onClick={() => setImportando(true)}
                  style={{ border: "2px dashed var(--gold-500)", borderRadius: "12px", padding: "24px", textAlign: "center", background: "rgba(201,169,110,0.06)", cursor: "pointer" }}>
                  <div style={{ fontSize: "26px", marginBottom: "6px" }}>📄</div>
                  <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--neutral-900)", fontFamily: "var(--font-sans)", marginBottom: "4px" }}>Importar do PDF</div>
                  <div style={{ fontSize: "12px", color: "var(--neutral-400)", fontFamily: "var(--font-sans)" }}>Tira as fotos da apresentação da construtora</div>
                </button>
                <button type="button" onClick={() => seletorFotos.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); adicionarFotos(e.dataTransfer.files); }}
                  style={{ border: "2px dashed var(--neutral-200)", borderRadius: "12px", padding: "24px", textAlign: "center", background: "none", cursor: "pointer" }}>
                  <div style={{ fontSize: "26px", marginBottom: "6px" }}>📸</div>
                  <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--neutral-900)", fontFamily: "var(--font-sans)", marginBottom: "4px" }}>Adicionar fotos</div>
                  <div style={{ fontSize: "12px", color: "var(--neutral-400)", fontFamily: "var(--font-sans)" }}>JPG, PNG ou WebP, até 15 MB cada</div>
                </button>
              </div>
              <div style={fieldHint}>Arraste as fotos (ou use ‹ ›) para mudar a ordem. As fotos só são enviadas ao clicar em {novo ? "Publicar empreendimento" : "Salvar alterações"}.</div>
            </div>
          </div>
        </div>

        {/* COLUNA LATERAL */}
        <div>
          {/* SITUAÇÃO */}
          <div style={{ ...card, marginBottom: "16px" }}>
            <div style={{ ...cardHeader, padding: "16px 20px" }}><div style={cardTitle}>Situação</div></div>
            <div style={{ padding: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                {(Object.keys(statusEmpLabel) as StatusEmpreendimento[]).map((st) => {
                  const sel = dados.status === st;
                  return (
                    <button type="button" key={st} onClick={() => set("status", st)} style={{
                      padding: "12px 14px", border: `1px solid ${sel ? corStatusEmp[st] : "var(--neutral-200)"}`,
                      borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px",
                      background: sel ? `${corStatusEmp[st]}18` : "transparent", transition: "all .2s",
                    }}>
                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: corStatusEmp[st], flexShrink: 0 }} />
                      <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--neutral-900)", fontFamily: "var(--font-sans)", textAlign: "left" }}>{statusEmpLabel[st]}</span>
                    </button>
                  );
                })}
              </div>
              <label style={fieldLabel}>Nº do registro de incorporação</label>
              <input type="text" style={fieldInput} value={dados.registroIncorporacao} onChange={(e) => set("registroIncorporacao", e.target.value)} placeholder="Ex: R-1 da matrícula 123.456" />
              <div style={fieldHint}>Aparece no rodapé da página. Enquanto o registro não sair, use a situação “Em breve”.</div>
            </div>
          </div>

          {/* PUBLICAÇÃO */}
          <div style={{ ...card, marginBottom: "16px" }}>
            <div style={{ ...cardHeader, padding: "16px 20px" }}><div style={cardTitle}>Publicação</div></div>
            <div style={{ padding: "20px" }}>
              <Toggle label="Em destaque" sub="Aparece primeiro na lista do site" on={dados.destaque} onChange={(v) => set("destaque", v)} />
              <Toggle label="Visível no site" sub="Desmarque para guardar como rascunho" on={dados.visivel} onChange={(v) => set("visivel", v)} />
            </div>
          </div>

          {/* AÇÕES */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button id="topbar-publicar" onClick={handleSalvar} disabled={salvando} style={{ ...btnPrimary, opacity: salvando ? 0.7 : 1 }}>
              {salvando ? progresso || "Salvando..." : novo ? "Publicar empreendimento" : "Salvar alterações"}
            </button>
            <a href={VOLTAR} style={btnOutline}>Cancelar</a>
          </div>
        </div>
      </div>
    </>
  );
}
