"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useConfigSite } from "@/context/ConfigSiteContext";
import { linkRede } from "@/lib/configuracoes";
import { formatWhatsapp } from "@/lib/helpers/formatters";
import { corretores } from "@/lib/mock/corretores";
import { whatsappLink } from "@/lib/helpers/whatsapp";

const WA_SVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function ContatoPage() {
  const config = useConfigSite();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* HERO */}
      <div style={{ background: "var(--navy-900)", position: "relative", overflow: "hidden" }} className="about-hero-padded">
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 60% 50%,rgba(27,58,92,0.5) 0%,transparent 70%),radial-gradient(ellipse 40% 40% at 10% 80%,rgba(201,169,110,0.07) 0%,transparent 60%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,169,110,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,169,110,0.04) 1px,transparent 1px)", backgroundSize: "80px 80px" }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", opacity: 0, animation: "fadeUp 0.7s var(--ease-luxury) 0.05s forwards" }}>
            <Link href="/" style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "rgba(255,255,255,0.4)", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase" }}>Início</Link>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px" }}>›</span>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Contato</span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-400)", marginBottom: "20px", opacity: 0, animation: "fadeUp 0.7s var(--ease-luxury) 0.1s forwards" }}>
            <span style={{ display: "block", width: "32px", height: "1px", background: "var(--gold-500)" }} />
            Fale Conosco
          </div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(40px,6vw,72px)", fontWeight: 700, color: "#fff", lineHeight: 1.05, opacity: 0, animation: "fadeUp 0.9s var(--ease-luxury) 0.2s forwards" }}>
            Entre em <em style={{ fontStyle: "italic", color: "var(--gold-400)" }}>Contato</em>
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", fontWeight: 300, color: "rgba(255,255,255,0.5)", marginTop: "20px", maxWidth: "520px", lineHeight: 1.8, opacity: 0, animation: "fadeUp 0.9s var(--ease-luxury) 0.35s forwards" }}>
            Nossa equipe está pronta para ajudar você a encontrar o imóvel ideal. Respondemos em até 2 horas em dias úteis.
          </p>
        </div>
      </div>

      {/* FORM + INFO */}
      <section style={{ background: "#fff" }} className="section-padded">
        <div className="contato-grid">

          {/* FORM */}
          <div className="reveal">
            <div className="section-tag" style={{ marginBottom: "16px" }}>Envie uma Mensagem</div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 700, lineHeight: 1.15, color: "var(--navy-900)", marginBottom: "12px" }}>
              Vamos <em style={{ fontStyle: "italic", color: "var(--navy-700)" }}>conversar</em>
            </h2>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 300, lineHeight: 1.9, color: "var(--neutral-600)", marginBottom: "40px" }}>
              Preencha o formulário abaixo com os detalhes da sua busca ou dúvida. Nossa equipe responderá o quanto antes.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <div className="form-grid-2">
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--neutral-600)" }}>Nome completo</label>
                    <input className="form-input" type="text" placeholder="Seu nome" required />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--neutral-600)" }}>E-mail</label>
                    <input className="form-input" type="email" placeholder="seu@email.com" required />
                  </div>
                </div>
                <div className="form-grid-2">
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--neutral-600)" }}>Telefone / WhatsApp</label>
                    <input className="form-input" type="tel" placeholder="(11) 9 0000-0000" />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--neutral-600)" }}>Tipo de imóvel</label>
                    <select className="form-select-c form-input">
                      <option value="" disabled>Selecione...</option>
                      <option>Apartamento</option><option>Casa</option><option>Cobertura</option><option>Empreendimento</option><option>Outro</option>
                    </select>
                  </div>
                </div>
                <div className="form-grid-2">
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--neutral-600)" }}>Finalidade</label>
                    <select className="form-select-c form-input">
                      <option value="" disabled>Selecione...</option>
                      <option>Compra</option><option>Locação</option><option>Investimento</option><option>Avaliação</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--neutral-600)" }}>Faixa de investimento</label>
                    <select className="form-select-c form-input">
                      <option value="" disabled>Selecione...</option>
                      <option>Até R$ 500 mil</option><option>R$ 500 mil – R$ 1 milhão</option><option>R$ 1M – R$ 2M</option><option>Acima de R$ 5 milhões</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: "28px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--neutral-600)" }}>Mensagem</label>
                    <textarea className="form-textarea-c form-input" placeholder="Descreva o que você procura, bairro de interesse, características importantes..." />
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--neutral-400)", lineHeight: 1.5, flex: 1 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: "inline", verticalAlign: "middle", marginRight: "4px", opacity: 0.5 }}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    Seus dados são protegidos e nunca compartilhados com terceiros.
                  </p>
                  <button type="submit" className="btn-submit">
                    Enviar Mensagem
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px", padding: "60px 40px", textAlign: "center", animation: "fadeUp 0.6s var(--ease-luxury) forwards" }}>
                <div style={{ width: "72px", height: "72px", background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 700, color: "var(--navy-900)" }}>Mensagem enviada!</h3>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 300, color: "var(--neutral-600)", lineHeight: 1.8, maxWidth: "360px" }}>Obrigado pelo contato. Nossa equipe responderá em até 2 horas em dias úteis.</p>
              </div>
            )}
          </div>

          {/* INFO SIDEBAR */}
          <div className="reveal reveal-delay-2" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* WhatsApp Card */}
            <div style={{ background: "var(--navy-900)", padding: "36px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 110% 50%,rgba(45,89,134,0.5) 0%,transparent 70%)" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-400)", marginBottom: "12px" }}>Resposta imediata</div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "22px", fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: "8px" }}>Prefere pelo WhatsApp?</div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: "24px" }}>Atendimento rápido e direto. Escolha um dos nossos corretores e chame no WhatsApp.</p>
                <a href="#equipe" className="btn-whatsapp" style={{ width: "100%", display: "flex" }}><WA_SVG /> Ver corretores</a>
              </div>
            </div>

            {/* Info Card */}
            <div style={{ background: "var(--neutral-50)", border: "1px solid var(--neutral-200)", padding: "32px" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "16px", fontWeight: 600, color: "var(--navy-900)", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid var(--neutral-200)" }}>Outras formas de contato</div>
              {[
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.81 19.79 19.79 0 01.07 2.18 2 2 0 012.06 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/></svg>, label: "Telefone", value: formatWhatsapp(config.whatsapp), href: `tel:+${config.whatsapp}` },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, label: "E-mail", value: config.email, href: `mailto:${config.email}` },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, label: "Horário de atendimento", value: config.horario, href: null },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>, label: "Endereço", value: config.endereco, href: null },
              ].filter((item) => item.value).map(({ icon, label, value, href }) => (
                <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "20px" }}>
                  <div style={{ width: "40px", height: "40px", background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
                  <div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--neutral-400)", marginBottom: "4px" }}>{label}</div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--navy-900)", lineHeight: 1.5 }}>
                      {href ? <a href={href} className="info-value-link">{value}</a> : value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Card */}
            {(config.instagram || config.linkedin || config.facebook || config.youtube) && (
            <div style={{ background: "#fff", border: "1px solid var(--neutral-200)", padding: "28px" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "15px", fontWeight: 600, color: "var(--navy-900)", marginBottom: "18px" }}>Redes Sociais</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>, name: "Instagram", handle: config.instagram, href: linkRede("instagram", config.instagram) },
                  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>, name: "LinkedIn", handle: config.linkedin, href: linkRede("linkedin", config.linkedin) },
                  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="#C9A96E"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>, name: "Facebook", handle: config.facebook, href: linkRede("facebook", config.facebook) },
                  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l5 3-5 3z" fill="#C9A96E"/></svg>, name: "YouTube", handle: config.youtube, href: linkRede("youtube", config.youtube) },
                ].filter((r) => r.href).map(({ icon, name, handle, href }) => (
                  <a key={name} href={href!} target="_blank" rel="noopener noreferrer" className="social-link">
                    <div style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
                    <div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500, color: "var(--navy-900)", letterSpacing: "0.04em" }}>{name}</div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--neutral-400)", marginTop: "2px" }}>{handle}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            )}
          </div>
        </div>
      </section>

      {/* EQUIPE */}
      <section id="equipe" style={{ background: "var(--neutral-50)", scrollMarginTop: "80px" }} className="section-padded">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div className="section-tag reveal" style={{ justifyContent: "center", marginBottom: "12px" }}>Nossa Equipe</div>
            <h2 className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px,3.5vw,40px)", fontWeight: 700, lineHeight: 1.15, color: "var(--navy-900)" }}>
              Fale direto com um <em style={{ fontStyle: "italic", color: "var(--navy-700)" }}>corretor</em>
            </h2>
          </div>
          <div className="equipe-grid">
            {corretores.map((c, i) => (
              <div key={c.id} className={`esp-card reveal${i % 3 === 1 ? " reveal-delay-1" : i % 3 === 2 ? " reveal-delay-2" : ""}`}>
                <div style={{ width: "88px", height: "88px", margin: "0 auto 20px", borderRadius: "50%", background: "linear-gradient(135deg,var(--navy-700),var(--navy-800))", border: "2px solid var(--gold-500)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="36" height="36" fill="none" stroke="white" strokeWidth="1.2" viewBox="0 0 24 24" style={{ opacity: 0.5 }}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                </div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 600, color: "var(--navy-900)", marginBottom: "4px" }}>{c.nome}</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.1em", color: "var(--gold-500)", marginBottom: "12px" }}>{c.creci}</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 300, color: "var(--neutral-600)", marginBottom: "24px" }}>{c.especialidade}</div>
                <a href={whatsappLink(c.whatsapp, `Olá, ${c.nome.split(" ")[0]}! Vim pelo site da ${config.nomeCurto}.`)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp" style={{ width: "100%", display: "flex" }}><WA_SVG /> WhatsApp</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAP */}
      <section style={{ background: "#fff" }} className="map-bottom-padded">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "32px" }} className="reveal">
            <div className="section-tag" style={{ marginBottom: "12px" }}>Onde atuamos</div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px,3.5vw,40px)", fontWeight: 700, lineHeight: 1.15, color: "var(--navy-900)" }}>
              Área de <em style={{ fontStyle: "italic", color: "var(--navy-700)" }}>Atuação</em>
            </h2>
          </div>
          <div className="reveal reveal-delay-1" style={{ height: "320px", background: "var(--navy-900)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,169,110,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,169,110,0.04) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
            {/* animated dots */}
            <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
              <div style={{ position: "absolute", width: "12px", height: "12px", background: "var(--gold-500)", borderRadius: "50%", top: "40%", left: "35%", animation: "mapPulse 2.5s ease-in-out infinite" }} />
              <div style={{ position: "absolute", width: "8px", height: "8px", background: "var(--gold-500)", borderRadius: "50%", top: "55%", left: "60%", animation: "mapPulse 2.5s ease-in-out 0.8s infinite" }} />
              <div style={{ position: "absolute", width: "6px", height: "6px", background: "var(--gold-500)", borderRadius: "50%", top: "30%", left: "70%", animation: "mapPulse 2.5s ease-in-out 1.6s infinite" }} />
              <div style={{ position: "absolute", width: "40px", height: "40px", border: "1px solid rgba(201,169,110,0.4)", borderRadius: "50%", top: "calc(40% - 14px)", left: "calc(35% - 14px)", animation: "mapRing 2.5s ease-out infinite" }} />
            </div>
            <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold-400)", marginBottom: "10px" }}>Área de Atuação</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "26px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>São Paulo — SP</div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em" }}>Zona Sul · Zona Oeste · Centro Expandido</p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginTop: "20px" }}>
                {["Moema","Vila Olímpia","Itaim Bibi","Jardins","Pinheiros","Brooklin","Campo Belo","Vila Nova Conceição"].map((n) => (
                  <span key={n} style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", padding: "6px 14px" }}>{n}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--navy-900)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 80% 50%,rgba(45,89,134,0.4) 0%,transparent 70%),radial-gradient(ellipse 40% 60% at 10% 50%,rgba(201,169,110,0.06) 0%,transparent 60%)" }} />
        <div className="cta-grid-2" style={{ position: "relative", zIndex: 1 }}>
          <div className="reveal">
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px,4vw,52px)", fontWeight: 700, lineHeight: 1.15, color: "#fff", marginBottom: "20px" }}>
              Pronto para encontrar<br />o imóvel <em style={{ fontStyle: "italic", color: "var(--gold-400)" }}>perfeito?</em>
            </h2>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 300, lineHeight: 1.8, color: "rgba(255,255,255,0.55)", maxWidth: "480px" }}>
              Cada família tem uma história única. Deixe a nossa equipe ajudar a escrever o próximo capítulo da sua.
            </p>
          </div>
          <div className="reveal reveal-delay-2" style={{ display: "flex", flexDirection: "column", gap: "12px", minWidth: "220px" }}>
            <a href="#equipe" className="btn-whatsapp"><WA_SVG /> Falar com um corretor</a>
            <Link href="/imoveis" className="btn-outline-gold" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", textDecoration: "none" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Ver Imóveis
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
