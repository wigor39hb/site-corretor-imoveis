import type { CorretorMock } from "@/lib/mock/corretores";

// Cartão do corretor responsável, usado nas páginas de imóvel e empreendimento.
export default function CorretorResponsavel({ corretor }: { corretor: CorretorMock }) {
  return (
    <div style={{ background: "var(--navy-900)", padding: "24px", display: "flex", alignItems: "center", gap: "16px" }} className="reveal reveal-delay-1">
      <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width="24" height="24" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
      </div>
      <div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>Corretor responsável</div>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: "16px", fontWeight: 600, color: "#fff", marginBottom: "3px" }}>{corretor.nome}</div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--gold-400)", letterSpacing: "0.1em" }}>{corretor.creci}</div>
      </div>
    </div>
  );
}
