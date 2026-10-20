import { listarDestaquesSite } from "@/lib/imoveis-site";
import HomeConteudo from "./HomeConteudo";

// Sempre lê o banco na hora, para um imóvel publicado no painel aparecer logo.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  return <HomeConteudo imoveis={await listarDestaquesSite(3)} />;
}
