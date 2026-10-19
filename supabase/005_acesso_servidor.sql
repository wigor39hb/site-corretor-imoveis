-- =====================================================================
-- 005 — Libera as tabelas para o servidor do site (chave mestra / service_role)
-- O projeto foi criado com "Expor automaticamente novas tabelas" desmarcado,
-- então a chave mestra também precisa de permissão explícita. Ela é usada só
-- no servidor (ex.: cadastrar corretor, que cria o login e preenche o perfil).
-- Rodar UMA vez no Supabase: SQL Editor → New query → colar tudo → Run.
-- =====================================================================

grant usage on schema public to service_role;
grant select, insert, update, delete on all tables in schema public to service_role;
