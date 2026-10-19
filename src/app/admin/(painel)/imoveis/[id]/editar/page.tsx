import { buscarImovel, listarOpcoesCorretores, listarOpcoesEmpreendimentos, usuarioPainel } from "@/lib/imoveis-servidor";
import ImovelForm from "@/components/admin/ImovelForm";
import { PublicacaoDeOutroCorretor, PublicacaoNaoEncontrada } from "@/components/admin/CorretorResponsavelCampo";

export default async function AdminImovelEditarPage({ params }: { params: { id: string } }) {
  const [sessao, imovel, corretores, empreendimentos] = await Promise.all([
    usuarioPainel(),
    buscarImovel(params.id),
    listarOpcoesCorretores(),
    listarOpcoesEmpreendimentos(),
  ]);
  if (!imovel) return <PublicacaoNaoEncontrada voltarPara="/admin/imoveis" />;
  if (!sessao?.isAdmin && imovel.corretorId !== sessao?.uid) return <PublicacaoDeOutroCorretor voltarPara="/admin/imoveis" />;
  return <ImovelForm key={imovel.id} inicial={imovel} corretores={corretores} empreendimentos={empreendimentos} />;
}
