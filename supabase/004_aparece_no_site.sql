-- =====================================================================
-- 004 — Escolher quem aparece na seção "Nossa Equipe" do site
-- Rodar UMA vez no Supabase: SQL Editor → New query → colar tudo → Run.
-- =====================================================================

alter table public.perfis
  add column aparece_no_site boolean not null default true;

-- As contas que já existem hoje são só de administração (quem montou o site),
-- então começam escondidas. Dá para mudar depois na tela Corretores.
update public.perfis set aparece_no_site = false;
