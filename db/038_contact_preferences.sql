-- =====================================================================
-- 038 — Préférences de contact du pro
--
-- À exécuter dans Supabase Dashboard → SQL Editor.
--
-- Le pro choisit comment il accepte d'être contacté :
--  - Par email
--  - Par téléphone
--  - Les deux
--
-- Au moins UN canal doit rester actif (enforcement applicatif côté form).
-- =====================================================================

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS contact_via_email boolean NOT NULL DEFAULT true;

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS contact_via_phone boolean NOT NULL DEFAULT false;

-- Optionnel : email PUBLIC de contact (par défaut = email du compte, mais le pro
-- peut souhaiter afficher une adresse différente — ex: contact@son-entreprise.com).
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS public_contact_email varchar(191);

-- Vérification
SELECT 'contact_preferences columns added' AS status;
