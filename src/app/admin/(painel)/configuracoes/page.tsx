"use client";

import { useState } from "react";
import { useSessao } from "@/context/SessaoContext";
import { SITE } from "@/lib/site";
import {
  card, cardHeader, cardBody, cardTitle, cardSub, fieldGroup, fieldLabel, fieldInput, fieldHint,
  btnPrimary, btnOutline, Obrigatorio, AcessoRestrito, useToast, CampoWhatsapp,
} from "@/components/admin/ui";

// Valores iniciais de exemplo. Na etapa do banco, tudo isso é lido e salvo lá.
const numerosIniciais = [
  { valor: "10+", rotulo: "Anos de Experiência" },
  { valor: "342+", rotulo: "Imóveis Vendidos" },
  { valor: "120+", rotulo: "Clientes Atendidos" },
  { valor: "4.9★", rotulo: "Avaliação Média" },
];

const depoimentosIniciais = [
  { nome: "Mariana e Rafael", texto: "Atendimento impecável do começo ao fim. Encontramos o apartamento ideal em poucas semanas." },
  { nome: "Paulo Henrique", texto: "Equipe muito preparada, me ajudou a escolher um ótimo imóvel para investir." },
];

const grid2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" };
const btnPequeno: React.CSSProperties = { padding: "8px 14px", border: "1px solid var(--gold-500)", borderRadius: "8px", background: "none", fontSize: "13px", color: "var(--gold-500)", cursor: "pointer", fontFamily: "var(--font-sans)" };
const btnRemover: React.CSSProperties = { background: "none", border: "none", cursor: "pointer", color: "var(--neutral-400)", fontSize: "13px", fontFamily: "var(--font-sans)" };

