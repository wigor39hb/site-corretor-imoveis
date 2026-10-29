# Site KL Negócios Imobiliários — estado do projeto

> Documento de continuidade. Registra as decisões, o que já foi feito e o que falta,
> para retomar o trabalho sem precisar explicar tudo de novo.
> **Última atualização:** 29/10/2026.

### ▶️ Onde paramos (ler primeiro ao retomar)
- **▶️ PRÓXIMO: você termina o teste da tela Empreendimentos** (a importação agora funciona também com PDFs que têm fundo repetido; ver 29/10 na seção 9). Roteiro na seção 9 (27/10, a partir do passo 4: publicar, ver no site, editar, "Em breve", conta de assistente). O 008 já foi rodado e a **importação do PDF já funcionou** com você. Se der erro, mandar o texto inteiro da mensagem vermelha (agora ela mostra o motivo entre parênteses).
- **29/10:** importação do PDF corrigida para PDFs com **textura de fundo repetida** (Caderno Técnico My Club, BOOK DIGITAL 3). Você testou e funcionou. Ver seção 9.
- **27/10:** Empreendimentos ligado ao banco (painel e site) + **importar fotos do PDF da construtora**. A página pública mostra só capa, galeria de lazer e contato: **sem plantas, implantação nem condições de pagamento** (pedido da corretora: com tudo no site, o cliente não chama). Ver seção 9.
- **26/10:** novo tipo de conta **Assistente** (cuida dos empreendimentos) e Empreendimentos só para admin + assistente. Banco atualizado (007 rodado) e testado por você. Tudo no GitHub (commit `0060ca5`). Ver seção 9.
- **20/10:** cadastro de imóvel refeito, com fotos funcionando, e site público (home, lista e página do imóvel) lendo do banco. Tudo salvo no GitHub (commit `d772e76`). Detalhes na seção 9.
- **Você vai mostrar o projeto ao cliente** rodando no notebook da sua mãe (`git clone`/`git pull` → copiar `.env.local` → `npm install` → `npm run dev`).
- **Propostas comerciais:** rascunho das duas (licença e assinatura) na seção 2.9. **Falta você escolher os valores** para eu montar o documento para enviar ao cliente.
- **Depois:** mapa com círculo da região do imóvel (perguntas em aberto na seção 5), ligar a tela de **Empreendimentos** ao banco (com WhatsApp do dono na página pública), página Sobre e os ajustes que o cliente pedir.

---

## 1. Visão geral

- **O que é:** site de uma imobiliária, a **KL Negócios Imobiliários** ("KL Imóveis"), com **vários corretores**.
  - **Fica em Cuiabá-MT** (Av. Historiador Rubens de Mendonça, 1200, Alvorada). O nome e a cidade foram atualizados por você nas Configurações do site em 16/10/2026 (antes o modelo dizia "KL Investimentos", São Paulo).
  - O nome, os contatos e os textos **não ficam no código**: vêm das Configurações do site, no banco.
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
| **Assistente** (26/10/2026) | Cuida de **todos os empreendimentos** (ver, criar, editar, excluir, fotos) e edita o próprio perfil. **Não** mexe em imóveis, não vê Corretores nem Configurações e **não aparece no site** |
| **Corretor** | Só editar o **próprio perfil** e os **próprios imóveis**. Não vê nem mexe em outros usuários. **Não tem acesso a Empreendimentos** (decisão de 26/10/2026) |

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
- **Atualização 20/10:** o cliente quer negociar antes do site ficar pronto. Ver a seção 2.9.

### 2.9 Propostas comerciais (rascunho de 20/10/2026, valores ainda não escolhidos)
O cliente vai escolher entre duas propostas.

**Três cuidados:**
1. **Na "compra", vender uma licença, não o código.** A licença é de uso perpétuo e não exclusivo: ele usa para sempre na imobiliária dele, mas o sistema continua sendo seu, e ele não pode revender nem copiar. Sem isso, você não poderia vender o mesmo sistema a outros clientes.
2. **A assinatura de R$ 500 sozinha paga pouco.** Sobram ~R$ 250/mês, ou ~R$ 3 mil no ano. Por isso entra uma taxa de implantação.
3. **Um cliente novo custa bem menos que R$ 250.** A Vercel Pro é por usuário e serve vários sites; cada projeto Supabase a mais custa ~US$ 10/mês. Cada cliente novo sai por ~R$ 60/mês. *(Confirmar os preços antes de fechar: são em dólar.)*

**Proposta A: licença de uso (compra)**
- Licença + implantação: **R$ 12–15 mil**, sendo 50% na assinatura do contrato e 50% com o site no ar.
- Garantia de 90 dias para erros do sistema.
- Suporte (correções): **R$ 120–150/hora**, mínimo 1 h, só quando ele chamar.
- Atualizações (funções novas): orçamento por escopo, aprovado antes.
- O cliente paga a operação (~R$ 250/mês) **direto**. As contas da Vercel, do Supabase e do domínio ficam **no nome dele**, com você como colaborador.
- Definir no contrato: **correção** é o que já deveria funcionar e quebrou; **atualização** é algo novo ou diferente. Definir também o prazo de resposta.

