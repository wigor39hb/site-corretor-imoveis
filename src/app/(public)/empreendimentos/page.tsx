"use client";

import { useEffect } from "react";
import Link from "next/link";

const WA_SVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const empreendimentos = [
  { id: 1, nome: "Edifício Jardins Premium", sub: "Cyrela · Jardins, São Paulo", unidades: "32 unidades", entrega: "Entrega: Dez 2026", local: "Jardins", desc: "Empreendimento de alto padrão com unidades de 120 a 280m², 3 e 4 dormitórios. Piscina aquecida, academia, spa e concierge 24h.", preco: "A partir de R$ 1.900.000", precoLabel: "Apartamentos a partir de 120m²", status: "Lançamento", statusClass: "lancamento", bg: "linear-gradient(135deg,#122236,#1B3A5C)" },
  { id: 2, nome: "Reserve Morumbi", sub: "Tecnisa · Morumbi, São Paulo", unidades: "48 unidades", entrega: "Entrega: Jun 2025", local: "Morumbi", desc: "Condomínio fechado com casas e aptos de 200 a 520m². Área verde preservada, segurança 24h, clube completo com piscinas e quadras.", preco: "A partir de R$ 2.400.000", precoLabel: "Casas e apartamentos", status: "Em Obras", statusClass: "obras", bg: "linear-gradient(135deg,#1a2a1a,#2a4a2a)" },
  { id: 3, nome: "The One Pinheiros", sub: "Even · Pinheiros, São Paulo", unidades: "64 unidades", entrega: "Entrega: Mar 2027", local: "Pinheiros", desc: "Moderno residencial com studios e aptos de 1 a 3 dorms. Rooftop com piscina, coworking, bicicletário e proximidade ao metrô.", preco: "A partir de R$ 680.000", precoLabel: "Studios e apartamentos", status: "Lançamento", statusClass: "lancamento", bg: "linear-gradient(135deg,#1a1518,#2a2030)" },
  { id: 4, nome: "Vila Nova Tower", sub: "Brookfield · Vila Nova Conceição", unidades: "18 unidades", entrega: "Entregue 2023", local: "Vila Nova Conceição", desc: "Boutique residencial exclusivo com apenas 18 unidades de alto padrão. Lobby de hotel, jardim suspenso e serviços de concierge inclusos.", preco: "A partir de R$ 3.200.000", precoLabel: "Últimas unidades disponíveis", status: "Pronto para morar", statusClass: "pronto", bg: "linear-gradient(135deg,#0d1d2a,#162840)" },
];

const statusStyle: Record<string, React.CSSProperties> = {
  lancamento: { background: "var(--gold-500)", color: "var(--navy-900)" },
  obras: { background: "rgba(13,27,42,0.8)", color: "var(--gold-400)", border: "1px solid rgba(201,169,110,0.4)" },
  pronto: { background: "rgba(37,211,102,0.15)", color: "#25D366", border: "1px solid rgba(37,211,102,0.3)" },
};

export default function EmpreendimentosPage() {
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
        <div style={{ position: "absolute", width: "600px", height: "600px", borderRadius: "50%", filter: "blur(100px)", background: "radial-gradient(circle,rgba(45,89,134,0.25) 0%,transparent 70%)", right: "-100px", top: "-100px", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <Link href="/" style={{ fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Início</Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold-400)" }}>Empreendimentos</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(36px,5vw,60px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: "16px", opacity: 0, animation: "fadeUp 0.8s var(--ease-luxury) 0.2s forwards" }}>
            Empreendimentos de <em style={{ fontStyle: "italic", color: "var(--gold-400)" }}>alto padrão</em>
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", fontWeight: 300, color: "rgba(255,255,255,0.55)", opacity: 0, animation: "fadeUp 0.8s var(--ease-luxury) 0.4s forwards" }}>
            Lançamentos e empreendimentos prontos das melhores construtoras de São Paulo.
          </p>
        </div>
      </div>

      {/* LISTAGEM */}
      <section style={{ background: "var(--neutral-50)" }} className="listing-padded">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "48px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div className="section-tag reveal" style={{ marginBottom: "12px" }}>Portfólio</div>
              <h2 className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px,3.5vw,40px)", fontWeight: 700, lineHeight: 1.15, color: "var(--navy-900)" }}>
                Todos os <em style={{ fontStyle: "italic", color: "var(--navy-700)" }}>empreendimentos</em>
              </h2>
            </div>
            <span className="reveal" style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--neutral-400)" }}>
              <strong style={{ color: "var(--navy-900)" }}>4</strong> empreendimentos
            </span>
          </div>

          <div className="emp-grid">
            {empreendimentos.map((emp, i) => (
              <Link key={emp.id} href={`/empreendimentos/${emp.id}`} className={`emp-card reveal${i % 2 === 1 ? " reveal-delay-1" : ""}`}>
                <div style={{ aspectRatio: "16/9", background: emp.bg, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.25 }}>
                    <svg width="64" height="64" fill="none" stroke="white" strokeWidth="0.8" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="15" rx="1"/><polyline points="16 7 12 3 8 7"/></svg>
                  </div>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(13,27,42,0.7) 0%,transparent 55%)" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px", zIndex: 1 }}>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{emp.nome}</div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "rgba(255,255,255,0.65)", letterSpacing: "0.05em" }}>{emp.sub}</div>
                  </div>
                  <span style={{ position: "absolute", top: "20px", right: "20px", fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", padding: "6px 14px", ...statusStyle[emp.statusClass] }}>{emp.status}</span>
                </div>
                <div style={{ padding: "24px 28px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "16px" }}>
                    {[
                      { icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>, label: emp.unidades },
                      { icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, label: emp.entrega },
                      { icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>, label: emp.local },
                    ].map(({ icon, label }) => (
                      <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--neutral-600)" }}>
                        <span style={{ opacity: 0.5, flexShrink: 0 }}>{icon}</span>{label}
                      </div>
                    ))}
                  </div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 300, lineHeight: 1.8, color: "var(--neutral-600)", marginBottom: "20px" }}>{emp.desc}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 700, color: "var(--navy-900)" }}>{emp.preco}</div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: "10px", color: "var(--neutral-400)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "2px" }}>{emp.precoLabel}</div>
                    </div>
                    <span className="emp-cta-link">Ver mais <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div style={{ background: "var(--navy-900)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 80% 50%,rgba(45,89,134,0.4) 0%,transparent 70%),radial-gradient(ellipse 40% 60% at 10% 50%,rgba(201,169,110,0.06) 0%,transparent 60%)" }} />
        <div className="cta-grid-2" style={{ position: "relative", zIndex: 1 }}>
          <div>
            <h2 className="reveal" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, lineHeight: 1.15, color: "#fff", marginBottom: "16px" }}>
              Quer saber mais sobre<br />algum <em style={{ fontStyle: "italic", color: "var(--gold-400)" }}>empreendimento</em>?
            </h2>
            <p className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 300, lineHeight: 1.8, color: "rgba(255,255,255,0.55)", maxWidth: "460px" }}>
              Me chame no WhatsApp e te mando o material completo — plantas, tabela de preços e condições de pagamento.
            </p>
          </div>
          <div className="reveal reveal-delay-1" style={{ display: "flex", flexDirection: "column", gap: "12px", minWidth: "220px" }}>
            <a href="https://wa.me/5511999999999" className="btn-whatsapp"><WA_SVG /> WhatsApp</a>
            <Link href="/contato" className="btn-outline-gold" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", textDecoration: "none" }}>Enviar Mensagem</Link>
          </div>
        </div>
      </div>
    </>
  );
}
