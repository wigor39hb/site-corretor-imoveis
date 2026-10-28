import { usuarioPainel } from "@/lib/imoveis-servidor";
import { AcessoRestrito } from "@/components/admin/ui";
import EmpreendimentoForm from "@/components/admin/EmpreendimentoForm";

export default async function AdminEmpreendimentoNovoPage() {
  const sessao = await usuarioPainel();
  if (!sessao?.cuidaDeEmpreendimentos) return <AcessoRestrito texto="Esta área é exclusiva dos administradores e assistentes da imobiliária." />;
  return <EmpreendimentoForm />;
}
