import { listarImoveisPainel, listarOpcoesCorretores } from "@/lib/imoveis-servidor";
import ImoveisLista from "@/components/admin/ImoveisLista";

export default async function AdminImoveisPage({ searchParams }: { searchParams: { aba?: string } }) {
  const [imoveis, corretores] = await Promise.all([listarImoveisPainel(), listarOpcoesCorretores()]);
  return <ImoveisLista imoveis={imoveis} corretores={corretores} abaInicial={searchParams.aba === "equipe" ? "equipe" : "meus"} />;
}
