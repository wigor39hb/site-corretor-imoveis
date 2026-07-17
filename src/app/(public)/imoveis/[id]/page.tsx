"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const WA_SVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const thumbBgs = [
  "linear-gradient(135deg,#122236,#1B3A5C)",
  "linear-gradient(135deg,#1a2a3a,#2a3a5a)",
  "linear-gradient(135deg,#1a1a2a,#2a2a3a)",
  "linear-gradient(135deg,#1a2a1a,#2a3a2a)",
];

export default function ImovelDetalhePage() {
  const [activeThumb, setActiveThumb] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* BREADCRUMB */}
      <div style={{ maxWidth: "1200px", margin: "0 auto" }} className="detail-breadcrumb-wrap">
        <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "20px" }}>
          <Link href="/" style={{ fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--neutral-400)", textDecoration: "none" }}>Início</Link>
          <span style={{ color: "var(--neutral-200)" }}>/</span>
          <Link href="/imoveis" style={{ fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--neutral-400)", textDecoration: "none" }}>Imóveis</Link>
          <span style={{ color: "var(--neutral-200)" }}>/</span>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--navy-900)", fontWeight: 500 }}>Penthouse Jardins</span>
        </div>
      </div>

      {/* GALERIA */}
      <div className="gallery-section-pad">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ aspectRatio: "16/9", background: thumbBgs[activeThumb], position: "relative", overflow: "hidden", marginBottom: "12px" }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", opacity: 0.25 }}>
              <svg width="64" height="64" fill="none" stroke="white" strokeWidth="0.8" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#fff" }}>Foto Principal do Imóvel</span>
            </div>
            <span style={{ position: "absolute", top: "24px", left: "24px", fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--navy-900)", background: "var(--gold-500)", padding: "8px 16px" }}>Lançamento</span>
            <span style={{ position: "absolute", bottom: "24px", right: "24px", fontFamily: "var(--font-sans)", fontSize: "12px", color: "rgba(255,255,255,0.7)", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", padding: "6px 14px" }}>1 / 12 fotos</span>
          </div>
          <div className="gallery-thumbs-grid">
            {thumbBgs.map((bg, i) => (
              <div key={i} className={`gallery-thumb${activeThumb === i ? " active" : ""}`} style={{ aspectRatio: "4/3", background: bg, position: "relative", overflow: "hidden" }} onClick={() => setActiveThumb(i)}>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.3 }}>
                  <svg width="24" height="24" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DETALHE LAYOUT */}
      <div className="detail-layout">

        {/* MAIN */}
        <div>
          <div className="detail-tipo reveal">Cobertura</div>
          <h1 className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, color: "var(--navy-900)", lineHeight: 1.15, marginBottom: "16px" }}>Penthouse Jardins</h1>
          <div className="reveal reveal-delay-1" style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--neutral-600)", marginBottom: "32px" }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ opacity: 0.5 }}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
            Rua Oscar Freire, 1250 — Jardins, São Paulo - SP
          </div>

          {/* SPECS BAR */}
          <div className="detail-specs-bar reveal reveal-delay-2">
            {[["4","Quartos"],["2","Suítes"],["3","Vagas"],["280m²","Área Útil"],["320m²","Área Total"]].map(([v,l]) => (
              <div key={l} className="detail-spec-item">
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "20px", fontWeight: 600, color: "var(--navy-900)", lineHeight: 1, marginBottom: "6px" }}>{v}</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--neutral-400)" }}>{l}</div>
              </div>
            ))}
          </div>

          {/* DESCRIÇÃO */}
          <div className="reveal">
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 600, color: "var(--navy-900)", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--neutral-200)" }}>Descrição</div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 300, lineHeight: 1.9, color: "var(--neutral-600)", marginBottom: "16px" }}>
              Cobertura duplex de alto padrão no coração dos Jardins, com acabamentos de primeira linha e vista panorâmica para a cidade. O imóvel conta com terraço privativo de 40m², sala de estar com pé-direito duplo, cozinha gourmet integrada e suíte master com closet e banheiro com banheira de imersão.
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 300, lineHeight: 1.9, color: "var(--neutral-600)", marginBottom: "40px" }}>
              O empreendimento oferece estrutura completa: salão de festas, academia, piscina coberta aquecida, spa e concierge 24h. Localização privilegiada a 5 minutos do shopping JK Iguatemi e dos melhores restaurantes da cidade.
            </p>
          </div>

          {/* DIFERENCIAIS */}
          <div className="reveal">
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 600, color: "var(--navy-900)", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--neutral-200)" }}>Diferenciais</div>
            <div className="detail-features" style={{ marginBottom: "40px" }}>
              {["Terraço privativo de 40m²","Pé-direito duplo na sala","Cozinha gourmet com ilha","Banheira de imersão","Closet na suíte master","Automação residencial","Ar-condicionado central","Vista panorâmica cidade"].map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--neutral-600)" }}>
                  <div style={{ width: "6px", height: "6px", background: "var(--gold-500)", flexShrink: 0 }} />{f}
                </div>
              ))}
            </div>
          </div>

          {/* TABELA */}
          <div className="reveal">
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 600, color: "var(--navy-900)", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--neutral-200)" }}>Detalhes do Imóvel</div>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "40px" }}>
              <tbody>
                {[["Tipo","Cobertura Duplex"],["Finalidade","Venda — Lançamento"],["Área Útil","280 m²"],["Área Total","320 m²"],["Quartos","4 (sendo 2 suítes)"],["Banheiros","5"],["Vagas","3 (cobertas)"],["Andar","Cobertura — 18º e 19º"],["Condomínio","R$ 3.200/mês"],["IPTU","R$ 1.800/mês"]].map(([label, value]) => (
                  <tr key={label} style={{ borderBottom: "1px solid var(--neutral-200)" }}>
                    <td style={{ padding: "14px 0", fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--neutral-400)", width: "40%" }}>{label}</td>
                    <td style={{ padding: "14px 0", fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--neutral-900)", fontWeight: 500 }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* LOCALIZAÇÃO */}
          <div className="reveal">
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 600, color: "var(--navy-900)", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--neutral-200)" }}>Localização</div>
            <div style={{ height: "280px", background: "linear-gradient(135deg,var(--navy-800),var(--navy-700))", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", border: "1px solid rgba(201,169,110,0.15)" }}>
              <svg width="40" height="40" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24" style={{ opacity: 0.3 }}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Jardins, São Paulo — SP</span>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="detail-sidebar">
          <div className="detail-sidebar-card reveal">
            <div className="detail-price-value">R$ 4.200.000</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--neutral-400)", marginBottom: "24px" }}>Valor de Venda</div>
            <div style={{ height: "1px", background: "var(--neutral-200)", margin: "0 0 24px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
              {[["Área útil","280 m²"],["Quartos","4 quartos"],["Suítes","2 suítes"],["Vagas","3 vagas"],["Condomínio","R$ 3.200/mês"]].map(([l,v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--neutral-400)" }}>{l}</span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600, color: "var(--navy-900)" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <a href="https://wa.me/5511999999999" className="btn-whatsapp"><WA_SVG /> Falar no WhatsApp</a>
              <Link href="/contato" className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "16px", textDecoration: "none" }}>Solicitar Visita</Link>
              <a href="mailto:joao@corretor.com" className="btn-outline">Enviar E-mail</a>
            </div>
          </div>
          <div style={{ background: "var(--navy-900)", padding: "24px", display: "flex", alignItems: "center", gap: "16px" }} className="reveal reveal-delay-1">
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="24" height="24" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "16px", fontWeight: 600, color: "#fff", marginBottom: "3px" }}>João Corretor</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--gold-400)", letterSpacing: "0.1em" }}>Corretor CRECI-SP 000000-F</div>
            </div>
          </div>
        </div>
      </div>

      {/* SIMILARES */}
      <section className="similares-section-pad">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="section-tag reveal" style={{ marginBottom: "8px" }}>Você também pode gostar</div>
          <h2 className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px,3.5vw,40px)", fontWeight: 700, lineHeight: 1.15, color: "var(--navy-900)", marginBottom: "40px" }}>
            Imóveis <em style={{ fontStyle: "italic", color: "var(--navy-700)" }}>similares</em>
          </h2>
          <div className="similares-grid">
            {[
              { nome: "Residencial Vila Nova", tipo: "Apartamento", local: "Vila Nova Conceição", preco: "R$ 1.850.000", bg: "linear-gradient(135deg,#122236,#1B3A5C)", badge: "À Venda" },
              { nome: "Cobertura Brooklin", tipo: "Cobertura Duplex", local: "Brooklin, SP", preco: "R$ 25.000/mês", bg: "linear-gradient(135deg,#1a1a2a,#2a2a4a)", badge: "Para Alugar" },
              { nome: "Villa Morumbi", tipo: "Casa com Piscina", local: "Morumbi, SP", preco: "R$ 9.500.000", bg: "linear-gradient(135deg,#1a2a1a,#2a4a2a)", badge: "À Venda" },
            ].map((im, i) => (
              <div key={im.nome} className={`imovel-card reveal${i === 1 ? " reveal-delay-1" : i === 2 ? " reveal-delay-2" : ""}`}>
                <div style={{ aspectRatio: "4/3", background: im.bg, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.3 }}>
                    <svg width="40" height="40" fill="none" stroke="white" strokeWidth="1" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                  </div>
                  <div className="imovel-thumb-overlay" />
                  <span style={{ position: "absolute", top: "16px", left: "16px", fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--navy-900)", background: "var(--gold-500)", padding: "6px 12px" }}>{im.badge}</span>
                </div>
                <div style={{ padding: "24px" }}>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--neutral-400)", marginBottom: "8px" }}>{im.tipo}</div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 600, color: "var(--navy-900)", marginBottom: "8px", lineHeight: 1.3 }}>{im.nome}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--neutral-600)", marginBottom: "16px" }}>{im.local}</div>
                  <div style={{ height: "1px", background: "var(--neutral-200)", marginBottom: "16px" }} />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 700, color: "var(--navy-900)" }}>{im.preco}</div>
                    <Link href="/imoveis/1" className="imovel-cta-link">Ver mais →</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
