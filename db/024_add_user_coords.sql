-- =====================================================================
-- 024 — Ajout latitude/longitude sur users (pour géocodage précis)
-- =====================================================================
-- À appliquer dans Supabase Dashboard → SQL Editor.
--
-- Pourquoi : aujourd'hui on positionne les particuliers et artisans sur
-- la map en faisant un lookup ville → coords approximatives (dictionnaire
-- de villes ou centroïde département). C'est imprécis (~10 km de marge).
--
-- Avec ces 2 colonnes, on stocke les vraies coords renvoyées par l'API
-- Adresse (data.gouv.fr) au moment de l'inscription. Précision : ~5 m.
--
-- Les `artisan_profiles` ont déjà latitude/longitude — on l'utilise pour
-- les pros. Mais on garde la possibilité de stocker aussi sur `users`
-- (utile pour les particuliers, et pour duplication / fallback).
-- =====================================================================

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS latitude  DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS street_address TEXT;

-- Index spatial léger pour requêtes "à proximité" futures
CREATE INDEX IF NOT EXISTS users_coords_idx
  ON public.users (latitude, longitude)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

COMMENT ON COLUMN public.users.latitude        IS 'Latitude exacte (API Adresse data.gouv.fr) · ~5m de précision';
COMMENT ON COLUMN public.users.longitude       IS 'Longitude exacte (API Adresse data.gouv.fr) · ~5m de précision';
COMMENT ON COLUMN public.users.street_address  IS 'Numéro + rue saisis via l''autocomplete API Adresse';
