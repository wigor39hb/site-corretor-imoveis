"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { mascaraTelefone, whatsappLocal } from "@/lib/helpers/formatters";

// Estilos e peças reaproveitados pelas telas do painel.
export const card: React.CSSProperties = { background: "#fff", border: "1px solid var(--neutral-200)", borderRadius: "12px", overflow: "hidden", marginBottom: "20px" };
export const cardHeader: React.CSSProperties = { padding: "20px 24px", borderBottom: "1px solid var(--neutral-100)" };
export const cardBody: React.CSSProperties = { padding: "24px" };
export const cardTitle: React.CSSProperties = { fontSize: "15px", fontWeight: 600, color: "var(--neutral-900)", fontFamily: "var(--font-sans)" };
export const cardSub: React.CSSProperties = { fontSize: "13px", color: "var(--neutral-400)", marginTop: "3px", fontFamily: "var(--font-sans)" };
export const fieldGroup: React.CSSProperties = { marginBottom: "20px" };
export const fieldLabel: React.CSSProperties = { display: "block", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--neutral-400)", marginBottom: "8px", fontFamily: "var(--font-sans)" };
export const fieldInput: React.CSSProperties = { width: "100%", padding: "11px 14px", border: "1px solid var(--neutral-200)", borderRadius: "8px", fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--neutral-900)", background: "#fff", outline: "none" };
export const fieldHint: React.CSSProperties = { fontSize: "12px", color: "var(--neutral-400)", marginTop: "6px", fontFamily: "var(--font-sans)" };
export const btnPrimary: React.CSSProperties = { padding: "13px", background: "linear-gradient(135deg,var(--gold-500),var(--gold-400))", border: "none", borderRadius: "8px", fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600, color: "var(--navy-900)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" };
export const btnOutline: React.CSSProperties = { padding: "11px", border: "1px solid var(--neutral-200)", borderRadius: "8px", fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 500, color: "var(--neutral-600)", background: "none", cursor: "pointer", textAlign: "center", textDecoration: "none", display: "block" };

export const Obrigatorio = () => <span style={{ color: "var(--gold-500)" }}>*</span>;

export function Toggle({ label, sub, on, onChange }: { label: string; sub: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", gap: "12px" }}>
      <div>
        <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--neutral-900)", fontFamily: "var(--font-sans)" }}>{label}</div>
        <div style={{ fontSize: "12px", color: "var(--neutral-400)", marginTop: "3px", fontFamily: "var(--font-sans)" }}>{sub}</div>
      </div>
      <div role="switch" aria-checked={on} onClick={() => onChange(!on)} style={{ position: "relative", width: "44px", height: "24px", borderRadius: "24px", background: on ? "var(--gold-500)" : "var(--neutral-200)", cursor: "pointer", transition: "background .3s", flexShrink: 0 }}>
        <div style={{ position: "absolute", width: "18px", height: "18px", borderRadius: "50%", background: "#fff", top: "3px", left: on ? "23px" : "3px", transition: "left .3s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
      </div>
    </div>
  );
}

// Campo de WhatsApp: mostra "+55 (11) 99999-9999" enquanto digita e
// devolve só os dígitos com 55 na frente (5511999999999), que é o que vai para o banco.
export function CampoWhatsapp({ valor, onChange }: { valor: string; onChange: (valor: string) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "stretch" }}>
      <span style={{ display: "flex", alignItems: "center", padding: "0 12px", border: "1px solid var(--neutral-200)", borderRight: "none", borderRadius: "8px 0 0 8px", background: "var(--neutral-100)", fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--neutral-600)" }}>+55</span>
      <input
        type="tel"
        inputMode="numeric"
        style={{ ...fieldInput, borderRadius: "0 8px 8px 0" }}
        placeholder="(11) 99999-9999"
        value={mascaraTelefone(whatsappLocal(valor))}
        onChange={(e) => {
          const digitos = e.target.value.replace(/\D/g, "").slice(0, 11);
          onChange(digitos ? "55" + digitos : "");
        }}
      />
    </div>
  );
}

export function useToast() {
  const [msg, setMsg] = useState<{ texto: string; erro: boolean } | null>(null);
  // erro = true mostra o aviso em vermelho e por mais tempo
  const mostrar = (texto: string, erro = false) => {
    setMsg({ texto, erro });
    setTimeout(() => setMsg(null), erro ? 6000 : 3000);
  };
  const toast = msg ? (
    <div style={{ position: "fixed", bottom: "32px", right: "32px", background: "var(--navy-900)", color: "#fff", padding: "16px 24px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", zIndex: 200, borderLeft: `4px solid ${msg.erro ? "#E05252" : "var(--gold-500)"}`, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
      {msg.erro ? "⚠️" : "✅"} <span>{msg.texto}</span>
    </div>
  ) : null;
  return { toast, mostrar };
}

// Mostrado quando um corretor tenta abrir uma tela só de administrador.
export function AcessoRestrito() {
  return (
    <div style={{ ...card, maxWidth: "520px", margin: "40px auto", textAlign: "center", padding: "48px 32px" }}>
      <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(201,169,110,0.12)", color: "var(--gold-500)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <Lock size={24} />
      </div>
      <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 600, color: "var(--neutral-900)", marginBottom: "8px" }}>Acesso restrito</div>
      <p style={{ fontSize: "14px", color: "var(--neutral-400)", fontFamily: "var(--font-sans)", lineHeight: 1.6, marginBottom: "24px" }}>
        Esta área é exclusiva dos administradores da imobiliária.
      </p>
      <Link href="/admin" style={{ ...btnPrimary, display: "inline-flex", padding: "11px 24px" }}>Voltar ao painel</Link>
    </div>
  );
}

// Janela de confirmação para ações que não têm volta (ex.: excluir).
export function ConfirmDialog({ titulo, texto, confirmar, onConfirmar, onCancelar }: {
  titulo: string;
  texto: string;
  confirmar: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}) {
  return (
    <div onClick={onCancelar} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(13,27,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: "12px", padding: "28px", maxWidth: "420px", width: "100%", boxShadow: "0 16px 48px rgba(0,0,0,0.25)" }}>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: "19px", fontWeight: 600, color: "var(--neutral-900)", marginBottom: "8px" }}>{titulo}</div>
        <p style={{ fontSize: "14px", color: "var(--neutral-600)", fontFamily: "var(--font-sans)", lineHeight: 1.6, marginBottom: "24px" }}>{texto}</p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button onClick={onCancelar} style={{ ...btnOutline, padding: "10px 18px" }}>Cancelar</button>
          <button onClick={onConfirmar} style={{ padding: "10px 18px", border: "none", borderRadius: "8px", background: "#C04545", color: "#fff", fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>{confirmar}</button>
        </div>
      </div>
    </div>
  );
}

// Círculo com a foto da pessoa ou, sem foto, as iniciais do nome.
export function Avatar({ nome, fotoUrl, tamanho, style }: { nome: string; fotoUrl: string | null; tamanho: number; style?: React.CSSProperties }) {
  return (
    <div style={{ width: tamanho, height: tamanho, borderRadius: "50%", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", ...style }}>
      {fotoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={fotoUrl} alt={nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        iniciais(nome)
      )}
    </div>
  );
}

export function iniciais(nome: string) {
  return nome.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}
