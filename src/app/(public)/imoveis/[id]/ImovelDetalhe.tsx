"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CorretorResponsavel from "@/components/public/CorretorResponsavel";
import ImovelCard, { estiloSelo } from "@/components/public/ImovelCard";
import { useConfigSite } from "@/context/ConfigSiteContext";
import { whatsappLink } from "@/lib/helpers/whatsapp";
import {
  fichaImovel, numerosImovel, precoSite, rotuloPreco, seloImovel, srcSetFoto, tipoLabel, urlFoto,
} from "@/lib/imoveis";
import type { ImovelDetalhe as Detalhe } from "@/lib/imoveis-site";

const WA_SVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const tituloSecao: React.CSSProperties = { fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 600, color: "var(--navy-900)", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--neutral-200)" };

// Lista com marcador dourado (Cômodos, Características, Condomínio, Proximidades).
function ListaItens({ titulo, itens }: { titulo: string; itens: string[] }) {
  if (!itens.length) return null;
  return (
    <div className="reveal">
      <div style={tituloSecao}>{titulo}</div>
      <div className="detail-features" style={{ marginBottom: "40px" }}>
        {itens.map((f) => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--neutral-600)" }}>
            <div style={{ width: "6px", height: "6px", background: "var(--gold-500)", flexShrink: 0 }} />{f}
          </div>
        ))}
      </div>
    </div>
  );
}

const setaGaleria: React.CSSProperties = {
  position: "absolute", top: "50%", transform: "translateY(-50%)", width: "44px", height: "44px", borderRadius: "50%", border: "none",
  background: "rgba(0,0,0,0.45)", color: "#fff", fontSize: "24px", lineHeight: "42px", cursor: "pointer", padding: 0,
};

