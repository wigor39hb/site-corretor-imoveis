# Site KL Investimentos Imobiliários — estado do projeto

> Documento de continuidade. Registra as decisões, o que já foi feito e o que falta,
> para retomar o trabalho sem precisar explicar tudo de novo.
> **Última atualização:** 15/10/2026.

---

## 1. Visão geral

- **O que é:** site de uma imobiliária, a **KL Investimentos Imobiliários** (São Paulo, alto padrão), com **vários corretores**.
- **Quem é quem:**
  - **Desenvolvedor:** você (Wigor).
  - **Cliente:** o dono da KL, que vai comprar o site.
- **Origem:** começou como um modelo só de front-end, feito para **um** corretor, com dados de exemplo (mock). Está sendo transformado num site real para a imobiliária.
- **Tecnologias:** Next.js 14 (App Router), TypeScript, Tailwind, React Hook Form + Zod.
- **Repositório:** https://github.com/wigor39hb/site-corretor-imoveis (branch `main`).
- **Pasta local:** `C:\Users\Wigor Ernandes\Documents\Marketing-suzete\fornt-end`

---

## 2. Decisões tomadas

### 2.1 Imobiliária com vários corretores
- O site é **da imobiliária**, não de um corretor. Os textos públicos devem falar em nome da empresa ("nós", "nossa equipe").
- Cada corretor aparece no site com nome, CRECI, foto e **o próprio WhatsApp**:
  - na página **Contato**, seção "Nossa Equipe";
  - em cada imóvel ou empreendimento pelo qual é responsável, no cartão "Corretor responsável".
- O **WhatsApp do dono** aparece nos pontos gerais do site (ex.: botão principal da página inicial).
- Os dados do site e dos corretores **não ficam fixos no código**: serão editados pelo painel admin.
- **Não existe cadastro público.** Só administradores criam contas.

### 2.2 Papéis no painel admin

| Papel | Pode fazer |
|---|---|
| **Administrador** (você e o dono) | Tudo: cadastrar, editar e desativar corretores; editar as configurações do site; ver e editar todas as publicações |
| **Corretor** | Só editar o **próprio perfil** e as **próprias publicações** (imóveis e empreendimentos). Não vê nem mexe em outros usuários |

### 2.3 Infraestrutura (hospedagem)
**Escolha: Vercel + Supabase + Registro.br**

| Peça | Serviço | Desenvolvimento | Lançamento |
|---|---|---|---|
| Site | **Vercel** | grátis (Hobby) | **Pro**, ~US$ 20/mês |
| Banco, login e fotos | **Supabase** | grátis (Free) | **Pro**, ~US$ 25/mês |
| Domínio `.com.br` | **Registro.br** | — | ~R$ 40/ano |

Por que os planos pagos no lançamento:
- O **Vercel Hobby** é só para uso **não comercial**.
- O **Supabase Free** pausa após 7 dias sem uso e **não tem backup diário**.

Outros pontos combinados:
- **Domínio registrado no CNPJ da KL** (do cliente). Você fica como contato técnico.
- **Hospedagem embutida na mensalidade de manutenção** que você cobra do cliente.
- **E-mail profissional** (ex.: `contato@...`) é à parte e opcional: Google Workspace, Zoho, ou o da Hostinger/HostGator.
- **Alternativas avaliadas e descartadas por agora:**
  - Hostinger e HostGator: a hospedagem comum é feita para WordPress/PHP e não serve bem para Next.js. Servem para domínio e e-mail.
  - VPS: mais barata, mas você vira o responsável pelo servidor. Fica para quando tiver mais experiência e mais clientes.
- **Como a publicação vai funcionar:** `git push` → a Vercel publica sozinha → o domínio aponta para a Vercel → o site lê e grava no Supabase.

### 2.4 Fotos dos imóveis e empreendimentos
- **Sem limite de quantidade** de fotos por imóvel ou empreendimento. Só um limite de **tamanho por arquivo**, para recusar arquivos absurdos.
- **Compressão automática no navegador, antes do envio:** formato **WebP**, lado maior **~2560px**, **qualidade ~85%**. Esses valores ficam numa configuração fácil de mudar.
- **3 versões de cada foto:**
  - pequena, ~800px (cards e celular);
  - média, ~1600px (notebook);
  - grande, ~2560px (monitores grandes e galeria em tela cheia).

  O navegador escolhe sozinho a versão certa (imagens responsivas). Usar só 2 versões é a alternativa, se preferir.
- As fotos ficam no **Supabase Storage**, não no banco. O banco guarda só o endereço de cada foto.
- **Ao excluir uma foto ou um imóvel, o arquivo também é apagado** do armazenamento.
- **Mostrar no Dashboard o espaço usado** (ex.: "3,2 GB de 100 GB").
- **Estimativa:**
  - cada foto ocupa ~0,75 MB somando as 3 versões, então os ~100 GB do plano Pro cabem ~130 mil fotos;
  - se passar do limite, o excedente custa por volta de US$ 0,02 por GB por mês.
