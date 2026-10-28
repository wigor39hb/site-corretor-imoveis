import { listarEmpreendimentosSite } from "@/lib/empreendimentos-site";
import EmpreendimentosConteudo from "./EmpreendimentosConteudo";

// Sempre lê o banco na hora, para um empreendimento publicado no painel aparecer logo.
export const dynamic = "force-dynamic";

export default async function EmpreendimentosPage() {
  return <EmpreendimentosConteudo empreendimentos={await listarEmpreendimentosSite()} />;
}
