-- =====================================================================
-- 026 — Ajout métiers Pub, Bar, Marchand de biens, Promoteur immobilier
-- =====================================================================
-- À appliquer dans Supabase Dashboard → SQL Editor.
--
-- Après exécution, génère leurs covers via :
--   npm run generate:covers
-- =====================================================================

INSERT INTO public.metiers (name, slug, category, icon)
VALUES
  ('Pub',                   'pub',                   'Alimentation', '🍺'),
  ('Bar',                   'bar',                   'Alimentation', '🍸'),
  ('Marchand de biens',     'marchand-de-biens',     'Services',     '🏠'),
  ('Promoteur immobilier',  'promoteur-immobilier',  'Services',     '🏗️')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  icon = EXCLUDED.icon;
