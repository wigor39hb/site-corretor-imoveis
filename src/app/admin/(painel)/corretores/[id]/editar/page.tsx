"use client";

import { useParams } from "next/navigation";
import { useSessao } from "@/context/SessaoContext";
import { corretores } from "@/lib/mock/corretores";
import CorretorForm from "@/components/admin/CorretorForm";
import { AcessoRestrito } from "@/components/admin/ui";
import { PublicacaoNaoEncontrada } from "@/components/admin/CorretorResponsavelCampo";

export default function AdminCorretorEditarPage() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin, usuario } = useSessao();
  if (!isAdmin) return <AcessoRestrito />;
  const corretor = corretores.find((c) => c.id === id);
  if (!corretor) return <PublicacaoNaoEncontrada voltarPara="/admin/corretores" />;
  return <CorretorForm key={corretor.id} inicial={corretor} ehVoce={corretor.id === usuario.id} />;
}
