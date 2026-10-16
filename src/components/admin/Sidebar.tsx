"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { useSessao } from "@/context/SessaoContext";
import { SITE } from "@/lib/site";
import { corretores, papelLabel } from "@/lib/mock/corretores";
import { iniciais } from "@/components/admin/ui";
import { LayoutDashboard, Home, Building2, User, Users, Settings, LogOut, X } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/imoveis", label: "Imóveis", icon: Home },
  { href: "/admin/empreendimentos", label: "Empreendimentos", icon: Building2 },
  { href: "/admin/corretores", label: "Corretores", icon: Users, soAdmin: true },
  { href: "/admin/configuracoes", label: "Configurações do site", icon: Settings, soAdmin: true },
  { href: "/admin/perfil", label: "Meu perfil", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { open, close } = useSidebar();
  const { usuario, isAdmin, trocarUsuario } = useSessao();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          onClick={close}
          className="sidebar-overlay"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 998,
            background: "rgba(0,0,0,0.5)",
          }}
        />
      )}

      <aside
        className={`admin-sidebar${open ? " sidebar-open" : ""}`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "var(--sidebar-width)",
          height: "100vh",
          background: "var(--navy-900)",
          borderRight: "1px solid rgba(201,169,110,0.1)",
          display: "flex",
          flexDirection: "column",
          zIndex: 999,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "28px 24px 24px",
            borderBottom: "1px solid rgba(201,169,110,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "20px",
                fontWeight: 700,
                color: "var(--gold-500)",
              }}
            >
              Admin
            </div>
            <div
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "10px",
                color: "rgba(201,169,110,0.5)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              {SITE.nomeCurto}
            </div>
          </div>
          <button
            onClick={close}
            className="sidebar-close-btn"
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.4)",
              cursor: "pointer",
              padding: "4px",
            }}
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
          {navItems
            .filter((item) => !item.soAdmin || isAdmin)
            .map((item) => {
              const active = isActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 24px",
                    margin: "2px 12px",
                    borderRadius: "6px",
                    textDecoration: "none",
                    color: active ? "var(--gold-500)" : "rgba(255,255,255,0.6)",
                    background: active ? "rgba(201,169,110,0.08)" : "transparent",
                    borderLeft: active
                      ? "2px solid var(--gold-500)"
                      : "2px solid transparent",
                    fontFamily: "var(--font-inter)",
                    fontSize: "14px",
                    fontWeight: active ? 600 : 400,
                    transition: "all 0.2s ease",
                  }}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
        </nav>

        {/* Simulação de usuário — só para testar as telas antes do login real */}
        <div style={{ padding: "12px 24px", borderTop: "1px dashed rgba(201,169,110,0.2)" }}>
          <label
            style={{
              display: "block",
              fontFamily: "var(--font-inter)",
              fontSize: "10px",
              color: "rgba(201,169,110,0.6)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Teste: ver painel como
          </label>
          <select
            value={usuario.id}
            onChange={(e) => trocarUsuario(e.target.value)}
            style={{
              width: "100%",
              padding: "7px 10px",
              borderRadius: "6px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.8)",
              fontFamily: "var(--font-inter)",
              fontSize: "12px",
              outline: "none",
            }}
          >
            {corretores.map((c) => (
              <option key={c.id} value={c.id} style={{ color: "#000" }}>
                {c.nome} ({papelLabel[c.papel]})
              </option>
            ))}
          </select>
        </div>

        {/* User */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid rgba(201,169,110,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(201,169,110,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--gold-500)",
                fontFamily: "var(--font-inter)",
                fontSize: "13px",
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {iniciais(usuario.nome)}
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {usuario.nome}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                {papelLabel[usuario.papel]}
              </div>
            </div>
          </div>
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.35)",
                fontFamily: "var(--font-inter)",
                fontSize: "13px",
                cursor: "pointer",
                padding: "8px 0",
              }}
            >
              <LogOut size={15} />
              Sair
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
