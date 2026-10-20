"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessao } from "@/context/SessaoContext";
import { createClient } from "@/lib/supabase/client";
import { BUCKET_FOTOS, TAMANHO_MAX_ARQUIVO, comprimirVersoes, enviarArquivo } from "@/lib/helpers/imagem";
import {
  PERFIS, POSICOES_SOLARES, SITUACOES, arquivosDaFoto, destaquesImovel, finalidadeLabel, precoDeDigitos, precoParaCampo, statusLabel, tipoLabel, urlFoto,
  type Finalidade, type FotoImovel, type Imovel, type Opcao, type StatusImovel, type TipoImovel,
} from "@/lib/imoveis";
import { salvarImovel } from "@/app/admin/(painel)/imoveis/acoes";
import CorretorResponsavelCampo from "@/components/admin/CorretorResponsavelCampo";
import {
  card, cardHeader, cardBody, cardTitle, cardSub, fieldGroup, fieldLabel, fieldInput, fieldHint,
  btnPrimary, btnOutline, Obrigatorio, Toggle, useToast,
} from "@/components/admin/ui";

const corStatus: Record<StatusImovel, string> = {
  disponivel: "#3DAA6F",
  reservado: "#D4900A",
  vendido: "#E05252",
  lancamento: "#2D5986",
};

const vazio: Imovel = {
  id: "", corretorId: "", empreendimentoId: "", titulo: "", tipo: "apartamento", finalidade: "venda",
  status: "disponivel", preco: null, caracteristicas: [], proximidades: [], comodos: [], condominio: [],
  descricao: "", destaque: false, visivel: true,
  garagens: null, situacao: "", dormitorios: null, suites: null,
  unidadesPorAndar: null, perfil: "", posicaoSolar: "", escriturado: null, averbado: null,
  temFinanciamento: null, aceitaFinanciamento: null,
  areaTerreno: null, areaConstruida: null, areaPrivativa: null, areaTotal: null, capa: null,
};

// Foto na tela: já salva (id + caminho) ou nova, ainda só no navegador (arquivo).
// Nada vai para o Storage antes de clicar em Salvar.
type FotoNaTela = { chave: string; preview: string; id?: string; caminho?: string; ordem?: number; arquivo?: File };

const FORMATOS_FOTO = ["image/jpeg", "image/png", "image/webp"];

type CampoSimNao = "escriturado" | "averbado" | "temFinanciamento" | "aceitaFinanciamento";
type CampoArea = "areaTerreno" | "areaConstruida" | "areaPrivativa" | "areaTotal";
type CampoQuantidade = "garagens" | "dormitorios" | "suites";

// Lista livre (Cômodos, Características, Condomínio, Proximidades): o corretor adiciona um item por vez,
// quantos quiser, e remove pelo ×. Ignora repetidos (sem diferenciar maiúsculas).
function ListaLivre({ itens, onChange, botao, placeholder }: {
  itens: string[];
  onChange: (itens: string[]) => void;
  botao: string;
  placeholder: string;
}) {
  const [novo, setNovo] = useState("");

  const adicionar = () => {
    const item = novo.trim();
    if (!item) return;
    if (!itens.some((c) => c.toLowerCase() === item.toLowerCase())) onChange([...itens, item]);
    setNovo("");
  };

  return (
    <>
      {itens.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
          {itens.map((c, i) => (
            <span key={c} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "7px 8px 7px 14px", border: "1px solid var(--neutral-200)", borderRadius: "999px", fontSize: "13px", color: "var(--neutral-900)", fontFamily: "var(--font-sans)" }}>
              {c}
              <button type="button" onClick={() => onChange(itens.filter((_, j) => j !== i))} aria-label={`Remover ${c}`} title="Remover" style={{ border: "none", background: "var(--neutral-100, #f1f1f1)", borderRadius: "50%", width: "20px", height: "20px", lineHeight: "18px", cursor: "pointer", color: "var(--neutral-600)", fontSize: "14px", padding: 0 }}>×</button>
            </span>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: "10px" }}>
        <input type="text" style={{ ...fieldInput, flex: 1 }} value={novo} onChange={(e) => setNovo(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); adicionar(); } }} placeholder={placeholder} />
        <button type="button" onClick={adicionar} style={{ padding: "11px 16px", border: "1px solid var(--neutral-200)", borderRadius: "8px", background: "none", fontSize: "13px", cursor: "pointer", color: "var(--gold-500)", fontWeight: 500, fontFamily: "var(--font-sans)", whiteSpace: "nowrap" }}>
          + {botao}
        </button>
      </div>
      <div style={fieldHint}>Digite e clique em “+ {botao}” (ou aperte Enter). Use o × para remover.</div>
    </>
  );
}

