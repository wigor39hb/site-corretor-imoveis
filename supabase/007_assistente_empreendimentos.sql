-- 007 — Novo tipo de conta "assistente" e empreendimentos só de admin + assistente
-- (decisão de 26/10/2026).
--   * administrador: faz tudo, inclusive empreendimentos;
--   * assistente: vê, cria, edita e exclui TODOS os empreendimentos (e as fotos deles);
--     não mexe em imóveis, não vê a tela Corretores nem as Configurações e não aparece no site;
--   * corretor: só os próprios imóveis; não mexe em empreendimentos.
-- O botão de WhatsApp dos empreendimentos vai para o dono (WhatsApp das Configurações),
-- por isso o empreendimento deixa de exigir um corretor responsável.
-- Rodar UMA vez no SQL Editor do Supabase.

-- 1. Aceita o papel "assistente".
do $$
declare
  restricao text;
begin
  for restricao in
    select conname from pg_constraint
    where conrelid = 'public.perfis'::regclass and contype = 'c'
      and pg_get_constraintdef(oid) like '%papel%'
  loop
    execute format('alter table public.perfis drop constraint %I', restricao);
  end loop;
end;
$$;
alter table public.perfis add constraint perfis_papel_check
  check (papel in ('admin', 'corretor', 'assistente'));

-- 2. Funções de apoio.
-- Quem está logado pode mexer em empreendimentos? (admin ou assistente, ativo)
create function public.cuida_de_empreendimentos() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.perfis
    where id = (select auth.uid()) and papel in ('admin', 'assistente') and ativo
  );
$$;

-- Quem está logado é corretor ativo? (só corretor e admin anunciam imóveis)
create function public.eh_corretor() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.perfis
    where id = (select auth.uid()) and papel = 'corretor' and ativo
  );
$$;

-- Fotos dos empreendimentos (tabela fotos e pasta empreendimentos/<id>/ no Storage).
create or replace function public.pode_editar_empreendimento(p_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.cuida_de_empreendimentos();
$$;

-- 3. Empreendimentos não têm mais corretor responsável obrigatório.
alter table public.empreendimentos alter column corretor_id drop not null;

drop policy "site vê empreendimentos visíveis" on public.empreendimentos;
create policy "site vê empreendimentos visíveis" on public.empreendimentos
  for select to anon, authenticated using (visivel);

drop policy "painel vê os próprios ou todos se admin" on public.empreendimentos;
create policy "painel: admin e assistente veem todos" on public.empreendimentos
  for select to authenticated using (public.cuida_de_empreendimentos());

drop policy "cria em nome próprio ou qualquer um se admin" on public.empreendimentos;
create policy "admin e assistente criam" on public.empreendimentos
  for insert to authenticated with check (public.cuida_de_empreendimentos());

drop policy "edita os próprios ou todos se admin" on public.empreendimentos;
create policy "admin e assistente editam" on public.empreendimentos
  for update to authenticated
  using (public.cuida_de_empreendimentos()) with check (public.cuida_de_empreendimentos());

drop policy "exclui os próprios ou todos se admin" on public.empreendimentos;
create policy "admin e assistente excluem" on public.empreendimentos
  for delete to authenticated using (public.cuida_de_empreendimentos());

-- 4. Imóveis: a assistente não cria imóveis (só corretor, em nome próprio, ou admin).
drop policy "cria em nome próprio ou qualquer um se admin" on public.imoveis;
create policy "cria em nome próprio ou qualquer um se admin" on public.imoveis
  for insert to authenticated
  with check (public.eh_admin() or (corretor_id = (select auth.uid()) and public.eh_corretor()));