**Proposta B: assinatura de 12 meses**
- Implantação de **R$ 2–3 mil** (uma vez) e mensalidade de **R$ 500–600**, com hospedagem, banco, fotos, backup e domínio inclusos. A operação é sua.
- Correções inclusas. Pacotes de atualização são extra (mesma base de hora).
- Opcional: pagamento anual adiantado com ~10% de desconto.
- Cláusulas:
  - multa de ~30% das mensalidades restantes se cancelar antes;
  - reajuste anual pelo IPCA, com revisão se o dólar subir muito;
  - ao cancelar, o site sai do ar e os dados são entregues a ele;
  - o domínio fica no nome dele.

**Desconto por indicação (só na assinatura):** 10% por cliente indicado **ativo**, com limite de 30%.
- Exemplo com 3 indicados: ele paga R$ 350, ainda acima do custo de R$ 250. Cada indicado rende ~R$ 440 líquidos.
- Regras:
  - começa após o 1º pagamento do indicado e vale só enquanto o indicado estiver ativo e em dia;
  - não vale sobre implantação nem sobre atualizações;
  - não vira dinheiro.

**Comparação (valores do meio):**
- Licença: 1º ano ≈ R$ 16.500 (R$ 13.500 + operação); depois ≈ R$ 3.000/ano, mais o suporte avulso.
- Assinatura: 1º ano ≈ R$ 9.100; depois ≈ R$ 6.600/ano.

**Impostos:** no Simples, a partir de ~6%. Como pessoa física é mais. Falar com um contador antes de fechar.

---

### 2.7 Banco de dados agora, junto com os ajustes (decisão de 16/10/2026)
- Em vez de ajustar todo o painel com dados de exemplo e só depois ligar o banco, **o banco foi ligado antes**. Cada tela do painel é ajustada **e** ligada ao banco de uma vez, e o resultado já aparece no site.
- O banco pode ser alterado à vontade enquanto só houver dados de teste. **Dados reais da KL só quando o painel estiver estável.**
- Cada mudança no banco vai num **arquivo novo** na pasta `supabase/` (ex.: `supabase/002_campo_iptu.sql`), rodado no SQL Editor, para ficar registrado no GitHub. **Nunca rodar de novo o `schema.sql`** (dá erro de "already exists").
- Regras que estavam em aberto ficaram assim por padrão (fáceis de mudar):
  - corretores **podem** publicar empreendimentos (vendo só os seus);
  - publicações **não** precisam de aprovação de admin;
  - corretor desativado some do site, mas os imóveis dele **ficam guardados** (não aparecem no site) para o admin transferir; o banco não deixa apagar um corretor que tenha publicações.

### 2.8 Página inicial apresenta a imobiliária (16/10/2026)
- **Primeira tela:**
  - no lugar da foto do corretor, um **carrossel de fotos** que troca sozinho a cada 5 s (transição suave);
  - **clicar e segurar** (ou encostar o dedo) pausa na foto atual; ao soltar, volta a rodar; sem legenda e sem link;
  - as fotos são escolhidas pelo cliente em Configurações do site (adicionar várias, mudar a ordem, remover); você colocou fotos de teste;
  - **os dois cartões flutuantes** ("342+", "★ 4.9") **foram removidos**;
  - botão **"Conheça nosso trabalho"** (era "meu").
- **Seção "Sobre Nós"** (mais abaixo na home): apresentação da empresa, com **uma foto única** da imobiliária (campo separado, sem carrossel); **título, texto e destaques editáveis pelo cliente** (opção "a"); o quadrinho "10+" saiu; botão "Fale Conosco".
- **Destaque nos títulos:** texto entre `*asteriscos*` aparece em itálico colorido (título da primeira tela e da seção Sobre).
- **Logo** (substitui o nome escrito; sem logo, volta o nome): menu do site, rodapé, menu lateral do painel e tela de login. Precisa ser **PNG com fundo transparente, versão clara** (todos esses fundos são azul-marinho). A margem transparente em volta é **cortada sozinha** no envio.
- **Ícone do site** (aba do navegador/favoritos): campo próprio nas Configurações; imagem quadrada, PNG ≥ 512×512. Sem ícone, aparece o padrão `public/icone-padrao.svg` (casinha dourada). O ícone da Vercel (`favicon.ico`) foi removido.
- **Menu do topo:** só Imóveis, Empreendimentos, Sobre e o botão **Fale Conosco** (o link "Contato" saiu porque o Fale Conosco já leva para lá). O rodapé **mantém** o link "Contato".
- **Rodapé:** abaixo da logo mostra **telefone/WhatsApp da imobiliária** (clicável, abre o WhatsApp), **endereço**, **horário de atendimento** e os **ícones das redes sociais** (abrem em nova aba). Cada item **só aparece se estiver preenchido** nas Configurações.
- **Redes sociais:** Instagram, Facebook, LinkedIn, YouTube e **TikTok** (TikTok adicionado nesta sessão). Pode digitar `@usuario`, `usuario` ou o link inteiro; o site monta o endereço. Aparecem no rodapé e na página Contato.
- **Página Contato:** telefone, e-mail, horário e endereço vêm das Configurações (itens vazios não aparecem); "Área de atuação" virou "Endereço".

---

## 3. Ordem das etapas

> Ordem alterada em 16/10/2026: o banco veio antes dos ajustes de tela (ver 2.7).

