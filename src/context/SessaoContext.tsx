"use client";

import { createContext, useContext } from "react";
import type { CorretorMock } from "@/lib/mock/corretores";

// Usuário logado no painel, lido do banco (tabela perfis) pelo layout do painel.
// Usa o mesmo formato dos corretores de exemplo para as telas que ainda não
// foram ligadas ao banco continuarem funcionando.
export type UsuarioSessao = CorretorMock & { fotoUrl: string | null };

interface SessaoContextType {
  usuario: UsuarioSessao;
  isAdmin: boolean;
}

const SessaoContext = createContext<SessaoContextType | null>(null);

export function SessaoProvider({ usuario, children }: { usuario: UsuarioSessao; children: React.ReactNode }) {
  return (
    <SessaoContext.Provider value={{ usuario, isAdmin: usuario.papel === "admin" }}>
      {children}
    </SessaoContext.Provider>
  );
}

export function useSessao() {
  const sessao = useContext(SessaoContext);
  if (!sessao) throw new Error("useSessao precisa estar dentro do SessaoProvider");
  return sessao;
}
