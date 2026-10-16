"use client";

import { useSessao } from "@/context/SessaoContext";
import CorretorForm from "@/components/admin/CorretorForm";
import { AcessoRestrito } from "@/components/admin/ui";

export default function AdminCorretorNovoPage() {
  const { isAdmin } = useSessao();
  if (!isAdmin) return <AcessoRestrito />;
  return <CorretorForm />;
}