| # | Etapa | Status |
|---|---|---|
| 0 | Adaptar o front-end para imobiliária (nome KL, equipe, WhatsApp por corretor) | ✅ parcial (falta Sobre e lista de Empreendimentos) |
| 1 | **Área administrativa** (visual, com dados de exemplo) | ✅ primeira versão pronta |
| 2 | **Banco de dados (Supabase)**: projeto, tabelas, chaves, primeiro admin, login real | 🔄 em andamento (ver seção 8) |
| 3 | Ajustar e ativar tela por tela do painel com o banco (seus ajustes entram aqui) | ⏭️ próxima |
| 4 | Ajustar as telas públicas para vários corretores e ler dados reais | ⏳ |
| 5 | Formulário de contato funcionando | ⏳ |
| 6 | SEO / analytics / LGPD (com calma, entendendo antes) | ⏳ |
| 7 | Domínio e publicação (Vercel Pro + Supabase Pro) | ⏳ |
| ⭐ | Bônus: dashboard de métricas | ⏳ |

---

## 4. O que já foi feito

> Esta seção descreve a primeira versão (commit `6d9861f`). O que mudou depois com o banco está nas seções 2.8 e 8.

### 4.1 Site público
- ~~`src/lib/site.ts`~~ — **removido em 16/10/2026**; os dados da imobiliária agora vêm do banco (ver 8.5).
- Menu (`Navbar`) e rodapé (`Footer`) com o nome KL; "Fale Comigo" virou "Fale Conosco"; título das páginas = nome da KL.
- **Página inicial:** o botão de WhatsApp vai para o número do dono, com mensagem pronta.
- **Página Contato:** textos em nome da empresa e nova seção **"Nossa Equipe"** (`#equipe`), com o cartão e o WhatsApp de cada corretor.
- **Detalhe do imóvel e do empreendimento:** cartão "Corretor responsável"; WhatsApp e e-mail vão para o corretor.
- `src/lib/helpers/whatsapp.ts` — monta o link do WhatsApp com mensagem.
- `src/components/public/CorretorResponsavel.tsx` — cartão do corretor.

### 4.2 Painel admin
- **Login simulado** (⚠️ histórico: substituído pelo login real em 16/10/2026, ver seção 8) — `src/lib/auth-config.ts` com `LOGIN_SIMULADO = true`:
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
- [x] Logo da KL — você já enviou uma pelas Configurações.
- [x] Nome: "KL Negócios Imobiliários" / "KL Imóveis" (preenchido por você nas Configurações).
- [ ] **CRECI ainda é "CRECI-SP 00000-J"**, mas a imobiliária é de Cuiabá: o certo é **CRECI-MT** (19ª Região). Pegar o número real.
- [ ] **Números em destaque** (10+ anos, 342+ imóveis, 120+ clientes, 4.9★) ainda são os do modelo: pedir os números reais ao cliente.
- [ ] Confirmar e-mail real; WhatsApp da imobiliária já cadastrado.
- [ ] Dados reais dos corretores.
- [ ] Na entrega, o cliente troca as fotos de teste do carrossel e a foto da seção Sobre pelas dele.

### Telas públicas (próxima etapa)
- [ ] **Página Sobre** ainda fala em 1ª pessoa ("João Corretor", "Minha história", depoimentos citando João, link de WhatsApp antigo). Tem também um aviso do lint: variável `i` sem uso, perto da linha 152.
- [x] **Lista de Empreendimentos**: lê do banco e o WhatsApp é o do dono (27/10).
- [x] A página Contato mostra **só os corretores ativos** (e marcados para aparecer no site).
- [ ] **Página Sobre** ainda não lê do banco: o texto ("Sobre a imobiliária") e os **depoimentos** já são editáveis nas Configurações, mas só aparecem quando a página for adaptada.
- [ ] Onde mais destacar o WhatsApp do dono? (Já aparece no rodapé e no botão da home.) Ideias: botão flutuante, o dono como primeiro da equipe com um selo.
- [x] O dono também anuncia imóveis como corretor? **Sim** (19/10): o admin pode ser o corretor responsável e tem a aba "Meus imóveis" separada da "Imóveis da equipe" (ver 8.4 → Imóveis).

### Regras para definir antes do banco
- [x] Empreendimentos: **só administradores e assistentes** (26/10). O menu some para o corretor, as telas mostram "Acesso restrito" e o banco bloqueia (arquivo 007).
- [x] WhatsApp dos empreendimentos no site: **sempre o do dono** (26/10). Ele distribui os interessados para os corretores. Não existe mais "corretor responsável" no empreendimento (o campo saiu do formulário). ✅ A página pública do empreendimento já usa o WhatsApp do dono (27/10).
- [ ] Publicações de corretor precisam de aprovação de um admin antes de ir para o site?
- [ ] O formulário de contato manda a mensagem para o admin ou para o corretor do imóvel?
- [ ] Quando um corretor sai da equipe, os imóveis dele somem ou são transferidos para outro corretor?
- [ ] Fotos: teste com fotos reais, guardar o original, política para imóveis vendidos (ver 2.4).

### Mapa do imóvel (próximo, pedido em 20/10)
Em vez do ponto exato, o mapa mostra um **círculo marcando a região** do imóvel. A sugestão é usar OpenStreetMap (gratuito). Falta você responder:
- [ ] Como o corretor informa o local no painel: clicando num ponto do mapa, ou digitando bairro e cidade?
- [ ] Qual o raio do círculo? Sugestão: 300–500 m.

