import { ConfigSiteProvider } from "@/context/ConfigSiteContext";
import { getConfiguracoes } from "@/lib/configuracoes-servidor";

export default async function LoginLayout({ children }: { children: React.ReactNode }) {
  const config = await getConfiguracoes();
  return <ConfigSiteProvider config={config}>{children}</ConfigSiteProvider>;
}