- **A decidir:**
  - fazer um teste com fotos reais da KL, comparando lado a lado com o original;
  - guardar ou não a foto original como backup;
  - o que fazer com as fotos de imóveis vendidos (manter todas ou deixar só a capa).

### 2.5 Dashboard de métricas (etapa bônus)
- Ideias: visitas, cliques no WhatsApp, contatos por corretor e por imóvel, alertas…
- **Só depois que todo o painel admin estiver pronto.** Você ainda vai escolher quais ideias usar.

### 2.6 Preço e proposta
- A proposta comercial **só depois do site pronto**: com o trabalho pronto para mostrar, fica mais fácil vender e justificar o valor.
- **Referência de mercado (conversa de curiosidade):**
  - Esforço estimado: 220–315 h sem o dashboard; o dashboard soma +30–50 h.
  - Mercado: freelancer iniciante R$ 10–18 mil; pleno R$ 20–35 mil; agência R$ 40–80 mil ou mais. Sistemas prontos de imobiliária custam R$ 300–900/mês.
  - Sugestão:
    - desenvolvimento **R$ 12–15 mil**, pago 30/40/30 por etapa;
    - dashboard à parte, **R$ 2.500–4.000**;
    - manutenção **R$ 400–700/mês**, já com a hospedagem incluída.
  - O contrato deve prever: limite de corretores; o que está fora do escopo (integração com portais ZAP/VivaReal/OLX, aplicativo, CRM); que o conteúdo (textos e fotos) é responsabilidade do cliente; quem paga os serviços externos.

---

## 3. Ordem das etapas

| # | Etapa | Status |
|---|---|---|
| 0 | Adaptar o front-end para imobiliária (nome KL, equipe, WhatsApp por corretor) | ✅ parcial (falta Sobre e lista de Empreendimentos) |
| 1 | **Área administrativa** (visual, com dados de exemplo) | ✅ primeira versão pronta; aguardando os ajustes que você quer fazer |
| 2 | Ajustar as telas públicas para vários corretores | ⏭️ próxima |
| 3 | Banco de dados (Supabase): tabelas, login real, fotos | ⏳ |
| 4 | Ativar tela por tela com dados reais e testar | ⏳ |
| 5 | Formulário de contato funcionando | ⏳ |
| 6 | SEO / analytics / LGPD (com calma, entendendo antes) | ⏳ |
| 7 | Domínio e publicação (Vercel Pro + Supabase Pro) | ⏳ |
| ⭐ | Bônus: dashboard de métricas | ⏳ |

---

## 4. O que já foi feito

> Nada disso foi commitado ainda (ver seção 7).

### 4.1 Site público
- `src/lib/site.ts` — dados da imobiliária: nome, nome curto, CRECI, WhatsApp e e-mail do dono. **Valores provisórios.**
- Menu (`Navbar`) e rodapé (`Footer`) com o nome KL; "Fale Comigo" virou "Fale Conosco"; título das páginas = nome da KL.
- **Página inicial:** o botão de WhatsApp vai para o número do dono, com mensagem pronta.
- **Página Contato:** textos em nome da empresa e nova seção **"Nossa Equipe"** (`#equipe`), com o cartão e o WhatsApp de cada corretor.
- **Detalhe do imóvel e do empreendimento:** cartão "Corretor responsável"; WhatsApp e e-mail vão para o corretor.
- `src/lib/helpers/whatsapp.ts` — monta o link do WhatsApp com mensagem.
- `src/components/public/CorretorResponsavel.tsx` — cartão do corretor.

### 4.2 Painel admin
- **Login simulado** — `src/lib/auth-config.ts` com `LOGIN_SIMULADO = true`:
  - o login aceita **qualquer e-mail e senha**;
  - a proteção do `/admin`, o layout do painel e o botão Sair não consultam o Supabase;
  - ⚠️ **Não pode ir para o ar assim.** Na etapa do banco, mudar para `false`.
- **Estrutura de pastas:** as telas do painel ficam em `src/app/admin/(painel)/` e o login fica fora, em `src/app/admin/login/`. Isso corrigiu um loop de redirecionamento: o login mandava para ele mesmo. Os endereços (URLs) não mudaram.
- **Botão Sair** funcionando: `src/app/api/auth/logout/route.ts`.
- **Simulação de papéis** — `src/context/SessaoContext.tsx`:
  - no menu lateral, a caixa **"Teste: ver painel como"** troca entre Ana (Administrador), Bruno e Carla (Corretores);
  - é temporária, até o login real.
- **Menu lateral:** mostra o nome e o papel do usuário. "Corretores" e "Configurações do site" só aparecem para administradores.
- **Dashboard:** contagens vindas dos dados de exemplo: imóveis, empreendimentos, disponíveis, corretores ativos.
- **Corretores** (só admin) — `/admin/corretores`:
  - lista com busca, filtro de ativos/inativos e número de imóveis de cada um;
  - desativar ou reativar um corretor;
  - telas **novo** e **editar** (`src/components/admin/CorretorForm.tsx`): dados, WhatsApp, papel, ativo, e-mail de acesso e "enviar link de nova senha";
  - ninguém consegue mudar o próprio papel nem se desativar.