### Ajustes do painel
- [ ] Você disse que viu outros ajustes a fazer no painel. **Ainda não me passou quais.**
- [ ] Ainda só visual: sininho de notificações. (Envio de fotos ✅ 20/10; "Buscar CEP" foi retirado junto com o endereço.)
- [ ] Em telas pequenas, alguns campos lado a lado dos formulários ainda não se ajustam bem.

---

## 6. Como rodar e testar

1. Abra o terminal na pasta `fornt-end`.
2. Rode `npm run dev -- -p 3001` e espere aparecer `✓ Ready`.
3. Abra:
   - site: `http://localhost:3001`
   - painel: `http://localhost:3001/admin/login`, entrando com um usuário cadastrado no Supabase (Authentication → Users).
4. Para testar como corretor, crie outro usuário no Supabase (ele já nasce como corretor).

Cuidados:
- **O computador está com pouca memória.** O servidor já caiu mais de uma vez. Feche programas e abas que não estiver usando. Se houver outro projeto rodando na porta 3000, desligue-o.
- Se aparecer `EADDRINUSE` (porta ocupada), sobrou um servidor antigo travado. Encerre o processo ou use outra porta (`-p 3002`).
- O `.env.local` (chaves do Supabase) **não vai para o GitHub** e nunca deve ser compartilhado.

Verificações de código (rodar na pasta `fornt-end`):
- `npx tsc --noEmit` — checa os tipos.
- `npx next lint` — checa o padrão do código.

---

## 7. Próximos passos

1. ~~Primeiro admin e login real~~ ✅ feito.
2. ~~Meu perfil e Configurações do site~~ ✅ feitos.
3. ~~Corretores~~ ✅ feito (19/10).
4. ~~Imóveis + fotos (3 versões) + páginas públicas de imóveis~~ ✅ feito (20/10).
5. Mapa com círculo da região (aguardando suas respostas, seção 5).
6. ~~Empreendimentos~~ ✅ feito (27/10), falta você testar.
7. Adaptar as telas públicas restantes (Sobre, lista de Empreendimentos…) já lendo do banco.

---

## 8. Banco de dados (Supabase) — andamento

### 8.1 Projeto
- **Projeto novo, só da KL**, criado em 16/10/2026 (plano Free, região **São Paulo**). O projeto Supabase antigo que estava no `.env.local` era de outra coisa e **não é usado**.
- Na criação: **"Habilitar API de Dados" marcada** e **"Expor automaticamente novas tabelas" desmarcada** (tabela nova nasce trancada; o acesso é liberado de propósito no SQL, com `grant`). ⚠️ Por isso, **toda tabela nova criada no futuro precisa de `grant` (para `anon`, `authenticated` **e `service_role`**) + regras RLS** no próprio arquivo de mudança.
- A senha do banco (Database Password) ficou guardada com você.
- ⚠️ **Plano Free pausa após 7 dias sem uso** (aconteceu em 26/10/2026). Não perde nada: no painel do Supabase, clicar em **Resume project** (as chaves continuam as mesmas). Abrir o site/painel ao menos 1x por semana durante o desenvolvimento.

### 8.2 Chaves (`.env.local`, nunca vai para o GitHub)
| Variável | Valor | Onde achar no Supabase |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | botão **Connect** ou Project Settings → Data API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_...` | Project Settings → API Keys |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_...` (chave mestra, só no servidor) | Project Settings → API Keys |

Os nomes das variáveis continuam os antigos para não mexer no código; a publishable key é a versão nova da "anon key".

### 8.3 Tabelas — `supabase/schema.sql` (já rodado)
- `perfis` — cada pessoa do painel (admin ou corretor): nome, CRECI, especialidade, WhatsApp, e-mail de contato, foto, bio, Instagram, `papel`, `ativo`, `ordem` na equipe. O e-mail/senha de login ficam no Authentication do Supabase. **O perfil nasce sozinho** quando um usuário é criado, sempre como `corretor`.
- `configuracoes_site` — uma única linha (id = 1) com nome, CRECI, logo, WhatsApp do dono, contato, redes sociais, textos da home e do Sobre, números em destaque e depoimentos (esses dois em JSON). **Já começa preenchida** com os valores provisórios.
- `empreendimentos` e `imoveis` — campos dos formulários do painel, mais `corretor_id` (responsável), `destaque` e `visivel` (aparece ou não no site). Começam vazias.
- `fotos` — uma linha por foto, ligada a um imóvel **ou** a um empreendimento; guarda o caminho no Storage, a ordem (menor = capa) e o tamanho (para o uso de armazenamento no Dashboard).
- **Storage:** bucket público `fotos` (WebP/JPEG/PNG, até 15 MB por arquivo), com pastas `imoveis/<id>/`, `empreendimentos/<id>/`, `perfis/<id do usuário>/` e `site/` (logo, só admin).
- **Regras de segurança (RLS), garantidas pelo próprio banco:**
  - visitante do site só vê o que é `visivel` e de corretor ativo, as configurações e os corretores ativos;
  - corretor vê/cria/edita/exclui só as próprias publicações e fotos, e edita só o próprio perfil;
  - admin faz tudo;
  - só admin muda papel ou ativo/inativo, e ninguém muda o próprio papel nem se desativa (evita ficar sem admin).

