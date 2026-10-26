import { listarOpcoesCorretores, usuarioPainel } from "@/lib/imoveis-servidor";
import { AcessoRestrito } from "@/components/admin/ui";
import ImovelForm from "@/components/admin/ImovelForm";

export default async function AdminImovelNovoPage() {
  const [sessao, corretores] = await Promise.all([usuarioPainel(), listarOpcoesCorretores()]);
  if (!sessao?.cuidaDeImoveis) return <AcessoRestrito texto="Esta área é dos corretores e administradores da imobiliária." />;
  return <ImovelForm corretores={corretores} />;
}
