-- =====================================================================
-- 002 — Página inicial apresentando a imobiliária
-- Rodar UMA vez no Supabase: SQL Editor → New query → colar tudo → Run.
-- =====================================================================

alter table public.configuracoes_site
  add column favicon_url       text,                       -- ícone do site (aba do navegador)
  add column carrossel         text[] not null default '{}', -- fotos do carrossel da primeira tela, na ordem
  add column sobre_foto_url    text,                       -- foto da seção "Sobre" da página inicial
  add column home_sobre_titulo text,
  add column home_sobre_texto  text,
  add column home_sobre_itens  jsonb not null default '[]'; -- [{ "titulo": "...", "descricao": "..." }]

-- Textos iniciais em nome da empresa (editáveis em Configurações do site).
-- Texto entre *asteriscos* aparece em itálico dourado no site.
update public.configuracoes_site set
  hero_frase  = 'Imóveis de Alto Padrão',
  hero_titulo = 'Seu próximo imóvel começa com *quem entende*',
  hero_texto  = 'Uma equipe de corretores especializados conectando famílias e investidores aos melhores imóveis de São Paulo. Atendimento exclusivo do primeiro contato à entrega das chaves.',
  home_sobre_titulo = 'Mais do que uma imobiliária, *um parceiro*',
  home_sobre_texto  = 'Somos uma imobiliária especializada em imóveis de alto padrão em São Paulo. Nossa equipe vai além de mostrar imóveis: entendemos o momento de cada cliente e cuidamos de toda a negociação com transparência e segurança.',
  home_sobre_itens  = '[
    {"titulo": "Alto Padrão", "descricao": "Especialistas em imóveis premium e de luxo em SP"},
    {"titulo": "CRECI Ativo", "descricao": "Empresa e corretores com registro e atuação regularizados"},
    {"titulo": "Investimentos", "descricao": "Consultoria para investidores do mercado imobiliário"},
    {"titulo": "Atendimento", "descricao": "Dedicação exclusiva e personalizada a cada cliente"}
  ]'
where id = 1;
