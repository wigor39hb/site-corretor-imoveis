import { notFound } from "next/navigation";
import { buscarImovelSite } from "@/lib/imoveis-site";
import ImovelDetalhe from "./ImovelDetalhe";

// Sempre lê o banco na hora, para as mudanças feitas no painel aparecerem logo.
export const dynamic = "force-dynamic";

export default async function ImovelPage({ params }: { params: { id: string } }) {
  const detalhe = await buscarImovelSite(params.id);
  if (!detalhe) notFound();
  return <ImovelDetalhe {...detalhe} />;
}
