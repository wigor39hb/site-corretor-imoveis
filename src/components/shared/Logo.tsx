// Logo da imobiliária enviada no painel; sem logo, mostra o conteúdo de `semLogo`
// (o nome escrito, com o estilo de cada lugar).
export default function Logo({ logoUrl, nome, altura, semLogo }: {
  logoUrl: string | null;
  nome: string;
  altura: number;
  semLogo: React.ReactNode;
}) {
  if (!logoUrl) return <>{semLogo}</>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={logoUrl} alt={nome} style={{ height: altura, width: "auto", maxWidth: "260px", objectFit: "contain", display: "block" }} />
  );
}
