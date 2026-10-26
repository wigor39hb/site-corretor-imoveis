"use client";

import Link from "next/link";
import { useSessao } from "@/context/SessaoContext";
import type { Opcao } from "@/lib/imoveis";
import { card, cardHeader, cardTitle, fieldLabel, fieldInput, fieldHint, btnPrimary } from "@/components/admin/ui";

// Card "Corretor responsável" do formulário de imóvel.
// Admin escolhe o corretor; corretor publica sempre em nome próprio.
export default function CorretorResponsavelCampo({ opcoes, valor, onChange }: {
  opcoes: Opcao[];
  valor: string;
  onChange: (id: string) => void;
}) {
  const { isAdmin, usuario } = useSessao();
  // Só ativos, mas mantém o atual mesmo se tiver sido desativado (para o admin transferir).
  const lista = opcoes.filter((c) => c.ativo !== false || c.id === valor);

  return (
    <div style={{ ...card, marginBottom: "16px" }}>
      <div style={{ ...cardHeader, padding: "16px 20px" }}><div style={cardTitle}>Corretor responsável</div></div>
      <div style={{ padding: "20px" }}>
        {isAdmin ? (
          <>
            <label style={fieldLabel}>Quem atende este anúncio</label>
            <select style={fieldInput} value={valor} onChange={(e) => onChange(e.target.value)}>
              {lista.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}{c.id === usuario.id ? " (você)" : ""}{c.ativo === false ? " (inativo)" : ""}
                </option>
              ))}
            </select>
          </>
        ) : (
          <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--neutral-900)", fontFamily: "var(--font-sans)" }}>
            {usuario.nome} (você)
          </div>
        )}
        <div style={fieldHint}>Os botões de WhatsApp e e-mail do anúncio vão para este corretor.</div>
      </div>
    </div>
  );
}

function Aviso({ titulo, texto, voltarPara }: { titulo: string; texto: string; voltarPara: string }) {
  return (
    <div style={{ ...card, maxWidth: "520px", margin: "40px auto", textAlign: "center", padding: "48px 32px" }}>
      <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 600, color: "var(--neutral-900)", marginBottom: "8px" }}>{titulo}</div>
      <p style={{ fontSize: "14px", color: "var(--neutral-400)", fontFamily: "var(--font-sans)", lineHeight: 1.6, marginBottom: "24px" }}>{texto}</p>
      <Link href={voltarPara} style={{ ...btnPrimary, display: "inline-flex", padding: "11px 24px" }}>Voltar à lista</Link>
    </div>
  );
}

// Mostrado quando um corretor abre a edição de uma publicação de outro corretor.
export function PublicacaoDeOutroCorretor({ voltarPara }: { voltarPara: string }) {
  return <Aviso titulo="Publicação de outro corretor" texto="Você só pode editar as suas próprias publicações." voltarPara={voltarPara} />;
}

// Mostrado quando o endereço aponta para algo que não existe (ou foi excluído).
export function PublicacaoNaoEncontrada({ voltarPara }: { voltarPara: string }) {
  return <Aviso titulo="Não encontrado" texto="Este item não existe ou foi excluído." voltarPara={voltarPara} />;
}
