"use client";

import { useState } from "react";
import Link from "next/link";

const imoveis = [
  { id: 1, nome: "Apartamento Jardins", sub: "São Paulo · 98m² · 3 quartos", tipo: "Apartamento", preco: "R$ 850.000", status: "disponivel", icon: "🏠" },
  { id: 2, nome: "Casa Alphaville", sub: "Barueri · 320m² · 4 quartos", tipo: "Casa", preco: "R$ 2.400.000", status: "reservado", icon: "🏡" },
  { id: 3, nome: "Studio Vila Olímpia", sub: "São Paulo · 42m² · 1 quarto", tipo: "Studio", preco: "R$ 390.000", status: "disponivel", icon: "🏢" },
  { id: 4, nome: "Cobertura Pinheiros", sub: "São Paulo · 210m² · 4 quartos", tipo: "Cobertura", preco: "R$ 3.100.000", status: "vendido", icon: "🏠" },
  { id: 5, nome: "Apto Grand Tower", sub: "São Paulo · 75m² · 2 quartos", tipo: "Apartamento", preco: "R$ 680.000", status: "lancamento", icon: "🏗" },
  { id: 6, nome: "Apartamento Moema", sub: "São Paulo · 120m² · 3 quartos", tipo: "Apartamento", preco: "R$ 1.200.000", status: "disponivel", icon: "🏠" },
  { id: 7, nome: "Casa Condomínio São Roque", sub: "São Roque · 250m² · 3 quartos", tipo: "Casa", preco: "R$ 890.000", status: "disponivel", icon: "🏡" },
  { id: 8, nome: "Sala Comercial Faria Lima", sub: "São Paulo · 55m²", tipo: "Comercial", preco: "R$ 950.000", status: "disponivel", icon: "🏢" },
];

const badgeStyle: Record<string, React.CSSProperties> = {
  disponivel: { background: "rgba(61,170,111,0.12)", color: "#2A9D6A" },
  reservado: { background: "rgba(212,144,10,0.12)", color: "#B07C08" },
  vendido: { background: "rgba(224,82,82,0.1)", color: "#C04545" },
  lancamento: { background: "rgba(45,89,134,0.12)", color: "#2D5986" },
};
const badgeLabel: Record<string, string> = {
  disponivel: "Disponível", reservado: "Reservado", vendido: "Vendido", lancamento: "Lançamento",
};