// Formulário de cadastro/edição de imóvel (admin e corretores).
export default function ImovelForm({ inicial, fotosIniciais = [], corretores }: {
  inicial?: Imovel;
  fotosIniciais?: FotoImovel[];
  corretores: Opcao[];
}) {
  const router = useRouter();
  const { usuario } = useSessao();
  const { toast, mostrar } = useToast();
  const novo = !inicial;
  const [dados, setDados] = useState<Imovel>(inicial ?? { ...vazio, corretorId: usuario.id });
  const [salvando, setSalvando] = useState(false);
  const [progresso, setProgresso] = useState("");
  const [fotos, setFotos] = useState<FotoNaTela[]>(() =>
    fotosIniciais.map((f) => ({ chave: f.id, id: f.id, caminho: f.caminho, ordem: f.ordem, preview: urlFoto(f.caminho, "p") })),
  );
  const [removidas, setRemovidas] = useState<FotoImovel[]>([]);
  const [arrastando, setArrastando] = useState<number | null>(null);
  const seletorFotos = useRef<HTMLInputElement>(null);

  // Admin mexendo em imóvel de corretor: aviso no topo e, ao terminar, volta para a aba da equipe.
  const deOutro = dados.corretorId !== usuario.id;
  const nomeDono = corretores.find((c) => c.id === dados.corretorId)?.nome ?? "outro corretor";
  const voltarPara = deOutro ? "/admin/imoveis?aba=equipe" : "/admin/imoveis";

  const set = <K extends keyof Imovel>(campo: K, valor: Imovel[K]) =>
    setDados((d) => ({ ...d, [campo]: valor }));
  const inteiro = (v: string) => Math.max(0, parseInt(v, 10) || 0);
  const decimal = (v: string) => (v ? Math.max(0, Number(v)) : null);

  // Sim / Não / não informado (vazio).
  const simNao = (campo: CampoSimNao, label: string) => (
    <div>
      <label style={fieldLabel}>{label}</label>
      <select style={fieldInput} value={dados[campo] === null ? "" : dados[campo] ? "sim" : "nao"} onChange={(e) => set(campo, e.target.value === "" ? null : e.target.value === "sim")}>
        <option value="">Não informado</option>
        <option value="sim">Sim</option>
        <option value="nao">Não</option>
      </select>
    </div>
  );
  // A Área privativa aparece nos Destaques e na Ficha: é o mesmo campo, mudar num muda no outro.
  const areaM2 = (campo: CampoArea, label: string) => (
    <div>
      <label style={fieldLabel}>{label}</label>
      <input type="number" min={0} step="0.01" style={fieldInput} value={dados[campo] ?? ""} onChange={(e) => set(campo, decimal(e.target.value))} placeholder="m²" />
    </div>
  );
  const quantidade = (campo: CampoQuantidade, label: string) => (
    <div>
      <label style={fieldLabel}>{label}</label>
      <input type="number" min={0} style={fieldInput} value={dados[campo] ?? ""} onChange={(e) => set(campo, e.target.value ? inteiro(e.target.value) : null)} />
    </div>
  );
  const destaques = destaquesImovel(dados);

  // ---- Fotos ----
  const adicionarFotos = (lista: FileList | null) => {
    if (!lista) return;
    const aceitas: FotoNaTela[] = [];
    const recusadas: string[] = [];
    for (const arquivo of Array.from(lista)) {
      if (!FORMATOS_FOTO.includes(arquivo.type)) recusadas.push(`${arquivo.name} (formato não aceito)`);
      else if (arquivo.size > TAMANHO_MAX_ARQUIVO) recusadas.push(`${arquivo.name} (maior que 15 MB)`);
      else aceitas.push({ chave: crypto.randomUUID(), arquivo, preview: URL.createObjectURL(arquivo) });
    }
    setFotos((f) => [...f, ...aceitas]);
    if (recusadas.length) mostrar(`Não adicionadas: ${recusadas.join(", ")}. Use JPG, PNG ou WebP.`, true);
  };

  const removerFoto = (indice: number) => {
    const foto = fotos[indice];
    if (foto.id && foto.caminho) setRemovidas((r) => [...r, { id: foto.id!, caminho: foto.caminho!, ordem: foto.ordem ?? 0 }]);
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

  // Aplica as mudanças de fotos depois que o imóvel está salvo (precisa do id para a pasta).
  // Devolve quantas fotos falharam.
  async function salvarFotos(imovelId: string): Promise<number> {
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
      if (foto.id) {
        if (foto.ordem !== ordem) await supabase.from("fotos").update({ ordem }).eq("id", foto.id);
        continue;
      }
      enviadas++;
      setProgresso(`Enviando foto ${enviadas} de ${total}...`);
      const fotoId = crypto.randomUUID();
      const caminho = `imoveis/${imovelId}/${fotoId}`;
      try {
        const { versoes, largura, altura } = await comprimirVersoes(foto.arquivo!);
        for (const [versao, blob] of Object.entries(versoes)) await enviarArquivo(`${caminho}/${versao}.webp`, blob);
        const tamanho = Object.values(versoes).reduce((soma, b) => soma + b.size, 0);
        const { error } = await supabase.from("fotos").insert({
          id: fotoId, imovel_id: imovelId, caminho, ordem, largura, altura, tamanho_bytes: tamanho,
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
    const { erro, id } = await salvarImovel(dados);
    if (erro || !id) {
      setSalvando(false);
      mostrar(erro ?? "Não foi possível salvar.", true);
      return;
    }
    const falhas = await salvarFotos(id);
    setProgresso("");
    if (falhas) {
      // O imóvel ficou salvo; recarrega a edição para mostrar as fotos que entraram e tentar de novo.
      mostrar(`Imóvel salvo, mas ${falhas === 1 ? "1 foto não foi enviada" : `${falhas} fotos não foram enviadas`}. Tente de novo.`, true);
      setTimeout(() => window.location.assign(`/admin/imoveis/${id}/editar`), 2500);
      return;
    }
    setSalvando(false);
    mostrar(novo ? (dados.visivel ? "Imóvel publicado!" : "Imóvel salvo (fora do site).") : "Alterações salvas!");
    router.refresh();
    setTimeout(() => router.push(voltarPara), 1500);
  };

  const grid = (colunas: string, mb = "16px"): React.CSSProperties => ({ display: "grid", gridTemplateColumns: colunas, gap: "16px", marginBottom: mb });

  return (
    <>
      {toast}
      {deOutro && (
        <div style={{ maxWidth: "1200px", background: "rgba(212,144,10,0.08)", border: "1px solid rgba(212,144,10,0.3)", borderRadius: "10px", padding: "14px 18px", marginBottom: "20px", fontSize: "13px", color: "var(--neutral-600)", fontFamily: "var(--font-sans)", lineHeight: 1.6 }}>
          ⚠️ {novo ? "Este imóvel será cadastrado em nome de " : "Você está editando um imóvel de "}<strong>{nomeDono}</strong>.
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px", alignItems: "start", maxWidth: "1200px" }} className="admin-form-grid">

        {/* COLUNA PRINCIPAL */}
        <div>
          {/* INFORMAÇÕES BÁSICAS */}
          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Informações básicas</div>
              <div style={cardSub}>Dados principais do imóvel</div>
            </div>
            <div style={cardBody}>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Título do anúncio <Obrigatorio /></label>
                <input type="text" style={fieldInput} value={dados.titulo} onChange={(e) => set("titulo", e.target.value)} placeholder="Ex: Apartamento 3 quartos com varanda gourmet" />
                <div style={fieldHint}>Seja descritivo — este título aparece nos cards de imóvel e nas buscas.</div>
              </div>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Descrição completa <Obrigatorio /></label>
                <textarea style={{ ...fieldInput, resize: "vertical", minHeight: "120px", lineHeight: "1.6" }} value={dados.descricao} onChange={(e) => set("descricao", e.target.value)} placeholder="Conte os detalhes: ambientes, acabamento, lazer do condomínio, o que tem por perto..." />
              </div>
              <div style={grid("1fr 1fr", "0")}>
                <div>
                  <label style={fieldLabel}>Tipo <Obrigatorio /></label>
                  <select style={fieldInput} value={dados.tipo} onChange={(e) => set("tipo", e.target.value as TipoImovel)}>
                    {Object.entries(tipoLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label style={fieldLabel}>Finalidade</label>
                  <select style={fieldInput} value={dados.finalidade} onChange={(e) => set("finalidade", e.target.value as Finalidade)}>
                    {Object.entries(finalidadeLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* DESTAQUES */}
          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Destaques</div>
              <div style={cardSub}>Informações rápidas que aparecem no cartão do imóvel. Digite só os números.</div>
            </div>
            <div style={cardBody}>
              <div style={grid("1fr 1fr 1fr")}>
                {quantidade("garagens", "Garagem")}
                {areaM2("areaPrivativa", "Área privativa")}
                <div>
                  <label style={fieldLabel}>Situação</label>
                  <select style={fieldInput} value={dados.situacao} onChange={(e) => set("situacao", e.target.value)}>
                    <option value="">Não informado</option>
                    {SITUACOES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={grid("1fr 1fr", "0")}>
                {quantidade("dormitorios", "Quartos: dormitórios")}
                {quantidade("suites", "Quartos: suítes")}
              </div>
              {destaques.length > 0 && (
                <div style={{ ...fieldHint, marginTop: "14px" }}>
                  Como vai aparecer: <strong>{destaques.join(" · ")}</strong>
                </div>
              )}
            </div>
          </div>

          {/* FOTOS */}
          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Fotos</div>
              <div style={cardSub}>A primeira foto será a capa do imóvel</div>
            </div>
            <div style={cardBody}>
              {fotos.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "12px", marginBottom: "16px" }}>
                  {fotos.map((foto, i) => (
                    <div key={foto.chave} draggable
                      onDragStart={() => setArrastando(i)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => { if (arrastando !== null) moverFoto(arrastando, i); setArrastando(null); }}
                      onDragEnd={() => setArrastando(null)}
                      style={{ position: "relative", borderRadius: "10px", overflow: "hidden", aspectRatio: "4 / 3", background: "var(--neutral-100, #f1f1f1)", border: i === 0 ? "2px solid var(--gold-500)" : "1px solid var(--neutral-200)", opacity: arrastando === i ? 0.4 : 1, cursor: "grab" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={foto.preview} alt={`Foto ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
                      {i === 0 && (
                        <span style={{ position: "absolute", top: "6px", left: "6px", background: "var(--gold-500)", color: "#fff", fontSize: "11px", fontWeight: 600, padding: "3px 8px", borderRadius: "999px", fontFamily: "var(--font-sans)" }}>Capa</span>
                      )}
                      {!foto.id && (
                        <span style={{ position: "absolute", top: i === 0 ? "30px" : "6px", left: "6px", background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "11px", padding: "3px 8px", borderRadius: "999px", fontFamily: "var(--font-sans)" }}>Nova</span>
                      )}
                      <button type="button" onClick={() => removerFoto(i)} aria-label={`Remover foto ${i + 1}`} title="Remover"
                        style={{ position: "absolute", top: "6px", right: "6px", width: "26px", height: "26px", borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "16px", lineHeight: "24px", cursor: "pointer", padding: 0 }}>×</button>
                      <div style={{ position: "absolute", bottom: "6px", right: "6px", display: "flex", gap: "4px" }}>
                        {[{ seta: "‹", para: i - 1, titulo: "Mover para trás" }, { seta: "›", para: i + 1, titulo: "Mover para frente" }].map((b) => (
                          <button key={b.seta} type="button" onClick={() => moverFoto(i, b.para)} disabled={b.para < 0 || b.para >= fotos.length} title={b.titulo} aria-label={b.titulo}
                            style={{ width: "26px", height: "26px", borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "16px", lineHeight: "24px", cursor: "pointer", padding: 0, opacity: b.para < 0 || b.para >= fotos.length ? 0.3 : 1 }}>{b.seta}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <input ref={seletorFotos} type="file" accept={FORMATOS_FOTO.join(",")} multiple hidden
                onChange={(e) => { adicionarFotos(e.target.files); e.target.value = ""; }} />
              <button type="button" onClick={() => seletorFotos.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); adicionarFotos(e.dataTransfer.files); }}
                style={{ width: "100%", border: "2px dashed var(--neutral-200)", borderRadius: "12px", padding: "28px 24px", textAlign: "center", background: "none", cursor: "pointer" }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>📸</div>
                <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--neutral-900)", fontFamily: "var(--font-sans)", marginBottom: "4px" }}>Clique para adicionar fotos (ou arraste para cá)</div>
                <div style={{ fontSize: "13px", color: "var(--neutral-400)", fontFamily: "var(--font-sans)" }}>JPG, PNG ou WebP, até 15 MB cada. Pode escolher várias de uma vez.</div>
              </button>
              <div style={fieldHint}>Arraste as fotos (ou use ‹ ›) para mudar a ordem. As fotos só são enviadas ao clicar em {novo ? "Publicar imóvel" : "Salvar alterações"}.</div>
            </div>
          </div>

          {/* CÔMODOS */}
          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Cômodos</div>
              <div style={cardSub}>Adicione um por vez, quantos quiser</div>
            </div>
            <div style={cardBody}>
              <ListaLivre itens={dados.comodos} onChange={(v) => set("comodos", v)} botao="Adicionar cômodo" placeholder="Ex: 3 quartos" />
            </div>
          </div>

          {/* CARACTERÍSTICAS */}
          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Características</div>
              <div style={cardSub}>Adicione uma por vez, quantas quiser</div>
            </div>
            <div style={cardBody}>
              <ListaLivre itens={dados.caracteristicas} onChange={(v) => set("caracteristicas", v)} botao="Adicionar característica" placeholder="Ex: Armários planejados" />
            </div>
          </div>

          {/* CONDOMÍNIO */}
          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Condomínio</div>
              <div style={cardSub}>O que o condomínio oferece. Adicione um item por vez, quantos quiser</div>
            </div>
            <div style={cardBody}>
              <ListaLivre itens={dados.condominio} onChange={(v) => set("condominio", v)} botao="Adicionar item do condomínio" placeholder="Ex: Piscina" />
            </div>
          </div>

          {/* PROXIMIDADES */}
          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Proximidades</div>
              <div style={cardSub}>O que tem perto do imóvel. Adicione uma por vez, quantas quiser</div>
            </div>
            <div style={cardBody}>
              <ListaLivre itens={dados.proximidades} onChange={(v) => set("proximidades", v)} botao="Adicionar proximidade" placeholder="Ex: Shopping Pantanal" />
            </div>
          </div>

          {/* FICHA DO IMÓVEL */}
          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Ficha do imóvel</div>
              <div style={cardSub}>Todos os campos são opcionais. Áreas em m².</div>
            </div>
            <div style={cardBody}>
              <div style={grid("1fr 1fr 1fr")}>
                <div>
                  <label style={fieldLabel}>Unidades por andar</label>
                  <input type="number" min={0} style={fieldInput} value={dados.unidadesPorAndar ?? ""} onChange={(e) => set("unidadesPorAndar", e.target.value ? inteiro(e.target.value) : null)} />
                </div>
                <div>
                  <label style={fieldLabel}>Perfil</label>
                  <select style={fieldInput} value={dados.perfil} onChange={(e) => set("perfil", e.target.value)}>
                    <option value="">Não informado</option>
                    {PERFIS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={fieldLabel}>Posição solar</label>
                  <select style={fieldInput} value={dados.posicaoSolar} onChange={(e) => set("posicaoSolar", e.target.value)}>
                    <option value="">Não informado</option>
                    {POSICOES_SOLARES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div style={grid("1fr 1fr 1fr 1fr", "20px")}>
                {simNao("escriturado", "Escriturado")}
                {simNao("averbado", "Averbado")}
                {simNao("temFinanciamento", "Tem financiamento")}
                {simNao("aceitaFinanciamento", "Aceita financiamento")}
              </div>
              <div style={grid("1fr 1fr 1fr 1fr", "0")}>
                {areaM2("areaTerreno", "Terreno")}
                {areaM2("areaConstruida", "Área construída")}
                {areaM2("areaPrivativa", "Área privativa")}
                {areaM2("areaTotal", "Área total")}
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA LATERAL */}
        <div>
          <CorretorResponsavelCampo opcoes={corretores} valor={dados.corretorId} onChange={(id) => set("corretorId", id)} />

          {/* PREÇO E STATUS */}
          <div style={{ ...card, marginBottom: "16px" }}>
            <div style={{ ...cardHeader, padding: "16px 20px" }}><div style={cardTitle}>Preço e status</div></div>
            <div style={{ padding: "20px" }}>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Preço <Obrigatorio /></label>
                <input type="text" inputMode="numeric" style={fieldInput} value={precoParaCampo(dados.preco)} onChange={(e) => set("preco", precoDeDigitos(e.target.value))} placeholder="R$ 0,00" />
                <div style={fieldHint}>Digite só os números; os dois últimos são os centavos.</div>
              </div>
              <div>
                <label style={fieldLabel}>Status <Obrigatorio /></label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {(Object.keys(statusLabel) as StatusImovel[]).map((st) => {
                    const sel = dados.status === st;
                    return (
                      <button type="button" key={st} onClick={() => set("status", st)} style={{
                        padding: "12px 14px", border: `1px solid ${sel ? corStatus[st] : "var(--neutral-200)"}`,
                        borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px",
                        background: sel ? `${corStatus[st]}18` : "transparent", transition: "all .2s",
                      }}>
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: corStatus[st], flexShrink: 0 }} />
                        <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--neutral-900)", fontFamily: "var(--font-sans)" }}>{statusLabel[st]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* PUBLICAÇÃO */}
          <div style={{ ...card, marginBottom: "16px" }}>
            <div style={{ ...cardHeader, padding: "16px 20px" }}><div style={cardTitle}>Publicação</div></div>
            <div style={{ padding: "20px" }}>
              <Toggle label="Imóvel em destaque" sub="Aparece no topo da galeria" on={dados.destaque} onChange={(v) => set("destaque", v)} />
              <Toggle label="Visível no site" sub="Desmarque para guardar como rascunho" on={dados.visivel} onChange={(v) => set("visivel", v)} />
            </div>
          </div>

          {/* AÇÕES */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button id="topbar-publicar" onClick={handleSalvar} disabled={salvando} style={{ ...btnPrimary, opacity: salvando ? 0.7 : 1 }}>
              {salvando ? progresso || "Salvando..." : novo ? "Publicar imóvel" : "Salvar alterações"}
            </button>
            <a href={voltarPara} style={btnOutline}>Cancelar</a>
          </div>
        </div>
      </div>
    </>
  );
}
