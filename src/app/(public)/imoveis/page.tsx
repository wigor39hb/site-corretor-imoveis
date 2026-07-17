"use client";

import { useEffect } from "react";
import Link from "next/link";

const imoveis = [
  { id: 1, tipo: "Apartamento", nome: "Residencial Vila Nova", local: "Vila Nova Conceição, SP", quartos: 3, vagas: 2, area: "120m²", preco: "R$ 1.850.000", precoLabel: "Valor de Venda", badge: "À Venda", badgeClass: "venda", bg: "linear-gradient(135deg,#122236 0%,#1B3A5C 100%)" },
  { id: 2, tipo: "Cobertura", nome: "Penthouse Jardins", local: "Jardins, SP", quartos: 4, vagas: 3, area: "280m²", preco: "R$ 4.200.000", precoLabel: "Valor de Venda", badge: "Lançamento", badgeClass: "lancamento", bg: "linear-gradient(135deg,#122236 0%,#1B3A5C 100%)" },
  { id: 3, tipo: "Casa", nome: "Casa Alto da Boa Vista", local: "Alto da Boa Vista, SP", quartos: 5, vagas: 4, area: "450m²", preco: "R$ 18.500/mês", precoLabel: "Aluguel Mensal", badge: "Para Alugar", badgeClass: "aluguel", bg: "linear-gradient(135deg,#122236 0%,#1B3A5C 100%)" },
  { id: 4, tipo: "Apartamento", nome: "Studio Itaim Bibi", local: "Itaim Bibi, SP", quartos: 1, vagas: 1, area: "42m²", preco: "R$ 780.000", precoLabel: "Valor de Venda", badge: "À Venda", badgeClass: "venda", bg: "linear-gradient(135deg,#122236 0%,#1B3A5C 100%)" },
  { id: 5, tipo: "Apartamento", nome: "Apartamento Moema", local: "Moema, SP", quartos: 2, vagas: 1, area: "85m²", preco: "R$ 6.800/mês", precoLabel: "Aluguel Mensal", badge: "Para Alugar", badgeClass: "aluguel", bg: "linear-gradient(135deg,#122236 0%,#1B3A5C 100%)" },
  { id: 6, tipo: "Apartamento", nome: "The One Pinheiros", local: "Pinheiros, SP", quartos: 3, vagas: 2, area: "110m²", preco: "R$ 1.490.000", precoLabel: "A partir de", badge: "Lançamento", badgeClass: "lancamento", bg: "linear-gradient(135deg,#122236 0%,#1B3A5C 100%)" },
  { id: 7, tipo: "Casa com Piscina", nome: "Villa Morumbi", local: "Morumbi, SP", quartos: 6, vagas: 5, area: "820m²", preco: "R$ 9.500.000", precoLabel: "Valor de Venda", badge: "À Venda", badgeClass: "venda", bg: "linear-gradient(135deg,#1a2a1a 0%,#2a4a2a 100%)" },
  { id: 8, tipo: "Cobertura Duplex", nome: "Cobertura Brooklin", local: "Brooklin, SP", quartos: 4, vagas: 3, area: "320m²", preco: "R$ 25.000/mês", precoLabel: "Aluguel Mensal", badge: "Para Alugar", badgeClass: "aluguel", bg: "linear-gradient(135deg,#1a1a2a 0%,#2a2a4a 100%)" },
  { id: 9, tipo: "Apartamento Garden", nome: "Garden Higienópolis", local: "Higienópolis, SP", quartos: 3, vagas: 2, area: "145m²", preco: "R$ 2.100.000", precoLabel: "Valor de Venda", badge: "À Venda", badgeClass: "venda", bg: "linear-gradient(135deg,#1a1518 0%,#2a2030 100%)" },
];

const badgeStyle: Record<string, React.CSSProperties> = {
  venda: { background: "var(--gold-500)", color: "var(--navy-900)" },
  aluguel: { background: "var(--navy-500)", color: "#fff" },
  lancamento: { background: "var(--navy-900)", color: "var(--gold-400)", border: "1px solid var(--gold-500)" },
};

