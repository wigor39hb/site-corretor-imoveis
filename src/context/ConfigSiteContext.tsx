"use client";

import { createContext, useContext } from "react";
import type { ConfigSite } from "@/lib/configuracoes";

// Configurações do site lidas do banco pelo layout (site, painel e login).
const ConfigSiteContext = createContext<ConfigSite | null>(null);

export function ConfigSiteProvider({ config, children }: { config: ConfigSite; children: React.ReactNode }) {
  return <ConfigSiteContext.Provider value={config}>{children}</ConfigSiteContext.Provider>;
}

export function useConfigSite() {
  const config = useContext(ConfigSiteContext);
  if (!config) throw new Error("useConfigSite precisa estar dentro do ConfigSiteProvider");
  return config;
}
