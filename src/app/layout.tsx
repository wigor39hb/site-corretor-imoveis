import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { getConfiguracoes } from "@/lib/configuracoes-servidor";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// Título das páginas e ícone do site vêm das Configurações do site.
export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfiguracoes();
  const icone = config.faviconUrl ?? "/icone-padrao.svg";
  return {
    title: {
      default: config.nome,
      template: `%s | ${config.nome}`,
    },
    description: "Imóveis de alto padrão com atendimento personalizado.",
    icons: { icon: icone, apple: icone },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
