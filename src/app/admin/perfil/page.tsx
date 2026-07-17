"use client";

import { useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid var(--neutral-200)", borderRadius: "12px", overflow: "hidden", marginBottom: "20px" };
const cardHeader: React.CSSProperties = { padding: "20px 24px", borderBottom: "1px solid var(--neutral-100)" };
const cardBody: React.CSSProperties = { padding: "24px" };
const cardTitle: React.CSSProperties = { fontSize: "15px", fontWeight: 600, color: "var(--neutral-900)", fontFamily: "var(--font-sans)" };
const cardSub: React.CSSProperties = { fontSize: "13px", color: "var(--neutral-400)", marginTop: "3px", fontFamily: "var(--font-sans)" };
const fieldLabel: React.CSSProperties = { display: "block", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--neutral-400)", marginBottom: "8px", fontFamily: "var(--font-sans)" };
const fieldInput: React.CSSProperties = { width: "100%", padding: "11px 14px", border: "1px solid var(--neutral-200)", borderRadius: "8px", fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--neutral-900)", background: "#fff", outline: "none" };

const initEspecs = ["Alto padrão", "Imóveis residenciais", "Empreendimentos", "Investimentos imobiliários", "Imóveis na planta", "Condomínios fechados"];

export default function AdminPerfilPage() {
  const [especs, setEspecs] = useState(initEspecs);
  const [novaEspec, setNovaEspec] = useState("");
  const [showToast, setShowToast] = useState(false);

  const addEspec = () => {
    if (!novaEspec.trim()) return;
    setEspecs([...especs, novaEspec.trim()]);
    setNovaEspec("");
  };

  const removeEspec = (i: number) => setEspecs(especs.filter((_, idx) => idx !== i));

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      {showToast && (
        <div style={{ position: "fixed", bottom: "32px", right: "32px", background: "var(--navy-900)", color: "#fff", padding: "16px 24px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", zIndex: 200, borderLeft: "4px solid var(--gold-500)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
          ✅ <span>Perfil atualizado com sucesso!</span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px", alignItems: "start", maxWidth: "1200px" }} className="admin-form-grid">

        {/* COLUNA PRINCIPAL */}
        <div>

          {/* FOTO */}
          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Foto de perfil</div>
              <div style={cardSub}>Aparece na home, na página Sobre e nos resultados de busca</div>
            </div>
            <div style={cardBody}>
              <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                <div style={{ width: "96px", height: "96px", borderRadius: "50%", background: "linear-gradient(135deg,var(--navy-700),var(--navy-500))", border: "3px solid var(--gold-500)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", fontWeight: 700, color: "var(--gold-400)", fontFamily: "var(--font-serif)", flexShrink: 0 }}>
                  CM
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <button style={{ padding: "9px 18px", background: "linear-gradient(135deg,var(--gold-500),var(--gold-400))", border: "none", borderRadius: "8px", fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600, color: "var(--navy-900)", cursor: "pointer" }}>
                    📸 Alterar foto
                  </button>
                  <button style={{ padding: "9px 18px", border: "1px solid var(--neutral-200)", borderRadius: "8px", background: "none", fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--neutral-400)", cursor: "pointer" }}>
                    Remover foto
                  </button>
                  <div style={{ fontSize: "12px", color: "var(--neutral-400)", fontFamily: "var(--font-sans)" }}>JPG ou PNG, mín. 400×400px, até 5MB</div>
                </div>
              </div>
            </div>
          </div>

          {/* DADOS PESSOAIS */}
          <div style={card}>
            <div style={cardHeader}><div style={cardTitle}>Dados pessoais</div></div>
            <div style={cardBody}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <label style={fieldLabel}>Nome completo <span style={{ color: "var(--gold-500)" }}>*</span></label>
                  <input type="text" style={fieldInput} defaultValue="Carlos Mendes" />
                </div>
                <div>
                  <label style={fieldLabel}>CRECI <span style={{ color: "var(--gold-500)" }}>*</span></label>
                  <input type="text" style={fieldInput} defaultValue="12345-SP" />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <label style={fieldLabel}>WhatsApp <span style={{ color: "var(--gold-500)" }}>*</span></label>
                  <input type="text" style={fieldInput} defaultValue="(11) 99999-0000" />
                </div>
                <div>
                  <label style={fieldLabel}>E-mail de contato</label>
                  <input type="email" style={fieldInput} defaultValue="carlos@carlosmendes.com.br" />
                </div>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={fieldLabel}>Área de atuação</label>
                <input type="text" style={fieldInput} defaultValue="São Paulo · Grande SP · Interior SP" />
                <div style={{ fontSize: "12px", color: "var(--neutral-400)", marginTop: "6px", fontFamily: "var(--font-sans)" }}>Exibido na página Sobre. Separe regiões com ·</div>
              </div>
              <div>
                <label style={fieldLabel}>Tempo de experiência</label>
                <input type="text" style={fieldInput} defaultValue="12 anos de experiência no mercado imobiliário" />
              </div>
            </div>
          </div>

          {/* BIO */}
          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Biografia</div>
              <div style={cardSub}>Apresentação que aparece na página Sobre e na home</div>
            </div>
            <div style={cardBody}>
              <div style={{ marginBottom: "20px" }}>
                <label style={fieldLabel}>Texto curto (home)</label>
                <textarea style={{ ...fieldInput, resize: "vertical", minHeight: "90px", lineHeight: "1.6" }} defaultValue="Especialista em imóveis de alto padrão em São Paulo e Grande SP. Com 12 anos de experiência, ofereço atendimento personalizado para encontrar o imóvel ideal para você e sua família." />
                <div style={{ fontSize: "12px", color: "var(--neutral-400)", marginTop: "6px", fontFamily: "var(--font-sans)" }}>Máximo 200 caracteres. Aparece na seção hero da home.</div>
              </div>
              <div>
                <label style={fieldLabel}>Biografia completa (página Sobre)</label>
                <textarea style={{ ...fieldInput, resize: "vertical", minHeight: "160px", lineHeight: "1.6" }} defaultValue={`Carlos Mendes é corretor de imóveis certificado pelo CRECI-SP com 12 anos de atuação no mercado imobiliário paulistano. Formado em Administração pela FGV, especializou-se no segmento de alto padrão, tendo intermediado mais de 400 transações imobiliárias ao longo de sua carreira.

Seu diferencial está no atendimento consultivo: antes de apresentar qualquer imóvel, Carlos realiza uma análise detalhada das necessidades, do estilo de vida e dos objetivos financeiros de cada cliente.

Atua principalmente nos bairros Jardins, Moema, Vila Olímpia, Pinheiros e Alphaville.`} />
              </div>
            </div>
          </div>

          {/* ESPECIALIDADES */}
          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Especialidades</div>
              <div style={cardSub}>Tags exibidas na página Sobre</div>
            </div>
            <div style={cardBody}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                {especs.map((esp, i) => (
                  <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.25)", borderRadius: "20px", fontSize: "13px", color: "var(--neutral-900)", fontFamily: "var(--font-sans)" }}>
                    {esp}
                    <button onClick={() => removeEspec(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--neutral-400)", fontSize: "14px", lineHeight: 1, padding: 0 }}>✕</button>
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  value={novaEspec}
                  onChange={(e) => setNovaEspec(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") addEspec(); }}
                  placeholder="Nova especialidade..."
                  style={{ flex: 1, padding: "9px 14px", border: "1px solid var(--neutral-200)", borderRadius: "8px", fontFamily: "var(--font-sans)", fontSize: "13px", outline: "none" }}
                />
                <button onClick={addEspec} style={{ padding: "9px 16px", border: "1px solid var(--gold-500)", borderRadius: "8px", background: "none", fontSize: "13px", color: "var(--gold-500)", cursor: "pointer", fontFamily: "var(--font-sans)", whiteSpace: "nowrap" }}>
                  + Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA LATERAL */}
        <div>

          {/* PREVIEW */}
          <div style={{ background: "var(--navy-900)", borderRadius: "12px", overflow: "hidden", marginBottom: "16px" }}>
            <div style={{ padding: "24px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "linear-gradient(135deg,var(--navy-700),var(--navy-500))", border: "2px solid var(--gold-500)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: 700, color: "var(--gold-400)", fontFamily: "var(--font-serif)", margin: "0 auto 12px" }}>CM</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 600, color: "#fff" }}>Carlos Mendes</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginTop: "4px", fontFamily: "var(--font-sans)" }}>CRECI 12345-SP</div>
            </div>
            <div style={{ padding: "16px 20px" }}>
              {[
                { icon: "📱", val: "(11) 99999-0000" },
                { icon: "✉", val: "carlos@carlosmendes.com.br" },
                { icon: "📍", val: "São Paulo · Grande SP" },
                { icon: "🏆", val: "12 anos de experiência" },
              ].map((row) => (
                <div key={row.val} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: "13px", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-sans)" }}>
                  {row.icon} <strong style={{ color: "var(--gold-400)", fontWeight: 500 }}>{row.val}</strong>
                </div>
              ))}
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "var(--neutral-400)", textAlign: "center", marginBottom: "16px", marginTop: "-8px", fontFamily: "var(--font-sans)" }}>Prévia do card no site</div>

          {/* REDES SOCIAIS */}
          <div style={{ ...card, marginBottom: "16px" }}>
            <div style={{ ...cardHeader, padding: "16px 20px" }}><div style={cardTitle}>Redes sociais</div></div>
            <div style={{ padding: "20px" }}>
              <div style={{ marginBottom: "20px" }}>
                <label style={fieldLabel}>Instagram</label>
                <input type="text" style={fieldInput} placeholder="@seuusuario" defaultValue="@carlosmendes.imoveis" />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={fieldLabel}>LinkedIn</label>
                <input type="text" style={fieldInput} placeholder="linkedin.com/in/..." defaultValue="" />
              </div>
              <div>
                <label style={fieldLabel}>YouTube / Canal</label>
                <input type="text" style={fieldInput} placeholder="youtube.com/..." defaultValue="" />
              </div>
            </div>
          </div>

          {/* SEGURANÇA */}
          <div style={{ ...card, marginBottom: "16px" }}>
            <div style={{ ...cardHeader, padding: "16px 20px" }}><div style={cardTitle}>Segurança</div></div>
            <div style={{ padding: "4px 20px" }}>
              {[
                { label: "E-mail de acesso", sub: "carlos@carlosmendes.com.br" },
                { label: "Senha", sub: "Última alteração: 3 meses atrás" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid var(--neutral-100)" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--neutral-900)", fontFamily: "var(--font-sans)" }}>{item.label}</div>
                    <div style={{ fontSize: "12px", color: "var(--neutral-400)", marginTop: "2px", fontFamily: "var(--font-sans)" }}>{item.sub}</div>
                  </div>
                  <button style={{ padding: "7px 14px", border: "1px solid var(--neutral-200)", borderRadius: "8px", background: "none", fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500, color: "var(--neutral-600)", cursor: "pointer" }}>Alterar</button>
                </div>
              ))}
            </div>
          </div>

          {/* SALVAR */}
          <button id="topbar-salvar" onClick={handleSave} style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg,var(--gold-500),var(--gold-400))", border: "none", borderRadius: "8px", fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600, color: "var(--navy-900)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            Salvar alterações
          </button>
        </div>
      </div>
    </>
  );
}
