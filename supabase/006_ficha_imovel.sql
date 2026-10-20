-- =====================================================================
-- 006 — Novo cadastro de imóvel
-- • Ficha do imóvel: campos novos, todos opcionais (Sim/Não ficam vazios
--   — null — quando não informados).
-- • Cômodos, Características, Proximidades e Condomínio são listas livres: o corretor adiciona
--   quantos itens quiser ("Armários planejados", "Shopping Pantanal"...).
-- • Destaques: garagens, situação, dormitórios e suítes (a área privativa
--   é a mesma da Ficha).
-- • Saem os campos antigos: área útil, quartos, banheiros, vagas,
--   andar e todo o endereço (CEP, endereço, número, complemento, bairro,
--   cidade, estado).
-- ⚠️ Apaga esses dados dos imóveis já cadastrados (hoje só há dados de teste).
-- Rodar UMA vez no Supabase: SQL Editor → New query → colar tudo → Run.
-- =====================================================================

alter table public.imoveis
  -- Ficha do imóvel
  add column unidades_por_andar   int check (unidades_por_andar >= 0),
  add column perfil               text,
  add column posicao_solar        text,
  add column escriturado          boolean,
  add column averbado             boolean,
  add column tem_financiamento    boolean,
  add column aceita_financiamento boolean,
  add column area_terreno         numeric(10, 2),
  add column area_construida      numeric(10, 2),
  add column area_privativa       numeric(10, 2),
  add column area_total           numeric(10, 2),
  -- Destaques (o campo suites já existia; agora fica vazio quando não informado)
  add column garagens             int check (garagens >= 0),
  add column situacao             text,
  add column dormitorios          int check (dormitorios >= 0),
  alter column suites drop not null,
  alter column suites drop default,
  -- Listas livres
  add column caracteristicas      text[] not null default '{}',
  add column proximidades         text[] not null default '{}',
  add column comodos              text[] not null default '{}',
  add column condominio           text[] not null default '{}',
  -- Campos que saem
  drop column area,
  drop column quartos,
  drop column banheiros,
  drop column vagas,
  drop column andar,
  drop column cep,
  drop column endereco,
  drop column numero,
  drop column complemento,
  drop column bairro,
  drop column cidade,
  drop column estado;
