"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CorretorMock, Papel } from "@/lib/mock/corretores";
import {
  card, cardHeader, cardBody, cardTitle, cardSub, fieldGroup, fieldLabel, fieldInput, fieldHint,
  btnPrimary, btnOutline, Obrigatorio, Toggle, useToast, iniciais,
} from "@/components/admin/ui";

const vazio: CorretorMock = {
  id: "", nome: "", creci: "", especialidade: "", whatsapp: "", email: "",
  emailAcesso: "", papel: "corretor", ativo: true, bio: "", instagram: "",
};

// Formulário de cadastro/edição de corretor (só administradores usam).
export default function CorretorForm({ inicial, ehVoce = false }: { inicial?: CorretorMock; ehVoce?: boolean }) {
  const router = useRouter();
  const { toast, mostrar } = useToast();
  const novo = !inicial;
  const [dados, setDados] = useState<CorretorMock>(inicial ?? vazio);

  const set = <K extends keyof CorretorMock>(campo: K, valor: CorretorMock[K]) =>
    setDados((d) => ({ ...d, [campo]: valor }));

  const handleSalvar = () => {
    mostrar(novo ? "Corretor cadastrado! Ele receberá um e-mail para criar a senha." : "Alterações salvas!");
    setTimeout(() => router.push("/admin/corretores"), 2000);
  };

  return (
    <>
      {toast}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px", alignItems: "start", maxWidth: "1200px" }} className="admin-form-grid">

        {/* COLUNA PRINCIPAL */}
        <div>
          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Foto</div>
              <div style={cardSub}>Aparece no cartão do corretor no site</div>
            </div>
            <div style={cardBody}>
              <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                <div style={{ width: "88px", height: "88px", borderRadius: "50%", background: "linear-gradient(135deg,var(--navy-700),var(--navy-500))", border: "3px solid var(--gold-500)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", fontWeight: 700, color: "var(--gold-400)", fontFamily: "var(--font-serif)", flexShrink: 0 }}>
                  {iniciais(dados.nome) || "?"}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <button type="button" style={{ ...btnPrimary, padding: "9px 18px" }}>📸 Enviar foto</button>
                  <div style={{ fontSize: "12px", color: "var(--neutral-400)", fontFamily: "var(--font-sans)" }}>JPG ou PNG, mín. 400×400px, até 5MB</div>
                </div>
              </div>
            </div>
          </div>

          <div style={card}>
            <div style={cardHeader}><div style={cardTitle}>Dados do corretor</div></div>
            <div style={cardBody}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <label style={fieldLabel}>Nome completo <Obrigatorio /></label>
                  <input type="text" style={fieldInput} value={dados.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Ex: Ana Souza" />
                </div>
                <div>
                  <label style={fieldLabel}>CRECI <Obrigatorio /></label>
                  <input type="text" style={fieldInput} value={dados.creci} onChange={(e) => set("creci", e.target.value)} placeholder="CRECI-SP 000000-F" />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <label style={fieldLabel}>WhatsApp <Obrigatorio /></label>
                  <input type="text" style={fieldInput} value={dados.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="5511999999999" />
                  <div style={fieldHint}>Só números, com 55 + DDD. Recebe os contatos dos imóveis dele.</div>
                </div>
                <div>
                  <label style={fieldLabel}>E-mail de contato</label>
                  <input type="email" style={fieldInput} value={dados.email} onChange={(e) => set("email", e.target.value)} placeholder="nome@exemplo.com.br" />
                  <div style={fieldHint}>Aparece no site.</div>
                </div>
              </div>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Especialidade</label>
                <input type="text" style={fieldInput} value={dados.especialidade} onChange={(e) => set("especialidade", e.target.value)} placeholder="Ex: Alto padrão · Jardins e Itaim" />
              </div>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Apresentação curta</label>
                <textarea style={{ ...fieldInput, resize: "vertical", minHeight: "90px", lineHeight: "1.6" }} value={dados.bio} onChange={(e) => set("bio", e.target.value)} />
              </div>
              <div>
                <label style={fieldLabel}>Instagram</label>
                <input type="text" style={fieldInput} value={dados.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="@usuario" />
              </div>
            </div>
          </div>

          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Acesso ao painel</div>
              <div style={cardSub}>Dados que o corretor usa para entrar em /admin</div>
            </div>
            <div style={cardBody}>
              <div style={fieldGroup}>
                <label style={fieldLabel}>E-mail de acesso <Obrigatorio /></label>
                <input type="email" style={fieldInput} value={dados.emailAcesso} onChange={(e) => set("emailAcesso", e.target.value)} placeholder="nome@exemplo.com.br" />
                <div style={fieldHint}>
                  {novo
                    ? "O corretor recebe um e-mail com um link para criar a própria senha."
                    : "Para trocar a senha, use o botão abaixo — o corretor recebe um link por e-mail."}
                </div>
              </div>
              {!novo && (
                <button type="button" onClick={() => mostrar("Link de nova senha enviado para " + dados.emailAcesso)} style={{ ...btnOutline, display: "inline-block", padding: "9px 16px" }}>
                  Enviar link para redefinir senha
                </button>
              )}
            </div>
          </div>
        </div>

        {/* COLUNA LATERAL */}
        <div>
          <div style={{ ...card, marginBottom: "16px" }}>
            <div style={{ ...cardHeader, padding: "16px 20px" }}><div style={cardTitle}>Permissões</div></div>
            <div style={{ padding: "20px" }}>
              <label style={fieldLabel}>Papel</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                {([
                  { v: "corretor", t: "Corretor", d: "Edita só o próprio perfil e as próprias publicações" },
                  { v: "admin", t: "Administrador", d: "Gerencia corretores, configurações e todas as publicações" },
                ] as { v: Papel; t: string; d: string }[]).map((op) => {
                  const sel = dados.papel === op.v;
                  return (
                    <label key={op.v} style={{ padding: "12px 14px", border: `1px solid ${sel ? "var(--gold-500)" : "var(--neutral-200)"}`, background: sel ? "rgba(201,169,110,0.06)" : "transparent", borderRadius: "8px", cursor: ehVoce ? "not-allowed" : "pointer", display: "flex", gap: "10px", alignItems: "flex-start", opacity: ehVoce && !sel ? 0.5 : 1 }}>
                      <input type="radio" name="papel" checked={sel} disabled={ehVoce} onChange={() => set("papel", op.v)} style={{ accentColor: "var(--gold-500)", marginTop: "3px" }} />
                      <span>
                        <span style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--neutral-900)", fontFamily: "var(--font-sans)" }}>{op.t}</span>
                        <span style={{ display: "block", fontSize: "12px", color: "var(--neutral-400)", marginTop: "2px", fontFamily: "var(--font-sans)" }}>{op.d}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
              {ehVoce ? (
                <div style={fieldHint}>Você não pode mudar o seu próprio papel nem se desativar.</div>
              ) : (
                <Toggle label="Ativo" sub="Desative quando o corretor sair da equipe" on={dados.ativo} onChange={(v) => set("ativo", v)} />
              )}
            </div>
          </div>

          {/* PRÉVIA */}
          <div style={{ background: "var(--navy-900)", borderRadius: "12px", padding: "24px", textAlign: "center", marginBottom: "8px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg,var(--navy-700),var(--navy-500))", border: "2px solid var(--gold-500)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: 700, color: "var(--gold-400)", fontFamily: "var(--font-serif)", margin: "0 auto 12px" }}>
              {iniciais(dados.nome) || "?"}
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "17px", fontWeight: 600, color: "#fff" }}>{dados.nome || "Nome do corretor"}</div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginTop: "4px", fontFamily: "var(--font-sans)" }}>{dados.creci || "CRECI"}</div>
            {dados.especialidade && <div style={{ fontSize: "12px", color: "var(--gold-400)", marginTop: "8px", fontFamily: "var(--font-sans)" }}>{dados.especialidade}</div>}
          </div>
          <div style={{ fontSize: "12px", color: "var(--neutral-400)", textAlign: "center", marginBottom: "16px", fontFamily: "var(--font-sans)" }}>Prévia do cartão no site</div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button id="topbar-salvar" onClick={handleSalvar} style={btnPrimary}>
              {novo ? "Cadastrar corretor" : "Salvar alterações"}
            </button>
            <a href="/admin/corretores" style={btnOutline}>Cancelar</a>
          </div>
        </div>
      </div>
    </>
  );
}
