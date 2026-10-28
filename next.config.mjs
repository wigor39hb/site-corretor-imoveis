/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // O pdf.js (leitura do PDF do empreendimento, no navegador) tem um trecho só para
  // Node que pede o pacote "canvas"; ele nunca roda aqui, então fica de fora do pacote.
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
