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
