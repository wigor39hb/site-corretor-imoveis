import { listarImoveisSite } from "@/lib/imoveis-site";
import ImoveisConteudo from "./ImoveisConteudo";

// Sempre lê o banco na hora, para um imóvel publicado no painel aparecer logo.
export const dynamic = "force-dynamic";

export default async function ImoveisPage() {
  return <ImoveisConteudo imoveis={await listarImoveisSite()} />;
}
