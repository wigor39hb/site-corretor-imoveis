"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useConfigSite } from "@/context/ConfigSiteContext";
import { whatsappLink } from "@/lib/helpers/whatsapp";
import { srcSetFoto, urlFoto } from "@/lib/imoveis";
import { localEmp, metragemEmp, statusEmpLabel } from "@/lib/empreendimentos";
import type { EmpreendimentoDetalhe as Detalhe } from "@/lib/empreendimentos-site";

const WA_SVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const migalha: React.CSSProperties = { fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", textDecoration: "none" };
const tituloSecao: React.CSSProperties = { fontFamily: "var(--font-serif)", fontSize: "clamp(28px,3.5vw,40px)", fontWeight: 700, lineHeight: 1.15, color: "var(--navy-900)", marginBottom: "12px" };

// Página do empreendimento: capa, galeria de lazer e contato.
// Sem plantas, implantação nem condições de pagamento (decisão de 27/10):
// para saber mais, o cliente chama a imobiliária. O WhatsApp é o do dono.
export default function EmpreendimentoDetalhe({ empreendimento: emp, fotos }: Detalhe) {
  const config = useConfigSite();
  const [capa, ...galeria] = fotos;
  const [aberta, setAberta] = useState<number | null>(null);
  const local = localEmp(emp);
  const numeros = [
    { valor: metragemEmp(emp), rotulo: "Área privativa" },
    { valor: emp.tipologias, rotulo: "Apartamentos" },
    { valor: galeria.length ? String(galeria.length) : "", rotulo: "Itens de lazer" },
  ].filter((n) => n.valor);
  const emBreve = emp.status === "breve";
  const mensagem = `Olá! Tenho interesse no empreendimento ${emp.nome} que vi no site.`;

  const ir = useCallback((passo: number) => setAberta((a) => (a === null ? a : (a + passo + galeria.length) % galeria.length)), [galeria.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Tela cheia: setas do teclado passam as fotos; Esc fecha.
  useEffect(() => {
    if (aberta === null) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberta(null);
      if (e.key === "ArrowLeft") ir(-1);
      if (e.key === "ArrowRight") ir(1);
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [aberta, ir]);

  return (
    <>
      {/* TOPO */}
      <div className="emp-hero-outer" style={{ background: "linear-gradient(135deg,var(--navy-900) 0%,var(--navy-700) 100%)", position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
        {capa && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={urlFoto(capa.caminho, "g")} srcSet={srcSetFoto(capa.caminho)} sizes="100vw" alt={emp.nome}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(13,27,42,0.95) 0%,rgba(13,27,42,0.4) 55%,rgba(13,27,42,0.15) 100%)" }} />
        <div className="emp-hero-inner" style={{ paddingTop: "140px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
            <Link href="/" style={migalha}>Início</Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
            <Link href="/empreendimentos" style={migalha}>Empreendimentos</Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
            <span style={{ ...migalha, color: "var(--gold-400)" }}>{emp.nome}</span>
          </div>
          <span style={{ display: "inline-block", fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", border: "1px solid var(--gold-500)", color: "var(--gold-400)", padding: "6px 14px", marginBottom: "18px", opacity: 0, animation: "fadeUp 0.7s var(--ease-luxury) 0.2s forwards" }}>
            {statusEmpLabel[emp.status]}
          </span>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(40px,6vw,72px)", fontWeight: 700, color: "#fff", lineHeight: 1.05, marginBottom: "12px", opacity: 0, animation: "fadeUp 0.8s var(--ease-luxury) 0.35s forwards" }}>
            {emp.nome}
          </h1>
          {local && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-sans)", fontSize: "15px", color: "rgba(255,255,255,0.75)", marginBottom: "32px", opacity: 0, animation: "fadeUp 0.8s var(--ease-luxury) 0.45s forwards" }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
              {local}
            </div>
          )}
          {numeros.length > 0 && (
            <div className="emp-hero-stats" style={{ opacity: 0, animation: "fadeUp 0.8s var(--ease-luxury) 0.55s forwards" }}>
              {numeros.map((n) => (
                <div key={n.rotulo} style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
                  <strong style={{ display: "block", fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 600, color: "#fff", letterSpacing: 0, textTransform: "none", marginBottom: "4px" }}>{n.valor}</strong>
                  {n.rotulo}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* APRESENTAÇÃO */}
      {emp.descricao && (
        <div className="emp-secao" style={{ paddingBottom: galeria.length ? 0 : undefined }}>
          <div className="section-tag reveal" style={{ marginBottom: "12px" }}>O empreendimento</div>
          <div className="reveal reveal-delay-1" style={{ maxWidth: "760px" }}>
            {emp.descricao.split(/\n+/).filter((p) => p.trim()).map((p, i) => (
              <p key={i} style={{ fontFamily: "var(--font-sans)", fontSize: "16px", fontWeight: 300, lineHeight: 1.9, color: "var(--neutral-600)", marginBottom: "16px" }}>{p}</p>
            ))}
          </div>
        </div>
      )}

      {/* GALERIA DE LAZER */}
      {galeria.length > 0 && (
        <div className="emp-secao">
          <div className="section-tag reveal" style={{ marginBottom: "12px" }}>Lazer e áreas comuns</div>
          <h2 className="reveal reveal-delay-1" style={tituloSecao}>
            Tudo dentro do <em style={{ fontStyle: "italic", color: "var(--navy-700)" }}>condomínio</em>
          </h2>
          <p className="reveal" style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--neutral-400)", marginBottom: "32px" }}>Clique em uma foto para ver em tela cheia.</p>
          <div className="emp-galeria">
            {galeria.map((f, i) => (
              <button type="button" key={f.caminho} className="emp-galeria-item" onClick={() => setAberta(i)} aria-label={`Ver ${f.legenda || `foto ${i + 1}`} em tela cheia`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={urlFoto(f.caminho, i % 7 === 0 ? "m" : "p")} alt={f.legenda || `${emp.nome} — foto ${i + 1}`} loading="lazy" />
                {f.legenda && <span className="emp-galeria-legenda">{f.legenda}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CONTATO */}
      <div style={{ background: "var(--navy-900)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 80% 50%,rgba(45,89,134,0.4) 0%,transparent 70%),radial-gradient(ellipse 40% 60% at 10% 50%,rgba(201,169,110,0.06) 0%,transparent 60%)" }} />
        <div className="cta-grid-2" style={{ position: "relative", zIndex: 1 }}>
          <div>
            <h2 className="reveal" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, lineHeight: 1.15, color: "#fff", marginBottom: "16px" }}>
              {emBreve ? <>Seja o primeiro a <em style={{ fontStyle: "italic", color: "var(--gold-400)" }}>saber</em></> : <>Quer conhecer o <em style={{ fontStyle: "italic", color: "var(--gold-400)" }}>{emp.nome}</em>?</>}
            </h2>
            <p className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 300, lineHeight: 1.8, color: "rgba(255,255,255,0.55)", maxWidth: "460px" }}>
              {emBreve
                ? "Este empreendimento ainda não está à venda. Cadastre seu interesse e avisamos assim que for lançado."
                : "Fale com a nossa equipe para receber plantas, valores, condições de pagamento e as unidades disponíveis."}
            </p>
          </div>
          <div className="reveal reveal-delay-1" style={{ display: "flex", flexDirection: "column", gap: "12px", minWidth: "220px" }}>
            {config.whatsapp && (
              <a href={whatsappLink(config.whatsapp, mensagem)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp"><WA_SVG /> {emBreve ? "Cadastrar interesse" : "Tenho interesse"}</a>
            )}
            <Link href="/contato" className="btn-outline-gold" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", textDecoration: "none" }}>Enviar Mensagem</Link>
          </div>
        </div>
      </div>

      {/* AVISOS */}
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--neutral-400)", textAlign: "center", padding: "20px 24px", lineHeight: 1.7, margin: 0 }}>
        {emp.construtora && <>Realização: {emp.construtora}. </>}
        Imagens meramente ilustrativas.
        {emp.registroIncorporacao && <> Registro de incorporação: {emp.registroIncorporacao}.</>}
      </p>

      {/* TELA CHEIA */}
      {aberta !== null && galeria[aberta] && (
        <div className="tela-cheia" role="dialog" aria-modal="true" onClick={() => setAberta(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={urlFoto(galeria[aberta].caminho, "g")} alt={galeria[aberta].legenda || emp.nome} onClick={(e) => e.stopPropagation()} />
          <p style={{ color: "#fff", fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", marginTop: "14px" }}>
            {galeria[aberta].legenda ? `${galeria[aberta].legenda} · ` : ""}{aberta + 1} / {galeria.length}
          </p>
          <button type="button" aria-label="Fechar" style={{ top: "10px", right: "10px" }} onClick={() => setAberta(null)}>×</button>
          {galeria.length > 1 && (
            <>
              <button type="button" aria-label="Foto anterior" style={{ left: "6px", top: "50%", transform: "translateY(-50%)" }} onClick={(e) => { e.stopPropagation(); ir(-1); }}>‹</button>
              <button type="button" aria-label="Próxima foto" style={{ right: "6px", top: "50%", transform: "translateY(-50%)" }} onClick={(e) => { e.stopPropagation(); ir(1); }}>›</button>
            </>
          )}
        </div>
      )}
    </>
  );
}
