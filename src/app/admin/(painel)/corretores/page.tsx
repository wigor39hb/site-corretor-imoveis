import { adminLogado, listarCorretoresPainel } from "@/lib/corretores-servidor";
import CorretoresLista from "@/components/admin/CorretoresLista";
import { AcessoRestrito } from "@/components/admin/ui";

export default async function AdminCorretoresPage() {
  if (!(await adminLogado())) return <AcessoRestrito />;
  return <CorretoresLista corretores={await listarCorretoresPainel()} />;
}
