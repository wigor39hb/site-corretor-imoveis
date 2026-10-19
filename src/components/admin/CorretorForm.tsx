"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Papel } from "@/lib/mock/corretores";
import type { Corretor } from "@/lib/corretores";
import { BUCKET_FOTOS, TAMANHO_MAX_ARQUIVO, comprimirQuadrado, apagarArquivo } from "@/lib/helpers/imagem";
import { atualizarCorretor, criarCorretor, definirSenha } from "@/app/admin/(painel)/corretores/acoes";
import {
  card, cardHeader, cardBody, cardTitle, cardSub, fieldGroup, fieldLabel, fieldInput, fieldHint,
  btnPrimary, btnOutline, Obrigatorio, Toggle, useToast, CampoWhatsapp, Avatar,
} from "@/components/admin/ui";

const vazio: Corretor = {
  id: "", nome: "", creci: "", especialidade: "", whatsapp: "", email: "",
  emailAcesso: "", papel: "corretor", ativo: true, bio: "", instagram: "",
  fotoUrl: null, apareceNoSite: true,
};

const estiloAvatar: React.CSSProperties = { background: "linear-gradient(135deg,var(--navy-700),var(--navy-500))", border: "3px solid var(--gold-500)", fontWeight: 700, color: "var(--gold-400)", fontFamily: "var(--font-serif)" };

