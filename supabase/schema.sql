-- =====================================================================
-- Banco de dados do site KL Investimentos Imobiliários
-- Rodar UMA vez no Supabase: SQL Editor → New query → colar tudo → Run.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Tabelas
-- ---------------------------------------------------------------------

-- Perfil de cada pessoa que entra no painel (administradores e corretores).
-- O e-mail/senha de acesso ficam no login do Supabase (auth.users);
-- aqui ficam os dados que aparecem no site.
create table public.perfis (
  id            uuid primary key references auth.users (id) on delete cascade,
  nome          text not null default '',
  creci         text,
  especialidade text,
  whatsapp      text,          -- só números, com DDI e DDD: 5511999999999
  email         text,          -- e-mail de contato (aparece no site)
  foto_url      text,
  bio           text,
  instagram     text,
  papel         text not null default 'corretor' check (papel in ('admin', 'corretor')),
  ativo         boolean not null default true,  -- inativo = não entra no painel e some do site
  ordem         int not null default 0,         -- ordem na seção "Nossa Equipe"
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Configurações gerais do site. Sempre uma única linha (id = 1).
create table public.configuracoes_site (
  id          int primary key default 1 check (id = 1),
  nome        text not null,
  nome_curto  text,
  creci       text,
  logo_url    text,
  whatsapp    text,           -- WhatsApp do dono, usado nos pontos gerais do site
  email       text,
  endereco    text,
  horario     text,
  instagram   text,
  facebook    text,
  linkedin    text,
  youtube     text,
  hero_frase  text,           -- página inicial: frase acima do título
  hero_titulo text,
  hero_texto  text,
  sobre_texto text,
  numeros     jsonb not null default '[]',  -- [{ "valor": "10+", "rotulo": "Anos de Experiência" }]
  depoimentos jsonb not null default '[]',  -- [{ "nome": "...", "texto": "..." }]
  updated_at  timestamptz not null default now()
);

create table public.empreendimentos (
  id             uuid primary key default gen_random_uuid(),
  corretor_id    uuid not null references public.perfis (id) on delete restrict,
  nome           text not null,
  status         text not null default 'lancamento'
                   check (status in ('lancamento', 'obras', 'pronto', 'breve')),
  construtora    text,
  tipologias     text,
  descricao      text,
  endereco       text,
  bairro         text,
  cidade         text,
  estado         char(2),
  ano_entrega    int,
  total_unidades int,
  area_min       numeric(10, 2),
  area_max       numeric(10, 2),
  diferenciais   text[] not null default '{}',
  destaque       boolean not null default false,
  visivel        boolean not null default true,   -- aparece ou não no site
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.imoveis (
  id                uuid primary key default gen_random_uuid(),
  corretor_id       uuid not null references public.perfis (id) on delete restrict,
  empreendimento_id uuid references public.empreendimentos (id) on delete set null,
  titulo            text not null,
  tipo              text not null default 'apartamento'
                      check (tipo in ('apartamento', 'casa', 'studio', 'cobertura', 'terreno', 'comercial', 'chacara')),
  finalidade        text not null default 'venda'
                      check (finalidade in ('venda', 'aluguel', 'venda_aluguel')),
  status            text not null default 'disponivel'
                      check (status in ('disponivel', 'reservado', 'vendido', 'lancamento')),
  preco             numeric(14, 2),
  area              numeric(10, 2),
  quartos           int not null default 0,
  suites            int not null default 0,
  banheiros         int not null default 0,
  vagas             int not null default 0,
  andar             text,
  cep               text,
  endereco          text,
  numero            text,
  complemento       text,
  bairro            text,
  cidade            text,
  estado            char(2),
  descricao         text,
  destaque          boolean not null default false,
  visivel           boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Fotos de imóveis e empreendimentos. O arquivo fica no Storage (bucket "fotos");
-- aqui fica só o caminho. Cada foto tem 3 versões (pequena/média/grande) no Storage.
-- A foto de menor "ordem" é a capa.
create table public.fotos (
  id                uuid primary key default gen_random_uuid(),
  imovel_id         uuid references public.imoveis (id) on delete cascade,
  empreendimento_id uuid references public.empreendimentos (id) on delete cascade,
  caminho           text not null,   -- ex.: imoveis/<id do imóvel>/<id da foto>
  ordem             int not null default 0,
  legenda           text,
  largura           int,
  altura            int,
  tamanho_bytes     bigint not null default 0,  -- soma das 3 versões (para o uso de armazenamento)
  created_at        timestamptz not null default now(),
  check ((imovel_id is null) <> (empreendimento_id is null))  -- pertence a um OU a outro
);

create index on public.imoveis (corretor_id);
create index on public.imoveis (empreendimento_id);
create index on public.empreendimentos (corretor_id);
create index on public.fotos (imovel_id, ordem);
create index on public.fotos (empreendimento_id, ordem);


-- ---------------------------------------------------------------------
-- 2. Funções de apoio
-- ---------------------------------------------------------------------

-- Quem está logado é administrador ativo?
create function public.eh_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.perfis
    where id = (select auth.uid()) and papel = 'admin' and ativo
  );
$$;

-- Quem está logado está ativo?
create function public.eh_ativo() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.perfis
    where id = (select auth.uid()) and ativo
  );
$$;

create function public.pode_editar_imovel(p_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.eh_admin() or (
    public.eh_ativo() and exists (
      select 1 from public.imoveis where id = p_id and corretor_id = (select auth.uid())
    )
  );
$$;

create function public.pode_editar_empreendimento(p_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.eh_admin() or (
    public.eh_ativo() and exists (
      select 1 from public.empreendimentos where id = p_id and corretor_id = (select auth.uid())
    )
  );
$$;

-- Atualiza o campo updated_at sozinho a cada alteração.
create function public.definir_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger perfis_updated_at before update on public.perfis
  for each row execute function public.definir_updated_at();
create trigger configuracoes_updated_at before update on public.configuracoes_site
  for each row execute function public.definir_updated_at();
create trigger empreendimentos_updated_at before update on public.empreendimentos
  for each row execute function public.definir_updated_at();
create trigger imoveis_updated_at before update on public.imoveis
  for each row execute function public.definir_updated_at();

-- Cria o perfil automaticamente quando um usuário é criado no login.
create function public.criar_perfil_novo_usuario() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.perfis (id, nome, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'nome', ''), new.email);
  return new;
end;
$$;

create trigger ao_criar_usuario after insert on auth.users
  for each row execute function public.criar_perfil_novo_usuario();

-- Só administradores mudam papel ou status (ativo/inativo),
-- e ninguém muda o próprio papel nem se desativa.
-- (Pelo SQL Editor, sem ninguém logado, é permitido: serve para criar o primeiro admin.)
create function public.proteger_perfil() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if (select auth.uid()) is null then
    return new;
  end if;
  if new.papel is distinct from old.papel or new.ativo is distinct from old.ativo then
    if not public.eh_admin() then
      raise exception 'Só administradores podem mudar papel ou status.';
    end if;
    if new.id = (select auth.uid()) then
      raise exception 'Você não pode mudar o próprio papel nem se desativar.';
    end if;
  end if;
  return new;
end;
$$;

create trigger perfis_proteger before update on public.perfis
  for each row execute function public.proteger_perfil();


-- ---------------------------------------------------------------------
-- 3. Regras de acesso (RLS)
--    anon = visitante do site; authenticated = alguém logado no painel.
-- ---------------------------------------------------------------------

alter table public.perfis             enable row level security;
alter table public.configuracoes_site enable row level security;
alter table public.empreendimentos    enable row level security;
alter table public.imoveis            enable row level security;
alter table public.fotos              enable row level security;

-- Perfis
create policy "site vê corretores ativos" on public.perfis
  for select to anon, authenticated using (ativo);
create policy "painel vê o próprio perfil ou todos se admin" on public.perfis
  for select to authenticated using (id = (select auth.uid()) or public.eh_admin());
create policy "edita o próprio perfil ou todos se admin" on public.perfis
  for update to authenticated
  using (id = (select auth.uid()) or public.eh_admin())
  with check (id = (select auth.uid()) or public.eh_admin());
-- Não há insert/delete: o perfil nasce junto com o usuário e corretores
-- são desativados, não apagados.

-- Configurações do site
create policy "site lê as configurações" on public.configuracoes_site
  for select to anon, authenticated using (true);
create policy "admin edita as configurações" on public.configuracoes_site
  for update to authenticated using (public.eh_admin()) with check (public.eh_admin());

-- Empreendimentos
create policy "site vê empreendimentos visíveis" on public.empreendimentos
  for select to anon, authenticated
  using (visivel and exists (select 1 from public.perfis p where p.id = corretor_id and p.ativo));
create policy "painel vê os próprios ou todos se admin" on public.empreendimentos
  for select to authenticated using (corretor_id = (select auth.uid()) or public.eh_admin());
create policy "cria em nome próprio ou qualquer um se admin" on public.empreendimentos
  for insert to authenticated
  with check (public.eh_admin() or (corretor_id = (select auth.uid()) and public.eh_ativo()));
create policy "edita os próprios ou todos se admin" on public.empreendimentos
  for update to authenticated
  using (public.eh_admin() or (corretor_id = (select auth.uid()) and public.eh_ativo()))
  with check (public.eh_admin() or (corretor_id = (select auth.uid()) and public.eh_ativo()));
create policy "exclui os próprios ou todos se admin" on public.empreendimentos
  for delete to authenticated
  using (public.eh_admin() or (corretor_id = (select auth.uid()) and public.eh_ativo()));

-- Imóveis
create policy "site vê imóveis visíveis" on public.imoveis
  for select to anon, authenticated
  using (visivel and exists (select 1 from public.perfis p where p.id = corretor_id and p.ativo));
create policy "painel vê os próprios ou todos se admin" on public.imoveis
  for select to authenticated using (corretor_id = (select auth.uid()) or public.eh_admin());
create policy "cria em nome próprio ou qualquer um se admin" on public.imoveis
  for insert to authenticated
  with check (public.eh_admin() or (corretor_id = (select auth.uid()) and public.eh_ativo()));
create policy "edita os próprios ou todos se admin" on public.imoveis
  for update to authenticated
  using (public.eh_admin() or (corretor_id = (select auth.uid()) and public.eh_ativo()))
  with check (public.eh_admin() or (corretor_id = (select auth.uid()) and public.eh_ativo()));
create policy "exclui os próprios ou todos se admin" on public.imoveis
  for delete to authenticated
  using (public.eh_admin() or (corretor_id = (select auth.uid()) and public.eh_ativo()));

-- Fotos (quem pode editar o imóvel/empreendimento pode mexer nas fotos dele)
create policy "todos veem as fotos" on public.fotos
  for select to anon, authenticated using (true);
create policy "adiciona fotos ao que pode editar" on public.fotos
  for insert to authenticated
  with check (
    (imovel_id is not null and public.pode_editar_imovel(imovel_id)) or
    (empreendimento_id is not null and public.pode_editar_empreendimento(empreendimento_id))
  );
create policy "edita fotos do que pode editar" on public.fotos
  for update to authenticated
  using (
    (imovel_id is not null and public.pode_editar_imovel(imovel_id)) or
    (empreendimento_id is not null and public.pode_editar_empreendimento(empreendimento_id))
  )
  with check (
    (imovel_id is not null and public.pode_editar_imovel(imovel_id)) or
    (empreendimento_id is not null and public.pode_editar_empreendimento(empreendimento_id))
  );
create policy "exclui fotos do que pode editar" on public.fotos
  for delete to authenticated
  using (
    (imovel_id is not null and public.pode_editar_imovel(imovel_id)) or
    (empreendimento_id is not null and public.pode_editar_empreendimento(empreendimento_id))
  );

-- Permissões básicas de acesso às tabelas (as regras acima continuam valendo).
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;


-- ---------------------------------------------------------------------
-- 4. Armazenamento de arquivos (Storage)
--    Bucket público "fotos". Pastas:
--      imoveis/<id do imóvel>/...           empreendimentos/<id>/...
--      perfis/<id do usuário>/...           site/... (logo, só admin)
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos', 'fotos', true, 15728640, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

create function public.pode_gravar_arquivo(caminho text) returns boolean
language plpgsql stable security definer set search_path = '' as $$
declare
  partes text[] := storage.foldername(caminho);
begin
  if partes[1] = 'imoveis' then
    return public.pode_editar_imovel(partes[2]::uuid);
  elsif partes[1] = 'empreendimentos' then
    return public.pode_editar_empreendimento(partes[2]::uuid);
  elsif partes[1] = 'perfis' then
    return partes[2] = (select auth.uid())::text or public.eh_admin();
  elsif partes[1] = 'site' then
    return public.eh_admin();
  end if;
  return false;
exception when invalid_text_representation then
  return false;
end;
$$;

create policy "painel lista arquivos" on storage.objects
  for select to authenticated using (bucket_id = 'fotos');
create policy "painel envia arquivos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'fotos' and public.pode_gravar_arquivo(name));
create policy "painel substitui arquivos" on storage.objects
  for update to authenticated
  using (bucket_id = 'fotos' and public.pode_gravar_arquivo(name))
  with check (bucket_id = 'fotos' and public.pode_gravar_arquivo(name));
create policy "painel apaga arquivos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'fotos' and public.pode_gravar_arquivo(name));


-- ---------------------------------------------------------------------
-- 5. Dados iniciais (provisórios; editáveis depois em Configurações do site)
-- ---------------------------------------------------------------------

insert into public.configuracoes_site (id, nome, nome_curto, creci, whatsapp, email, numeros, depoimentos)
values (
  1,
  'KL Investimentos Imobiliários',
  'KL Investimentos',
  'CRECI-SP 00000-J',
  '5511999999999',
  'contato@exemplo.com.br',
  '[{"valor": "10+", "rotulo": "Anos de Experiência"},
    {"valor": "342+", "rotulo": "Imóveis Vendidos"},
    {"valor": "120+", "rotulo": "Clientes Atendidos"},
    {"valor": "4.9★", "rotulo": "Avaliação Média"}]',
  '[{"nome": "Mariana e Rafael", "texto": "Atendimento impecável do começo ao fim. Encontramos o apartamento ideal em poucas semanas."},
    {"nome": "Paulo Henrique", "texto": "Equipe muito preparada, me ajudou a escolher um ótimo imóvel para investir."}]'
);
