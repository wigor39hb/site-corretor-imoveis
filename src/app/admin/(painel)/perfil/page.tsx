"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useSessao } from "@/context/SessaoContext";
import { formatWhatsapp, whatsappValido } from "@/lib/helpers/formatters";
import { papelLabel, type CorretorMock } from "@/lib/mock/corretores";
import {
  card, cardHeader, cardBody, cardTitle, cardSub, fieldGroup, fieldLabel, fieldInput, fieldHint,
  btnPrimary, btnOutline, Obrigatorio, useToast, iniciais, CampoWhatsapp,
} from "@/components/admin/ui";

export default function AdminPerfilPage() {
  const { usuario } = useSessao();
  return <PerfilForm usuario={usuario} />;
}

function PerfilForm({ usuario }: { usuario: CorretorMock }) {
  const { toast, mostrar } = useToast();
  const router = useRouter();
  const [dados, setDados] = useState(usuario);
  const [salvando, setSalvando] = useState(false);
  const [trocandoSenha, setTrocandoSenha] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");

  const set = <K extends keyof CorretorMock>(campo: K, valor: CorretorMock[K]) =>
    setDados((d) => ({ ...d, [campo]: valor }));

  async function salvar() {
    const whatsapp = dados.whatsapp;
    if (!dados.nome.trim() || !dados.creci.trim() || !whatsapp) {
      mostrar("Preencha nome, CRECI e WhatsApp.", true);
      return;
    }
    if (!whatsappValido(whatsapp)) {
      mostrar("WhatsApp incompleto. Digite o DDD e o número.", true);
      return;
    }
    setSalvando(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("perfis")
      .update({
        nome: dados.nome.trim(),
        creci: dados.creci.trim(),
        whatsapp,
        email: dados.email.trim() || null,
        especialidade: dados.especialidade.trim() || null,
        bio: dados.bio.trim() || null,
        instagram: dados.instagram.trim() || null,
      })
      .eq("id", usuario.id);
    setSalvando(false);
    if (error) {
      mostrar("Não foi possível salvar. Tente novamente.", true);
      return;
    }
    mostrar("Perfil atualizado com sucesso!");
    router.refresh(); // atualiza o nome no menu lateral
  }

  async function salvarSenha() {
    if (novaSenha.length < 8) {
      mostrar("A senha precisa ter pelo menos 8 caracteres.", true);
      return;
    }
    if (novaSenha !== confirmaSenha) {
      mostrar("As duas senhas não são iguais.", true);
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: novaSenha });
    if (error) {
      mostrar(error.code === "same_password" ? "A nova senha precisa ser diferente da atual." : "Não foi possível trocar a senha.", true);
      return;
    }
    setTrocandoSenha(false);
    setNovaSenha("");
    setConfirmaSenha("");
    mostrar("Senha alterada com sucesso!");
  }

  return (
    <>
      {toast}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px", alignItems: "start", maxWidth: "1200px" }} className="admin-form-grid">

        {/* COLUNA PRINCIPAL */}
        <div>
          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Foto de perfil</div>
              <div style={cardSub}>Aparece no seu cartão na página Contato e nos seus imóveis</div>
            </div>
            <div style={cardBody}>
              <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                <div style={{ width: "96px", height: "96px", borderRadius: "50%", background: "linear-gradient(135deg,var(--navy-700),var(--navy-500))", border: "3px solid var(--gold-500)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", fontWeight: 700, color: "var(--gold-400)", fontFamily: "var(--font-serif)", flexShrink: 0 }}>
                  {iniciais(dados.nome)}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <button style={{ ...btnPrimary, padding: "9px 18px" }}>📸 Alterar foto</button>
                  <button style={{ ...btnOutline, padding: "9px 18px", color: "var(--neutral-400)" }}>Remover foto</button>
                  <div style={{ fontSize: "12px", color: "var(--neutral-400)", fontFamily: "var(--font-sans)" }}>JPG ou PNG, mín. 400×400px, até 5MB</div>
                </div>
              </div>
            </div>
          </div>

          <div style={card}>
            <div style={cardHeader}><div style={cardTitle}>Dados pessoais</div></div>
            <div style={cardBody}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <label style={fieldLabel}>Nome completo <Obrigatorio /></label>
                  <input type="text" style={fieldInput} value={dados.nome} onChange={(e) => set("nome", e.target.value)} />
                </div>
                <div>
                  <label style={fieldLabel}>CRECI <Obrigatorio /></label>
                  <input type="text" style={fieldInput} value={dados.creci} onChange={(e) => set("creci", e.target.value)} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <label style={fieldLabel}>WhatsApp <Obrigatorio /></label>
                  <CampoWhatsapp valor={dados.whatsapp} onChange={(v) => set("whatsapp", v)} />
                  <div style={fieldHint}>DDD + número. Os botões dos seus imóveis chamam este número.</div>
                </div>
                <div>
                  <label style={fieldLabel}>E-mail de contato</label>
                  <input type="email" style={fieldInput} value={dados.email} onChange={(e) => set("email", e.target.value)} />
                </div>
              </div>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Especialidade</label>
                <input type="text" style={fieldInput} value={dados.especialidade} onChange={(e) => set("especialidade", e.target.value)} />
                <div style={fieldHint}>Uma linha curta, exibida abaixo do seu nome no site.</div>
              </div>
              <div>
                <label style={fieldLabel}>Apresentação curta</label>
                <textarea style={{ ...fieldInput, resize: "vertical", minHeight: "110px", lineHeight: "1.6" }} value={dados.bio} onChange={(e) => set("bio", e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA LATERAL */}
        <div>
          {/* PRÉVIA */}
          <div style={{ background: "var(--navy-900)", borderRadius: "12px", overflow: "hidden", marginBottom: "8px" }}>
            <div style={{ padding: "24px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "linear-gradient(135deg,var(--navy-700),var(--navy-500))", border: "2px solid var(--gold-500)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: 700, color: "var(--gold-400)", fontFamily: "var(--font-serif)", margin: "0 auto 12px" }}>{iniciais(dados.nome)}</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 600, color: "#fff" }}>{dados.nome}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginTop: "4px", fontFamily: "var(--font-sans)" }}>{dados.creci}</div>
            </div>
            <div style={{ padding: "16px 20px" }}>
              {[
                { icon: "📱", val: formatWhatsapp(dados.whatsapp) },
                { icon: "✉", val: dados.email },
                { icon: "⭐", val: dados.especialidade },
              ].filter((r) => r.val).map((row) => (
                <div key={row.icon} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: "13px", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-sans)" }}>
                  {row.icon} <strong style={{ color: "var(--gold-400)", fontWeight: 500 }}>{row.val}</strong>
                </div>
              ))}
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "var(--neutral-400)", textAlign: "center", marginBottom: "16px", fontFamily: "var(--font-sans)" }}>Prévia do seu cartão no site</div>

          <div style={{ ...card, marginBottom: "16px" }}>
            <div style={{ ...cardHeader, padding: "16px 20px" }}><div style={cardTitle}>Redes sociais</div></div>
            <div style={{ padding: "20px" }}>
              <label style={fieldLabel}>Instagram</label>
              <input type="text" style={fieldInput} placeholder="@seuusuario" value={dados.instagram} onChange={(e) => set("instagram", e.target.value)} />
            </div>
          </div>

          <div style={{ ...card, marginBottom: "16px" }}>
            <div style={{ ...cardHeader, padding: "16px 20px" }}><div style={cardTitle}>Acesso</div></div>
            <div style={{ padding: "4px 20px" }}>
              {[
                { label: "E-mail de acesso", sub: dados.emailAcesso, acao: null },
                { label: "Papel", sub: papelLabel[dados.papel], acao: null },
                { label: "Senha", sub: "••••••••", acao: "Alterar" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid var(--neutral-100)" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--neutral-900)", fontFamily: "var(--font-sans)" }}>{item.label}</div>
                    <div style={{ fontSize: "12px", color: "var(--neutral-400)", marginTop: "2px", fontFamily: "var(--font-sans)" }}>{item.sub}</div>
                  </div>
                  {item.acao && (
                    <button onClick={() => setTrocandoSenha((v) => !v)} style={{ padding: "7px 14px", border: "1px solid var(--neutral-200)", borderRadius: "8px", background: "none", fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500, color: "var(--neutral-600)", cursor: "pointer" }}>{item.acao}</button>
                  )}
                </div>
              ))}
              {trocandoSenha && (
                <div style={{ padding: "14px 0", borderBottom: "1px solid var(--neutral-100)", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <input type="password" style={fieldInput} placeholder="Nova senha (mín. 8 caracteres)" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} autoComplete="new-password" />
                  <input type="password" style={fieldInput} placeholder="Repita a nova senha" value={confirmaSenha} onChange={(e) => setConfirmaSenha(e.target.value)} autoComplete="new-password" />
                  <button onClick={salvarSenha} style={{ ...btnPrimary, padding: "10px" }}>Salvar nova senha</button>
                </div>
              )}
              <div style={{ ...fieldHint, padding: "10px 0 14px" }}>Para trocar o e-mail de acesso ou o papel, fale com um administrador.</div>
            </div>
          </div>

          <button id="topbar-salvar" onClick={salvar} disabled={salvando} style={{ ...btnPrimary, width: "100%", opacity: salvando ? 0.7 : 1 }}>
            {salvando ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>
    </>
  );
}
