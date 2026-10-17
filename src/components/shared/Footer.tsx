import Link from "next/link";
import Logo from "@/components/shared/Logo";
import IconeRede from "@/components/shared/IconeRede";
import { formatWhatsapp } from "@/lib/helpers/formatters";
import { whatsappLink } from "@/lib/helpers/whatsapp";
import { redesDoSite, type ConfigSite } from "@/lib/configuracoes";

const footerLinks = [
  { href: "/imoveis", label: "Imóveis" },
  { href: "/empreendimentos", label: "Empreendimentos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

const infoLinha: React.CSSProperties = {
  display: "flex", alignItems: "flex-start", gap: "8px",
  fontFamily: "var(--font-sans)", fontSize: "13px", lineHeight: 1.5, color: "rgba(255,255,255,0.55)",
};

export default function Footer({ config }: { config: ConfigSite }) {
  const redes = redesDoSite(config);
  return (
    <footer style={{ background: "#080F17" }} className="footer-outer">
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        paddingBottom: "40px", marginBottom: "32px",
        flexWrap: "wrap", gap: "32px",
      }}>
        {/* Logo + endereço e horário */}
        <div>
        <Logo
          logoUrl={config.logoUrl}
          nome={config.nome}
          altura={60}
          semLogo={
            <div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 700, color: "#fff" }}>
                {config.nomeCurto}
              </div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-400)", marginTop: "4px" }}>
                Imobiliários · São Paulo
              </div>
            </div>
          }
        />
        {(config.whatsapp || config.endereco || config.horario) && (
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {config.whatsapp && (
              <a href={whatsappLink(config.whatsapp, `Olá! Vim pelo site da ${config.nomeCurto}.`)} target="_blank" rel="noopener noreferrer" className="footer-telefone" style={infoLinha}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: "2px" }}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>
                {formatWhatsapp(config.whatsapp)}
              </a>
            )}
            {config.endereco && (
              <div style={infoLinha}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: "2px" }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                {config.endereco}
              </div>
            )}
            {config.horario && (
              <div style={infoLinha}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: "2px" }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                {config.horario}
              </div>
            )}
          </div>
        )}
        {redes.length > 0 && (
          <div style={{ marginTop: "16px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {redes.map((r) => (
              <a key={r.rede} href={r.href} target="_blank" rel="noopener noreferrer" className="footer-social" aria-label={r.nome} title={r.nome}>
                <IconeRede rede={r.rede} tamanho={16} cor="currentColor" />
              </a>
            ))}
          </div>
        )}
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
          © {new Date().getFullYear()} {config.nome}. Todos os direitos reservados.
        </span>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold-500)", opacity: 0.6 }}>
          {config.creci}
        </span>
      </div>
    </footer>
  );
}