### 8.4 Passo a passo
- [x] 1. Criar o projeto no Supabase
- [x] 2. Rodar `supabase/schema.sql` no SQL Editor
- [x] 3. Colocar as chaves novas no `.env.local` (formato conferido)
- [x] 4. Criar a conta de admin do Wigor (feito; e-mail wigorernandes@gmail.com):
  - Authentication → Users → **Add user → Create new user**, com **Auto Confirm User** marcado;
  - depois, no SQL Editor (trocar o e-mail):
    ```sql
    update public.perfis
    set papel = 'admin', nome = 'Wigor Ernandes'
    where id = (select id from auth.users where email = 'seu-email@exemplo.com');

    select nome, email, papel, ativo from public.perfis;
    ```
  - esperado: uma linha com `admin` e `true`.
- [x] 5. Login de verdade ligado e testado (16/10/2026):
  - `LOGIN_SIMULADO` e `src/lib/auth-config.ts` foram **removidos**;
  - o layout do painel lê o usuário logado e o perfil dele na tabela `perfis` e passa para o `SessaoContext` (a caixa "Teste: ver painel como" saiu);
  - conta desativada não entra (aviso no login) e, se for desativada logada, vê a tela "Conta desativada";
  - as demais telas ainda usam os dados de exemplo até serem ligadas ao banco (o admin vê todos os exemplos).
- [ ] 6. Ligar as telas do painel ao banco, uma por uma (etapa 3):
  - [x] **Meu perfil** (16/10): salva os dados no banco; troca de senha no card "Acesso" (mín. 8 caracteres); **foto de perfil** cortada em quadrado no navegador (600×600, WebP), salva na hora em `perfis/<id>/` e a antiga é apagada do Storage; foto aparece também no menu lateral (`Avatar` em `ui.tsx`).
  - [x] **Campo de WhatsApp padronizado** (`CampoWhatsapp` em `ui.tsx`): "+55" fixo, máscara `(11) 99999-9999`; no banco sempre só dígitos `5511999999999`. Usado em Meu perfil, Corretores e Configurações.
  - Avisos de erro em vermelho: `mostrar(texto, true)`.
  - [x] **Configurações do site** (16/10): ver 2.8 e 8.5.
  - [x] **Corretores** (19/10): lista, cadastro e edição pelo banco.
    - Cadastro cria o login na hora com **senha inicial** definida pelo admin (sem e-mail de convite: o e-mail grátis do Supabase só manda para a própria equipe do projeto). O corretor troca a senha em Meu perfil.
    - Editar: dados, papel, ativo, **"Aparece no site"**, e-mail de acesso, **"Definir nova senha"** (para quem esqueceu) e foto.
    - Desativar/reativar direto na lista.
    - Ações que mexem em login rodam no servidor com a chave mestra (`src/app/admin/(painel)/corretores/acoes.ts`, `src/lib/supabase/admin.ts`), sempre conferindo antes que quem pediu é admin.
    - Página **Contato**: "Nossa Equipe" lê do banco, só ativos e com "Aparece no site", com foto.
    - Ainda nos dados de exemplo: Dashboard (contagem de corretores), escolha de corretor nos formulários de imóvel/empreendimento e cartão do corretor nos detalhes do site — entram junto com Imóveis/Empreendimentos.
  - [x] **Imóveis** (19/10): lista, cadastro e edição pelo banco (`ImoveisLista.tsx`, `ImovelForm.tsx`, `imoveis/acoes.ts`, `lib/imoveis*.ts`). ⏳ falta você testar.
    - Corretor vê só os próprios; admin vê todos e escolhe o corretor responsável (lista real, só ativos).
    - **Admin tem duas abas** (decisão 19/10, para o dono não mexer sem querer no que é dos corretores): **"Meus imóveis"** (abre primeiro, os que ele anuncia) e **"Imóveis da equipe"** (dos corretores, com coluna/filtro de corretor e aviso amarelo). Na aba da equipe, mudar status e excluir pedem confirmação mostrando de quem são os imóveis; o formulário mostra "Você está editando um imóvel de Fulano". **O corretor não vê abas nem nada da equipe.** Fazer o mesmo em Empreendimentos.
    - Formulário começa em branco, com **Estado = MT**; **Buscar CEP** (ViaCEP) preenche endereço, bairro, cidade e estado; preço digitado só com números (máscara R$).
    - Obrigatórios: título, descrição, endereço, cidade e preço.
    - "Salvar como rascunho" saiu: rascunho = desligar **"Visível no site"**.
    - Mudar status e excluir (um ou vários) gravam no banco.
    - Fotos: aviso "em breve" até a etapa Fotos. Ao excluir imóvel, falta apagar os arquivos do Storage (fazer na etapa Fotos).
    - Ainda nos dados de exemplo: contagens do Dashboard e as páginas públicas de imóveis.
  - [x] **Empreendimentos** (27/10): lista, cadastro, edição e exclusão pelo banco (`EmpreendimentosLista.tsx`, `EmpreendimentoForm.tsx`, `empreendimentos/acoes.ts`, `lib/empreendimentos*.ts`); fotos com **legenda**; **Importar do PDF** (`ImportarPdf.tsx`, `lib/helpers/pdf.ts`). ⏳ falta você testar.
  - [ ] Fotos de imóveis/empreendimentos (3 versões)
- Mais tarde: a conta do dono da KL (admin) e as dos corretores serão criadas pela tela Corretores do painel.

