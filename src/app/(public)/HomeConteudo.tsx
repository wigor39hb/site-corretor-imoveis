"use client";

import { useEffect } from "react";
import Link from "next/link";
import { whatsappLink } from "@/lib/helpers/whatsapp";
import { useConfigSite } from "@/context/ConfigSiteContext";
import { partesDestaque } from "@/lib/configuracoes";
import HeroCarrossel from "@/components/public/HeroCarrossel";
import ImovelCard from "@/components/public/ImovelCard";
import type { Imovel } from "@/lib/imoveis";

// Texto com trechos entre *asteriscos* em itálico colorido.
function TextoDestaque({ texto, cor }: { texto: string; cor: string }) {
  return (
    <>
      {partesDestaque(texto).map((p, i) =>
        p.destaque ? <em key={i} style={{ fontStyle: "italic", color: cor }}>{p.texto}</em> : <span key={i}>{p.texto}</span>
      )}
    </>
  );
}

// "342+" anima de 0 até 342; valores como "4.9★" aparecem fixos.
function numeroAnimado(valor: string) {
  const m = valor.trim().match(/^(\d+)([^\d.,].*)?$/);
  return m ? { count: m[1], suffix: m[2] ?? "" } : null;
}

export default function HomeConteudo({ imoveis }: { imoveis: Imovel[] }) {
  const config = useConfigSite();
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
            const suffix = el.dataset.suffix ?? "";
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
              {config.heroFrase}
            </div>
            <h1 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(42px, 5.5vw, 68px)", fontWeight: 700, lineHeight: 1.08,
              color: "#fff", marginBottom: "24px",
              opacity: 0, animation: "fadeUp 0.9s var(--ease-luxury) 0.4s forwards",
            }}>
              <TextoDestaque texto={config.heroTitulo} cor="var(--gold-400)" />
            </h1>
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: "16px", fontWeight: 300, lineHeight: 1.8,
              color: "rgba(255,255,255,0.6)", maxWidth: "420px", marginBottom: "48px",
              opacity: 0, animation: "fadeUp 0.9s var(--ease-luxury) 0.6s forwards",
            }}>
              {config.heroTexto}
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
                Conheça nosso trabalho
              </Link>
            </div>
          </div>

          {/* Visual */}
          <div
            className="hero-visual-col"
            style={{ position: "relative", opacity: 0, animation: "fadeIn 1.2s var(--ease-luxury) 0.5s forwards" }}
          >
            <div style={{ position: "relative", aspectRatio: "3/4", maxHeight: "560px" }}>
              <div style={{ position: "absolute", inset: 0, border: "1px solid rgba(201,169,110,0.2)", overflow: "hidden" }}>
                <HeroCarrossel fotos={config.carrossel} nome={config.nomeCurto} />
              </div>
              {/* Corner decorations */}
              <div style={{ position: "absolute", top: "-1px", left: "-1px", width: "60px", height: "60px", borderTop: "2px solid var(--gold-500)", borderLeft: "2px solid var(--gold-500)" }} />
              <div style={{ position: "absolute", bottom: "-1px", right: "-1px", width: "60px", height: "60px", borderBottom: "2px solid var(--gold-500)", borderRight: "2px solid var(--gold-500)" }} />
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
          {config.numeros.map((n) => ({ ...numeroAnimado(n.valor), fixed: n.valor, label: n.rotulo })).map((stat, i, lista) => (
            <div
              key={i}
              className={`stat-item reveal${i > 0 ? ` reveal-delay-${i}` : ""}`}
              style={{
                padding: "36px 0", textAlign: "center",
                borderRight: i < lista.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
              }}
            >
              {stat.count ? (
                <div
                  data-count={stat.count}
                  data-suffix={stat.suffix}
                  style={{ fontFamily: "var(--font-serif)", fontSize: "40px", fontWeight: 700, color: "var(--gold-400)", lineHeight: 1, marginBottom: "8px" }}
                >
                  {`0${stat.suffix}`}
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
                Seleção de imóveis para comprar e alugar, escolhidos pela nossa equipe.
              </p>
            </div>
            <Link href="/imoveis" className="imoveis-link reveal">
              Ver todos os imóveis
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>

          {imoveis.length > 0 ? (
            <div className="imoveis-grid-3">
              {imoveis.map((im, i) => (
                <ImovelCard key={im.id} imovel={im} className={i === 1 ? "reveal-delay-1" : i === 2 ? "reveal-delay-2" : ""} />
              ))}
            </div>
          ) : (
            <p className="reveal" style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--neutral-600)" }}>
              Em breve, novos imóveis por aqui. <Link href="/contato" style={{ color: "var(--gold-500)" }}>Fale com a nossa equipe</Link>.
            </p>
          )}
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
                {config.sobreFotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={config.sobreFotoUrl} alt={config.nome} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: 700, color: "rgba(201,169,110,0.35)", textAlign: "center", padding: "24px" }}>
                    {config.nomeCurto}
                  </div>
                )}
              </div>
              <div style={{ position: "absolute", bottom: "-20px", right: "-20px", width: "200px", height: "200px", border: "1px solid rgba(201,169,110,0.3)", zIndex: -1 }} />
            </div>

            {/* Text */}
            <div>
              <div className="reveal" style={{ display: "inline-flex", alignItems: "center", gap: "12px", fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-500)", marginBottom: "20px" }}>
                <span style={{ display: "block", width: "32px", height: "1px", background: "var(--gold-500)" }} />
                Sobre Nós
              </div>
              <h2 className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, lineHeight: 1.15, color: "var(--navy-900)" }}>
                <TextoDestaque texto={config.homeSobreTitulo} cor="var(--navy-700)" />
              </h2>
              <p className="reveal reveal-delay-2" style={{ fontFamily: "var(--font-sans)", fontSize: "16px", fontWeight: 300, lineHeight: 1.9, color: "var(--neutral-600)", marginTop: "32px", marginBottom: "40px" }}>
                {config.homeSobreTexto}
              </p>
              <div className="reveal reveal-delay-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "48px" }}>
                {config.homeSobreItens.map(({ titulo: title, descricao: desc }) => (
                  <div key={title} className="about-spec-item">
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: "14px", fontWeight: 600, color: "var(--navy-900)", marginBottom: "4px" }}>{title}</div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--neutral-600)", lineHeight: 1.6 }}>{desc}</div>
                  </div>
                ))}
              </div>
              <Link href="/contato" className="btn-primary reveal reveal-delay-4">
                Fale Conosco
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
              Conte para nós o que você está procurando. Sem compromisso, sem pressão — só resultado.
            </p>
          </div>
          <div className="cta-actions-col reveal reveal-delay-2" style={{ display: "flex", flexDirection: "column", gap: "12px", minWidth: "220px" }}>
            <a href={whatsappLink(config.whatsapp, `Olá! Vim pelo site da ${config.nomeCurto}.`)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
            <a href={`mailto:${config.email}`} className="btn-outline-gold">
              Enviar E-mail
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
