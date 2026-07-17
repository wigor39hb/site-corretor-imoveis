"use client";

import { useState } from "react";
import Link from "next/link";

const empreendimentos = [
  { id: 1, nome: "Grand Tower", loc: "Vila Olímpia, São Paulo", status: "lancamento", statusLabel: "Lançamento", unidades: 48, disponiveis: 12, entrega: 2026, icon: "🏢" },
  { id: 2, nome: "Residencial Alphaville II", loc: "Barueri, SP", status: "obras", statusLabel: "Em obras", unidades: 24, disponiveis: 8, entrega: 2025, icon: "🏡" },
  { id: 3, nome: "Vila das Artes", loc: "Pinheiros, São Paulo", status: "pronto", statusLabel: "Pronto para morar", unidades: 16, disponiveis: 3, entrega: 2024, icon: "🌿" },
  { id: 4, nome: "Condomínio Serra Verde", loc: "São Roque, SP", status: "breve", statusLabel: "Breve lançamento", unidades: 32, disponiveis: 32, entrega: 2027, icon: "🏔" },
  { id: 5, nome: "Moema Prime", loc: "Moema, São Paulo", status: "obras", statusLabel: "Em obras", unidades: 20, disponiveis: 7, entrega: 2026, icon: "🏙" },
  { id: 6, nome: "Riviera Club", loc: "Bertioga, SP", status: "pronto", statusLabel: "Pronto para morar", unidades: 60, disponiveis: 5, entrega: 2023, icon: "🌊" },
];

const badgeStyle: Record<string, React.CSSProperties> = {
  lancamento: { background: "rgba(45,89,134,0.9)", color: "#fff" },
  obras: { background: "rgba(212,144,10,0.9)", color: "#fff" },
  pronto: { background: "rgba(61,170,111,0.9)", color: "#fff" },
  breve: { background: "rgba(201,169,110,0.9)", color: "#0D1B2A" },
};

export default function AdminEmpreendimentosPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filtered = empreendimentos.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.nome.toLowerCase().includes(q) || e.loc.toLowerCase().includes(q);
    const matchStatus = !filterStatus || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ maxWidth: "1200px" }}>

      {/* FILTROS */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--neutral-400)", fontSize: "15px" }}>🔍</span>
          <input
            type="text"
            placeholder="Buscar empreendimento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "10px 16px 10px 40px", border: "1px solid var(--neutral-200)", borderRadius: "8px", fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--neutral-900)", background: "#fff", outline: "none", cursor: "text" }}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: "10px 14px", border: "1px solid var(--neutral-200)", borderRadius: "8px", fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--neutral-600)", background: "#fff", outline: "none", cursor: "pointer" }}
        >
          <option value="">Todos os status</option>
          <option value="lancamento">Lançamento</option>
          <option value="obras">Em obras</option>
          <option value="pronto">Pronto para morar</option>
          <option value="breve">Breve lançamento</option>
        </select>
      </div>

      {/* GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))", gap: "20px" }}>
        {filtered.map((emp) => (
          <div key={emp.id}
            onClick={() => { window.location.href = `/admin/empreendimentos/${emp.id}/editar`; }}
            style={{ background: "#fff", border: "1px solid var(--neutral-200)", borderRadius: "12px", overflow: "hidden", cursor: "pointer", transition: "border-color .3s, box-shadow .3s" }}
            className="admin-emp-card"
          >
            {/* COVER */}
            <div style={{ height: "160px", background: "linear-gradient(135deg,var(--navy-800),var(--navy-700))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.3))" }} />
              <span style={{ position: "relative", zIndex: 1 }}>{emp.icon}</span>
              <span style={{ position: "absolute", top: "12px", right: "12px", zIndex: 1, fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px", fontFamily: "var(--font-sans)", ...badgeStyle[emp.status] }}>
                {emp.statusLabel}
              </span>
            </div>

            {/* BODY */}
            <div style={{ padding: "20px" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "17px", fontWeight: 600, color: "var(--neutral-900)", marginBottom: "4px" }}>{emp.nome}</div>
              <div style={{ fontSize: "13px", color: "var(--neutral-400)", marginBottom: "14px", display: "flex", alignItems: "center", gap: "4px", fontFamily: "var(--font-sans)" }}>
                📍 {emp.loc}
              </div>

              {/* STATS */}
              <div style={{ display: "flex", gap: "16px", paddingTop: "14px", borderTop: "1px solid var(--neutral-100)" }}>
                {[{ n: emp.unidades, l: "Unidades" }, { n: emp.disponiveis, l: "Disponíveis" }, { n: emp.entrega, l: "Entrega" }].map((s) => (
                  <div key={s.l} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--neutral-900)", fontFamily: "var(--font-serif)" }}>{s.n}</div>
                    <div style={{ fontSize: "11px", color: "var(--neutral-400)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "2px", fontFamily: "var(--font-sans)" }}>{s.l}</div>
                  </div>
                ))}
              </div>

              {/* AÇÕES */}
              <div style={{ display: "flex", gap: "8px", marginTop: "14px" }} onClick={(e) => e.stopPropagation()}>
                <Link href={`/admin/empreendimentos/${emp.id}/editar`} style={{ flex: 1, padding: "8px", border: "1px solid var(--neutral-200)", borderRadius: "8px", fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500, color: "var(--neutral-600)", textAlign: "center", textDecoration: "none", display: "block" }}>✏️ Editar</Link>
                <Link href={`/empreendimentos/${emp.id}`} target="_blank" style={{ flex: 1, padding: "8px", border: "1px solid var(--neutral-200)", borderRadius: "8px", fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500, color: "var(--neutral-600)", textAlign: "center", textDecoration: "none", display: "block" }}>↗ Ver no site</Link>
                <button style={{ flex: 1, padding: "8px", border: "1px solid var(--neutral-200)", borderRadius: "8px", fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500, color: "var(--neutral-600)", background: "none", cursor: "pointer" }}>🗑</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
