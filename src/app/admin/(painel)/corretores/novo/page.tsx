import { adminLogado } from "@/lib/corretores-servidor";
import CorretorForm from "@/components/admin/CorretorForm";
import { AcessoRestrito } from "@/components/admin/ui";

export default async function AdminCorretorNovoPage() {
  if (!(await adminLogado())) return <AcessoRestrito />;
  return <CorretorForm />;
}
