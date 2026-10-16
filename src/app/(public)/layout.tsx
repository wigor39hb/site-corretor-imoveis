import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { ConfigSiteProvider } from "@/context/ConfigSiteContext";
import { getConfiguracoes } from "@/lib/configuracoes-servidor";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getConfiguracoes();
  return (
    <ConfigSiteProvider config={config}>
      <Navbar />
      <main>{children}</main>
      <Footer config={config} />
    </ConfigSiteProvider>
  );
}