export default function AdminConfiguracoesPage() {
  const { isAdmin } = useSessao();
  const { toast, mostrar } = useToast();
  const [numeros, setNumeros] = useState(numerosIniciais);
  const [depoimentos, setDepoimentos] = useState(depoimentosIniciais);
  const [whatsapp, setWhatsapp] = useState(SITE.whatsapp);

  if (!isAdmin) return <AcessoRestrito />;

  const setNumero = (i: number, campo: "valor" | "rotulo", v: string) =>
    setNumeros(numeros.map((n, idx) => (idx === i ? { ...n, [campo]: v } : n)));
  const setDepoimento = (i: number, campo: "nome" | "texto", v: string) =>
    setDepoimentos(depoimentos.map((d, idx) => (idx === i ? { ...d, [campo]: v } : d)));

  return (
    <>
      {toast}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px", alignItems: "start", maxWidth: "1200px" }} className="admin-form-grid">

        {/* COLUNA PRINCIPAL */}
        <div>
          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Identidade da imobiliária</div>
              <div style={cardSub}>Aparece no menu, no rodapé e no título das páginas</div>
            </div>
            <div style={cardBody}>
              <div style={grid2}>
                <div>
                  <label style={fieldLabel}>Nome completo <Obrigatorio /></label>
                  <input type="text" style={fieldInput} defaultValue={SITE.nome} />
                </div>
                <div>
                  <label style={fieldLabel}>Nome curto</label>
                  <input type="text" style={fieldInput} defaultValue={SITE.nomeCurto} />
                  <div style={fieldHint}>Usado onde há pouco espaço (menu do celular, painel).</div>
                </div>
              </div>
              <div style={fieldGroup}>
                <label style={fieldLabel}>CRECI da imobiliária <Obrigatorio /></label>
                <input type="text" style={fieldInput} defaultValue={SITE.creci} />
              </div>
              <div>
                <label style={fieldLabel}>Logo</label>
                <div style={{ border: "2px dashed var(--neutral-200)", borderRadius: "12px", padding: "28px 24px", textAlign: "center", cursor: "pointer" }}>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>🖼</div>
                  <div style={{ fontSize: "13px", color: "var(--neutral-400)", fontFamily: "var(--font-sans)" }}>
                    <span style={{ color: "var(--gold-500)", fontWeight: 500 }}>Clique para enviar</span> — PNG ou SVG com fundo transparente
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Página inicial</div>
              <div style={cardSub}>Textos da primeira tela do site</div>
            </div>
            <div style={cardBody}>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Frase acima do título</label>
                <input type="text" style={fieldInput} defaultValue="Especialista em Alto Padrão" />
              </div>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Título principal</label>
                <input type="text" style={fieldInput} defaultValue="Seu próximo imóvel começa com quem entende" />
              </div>
              <div>
                <label style={fieldLabel}>Texto de apresentação</label>
                <textarea style={{ ...fieldInput, resize: "vertical", minHeight: "90px", lineHeight: "1.6" }} defaultValue="Mais de 10 anos conectando famílias e investidores aos melhores imóveis de São Paulo. Atendimento exclusivo, resultado garantido." />
              </div>
            </div>
          </div>

          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Números em destaque</div>
              <div style={cardSub}>A faixa de números da página inicial</div>
            </div>
            <div style={cardBody}>
              {numeros.map((n, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "12px", marginBottom: i < numeros.length - 1 ? "12px" : 0 }}>
                  <input type="text" style={fieldInput} value={n.valor} onChange={(e) => setNumero(i, "valor", e.target.value)} aria-label="Número" />
                  <input type="text" style={fieldInput} value={n.rotulo} onChange={(e) => setNumero(i, "rotulo", e.target.value)} aria-label="Legenda" />
                </div>
              ))}
            </div>
          </div>

          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Sobre a imobiliária</div>
              <div style={cardSub}>Texto da página Sobre</div>
            </div>
            <div style={cardBody}>
              <textarea style={{ ...fieldInput, resize: "vertical", minHeight: "160px", lineHeight: "1.6" }} placeholder="Conte a história da imobiliária, como trabalha e onde atua..." />
            </div>
          </div>

          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Depoimentos de clientes</div>
              <div style={cardSub}>Aparecem nas páginas inicial e Sobre</div>
            </div>
            <div style={cardBody}>
              {depoimentos.map((d, i) => (
                <div key={i} style={{ border: "1px solid var(--neutral-100)", borderRadius: "10px", padding: "16px", marginBottom: "12px" }}>
                  <div style={{ display: "flex", gap: "12px", marginBottom: "10px", alignItems: "center" }}>
                    <input type="text" style={fieldInput} value={d.nome} onChange={(e) => setDepoimento(i, "nome", e.target.value)} placeholder="Nome do cliente" />
                    <button onClick={() => setDepoimentos(depoimentos.filter((_, idx) => idx !== i))} style={btnRemover}>✕ Remover</button>
                  </div>
                  <textarea style={{ ...fieldInput, resize: "vertical", minHeight: "70px", lineHeight: "1.6" }} value={d.texto} onChange={(e) => setDepoimento(i, "texto", e.target.value)} placeholder="O que o cliente disse..." />
                </div>
              ))}
              <button onClick={() => setDepoimentos([...depoimentos, { nome: "", texto: "" }])} style={btnPequeno}>+ Adicionar depoimento</button>
            </div>
          </div>
        </div>

        {/* COLUNA LATERAL */}
        <div>
          <div style={{ ...card, marginBottom: "16px" }}>
            <div style={{ ...cardHeader, padding: "16px 20px" }}>
              <div style={cardTitle}>Contato principal</div>
              <div style={cardSub}>Usado nos botões gerais do site</div>
            </div>
            <div style={{ padding: "20px" }}>
              <div style={fieldGroup}>
                <label style={fieldLabel}>WhatsApp da imobiliária <Obrigatorio /></label>
                <CampoWhatsapp valor={whatsapp} onChange={setWhatsapp} />
                <div style={fieldHint}>DDD + número. Recebe os contatos que não são de um imóvel específico.</div>
              </div>
              <div style={fieldGroup}>
                <label style={fieldLabel}>E-mail</label>
                <input type="email" style={fieldInput} defaultValue={SITE.email} />
              </div>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Endereço</label>
                <input type="text" style={fieldInput} placeholder="Rua, número — bairro, cidade" />
              </div>
              <div>
                <label style={fieldLabel}>Horário de atendimento</label>
                <input type="text" style={fieldInput} placeholder="Seg a sex, 9h às 18h" />
              </div>
            </div>
          </div>

          <div style={{ ...card, marginBottom: "16px" }}>
            <div style={{ ...cardHeader, padding: "16px 20px" }}><div style={cardTitle}>Redes sociais</div></div>
            <div style={{ padding: "20px" }}>
              {[
                { l: "Instagram", p: "@kl.imoveis" },
                { l: "Facebook", p: "facebook.com/..." },
                { l: "LinkedIn", p: "linkedin.com/company/..." },
                { l: "YouTube", p: "youtube.com/..." },
              ].map((r, i, arr) => (
                <div key={r.l} style={{ marginBottom: i < arr.length - 1 ? "16px" : 0 }}>
                  <label style={fieldLabel}>{r.l}</label>
                  <input type="text" style={fieldInput} placeholder={r.p} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button id="topbar-salvar" onClick={() => mostrar("Configurações salvas!")} style={btnPrimary}>Salvar alterações</button>
            <a href="/" target="_blank" style={btnOutline}>↗ Ver site</a>
          </div>
        </div>
      </div>
    </>
  );
}
