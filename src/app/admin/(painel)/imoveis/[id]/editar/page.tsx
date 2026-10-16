"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSessao } from "@/context/SessaoContext";
import { imoveisMock } from "@/lib/mock/publicacoes";

type Imovel = (typeof imoveisMock)[number];
import CorretorResponsavelCampo, { PublicacaoDeOutroCorretor, PublicacaoNaoEncontrada } from "@/components/admin/CorretorResponsavelCampo";

type Status = "disponivel" | "reservado" | "vendido" | "lancamento";

const statusOpts: { value: Status; label: string; dot: string }[] = [
  { value: "disponivel", label: "Disponível", dot: "#3DAA6F" },
  { value: "reservado", label: "Reservado", dot: "#D4900A" },
  { value: "vendido", label: "Vendido", dot: "#E05252" },
  { value: "lancamento", label: "Lançamento", dot: "#2D5986" },
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
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
      <div>
        <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--neutral-900)", fontFamily: "var(--font-sans)" }}>{label}</div>
        <div style={{ fontSize: "12px", color: "var(--neutral-400)", marginTop: "3px", fontFamily: "var(--font-sans)" }}>{sub}</div>
      </div>
      <div onClick={() => setOn(!on)} style={{ position: "relative", width: "44px", height: "24px", borderRadius: "24px", background: on ? "var(--gold-500)" : "var(--neutral-200)", cursor: "pointer", transition: "background .3s", flexShrink: 0 }}>
        <div style={{ position: "absolute", width: "18px", height: "18px", borderRadius: "50%", background: "#fff", top: "3px", left: on ? "23px" : "3px", transition: "left .3s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
      </div>
    </div>
  );
};

