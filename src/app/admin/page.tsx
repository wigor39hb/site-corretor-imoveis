import { createClient } from "@/lib/supabase/server";
import Card, { CardHeader, CardBody } from "@/components/shared/Card";
import KPICard from "@/components/admin/KPICard";
import { Home, Building2, CheckCircle, TrendingUp } from "lucide-react";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: totalImoveis }, { count: totalEmpreendimentos }] =
    await Promise.all([
      supabase.from("imoveis").select("*", { count: "exact", head: true }),
      supabase
        .from("empreendimentos")
        .select("*", { count: "exact", head: true }),
    ]);

  const { count: disponiveis } = await supabase
    .from("imoveis")
    .select("*", { count: "exact", head: true })
    .eq("status", "disponivel");

  return (
    <div style={{ maxWidth: "1200px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        <KPICard
          title="Total de Imóveis"
          value={totalImoveis ?? 0}
          icon={<Home size={22} />}
          color="#2D5986"
        />
        <KPICard
          title="Empreendimentos"
          value={totalEmpreendimentos ?? 0}
          icon={<Building2 size={22} />}
          color="#C9A96E"
        />
        <KPICard
          title="Disponíveis"
          value={disponiveis ?? 0}
          icon={<CheckCircle size={22} />}
          color="#3DAA6F"
        />
        <KPICard
          title="Destaques"
          value={0}
          icon={<TrendingUp size={22} />}
          color="#D4900A"
        />
      </div>

      <Card>
        <CardHeader title="Início Rápido" />
        <CardBody>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "14px",
              color: "var(--neutral-600)",
              lineHeight: 1.6,
            }}
          >
            Bem-vindo ao painel. Use o menu lateral para gerenciar imóveis,
            empreendimentos e seu perfil.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
