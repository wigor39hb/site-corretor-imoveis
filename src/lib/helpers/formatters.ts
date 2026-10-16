export function formatPrice(value: number | null): string {
  if (!value) return "Consulte";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatArea(value: number | null): string {
  if (!value) return "—";
  return `${value.toLocaleString("pt-BR")} m²`;
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("pt-BR");
}

// WhatsApp: no banco fica sempre só com dígitos, com 55 na frente (5511999999999).
// Na tela aparece formatado: (11) 99999-9999.
export function whatsappLocal(valor: string): string {
  const d = valor.replace(/\D/g, "");
  return d.startsWith("55") ? d.slice(2) : d;
}

export function mascaraTelefone(digitos: string): string {
  const d = digitos.slice(0, 11);
  if (!d) return "";
  if (d.length <= 2) return `(${d}`;
  const ddd = d.slice(0, 2);
  const resto = d.slice(2);
  if (resto.length <= 4) return `(${ddd}) ${resto}`;
  if (d.length <= 10) return `(${ddd}) ${resto.slice(0, 4)}-${resto.slice(4)}`;
  return `(${ddd}) ${resto.slice(0, 5)}-${resto.slice(5)}`;
}

export function formatWhatsapp(valor: string): string {
  const local = whatsappLocal(valor);
  return local ? `+55 ${mascaraTelefone(local)}` : "";
}

// Válido = DDD + 8 ou 9 dígitos.
export function whatsappValido(valor: string): boolean {
  const local = whatsappLocal(valor);
  return local.length === 10 || local.length === 11;
}
