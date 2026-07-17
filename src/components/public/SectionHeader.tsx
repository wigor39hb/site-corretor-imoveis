interface SectionHeaderProps {
  tag?: string;
  title: string;
  subtitle?: string;
  light?: boolean;
  center?: boolean;
}

export default function SectionHeader({
  tag,
  title,
  subtitle,
  light = false,
  center = false,
}: SectionHeaderProps) {
  return (
    <div
      style={{
        textAlign: center ? "center" : "left",
        marginBottom: "56px",
      }}
    >
      {tag && (
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--gold-500)",
            marginBottom: "16px",
          }}
        >
          {tag}
        </p>
      )}
      <h2
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "clamp(32px, 5vw, 48px)",
          fontWeight: 700,
          color: light ? "#fff" : "var(--navy-900)",
          lineHeight: 1.1,
          marginBottom: subtitle ? "20px" : 0,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "16px",
            color: light ? "rgba(255,255,255,0.6)" : "var(--neutral-600)",
            lineHeight: 1.7,
            maxWidth: center ? "600px" : undefined,
            margin: center ? "0 auto" : undefined,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