- **Configurações do site** (só admin) — `/admin/configuracoes`: identidade (nome, CRECI, logo), contato principal, redes sociais, textos da página inicial, números em destaque, texto do Sobre e depoimentos.
- **Meu perfil** — `/admin/perfil`: edita só os dados de quem está logado, com prévia do cartão.
- **Imóveis** — `/admin/imoveis`:
  - o corretor vê só os seus; o admin vê todos, com coluna e filtro de corretor;
  - abas de status que filtram, paginação (10 por página), excluir com confirmação;
  - ações em massa: mudar status e excluir selecionados.
- **Empreendimentos** — `/admin/empreendimentos`:
  - o corretor vê só os seus; o admin vê todos, com o nome do corretor;
  - excluir com confirmação.
- **Formulários de imóvel e empreendimento:**
  - card **"Corretor responsável"**: o admin escolhe o corretor; o corretor publica em nome próprio;
  - a edição carrega os dados do item aberto;
  - aviso se um corretor tentar editar a publicação de outro;
  - aviso de "Não encontrado" para itens inexistentes.
- **Peças reaproveitáveis do painel** — `src/components/admin/ui.tsx`: estilos, Toggle, aviso de sucesso (toast), janela de confirmação, Acesso restrito.
- **Dados de exemplo** — `src/lib/mock/`:
  - `corretores.ts`: 3 corretores; a Ana é administradora;
  - `publicacoes.ts`: 8 imóveis e 6 empreendimentos, cada um com seu corretor.

**Limitação atual:** sem banco, nada é salvo. Excluir, mudar status ou editar só vale até recarregar a página.

---

## 5. Pendências e perguntas em aberto

### Informações do cliente
- [ ] Logo da KL (você vai enviar). Vai substituir o nome escrito no menu, no rodapé e no painel.
- [ ] Confirmar a grafia "KL Investimentos Imobiliários".
- [ ] CRECI-J real, WhatsApp e e-mail reais do dono. Hoje são provisórios em `src/lib/site.ts`.
- [ ] Dados reais dos corretores.

### Telas públicas (próxima etapa)
- [ ] **Página Sobre** ainda fala em 1ª pessoa ("João Corretor", "Minha história", depoimentos citando João, link de WhatsApp antigo). Tem também um aviso do lint: variável `i` sem uso, perto da linha 152.
- [ ] **Lista de Empreendimentos** ainda tem o link de WhatsApp antigo. Você vai decidir para qual número ele aponta.
- [ ] A página Contato deve mostrar **só os corretores ativos**.
- [ ] Onde mais destacar o WhatsApp do dono? Ideias: botão flutuante, página Sobre, rodapé, o dono como primeiro da equipe com um selo.
- [ ] O dono também anuncia imóveis como corretor? Se sim, ele é administrador **e** corretor.

### Regras para definir antes do banco
- [ ] Empreendimentos: só administradores publicam, ou corretores também? **Hoje os corretores também podem**, vendo só os seus.
- [ ] Publicações de corretor precisam de aprovação de um admin antes de ir para o site?
- [ ] O formulário de contato manda a mensagem para o admin ou para o corretor do imóvel?
- [ ] Quando um corretor sai da equipe, os imóveis dele somem ou são transferidos para outro corretor?
- [ ] Fotos: teste com fotos reais, guardar o original, política para imóveis vendidos (ver 2.4).

### Ajustes do painel
- [ ] Você disse que viu outros ajustes a fazer no painel. **Ainda não me passou quais.**
- [ ] Ainda só visual: envio de fotos, "Buscar CEP", sininho de notificações.
- [ ] Em telas pequenas, alguns campos lado a lado dos formulários ainda não se ajustam bem.

---

## 6. Como rodar e testar

1. Abra o terminal na pasta `fornt-end`.
2. Rode `npm run dev -- -p 3001` e espere aparecer `✓ Ready`.
3. Abra:
   - site: `http://localhost:3001`
   - painel: `http://localhost:3001/admin/login`, entrando com qualquer e-mail e senha.
4. Use a caixa **"Teste: ver painel como"**, no menu lateral, para alternar entre administrador e corretor.

Cuidados:
- **O computador está com pouca memória.** O servidor já caiu mais de uma vez. Feche programas e abas que não estiver usando. Se houver outro projeto rodando na porta 3000, desligue-o.
- Se aparecer `EADDRINUSE` (porta ocupada), sobrou um servidor antigo travado. Encerre o processo ou use outra porta (`-p 3002`).
- O `.env.local` (chaves do Supabase) **não vai para o GitHub** e nunca deve ser compartilhado.

Verificações de código (rodar na pasta `fornt-end`):
- `npx tsc --noEmit` — checa os tipos.
- `npx next lint` — checa o padrão do código.

---

## 7. Próximos passos

1. **Salvar o trabalho no GitHub.** Nada desta etapa foi commitado ainda.
2. Você me passa os ajustes que viu no painel.
3. Etapa 2: adaptar as telas públicas (Sobre, lista de Empreendimentos, só corretores ativos…).
4. Responder às perguntas da seção 5 antes da etapa do banco.
