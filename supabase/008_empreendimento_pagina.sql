-- 008 — Página do empreendimento montada a partir da apresentação em PDF (27/10/2026).
--   * Nº do registro de incorporação: aparece no rodapé da página do empreendimento
--     (a lei pede o número do registro nos anúncios de incorporação).
--   * A legenda de cada foto (ex.: "Piscina e solarium") já existe na tabela fotos.
-- Campos antigos que a tela nova não usa (endereço, ano de entrega, total de unidades,
-- diferenciais) ficam no banco, vazios, para não perder nada.
-- Rodar UMA vez no SQL Editor do Supabase.

alter table public.empreendimentos add column registro_incorporacao text;
