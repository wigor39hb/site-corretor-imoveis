"use client";

import { useEffect } from "react";
import Link from "next/link";

const WA_SVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const diferenciais = [
  { icon: <svg width="24" height="24" fill="none" stroke="var(--gold-500)" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>, title: "Rooftop Exclusivo", desc: "Piscina, lounge e vista panorâmica para a cidade" },
  { icon: <svg width="24" height="24" fill="none" stroke="var(--gold-500)" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>, title: "Concierge 24h", desc: "Serviços de hotel disponíveis o tempo todo" },
  { icon: <svg width="24" height="24" fill="none" stroke="var(--gold-500)" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>, title: "Automação Total", desc: "Iluminação, clima e segurança pelo smartphone" },
  { icon: <svg width="24" height="24" fill="none" stroke="var(--gold-500)" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>, title: "Spa Premium", desc: "Sauna, ofurô e sala de massagem" },
  { icon: <svg width="24" height="24" fill="none" stroke="var(--gold-500)" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: "Segurança Total", desc: "Vigilância 24h, câmeras e controle de acesso" },
  { icon: <svg width="24" height="24" fill="none" stroke="var(--gold-500)" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>, title: "Acabamento Importado", desc: "Mármores, madeiras e metais selecionados" },
];

const units = [
  { tipo: "Tipo 1 — 3 Dorms", specs: "120m² · 2 vagas · 2 suítes", preco: "R$ 1.900.000", avail: "● Disponível", availColor: "#25D366" },
  { tipo: "Tipo 2 — 3 Dorms", specs: "145m² · 2 vagas · 3 suítes", preco: "R$ 2.350.000", avail: "● Disponível", availColor: "#25D366" },
  { tipo: "Tipo 3 — 4 Dorms", specs: "200m² · 3 vagas · 4 suítes", preco: "R$ 3.100.000", avail: "● Últimas unidades", availColor: "var(--gold-500)" },
  { tipo: "Cobertura — 4 Dorms", specs: "280m² + terraço · 3 vagas", preco: "R$ 4.800.000", avail: "● Reservado", availColor: "var(--neutral-400)" },
];

