-- =====================================================================
-- 016 — Ajout métier "Développeur informatique"
-- =====================================================================
-- À appliquer dans Supabase Dashboard → SQL Editor.
-- =====================================================================

INSERT INTO public.metiers (name, slug, category, icon)
VALUES ('Développeur informatique', 'developpeur-informatique', 'Services', '💻')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  icon = EXCLUDED.icon;
