"use client";

import { useEffect, useState } from "react";

const INTERVALO_MS = 5000;

// Carrossel da primeira tela: troca de foto sozinho; clicar e segurar
// (ou encostar o dedo) pausa na foto atual, e ao soltar volta a rodar.
export default function HeroCarrossel({ fotos, nome }: { fotos: string[]; nome: string }) {
  const [atual, setAtual] = useState(0);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (pausado || fotos.length < 2) return;
    const timer = setTimeout(() => setAtual((i) => (i + 1) % fotos.length), INTERVALO_MS);
    return () => clearTimeout(timer);
  }, [atual, pausado, fotos.length]);

  if (fotos.length === 0) {
    return (
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, var(--navy-700) 0%, var(--navy-800) 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 700, color: "rgba(201,169,110,0.35)",
        textAlign: "center", padding: "24px",
      }}>
        {nome}
      </div>
    );
  }

  const pausar = () => setPausado(true);
  const continuar = () => setPausado(false);

  return (
    <div
      onPointerDown={pausar}
      onPointerUp={continuar}
      onPointerLeave={continuar}
      onPointerCancel={continuar}
      onContextMenu={(e) => e.preventDefault()}
      style={{ position: "absolute", inset: 0, overflow: "hidden", background: "var(--navy-800)", userSelect: "none", WebkitTouchCallout: "none", touchAction: "pan-y" }}
    >
      {fotos.map((url, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={url}
          src={url}
          alt={i === atual ? nome : ""}
          aria-hidden={i !== atual}
          draggable={false}
          loading={i === 0 ? "eager" : "lazy"}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
            opacity: i === atual ? 1 : 0, transition: "opacity 1.2s ease",
            pointerEvents: "none",
          }}
        />
      ))}
    </div>
  );
}