const IconPin = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
  </svg>
);
const IconArrow = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const IconHome = () => (
  <svg width="48" height="48" fill="none" stroke="white" strokeWidth="1" viewBox="0 0 24 24">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

export default function ImoveisPage() {
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
      {/* PAGE HERO */}
      <div style={{ background: "var(--navy-900)", position: "relative", overflow: "hidden" }} className="page-hero-padded">
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,169,110,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,169,110,0.04) 1px,transparent 1px)", backgroundSize: "80px 80px" }} />
        <div style={{ position: "absolute", right: "60px", bottom: 0, width: "400px", height: "100%", background: "radial-gradient(ellipse 60% 80% at 80% 50%,rgba(45,89,134,0.3) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <Link href="/" style={{ fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Início</Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold-400)" }}>Imóveis</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(36px,5vw,60px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: "16px", opacity: 0, animation: "fadeUp 0.8s var(--ease-luxury) 0.2s forwards" }}>
            Imóveis em <em style={{ fontStyle: "italic", color: "var(--gold-400)" }}>São Paulo</em>
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", fontWeight: 300, color: "rgba(255,255,255,0.55)", opacity: 0, animation: "fadeUp 0.8s var(--ease-luxury) 0.4s forwards" }}>
            Apartamentos, casas e coberturas nas melhores regiões da cidade.
          </p>
        </div>
      </div>

      {/* FILTROS */}
      <div style={{ background: "#fff", borderBottom: "1px solid var(--neutral-200)", position: "sticky", top: "73px", zIndex: 50 }}>
        <div className="filter-bar-inner">
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--neutral-400)", whiteSpace: "nowrap", flexShrink: 0 }}>Filtrar:</span>
          <select className="filter-select" style={{ flexShrink: 0 }}><option>Tipo de imóvel</option><option>Apartamento</option><option>Casa</option><option>Cobertura</option><option>Studio</option></select>
          <select className="filter-select" style={{ flexShrink: 0 }}><option>Finalidade</option><option>À Venda</option><option>Para Alugar</option><option>Lançamento</option></select>
          <select className="filter-select" style={{ flexShrink: 0 }}><option>Quartos</option><option>1 quarto</option><option>2 quartos</option><option>3 quartos</option><option>4+ quartos</option></select>
          <select className="filter-select" style={{ flexShrink: 0 }}><option>Faixa de preço</option><option>Até R$ 500k</option><option>R$ 500k – R$ 1M</option><option>R$ 1M – R$ 3M</option><option>Acima de R$ 3M</option></select>
          <select className="filter-select" style={{ flexShrink: 0 }}><option>Bairro</option><option>Jardins</option><option>Vila Nova Conceição</option><option>Itaim Bibi</option><option>Alto da Boa Vista</option><option>Moema</option></select>
          <div className="filter-bar-divider" style={{ width: "1px", height: "28px", background: "var(--neutral-200)", margin: "0 4px", flexShrink: 0 }} />
          <span className="filter-bar-count" style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--neutral-400)", marginLeft: "auto", whiteSpace: "nowrap" }}>
            <strong style={{ color: "var(--navy-900)", fontWeight: 600 }}>9</strong> imóveis encontrados
          </span>
        </div>
      </div>

      {/* LISTAGEM */}
      <section style={{ background: "var(--neutral-50)" }} className="listing-padded">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ gap: "24px", marginBottom: "60px" }} className="imoveis-grid-3">
            {imoveis.map((im, i) => (
              <div key={im.id} className={`imovel-card reveal${i % 3 === 1 ? " reveal-delay-1" : i % 3 === 2 ? " reveal-delay-2" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={() => window.location.href = `/imoveis/${im.id}`}
              >
                <div style={{ aspectRatio: "4/3", background: im.bg, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.3 }}><IconHome /></div>
                  <div className="imovel-thumb-overlay" />
                  <span style={{ position: "absolute", top: "16px", left: "16px", fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", padding: "6px 12px", ...badgeStyle[im.badgeClass] }}>{im.badge}</span>
                </div>
                <div style={{ padding: "24px" }}>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--neutral-400)", marginBottom: "8px" }}>{im.tipo}</div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 600, color: "var(--navy-900)", marginBottom: "8px", lineHeight: 1.3 }}>{im.nome}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--neutral-600)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ opacity: 0.5, flexShrink: 0 }}><IconPin /></span>{im.local}
                  </div>
                  <div style={{ height: "1px", background: "var(--neutral-200)", marginBottom: "20px" }} />
                  <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 600, color: "var(--navy-900)" }}>{im.quartos}</span>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "10px", color: "var(--neutral-400)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Quartos</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 600, color: "var(--navy-900)" }}>{im.vagas}</span>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "10px", color: "var(--neutral-400)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Vagas</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 600, color: "var(--navy-900)" }}>{im.area}</span>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "10px", color: "var(--neutral-400)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Área</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: "22px", fontWeight: 700, color: "var(--navy-900)" }}>{im.preco}</div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--neutral-400)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "2px" }}>{im.precoLabel}</div>
                    </div>
                    <Link href={`/imoveis/${im.id}`} className="imovel-cta-link" onClick={(e) => e.stopPropagation()}>
                      Ver mais <IconArrow />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINAÇÃO */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }} className="reveal">
            <a href="#" className="page-btn" style={{ color: "var(--neutral-400)" }}>←</a>
            <a href="#" className="page-btn active">1</a>
            <a href="#" className="page-btn">2</a>
            <a href="#" className="page-btn">3</a>
            <a href="#" className="page-btn" style={{ color: "var(--neutral-400)" }}>→</a>
          </div>
        </div>
      </section>
    </>
  );
}
