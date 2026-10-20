"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSessao } from "@/context/SessaoContext";
import { resumoImovel, tipoIcone, tipoLabel, type Imovel, type Opcao, type StatusImovel } from "@/lib/imoveis";
import { formatPrice } from "@/lib/helpers/formatters";
import { alterarStatusImoveis, excluirImoveis } from "@/app/admin/(painel)/imoveis/acoes";
import { ConfirmDialog, useToast } from "@/components/admin/ui";

const POR_PAGINA = 10;

const statusInfo: Record<StatusImovel, { label: string; badge: React.CSSProperties; pill: React.CSSProperties }> = {
  disponivel: { label: "Disponível", badge: { background: "rgba(61,170,111,0.12)", color: "#2A9D6A" }, pill: { background: "rgba(61,170,111,0.1)", color: "#2A9D6A", border: "1px solid rgba(61,170,111,0.2)" } },
  reservado: { label: "Reservado", badge: { background: "rgba(212,144,10,0.12)", color: "#B07C08" }, pill: { background: "rgba(212,144,10,0.1)", color: "#B07C08", border: "1px solid rgba(212,144,10,0.2)" } },
  vendido: { label: "Vendido", badge: { background: "rgba(224,82,82,0.1)", color: "#C04545" }, pill: { background: "rgba(224,82,82,0.08)", color: "#C04545", border: "1px solid rgba(224,82,82,0.2)" } },
  lancamento: { label: "Lançamento", badge: { background: "rgba(45,89,134,0.12)", color: "#2D5986" }, pill: { background: "rgba(45,89,134,0.1)", color: "#2D5986", border: "1px solid rgba(45,89,134,0.2)" } },
};

type Confirmacao = { titulo: string; texto: string; confirmar: string; acao: () => void } | null;
export type Aba = "meus" | "equipe";

