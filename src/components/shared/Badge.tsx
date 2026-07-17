type BadgeVariant =
  | "disponivel"
  | "vendido"
  | "reservado"
  | "lancamento"
  | "em-construcao"
  | "pronto"
  | "gold"
  | "navy";

const styles: Record<BadgeVariant, string> = {
  disponivel: "bg-[#E8F5EE] text-[#1E7A45]",
  vendido: "bg-[#FDECEA] text-[#C0392B]",
  reservado: "bg-[#FEF3E2] text-[#B7640A]",
  lancamento: "bg-navy-800 text-gold-400",
  "em-construcao": "bg-[#FEF3E2] text-[#B7640A]",
  pronto: "bg-[#E8F5EE] text-[#1E7A45]",
  gold: "bg-gold-500 text-navy-900",
  navy: "bg-navy-800 text-gold-400",
};

const labels: Record<BadgeVariant, string> = {
  disponivel: "Disponível",
  vendido: "Vendido",
  reservado: "Reservado",
  lancamento: "Lançamento",
  "em-construcao": "Em Construção",
  pronto: "Pronto",
  gold: "",
  navy: "",
};

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  className?: string;
}

export default function Badge({ variant, label, className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-sm",
        styles[variant],
        className,
      ].join(" ")}
    >
      {label ?? labels[variant]}
    </span>
  );
}
