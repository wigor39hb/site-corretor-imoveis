"use client";

import { useEffect } from "react";
import Link from "next/link";

const WA_SVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const timeline = [
  { year: "2014", title: "Início no mercado", desc: "Obtive o CRECI e comecei atuando em imóveis residenciais de médio padrão no Brooklin e Morumbi.", side: "left" },
  { year: "2016", title: "Especialização em alto padrão", desc: "Migrei para o segmento premium, focando em Jardins e Vila Nova Conceição. Primeiras vendas acima de R$ 2M.", side: "right" },
  { year: "2019", title: "100 imóveis vendidos", desc: "Marco importante: 100 imóveis comercializados, com ticket médio de R$ 1,8M. Expansão para o segmento de empreendimentos.", side: "left" },
  { year: "2022", title: "Lançamento do portfólio digital", desc: "Criação da presença digital para atender melhor clientes de todo o Brasil interessados em imóveis em SP.", side: "right" },
  { year: "2025", title: "342+ imóveis, 10 anos", desc: "Celebrando uma década de mercado com mais de 342 imóveis comercializados e uma carteira fiel de clientes satisfeitos.", side: "left" },
];

export default function SobrePage() {
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
      {/* HERO SOBRE */}
      <div style={{ background: "var(--navy-900)", position: "relative", overflow: "hidden" }} className="about-hero-padded">
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 70% 50%,rgba(27,58,92,0.5) 0%,transparent 70%),radial-gradient(ellipse 40% 40% at 20% 80%,rgba(201,169,110,0.07) 0%,transparent 60%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,169,110,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,169,110,0.04) 1px,transparent 1px)", backgroundSize: "80px 80px" }} />
        <div className="sobre-hero-inner">
          {/* FOTO */}
          <div style={{ position: "relative" }}>
            <div style={{ width: "280px", height: "360px", background: "linear-gradient(135deg,var(--navy-700),var(--navy-800))", border: "1px solid rgba(201,169,110,0.2)", position: "relative", overflow: "hidden", flexShrink: 0 }}>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                <svg width="56" height="56" fill="none" stroke="white" strokeWidth="1" viewBox="0 0 24 24" style={{ opacity: 0.3 }}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>Foto do Corretor</span>
              </div>
              <div style={{ position: "absolute", top: "-1px", left: "-1px", width: "40px", height: "40px", borderTop: "2px solid var(--gold-500)", borderLeft: "2px solid var(--gold-500)" }} />
              <div style={{ position: "absolute", bottom: "-1px", right: "-1px", width: "40px", height: "40px", borderBottom: "2px solid var(--gold-500)", borderRight: "2px solid var(--gold-500)" }} />
            </div>
            <div style={{ position: "absolute", bottom: "-16px", right: "-16px", background: "var(--gold-500)", padding: "12px 16px", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--navy-900)", marginBottom: "2px" }}>CRECI-SP</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "14px", fontWeight: 700, color: "var(--navy-900)" }}>000000-F</div>
            </div>
          </div>

          {/* TEXTO */}
          <div style={{ opacity: 0, animation: "fadeUp 0.9s var(--ease-luxury) 0.3s forwards" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-400)", marginBottom: "20px" }}>
              <span style={{ display: "block", width: "32px", height: "1px", background: "var(--gold-500)" }} />
              Corretor de Imóveis
            </div>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(36px,5vw,56px)", fontWeight: 700, color: "#fff", lineHeight: 1.08, marginBottom: "12px" }}>João Corretor</h1>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold-400)", opacity: 0.8, marginBottom: "24px" }}>Especialista em Alto Padrão · São Paulo</div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", fontWeight: 300, lineHeight: 1.85, color: "rgba(255,255,255,0.6)", maxWidth: "500px" }}>
              Mais de uma década conectando famílias e investidores aos melhores imóveis de São Paulo. Atendimento exclusivo, ético e comprometido com o resultado que você merece.
            </p>
            <div className="sobre-hero-stats">
              {[["10+","Anos de experiência"],["342+","Imóveis vendidos"],["4.9★","Avaliação média"]].map(([num, label]) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: "36px", fontWeight: 700, color: "var(--gold-400)", lineHeight: 1 }}>{num}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BIO */}
      <section style={{ background: "#fff" }} className="section-padded">
        <div className="bio-inner">
          <div className="reveal" style={{ position: "relative" }}>
            <div style={{ aspectRatio: "3/4", maxHeight: "520px", background: "linear-gradient(135deg,var(--navy-800),var(--navy-700))", border: "1px solid rgba(13,27,42,0.1)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.2 }}>
                <svg width="56" height="56" fill="none" stroke="white" strokeWidth="1" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              </div>
            </div>
            <div style={{ position: "absolute", bottom: "-20px", right: "-20px", width: "180px", height: "180px", border: "1px solid rgba(201,169,110,0.25)", zIndex: -1 }} />
            <div style={{ position: "absolute", bottom: "32px", left: "-28px", background: "var(--gold-500)", padding: "20px 24px", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "40px", fontWeight: 700, color: "var(--navy-900)", lineHeight: 1 }}>10+</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--navy-700)", marginTop: "4px" }}>Anos de<br />Mercado</div>
            </div>
          </div>
          <div>
            <div className="section-tag reveal" style={{ marginBottom: "16px" }}>Minha história</div>
            <h2 className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 700, lineHeight: 1.15, color: "var(--navy-900)", marginBottom: "24px" }}>
              Mais do que um corretor,<br /><em style={{ fontStyle: "italic", color: "var(--navy-700)" }}>um parceiro de vida</em>
            </h2>
            <p className="reveal reveal-delay-2" style={{ fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 300, lineHeight: 1.9, color: "var(--neutral-600)", marginBottom: "20px" }}>
              Comecei no mercado imobiliário em 2014, com a convicção de que comprar ou vender um imóvel é uma das decisões mais importantes da vida de uma pessoa. Desde então, dedico cada atendimento com a atenção e o cuidado que esse momento merece.
            </p>
            <p className="reveal reveal-delay-2" style={{ fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 300, lineHeight: 1.9, color: "var(--neutral-600)", marginBottom: "32px" }}>
              Especializado em imóveis de alto padrão em São Paulo, atendo clientes que buscam não apenas um imóvel — mas um estilo de vida. Meu diferencial está na combinação entre conhecimento profundo do mercado, rede de relacionamentos consolidada e um atendimento verdadeiramente personalizado.
            </p>
            <div className="bio-specs-grid reveal reveal-delay-3" style={{ marginBottom: "40px" }}>
              {[["Alto Padrão","Especialista em imóveis premium e de luxo em SP"],["CRECI Ativo","Registro 000000-F · atuação 100% regularizada"],["Investimentos","Consultoria para investidores do mercado imobiliário"],["Atendimento VIP","Dedicação exclusiva e personalizada a cada cliente"]].map(([title, desc]) => (
                <div key={title} style={{ padding: "16px", borderLeft: "2px solid var(--gold-500)", background: "var(--neutral-50)" }}>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: "13px", fontWeight: 600, color: "var(--navy-900)", marginBottom: "4px" }}>{title}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--neutral-600)", lineHeight: 1.5 }}>{desc}</div>
                </div>
              ))}
            </div>
            <Link href="/contato" className="btn-primary reveal reveal-delay-3" style={{ textDecoration: "none" }}>
              Fale Comigo <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ESPECIALIDADES */}
      <section style={{ background: "var(--neutral-50)" }} className="section-padded">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div className="section-tag reveal" style={{ justifyContent: "center", marginBottom: "16px" }}>O que eu faço</div>
            <h2 className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px,3.5vw,40px)", fontWeight: 700, lineHeight: 1.15, color: "var(--navy-900)" }}>
              Minhas <em style={{ fontStyle: "italic", color: "var(--navy-700)" }}>especialidades</em>
            </h2>
          </div>
          <div className="esp-grid">
            {[
              { icon: <svg width="28" height="28" fill="none" stroke="var(--gold-500)" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>, title: "Alto Padrão", desc: "Especializado nos bairros mais nobres de São Paulo: Jardins, Vila Nova Conceição, Itaim Bibi e Morumbi. Imóveis de R$ 800k a R$ 20M." },
              { icon: <svg width="28" height="28" fill="none" stroke="var(--gold-500)" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>, title: "Investimentos", desc: "Consultoria completa para investidores: análise de valorização, fluxo de caixa, rentabilidade e melhores oportunidades do mercado." },
              { icon: <svg width="28" height="28" fill="none" stroke="var(--gold-500)" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, title: "Locação", desc: "Gestão completa para locadores e locatários. Encontro o inquilino ideal e cuido de toda a burocracia para você." },
            ].map((esp, i) => (
              <div key={esp.title} className={`esp-card reveal${i === 1 ? " reveal-delay-1" : i === 2 ? " reveal-delay-2" : ""}`}>
                <div style={{ width: "64px", height: "64px", margin: "0 auto 20px", background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>{esp.icon}</div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 600, color: "var(--navy-900)", marginBottom: "12px" }}>{esp.title}</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 300, lineHeight: 1.8, color: "var(--neutral-600)" }}>{esp.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section style={{ background: "#fff" }} className="section-padded">
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div className="section-tag reveal" style={{ justifyContent: "center", marginBottom: "12px" }}>Trajetória</div>
            <h2 className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px,3.5vw,40px)", fontWeight: 700, lineHeight: 1.15, color: "var(--navy-900)" }}>
              Minha <em style={{ fontStyle: "italic", color: "var(--navy-700)" }}>jornada</em>
            </h2>
          </div>
          <div className="timeline">
            {timeline.map((item, i) => (
              <div key={item.year} className="reveal timeline-item">
                {item.side === "left" ? (
                  <>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-500)", marginBottom: "6px" }}>{item.year}</div>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 600, color: "var(--navy-900)", marginBottom: "8px" }}>{item.title}</div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 300, lineHeight: 1.7, color: "var(--neutral-600)" }}>{item.desc}</div>
                    </div>
                    <div style={{ width: "40px", height: "40px", background: "var(--navy-900)", border: "2px solid var(--gold-500)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, flexShrink: 0 }}>
                      <div style={{ width: "8px", height: "8px", background: "var(--gold-500)" }} />
                    </div>
                    <div />
                  </>
                ) : (
                  <>
                    <div />
                    <div style={{ width: "40px", height: "40px", background: "var(--navy-900)", border: "2px solid var(--gold-500)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, flexShrink: 0 }}>
                      <div style={{ width: "8px", height: "8px", background: "var(--gold-500)" }} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-500)", marginBottom: "6px" }}>{item.year}</div>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 600, color: "var(--navy-900)", marginBottom: "8px" }}>{item.title}</div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 300, lineHeight: 1.7, color: "var(--neutral-600)" }}>{item.desc}</div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section style={{ background: "var(--neutral-50)" }} className="section-padded">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div className="section-tag reveal" style={{ justifyContent: "center", marginBottom: "12px" }}>Depoimentos</div>
            <h2 className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px,3.5vw,40px)", fontWeight: 700, lineHeight: 1.15, color: "var(--navy-900)" }}>
              O que dizem meus <em style={{ fontStyle: "italic", color: "var(--navy-700)" }}>clientes</em>
            </h2>
          </div>
          <div className="dep-grid">
            {[
              { text: "O João encontrou exatamente o que eu precisava em menos de 2 semanas. Conhecimento do mercado impressionante e atendimento excepcional. Recomendo sem hesitar.", name: "Carlos Mendes", role: "Empresário · Comprador" },
              { text: "Vendemos nosso apartamento em 3 semanas pelo preço que queríamos. O João cuidou de tudo com total transparência e profissionalismo. Uma experiência incrível.", name: "Renata & Paulo", role: "Casal · Vendedores" },
              { text: "Como investidor, precisava de alguém que entendesse de números, não só de imóveis. O João me ajudou a montar uma carteira com ótima rentabilidade. Parceiro de confiança.", name: "Marcelo Sousa", role: "Investidor · Recorrente" },
            ].map((dep, i) => (
              <div key={dep.name} className={`dep-card reveal${i === 1 ? " reveal-delay-1" : i === 2 ? " reveal-delay-2" : ""}`}>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: "60px", fontWeight: 700, color: "var(--gold-300)", lineHeight: 0.5, marginBottom: "16px", display: "block" }}>&ldquo;</span>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 300, lineHeight: 1.8, color: "var(--neutral-600)", marginBottom: "24px", fontStyle: "italic" }}>{dep.text}</p>
                <div style={{ height: "1px", background: "var(--neutral-200)", marginBottom: "20px" }} />
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg,var(--navy-700),var(--navy-800))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="20" height="20" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600, color: "var(--navy-900)", marginBottom: "2px" }}>{dep.name}</div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--neutral-400)" }}>{dep.role}</div>
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--gold-500)", letterSpacing: "1px", marginLeft: "auto" }}>★★★★★</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div style={{ background: "var(--navy-900)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 80% 50%,rgba(45,89,134,0.4) 0%,transparent 70%),radial-gradient(ellipse 40% 60% at 10% 50%,rgba(201,169,110,0.06) 0%,transparent 60%)" }} />
        <div className="cta-grid-2" style={{ position: "relative", zIndex: 1 }}>
          <div>
            <h2 className="reveal" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px,4vw,52px)", fontWeight: 700, lineHeight: 1.15, color: "#fff", marginBottom: "20px" }}>
              Pronto para encontrar<br />seu <em style={{ fontStyle: "italic", color: "var(--gold-400)" }}>imóvel ideal</em>?
            </h2>
            <p className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 300, lineHeight: 1.8, color: "rgba(255,255,255,0.55)", maxWidth: "480px" }}>
              Me conta o que você está procurando. Sem compromisso, sem pressão — só resultado.
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
