import { buscarImovel, listarFotosImovel, listarOpcoesCorretores, usuarioPainel } from "@/lib/imoveis-servidor";
import ImovelForm from "@/components/admin/ImovelForm";
import { PublicacaoDeOutroCorretor, PublicacaoNaoEncontrada } from "@/components/admin/CorretorResponsavelCampo";

export default async function AdminImovelEditarPage({ params }: { params: { id: string } }) {
  const [sessao, imovel, corretores, fotos] = await Promise.all([
    usuarioPainel(),
    buscarImovel(params.id),
    listarOpcoesCorretores(),
    listarFotosImovel(params.id),
  ]);
  if (!imovel) return <PublicacaoNaoEncontrada voltarPara="/admin/imoveis" />;
  if (!sessao?.isAdmin && imovel.corretorId !== sessao?.uid) return <PublicacaoDeOutroCorretor voltarPara="/admin/imoveis" />;
  return <ImovelForm key={imovel.id} inicial={imovel} fotosIniciais={fotos} corretores={corretores} />;
}
