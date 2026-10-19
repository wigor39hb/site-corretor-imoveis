import { listarOpcoesCorretores, listarOpcoesEmpreendimentos } from "@/lib/imoveis-servidor";
import ImovelForm from "@/components/admin/ImovelForm";

export default async function AdminImovelNovoPage() {
  const [corretores, empreendimentos] = await Promise.all([listarOpcoesCorretores(), listarOpcoesEmpreendimentos()]);
  return <ImovelForm corretores={corretores} empreendimentos={empreendimentos} />;
}
