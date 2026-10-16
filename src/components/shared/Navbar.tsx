"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/imoveis", label: "Imóveis" },
  { href: "/empreendimentos", label: "Empreendimentos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    document.body.style.overflow = "";
  }, [pathname]);

  const toggleMenu = () => {
    const next = !menuOpen;
    setMenuOpen(next);
    document.body.style.overflow = next ? "hidden" : "";
  };

  const isHome = pathname === "/";
  const showDark = scrolled || !isHome;

  return (
    <>
      {/* Mobile menu overlay */}
      <div className={`nav-mobile-menu${menuOpen ? " open" : ""}`}>
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => { setMenuOpen(false); document.body.style.overflow = ""; }}>
            {link.label}
          </Link>
        ))}
        <Link
          href="/contato"
          className="nav-mobile-cta"
          onClick={() => { setMenuOpen(false); document.body.style.overflow = ""; }}
        >
          Fale Conosco
        </Link>
      </div>

      {/* Navbar */}
      <header
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          paddingTop: scrolled ? "16px" : "24px",
          paddingBottom: scrolled ? "16px" : "24px",
          paddingLeft: "var(--nav-h-pad)",
          paddingRight: "var(--nav-h-pad)",
          background: showDark ? "rgba(13, 27, 42, 0.95)" : "transparent",
          backdropFilter: showDark ? "blur(20px)" : "none",
          WebkitBackdropFilter: showDark ? "blur(20px)" : "none",
          borderBottom: showDark ? "1px solid rgba(201,169,110,0.15)" : "none",
          transition: "background 0.4s var(--ease-luxury), padding 0.4s var(--ease-luxury), backdrop-filter 0.4s, border-bottom 0.4s",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "22px", fontWeight: 700, color: "#fff", lineHeight: 1, letterSpacing: "0.02em" }}>
            KL Investimentos
          </div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: "10px", color: "var(--gold-400)", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: "3px" }}>
            Imobiliários
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="nav-desktop-links" style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link${pathname === link.href ? " active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contato" className="nav-cta nav-desktop-cta">
            Fale Conosco
          </Link>
        </nav>

        {/* Hamburger */}
        <button
          className={`nav-hamburger${menuOpen ? " open" : ""}`}
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </header>
    </>
  );
}
