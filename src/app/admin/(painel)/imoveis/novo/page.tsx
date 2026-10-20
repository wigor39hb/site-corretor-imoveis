import { listarOpcoesCorretores } from "@/lib/imoveis-servidor";
import ImovelForm from "@/components/admin/ImovelForm";

export default async function AdminImovelNovoPage() {
  const corretores = await listarOpcoesCorretores();
  return <ImovelForm corretores={corretores} />;
}
