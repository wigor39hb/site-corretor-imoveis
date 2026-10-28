import { notFound } from "next/navigation";
import { buscarEmpreendimentoSite } from "@/lib/empreendimentos-site";
import EmpreendimentoDetalhe from "./EmpreendimentoDetalhe";

// Sempre lê o banco na hora, para as mudanças feitas no painel aparecerem logo.
export const dynamic = "force-dynamic";

export default async function EmpreendimentoPage({ params }: { params: { id: string } }) {
  const detalhe = await buscarEmpreendimentoSite(params.id);
  if (!detalhe) notFound();
  return <EmpreendimentoDetalhe {...detalhe} />;
}
