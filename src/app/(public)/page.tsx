"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { whatsappLink } from "@/lib/helpers/whatsapp";

export default function HomePage() {
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            revealObserver.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

    const animateCount = (el: Element, target: number, suffix: string) => {
      let startTime = 0;
      const duration = 1800;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            const target = parseInt(el.dataset.count || "0");
            const suffix = el.dataset.suffix || "+";
            animateCount(e.target, target, suffix);
            countObserver.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));

    return () => {
      revealObserver.disconnect();
      countObserver.disconnect();
    };
  }, []);

  return (
    <div>
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section style={{ position: "relative", minHeight: "100vh", background: "var(--navy-900)", display: "flex", alignItems: "center", overflow: "hidden" }}>
        {/* Background */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(27,58,92,0.6) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(201,169,110,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 85% 20%, rgba(45,89,134,0.3) 0%, transparent 60%)",
          animation: "bgPulse 8s ease-in-out infinite alternate",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(201,169,110,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
        }} />
        <div style={{
          position: "absolute", width: "500px", height: "500px", borderRadius: "50%",
          filter: "blur(80px)",
          background: "radial-gradient(circle, rgba(45,89,134,0.35) 0%, transparent 70%)",
          top: "-100px", right: "-50px",
          animation: "orbFloat 10s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", width: "300px", height: "300px", borderRadius: "50%",
          filter: "blur(80px)",
          background: "radial-gradient(circle, rgba(201,169,110,0.15) 0%, transparent 70%)",
          bottom: "50px", left: "10%",
          animation: "orbFloat 10s ease-in-out infinite",
          animationDelay: "-4s",
        }} />

        {/* Content grid */}
        <div className="hero-content-grid" style={{ position: "relative", zIndex: 2 }}>
          {/* Text */}
          <div>
            <div
              className="hero-tag-wrap"
              style={{
                display: "inline-flex", alignItems: "center", gap: "10px",
                fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 500,
                letterSpacing: "0.2em", textTransform: "uppercase",
                color: "var(--gold-400)", marginBottom: "28px",
                opacity: 0, animation: "fadeUp 0.8s var(--ease-luxury) 0.2s forwards",
              }}
            >
              <span style={{ display: "block", width: "40px", height: "1px", background: "var(--gold-500)" }} />
              Especialista em Alto Padrão
            </div>
            <h1 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(42px, 5.5vw, 68px)", fontWeight: 700, lineHeight: 1.08,
              color: "#fff", marginBottom: "24px",
              opacity: 0, animation: "fadeUp 0.9s var(--ease-luxury) 0.4s forwards",
            }}>
              Seu próximo<br />imóvel começa<br />com <em style={{ fontStyle: "italic", color: "var(--gold-400)" }}>quem entende</em>
            </h1>
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: "16px", fontWeight: 300, lineHeight: 1.8,
              color: "rgba(255,255,255,0.6)", maxWidth: "420px", marginBottom: "48px",
              opacity: 0, animation: "fadeUp 0.9s var(--ease-luxury) 0.6s forwards",
            }}>
              Mais de 10 anos conectando famílias e investidores aos melhores imóveis de São Paulo. Atendimento exclusivo, resultado garantido.
            </p>
            <div
              className="hero-actions-wrap"
              style={{
                display: "flex", gap: "16px", flexWrap: "wrap",
                opacity: 0, animation: "fadeUp 0.9s var(--ease-luxury) 0.8s forwards",
              }}
            >
              <Link href="/imoveis" className="btn-primary">
                Ver Imóveis
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link href="/sobre" className="btn-secondary">
                Conheça meu trabalho
              </Link>
            </div>
          </div>

          {/* Visual */}
          <div
            className="hero-visual-col"
            style={{ position: "relative", opacity: 0, animation: "fadeIn 1.2s var(--ease-luxury) 0.5s forwards" }}
          >
            <div style={{ position: "relative", aspectRatio: "3/4", maxHeight: "560px" }}>
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(135deg, var(--navy-700) 0%, var(--navy-800) 100%)",
                border: "1px solid rgba(201,169,110,0.2)",
              }} />
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px",
              }}>
                <div style={{
                  width: "80px", height: "80px", borderRadius: "50%",
                  background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="36" height="36" fill="none" stroke="white" strokeWidth="1.2" viewBox="0 0 24 24" style={{ opacity: 0.5 }}>
                    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                </div>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                  Foto do Corretor
                </span>
              </div>
              {/* Corner decorations */}
              <div style={{ position: "absolute", top: "-1px", left: "-1px", width: "60px", height: "60px", borderTop: "2px solid var(--gold-500)", borderLeft: "2px solid var(--gold-500)" }} />
              <div style={{ position: "absolute", bottom: "-1px", right: "-1px", width: "60px", height: "60px", borderBottom: "2px solid var(--gold-500)", borderRight: "2px solid var(--gold-500)" }} />
            </div>

            {/* Float card 1 */}
            <div style={{
              position: "absolute", bottom: "-20px", left: "-40px",
              background: "rgba(13,27,42,0.85)", backdropFilter: "blur(20px)",
              border: "1px solid rgba(201,169,110,0.2)", padding: "20px 24px",
              animation: "cardFloat 6s ease-in-out infinite",
            }}>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold-400)", marginBottom: "6px" }}>Imóveis Vendidos</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 700, color: "#fff", lineHeight: 1 }}>342+</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>em 10 anos de atuação</div>
            </div>

            {/* Float card 2 */}
            <div style={{
              position: "absolute", top: "40px", right: "-40px",
              background: "rgba(13,27,42,0.85)", backdropFilter: "blur(20px)",
              border: "1px solid rgba(201,169,110,0.2)", padding: "20px 24px",
              animation: "cardFloat 6s ease-in-out infinite",
              animationDelay: "-3s",
            }}>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold-400)", marginBottom: "6px" }}>Avaliação</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 700, color: "#fff", lineHeight: 1 }}>★ 4.9</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>120 clientes satisfeitos</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
          opacity: 0, animation: "fadeIn 1s var(--ease-luxury) 1.4s forwards",
        }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Scroll</span>
          <div style={{ width: "1px", height: "50px", background: "linear-gradient(to bottom, rgba(201,169,110,0.8), transparent)", animation: "scrollPulse 2s ease-in-out infinite" }} />
        </div>
      </section>

      {/* ─── STATS BAR ───────────────────────────────────────── */}
      <div style={{ background: "var(--navy-700)", borderTop: "1px solid rgba(201,169,110,0.15)", borderBottom: "1px solid rgba(201,169,110,0.15)" }}>
        <div className="stats-grid-4">
          {[
            { count: "10", suffix: "+", label: "Anos de Experiência" },
            { count: "342", suffix: "+", label: "Imóveis Vendidos" },
            { count: "120", suffix: "+", label: "Clientes Atendidos" },
            { fixed: "4.9★", label: "Avaliação Média" },
          ].map((stat, i) => (
            <div
              key={i}
              className={`stat-item reveal${i > 0 ? ` reveal-delay-${i}` : ""}`}
              style={{
                padding: "36px 0", textAlign: "center",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none",
              }}
            >
              {stat.count ? (
                <div
                  data-count={stat.count}
                  data-suffix={stat.suffix}
                  style={{ fontFamily: "var(--font-serif)", fontSize: "40px", fontWeight: 700, color: "var(--gold-400)", lineHeight: 1, marginBottom: "8px" }}
                >
                  0+
                </div>
              ) : (
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "40px", fontWeight: 700, color: "var(--gold-400)", lineHeight: 1, marginBottom: "8px" }}>
                  {stat.fixed}
                </div>
              )}
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── IMÓVEIS EM DESTAQUE ──────────────────────────────── */}
      <section className="section-padded" style={{ background: "var(--neutral-50)" }}>
        <div className="section-inner-wrap">
          <div className="imoveis-header-row">
            <div>
              <div className="reveal" style={{ display: "inline-flex", alignItems: "center", gap: "12px", fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-500)", marginBottom: "20px" }}>
                <span style={{ display: "block", width: "32px", height: "1px", background: "var(--gold-500)" }} />
                Portfólio
              </div>
              <h2 className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, lineHeight: 1.15, color: "var(--navy-900)", marginBottom: "16px" }}>
                Imóveis em <em style={{ fontStyle: "italic", color: "var(--navy-700)" }}>destaque</em>
              </h2>
              <p className="reveal reveal-delay-2" style={{ fontFamily: "var(--font-sans)", fontSize: "16px", fontWeight: 300, lineHeight: 1.8, color: "var(--neutral-600)", maxWidth: "520px" }}>
                Seleção exclusiva de imóveis para compra e locação nas melhores regiões de São Paulo.
              </p>
            </div>
            <Link href="/imoveis" className="imoveis-link reveal">
              Ver todos os imóveis
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>

          <div className="imoveis-grid-3">
            {[
              { badge: "À Venda", tipo: "Apartamento", nome: "Residencial Vila Nova", local: "Vila Nova Conceição, SP", q: "3", v: "2", a: "120m²", price: "R$ 1.850.000", priceLabel: "Valor de Venda", delay: "" },
              { badge: "Lançamento", tipo: "Cobertura", nome: "Penthouse Jardins", local: "Jardins, SP", q: "4", v: "3", a: "280m²", price: "R$ 4.200.000", priceLabel: "Valor de Venda", delay: "reveal-delay-1" },
              { badge: "Para Alugar", tipo: "Casa", nome: "Casa Alto da Boa Vista", local: "Alto da Boa Vista, SP", q: "5", v: "4", a: "450m²", price: "R$ 18.500/mês", priceLabel: "Aluguel Mensal", delay: "reveal-delay-2" },
            ].map((card, i) => (
              <div key={i} className={`imovel-card reveal ${card.delay}`}>
                <div style={{ aspectRatio: "4/3", background: "linear-gradient(135deg, var(--navy-800) 0%, var(--navy-700) 100%)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.3 }}>
                    <svg width="48" height="48" fill="none" stroke="white" strokeWidth="1" viewBox="0 0 24 24">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>
                  <div className="imovel-thumb-overlay" />
                  <span style={{ position: "absolute", top: "16px", left: "16px", fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--navy-900)", background: "var(--gold-500)", padding: "6px 12px" }}>
                    {card.badge}
                  </span>
                </div>
                <div style={{ padding: "24px" }}>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--neutral-400)", marginBottom: "8px" }}>{card.tipo}</div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 600, color: "var(--navy-900)", marginBottom: "8px", lineHeight: 1.3 }}>{card.nome}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--neutral-600)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ opacity: 0.5, flexShrink: 0 }}>
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" />
                    </svg>
                    {card.local}
                  </div>
                  <div style={{ height: "1px", background: "var(--neutral-200)", marginBottom: "20px" }} />
                  <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                    {[["Quartos", card.q], ["Vagas", card.v], ["Área", card.a]].map(([label, value]) => (
                      <div key={label} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 600, color: "var(--navy-900)" }}>{value}</span>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: "10px", color: "var(--neutral-400)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: "22px", fontWeight: 700, color: "var(--navy-900)" }}>{card.price}</div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--neutral-400)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "2px" }}>{card.priceLabel}</div>
                    </div>
                    <Link href="/imoveis" className="imovel-cta-link">
                      Ver mais
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOBRE ────────────────────────────────────────────── */}
      <section className="section-padded" style={{ background: "#fff" }}>
        <div className="section-inner-wrap">
          <div className="about-grid-2">
            {/* Visual */}
            <div className="about-visual-col reveal" style={{ position: "relative" }}>
              <div style={{
                aspectRatio: "3/4", maxHeight: "520px",
                background: "linear-gradient(135deg, var(--navy-800) 0%, var(--navy-700) 100%)",
                border: "1px solid rgba(13,27,42,0.1)",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
                  <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="40" height="40" fill="none" stroke="white" strokeWidth="1.2" viewBox="0 0 24 24" style={{ opacity: 0.5 }}>
                      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  </div>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>Foto do Corretor</span>
                </div>
              </div>
              <div style={{ position: "absolute", bottom: "-20px", right: "-20px", width: "200px", height: "200px", border: "1px solid rgba(201,169,110,0.3)", zIndex: -1 }} />
              <div style={{ position: "absolute", bottom: "32px", left: "-32px", background: "var(--gold-500)", padding: "24px 28px", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "48px", fontWeight: 700, color: "var(--navy-900)", lineHeight: 1 }}>10+</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--navy-700)", marginTop: "6px" }}>Anos de<br />Experiência</div>
              </div>
            </div>

            {/* Text */}
            <div>
              <div className="reveal" style={{ display: "inline-flex", alignItems: "center", gap: "12px", fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-500)", marginBottom: "20px" }}>
                <span style={{ display: "block", width: "32px", height: "1px", background: "var(--gold-500)" }} />
                Sobre Mim
              </div>
              <h2 className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, lineHeight: 1.15, color: "var(--navy-900)" }}>
                Mais do que um corretor,<br /><em style={{ fontStyle: "italic", color: "var(--navy-700)" }}>um parceiro</em>
              </h2>
              <p className="reveal reveal-delay-2" style={{ fontFamily: "var(--font-sans)", fontSize: "16px", fontWeight: 300, lineHeight: 1.9, color: "var(--neutral-600)", marginTop: "32px", marginBottom: "40px" }}>
                Sou especialista em imóveis de alto padrão em São Paulo, com mais de uma década de experiência no mercado imobiliário. Meu trabalho vai além de mostrar imóveis — é entender o que você precisa, o seu estilo de vida, e encontrar o lugar certo para você.
              </p>
              <div className="reveal reveal-delay-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "48px" }}>
                {[
                  ["Alto Padrão", "Especialista em imóveis premium e de luxo em SP"],
                  ["CRECI Ativo", "Registro profissional e atuação 100% regularizada"],
                  ["Investimentos", "Consultoria para investidores do mercado imobiliário"],
                  ["Atendimento", "Dedicação exclusiva e personalizada a cada cliente"],
                ].map(([title, desc]) => (
                  <div key={title} className="about-spec-item">
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: "14px", fontWeight: 600, color: "var(--navy-900)", marginBottom: "4px" }}>{title}</div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--neutral-600)", lineHeight: 1.6 }}>{desc}</div>
                  </div>
                ))}
              </div>
              <Link href="/contato" className="btn-primary reveal reveal-delay-4">
                Fale Comigo
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <div style={{ background: "var(--navy-900)", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(45,89,134,0.4) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 10% 50%, rgba(201,169,110,0.06) 0%, transparent 60%)",
        }} />
        <div className="cta-grid">
          <div>
            <div className="reveal" style={{ display: "inline-flex", alignItems: "center", gap: "12px", fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-400)", marginBottom: "20px" }}>
              <span style={{ display: "block", width: "32px", height: "1px", background: "var(--gold-400)" }} />
              Vamos conversar
            </div>
            <h2 className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, lineHeight: 1.15, color: "#fff", marginBottom: "20px" }}>
              Encontre o imóvel<br />dos seus <em style={{ fontStyle: "italic", color: "var(--gold-400)" }}>sonhos</em>
            </h2>
            <p className="reveal reveal-delay-2" style={{ fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 300, lineHeight: 1.8, color: "rgba(255,255,255,0.55)", maxWidth: "480px" }}>
              Me conta o que você está procurando. Sem compromisso, sem pressão — só resultado.
            </p>
          </div>
          <div className="cta-actions-col reveal reveal-delay-2" style={{ display: "flex", flexDirection: "column", gap: "12px", minWidth: "220px" }}>
            <a href={whatsappLink(SITE.whatsapp, `Olá! Vim pelo site da ${SITE.nomeCurto}.`)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
            <a href={`mailto:${SITE.email}`} className="btn-outline-gold">
              Enviar E-mail
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