export default function EmpreendimentoDetalhePage() {
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
      {/* HERO */}
      <div className="emp-hero-outer" style={{ background: "linear-gradient(135deg,var(--navy-900) 0%,var(--navy-700) 100%)", position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 70% 30%,rgba(45,89,134,0.5) 0%,transparent 70%),radial-gradient(ellipse 50% 50% at 20% 70%,rgba(201,169,110,0.08) 0%,transparent 60%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,169,110,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,169,110,0.03) 1px,transparent 1px)", backgroundSize: "80px 80px" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(13,27,42,0.9) 0%,rgba(13,27,42,0.3) 50%,transparent 100%)" }} />
        <div className="emp-hero-inner">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
            <Link href="/" style={{ fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Início</Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
            <Link href="/empreendimentos" style={{ fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Empreendimentos</Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold-400)" }}>Edifício Jardins Premium</span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-400)", marginBottom: "16px", opacity: 0, animation: "fadeUp 0.7s var(--ease-luxury) 0.2s forwards" }}>
            <span style={{ display: "block", width: "32px", height: "1px", background: "var(--gold-500)" }} />
            Lançamento · Cyrela
          </div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(36px,5vw,64px)", fontWeight: 700, color: "#fff", lineHeight: 1.08, marginBottom: "20px", opacity: 0, animation: "fadeUp 0.8s var(--ease-luxury) 0.35s forwards" }}>
            Edifício Jardins <em style={{ fontStyle: "italic", color: "var(--gold-400)" }}>Premium</em>
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "32px", flexWrap: "wrap", opacity: 0, animation: "fadeUp 0.8s var(--ease-luxury) 0.5s forwards" }}>
            {[
              { icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>, label: "Jardins, São Paulo" },
              { icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>, label: "32 unidades" },
              { icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, label: "Entrega Dez 2026" },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-sans)", fontSize: "13px", color: "rgba(255,255,255,0.65)" }}>
                <span style={{ opacity: 0.6 }}>{icon}</span>{label}
              </div>
            ))}
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", background: "var(--gold-500)", color: "var(--navy-900)", padding: "6px 14px" }}>Lançamento</span>
          </div>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="emp-content-grid">
        {/* MAIN */}
        <div>
          <div className="reveal">
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 600, color: "var(--navy-900)", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--neutral-200)" }}>Sobre o empreendimento</div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 300, lineHeight: 1.9, color: "var(--neutral-600)", marginBottom: "16px" }}>
              O Edifício Jardins Premium é um residencial de alto padrão localizado no coração dos Jardins, o bairro mais sofisticado de São Paulo. Com apenas 32 unidades exclusivas distribuídas em 18 andares, o empreendimento garante privacidade e um estilo de vida único.
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 300, lineHeight: 1.9, color: "var(--neutral-600)", marginBottom: "40px" }}>
              Os apartamentos de 3 e 4 dormitórios foram projetados por arquitetos renomados, com acabamentos importados e automação residencial completa. O empreendimento conta com rooftop privativo, piscina aquecida coberta, spa completo, academia com equipamentos de última geração e concierge 24 horas.
            </p>
          </div>

          <div className="reveal">
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 600, color: "var(--navy-900)", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--neutral-200)" }}>Diferenciais</div>
            <div className="diffs-grid" style={{ marginBottom: "48px" }}>
              {diferenciais.map((d) => (
                <div key={d.title} className="diff-card">
                  <div style={{ width: "48px", height: "48px", margin: "0 auto 12px", background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>{d.icon}</div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: "14px", fontWeight: 600, color: "var(--navy-900)", marginBottom: "6px" }}>{d.title}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--neutral-600)", lineHeight: 1.6 }}>{d.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal" style={{ marginBottom: "48px" }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 600, color: "var(--navy-900)", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--neutral-200)" }}>Unidades Disponíveis</div>
            <div className="units-grid">
              {units.map((u) => (
                <div key={u.tipo} className="unit-card">
                  <div>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: "15px", fontWeight: 600, color: "var(--navy-900)", marginBottom: "4px" }}>{u.tipo}</div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--neutral-400)" }}>{u.specs}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 700, color: "var(--navy-900)" }}>{u.preco}</div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "10px", color: "var(--neutral-400)", textTransform: "uppercase", letterSpacing: "0.08em" }}>A partir de</div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: u.availColor, marginTop: "4px" }}>{u.avail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="detail-sidebar">
          <div className="detail-sidebar-card reveal">
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 700, color: "var(--navy-900)", marginBottom: "4px" }}>Edifício Jardins Premium</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--neutral-400)", marginBottom: "20px" }}>Cyrela · Jardins, São Paulo</div>
            <div className="detail-price-value" style={{ fontSize: "24px" }}>A partir de R$ 1.900.000</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--neutral-400)", marginBottom: "20px" }}>Apartamentos de 120m²</div>
            <div style={{ height: "1px", background: "var(--neutral-200)", margin: "0 0 20px" }} />
            {[["Status","Lançamento","var(--gold-500)"],["Entrega","Dez 2026",""],["Unidades","32 unidades",""],["Andares","18 andares",""],["Construtora","Cyrela",""]].map(([l,v,c]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--neutral-400)" }}>{l}</span>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600, color: c || "var(--navy-900)" }}>{v}</span>
              </div>
            ))}
            <div style={{ height: "1px", background: "var(--neutral-200)", margin: "20px 0" }} />
            <a href="https://wa.me/5511999999999" className="btn-whatsapp" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "10px" }}><WA_SVG /> Tenho Interesse</a>
            <Link href="/contato" className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "16px", textDecoration: "none" }}>Solicitar Material</Link>
          </div>
          <div style={{ background: "var(--navy-900)", padding: "20px", display: "flex", alignItems: "center", gap: "14px" }} className="reveal reveal-delay-1">
            <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "15px", fontWeight: 600, color: "#fff", marginBottom: "2px" }}>João Corretor</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "10px", color: "var(--gold-400)", letterSpacing: "0.1em" }}>CRECI-SP 000000-F</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "var(--navy-900)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 80% 50%,rgba(45,89,134,0.4) 0%,transparent 70%),radial-gradient(ellipse 40% 60% at 10% 50%,rgba(201,169,110,0.06) 0%,transparent 60%)" }} />
        <div className="cta-grid-2" style={{ position: "relative", zIndex: 1 }}>
          <div>
            <h2 className="reveal" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, lineHeight: 1.15, color: "#fff", marginBottom: "16px" }}>
              Quer receber o material<br /><em style={{ fontStyle: "italic", color: "var(--gold-400)" }}>completo</em>?
            </h2>
            <p className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 300, lineHeight: 1.8, color: "rgba(255,255,255,0.55)", maxWidth: "460px" }}>
              Plantas, maquete 3D, tabela de preços e condições de financiamento. Tudo no seu WhatsApp.
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
