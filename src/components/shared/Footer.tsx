import Link from "next/link";
import { SITE } from "@/lib/site";

const footerLinks = [
  { href: "/imoveis", label: "Imóveis" },
  { href: "/empreendimentos", label: "Empreendimentos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#080F17" }} className="footer-outer">
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        paddingBottom: "40px", marginBottom: "32px",
        flexWrap: "wrap", gap: "32px",
      }}>
        {/* Logo */}
        <div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 700, color: "#fff" }}>
            {SITE.nomeCurto}
          </div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-400)", marginTop: "4px" }}>
            Imobiliários · São Paulo
          </div>
        </div>

        {/* Links */}
        <ul style={{ display: "flex", gap: "32px", listStyle: "none", flexWrap: "wrap" }}>
          {footerLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="footer-link">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom */}
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "8px",
      }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em" }}>
          © {new Date().getFullYear()} {SITE.nome}. Todos os direitos reservados.
        </span>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold-500)", opacity: 0.6 }}>
          {SITE.creci}
        </span>
      </div>
    </footer>
  );
}
