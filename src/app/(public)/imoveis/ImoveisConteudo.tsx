"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ImovelCard from "@/components/public/ImovelCard";
import { finalidadeLabel, tipoLabel, type Finalidade, type Imovel, type TipoImovel } from "@/lib/imoveis";

const FAIXAS_PRECO = [
  { rotulo: "Até R$ 500 mil", min: 0, max: 500_000 },
  { rotulo: "R$ 500 mil – R$ 1 milhão", min: 500_000, max: 1_000_000 },
  { rotulo: "R$ 1 milhão – R$ 3 milhões", min: 1_000_000, max: 3_000_000 },
  { rotulo: "Acima de R$ 3 milhões", min: 3_000_000, max: Infinity },
];

export default function ImoveisConteudo({ imoveis }: { imoveis: Imovel[] }) {
  const [tipo, setTipo] = useState<TipoImovel | "">("");
  const [finalidade, setFinalidade] = useState<Finalidade | "">("");
  const [dormitorios, setDormitorios] = useState(0);
  const [faixa, setFaixa] = useState(-1);

  // Só oferece nos filtros os tipos que existem entre os imóveis publicados.
  const tipos = useMemo(() => Array.from(new Set(imoveis.map((i) => i.tipo))), [imoveis]);

  const filtrados = imoveis.filter((i) => {
    if (tipo && i.tipo !== tipo) return false;
    // "Venda" também mostra os de venda e aluguel (e vice-versa).
    if (finalidade && i.finalidade !== finalidade && i.finalidade !== "venda_aluguel") return false;
    if (dormitorios && (i.dormitorios ?? 0) < dormitorios) return false;
    if (faixa >= 0) {
      const { min, max } = FAIXAS_PRECO[faixa];
      if (i.preco === null || i.preco < min || i.preco >= max) return false;
    }
    return true;
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal:not(.visible)").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [tipo, finalidade, dormitorios, faixa]);

  const limpar = () => { setTipo(""); setFinalidade(""); setDormitorios(0); setFaixa(-1); };
  const filtrando = tipo || finalidade || dormitorios || faixa >= 0;

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
            Nossos <em style={{ fontStyle: "italic", color: "var(--gold-400)" }}>imóveis</em>
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", fontWeight: 300, color: "rgba(255,255,255,0.55)", opacity: 0, animation: "fadeUp 0.8s var(--ease-luxury) 0.4s forwards" }}>
            Imóveis para comprar e alugar, selecionados pela nossa equipe.
          </p>
        </div>
      </div>

      {/* FILTROS */}
      <div style={{ background: "#fff", borderBottom: "1px solid var(--neutral-200)", position: "sticky", top: "73px", zIndex: 50 }}>
        <div className="filter-bar-inner">
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--neutral-400)", whiteSpace: "nowrap", flexShrink: 0 }}>Filtrar:</span>
          <select className="filter-select" style={{ flexShrink: 0 }} value={tipo} onChange={(e) => setTipo(e.target.value as TipoImovel | "")}>
            <option value="">Tipo de imóvel</option>
            {tipos.map((t) => <option key={t} value={t}>{tipoLabel[t]}</option>)}
          </select>
          <select className="filter-select" style={{ flexShrink: 0 }} value={finalidade} onChange={(e) => setFinalidade(e.target.value as Finalidade | "")}>
            <option value="">Finalidade</option>
            <option value="venda">{finalidadeLabel.venda}</option>
            <option value="aluguel">{finalidadeLabel.aluguel}</option>
          </select>
          <select className="filter-select" style={{ flexShrink: 0 }} value={dormitorios} onChange={(e) => setDormitorios(Number(e.target.value))}>
            <option value={0}>Dormitórios</option>
            {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{`${n}+ ${n === 1 ? "dormitório" : "dormitórios"}`}</option>)}
          </select>
          <select className="filter-select" style={{ flexShrink: 0 }} value={faixa} onChange={(e) => setFaixa(Number(e.target.value))}>
            <option value={-1}>Faixa de preço</option>
            {FAIXAS_PRECO.map((f, i) => <option key={f.rotulo} value={i}>{f.rotulo}</option>)}
          </select>
          {filtrando ? (
            <button type="button" onClick={limpar} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--gold-500)", whiteSpace: "nowrap", flexShrink: 0 }}>Limpar filtros</button>
          ) : null}
          <div className="filter-bar-divider" style={{ width: "1px", height: "28px", background: "var(--neutral-200)", margin: "0 4px", flexShrink: 0 }} />
          <span className="filter-bar-count" style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--neutral-400)", marginLeft: "auto", whiteSpace: "nowrap" }}>
            <strong style={{ color: "var(--navy-900)", fontWeight: 600 }}>{filtrados.length}</strong> {filtrados.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}
          </span>
        </div>
      </div>

      {/* LISTAGEM */}
      <section style={{ background: "var(--neutral-50)" }} className="listing-padded">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {filtrados.length > 0 ? (
            <div style={{ gap: "24px" }} className="imoveis-grid-3">
              {filtrados.map((im, i) => (
                <ImovelCard key={im.id} imovel={im} className={i % 3 === 1 ? "reveal-delay-1" : i % 3 === 2 ? "reveal-delay-2" : ""} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 20px", fontFamily: "var(--font-sans)", color: "var(--neutral-600)" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "22px", color: "var(--navy-900)", marginBottom: "8px" }}>
                {imoveis.length ? "Nenhum imóvel com esses filtros" : "Em breve, novos imóveis"}
              </div>
              {imoveis.length ? (
                <button type="button" onClick={limpar} className="imovel-cta-link" style={{ background: "none", border: "none", cursor: "pointer", margin: "0 auto" }}>Ver todos os imóveis</button>
              ) : (
                <Link href="/contato" className="imovel-cta-link" style={{ justifyContent: "center" }}>Fale com a nossa equipe</Link>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
