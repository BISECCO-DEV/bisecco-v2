-- ============================================================
-- Bisecco — Migration des métiers V2 (4 catégories propres)
-- ============================================================
-- Étape 1 : Drop l'ancienne CHECK constraint
-- Étape 2 : Remappe les catégories obsolètes vers les 4 nouvelles
-- Étape 3 : Pose la nouvelle CHECK constraint
-- Étape 4 : Upsert des 174 métiers via le seed généré
-- ============================================================
-- À exécuter dans Supabase SQL Editor AVANT seed_metiers.sql
-- ============================================================

BEGIN;

-- ─── 1. Drop CHECK constraint actuelle ──────────────────
ALTER TABLE public.metiers DROP CONSTRAINT IF EXISTS metiers_category_check;

-- ─── 2. Remappe les anciennes catégories vers les 4 nouvelles ──
UPDATE public.metiers SET category = 'Fabrication / Production'
  WHERE category IN ('Métiers d''art', 'Textile / mode', 'Artisanat traditionnel');

UPDATE public.metiers SET category = 'Services'
  WHERE category = 'Automobile';

-- Anciennes catégories MySQL (au cas où elles existent encore)
UPDATE public.metiers SET category = 'Bâtiment'
  WHERE category IN ('batiment', 'facade_equipement');

UPDATE public.metiers SET category = 'Services'
  WHERE category IN ('services_techniques', 'services_proximite');

UPDATE public.metiers SET category = 'Alimentation'
  WHERE category = 'metiers_bouche';

-- ─── 3. Pose la nouvelle CHECK constraint (4 catégories) ──
ALTER TABLE public.metiers ADD CONSTRAINT metiers_category_check
  CHECK (category IN ('Alimentation', 'Bâtiment', 'Fabrication / Production', 'Services'));

COMMIT;

-- Vérification : combien de métiers par catégorie maintenant ?
SELECT category, COUNT(*) AS total
FROM public.metiers
GROUP BY category
ORDER BY total DESC;