function ImovelEditarForm({ imovel }: { imovel: Imovel }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>(imovel.status as Status);
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => { router.push("/admin/imoveis"); }, 2000);
  };

  return (
    <>
      {showToast && (
        <div style={{ position: "fixed", bottom: "32px", right: "32px", background: "var(--navy-900)", color: "#fff", padding: "16px 24px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", zIndex: 200, borderLeft: "4px solid var(--gold-500)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
          ✅ <span>Imóvel atualizado com sucesso!</span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px", alignItems: "start", maxWidth: "1200px" }} className="admin-form-grid">

        <div>
          <div style={card}>
            <div style={cardHeader}><div style={cardTitle}>Informações básicas</div><div style={cardSub}>Dados principais do imóvel</div></div>
            <div style={cardBody}>
              <div style={{ marginBottom: "20px" }}>
                <label style={fieldLabel}>Título do anúncio <span style={{ color: "var(--gold-500)" }}>*</span></label>
                <input type="text" style={fieldInput} defaultValue={imovel.nome} />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={fieldLabel}>Descrição completa <span style={{ color: "var(--gold-500)" }}>*</span></label>
                <textarea style={{ ...fieldInput, resize: "vertical", minHeight: "120px", lineHeight: "1.6" }} defaultValue="Excelente apartamento localizado no coração do Jardins, um dos bairros mais valorizados de São Paulo." />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div><label style={fieldLabel}>Tipo <span style={{ color: "var(--gold-500)" }}>*</span></label>
                  <select style={fieldInput} defaultValue={imovel.tipo}><option>Apartamento</option><option>Casa</option><option>Studio</option><option>Cobertura</option><option>Terreno</option><option>Comercial</option></select></div>
                <div><label style={fieldLabel}>Finalidade</label>
                  <select style={fieldInput}><option>Venda</option><option>Aluguel</option><option>Venda e Aluguel</option></select></div>
              </div>
            </div>
          </div>

          <div style={card}>
            <div style={cardHeader}><div style={cardTitle}>Fotos</div><div style={cardSub}>A primeira foto será a capa do imóvel</div></div>
            <div style={cardBody}>
              <div style={{ border: "2px dashed var(--neutral-200)", borderRadius: "12px", padding: "40px 24px", textAlign: "center", cursor: "pointer" }}>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>📸</div>
                <div style={{ fontSize: "15px", fontWeight: 500, color: "var(--neutral-900)", fontFamily: "var(--font-sans)", marginBottom: "6px" }}>Arraste as fotos aqui</div>
                <div style={{ fontSize: "13px", color: "var(--neutral-400)", fontFamily: "var(--font-sans)" }}>ou <span style={{ color: "var(--gold-500)", fontWeight: 500 }}>clique para selecionar</span></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px", marginTop: "16px" }}>
                {["🏠", "🛋", "🛁", "🍽"].map((icon, i) => (
                  <div key={i} style={{ aspectRatio: "4/3", borderRadius: "8px", background: "var(--neutral-100)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", border: "1px solid var(--neutral-200)" }}>{icon}</div>
                ))}
                <div style={{ aspectRatio: "4/3", borderRadius: "8px", border: "2px dashed var(--neutral-200)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "24px", color: "var(--neutral-400)", cursor: "pointer" }}>+<span style={{ fontSize: "11px" }}>Adicionar</span></div>
              </div>
            </div>
          </div>

          <div style={card}>
            <div style={cardHeader}><div style={cardTitle}>Localização</div></div>
            <div style={cardBody}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div><label style={fieldLabel}>CEP</label><input type="text" style={fieldInput} defaultValue="01404-001" /></div>
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <button style={{ padding: "11px 16px", border: "1px solid var(--neutral-200)", borderRadius: "8px", background: "none", fontSize: "13px", cursor: "pointer", color: "var(--gold-500)", fontWeight: 500, width: "100%", fontFamily: "var(--font-sans)" }}>Buscar CEP</button>
                </div>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={fieldLabel}>Endereço <span style={{ color: "var(--gold-500)" }}>*</span></label>
                <input type="text" style={fieldInput} defaultValue="Rua Oscar Freire" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div><label style={fieldLabel}>Número</label><input type="text" style={fieldInput} defaultValue="1204" /></div>
                <div><label style={fieldLabel}>Complemento</label><input type="text" style={fieldInput} defaultValue="Apto 81" /></div>
                <div><label style={fieldLabel}>Bairro</label><input type="text" style={fieldInput} defaultValue="Jardins" /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div><label style={fieldLabel}>Cidade <span style={{ color: "var(--gold-500)" }}>*</span></label><input type="text" style={fieldInput} defaultValue="São Paulo" /></div>
                <div><label style={fieldLabel}>Estado</label><select style={fieldInput}><option>SP</option><option>RJ</option><option>MG</option></select></div>
              </div>
            </div>
          </div>

          <div style={card}>
            <div style={cardHeader}><div style={cardTitle}>Características</div></div>
            <div style={cardBody}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div><label style={fieldLabel}>Área útil (m²)</label><input type="number" style={fieldInput} defaultValue={98} /></div>
                <div><label style={fieldLabel}>Quartos</label><input type="number" style={fieldInput} defaultValue={3} /></div>
                <div><label style={fieldLabel}>Banheiros</label><input type="number" style={fieldInput} defaultValue={3} /></div>
                <div><label style={fieldLabel}>Vagas</label><input type="number" style={fieldInput} defaultValue={2} /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div><label style={fieldLabel}>Suítes</label><input type="number" style={fieldInput} defaultValue={1} /></div>
                <div><label style={fieldLabel}>Andar</label><input type="text" style={fieldInput} defaultValue="8º andar" /></div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <CorretorResponsavelCampo corretorIdInicial={imovel.corretorId} />
          <div style={{ ...card, marginBottom: "16px" }}>
            <div style={{ ...cardHeader, padding: "16px 20px" }}><div style={cardTitle}>Preço e status</div></div>
            <div style={{ padding: "20px" }}>
              <div style={{ marginBottom: "20px" }}>
                <label style={fieldLabel}>Preço <span style={{ color: "var(--gold-500)" }}>*</span></label>
                <input type="text" style={fieldInput} defaultValue={imovel.preco} />
              </div>
              <div>
                <label style={fieldLabel}>Status <span style={{ color: "var(--gold-500)" }}>*</span></label>
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
          </div>

          <div style={{ ...card, marginBottom: "16px" }}>
            <div style={{ ...cardHeader, padding: "16px 20px" }}><div style={cardTitle}>Empreendimento</div></div>
            <div style={{ padding: "20px" }}>
              <label style={fieldLabel}>Vincular a um empreendimento</label>
              <select style={fieldInput}><option value="">Nenhum (imóvel avulso)</option><option>Grand Tower</option><option>Residencial Alphaville II</option></select>
            </div>
          </div>

          <div style={{ ...card, marginBottom: "16px" }}>
            <div style={{ ...cardHeader, padding: "16px 20px" }}><div style={cardTitle}>Publicação</div></div>
            <div style={{ padding: "20px" }}>
              <Toggle label="Imóvel em destaque" sub="Aparece no topo da galeria" defaultOn={true} />
              <Toggle label="Visível no site" sub="Desmarque para rascunho" defaultOn={true} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button id="topbar-publicar" onClick={handleSave} style={{ padding: "13px", background: "linear-gradient(135deg,var(--gold-500),var(--gold-400))", border: "none", borderRadius: "8px", fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600, color: "var(--navy-900)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              Salvar alterações
            </button>
            <a href="/admin/imoveis" style={{ padding: "11px", border: "1px solid var(--neutral-200)", borderRadius: "8px", fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 500, color: "var(--neutral-600)", background: "none", cursor: "pointer", textAlign: "center", textDecoration: "none", display: "block" }}>
              Cancelar
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminImovelEditarPage() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin, usuario } = useSessao();
  const imovel = imoveisMock.find((x) => String(x.id) === id);
  if (!imovel) return <PublicacaoNaoEncontrada voltarPara="/admin/imoveis" />;
  if (!isAdmin && imovel.corretorId !== usuario.id) return <PublicacaoDeOutroCorretor voltarPara="/admin/imoveis" />;
  return <ImovelEditarForm key={`${usuario.id}-${imovel.id}`} imovel={imovel} />;
}
