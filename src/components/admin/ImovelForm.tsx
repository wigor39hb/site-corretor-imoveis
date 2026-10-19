"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSessao } from "@/context/SessaoContext";
import {
  ESTADOS, ESTADO_PADRAO, finalidadeLabel, precoDeDigitos, precoParaCampo, statusLabel, tipoLabel,
  type Finalidade, type Imovel, type Opcao, type StatusImovel, type TipoImovel,
} from "@/lib/imoveis";
import { salvarImovel } from "@/app/admin/(painel)/imoveis/acoes";
import CorretorResponsavelCampo from "@/components/admin/CorretorResponsavelCampo";
import {
  card, cardHeader, cardBody, cardTitle, cardSub, fieldGroup, fieldLabel, fieldInput, fieldHint,
  btnPrimary, btnOutline, Obrigatorio, Toggle, useToast,
} from "@/components/admin/ui";

const corStatus: Record<StatusImovel, string> = {
  disponivel: "#3DAA6F",
  reservado: "#D4900A",
  vendido: "#E05252",
  lancamento: "#2D5986",
};

const vazio: Imovel = {
  id: "", corretorId: "", empreendimentoId: "", titulo: "", tipo: "apartamento", finalidade: "venda",
  status: "disponivel", preco: null, area: null, quartos: 0, suites: 0, banheiros: 0, vagas: 0, andar: "",
  cep: "", endereco: "", numero: "", complemento: "", bairro: "", cidade: "", estado: ESTADO_PADRAO,
  descricao: "", destaque: false, visivel: true,
};

const mascaraCep = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
};

