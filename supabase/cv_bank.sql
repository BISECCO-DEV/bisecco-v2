-- ============================================================
-- Banque de CV publique : n'importe qui peut déposer son CV
-- (auth ou non). Modéré ensuite par admin.
-- ============================================================

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
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'archived')),
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
