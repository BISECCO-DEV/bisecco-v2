-- ============================================================
-- Système custom de réinitialisation de mot de passe
-- (bypass complet du flow Supabase Auth · comme la V1 Laravel)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.password_resets (
  id bigserial PRIMARY KEY,
  email text NOT NULL,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_password_resets_token_hash ON public.password_resets(token_hash);
CREATE INDEX IF NOT EXISTS idx_password_resets_email ON public.password_resets(email);
CREATE INDEX IF NOT EXISTS idx_password_resets_expires ON public.password_resets(expires_at);

-- RLS : accès uniquement via service_role (server actions). Pas d'accès public.
ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY;