// Lista de imóveis do painel. Chega pronta do servidor:
// o corretor recebe só os próprios imóveis e o admin recebe todos.
// O admin vê duas abas: "Meus imóveis" (os que ele anuncia) e "Imóveis da equipe"
// (dos corretores), para não mexer sem querer no que não é dele.
// O corretor não vê abas nem nada da equipe.
export default function ImoveisLista({ imoveis: todos, corretores, abaInicial }: { imoveis: Imovel[]; corretores: Opcao[]; abaInicial: Aba }) {
  const router = useRouter();
  const { isAdmin, usuario } = useSessao();
  const { toast, mostrar } = useToast();
  const [aba, setAba] = useState<Aba>(abaInicial);
  const [search, setSearch] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCorretor, setFilterCorretor] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [confirmacao, setConfirmacao] = useState<Confirmacao>(null);
  const [ocupado, setOcupado] = useState(false);

  const equipe = isAdmin && aba === "equipe";
  const imoveis = !isAdmin ? todos : todos.filter((im) => (im.corretorId === usuario.id) !== equipe);

  const nomeCorretor = (id: string) => corretores.find((c) => c.id === id)?.nome ?? "—";
  // "de Ana e Bruno" — usado nas confirmações da aba da equipe.
  const donos = (ids: string[]) => {
    const nomes = Array.from(new Set(todos.filter((im) => ids.includes(im.id)).map((im) => nomeCorretor(im.corretorId))));
    return nomes.length > 1 ? `${nomes.slice(0, -1).join(", ")} e ${nomes[nomes.length - 1]}` : nomes[0] ?? "";
  };

  const filtered = imoveis.filter((im) => {
    const q = search.toLowerCase();
    const matchSearch = !q || [im.titulo, im.bairro, im.cidade, im.endereco].some((t) => t.toLowerCase().includes(q));
    const matchTipo = !filterTipo || im.tipo === filterTipo;
    const matchStatus = !filterStatus || im.status === filterStatus;
    const matchCorretor = !filterCorretor || im.corretorId === filterCorretor;
    return matchSearch && matchTipo && matchStatus && matchCorretor;
  });

  const totalPaginas = Math.max(1, Math.ceil(filtered.length / POR_PAGINA));
  const paginaAtual = Math.min(page, totalPaginas);
  const inicio = (paginaAtual - 1) * POR_PAGINA;
  const visiveis = filtered.slice(inicio, inicio + POR_PAGINA);

  // Qualquer mudança de filtro volta para a página 1 e limpa a seleção.
  const filtrar = (fn: () => void) => { fn(); setPage(1); setSelected([]); };

  // Troca de aba limpa os filtros e fica guardada no endereço (para voltar nela depois de editar).
  const trocarAba = (nova: Aba) => {
    filtrar(() => { setAba(nova); setFilterCorretor(""); setFilterStatus(""); });
    window.history.replaceState(null, "", nova === "equipe" ? "/admin/imoveis?aba=equipe" : "/admin/imoveis");
  };

  const allChecked = visiveis.length > 0 && visiveis.every((im) => selected.includes(im.id));
  const someChecked = selected.length > 0 && !allChecked;

  const toggleAll = () => setSelected(allChecked ? [] : visiveis.map((im) => im.id));
  const toggleOne = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const alterarStatus = async (status: StatusImovel | "") => {
    if (!status || ocupado) return;
    setConfirmacao(null);
    setOcupado(true);
    const { erro } = await alterarStatusImoveis(selected, status);
    setOcupado(false);
    if (erro) {
      mostrar(erro, true);
      return;
    }
    mostrar(`${selected.length} imóvel(is) marcado(s) como ${statusInfo[status].label}`);
    setSelected([]);
    router.refresh();
  };

  // Na aba da equipe, mudar status também pede confirmação, mostrando de quem são os imóveis.
  const pedirAlterarStatus = (status: StatusImovel | "") => {
    if (!status) return;
    if (!equipe) return alterarStatus(status);
    setConfirmacao({
      titulo: "Alterar imóveis da equipe?",
      texto: `Os ${selected.length} imóveis selecionados são de ${donos(selected)} e serão marcados como ${statusInfo[status].label}.`,
      confirmar: "Alterar status",
      acao: () => alterarStatus(status),
    });
  };

  const pedirExcluir = (ids: string[], nome?: string) => {
    const quais = nome ? `"${nome}"` : `Os ${ids.length} imóveis selecionados`;
    const deQuem = equipe ? ` (${ids.length === 1 ? "imóvel" : "imóveis"} de ${donos(ids)})` : "";
    setConfirmacao({
      titulo: ids.length === 1 ? "Excluir imóvel?" : "Excluir imóveis?",
      texto: `${quais}${deQuem} e as fotos serão excluídos do site. Isso não pode ser desfeito.`,
      confirmar: "Excluir",
      acao: () => excluir(ids),
    });
  };

  const excluir = async (ids: string[]) => {
    setConfirmacao(null);
    setOcupado(true);
    const { erro } = await excluirImoveis(ids);
    setOcupado(false);
    if (erro) {
      mostrar(erro, true);
      return;
    }
    setSelected((prev) => prev.filter((id) => !ids.includes(id)));
    mostrar(ids.length === 1 ? "Imóvel excluído" : `${ids.length} imóveis excluídos`);
    router.refresh();
  };

  const fieldInput: React.CSSProperties = {
    padding: "10px 14px", border: "1px solid var(--neutral-200)", borderRadius: "8px",
    fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--neutral-600)",
    background: "#fff", outline: "none", cursor: "pointer",
  };
  const bulkBtn: React.CSSProperties = { padding: "6px 14px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.15)", background: "none", color: "#fff", fontSize: "12px", cursor: "pointer" };
  const pagBtn = (ativo: boolean, desabilitado = false): React.CSSProperties => ({
    width: "32px", height: "32px", borderRadius: "6px", border: "1px solid var(--neutral-200)",
    background: ativo ? "var(--navy-900)" : "#fff", color: ativo ? "#fff" : "var(--neutral-600)",
    cursor: desabilitado ? "default" : "pointer", opacity: desabilitado ? 0.4 : 1,
    fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center",
  });

  return (
    <div style={{ maxWidth: "1200px" }}>
      {toast}
      {confirmacao && (
        <ConfirmDialog
          titulo={confirmacao.titulo}
          texto={confirmacao.texto}
          confirmar={confirmacao.confirmar}
          onConfirmar={confirmacao.acao}
          onCancelar={() => setConfirmacao(null)}
        />
      )}

      {/* ABAS (só admin) */}
      {isAdmin && (
        <div style={{ display: "flex", gap: "4px", borderBottom: "1px solid var(--neutral-200)", marginBottom: "20px" }}>
          {([["meus", "Meus imóveis"], ["equipe", "Imóveis da equipe"]] as [Aba, string][]).map(([valor, rotulo]) => {
            const ativa = aba === valor;
            const total = todos.filter((im) => (im.corretorId === usuario.id) !== (valor === "equipe")).length;
            return (
              <button key={valor} onClick={() => trocarAba(valor)} style={{
                padding: "10px 18px", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)",
                fontSize: "14px", fontWeight: ativa ? 600 : 500, color: ativa ? "var(--neutral-900)" : "var(--neutral-400)",
                borderBottom: `2px solid ${ativa ? "var(--gold-500)" : "transparent"}`, marginBottom: "-1px",
              }}>
                {rotulo} <span style={{ fontSize: "12px", color: "var(--neutral-400)", fontWeight: 400 }}>({total})</span>
              </button>
            );
          })}
        </div>
      )}

      {equipe && (
        <div style={{ background: "rgba(212,144,10,0.08)", border: "1px solid rgba(212,144,10,0.3)", borderRadius: "10px", padding: "14px 18px", marginBottom: "20px", fontSize: "13px", color: "var(--neutral-600)", fontFamily: "var(--font-sans)", lineHeight: 1.6 }}>
          ⚠️ Estes imóveis são <strong>dos corretores</strong>. Alterações aqui afetam o anúncio deles.
        </div>
      )}

      {/* FILTROS */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--neutral-400)", fontSize: "15px" }}>🔍</span>
          <input
            type="text"
            placeholder="Buscar imóvel por nome, bairro, cidade..."
            value={search}
            onChange={(e) => filtrar(() => setSearch(e.target.value))}
            style={{ ...fieldInput, width: "100%", paddingLeft: "40px", cursor: "text" }}
          />
        </div>
        <select style={fieldInput} value={filterTipo} onChange={(e) => filtrar(() => setFilterTipo(e.target.value))}>
          <option value="">Todos os tipos</option>
          {Object.entries(tipoLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        {equipe && (
          <select style={fieldInput} value={filterCorretor} onChange={(e) => filtrar(() => setFilterCorretor(e.target.value))}>
            <option value="">Todos os corretores</option>
            {corretores.filter((c) => c.id !== usuario.id).map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        )}
      </div>

      {/* ABAS DE STATUS */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {(["", ...Object.keys(statusInfo)] as (StatusImovel | "")[]).map((st) => {
          const ativo = filterStatus === st;
          const total = st ? imoveis.filter((x) => x.status === st).length : imoveis.length;
          const cor = st ? statusInfo[st].pill : { background: "#fff", color: "var(--neutral-600)", border: "1px solid var(--neutral-200)" };
          return (
            <button key={st || "todos"} onClick={() => filtrar(() => setFilterStatus(st))} style={{
              padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-sans)",
              ...(ativo ? { background: "var(--navy-900)", color: "#fff", border: "1px solid var(--navy-900)" } : cor),
            }}>
              {st ? statusInfo[st].label : "Todos"} ({total})
            </button>
          );
        })}
      </div>

      {/* TABELA */}
      <div style={{ background: "#fff", border: "1px solid var(--neutral-200)", borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--neutral-100)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--neutral-900)" }}>{equipe ? "Imóveis da equipe" : "Meus imóveis"}</span>
          <span style={{ fontSize: "13px", color: "var(--neutral-400)" }}>{filtered.length} imóveis</span>
        </div>

        {/* AÇÕES EM MASSA */}
        {selected.length > 0 && (
          <div style={{ background: "var(--navy-900)", color: "#fff", padding: "12px 24px", display: "flex", alignItems: "center", gap: "16px", fontSize: "13px", flexWrap: "wrap" }}>
            <span><span style={{ color: "var(--gold-400)", fontWeight: 600 }}>{selected.length}</span> selecionados</span>
            <select value="" disabled={ocupado} onChange={(e) => pedirAlterarStatus(e.target.value as StatusImovel | "")} style={{ ...bulkBtn, background: "var(--navy-900)" }}>
              <option value="">Alterar status para…</option>
              {Object.entries(statusInfo).map(([v, s]) => <option key={v} value={v}>{s.label}</option>)}
            </select>
            <button
              onClick={() => pedirExcluir(selected)}
              disabled={ocupado}
              style={{ ...bulkBtn, border: "1px solid rgba(224,82,82,0.4)", color: "#F08080" }}
            >
              Excluir selecionados
            </button>
          </div>
        )}

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ width: "40px", padding: "12px 20px 12px 24px", background: "var(--neutral-50)", borderBottom: "1px solid var(--neutral-200)", textAlign: "left" }}>
                  <input type="checkbox" checked={allChecked} ref={(el) => { if (el) el.indeterminate = someChecked; }} onChange={toggleAll} style={{ accentColor: "var(--gold-500)", width: "15px", height: "15px", cursor: "pointer" }} />
                </th>
                {["Imóvel", "Tipo", "Preço", ...(equipe ? ["Corretor"] : []), "Status", "Ações"].map((h) => (
                  <th key={h} style={{ padding: "12px 20px", background: "var(--neutral-50)", borderBottom: "1px solid var(--neutral-200)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--neutral-400)", textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visiveis.length === 0 && (
                <tr>
                  <td colSpan={equipe ? 7 : 6} style={{ padding: "48px 24px", textAlign: "center", fontSize: "14px", color: "var(--neutral-400)" }}>
                    Nenhum imóvel encontrado.{" "}
                    <Link href="/admin/imoveis/novo" style={{ color: "var(--gold-500)", fontWeight: 500 }}>Cadastrar imóvel</Link>
                  </td>
                </tr>
              )}
              {visiveis.map((im) => (
                <tr key={im.id} style={{ borderBottom: "1px solid var(--neutral-100)", cursor: "pointer" }}
                  onClick={() => router.push(`/admin/imoveis/${im.id}/editar`)}>
                  <td style={{ padding: "14px 20px 14px 24px" }} onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={selected.includes(im.id)} onChange={() => toggleOne(im.id)} style={{ accentColor: "var(--gold-500)", width: "15px", height: "15px", cursor: "pointer" }} />
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "8px", background: "linear-gradient(135deg,var(--neutral-200),var(--neutral-100))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>{tipoIcone[im.tipo]}</div>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--neutral-900)" }}>{im.titulo}</div>
                        <div style={{ fontSize: "12px", color: "var(--neutral-400)", marginTop: "2px" }}>
                          {resumoImovel(im)}{!im.visivel && <span style={{ color: "var(--gold-500)" }}> · fora do site</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "14px", color: "var(--neutral-600)" }}>{tipoLabel[im.tipo]}</td>
                  <td style={{ padding: "14px 20px", fontSize: "14px", color: "var(--neutral-600)", whiteSpace: "nowrap" }}>{formatPrice(im.preco)}</td>
                  {equipe && (
                    <td style={{ padding: "14px 20px", fontSize: "14px", color: "var(--neutral-600)", whiteSpace: "nowrap" }}>{nomeCorretor(im.corretorId)}</td>
                  )}
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ display: "inline-block", fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px", whiteSpace: "nowrap", ...statusInfo[im.status].badge }}>{statusInfo[im.status].label}</span>
                  </td>
                  <td style={{ padding: "14px 20px" }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Link href={`/admin/imoveis/${im.id}/editar`} style={{ width: "32px", height: "32px", borderRadius: "6px", border: "1px solid var(--neutral-200)", background: "none", cursor: "pointer", fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }} title="Editar">✏️</Link>
                      <button
                        onClick={() => pedirExcluir([im.id], im.titulo)}
                        style={{ width: "32px", height: "32px", borderRadius: "6px", border: "1px solid var(--neutral-200)", background: "none", cursor: "pointer", fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center" }}
                        title="Excluir"
                      >🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINAÇÃO */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderTop: "1px solid var(--neutral-100)", flexWrap: "wrap", gap: "12px" }}>
          <span style={{ fontSize: "13px", color: "var(--neutral-400)" }}>
            {filtered.length === 0 ? "Nenhum resultado" : `Mostrando ${inicio + 1}–${inicio + visiveis.length} de ${filtered.length} imóveis`}
          </span>
          {totalPaginas > 1 && (
            <div style={{ display: "flex", gap: "4px" }}>
              <button onClick={() => setPage(paginaAtual - 1)} disabled={paginaAtual === 1} style={pagBtn(false, paginaAtual === 1)} aria-label="Página anterior">‹</button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => setPage(n)} style={pagBtn(n === paginaAtual)}>{n}</button>
              ))}
              <button onClick={() => setPage(paginaAtual + 1)} disabled={paginaAtual === totalPaginas} style={pagBtn(false, paginaAtual === totalPaginas)} aria-label="Próxima página">›</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