export default function ImovelDetalhe({ imovel, fotos, corretor, similares }: Detalhe) {
  const config = useConfigSite();
  const [atual, setAtual] = useState(0);
  const selo = seloImovel(imovel);
  const numeros = numerosImovel(imovel);
  const ficha = fichaImovel(imovel);
  const whatsapp = corretor?.whatsapp || config.whatsapp;
  const mensagem = `Olá! Tenho interesse no imóvel "${imovel.titulo}" que vi no site.`;
  const ir = (passo: number) => setAtual((a) => (a + passo + fotos.length) % fotos.length);

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
        <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "20px", flexWrap: "wrap" }}>
          <Link href="/" style={{ fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--neutral-400)", textDecoration: "none" }}>Início</Link>
          <span style={{ color: "var(--neutral-200)" }}>/</span>
          <Link href="/imoveis" style={{ fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--neutral-400)", textDecoration: "none" }}>Imóveis</Link>
          <span style={{ color: "var(--neutral-200)" }}>/</span>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--navy-900)", fontWeight: 500 }}>{imovel.titulo}</span>
        </div>
      </div>

      {/* GALERIA */}
      <div className="gallery-section-pad">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ aspectRatio: "16/9", background: "linear-gradient(135deg,#122236,#1B3A5C)", position: "relative", overflow: "hidden", marginBottom: "12px" }}>
            {fotos.length ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={fotos[atual]} src={urlFoto(fotos[atual], "m")} srcSet={srcSetFoto(fotos[atual])} sizes="(max-width: 1200px) 100vw, 1200px" alt={`${imovel.titulo} — foto ${atual + 1}`}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.25 }}>
                <svg width="64" height="64" fill="none" stroke="white" strokeWidth="0.8" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
            )}
            <span style={{ position: "absolute", top: "24px", left: "24px", fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", padding: "8px 16px", ...estiloSelo[selo.estilo] }}>{selo.texto}</span>
            {fotos.length > 1 && (
              <>
                <button type="button" onClick={() => ir(-1)} aria-label="Foto anterior" style={{ ...setaGaleria, left: "16px" }}>‹</button>
                <button type="button" onClick={() => ir(1)} aria-label="Próxima foto" style={{ ...setaGaleria, right: "16px" }}>›</button>
                <span style={{ position: "absolute", bottom: "24px", right: "24px", fontFamily: "var(--font-sans)", fontSize: "12px", color: "rgba(255,255,255,0.85)", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", padding: "6px 14px" }}>{atual + 1} / {fotos.length} fotos</span>
              </>
            )}
          </div>
          {fotos.length > 1 && (
            <div className="gallery-thumbs-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))" }}>
              {fotos.map((caminho, i) => (
                <div key={caminho} className={`gallery-thumb${atual === i ? " active" : ""}`} style={{ aspectRatio: "4/3", position: "relative", overflow: "hidden", cursor: "pointer" }} onClick={() => setAtual(i)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={urlFoto(caminho, "p")} alt={`Foto ${i + 1}`} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DETALHE LAYOUT */}
      <div className="detail-layout">

        {/* MAIN */}
        <div>
          <div className="detail-tipo reveal">{tipoLabel[imovel.tipo]}{imovel.situacao && ` · ${imovel.situacao}`}</div>
          <h1 className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, color: "var(--navy-900)", lineHeight: 1.15, marginBottom: "32px" }}>{imovel.titulo}</h1>

          {/* NÚMEROS */}
          {numeros.length > 0 && (
            <div className="detail-specs-bar reveal reveal-delay-2">
              {numeros.map((n) => (
                <div key={n.rotulo} className="detail-spec-item">
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "20px", fontWeight: 600, color: "var(--navy-900)", lineHeight: 1, marginBottom: "6px" }}>{n.valor}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--neutral-400)" }}>{n.rotulo}</div>
                </div>
              ))}
            </div>
          )}

          {/* DESCRIÇÃO */}
          {imovel.descricao && (
            <div className="reveal">
              <div style={tituloSecao}>Descrição</div>
              <div style={{ marginBottom: "40px" }}>
                {imovel.descricao.split(/\n+/).filter((p) => p.trim()).map((p, i) => (
                  <p key={i} style={{ fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 300, lineHeight: 1.9, color: "var(--neutral-600)", marginBottom: "16px" }}>{p}</p>
                ))}
              </div>
            </div>
          )}

          <ListaItens titulo="Cômodos" itens={imovel.comodos} />
          <ListaItens titulo="Características" itens={imovel.caracteristicas} />
          <ListaItens titulo="Condomínio" itens={imovel.condominio} />
          <ListaItens titulo="Proximidades" itens={imovel.proximidades} />

          {/* FICHA */}
          <div className="reveal">
            <div style={tituloSecao}>Ficha do imóvel</div>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "40px" }}>
              <tbody>
                {ficha.map(([label, value]) => (
                  <tr key={label} style={{ borderBottom: "1px solid var(--neutral-200)" }}>
                    <td style={{ padding: "14px 0", fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--neutral-400)", width: "40%" }}>{label}</td>
                    <td style={{ padding: "14px 0", fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--neutral-900)", fontWeight: 500 }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="detail-sidebar">
          <div className="detail-sidebar-card reveal">
            <div className="detail-price-value">{precoSite(imovel)}</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--neutral-400)", marginBottom: "24px" }}>{rotuloPreco[imovel.finalidade]}</div>
            {numeros.length > 0 && (
              <>
                <div style={{ height: "1px", background: "var(--neutral-200)", margin: "0 0 24px" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                  {numeros.map((n) => (
                    <div key={n.rotulo} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--neutral-400)" }}>{n.rotulo}</span>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600, color: "var(--navy-900)" }}>{n.valor}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {whatsapp && (
                <a href={whatsappLink(whatsapp, mensagem)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp"><WA_SVG /> Falar no WhatsApp</a>
              )}
              {corretor?.email && <a href={`mailto:${corretor.email}?subject=${encodeURIComponent(imovel.titulo)}`} className="btn-outline">Enviar E-mail</a>}
            </div>
          </div>
          {corretor && <CorretorResponsavel corretor={corretor} />}
        </div>
      </div>

      {/* SIMILARES */}
      {similares.length > 0 && (
        <section className="similares-section-pad">
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div className="section-tag reveal" style={{ marginBottom: "8px" }}>Você também pode gostar</div>
            <h2 className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px,3.5vw,40px)", fontWeight: 700, lineHeight: 1.15, color: "var(--navy-900)", marginBottom: "40px" }}>
              Imóveis <em style={{ fontStyle: "italic", color: "var(--navy-700)" }}>similares</em>
            </h2>
            <div className="similares-grid">
              {similares.map((im, i) => (
                <ImovelCard key={im.id} imovel={im} className={i === 1 ? "reveal-delay-1" : i === 2 ? "reveal-delay-2" : ""} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
