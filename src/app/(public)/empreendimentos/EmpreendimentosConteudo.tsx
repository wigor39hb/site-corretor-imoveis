"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useConfigSite } from "@/context/ConfigSiteContext";
import { whatsappLink } from "@/lib/helpers/whatsapp";
import { srcSetFoto, urlFoto } from "@/lib/imoveis";
import { localEmp, metragemEmp, statusEmpLabel, type Empreendimento, type StatusEmpreendimento } from "@/lib/empreendimentos";

const WA_SVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const statusStyle: Record<StatusEmpreendimento, React.CSSProperties> = {
  breve: { background: "rgba(13,27,42,0.8)", color: "var(--gold-400)", border: "1px solid rgba(201,169,110,0.4)" },
  lancamento: { background: "var(--gold-500)", color: "var(--navy-900)" },
  obras: { background: "rgba(13,27,42,0.8)", color: "var(--gold-400)", border: "1px solid rgba(201,169,110,0.4)" },
  pronto: { background: "rgba(37,211,102,0.15)", color: "#25D366", border: "1px solid rgba(37,211,102,0.3)" },
};

export default function EmpreendimentosConteudo({ empreendimentos }: { empreendimentos: Empreendimento[] }) {
  const config = useConfigSite();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [empreendimentos]);

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
            Lançamentos e <em style={{ fontStyle: "italic", color: "var(--gold-400)" }}>empreendimentos</em>
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", fontWeight: 300, color: "rgba(255,255,255,0.55)", opacity: 0, animation: "fadeUp 0.8s var(--ease-luxury) 0.4s forwards" }}>
            Lançamentos, obras em andamento e empreendimentos prontos para morar.
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
              <strong style={{ color: "var(--navy-900)" }}>{empreendimentos.length}</strong> {empreendimentos.length === 1 ? "empreendimento" : "empreendimentos"}
            </span>
          </div>

          {empreendimentos.length === 0 && (
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--neutral-600)", textAlign: "center", padding: "48px 0" }}>
              Em breve, novos empreendimentos por aqui.
            </p>
          )}

          <div className="emp-grid">
            {empreendimentos.map((emp, i) => {
              const resumo = [metragemEmp(emp), emp.tipologias].filter(Boolean).join(" · ");
              return (
                <Link key={emp.id} href={`/empreendimentos/${emp.id}`} className={`emp-card reveal${i % 2 === 1 ? " reveal-delay-1" : ""}`}>
                  <div style={{ aspectRatio: "16/9", background: "linear-gradient(135deg,#122236,#1B3A5C)", position: "relative", overflow: "hidden" }}>
                    {emp.capa ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={urlFoto(emp.capa, "m")} srcSet={srcSetFoto(emp.capa)} sizes="(max-width: 768px) 100vw, 600px" alt={emp.nome} loading="lazy"
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.25 }}>
                        <svg width="64" height="64" fill="none" stroke="white" strokeWidth="0.8" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="15" rx="1"/><polyline points="16 7 12 3 8 7"/></svg>
                      </div>
                    )}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(13,27,42,0.75) 0%,transparent 55%)" }} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px", zIndex: 1 }}>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{emp.nome}</div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "rgba(255,255,255,0.7)", letterSpacing: "0.05em" }}>{[emp.construtora, localEmp(emp)].filter(Boolean).join(" · ")}</div>
                    </div>
                    <span style={{ position: "absolute", top: "20px", right: "20px", fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", padding: "6px 14px", ...statusStyle[emp.status] }}>{statusEmpLabel[emp.status]}</span>
                  </div>
                  <div style={{ padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--neutral-600)" }}>{resumo}</span>
                    <span className="emp-cta-link">Ver mais <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
                  </div>
                </Link>
              );
            })}
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
              Fale com a nossa equipe no WhatsApp: plantas, valores e condições de pagamento.
            </p>
          </div>
          <div className="reveal reveal-delay-1" style={{ display: "flex", flexDirection: "column", gap: "12px", minWidth: "220px" }}>
            {config.whatsapp && (
              <a href={whatsappLink(config.whatsapp, "Olá! Quero saber mais sobre os empreendimentos que vi no site.")} target="_blank" rel="noopener noreferrer" className="btn-whatsapp"><WA_SVG /> WhatsApp</a>
            )}
            <Link href="/contato" className="btn-outline-gold" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", textDecoration: "none" }}>Enviar Mensagem</Link>
          </div>
        </div>
      </div>
    </>
  );
}

