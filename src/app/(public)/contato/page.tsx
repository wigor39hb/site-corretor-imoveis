import { listarEquipe } from "@/lib/corretores-servidor";
import ContatoConteudo from "./ContatoConteudo";

export default async function ContatoPage() {
  return <ContatoConteudo equipe={await listarEquipe()} />;
}
