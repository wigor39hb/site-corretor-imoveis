import { listarImoveisPainel, listarOpcoesCorretores, usuarioPainel } from "@/lib/imoveis-servidor";
import { AcessoRestrito } from "@/components/admin/ui";
import ImoveisLista from "@/components/admin/ImoveisLista";

export default async function AdminImoveisPage({ searchParams }: { searchParams: { aba?: string } }) {
  const [sessao, imoveis, corretores] = await Promise.all([usuarioPainel(), listarImoveisPainel(), listarOpcoesCorretores()]);
  if (!sessao?.cuidaDeImoveis) return <AcessoRestrito texto="Esta área é dos corretores e administradores da imobiliária." />;
  return <ImoveisLista imoveis={imoveis} corretores={corretores} abaInicial={searchParams.aba === "equipe" ? "equipe" : "meus"} />;
}
