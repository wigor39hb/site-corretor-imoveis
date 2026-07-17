"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = "lancamento" | "obras" | "pronto" | "breve";

const statusOpts: { value: Status; label: string; dot: string }[] = [
  { value: "lancamento", label: "Lançamento", dot: "#2D5986" },
  { value: "obras", label: "Em obras", dot: "#D4900A" },
  { value: "pronto", label: "Pronto para morar", dot: "#3DAA6F" },
  { value: "breve", label: "Breve lançamento", dot: "#C9A96E" },
];

const card: React.CSSProperties = { background: "#fff", border: "1px solid var(--neutral-200)", borderRadius: "12px", overflow: "hidden", marginBottom: "20px" };
const cardHeader: React.CSSProperties = { padding: "20px 24px", borderBottom: "1px solid var(--neutral-100)" };
const cardBody: React.CSSProperties = { padding: "24px" };
const cardTitle: React.CSSProperties = { fontSize: "15px", fontWeight: 600, color: "var(--neutral-900)", fontFamily: "var(--font-sans)" };
const cardSub: React.CSSProperties = { fontSize: "13px", color: "var(--neutral-400)", marginTop: "3px", fontFamily: "var(--font-sans)" };
const fieldLabel: React.CSSProperties = { display: "block", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--neutral-400)", marginBottom: "8px", fontFamily: "var(--font-sans)" };
const fieldInput: React.CSSProperties = { width: "100%", padding: "11px 14px", border: "1px solid var(--neutral-200)", borderRadius: "8px", fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--neutral-900)", background: "#fff", outline: "none" };

const Toggle = ({ label, sub, defaultOn = false }: { label: string; sub: string; defaultOn?: boolean }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--neutral-100)" }}>
      <div>
        <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--neutral-900)", fontFamily: "var(--font-sans)" }}>{label}</div>
        <div style={{ fontSize: "12px", color: "var(--neutral-400)", marginTop: "2px", fontFamily: "var(--font-sans)" }}>{sub}</div>
      </div>
      <div onClick={() => setOn(!on)} style={{ position: "relative", width: "44px", height: "24px", borderRadius: "24px", background: on ? "var(--gold-500)" : "var(--neutral-200)", cursor: "pointer", transition: "background .3s", flexShrink: 0 }}>
        <div style={{ position: "absolute", width: "18px", height: "18px", borderRadius: "50%", background: "#fff", top: "3px", left: on ? "23px" : "3px", transition: "left .3s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
      </div>
    </div>
  );
};

export default function AdminEmpreendimentoEditarPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("lancamento");
  const [diferenciais, setDiferenciais] = useState([
    "🏊 Piscina com borda infinita",
    "🏋 Academia equipada",
    "🌳 Área verde com 5.000m²",
    "🔐 Segurança 24h com portaria blindada",
    "🚗 3 vagas por unidade",
  ]);
  const [showToast, setShowToast] = useState(false);

  const addDiferencial = () => setDiferenciais([...diferenciais, ""]);
  const removeDiferencial = (i: number) => setDiferenciais(diferenciais.filter((_, idx) => idx !== i));
  const updateDiferencial = (i: number, val: string) => setDiferenciais(diferenciais.map((d, idx) => idx === i ? val : d));

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => { router.push("/admin/empreendimentos"); }, 2000);
  };

  return (
    <>
      {showToast && (
        <div style={{ position: "fixed", bottom: "32px", right: "32px", background: "var(--navy-900)", color: "#fff", padding: "16px 24px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", zIndex: 200, borderLeft: "4px solid var(--gold-500)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
          ✅ <span>Empreendimento atualizado com sucesso!</span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px", alignItems: "start", maxWidth: "1200px" }} className="admin-form-grid">

        <div>
          <div style={card}>
            <div style={cardHeader}><div style={cardTitle}>Informações básicas</div></div>
            <div style={cardBody}>
              <div style={{ marginBottom: "20px" }}>
                <label style={fieldLabel}>Nome do empreendimento <span style={{ color: "var(--gold-500)" }}>*</span></label>
                <input type="text" style={fieldInput} defaultValue="Grand Tower" />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={fieldLabel}>Descrição completa <span style={{ color: "var(--gold-500)" }}>*</span></label>
                <textarea style={{ ...fieldInput, resize: "vertical", minHeight: "120px", lineHeight: "1.6" }} defaultValue="O Grand Tower é um empreendimento de alto padrão localizado na Vila Olímpia." />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div><label style={fieldLabel}>Construtora</label><input type="text" style={fieldInput} defaultValue="Construtora Excellence" /></div>
                <div><label style={fieldLabel}>Ano de entrega</label><input type="text" style={fieldInput} defaultValue="2026" /></div>
              </div>
            </div>
          </div>

          <div style={card}>
            <div style={cardHeader}><div style={cardTitle}>Imagem de capa</div><div style={cardSub}>Aparece no card e no topo da página</div></div>
            <div style={cardBody}>
              <div style={{ border: "2px dashed var(--neutral-200)", borderRadius: "12px", height: "160px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer" }}>
                <div style={{ fontSize: "32px" }}>🖼</div>
                <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--neutral-900)", fontFamily: "var(--font-sans)" }}>Alterar imagem de capa</div>
                <div style={{ fontSize: "12px", color: "var(--neutral-400)", fontFamily: "var(--font-sans)" }}>ou <span style={{ color: "var(--gold-500)" }}>clique para selecionar</span></div>
              </div>
            </div>
          </div>

          <div style={card}>
            <div style={cardHeader}><div style={cardTitle}>Galeria de fotos</div></div>
            <div style={cardBody}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px" }}>
                {["🏢", "🏊", "🌳", "🏋", "🍽"].map((icon, i) => (
                  <div key={i} style={{ aspectRatio: "4/3", borderRadius: "8px", background: "var(--neutral-100)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", border: "1px solid var(--neutral-200)" }}>{icon}</div>
                ))}
                <div style={{ aspectRatio: "4/3", borderRadius: "8px", border: "2px dashed var(--neutral-200)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: "var(--neutral-400)", cursor: "pointer" }}>+</div>
              </div>
            </div>
          </div>

          <div style={card}>
            <div style={cardHeader}><div style={cardTitle}>Localização</div></div>
            <div style={cardBody}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div><label style={fieldLabel}>Cidade <span style={{ color: "var(--gold-500)" }}>*</span></label><input type="text" style={fieldInput} defaultValue="São Paulo" /></div>
                <div><label style={fieldLabel}>Bairro</label><input type="text" style={fieldInput} defaultValue="Vila Olímpia" /></div>
              </div>
              <div><label style={fieldLabel}>Endereço completo</label><input type="text" style={fieldInput} defaultValue="Av. Brigadeiro Faria Lima, 3900" /></div>
            </div>
          </div>

          <div style={card}>
            <div style={cardHeader}><div style={cardTitle}>Diferenciais</div></div>
            <div style={cardBody}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {diferenciais.map((d, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input type="text" value={d} onChange={(e) => updateDiferencial(i, e.target.value)}
                      style={{ flex: 1, padding: "10px 14px", border: "1px solid var(--neutral-200)", borderRadius: "8px", fontFamily: "var(--font-sans)", fontSize: "14px", outline: "none" }} />
                    <button onClick={() => removeDiferencial(i)} style={{ width: "32px", height: "32px", border: "1px solid var(--neutral-200)", borderRadius: "8px", background: "none", cursor: "pointer", color: "var(--neutral-400)", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                  </div>
                ))}
              </div>
              <button onClick={addDiferencial} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 14px", border: "1px dashed var(--neutral-200)", borderRadius: "8px", background: "none", fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--neutral-400)", cursor: "pointer", marginTop: "10px", width: "100%" }}>
                + Adicionar diferencial
              </button>
            </div>
          </div>
        </div>

        <div>
          <div style={{ ...card, marginBottom: "16px" }}>
            <div style={{ ...cardHeader, padding: "16px 20px" }}><div style={cardTitle}>Status</div></div>
            <div style={{ padding: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {statusOpts.map((opt) => (
                  <label key={opt.value} onClick={() => setStatus(opt.value)} style={{
                    padding: "12px 14px", border: `1px solid ${status === opt.value ? opt.dot : "var(--neutral-200)"}`,
                    borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px",
                    background: status === opt.value ? `${opt.dot}18` : "transparent", transition: "all .2s",
                  }}>
                    <input type="radio" name="status" value={opt.value} checked={status === opt.value} onChange={() => setStatus(opt.value)} style={{ display: "none" }} />
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: opt.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--neutral-900)", fontFamily: "var(--font-sans)" }}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div style={{ ...card, marginBottom: "16px" }}>
            <div style={{ ...cardHeader, padding: "16px 20px" }}><div style={cardTitle}>Unidades</div></div>
            <div style={{ padding: "20px" }}>
              <div style={{ marginBottom: "20px" }}>
                <label style={fieldLabel}>Total de unidades</label>
                <input type="number" style={fieldInput} defaultValue={48} min={1} />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={fieldLabel}>Tipologias disponíveis</label>
                <input type="text" style={fieldInput} defaultValue="2, 3 e 4 suítes" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div><label style={fieldLabel}>Área mín. (m²)</label><input type="number" style={fieldInput} defaultValue={75} /></div>
                <div><label style={fieldLabel}>Área máx. (m²)</label><input type="number" style={fieldInput} defaultValue={220} /></div>
              </div>
            </div>
          </div>

          <div style={{ ...card, marginBottom: "16px" }}>
            <div style={{ ...cardHeader, padding: "16px 20px" }}><div style={cardTitle}>Publicação</div></div>
            <div style={{ padding: "20px" }}>
              <Toggle label="Em destaque" sub="Aparece na home do site" defaultOn={true} />
              <Toggle label="Visível no site" sub="Desmarque para rascunho" defaultOn={true} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button id="topbar-publicar" onClick={handleSave} style={{ padding: "13px", background: "linear-gradient(135deg,var(--gold-500),var(--gold-400))", border: "none", borderRadius: "8px", fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600, color: "var(--navy-900)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              Salvar alterações
            </button>
            <a href="/admin/empreendimentos" style={{ padding: "11px", border: "1px solid var(--neutral-200)", borderRadius: "8px", fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 500, color: "var(--neutral-600)", background: "none", textAlign: "center", textDecoration: "none", display: "block" }}>
              Cancelar
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
