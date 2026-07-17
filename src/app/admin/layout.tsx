import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SidebarProvider } from "@/context/SidebarContext";
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

  return (
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
  );
}
