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

type Confirmacao = { ids: string[]; texto: string } | null;

// Lista de imóveis do painel. Chega pronta do servidor:
// o corretor recebe só os próprios imóveis e o admin recebe todos.
export default function ImoveisLista({ imoveis, corretores }: { imoveis: Imovel[]; corretores: Opcao[] }) {
  const router = useRouter();
  const { isAdmin } = useSessao();
  const { toast, mostrar } = useToast();
  const [search, setSearch] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCorretor, setFilterCorretor] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [confirmacao, setConfirmacao] = useState<Confirmacao>(null);
  const [ocupado, setOcupado] = useState(false);

  const nomeCorretor = (id: string) => corretores.find((c) => c.id === id)?.nome ?? "—";

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

  const allChecked = visiveis.length > 0 && visiveis.every((im) => selected.includes(im.id));
  const someChecked = selected.length > 0 && !allChecked;

  const toggleAll = () => setSelected(allChecked ? [] : visiveis.map((im) => im.id));
  const toggleOne = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const alterarStatus = async (status: StatusImovel | "") => {
    if (!status || ocupado) return;
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
          titulo="Excluir imóvel?"
          texto={confirmacao.texto}
          confirmar="Excluir"
          onConfirmar={() => excluir(confirmacao.ids)}
          onCancelar={() => setConfirmacao(null)}
        />
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
        {isAdmin && (
          <select style={fieldInput} value={filterCorretor} onChange={(e) => filtrar(() => setFilterCorretor(e.target.value))}>
            <option value="">Todos os corretores</option>
            {corretores.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
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
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--neutral-900)" }}>{isAdmin ? "Lista de imóveis" : "Meus imóveis"}</span>
          <span style={{ fontSize: "13px", color: "var(--neutral-400)" }}>{filtered.length} imóveis</span>
        </div>

        {/* AÇÕES EM MASSA */}
        {selected.length > 0 && (
          <div style={{ background: "var(--navy-900)", color: "#fff", padding: "12px 24px", display: "flex", alignItems: "center", gap: "16px", fontSize: "13px", flexWrap: "wrap" }}>
            <span><span style={{ color: "var(--gold-400)", fontWeight: 600 }}>{selected.length}</span> selecionados</span>
            <select value="" disabled={ocupado} onChange={(e) => alterarStatus(e.target.value as StatusImovel | "")} style={{ ...bulkBtn, background: "var(--navy-900)" }}>
              <option value="">Alterar status para…</option>
              {Object.entries(statusInfo).map(([v, s]) => <option key={v} value={v}>{s.label}</option>)}
            </select>
            <button
              onClick={() => setConfirmacao({ ids: selected, texto: `Os ${selected.length} imóveis selecionados e as fotos deles serão excluídos do site. Isso não pode ser desfeito.` })}
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
                {["Imóvel", "Tipo", "Preço", ...(isAdmin ? ["Corretor"] : []), "Status", "Ações"].map((h) => (
                  <th key={h} style={{ padding: "12px 20px", background: "var(--neutral-50)", borderBottom: "1px solid var(--neutral-200)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--neutral-400)", textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visiveis.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} style={{ padding: "48px 24px", textAlign: "center", fontSize: "14px", color: "var(--neutral-400)" }}>
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
                  {isAdmin && (
                    <td style={{ padding: "14px 20px", fontSize: "14px", color: "var(--neutral-600)", whiteSpace: "nowrap" }}>{nomeCorretor(im.corretorId)}</td>
                  )}
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ display: "inline-block", fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px", whiteSpace: "nowrap", ...statusInfo[im.status].badge }}>{statusInfo[im.status].label}</span>
                  </td>
                  <td style={{ padding: "14px 20px" }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Link href={`/admin/imoveis/${im.id}/editar`} style={{ width: "32px", height: "32px", borderRadius: "6px", border: "1px solid var(--neutral-200)", background: "none", cursor: "pointer", fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }} title="Editar">✏️</Link>
                      <button
                        onClick={() => setConfirmacao({ ids: [im.id], texto: `"${im.titulo}" e as fotos dele serão excluídos do site. Isso não pode ser desfeito.` })}
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
