"use client";

import { useState } from "react";
import Link from "next/link";
import { useSessao } from "@/context/SessaoContext";
import { corretores, papelLabel } from "@/lib/mock/corretores";
import { imoveisMock } from "@/lib/mock/publicacoes";
import { AcessoRestrito, iniciais, useToast } from "@/components/admin/ui";

const filtroInput: React.CSSProperties = {
  padding: "10px 14px", border: "1px solid var(--neutral-200)", borderRadius: "8px",
  fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--neutral-600)",
  background: "#fff", outline: "none", cursor: "pointer",
};

function formatarWhatsapp(numero: string) {
  const n = numero.replace(/^55/, "");
  return n.length === 11 ? `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}` : numero;
}

export default function AdminCorretoresPage() {
  const { isAdmin, usuario } = useSessao();
  const { toast, mostrar } = useToast();
  const [lista, setLista] = useState(corretores);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  if (!isAdmin) return <AcessoRestrito />;

  const filtered = lista.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.nome.toLowerCase().includes(q) || c.creci.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    const matchStatus = !filterStatus || (filterStatus === "ativo" ? c.ativo : !c.ativo);
    return matchSearch && matchStatus;
  });

  const alternarAtivo = (id: string) => {
    const c = lista.find((x) => x.id === id);
    if (!c) return;
    setLista(lista.map((x) => (x.id === id ? { ...x, ativo: !x.ativo } : x)));
    mostrar(c.ativo ? `${c.nome} foi desativado(a)` : `${c.nome} foi reativado(a)`);
  };

  const th: React.CSSProperties = { padding: "12px 20px", background: "var(--neutral-50)", borderBottom: "1px solid var(--neutral-200)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--neutral-400)", textAlign: "left", whiteSpace: "nowrap" };
  const td: React.CSSProperties = { padding: "14px 20px", fontSize: "14px", color: "var(--neutral-600)", whiteSpace: "nowrap" };
  const btnAcao: React.CSSProperties = { padding: "6px 12px", borderRadius: "6px", border: "1px solid var(--neutral-200)", background: "none", cursor: "pointer", fontSize: "12px", color: "var(--neutral-600)", textDecoration: "none", fontFamily: "var(--font-sans)", whiteSpace: "nowrap" };

  return (
    <div style={{ maxWidth: "1200px" }}>
      {toast}

      {/* AVISO */}
      <div style={{ background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.25)", borderRadius: "10px", padding: "14px 18px", marginBottom: "20px", fontSize: "13px", color: "var(--neutral-600)", fontFamily: "var(--font-sans)", lineHeight: 1.6 }}>
        Cada corretor cadastrado recebe um acesso ao painel e aparece na página <strong>Contato</strong> do site.
        <strong> Corretores</strong> só editam o próprio perfil e as próprias publicações. <strong>Administradores</strong> gerenciam tudo.
      </div>

      {/* FILTROS */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--neutral-400)", fontSize: "15px" }}>🔍</span>
          <input
            type="text"
            placeholder="Buscar por nome, CRECI ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...filtroInput, width: "100%", paddingLeft: "40px", cursor: "text" }}
          />
        </div>
        <select style={filtroInput} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">Todos</option>
          <option value="ativo">Ativos</option>
          <option value="inativo">Inativos</option>
        </select>
      </div>

      {/* TABELA */}
      <div style={{ background: "#fff", border: "1px solid var(--neutral-200)", borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--neutral-100)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--neutral-900)" }}>Equipe</span>
          <span style={{ fontSize: "13px", color: "var(--neutral-400)" }}>{filtered.length} corretores</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Corretor", "WhatsApp", "Papel", "Imóveis", "Status", "Ações"].map((h) => (
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const totalImoveis = imoveisMock.filter((im) => im.corretorId === c.id).length;
                const souEu = c.id === usuario.id;
                return (
                  <tr key={c.id} style={{ borderBottom: "1px solid var(--neutral-100)", opacity: c.ativo ? 1 : 0.55 }}>
                    <td style={td}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg,var(--navy-700),var(--navy-500))", border: "2px solid var(--gold-500)", color: "var(--gold-400)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, fontFamily: "var(--font-serif)", flexShrink: 0 }}>
                          {iniciais(c.nome)}
                        </div>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--neutral-900)" }}>
                            {c.nome} {souEu && <span style={{ fontSize: "11px", color: "var(--gold-500)" }}>(você)</span>}
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--neutral-400)", marginTop: "2px" }}>{c.creci} · {c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={td}>{formatarWhatsapp(c.whatsapp)}</td>
                    <td style={td}>
                      <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px", ...(c.papel === "admin" ? { background: "rgba(201,169,110,0.15)", color: "#9A7B3F" } : { background: "rgba(45,89,134,0.1)", color: "#2D5986" }) }}>
                        {papelLabel[c.papel]}
                      </span>
                    </td>
                    <td style={td}>{totalImoveis}</td>
                    <td style={td}>
                      <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px", ...(c.ativo ? { background: "rgba(61,170,111,0.12)", color: "#2A9D6A" } : { background: "var(--neutral-100)", color: "var(--neutral-400)" }) }}>
                        {c.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td style={td}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <Link href={`/admin/corretores/${c.id}/editar`} style={btnAcao}>✏️ Editar</Link>
                        {!souEu && (
                          <button onClick={() => alternarAtivo(c.id)} style={btnAcao}>
                            {c.ativo ? "Desativar" : "Reativar"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
