"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useSessao } from "@/context/SessaoContext";
import { useConfigSite } from "@/context/ConfigSiteContext";
import type { ConfigSite } from "@/lib/configuracoes";
import { whatsappValido } from "@/lib/helpers/formatters";
import { TAMANHO_MAX_ARQUIVO, comprimir, iconeQuadrado, enviarArquivo, apagarArquivo } from "@/lib/helpers/imagem";
import {
  card, cardHeader, cardBody, cardTitle, cardSub, fieldGroup, fieldLabel, fieldInput, fieldHint,
  btnPrimary, btnOutline, Obrigatorio, AcessoRestrito, useToast, CampoWhatsapp,
} from "@/components/admin/ui";

const grid2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" };
const btnPequeno: React.CSSProperties = { padding: "8px 14px", border: "1px solid var(--gold-500)", borderRadius: "8px", background: "none", fontSize: "13px", color: "var(--gold-500)", cursor: "pointer", fontFamily: "var(--font-sans)" };
const btnRemover: React.CSSProperties = { background: "none", border: "none", cursor: "pointer", color: "var(--neutral-400)", fontSize: "13px", fontFamily: "var(--font-sans)" };
const btnIcone: React.CSSProperties = { width: "28px", height: "28px", borderRadius: "6px", border: "none", background: "rgba(13,27,42,0.75)", color: "#fff", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center" };
const textarea: React.CSSProperties = { ...fieldInput, resize: "vertical", lineHeight: "1.6" };
const dicaDestaque = "Coloque entre *asteriscos* a parte que deve aparecer em itálico, com destaque.";

type CampoImagemBanco = "logo_url" | "favicon_url" | "sobre_foto_url";

function validarArquivo(arquivo: File): string | null {
  if (!arquivo.type.startsWith("image/")) return "Escolha um arquivo de imagem (JPG, PNG ou WebP).";
  if (arquivo.size > TAMANHO_MAX_ARQUIVO) return "Imagem muito grande. O limite é 15 MB.";
  return null;
}

const nomeArquivo = (ext: string) => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

export default function AdminConfiguracoesPage() {
  const { isAdmin } = useSessao();
  const config = useConfigSite();
  if (!isAdmin) return <AcessoRestrito />;
  return <ConfiguracoesForm config={config} />;
}

function ConfiguracoesForm({ config }: { config: ConfigSite }) {
  const { toast, mostrar } = useToast();
  const router = useRouter();
  const [dados, setDados] = useState(config);
  const [salvando, setSalvando] = useState(false);
  const [enviando, setEnviando] = useState<string | null>(null); // qual imagem está sendo enviada

  const set = <K extends keyof ConfigSite>(campo: K, valor: ConfigSite[K]) =>
    setDados((d) => ({ ...d, [campo]: valor }));

  const setNumero = (i: number, campo: "valor" | "rotulo", v: string) =>
    set("numeros", dados.numeros.map((n, idx) => (idx === i ? { ...n, [campo]: v } : n)));
  const setDepoimento = (i: number, campo: "nome" | "texto", v: string) =>
    set("depoimentos", dados.depoimentos.map((d, idx) => (idx === i ? { ...d, [campo]: v } : d)));
  const setItemSobre = (i: number, campo: "titulo" | "descricao", v: string) =>
    set("homeSobreItens", dados.homeSobreItens.map((d, idx) => (idx === i ? { ...d, [campo]: v } : d)));

  async function gravar(campos: Record<string, unknown>) {
    const { error } = await createClient().from("configuracoes_site").update(campos).eq("id", 1);
    if (error) throw error;
  }

  // ─── Textos: salvos ao clicar em "Salvar alterações" ───
  async function salvar() {
    if (!dados.nome.trim() || !dados.creci.trim()) {
      mostrar("Preencha o nome e o CRECI da imobiliária.", true);
      return;
    }
    if (!whatsappValido(dados.whatsapp)) {
      mostrar("WhatsApp da imobiliária incompleto. Digite o DDD e o número.", true);
      return;
    }
    const limpar = (v: string) => v.trim() || null;
    setSalvando(true);
    try {
      await gravar({
        nome: dados.nome.trim(),
        nome_curto: limpar(dados.nomeCurto),
        creci: dados.creci.trim(),
        whatsapp: dados.whatsapp,
        email: limpar(dados.email),
        endereco: limpar(dados.endereco),
        horario: limpar(dados.horario),
        instagram: limpar(dados.instagram),
        facebook: limpar(dados.facebook),
        linkedin: limpar(dados.linkedin),
        youtube: limpar(dados.youtube),
        hero_frase: limpar(dados.heroFrase),
        hero_titulo: limpar(dados.heroTitulo),
        hero_texto: limpar(dados.heroTexto),
        home_sobre_titulo: limpar(dados.homeSobreTitulo),
        home_sobre_texto: limpar(dados.homeSobreTexto),
        home_sobre_itens: dados.homeSobreItens.filter((i) => i.titulo.trim()),
        sobre_texto: limpar(dados.sobreTexto),
        numeros: dados.numeros.filter((n) => n.valor.trim()),
        depoimentos: dados.depoimentos.filter((d) => d.nome.trim() && d.texto.trim()),
      });
      mostrar("Configurações salvas!");
      router.refresh();
    } catch {
      mostrar("Não foi possível salvar. Tente novamente.", true);
    } finally {
      setSalvando(false);
    }
  }

  // ─── Imagens: salvas na hora ───
  async function trocarImagem(coluna: CampoImagemBanco, campo: "logoUrl" | "faviconUrl" | "sobreFotoUrl", arquivo: File) {
    const erro = validarArquivo(arquivo);
    if (erro) return mostrar(erro, true);
    setEnviando(campo);
    try {
      const imagem =
        campo === "faviconUrl" ? await iconeQuadrado(arquivo)
        : campo === "logoUrl" ? await comprimir(arquivo, 800, 0.9)
        : await comprimir(arquivo, 1600);
      const pasta = { logoUrl: "logo", faviconUrl: "icone", sobreFotoUrl: "sobre" }[campo];
      const url = await enviarArquivo(`site/${pasta}/${nomeArquivo(campo === "faviconUrl" ? "png" : "webp")}`, imagem);
      try {
        await gravar({ [coluna]: url });
      } catch (e) {
        await apagarArquivo(url);
        throw e;
      }
      await apagarArquivo(dados[campo]);
      set(campo, url);
      mostrar("Imagem atualizada!");
      router.refresh();
    } catch {
      mostrar("Não foi possível enviar a imagem. Tente outra.", true);
    } finally {
      setEnviando(null);
    }
  }

  async function removerImagem(coluna: CampoImagemBanco, campo: "logoUrl" | "faviconUrl" | "sobreFotoUrl") {
    const antiga = dados[campo];
    setEnviando(campo);
    try {
      await gravar({ [coluna]: null });
      await apagarArquivo(antiga);
      set(campo, null);
      mostrar("Imagem removida.");
      router.refresh();
    } catch {
      mostrar("Não foi possível remover a imagem.", true);
    } finally {
      setEnviando(null);
    }
  }

  // ─── Carrossel ───
  async function adicionarAoCarrossel(arquivos: FileList) {
    let lista = dados.carrossel;
    setEnviando("carrossel");
    let falhas = 0;
    for (const arquivo of Array.from(arquivos)) {
      if (validarArquivo(arquivo)) { falhas++; continue; }
      try {
        const imagem = await comprimir(arquivo, 2560);
        const url = await enviarArquivo(`site/carrossel/${nomeArquivo("webp")}`, imagem);
        try {
          await gravar({ carrossel: [...lista, url] });
        } catch (e) {
          await apagarArquivo(url);
          throw e;
        }
        lista = [...lista, url];
        set("carrossel", lista);
      } catch {
        falhas++;
      }
    }
    setEnviando(null);
    router.refresh();
    if (falhas) mostrar(`${falhas} foto(s) não puderam ser enviadas.`, true);
    else mostrar("Fotos adicionadas ao carrossel!");
  }

  async function moverNoCarrossel(i: number, direcao: -1 | 1) {
    const j = i + direcao;
    if (j < 0 || j >= dados.carrossel.length) return;
    const lista = [...dados.carrossel];
    [lista[i], lista[j]] = [lista[j], lista[i]];
    try {
      await gravar({ carrossel: lista });
      set("carrossel", lista);
      router.refresh();
    } catch {
      mostrar("Não foi possível mudar a ordem.", true);
    }
  }

  async function removerDoCarrossel(url: string) {
    const lista = dados.carrossel.filter((u) => u !== url);
    try {
      await gravar({ carrossel: lista });
      await apagarArquivo(url);
      set("carrossel", lista);
      mostrar("Foto removida do carrossel.");
      router.refresh();
    } catch {
      mostrar("Não foi possível remover a foto.", true);
    }
  }

  return (
    <>
      {toast}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px", alignItems: "start", maxWidth: "1200px" }} className="admin-form-grid">

        {/* COLUNA PRINCIPAL */}
        <div>
          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Identidade da imobiliária</div>
              <div style={cardSub}>Aparece no menu, no rodapé, no painel e no título das páginas</div>
            </div>
            <div style={cardBody}>
              <div style={grid2}>
                <div>
                  <label style={fieldLabel}>Nome completo <Obrigatorio /></label>
                  <input type="text" style={fieldInput} value={dados.nome} onChange={(e) => set("nome", e.target.value)} />
                </div>
                <div>
                  <label style={fieldLabel}>Nome curto</label>
                  <input type="text" style={fieldInput} value={dados.nomeCurto} onChange={(e) => set("nomeCurto", e.target.value)} />
                  <div style={fieldHint}>Usado no menu e no rodapé quando não há logo</div>
                </div>
              </div>
              <div style={fieldGroup}>
                <label style={fieldLabel}>CRECI da imobiliária <Obrigatorio /></label>
                <input type="text" style={fieldInput} value={dados.creci} onChange={(e) => set("creci", e.target.value)} />
              </div>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Logo</label>
                <CampoImagem
                  url={dados.logoUrl}
                  enviando={enviando === "logoUrl"}
                  fundoEscuro
                  altura={120}
                  ajuste="contain"
                  texto="PNG com fundo transparente, numa versão clara (branca ou dourada): o menu, o rodapé e o painel têm fundo escuro."
                  onEnviar={(f) => trocarImagem("logo_url", "logoUrl", f)}
                  onRemover={() => removerImagem("logo_url", "logoUrl")}
                />
              </div>
              <div>
                <label style={fieldLabel}>Ícone do site</label>
                <CampoImagem
                  url={dados.faviconUrl}
                  enviando={enviando === "faviconUrl"}
                  altura={96}
                  largura={96}
                  ajuste="contain"
                  texto="Aparece na aba do navegador e nos favoritos. Use uma imagem quadrada, de preferência PNG com pelo menos 512×512 px (normalmente só o símbolo da logo). O navegador pode demorar um pouco para mostrar o novo ícone."
                  onEnviar={(f) => trocarImagem("favicon_url", "faviconUrl", f)}
                  onRemover={() => removerImagem("favicon_url", "faviconUrl")}
                />
              </div>
            </div>
          </div>

          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Página inicial — primeira tela</div>
              <div style={cardSub}>Textos e carrossel de fotos do topo do site</div>
            </div>
            <div style={cardBody}>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Frase acima do título</label>
                <input type="text" style={fieldInput} value={dados.heroFrase} onChange={(e) => set("heroFrase", e.target.value)} />
              </div>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Título principal</label>
                <input type="text" style={fieldInput} value={dados.heroTitulo} onChange={(e) => set("heroTitulo", e.target.value)} />
                <div style={fieldHint}>{dicaDestaque}</div>
              </div>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Texto de apresentação</label>
                <textarea style={{ ...textarea, minHeight: "90px" }} value={dados.heroTexto} onChange={(e) => set("heroTexto", e.target.value)} />
              </div>
              <div>
                <label style={fieldLabel}>Carrossel de fotos</label>
                <div style={{ ...fieldHint, marginTop: 0, marginBottom: "12px" }}>
                  As fotos passam sozinhas, nesta ordem. Prefira fotos em pé (retrato) ou com o assunto no centro, porque o quadro do site é mais alto que largo. As mudanças aqui são salvas na hora.
                </div>
                <Carrossel
                  fotos={dados.carrossel}
                  enviando={enviando === "carrossel"}
                  onAdicionar={adicionarAoCarrossel}
                  onMover={moverNoCarrossel}
                  onRemover={removerDoCarrossel}
                />
              </div>
            </div>
          </div>

          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Página inicial — seção Sobre</div>
              <div style={cardSub}>Apresentação da imobiliária, mais abaixo na página inicial</div>
            </div>
            <div style={cardBody}>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Foto da imobiliária</label>
                <CampoImagem
                  url={dados.sobreFotoUrl}
                  enviando={enviando === "sobreFotoUrl"}
                  altura={200}
                  largura={150}
                  ajuste="cover"
                  texto="Fachada, escritório ou equipe. O quadro do site é em pé (retrato)."
                  onEnviar={(f) => trocarImagem("sobre_foto_url", "sobreFotoUrl", f)}
                  onRemover={() => removerImagem("sobre_foto_url", "sobreFotoUrl")}
                />
              </div>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Título</label>
                <input type="text" style={fieldInput} value={dados.homeSobreTitulo} onChange={(e) => set("homeSobreTitulo", e.target.value)} />
                <div style={fieldHint}>{dicaDestaque}</div>
              </div>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Texto</label>
                <textarea style={{ ...textarea, minHeight: "110px" }} value={dados.homeSobreTexto} onChange={(e) => set("homeSobreTexto", e.target.value)} />
              </div>
              <div>
                <label style={fieldLabel}>Destaques</label>
                {dados.homeSobreItens.map((item, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr auto", gap: "12px", marginBottom: "12px", alignItems: "center" }}>
                    <input type="text" style={fieldInput} value={item.titulo} onChange={(e) => setItemSobre(i, "titulo", e.target.value)} placeholder="Título" aria-label="Título do destaque" />
                    <input type="text" style={fieldInput} value={item.descricao} onChange={(e) => setItemSobre(i, "descricao", e.target.value)} placeholder="Descrição curta" aria-label="Descrição do destaque" />
                    <button onClick={() => set("homeSobreItens", dados.homeSobreItens.filter((_, idx) => idx !== i))} style={btnRemover} aria-label="Remover destaque">✕</button>
                  </div>
                ))}
                <button onClick={() => set("homeSobreItens", [...dados.homeSobreItens, { titulo: "", descricao: "" }])} style={btnPequeno}>+ Adicionar destaque</button>
              </div>
            </div>
          </div>

          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Números em destaque</div>
              <div style={cardSub}>A faixa de números da página inicial. Ex.: &quot;342+&quot; e &quot;Imóveis Vendidos&quot;</div>
            </div>
            <div style={cardBody}>
              {dados.numeros.map((n, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 1fr auto", gap: "12px", marginBottom: "12px", alignItems: "center" }}>
                  <input type="text" style={fieldInput} value={n.valor} onChange={(e) => setNumero(i, "valor", e.target.value)} aria-label="Número" />
                  <input type="text" style={fieldInput} value={n.rotulo} onChange={(e) => setNumero(i, "rotulo", e.target.value)} aria-label="Legenda" />
                  <button onClick={() => set("numeros", dados.numeros.filter((_, idx) => idx !== i))} style={btnRemover} aria-label="Remover número">✕</button>
                </div>
              ))}
              {dados.numeros.length < 4 && (
                <button onClick={() => set("numeros", [...dados.numeros, { valor: "", rotulo: "" }])} style={btnPequeno}>+ Adicionar número</button>
              )}
            </div>
          </div>

          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Sobre a imobiliária</div>
              <div style={cardSub}>Texto da página Sobre</div>
            </div>
            <div style={cardBody}>
              <textarea style={{ ...textarea, minHeight: "160px" }} value={dados.sobreTexto} onChange={(e) => set("sobreTexto", e.target.value)} placeholder="Conte a história da imobiliária, como trabalha e onde atua..." />
            </div>
          </div>

          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Depoimentos de clientes</div>
              <div style={cardSub}>Aparecem na página Sobre</div>
            </div>
            <div style={cardBody}>
              {dados.depoimentos.map((d, i) => (
                <div key={i} style={{ border: "1px solid var(--neutral-100)", borderRadius: "10px", padding: "16px", marginBottom: "12px" }}>
                  <div style={{ display: "flex", gap: "12px", marginBottom: "10px", alignItems: "center" }}>
                    <input type="text" style={fieldInput} value={d.nome} onChange={(e) => setDepoimento(i, "nome", e.target.value)} placeholder="Nome do cliente" />
                    <button onClick={() => set("depoimentos", dados.depoimentos.filter((_, idx) => idx !== i))} style={btnRemover}>✕ Remover</button>
                  </div>
                  <textarea style={{ ...textarea, minHeight: "70px" }} value={d.texto} onChange={(e) => setDepoimento(i, "texto", e.target.value)} placeholder="O que o cliente disse..." />
                </div>
              ))}
              <button onClick={() => set("depoimentos", [...dados.depoimentos, { nome: "", texto: "" }])} style={btnPequeno}>+ Adicionar depoimento</button>
            </div>
          </div>
        </div>

        {/* COLUNA LATERAL */}
        <div>
          <div style={{ ...card, marginBottom: "16px" }}>
            <div style={{ ...cardHeader, padding: "16px 20px" }}>
              <div style={cardTitle}>Contato principal</div>
              <div style={cardSub}>Usado nos botões gerais do site e na página Contato</div>
            </div>
            <div style={{ padding: "20px" }}>
              <div style={fieldGroup}>
                <label style={fieldLabel}>WhatsApp da imobiliária <Obrigatorio /></label>
                <CampoWhatsapp valor={dados.whatsapp} onChange={(v) => set("whatsapp", v)} />
                <div style={fieldHint}>DDD + número. Recebe os contatos que não são de um imóvel específico.</div>
              </div>
              <div style={fieldGroup}>
                <label style={fieldLabel}>E-mail</label>
                <input type="email" style={fieldInput} value={dados.email} onChange={(e) => set("email", e.target.value)} />
              </div>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Endereço</label>
                <input type="text" style={fieldInput} value={dados.endereco} onChange={(e) => set("endereco", e.target.value)} placeholder="Rua, número — bairro, cidade" />
              </div>
              <div>
                <label style={fieldLabel}>Horário de atendimento</label>
                <input type="text" style={fieldInput} value={dados.horario} onChange={(e) => set("horario", e.target.value)} placeholder="Seg a sex, 9h às 18h" />
              </div>
            </div>
          </div>

          <div style={{ ...card, marginBottom: "16px" }}>
            <div style={{ ...cardHeader, padding: "16px 20px" }}>
              <div style={cardTitle}>Redes sociais</div>
              <div style={cardSub}>Deixe em branco as que não usa</div>
            </div>
            <div style={{ padding: "20px" }}>
              {([
                { campo: "instagram", l: "Instagram", p: "@kl.imoveis" },
                { campo: "facebook", l: "Facebook", p: "facebook.com/..." },
                { campo: "linkedin", l: "LinkedIn", p: "linkedin.com/company/..." },
                { campo: "youtube", l: "YouTube", p: "youtube.com/@..." },
              ] as const).map((r, i, arr) => (
                <div key={r.campo} style={{ marginBottom: i < arr.length - 1 ? "16px" : 0 }}>
                  <label style={fieldLabel}>{r.l}</label>
                  <input type="text" style={fieldInput} placeholder={r.p} value={dados[r.campo]} onChange={(e) => set(r.campo, e.target.value)} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button id="topbar-salvar" onClick={salvar} disabled={salvando} style={{ ...btnPrimary, opacity: salvando ? 0.7 : 1 }}>
              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>
            <a href="/" target="_blank" style={btnOutline}>↗ Ver site</a>
            <div style={{ ...fieldHint, textAlign: "center" }}>Imagens e fotos do carrossel são salvas na hora; os textos, ao clicar em Salvar.</div>
          </div>
        </div>
      </div>
    </>
  );
}

// Uma imagem só (logo, ícone, foto do Sobre): prévia + Enviar/Trocar + Remover.
function CampoImagem({ url, enviando, texto, altura, largura, ajuste, fundoEscuro, onEnviar, onRemover }: {
  url: string | null;
  enviando: boolean;
  texto: string;
  altura: number;
  largura?: number;
  ajuste: "contain" | "cover";
  fundoEscuro?: boolean;
  onEnviar: (arquivo: File) => void;
  onRemover: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
      <div style={{
        width: largura ?? "100%", maxWidth: largura ? undefined : "320px", height: altura, borderRadius: "10px",
        border: url ? "1px solid var(--neutral-200)" : "2px dashed var(--neutral-200)",
        background: fundoEscuro ? "var(--navy-900)" : "var(--neutral-50)",
        display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0,
      }}>
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: ajuste, padding: ajuste === "contain" ? "12px" : 0 }} />
        ) : (
          <span style={{ fontSize: "28px", opacity: 0.5 }}>🖼</span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: "200px" }}>
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onEnviar(f); e.target.value = ""; }} />
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          <button onClick={() => input.current?.click()} disabled={enviando} style={{ ...btnPrimary, padding: "9px 18px", opacity: enviando ? 0.7 : 1 }}>
            {enviando ? "Enviando..." : url ? "Trocar" : "Enviar imagem"}
          </button>
          {url && !enviando && (
            <button onClick={onRemover} style={{ ...btnOutline, padding: "9px 18px", color: "var(--neutral-400)" }}>Remover</button>
          )}
        </div>
        <div style={{ ...fieldHint, marginTop: 0 }}>{texto}</div>
      </div>
    </div>
  );
}

