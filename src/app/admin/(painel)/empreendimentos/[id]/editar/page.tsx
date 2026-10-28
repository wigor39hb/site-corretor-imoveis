import { usuarioPainel } from "@/lib/imoveis-servidor";
import { buscarEmpreendimento, listarFotosEmpreendimento } from "@/lib/empreendimentos-servidor";
import EmpreendimentoForm from "@/components/admin/EmpreendimentoForm";
import { AcessoRestrito } from "@/components/admin/ui";
import { PublicacaoNaoEncontrada } from "@/components/admin/CorretorResponsavelCampo";

export default async function AdminEmpreendimentoEditarPage({ params }: { params: { id: string } }) {
  const [sessao, empreendimento, fotos] = await Promise.all([
    usuarioPainel(),
    buscarEmpreendimento(params.id),
    listarFotosEmpreendimento(params.id),
  ]);
  if (!sessao?.cuidaDeEmpreendimentos) return <AcessoRestrito texto="Esta área é exclusiva dos administradores e assistentes da imobiliária." />;
  if (!empreendimento) return <PublicacaoNaoEncontrada voltarPara="/admin/empreendimentos" />;
  return <EmpreendimentoForm key={empreendimento.id} inicial={empreendimento} fotosIniciais={fotos} />;
}
