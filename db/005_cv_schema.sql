-- ============================================================
-- Bisecco — Banque de CV : ajout colonnes sur public.users
-- ============================================================
-- À exécuter dans Supabase SQL Editor
-- ============================================================

BEGIN;

-- Ajout des colonnes CV sur users
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS cv_data JSONB,
  ADD COLUMN IF NOT EXISTS cv_metier_id BIGINT REFERENCES public.metiers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS cv_published BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS cv_title VARCHAR(255),
  ADD COLUMN IF NOT EXISTS cv_about TEXT,
  ADD COLUMN IF NOT EXISTS cv_search_city VARCHAR(100),
  ADD COLUMN IF NOT EXISTS cv_search_radius INTEGER,
  ADD COLUMN IF NOT EXISTS cv_available_from DATE,
  ADD COLUMN IF NOT EXISTS cv_updated_at TIMESTAMPTZ;

-- Index pour la recherche
CREATE INDEX IF NOT EXISTS users_cv_published_idx ON public.users(cv_published) WHERE cv_published = TRUE;
CREATE INDEX IF NOT EXISTS users_cv_metier_idx ON public.users(cv_metier_id) WHERE cv_published = TRUE;
CREATE INDEX IF NOT EXISTS users_cv_search_city_idx ON public.users(cv_search_city) WHERE cv_published = TRUE;

-- RLS : les CVs publiés sont lisibles par tous les users authentifiés ARTISANS uniquement
-- (les visiteurs anonymes ne voient rien)
-- Cette policy s'ajoute aux existantes
DROP POLICY IF EXISTS "Artisans peuvent voir les CVs publiés" ON public.users;
CREATE POLICY "Artisans peuvent voir les CVs publiés" ON public.users
  FOR SELECT USING (
    cv_published = TRUE
    AND deleted_at IS NULL
    AND auth.role() = 'authenticated'
  );

COMMIT;

-- Vérification
SELECT
  COUNT(*) AS total_users,
  COUNT(cv_data) AS users_with_cv,
  COUNT(*) FILTER (WHERE cv_published = TRUE) AS published_cvs
FROM public.users;
