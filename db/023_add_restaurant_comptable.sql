-- =====================================================================
-- 023 — Ajout métiers "Restaurant" et "Comptable"
-- =====================================================================
-- À appliquer dans Supabase Dashboard → SQL Editor.
-- =====================================================================

INSERT INTO public.metiers (name, slug, category, icon)
VALUES
  ('Restaurant', 'restaurant', 'Alimentation', '🍽️'),
  ('Comptable',  'comptable',  'Services',     '📊')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  icon = EXCLUDED.icon;
