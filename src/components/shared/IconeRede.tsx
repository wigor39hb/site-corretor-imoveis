import type { Rede } from "@/lib/configuracoes";

// Ícones das redes sociais (traço fino, na cor indicada).
export default function IconeRede({ rede, tamanho = 18, cor = "#C9A96E" }: { rede: Rede; tamanho?: number; cor?: string }) {
  const props = { width: tamanho, height: tamanho, viewBox: "0 0 24 24", fill: "none", stroke: cor, strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (rede) {
    case "instagram":
      return <svg {...props}><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill={cor} /></svg>;
    case "facebook":
      return <svg {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>;
    case "linkedin":
      return <svg {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>;
    case "youtube":
      return <svg {...props}><rect x="2" y="5" width="20" height="14" rx="4" /><path d="M10 9l5 3-5 3z" fill={cor} /></svg>;
    case "tiktok":
      return <svg {...props}><path d="M9 12a4 4 0 1 0 4 4V2c.6 3 2.8 5 6 5.5" /></svg>;
  }
}