### 8.5 Arquivos de mudança do banco (rodar cada um UMA vez, em ordem)
| Arquivo | O que faz | Rodado? |
|---|---|---|
| `supabase/schema.sql` | tabelas, regras de segurança, Storage, configurações iniciais | ✅ 16/10 |
| `supabase/002_pagina_inicial_empresa.sql` | campos `favicon_url`, `carrossel`, `sobre_foto_url`, `home_sobre_titulo/texto/itens` + textos iniciais em nome da empresa | ✅ 16/10 |
| `supabase/003_tiktok.sql` | campo `tiktok` | ✅ 16/10 |
| `supabase/004_aparece_no_site.sql` | campo `aparece_no_site` em `perfis` (quem aparece em "Nossa Equipe"); contas já existentes começam escondidas | ✅ 19/10 |
| `supabase/005_acesso_servidor.sql` | dá permissão nas tabelas à chave mestra (`service_role`), usada no servidor para cadastrar corretor | ✅ 19/10 |
| `supabase/006_ficha_imovel.sql` | novo cadastro de imóvel: Destaques (`garagens`, `situacao`, `dormitorios`, `suites` passa a aceitar vazio); campos da "Ficha do imóvel" (unidades por andar, perfil, posição solar, escriturado, averbado, tem/aceita financiamento, áreas de terreno/construída/privativa/total); listas livres `comodos`, `caracteristicas`, `proximidades` e `condominio`; **apaga** área útil, quartos, banheiros, vagas, andar e todo o endereço | ✅ 20/10 |
| `supabase/007_assistente_empreendimentos.sql` | papel novo `assistente`; empreendimentos (e as fotos deles) só admin e assistente veem no painel, criam, editam e excluem; `corretor_id` do empreendimento deixa de ser obrigatório; o site mostra todos os visíveis; assistente não cria imóveis | ✅ 26/10 |
| `supabase/008_empreendimento_pagina.sql` | campo `registro_incorporacao` no empreendimento (aparece no rodapé da página). Os campos antigos sem uso (endereço, ano de entrega, total de unidades, diferenciais) ficam no banco | ✅ 27/10 |

⚠️ Se o código usa um campo que ainda não existe no banco, a tela dá erro ao salvar (aconteceu com o ícone antes de rodar o 002). Sempre rodar o arquivo novo antes de testar.

### 8.6 Como o site lê as configurações (para mim, ao retomar)
- `src/lib/configuracoes.ts` — tipo `ConfigSite`, conversão da linha do banco (`deLinha`), `partesDestaque` (asteriscos), `linkRede`, `REDES`/`redesDoSite`.
- `src/lib/configuracoes-servidor.ts` — `getConfiguracoes()` (uma leitura por carregamento de página).
- `src/context/ConfigSiteContext.tsx` — `useConfigSite()`; fornecido pelos layouts do site (`(public)/layout.tsx`), do painel e do login.
- `src/app/layout.tsx` — título das páginas e ícone vêm do banco (`generateMetadata`).
- Imagens do site no Storage em `site/logo`, `site/icone`, `site/sobre`, `site/carrossel`. Funções em `src/lib/helpers/imagem.ts` (`comprimir`, `iconeQuadrado`, `enviarArquivo`, `apagarArquivo`).
- Tamanhos: carrossel até 2560 px, foto do Sobre 1600 px, logo 1200 px (sem margem transparente), ícone 512×512 PNG; tudo WebP, menos o ícone.
- Na tela Configurações: **imagens e carrossel salvam na hora; textos ao clicar em Salvar alterações**.
- Componentes novos: `HeroCarrossel` (public), `Logo` e `IconeRede` (shared).

---

## 9. Diário das sessões

### 29/10/2026
**Problema:** ao importar o **"Caderno Técnico My Club"** (72 páginas), todas as fotos saíram iguais: uma textura branca de fundo. O leitor pegava a **maior imagem de cada página**, e esse PDF (e também o "BOOK DIGITAL 3") tem uma textura de fundo, maior que as fotos, repetida em todos os slides. O PDF do Liv não tem isso, por isso funcionava.

**Correção** (`src/lib/helpers/pdf.ts`): cada imagem ganha uma "impressão digital" (tamanho + miniatura 8x8). Imagem que aparece em mais de uma página é fundo ou enfeite e é ignorada; de cada página sai a maior imagem que é **só dela**. No fim, imagens que aparecem em 3 páginas ou mais são retiradas (caso da 1ª página, que ainda não sabia que o fundo se repete).
- Simulação: Caderno Técnico 72 páginas → 60 fotos; BOOK DIGITAL 3 51 → 41; Liv 36 → 29 (as que saíram do Liv são capas de seção com enfeite repetido, que já vinham desmarcadas).
- ✅ Você testou e **funcionou**. Vai fazer mais testes depois (parou cedo por causa de uma reunião).

**Pontos em aberto:**
- Nesses PDFs as **legendas sugeridas** saem estranhas (ex.: "Basta apertar o botão do"): conferir e corrigir antes de adicionar.
- Algumas páginas do Caderno Técnico têm **2 ou 3 fotos lado a lado** e o leitor traz só a maior. Se quiser todas, dá para ajustar.
- Continua valendo: terminar o roteiro de teste de 27/10 (passos 4 a 7) e confirmar com o cliente se as imagens dos PDFs podem ir para o site.