// Formulário de cadastro/edição de imóvel (admin e corretores).
export default function ImovelForm({ inicial, corretores, empreendimentos }: {
  inicial?: Imovel;
  corretores: Opcao[];
  empreendimentos: Opcao[];
}) {
  const router = useRouter();
  const { usuario } = useSessao();
  const { toast, mostrar } = useToast();
  const novo = !inicial;
  const [dados, setDados] = useState<Imovel>(inicial ?? { ...vazio, corretorId: usuario.id });
  const [salvando, setSalvando] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);

  const set = <K extends keyof Imovel>(campo: K, valor: Imovel[K]) =>
    setDados((d) => ({ ...d, [campo]: valor }));
  const inteiro = (v: string) => Math.max(0, parseInt(v, 10) || 0);

  const handleSalvar = async () => {
    setSalvando(true);
    const { erro } = await salvarImovel(dados);
    setSalvando(false);
    if (erro) {
      mostrar(erro, true);
      return;
    }
    mostrar(novo ? (dados.visivel ? "Imóvel publicado!" : "Imóvel salvo (fora do site).") : "Alterações salvas!");
    router.refresh();
    setTimeout(() => router.push("/admin/imoveis"), 1500);
  };

  // Preenche endereço, bairro, cidade e estado pelo CEP (serviço gratuito ViaCEP).
  async function buscarCep() {
    const cep = dados.cep.replace(/\D/g, "");
    if (cep.length !== 8) {
      mostrar("Digite o CEP completo, com 8 números.", true);
      return;
    }
    setBuscandoCep(true);
    try {
      const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const r = await resp.json();
      if (r.erro) {
        mostrar("CEP não encontrado. Preencha o endereço à mão.", true);
        return;
      }
      setDados((d) => ({
        ...d,
        endereco: r.logradouro || d.endereco,
        bairro: r.bairro || d.bairro,
        cidade: r.localidade || d.cidade,
        estado: r.uf || d.estado,
      }));
    } catch {
      mostrar("Não foi possível buscar o CEP agora. Preencha o endereço à mão.", true);
    } finally {
      setBuscandoCep(false);
    }
  }

  const grid = (colunas: string, mb = "16px"): React.CSSProperties => ({ display: "grid", gridTemplateColumns: colunas, gap: "16px", marginBottom: mb });

  return (
    <>
      {toast}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px", alignItems: "start", maxWidth: "1200px" }} className="admin-form-grid">

        {/* COLUNA PRINCIPAL */}
        <div>
          {/* INFORMAÇÕES BÁSICAS */}
          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Informações básicas</div>
              <div style={cardSub}>Dados principais do imóvel</div>
            </div>
            <div style={cardBody}>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Título do anúncio <Obrigatorio /></label>
                <input type="text" style={fieldInput} value={dados.titulo} onChange={(e) => set("titulo", e.target.value)} placeholder="Ex: Apartamento 3 quartos com varanda gourmet" />
                <div style={fieldHint}>Seja descritivo — este título aparece nos cards de imóvel e nas buscas.</div>
              </div>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Descrição completa <Obrigatorio /></label>
                <textarea style={{ ...fieldInput, resize: "vertical", minHeight: "120px", lineHeight: "1.6" }} value={dados.descricao} onChange={(e) => set("descricao", e.target.value)} placeholder="Conte os detalhes: ambientes, acabamento, lazer do condomínio, o que tem por perto..." />
              </div>
              <div style={grid("1fr 1fr", "0")}>
                <div>
                  <label style={fieldLabel}>Tipo <Obrigatorio /></label>
                  <select style={fieldInput} value={dados.tipo} onChange={(e) => set("tipo", e.target.value as TipoImovel)}>
                    {Object.entries(tipoLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label style={fieldLabel}>Finalidade</label>
                  <select style={fieldInput} value={dados.finalidade} onChange={(e) => set("finalidade", e.target.value as Finalidade)}>
                    {Object.entries(finalidadeLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* FOTOS */}
          <div style={card}>
            <div style={cardHeader}>
              <div style={cardTitle}>Fotos</div>
              <div style={cardSub}>A primeira foto será a capa do imóvel</div>
            </div>
            <div style={cardBody}>
              <div style={{ border: "2px dashed var(--neutral-200)", borderRadius: "12px", padding: "32px 24px", textAlign: "center" }}>
                <div style={{ fontSize: "32px", marginBottom: "10px" }}>📸</div>
                <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--neutral-900)", fontFamily: "var(--font-sans)", marginBottom: "6px" }}>Envio de fotos em breve</div>
                <div style={{ fontSize: "13px", color: "var(--neutral-400)", fontFamily: "var(--font-sans)" }}>Por enquanto, cadastre os dados do imóvel. As fotos poderão ser adicionadas depois, editando o imóvel.</div>
              </div>
            </div>
          </div>

          {/* LOCALIZAÇÃO */}
          <div style={card}>
            <div style={cardHeader}><div style={cardTitle}>Localização</div></div>
            <div style={cardBody}>
              <div style={grid("1fr 1fr")}>
                <div>
                  <label style={fieldLabel}>CEP</label>
                  <input type="text" inputMode="numeric" style={fieldInput} value={dados.cep} onChange={(e) => set("cep", mascaraCep(e.target.value))} onKeyDown={(e) => { if (e.key === "Enter") buscarCep(); }} placeholder="00000-000" />
                </div>
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <button type="button" onClick={buscarCep} disabled={buscandoCep} style={{ padding: "11px 16px", border: "1px solid var(--neutral-200)", borderRadius: "8px", background: "none", fontSize: "13px", cursor: "pointer", color: "var(--gold-500)", fontWeight: 500, width: "100%", fontFamily: "var(--font-sans)", opacity: buscandoCep ? 0.6 : 1 }}>
                    {buscandoCep ? "Buscando..." : "Buscar CEP"}
                  </button>
                </div>
              </div>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Endereço <Obrigatorio /></label>
                <input type="text" style={fieldInput} value={dados.endereco} onChange={(e) => set("endereco", e.target.value)} placeholder="Rua, avenida..." />
              </div>
              <div style={grid("1fr 1fr 1fr")}>
                <div><label style={fieldLabel}>Número</label><input type="text" style={fieldInput} value={dados.numero} onChange={(e) => set("numero", e.target.value)} /></div>
                <div><label style={fieldLabel}>Complemento</label><input type="text" style={fieldInput} value={dados.complemento} onChange={(e) => set("complemento", e.target.value)} placeholder="Apto, bloco..." /></div>
                <div><label style={fieldLabel}>Bairro</label><input type="text" style={fieldInput} value={dados.bairro} onChange={(e) => set("bairro", e.target.value)} /></div>
              </div>
              <div style={grid("1fr 1fr", "0")}>
                <div><label style={fieldLabel}>Cidade <Obrigatorio /></label><input type="text" style={fieldInput} value={dados.cidade} onChange={(e) => set("cidade", e.target.value)} /></div>
                <div>
                  <label style={fieldLabel}>Estado</label>
                  <select style={fieldInput} value={dados.estado} onChange={(e) => set("estado", e.target.value)}>
                    {ESTADOS.map((uf) => <option key={uf}>{uf}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* CARACTERÍSTICAS */}
          <div style={card}>
            <div style={cardHeader}><div style={cardTitle}>Características</div></div>
            <div style={cardBody}>
              <div style={grid("1fr 1fr 1fr 1fr", "20px")}>
                <div>
                  <label style={fieldLabel}>Área útil (m²)</label>
                  <input type="number" min={0} step="0.01" style={fieldInput} value={dados.area ?? ""} onChange={(e) => set("area", e.target.value ? Math.max(0, Number(e.target.value)) : null)} />
                </div>
                <div><label style={fieldLabel}>Quartos</label><input type="number" min={0} style={fieldInput} value={dados.quartos} onChange={(e) => set("quartos", inteiro(e.target.value))} /></div>
                <div><label style={fieldLabel}>Banheiros</label><input type="number" min={0} style={fieldInput} value={dados.banheiros} onChange={(e) => set("banheiros", inteiro(e.target.value))} /></div>
                <div><label style={fieldLabel}>Vagas</label><input type="number" min={0} style={fieldInput} value={dados.vagas} onChange={(e) => set("vagas", inteiro(e.target.value))} /></div>
              </div>
              <div style={grid("1fr 1fr", "0")}>
                <div><label style={fieldLabel}>Suítes</label><input type="number" min={0} style={fieldInput} value={dados.suites} onChange={(e) => set("suites", inteiro(e.target.value))} /></div>
                <div><label style={fieldLabel}>Andar</label><input type="text" style={fieldInput} value={dados.andar} onChange={(e) => set("andar", e.target.value)} placeholder="Ex: 8º andar" /></div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA LATERAL */}
        <div>
          <CorretorResponsavelCampo opcoes={corretores} valor={dados.corretorId} onChange={(id) => set("corretorId", id)} />

          {/* PREÇO E STATUS */}
          <div style={{ ...card, marginBottom: "16px" }}>
            <div style={{ ...cardHeader, padding: "16px 20px" }}><div style={cardTitle}>Preço e status</div></div>
            <div style={{ padding: "20px" }}>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Preço <Obrigatorio /></label>
                <input type="text" inputMode="numeric" style={fieldInput} value={precoParaCampo(dados.preco)} onChange={(e) => set("preco", precoDeDigitos(e.target.value))} placeholder="R$ 0,00" />
                <div style={fieldHint}>Digite só os números; os dois últimos são os centavos.</div>
              </div>
              <div>
                <label style={fieldLabel}>Status <Obrigatorio /></label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {(Object.keys(statusLabel) as StatusImovel[]).map((st) => {
                    const sel = dados.status === st;
                    return (
                      <button type="button" key={st} onClick={() => set("status", st)} style={{
                        padding: "12px 14px", border: `1px solid ${sel ? corStatus[st] : "var(--neutral-200)"}`,
                        borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px",
                        background: sel ? `${corStatus[st]}18` : "transparent", transition: "all .2s",
                      }}>
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: corStatus[st], flexShrink: 0 }} />
                        <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--neutral-900)", fontFamily: "var(--font-sans)" }}>{statusLabel[st]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* EMPREENDIMENTO */}
          <div style={{ ...card, marginBottom: "16px" }}>
            <div style={{ ...cardHeader, padding: "16px 20px" }}><div style={cardTitle}>Empreendimento</div></div>
            <div style={{ padding: "20px" }}>
              <label style={fieldLabel}>Vincular a um empreendimento</label>
              <select style={fieldInput} value={dados.empreendimentoId} onChange={(e) => set("empreendimentoId", e.target.value)}>
                <option value="">Nenhum (imóvel avulso)</option>
                {empreendimentos.map((e) => <option key={e.id} value={e.id}>{e.nome}</option>)}
              </select>
              <div style={fieldHint}>O imóvel aparecerá na página do empreendimento.</div>
            </div>
          </div>

          {/* PUBLICAÇÃO */}
          <div style={{ ...card, marginBottom: "16px" }}>
            <div style={{ ...cardHeader, padding: "16px 20px" }}><div style={cardTitle}>Publicação</div></div>
            <div style={{ padding: "20px" }}>
              <Toggle label="Imóvel em destaque" sub="Aparece no topo da galeria" on={dados.destaque} onChange={(v) => set("destaque", v)} />
              <Toggle label="Visível no site" sub="Desmarque para guardar como rascunho" on={dados.visivel} onChange={(v) => set("visivel", v)} />
            </div>
          </div>

          {/* AÇÕES */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button id="topbar-publicar" onClick={handleSalvar} disabled={salvando} style={{ ...btnPrimary, opacity: salvando ? 0.7 : 1 }}>
              {salvando ? "Salvando..." : novo ? "Publicar imóvel" : "Salvar alterações"}
            </button>
            <a href="/admin/imoveis" style={btnOutline}>Cancelar</a>
          </div>
        </div>
      </div>
    </>
  );
}
