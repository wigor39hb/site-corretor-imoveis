// Monta o link do WhatsApp, já com uma mensagem pronta (opcional).
export function whatsappLink(numero: string, mensagem?: string): string {
  const base = `https://wa.me/${numero}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}