function Carrossel({ fotos, enviando, onAdicionar, onMover, onRemover }: {
  fotos: string[];
  enviando: boolean;
  onAdicionar: (arquivos: FileList) => void;
  onMover: (i: number, direcao: -1 | 1) => void;
  onRemover: (url: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "12px", marginBottom: "12px" }}>
        {fotos.map((url, i) => (
          <div key={url} style={{ position: "relative", aspectRatio: "3/4", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--neutral-200)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Foto ${i + 1} do carrossel`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <span style={{ position: "absolute", top: "6px", left: "6px", ...btnIcone, cursor: "default" }}>{i + 1}</span>
            <button onClick={() => onRemover(url)} style={{ ...btnIcone, position: "absolute", top: "6px", right: "6px" }} aria-label="Remover foto">✕</button>
            <div style={{ position: "absolute", bottom: "6px", left: "6px", right: "6px", display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => onMover(i, -1)} disabled={i === 0} style={{ ...btnIcone, opacity: i === 0 ? 0.3 : 1 }} aria-label="Mover para antes">←</button>
              <button onClick={() => onMover(i, 1)} disabled={i === fotos.length - 1} style={{ ...btnIcone, opacity: i === fotos.length - 1 ? 0.3 : 1 }} aria-label="Mover para depois">→</button>
            </div>
          </div>
        ))}
      </div>
      <input ref={input} type="file" multiple accept="image/jpeg,image/png,image/webp" style={{ display: "none" }}
        onChange={(e) => { if (e.target.files?.length) onAdicionar(e.target.files); e.target.value = ""; }} />
      <button onClick={() => input.current?.click()} disabled={enviando} style={{ ...btnPequeno, opacity: enviando ? 0.6 : 1 }}>
        {enviando ? "Enviando fotos..." : "+ Adicionar fotos"}
      </button>
      {fotos.length === 0 && !enviando && (
        <div style={{ ...fieldHint }}>Sem fotos, o site mostra o nome da imobiliária no lugar do carrossel.</div>
      )}
    </>
  );
}
