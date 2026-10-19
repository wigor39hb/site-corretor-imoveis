import { adminLogado, buscarCorretor } from "@/lib/corretores-servidor";
import CorretorForm from "@/components/admin/CorretorForm";
import { AcessoRestrito } from "@/components/admin/ui";
import { PublicacaoNaoEncontrada } from "@/components/admin/CorretorResponsavelCampo";

export default async function AdminCorretorEditarPage({ params }: { params: { id: string } }) {
  const sessao = await adminLogado();
  if (!sessao) return <AcessoRestrito />;
  const corretor = await buscarCorretor(params.id);
  if (!corretor) return <PublicacaoNaoEncontrada voltarPara="/admin/corretores" />;
  return <CorretorForm key={corretor.id} inicial={corretor} ehVoce={corretor.id === sessao.uid} />;
}
