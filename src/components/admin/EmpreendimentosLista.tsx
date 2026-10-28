"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { urlFoto } from "@/lib/imoveis";
import { corStatusEmp, localEmp, metragemEmp, statusEmpLabel, type Empreendimento, type StatusEmpreendimento } from "@/lib/empreendimentos";
import { excluirEmpreendimento } from "@/app/admin/(painel)/empreendimentos/acoes";
import { ConfirmDialog, useToast } from "@/components/admin/ui";

const acao: React.CSSProperties = { flex: 1, padding: "8px", border: "1px solid var(--neutral-200)", borderRadius: "8px", fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500, color: "var(--neutral-600)", textAlign: "center", textDecoration: "none", display: "block", background: "none", cursor: "pointer" };

// Lista de empreendimentos do painel (admin e assistente veem todos).
export default function EmpreendimentosLista({ empreendimentos }: { empreendimentos: Empreendimento[] }) {
  const router = useRouter();
  const { toast, mostrar } = useToast();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [excluindo, setExcluindo] = useState<Empreendimento | null>(null);

  const filtrados = empreendimentos.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.nome.toLowerCase().includes(q) || localEmp(e).toLowerCase().includes(q) || e.construtora.toLowerCase().includes(q);
    return matchSearch && (!filterStatus || e.status === filterStatus);
  });

  const excluir = async (emp: Empreendimento) => {
    setExcluindo(null);
    const { erro } = await excluirEmpreendimento(emp.id);
    if (erro) {
      mostrar(erro, true);
      return;
    }
    mostrar("Empreendimento excluído");
    router.refresh();
  };

  return (
    <div style={{ maxWidth: "1200px" }}>
      {toast}
      {excluindo && (
        <ConfirmDialog
          titulo="Excluir empreendimento?"
          texto={`"${excluindo.nome}" e as fotos dele serão excluídos do site. Isso não pode ser desfeito.`}
          confirmar="Excluir"
          onConfirmar={() => excluir(excluindo)}
          onCancelar={() => setExcluindo(null)}
        />
      )}

      {/* FILTROS */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--neutral-400)", fontSize: "15px" }}>🔍</span>
          <input
            type="text"
            placeholder="Buscar por nome, bairro ou construtora..."
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
          <option value="">Todas as situações</option>
          {(Object.keys(statusEmpLabel) as StatusEmpreendimento[]).map((st) => <option key={st} value={st}>{statusEmpLabel[st]}</option>)}
        </select>
      </div>

      {filtrados.length === 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--neutral-200)", borderRadius: "12px", padding: "48px 24px", textAlign: "center", fontSize: "14px", color: "var(--neutral-400)", fontFamily: "var(--font-sans)" }}>
          {empreendimentos.length ? "Nenhum empreendimento encontrado." : "Nenhum empreendimento cadastrado ainda."}{" "}
          <Link href="/admin/empreendimentos/novo" style={{ color: "var(--gold-500)", fontWeight: 500 }}>Cadastrar empreendimento</Link>
        </div>
      )}

      {/* GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))", gap: "20px" }}>
        {filtrados.map((emp) => {
          const resumo = [metragemEmp(emp), emp.tipologias].filter(Boolean).join(" · ");
          return (
            <div key={emp.id}
              onClick={() => router.push(`/admin/empreendimentos/${emp.id}/editar`)}
              style={{ background: "#fff", border: "1px solid var(--neutral-200)", borderRadius: "12px", overflow: "hidden", cursor: "pointer", transition: "border-color .3s, box-shadow .3s" }}
              className="admin-emp-card"
            >
              {/* CAPA */}
              <div style={{ height: "170px", background: "linear-gradient(135deg,var(--navy-800),var(--navy-700))", position: "relative", overflow: "hidden" }}>
                {emp.capa ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={urlFoto(emp.capa, "p")} alt={emp.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", opacity: 0.5 }}>🏗</div>
                )}
                <span style={{ position: "absolute", top: "12px", right: "12px", fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px", fontFamily: "var(--font-sans)", background: corStatusEmp[emp.status], color: "#fff" }}>
                  {statusEmpLabel[emp.status]}
                </span>
                {!emp.visivel && (
                  <span style={{ position: "absolute", top: "12px", left: "12px", fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px", fontFamily: "var(--font-sans)", background: "rgba(0,0,0,0.65)", color: "#fff" }}>Fora do site</span>
                )}
                {emp.destaque && (
                  <span style={{ position: "absolute", bottom: "12px", left: "12px", fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px", fontFamily: "var(--font-sans)", background: "var(--gold-500)", color: "#fff" }}>★ Destaque</span>
                )}
              </div>

              {/* DADOS */}
              <div style={{ padding: "20px" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "17px", fontWeight: 600, color: "var(--neutral-900)", marginBottom: "4px" }}>{emp.nome}</div>
                <div style={{ fontSize: "13px", color: "var(--neutral-400)", marginBottom: "4px", fontFamily: "var(--font-sans)" }}>
                  {localEmp(emp) ? `📍 ${localEmp(emp)}` : "Sem localização"}
                </div>
                {(resumo || emp.construtora) && (
                  <div style={{ fontSize: "13px", color: "var(--neutral-600)", fontFamily: "var(--font-sans)" }}>{[emp.construtora, resumo].filter(Boolean).join(" · ")}</div>
                )}

                {/* AÇÕES */}
                <div style={{ display: "flex", gap: "8px", marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--neutral-100)" }} onClick={(e) => e.stopPropagation()}>
                  <Link href={`/admin/empreendimentos/${emp.id}/editar`} style={acao}>✏️ Editar</Link>
                  {emp.visivel && <Link href={`/empreendimentos/${emp.id}`} target="_blank" style={acao}>↗ Ver no site</Link>}
                  <button onClick={() => setExcluindo(emp)} title="Excluir" style={acao}>🗑</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
