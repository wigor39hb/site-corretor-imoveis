"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSessao } from "@/context/SessaoContext";
import { empreendimentosMock } from "@/lib/mock/publicacoes";
import { AcessoRestrito, ConfirmDialog, useToast } from "@/components/admin/ui";


const badgeStyle: Record<string, React.CSSProperties> = {
  lancamento: { background: "rgba(45,89,134,0.9)", color: "#fff" },
  obras: { background: "rgba(212,144,10,0.9)", color: "#fff" },
  pronto: { background: "rgba(61,170,111,0.9)", color: "#fff" },
  breve: { background: "rgba(201,169,110,0.9)", color: "#0D1B2A" },
};

export default function AdminEmpreendimentosPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const { cuidaDeEmpreendimentos } = useSessao();
  const router = useRouter();
  const { toast, mostrar } = useToast();
  const [todos, setTodos] = useState(empreendimentosMock);
  const [excluindo, setExcluindo] = useState<{ id: number; nome: string } | null>(null);

  // Empreendimentos são só de administradores e assistentes (decisão de 26/10).
  if (!cuidaDeEmpreendimentos) return <AcessoRestrito texto="Esta área é exclusiva dos administradores e assistentes da imobiliária." />;

  const filtered = todos.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.nome.toLowerCase().includes(q) || e.loc.toLowerCase().includes(q);
    const matchStatus = !filterStatus || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ maxWidth: "1200px" }}>
      {toast}
      {excluindo && (
        <ConfirmDialog
          titulo="Excluir empreendimento?"
          texto={`"${excluindo.nome}" e as fotos dele serão excluídos do site. Isso não pode ser desfeito.`}
          confirmar="Excluir"
          onConfirmar={() => {
            setTodos(todos.filter((e) => e.id !== excluindo.id));
            setExcluindo(null);
            mostrar("Empreendimento excluído");
          }}
          onCancelar={() => setExcluindo(null)}
        />
      )}

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

      {filtered.length === 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--neutral-200)", borderRadius: "12px", padding: "48px 24px", textAlign: "center", fontSize: "14px", color: "var(--neutral-400)", fontFamily: "var(--font-sans)" }}>
          Nenhum empreendimento encontrado.{" "}
          <Link href="/admin/empreendimentos/novo" style={{ color: "var(--gold-500)", fontWeight: 500 }}>Cadastrar empreendimento</Link>
        </div>
      )}

      {/* GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))", gap: "20px" }}>
        {filtered.map((emp) => (
          <div key={emp.id}
            onClick={() => router.push(`/admin/empreendimentos/${emp.id}/editar`)}
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
                <button onClick={() => setExcluindo({ id: emp.id, nome: emp.nome })} title="Excluir" style={{ flex: 1, padding: "8px", border: "1px solid var(--neutral-200)", borderRadius: "8px", fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500, color: "var(--neutral-600)", background: "none", cursor: "pointer" }}>🗑</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
