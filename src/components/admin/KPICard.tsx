interface KPICardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  change?: number;
}

export default function KPICard({
  title,
  value,
  icon,
  color,
  change,
}: KPICardProps) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--neutral-200)",
        borderRadius: "4px",
        padding: "24px",
        display: "flex",
        alignItems: "flex-start",
        gap: "16px",
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "10px",
          background: `${color}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: color,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "12px",
            color: "var(--neutral-400)",
            letterSpacing: "0.05em",
            marginBottom: "6px",
            textTransform: "uppercase",
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "32px",
            fontWeight: 700,
            color: "var(--navy-900)",
            lineHeight: 1,
          }}
        >
          {typeof value === "number" ? value.toLocaleString("pt-BR") : value}
        </p>
        {change !== undefined && (
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "12px",
              color: change >= 0 ? "var(--success)" : "var(--error)",
              marginTop: "6px",
            }}
          >
            {change >= 0 ? "+" : ""}
            {change}% este mês
          </p>
        )}
      </div>

      {/* Bottom gold accent on hover — CSS trick via inline style */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: `linear-gradient(90deg, ${color}, transparent)`,
          opacity: 0.5,
        }}
      />
    </div>
  );
}