### 27/10/2026
**Como funciona o material dos empreendimentos:** a construtora manda à imobiliária uma apresentação em PDF (exemplo: `Pictures\kleine\empreendimentos\MATERIAL DE TREINAMENTO - LIV GOIABEIRAS`, 36 slides: institucional, fachada, ~20 fotos de lazer com nome, implantação, plantas, condições e documentos).
- ⚠️ Esse PDF diz "uso exclusivo para treinamento, não divulgar ao público final" e "registro de incorporação em andamento, vedada a comercialização". **Antes de publicar, confirmar com o cliente** se as imagens podem ir para o site (o normal é a construtora liberar um material público). A lei pede o nº do registro de incorporação nos anúncios: por isso o campo novo.

**Decisões (suas, depois de ver um exemplo em HTML):**
- Fotos vêm do PDF: o painel separa as páginas e o assistente escolhe quais vão para o site, com legenda (opção B).
- A página pública **não mostra plantas, implantação nem fluxo de pagamento**. Conversa com uma corretora: se o site mostrar tudo, o cliente não entra em contato.

**Feito e salvo no GitHub:**
1. **Banco:** `008_empreendimento_pagina.sql` (campo nº do registro de incorporação). ✅ rodado por você.
2. **Painel → Empreendimentos ligado ao banco** (só admin e assistente):
   - lista com capa, situação, "Fora do site", "★ Destaque", busca e filtro por situação; excluir apaga também as fotos do Storage;
   - formulário: nome, construtora, texto de apresentação (opcional), bairro/cidade/estado (MT), resumo (área mínima/máxima e "Quartos", texto livre), fotos com **legenda**, situação (Em breve / Lançamento / Em obras / Pronto para morar), nº do registro de incorporação, destaque e visível;
   - **1ª foto = capa** (topo da página); as outras formam a galeria. Mesmo envio das fotos dos imóveis (3 versões WebP, sobem ao salvar).
3. **Importar do PDF** (botão no card Fotos): lê o PDF **no navegador** (pdf.js 3.11, o PDF não é enviado), tira a **foto limpa** de cada página (sem os avisos escritos por cima) e sugere legenda pelo título do slide. Fotos de lazer e a fachada vêm marcadas; plantas, implantação, condições e capas de seção vêm desmarcadas; a fachada vem como capa. Testado com o PDF do Liv: as sugestões saíram certas.
   - Arquivo `public/pdf.worker.min.js` é cópia de `node_modules/pdfjs-dist/build/`. **Se um dia atualizar o pdfjs-dist, copiar de novo.** `next.config.mjs` ganhou `canvas: false` (exigência do pdf.js).
4. **Site:** lista `/empreendimentos` e página do empreendimento lendo do banco: capa em tela cheia com situação, nome, local e resumo; texto de apresentação; **galeria de lazer** com legendas, que abre em tela cheia (setas e Esc); contato com o **WhatsApp do dono** ("Tenho interesse" ou, em "Em breve", "Cadastrar interesse"); rodapé com construtora, "imagens meramente ilustrativas" e o nº do registro.

**Roteiro de teste:**
1. Rodar `008_empreendimento_pagina.sql` no SQL Editor do Supabase.
2. Com o `npm run dev` que já está aberto, entrar no painel → Empreendimentos → **+ Novo Empreendimento**.
3. Preencher nome, bairro, cidade, resumo. Em Fotos → **Importar do PDF** → escolher o PDF do Liv → conferir as marcadas e as legendas → **Adicionar**.
4. Conferir que a fachada está em 1º (Capa). Publicar. As fotos sobem uma a uma (o botão mostra o andamento).
5. Na lista, "↗ Ver no site": conferir a capa, a galeria e a tela cheia. Testar no celular (ou com a janela estreita).
6. Editar: trocar uma legenda, mudar a ordem, excluir uma foto, mudar para "Em breve" → salvar e conferir no site.
7. Testar também com a conta de assistente.

**Problema no teste e correção (mesmo dia):**
- Você rodou o 008, reiniciou o servidor e, ao importar o PDF, apareceu "Não foi possível ler este PDF". O motivo real ficava escondido.
- Testei no seu Chrome, logado no painel, com o PDF completo: **funcionou** (33 fotos, 20 marcadas com as legendas certas, fachada como capa). O mais provável é que a página do painel estivesse aberta desde antes de reiniciar o servidor (versão velha da tela, sem o leitor de PDF). **Depois de reiniciar o servidor, sempre recarregar com Ctrl + F5.**
- Para não travar de novo: uma página do PDF com problema agora é **pulada** (as outras continuam); PDF sem tipo informado (acontece no Windows) é aceito pelo nome `.pdf`; a mensagem de erro mostra o motivo entre parênteses e, quando é o caso, pede para recarregar a página.
- Depois disso, você testou e **a importação funcionou**. O resto do roteiro (passos 4 a 7) fica para 28/10.

**Pendências:** terminar o teste (28/10); Dashboard ainda conta os empreendimentos de exemplo; o mapa (seção 5) também vale para o empreendimento; confirmar com o cliente se as imagens do PDF de treinamento podem ir para o site.

