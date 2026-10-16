"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { corretores, getCorretor, type CorretorMock } from "@/lib/mock/corretores";

// Usuário logado no painel. Provisório: hoje é simulado para testar as telas
// com cada papel. Na etapa do banco, vem do login de verdade.
interface SessaoContextType {
  usuario: CorretorMock;
  isAdmin: boolean;
  trocarUsuario: (id: string) => void;
}

const STORAGE_KEY = "kl-admin-usuario-simulado";

const SessaoContext = createContext<SessaoContextType>({
  usuario: corretores[0],
  isAdmin: true,
  trocarUsuario: () => {},
});

export function SessaoProvider({ children }: { children: React.ReactNode }) {
  const [usuarioId, setUsuarioId] = useState(corretores[0].id);

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      if (salvo) setUsuarioId(salvo);
    } catch {}
  }, []);

  const trocarUsuario = (id: string) => {
    setUsuarioId(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {}
  };

  const usuario = getCorretor(usuarioId);

  return (
    <SessaoContext.Provider value={{ usuario, isAdmin: usuario.papel === "admin", trocarUsuario }}>
      {children}
    </SessaoContext.Provider>
  );
}

export const useSessao = () => useContext(SessaoContext);
