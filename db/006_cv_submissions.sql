-- ============================================================
-- Bisecco — Soumissions de CV aux artisans
-- ============================================================
-- Permet à un particulier (ou visiteur) d'envoyer son CV à un artisan
-- L'artisan peut : lire, télécharger, marquer lu, supprimer
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.cv_submissions (
  id                  BIGSERIAL PRIMARY KEY,

  -- Destinataire (artisan)
  recipient_user_id   BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  -- Émetteur connecté (nullable si visiteur anonyme)
  sender_user_id      BIGINT REFERENCES public.users(id) ON DELETE SET NULL,

  -- Infos émetteur (pour anonymes ou en doublon)
  sender_name         VARCHAR(255) NOT NULL,
  sender_email        VARCHAR(255) NOT NULL,
  sender_phone        VARCHAR(20),

  -- Fichier CV (Supabase Storage : bucket "cv-submissions")
  file_path           VARCHAR(500) NOT NULL,
  file_name           VARCHAR(255) NOT NULL,
  file_size           INTEGER,
  file_mime           VARCHAR(100),

  -- Message optionnel
  message             TEXT,

  -- État
  status              VARCHAR(20) NOT NULL DEFAULT 'new'
                      CHECK (status IN ('new', 'read', 'archived')),
  read_at             TIMESTAMPTZ,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS cv_submissions_recipient_status_idx
  ON public.cv_submissions(recipient_user_id, status);

CREATE INDEX IF NOT EXISTS cv_submissions_created_idx
  ON public.cv_submissions(created_at DESC);

-- RLS (en lecture, seul l'artisan destinataire peut voir ses CVs reçus)
ALTER TABLE public.cv_submissions ENABLE ROW LEVEL SECURITY;
-- Les writes/reads passent par le service_role côté serveur, donc pas de policy ici.

COMMIT;

-- ─────────────────────────────────────────────────────────────
-- Note Storage : il faut créer un bucket "cv-submissions" en privé
-- Dans Supabase Dashboard → Storage → New bucket → "cv-submissions"
-- Public bucket : OFF
-- File size limit : 5 MB
-- Allowed MIME types : application/pdf
-- ─────────────────────────────────────────────────────────────