export default function AdminImoveisPage() {
  const [search, setSearch] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);

  const filtered = imoveis.filter((im) => {
    const q = search.toLowerCase();
    const matchSearch = !q || im.nome.toLowerCase().includes(q) || im.sub.toLowerCase().includes(q);
    const matchTipo = !filterTipo || im.tipo === filterTipo;
    const matchStatus = !filterStatus || im.status === filterStatus;
    return matchSearch && matchTipo && matchStatus;
  });

  const allChecked = filtered.length > 0 && filtered.every((im) => selected.includes(im.id));
  const someChecked = selected.length > 0 && !allChecked;

  const toggleAll = () => {
    if (allChecked) setSelected([]);
    else setSelected(filtered.map((im) => im.id));
  };

  const toggleOne = (id: number) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const fieldInput: React.CSSProperties = {
    padding: "10px 14px", border: "1px solid var(--neutral-200)", borderRadius: "8px",
    fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--neutral-600)",
    background: "#fff", outline: "none", cursor: "pointer",
  };

  return (
    <div style={{ maxWidth: "1200px" }}>

      {/* FILTROS */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--neutral-400)", fontSize: "15px" }}>🔍</span>
          <input
            type="text"
            placeholder="Buscar imóvel por nome, bairro, cidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...fieldInput, width: "100%", paddingLeft: "40px", cursor: "text" }}
          />
        </div>
        <select style={fieldInput} value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
          <option value="">Todos os tipos</option>
          <option>Apartamento</option>
          <option>Casa</option>
          <option>Studio</option>
          <option>Cobertura</option>
          <option>Terreno</option>
          <option>Comercial</option>
        </select>
        <select style={fieldInput} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">Todos os status</option>
          <option value="disponivel">Disponível</option>
          <option value="reservado">Reservado</option>
          <option value="vendido">Vendido</option>
          <option value="lancamento">Lançamento</option>
        </select>
      </div>

      {/* PILLS */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {[
          { label: `Todos (${imoveis.length})`, cls: "all" },
          { label: `Disponível (${imoveis.filter(x => x.status === "disponivel").length})`, cls: "disp" },
          { label: `Reservado (${imoveis.filter(x => x.status === "reservado").length})`, cls: "res" },
          { label: `Vendido (${imoveis.filter(x => x.status === "vendido").length})`, cls: "vend" },
          { label: `Lançamento (${imoveis.filter(x => x.status === "lancamento").length})`, cls: "lanc" },
        ].map((pill, i) => (
          <span key={i} style={{
            padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 500, cursor: "pointer",
            ...(i === 0
              ? { background: "var(--navy-900)", color: "#fff" }
              : i === 1 ? { background: "rgba(61,170,111,0.1)", color: "#2A9D6A", border: "1px solid rgba(61,170,111,0.2)" }
              : i === 2 ? { background: "rgba(212,144,10,0.1)", color: "#B07C08", border: "1px solid rgba(212,144,10,0.2)" }
              : i === 3 ? { background: "rgba(224,82,82,0.08)", color: "#C04545", border: "1px solid rgba(224,82,82,0.2)" }
              : { background: "rgba(45,89,134,0.1)", color: "#2D5986", border: "1px solid rgba(45,89,134,0.2)" })
          }}>
            {pill.label}
          </span>
        ))}
      </div>

      {/* TABELA */}
      <div style={{ background: "#fff", border: "1px solid var(--neutral-200)", borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--neutral-100)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--neutral-900)" }}>Lista de imóveis</span>
          <span style={{ fontSize: "13px", color: "var(--neutral-400)" }}>{filtered.length} imóveis</span>
        </div>

        {/* BULK BAR */}
        {selected.length > 0 && (
          <div style={{ background: "var(--navy-900)", color: "#fff", padding: "12px 24px", display: "flex", alignItems: "center", gap: "16px", fontSize: "13px" }}>
            <span><span style={{ color: "var(--gold-400)", fontWeight: 600 }}>{selected.length}</span> selecionados</span>
            <button style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.15)", background: "none", color: "#fff", fontSize: "12px", cursor: "pointer" }}>Alterar status</button>
            <button style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.15)", background: "none", color: "#fff", fontSize: "12px", cursor: "pointer" }}>Exportar</button>
            <button style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid rgba(224,82,82,0.4)", background: "none", color: "#F08080", fontSize: "12px", cursor: "pointer" }}>Excluir selecionados</button>
          </div>
        )}

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ width: "40px", padding: "12px 20px 12px 24px", background: "var(--neutral-50)", borderBottom: "1px solid var(--neutral-200)", textAlign: "left" }}>
                  <input type="checkbox" checked={allChecked} ref={(el) => { if (el) el.indeterminate = someChecked; }} onChange={toggleAll} style={{ accentColor: "var(--gold-500)", width: "15px", height: "15px", cursor: "pointer" }} />
                </th>
                {["Imóvel", "Tipo", "Preço", "Status", "Ações"].map((h) => (
                  <th key={h} style={{ padding: "12px 20px", background: "var(--neutral-50)", borderBottom: "1px solid var(--neutral-200)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--neutral-400)", textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((im) => (
                <tr key={im.id} style={{ borderBottom: "1px solid var(--neutral-100)", cursor: "pointer" }}
                  onClick={() => { window.location.href = `/admin/imoveis/${im.id}/editar`; }}>
                  <td style={{ padding: "14px 20px 14px 24px" }} onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={selected.includes(im.id)} onChange={() => toggleOne(im.id)} style={{ accentColor: "var(--gold-500)", width: "15px", height: "15px", cursor: "pointer" }} />
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "8px", background: "linear-gradient(135deg,var(--neutral-200),var(--neutral-100))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>{im.icon}</div>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--neutral-900)" }}>{im.nome}</div>
                        <div style={{ fontSize: "12px", color: "var(--neutral-400)", marginTop: "2px" }}>{im.sub}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "14px", color: "var(--neutral-600)" }}>{im.tipo}</td>
                  <td style={{ padding: "14px 20px", fontSize: "14px", color: "var(--neutral-600)" }}>{im.preco}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ display: "inline-block", fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px", ...badgeStyle[im.status] }}>{badgeLabel[im.status]}</span>
                  </td>
                  <td style={{ padding: "14px 20px" }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Link href={`/admin/imoveis/${im.id}/editar`} style={{ width: "32px", height: "32px", borderRadius: "6px", border: "1px solid var(--neutral-200)", background: "none", cursor: "pointer", fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }} title="Editar">✏️</Link>
                      <button style={{ width: "32px", height: "32px", borderRadius: "6px", border: "1px solid var(--neutral-200)", background: "none", cursor: "pointer", fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center" }} title="Excluir">🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINAÇÃO */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderTop: "1px solid var(--neutral-100)", flexWrap: "wrap", gap: "12px" }}>
          <span style={{ fontSize: "13px", color: "var(--neutral-400)" }}>Mostrando 1–{filtered.length} de {imoveis.length} imóveis</span>
          <div style={{ display: "flex", gap: "4px" }}>
            {["‹", "1", "2", "3", "›"].map((btn) => (
              <button key={btn} onClick={() => { if (!isNaN(Number(btn))) setPage(Number(btn)); }} style={{
                width: "32px", height: "32px", borderRadius: "6px", border: "1px solid var(--neutral-200)",
                background: String(page) === btn ? "var(--navy-900)" : "#fff",
                color: String(page) === btn ? "#fff" : "var(--neutral-600)",
                cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center",
              }}>{btn}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
