import { imoveisMock, empreendimentosMock } from "@/lib/mock/publicacoes";
import { corretores } from "@/lib/mock/corretores";
import Card, { CardHeader, CardBody } from "@/components/shared/Card";
import KPICard from "@/components/admin/KPICard";
import { Home, Building2, CheckCircle, Users } from "lucide-react";

export const metadata = { title: "Dashboard" };

export default function AdminDashboardPage() {
  // Provisório: contagens dos dados de exemplo. Na etapa do banco, vêm de lá.
  const totalImoveis = imoveisMock.length;
  const totalEmpreendimentos = empreendimentosMock.length;
  const disponiveis = imoveisMock.filter((im) => im.status === "disponivel").length;
  const corretoresAtivos = corretores.filter((c) => c.ativo).length;

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
          value={totalImoveis}
          icon={<Home size={22} />}
          color="#2D5986"
        />
        <KPICard
          title="Empreendimentos"
          value={totalEmpreendimentos}
          icon={<Building2 size={22} />}
          color="#C9A96E"
        />
        <KPICard
          title="Disponíveis"
          value={disponiveis}
          icon={<CheckCircle size={22} />}
          color="#3DAA6F"
        />
        <KPICard
          title="Corretores ativos"
          value={corretoresAtivos}
          icon={<Users size={22} />}
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
            empreendimentos, corretores e seu perfil.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
