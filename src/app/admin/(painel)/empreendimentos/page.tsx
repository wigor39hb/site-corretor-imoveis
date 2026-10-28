import { usuarioPainel } from "@/lib/imoveis-servidor";
import { listarEmpreendimentosPainel } from "@/lib/empreendimentos-servidor";
import { AcessoRestrito } from "@/components/admin/ui";
import EmpreendimentosLista from "@/components/admin/EmpreendimentosLista";

// Empreendimentos são só de administradores e assistentes (decisão de 26/10).
const RESTRITO = "Esta área é exclusiva dos administradores e assistentes da imobiliária.";

export default async function AdminEmpreendimentosPage() {
  const [sessao, empreendimentos] = await Promise.all([usuarioPainel(), listarEmpreendimentosPainel()]);
  if (!sessao?.cuidaDeEmpreendimentos) return <AcessoRestrito texto={RESTRITO} />;
  return <EmpreendimentosLista empreendimentos={empreendimentos} />;
}