### 26/10/2026
- O Supabase tinha pausado o projeto (7 dias sem uso, plano Free). Você clicou em **Resume project** e voltou tudo, sem perder dados.
- **Novo tipo de conta: Assistente.** Cadastrada pela tela Corretores (opção "Assistente" em Papel; o "Aparece no site" some para ela). Menu da assistente: Dashboard, Empreendimentos e Meu perfil.
- **Empreendimentos só para admin e assistente:** some do menu do corretor; lista, novo e editar mostram "Acesso restrito" para quem não pode; os botões do topo também. A assistente vê "Acesso restrito" em Imóveis e não entra na lista de "corretor responsável" dos imóveis nem em "Nossa Equipe".
- A sessão do painel ganhou `cuidaDeEmpreendimentos` e `cuidaDeImoveis` (`SessaoContext`); o menu usa `papeis` por item.
- Banco: `007_assistente_empreendimentos.sql` rodado e testado por você ✅.
- ⏳ O Dashboard ainda usa contagens de exemplo e mostra os mesmos cartões para todos; ajustar por papel quando for ligado ao banco.
- Commit `0060ca5` no GitHub.
- **Fim do dia:** você avisou que quer mudar a **página pública de detalhes do empreendimento** e vai descrever as mudanças na próxima sessão (27/10). Nada foi alterado nela ainda.

### 20/10/2026
**Feito e salvo no GitHub** (commits `ee8fa0b` e `d772e76`):

1. **Novo cadastro de imóvel.** As seções ficaram nesta ordem:
   - **Informações básicas**;
   - **Destaques**: garagens, área privativa, situação (Pronta para morar / Em construção / Na planta), dormitórios e suítes. A área privativa é o mesmo campo da Ficha;
   - **Fotos**;
   - **Cômodos**, **Características**, **Condomínio** e **Proximidades**: listas livres, em que o corretor adiciona quantos itens quiser;
   - **Ficha do imóvel**: unidades por andar, perfil, posição solar, escriturado, averbado, tem/aceita financiamento e as áreas de terreno, construída, privativa e total.

   Saíram os campos antigos (área útil, quartos, banheiros, vagas, andar), **todo o endereço**, o Buscar CEP e o card "Empreendimento". Banco: `006` rodado por você ✅.
2. **Fotos funcionando:**
   - cada foto vira 3 versões WebP (800/1600/2560 px);
   - as fotos sobem ao clicar em Salvar;
   - a 1ª foto é a capa, e a ordem muda arrastando ou com ‹ ›;
   - ao excluir o imóvel, as fotos são apagadas do Storage.
3. **Site público lendo do banco:**
   - home com os imóveis em destaque;
   - lista **Imóveis** com filtros de tipo, finalidade, dormitórios e faixa de preço;
   - página do imóvel com galeria, destaques, descrição, as 4 listas, a ficha, o contato do corretor e imóveis semelhantes;
   - sem o botão "Solicitar Visita" (você pediu para tirar);
   - o site mostra só o que um visitante vê: imóveis visíveis.
4. **Propostas comerciais:** rascunho das duas opções na seção 2.9.

**Pendências:** escolher os valores das propostas; responder as perguntas do mapa (seção 5); explicar a tela de Empreendimentos.

### 19/10/2026
**O que aconteceu antes:** na sessão anterior o PC travou (99% de memória) com vários processos "Node.js JavaScript Runtime" abertos (servidores do site que ficaram acumulados) e foi preciso desligar o PC. O código **não se perdeu**: estava na pasta, só não tinha sido salvo no Git. Nesta sessão ele foi conferido e salvo.
- **Para evitar de novo:** só um `npm run dev` por vez; parar com Ctrl + C; se travar, Gerenciador de Tarefas → "Node.js JavaScript Runtime" → Finalizar tarefa (ou `taskkill /F /IM node.exe` no PowerShell). Salvar no GitHub ao fim de cada etapa.

**Feito e salvo no GitHub:**
1. **Corretores** (trabalho da sessão anterior, recuperado): lista, cadastro com senha inicial, edição (dados, papel, ativo, "Aparece no site", e-mail, nova senha, foto) e página Contato lendo a equipe do banco. Banco: `004` e `005` rodados por você ✅.
2. **Imóveis ligado ao banco:** lista, cadastro, edição, mudar status e excluir (um ou vários). Formulário em branco com **Estado = MT** (a KL atua em Mato Grosso; os outros estados continuam na lista para o CEP funcionar), **Buscar CEP**, preço com máscara R$. "Salvar como rascunho" saiu (rascunho = desligar "Visível no site"). Fotos: aviso "em breve".
3. **Separação para o admin** (sua ideia, para o dono não mexer sem querer no que é dos corretores): abas **"Meus imóveis"** e **"Imóveis da equipe"**, aviso amarelo, confirmação com o nome do dono dos imóveis e faixa "Você está editando um imóvel de Fulano". **Só o admin vê isso**; o corretor vê só os próprios imóveis, sem abas.

**Decisões:**
- O dono anuncia imóveis também (é admin e pode ser corretor responsável).
- A mesma separação de abas vale para **Empreendimentos**.
- Ajustes de tela pedidos pelo cliente entram com o tempo, conforme você for mostrando a ele.

**Roteiro de teste da tela Imóveis (para 20/10):**
1. `npm run dev` (só um!) e abrir `/admin/imoveis`.
2. Cadastrar um imóvel em seu nome → aparece em "Meus imóveis". Testar o Buscar CEP (ex.: `78005-000`).
3. Cadastrar outro trocando o "Corretor responsável" para um corretor de teste → vai para "Imóveis da equipe", com os avisos.
4. Editar, mudar status e excluir nas duas abas.
5. Entrar com um corretor de teste: ele deve ver só os próprios imóveis, sem abas.
6. Se der erro, anotar a mensagem vermelha.

**Ainda nos dados de exemplo:** contagens do Dashboard, páginas públicas de imóveis, telas de Empreendimentos.
