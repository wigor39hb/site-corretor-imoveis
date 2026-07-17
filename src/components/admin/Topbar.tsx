"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useSidebar } from "@/context/SidebarContext";
import { Menu, Bell } from "lucide-react";

type PageMeta = { title: string; breadcrumb: string };

function getPageMeta(pathname: string): PageMeta {
  if (pathname === "/admin") return { title: "Dashboard", breadcrumb: "Dashboard" };
  if (pathname === "/admin/imoveis") return { title: "Imóveis", breadcrumb: "Imóveis" };
  if (pathname === "/admin/imoveis/novo") return { title: "Novo Imóvel", breadcrumb: "Imóveis / Novo" };
  if (pathname.startsWith("/admin/imoveis/") && pathname.endsWith("/editar")) return { title: "Editar Imóvel", breadcrumb: "Imóveis / Editar" };
  if (pathname === "/admin/empreendimentos") return { title: "Empreendimentos", breadcrumb: "Empreendimentos" };
  if (pathname === "/admin/empreendimentos/novo") return { title: "Novo Empreendimento", breadcrumb: "Empreendimentos / Novo" };
  if (pathname.startsWith("/admin/empreendimentos/") && pathname.endsWith("/editar")) return { title: "Editar Empreendimento", breadcrumb: "Empreendimentos / Editar" };
  if (pathname === "/admin/perfil") return { title: "Meu Perfil", breadcrumb: "Perfil" };
  return { title: "Admin", breadcrumb: "Admin" };
}

type TopbarAction =
  | { type: "link"; href: string; label: string; variant: "primary" | "outline" }
  | { type: "button"; id: string; label: string; variant: "primary" | "outline" };

function getActions(pathname: string): TopbarAction[] {
  if (pathname === "/admin/imoveis") {
    return [{ type: "link", href: "/admin/imoveis/novo", label: "+ Novo Imóvel", variant: "primary" }];
  }
  if (pathname === "/admin/imoveis/novo") {
    return [
      { type: "link", href: "/admin/imoveis", label: "Cancelar", variant: "outline" },
      { type: "button", id: "topbar-publicar", label: "Publicar Imóvel", variant: "primary" },
    ];
  }
  if (pathname.startsWith("/admin/imoveis/") && pathname.endsWith("/editar")) {
    return [
      { type: "link", href: "/admin/imoveis", label: "Cancelar", variant: "outline" },
      { type: "button", id: "topbar-publicar", label: "Salvar alterações", variant: "primary" },
    ];
  }
  if (pathname === "/admin/empreendimentos") {
    return [{ type: "link", href: "/admin/empreendimentos/novo", label: "+ Novo Empreendimento", variant: "primary" }];
  }
  if (pathname === "/admin/empreendimentos/novo") {
    return [
      { type: "link", href: "/admin/empreendimentos", label: "Cancelar", variant: "outline" },
      { type: "button", id: "topbar-publicar", label: "Publicar", variant: "primary" },
    ];
  }
  if (pathname.startsWith("/admin/empreendimentos/") && pathname.endsWith("/editar")) {
    return [
      { type: "link", href: "/admin/empreendimentos", label: "Cancelar", variant: "outline" },
      { type: "button", id: "topbar-publicar", label: "Salvar alterações", variant: "primary" },
    ];
  }
  if (pathname === "/admin/perfil") {
    return [
      { type: "link", href: "/sobre", label: "↗ Ver no site", variant: "outline" },
      { type: "button", id: "topbar-salvar", label: "Salvar alterações", variant: "primary" },
    ];
  }
  return [];
}

const btnPrimary: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: "6px",
  background: "linear-gradient(135deg,var(--gold-500),var(--gold-400))",
  color: "var(--navy-900)", fontFamily: "var(--font-sans)", fontSize: "13px",
  fontWeight: 600, padding: "9px 20px", border: "none", borderRadius: "8px",
  cursor: "pointer", textDecoration: "none", whiteSpace: "nowrap",
  transition: "opacity .2s",
};

const btnOutline: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: "6px",
  padding: "9px 20px", border: "1px solid var(--neutral-200)", borderRadius: "8px",
  fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 500,
  color: "var(--neutral-600)", background: "none", cursor: "pointer",
  textDecoration: "none", whiteSpace: "nowrap", transition: "border-color .2s",
};

export default function Topbar() {
  const { toggle } = useSidebar();
  const pathname = usePathname();
  const page = getPageMeta(pathname);
  const actions = getActions(pathname);

  const handleBtnClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.click();
  };

  return (
    <header style={{
      height: "68px", background: "#fff",
      borderBottom: "1px solid var(--neutral-200)",
      display: "flex", alignItems: "center",
      padding: "0 40px", gap: "16px", flexShrink: 0,
      position: "sticky", top: 0, zIndex: 40,
    }}>
      <button onClick={toggle} className="flex lg:hidden" style={{ background: "none", border: "none", color: "var(--neutral-600)", cursor: "pointer", padding: "4px" }} aria-label="Menu">
        <Menu size={22} />
      </button>

      <div style={{ flex: 1 }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 600, color: "var(--neutral-900)", lineHeight: 1.2 }}>
          {page.title}
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--neutral-400)", letterSpacing: "0.05em" }}>
          Admin / {page.breadcrumb}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {actions.length === 0 && (
          <button style={{ position: "relative", background: "none", border: "none", color: "var(--neutral-400)", cursor: "pointer", padding: "4px" }} aria-label="Notificações">
            <Bell size={20} />
            <span style={{ position: "absolute", top: "2px", right: "2px", width: "8px", height: "8px", borderRadius: "50%", background: "var(--gold-500)" }} />
          </button>
        )}
        {actions.map((action, i) =>
          action.type === "link" ? (
            <Link key={i} href={action.href} style={action.variant === "primary" ? btnPrimary : btnOutline}>
              {action.label}
            </Link>
          ) : (
            <button key={i} style={action.variant === "primary" ? btnPrimary : btnOutline} onClick={() => handleBtnClick(action.id)}>
              {action.label}
            </button>
          )
        )}
      </div>
    </header>
  );
}
