-- =====================================================================
-- 025 — Ajout cover_url + cover_alt sur metiers (images de couverture AI)
-- =====================================================================
-- À appliquer dans Supabase Dashboard → SQL Editor.
--
-- Pour chaque métier on stocke une image de couverture générée via
-- Pollinations.ai (Flux model). Affichées en bannière des pages
-- /metiers/[slug], dans les cards de l'annuaire, et en fallback sur
-- les profils artisans sans photo de cover.
--
-- IMPORTANT : avant de lancer le script de génération, créer aussi le
-- bucket Supabase Storage "metier-covers" (public, write admin uniquement).
-- =====================================================================

ALTER TABLE public.metiers
  ADD COLUMN IF NOT EXISTS cover_url TEXT,
  ADD COLUMN IF NOT EXISTS cover_alt TEXT;

COMMENT ON COLUMN public.metiers.cover_url IS 'URL publique de la cover (bucket metier-covers Supabase Storage)';
COMMENT ON COLUMN public.metiers.cover_alt IS 'Alt text SEO + accessibilité de la cover';
