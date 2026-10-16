import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SidebarProvider } from "@/context/SidebarContext";
import { SessaoProvider, type UsuarioSessao } from "@/context/SessaoContext";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: perfil } = await supabase
    .from("perfis")
    .select("id, nome, creci, especialidade, whatsapp, email, foto_url, bio, instagram, papel, ativo")
    .eq("id", user.id)
    .single();

  if (!perfil || !perfil.ativo) return <ContaDesativada />;

  const usuario: UsuarioSessao = {
    id: perfil.id,
    nome: perfil.nome || user.email || "",
    creci: perfil.creci ?? "",
    especialidade: perfil.especialidade ?? "",
    whatsapp: perfil.whatsapp ?? "",
    email: perfil.email ?? "",
    emailAcesso: user.email ?? "",
    papel: perfil.papel,
    ativo: perfil.ativo,
    bio: perfil.bio ?? "",
    instagram: perfil.instagram ?? "",
    fotoUrl: perfil.foto_url,
  };

  return (
    <SessaoProvider usuario={usuario}>
      <SidebarProvider>
        <div className="flex h-screen bg-neutral-100 overflow-hidden">
          <Sidebar />
          <div
            className="admin-main-area flex flex-col flex-1 overflow-hidden"
            style={{ marginLeft: "var(--sidebar-width)" }}
          >
            <Topbar />
            <main className="flex-1 overflow-auto p-8 md:p-6 sm:p-5">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </SessaoProvider>
  );
}

// Conta desativada por um administrador enquanto estava logada.
function ContaDesativada() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--navy-900)", padding: "24px" }}>
      <div style={{ maxWidth: "420px", textAlign: "center", fontFamily: "var(--font-inter)" }}>
        <div style={{ fontFamily: "var(--font-playfair)", fontSize: "24px", fontWeight: 700, color: "var(--gold-500)", marginBottom: "12px" }}>
          Conta desativada
        </div>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: "24px" }}>
          Seu acesso ao painel foi desativado. Fale com um administrador da imobiliária.
        </p>
        <form action="/api/auth/logout" method="post">
          <button type="submit" style={{ background: "var(--gold-500)", color: "var(--navy-900)", border: "none", borderRadius: "4px", padding: "12px 24px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
            Sair
          </button>
        </form>
      </div>
    </div>
  );
}