// Formulário de cadastro/edição de corretor (só administradores usam).
export default function CorretorForm({ inicial, ehVoce = false }: { inicial?: Corretor; ehVoce?: boolean }) {
  const router = useRouter();
  const { toast, mostrar } = useToast();
  const novo = !inicial;
  const [dados, setDados] = useState<Corretor>(inicial ?? vazio);
  const [salvando, setSalvando] = useState(false);
  const [senha, setSenha] = useState("");
  const [trocandoSenha, setTrocandoSenha] = useState(false);
  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const inputFoto = useRef<HTMLInputElement>(null);

  const set = <K extends keyof Corretor>(campo: K, valor: Corretor[K]) =>
    setDados((d) => ({ ...d, [campo]: valor }));

  const handleSalvar = async () => {
    setSalvando(true);
    const { erro } = novo ? await criarCorretor(dados, senha) : await atualizarCorretor(dados.id, dados);
    setSalvando(false);
    if (erro) {
      mostrar(erro, true);
      return;
    }
    mostrar(novo ? "Corretor cadastrado! Passe a ele o e-mail e a senha de acesso." : "Alterações salvas!");
    router.refresh();
    setTimeout(() => router.push("/admin/corretores"), 1500);
  };

  const salvarSenha = async () => {
    const { erro } = await definirSenha(dados.id, senha);
    if (erro) {
      mostrar(erro, true);
      return;
    }
    setSenha("");
    setTrocandoSenha(false);
    mostrar("Senha alterada! Passe a nova senha ao corretor.");
  };

  // A foto é salva na hora, sem precisar clicar em "Salvar alterações".
  async function trocarFoto(arquivo: File | undefined) {
    if (!arquivo) return;
    if (!arquivo.type.startsWith("image/")) {
      mostrar("Escolha um arquivo de imagem (JPG, PNG ou WebP).", true);
      return;
    }
    if (arquivo.size > TAMANHO_MAX_ARQUIVO) {
      mostrar("Imagem muito grande. O limite é 15 MB.", true);
      return;
    }
    setEnviandoFoto(true);
    try {
      const imagem = await comprimirQuadrado(arquivo);
      const supabase = createClient();
      const caminho = `perfis/${dados.id}/${Date.now()}.webp`;
      const { error: erroEnvio } = await supabase.storage
        .from(BUCKET_FOTOS)
        .upload(caminho, imagem, { contentType: "image/webp", cacheControl: "31536000" });
      if (erroEnvio) throw erroEnvio;
      const { data } = supabase.storage.from(BUCKET_FOTOS).getPublicUrl(caminho);
      const { error: erroPerfil } = await supabase.from("perfis").update({ foto_url: data.publicUrl }).eq("id", dados.id);
      if (erroPerfil) {
        await supabase.storage.from(BUCKET_FOTOS).remove([caminho]);
        throw erroPerfil;
      }
      await apagarArquivo(dados.fotoUrl); // apaga a foto antiga do armazenamento
      set("fotoUrl", data.publicUrl);
      mostrar("Foto atualizada!");
      router.refresh();
    } catch {
      mostrar("Não foi possível enviar a foto. Tente outra imagem.", true);
    } finally {
      setEnviandoFoto(false);
      if (inputFoto.current) inputFoto.current.value = "";
    }
  }

  async function removerFoto() {
    if (!dados.fotoUrl) return;
    setEnviandoFoto(true);
    const { error } = await createClient().from("perfis").update({ foto_url: null }).eq("id", dados.id);
    if (error) {
      setEnviandoFoto(false);
      mostrar("Não foi possível remover a foto.", true);
      return;
    }
    await apagarArquivo(dados.fotoUrl);
    set("fotoUrl", null);
    setEnviandoFoto(false);
    mostrar("Foto removida.");
    router.refresh();
  }

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
                <Avatar nome={dados.nome || "?"} fotoUrl={dados.fotoUrl} tamanho={88} style={{ ...estiloAvatar, fontSize: "30px" }} />
                {novo ? (
                  <div style={{ fontSize: "13px", color: "var(--neutral-400)", fontFamily: "var(--font-sans)", lineHeight: 1.6 }}>
                    A foto pode ser enviada depois do cadastro, abrindo o corretor para editar.<br />
                    O próprio corretor também pode enviar em <strong>Meu perfil</strong>.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <input ref={inputFoto} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={(e) => trocarFoto(e.target.files?.[0])} />
                    <button type="button" onClick={() => inputFoto.current?.click()} disabled={enviandoFoto} style={{ ...btnPrimary, padding: "9px 18px", opacity: enviandoFoto ? 0.7 : 1 }}>
                      {enviandoFoto ? "Enviando..." : "📸 Enviar foto"}
                    </button>
                    {dados.fotoUrl && (
                      <button type="button" onClick={removerFoto} disabled={enviandoFoto} style={{ ...btnOutline, padding: "9px 18px", color: "var(--neutral-400)" }}>Remover foto</button>
                    )}
                    <div style={{ fontSize: "12px", color: "var(--neutral-400)", fontFamily: "var(--font-sans)" }}>JPG, PNG ou WebP, até 15 MB. A foto é cortada em quadrado, pelo centro.</div>
                  </div>
                )}
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
                  <input type="text" style={fieldInput} value={dados.creci} onChange={(e) => set("creci", e.target.value)} placeholder="CRECI-MT 00000-F" />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <label style={fieldLabel}>WhatsApp <Obrigatorio /></label>
                  <CampoWhatsapp valor={dados.whatsapp} onChange={(v) => set("whatsapp", v)} />
                  <div style={fieldHint}>DDD + número. Recebe os contatos dos imóveis dele.</div>
                </div>
                <div>
                  <label style={fieldLabel}>E-mail de contato</label>
                  <input type="email" style={fieldInput} value={dados.email} onChange={(e) => set("email", e.target.value)} placeholder="nome@exemplo.com.br" />
                  <div style={fieldHint}>Aparece no site.</div>
                </div>
              </div>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Especialidade</label>
                <input type="text" style={fieldInput} value={dados.especialidade} onChange={(e) => set("especialidade", e.target.value)} placeholder="Ex: Alto padrão · Lançamentos" />
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
                <input type="email" style={fieldInput} value={dados.emailAcesso} onChange={(e) => set("emailAcesso", e.target.value)} placeholder="nome@exemplo.com.br" autoComplete="off" />
              </div>
              {novo ? (
                <div>
                  <label style={fieldLabel}>Senha inicial <Obrigatorio /></label>
                  <input type="text" style={fieldInput} value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Mínimo 8 caracteres" autoComplete="new-password" />
                  <div style={fieldHint}>Passe o e-mail e esta senha ao corretor. Ele pode trocá-la depois em Meu perfil.</div>
                </div>
              ) : trocandoSenha ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <label style={{ ...fieldLabel, marginBottom: 0 }}>Nova senha</label>
                  <input type="text" style={fieldInput} value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Mínimo 8 caracteres" autoComplete="new-password" />
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button type="button" onClick={salvarSenha} style={{ ...btnPrimary, padding: "9px 16px" }}>Salvar nova senha</button>
                    <button type="button" onClick={() => { setTrocandoSenha(false); setSenha(""); }} style={{ ...btnOutline, padding: "9px 16px" }}>Cancelar</button>
                  </div>
                  <div style={fieldHint}>Use quando o corretor esquecer a senha. Depois, passe a nova senha a ele.</div>
                </div>
              ) : (
                <button type="button" onClick={() => setTrocandoSenha(true)} style={{ ...btnOutline, display: "inline-block", padding: "9px 16px" }}>
                  Definir nova senha
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
                <div style={{ ...fieldHint, marginBottom: "16px" }}>Você não pode mudar o seu próprio papel nem se desativar.</div>
              ) : (
                <Toggle label="Ativo" sub="Desative quando o corretor sair da equipe" on={dados.ativo} onChange={(v) => set("ativo", v)} />
              )}
              <Toggle label="Aparece no site" sub="Mostra o cartão na seção Nossa Equipe" on={dados.apareceNoSite} onChange={(v) => set("apareceNoSite", v)} />
            </div>
          </div>

          {/* PRÉVIA */}
          <div style={{ background: "var(--navy-900)", borderRadius: "12px", padding: "24px", textAlign: "center", marginBottom: "8px" }}>
            <Avatar nome={dados.nome || "?"} fotoUrl={dados.fotoUrl} tamanho={64} style={{ ...estiloAvatar, border: "2px solid var(--gold-500)", fontSize: "24px", margin: "0 auto 12px" }} />
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "17px", fontWeight: 600, color: "#fff" }}>{dados.nome || "Nome do corretor"}</div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginTop: "4px", fontFamily: "var(--font-sans)" }}>{dados.creci || "CRECI"}</div>
            {dados.especialidade && <div style={{ fontSize: "12px", color: "var(--gold-400)", marginTop: "8px", fontFamily: "var(--font-sans)" }}>{dados.especialidade}</div>}
          </div>
          <div style={{ fontSize: "12px", color: "var(--neutral-400)", textAlign: "center", marginBottom: "16px", fontFamily: "var(--font-sans)" }}>Prévia do cartão no site</div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button id="topbar-salvar" onClick={handleSalvar} disabled={salvando} style={{ ...btnPrimary, opacity: salvando ? 0.7 : 1 }}>
              {salvando ? "Salvando..." : novo ? "Cadastrar corretor" : "Salvar alterações"}
            </button>
            <a href="/admin/corretores" style={btnOutline}>Cancelar</a>
          </div>
        </div>
      </div>
    </>
  );
}
