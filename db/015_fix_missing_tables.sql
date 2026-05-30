-- =====================================================================
-- 015 — Fix : tables/colonnes manquantes en prod
-- =====================================================================
-- À appliquer dans Supabase Dashboard → SQL Editor → Run.
--
-- Corrige 2 bugs :
--   1. Avis ne remontent pas dans /admin/avis (colonne `status` manquante)
--   2. CV bank ne marche pas (table `cv_bank` manquante)
-- =====================================================================

-- 1. AVIS — ajout des colonnes de modération
ALTER TABLE public.reviews
    ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending','approved','rejected')),
    ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS moderated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS moderation_note TEXT,
    ADD COLUMN IF NOT EXISTS quote_request_id BIGINT REFERENCES public.quote_requests(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews (status, created_at DESC);

-- 2. CV BANK — table publique modérée
CREATE TABLE IF NOT EXISTS public.cv_bank (
  id bigserial PRIMARY KEY,
  sender_user_id bigint REFERENCES public.users(id) ON DELETE SET NULL,
  sender_name text NOT NULL,
  sender_email text NOT NULL,
  sender_phone text,
  metier text,
  city text,
  message text,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size int NOT NULL,
  file_mime text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'archived')),
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by bigint REFERENCES public.users(id) ON DELETE SET NULL,
  rejection_reason text
);

CREATE INDEX IF NOT EXISTS idx_cv_bank_email ON public.cv_bank(sender_email);
CREATE INDEX IF NOT EXISTS idx_cv_bank_status ON public.cv_bank(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cv_bank_metier ON public.cv_bank(metier);

ALTER TABLE public.cv_bank ENABLE ROW LEVEL SECURITY;

-- RLS : admins voient tout, autres : rien (modération uniquement)
DROP POLICY IF EXISTS "cv_bank_admin_all" ON public.cv_bank;
CREATE POLICY "cv_bank_admin_all"
ON public.cv_bank FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND u.role = 'admin'
    AND u.deleted_at IS NULL
  )
);

-- Insert public (anonyme + authentifié) — pour le formulaire
DROP POLICY IF EXISTS "cv_bank_public_insert" ON public.cv_bank;
CREATE POLICY "cv_bank_public_insert"
ON public.cv_bank FOR INSERT
TO public
WITH CHECK (true);
