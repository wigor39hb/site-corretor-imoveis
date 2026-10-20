import Link from "next/link";
import {
  numerosImovel, precoSite, rotuloPreco, seloImovel, srcSetFoto, tipoLabel, urlFoto, type Imovel,
} from "@/lib/imoveis";

export const estiloSelo: Record<"venda" | "aluguel" | "lancamento", React.CSSProperties> = {
  venda: { background: "var(--gold-500)", color: "var(--navy-900)" },
  aluguel: { background: "var(--navy-500)", color: "#fff" },
  lancamento: { background: "var(--navy-900)", color: "var(--gold-400)", border: "1px solid var(--gold-500)" },
};

// Cartão de imóvel do site (página inicial, lista de imóveis e "similares").
export default function ImovelCard({ imovel, className = "" }: { imovel: Imovel; className?: string }) {
  const selo = seloImovel(imovel);
  // No cartão cabem 3 números; a área privativa tem preferência sobre a total.
  const numeros = numerosImovel(imovel).filter((n) => n.rotulo !== "Suíte" && n.rotulo !== "Suítes");
  const area = numeros.find((n) => n.rotulo === "Área privativa") ?? numeros.find((n) => n.rotulo === "Área total");
  const visiveis = [...numeros.filter((n) => !n.rotulo.startsWith("Área")), ...(area ? [{ ...area, rotulo: "Área" }] : [])].slice(0, 3);

  return (
    <Link href={`/imoveis/${imovel.id}`} className={`imovel-card reveal ${className}`} style={{ display: "block", textDecoration: "none", color: "inherit" }}>
      <div style={{ aspectRatio: "4/3", background: "linear-gradient(135deg, var(--navy-800) 0%, var(--navy-700) 100%)", position: "relative", overflow: "hidden" }}>
        {imovel.capa ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={urlFoto(imovel.capa, "p")} srcSet={srcSetFoto(imovel.capa)} sizes="(max-width: 768px) 100vw, 400px" alt={imovel.titulo} loading="lazy"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.3 }}>
            <svg width="48" height="48" fill="none" stroke="white" strokeWidth="1" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
          </div>
        )}
        <div className="imovel-thumb-overlay" />
        <span style={{ position: "absolute", top: "16px", left: "16px", fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", padding: "6px 12px", ...estiloSelo[selo.estilo] }}>{selo.texto}</span>
      </div>
      <div style={{ padding: "24px" }}>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--neutral-400)", marginBottom: "8px" }}>
          {tipoLabel[imovel.tipo]}{imovel.situacao && ` · ${imovel.situacao}`}
        </div>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 600, color: "var(--navy-900)", marginBottom: "20px", lineHeight: 1.3 }}>{imovel.titulo}</div>
        <div style={{ height: "1px", background: "var(--neutral-200)", marginBottom: "20px" }} />
        {visiveis.length > 0 && (
          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
            {visiveis.map((n) => (
              <div key={n.rotulo} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 600, color: "var(--navy-900)" }}>{n.valor}</span>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "10px", color: "var(--neutral-400)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{n.rotulo}</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          <div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "22px", fontWeight: 700, color: "var(--navy-900)" }}>{precoSite(imovel)}</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--neutral-400)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "2px" }}>{rotuloPreco[imovel.finalidade]}</div>
          </div>
          <span className="imovel-cta-link">
            Ver mais
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
