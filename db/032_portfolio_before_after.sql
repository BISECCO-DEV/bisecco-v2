-- =====================================================================
-- 032 — Galerie "Avant / Après" pour les profils pros
--
-- À exécuter dans Supabase Dashboard → SQL Editor.
-- =====================================================================

-- Table principale : chaque ligne = 1 paire avant/après
CREATE TABLE IF NOT EXISTS public.portfolio_before_after (
  id          bigserial PRIMARY KEY,
  user_id     bigint NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  before_path text NOT NULL,
  after_path  text NOT NULL,
  title       varchar(120),
  description text,
  sort_order  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT NOW(),
  updated_at  timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS portfolio_before_after_user_idx
  ON public.portfolio_before_after (user_id, sort_order);

-- ─── RLS policies ─────────────────────────────────────────────────────
ALTER TABLE public.portfolio_before_after ENABLE ROW LEVEL SECURITY;

-- Lecture publique (n'importe qui peut voir les portfolios sur les profils)
DROP POLICY IF EXISTS "portfolio_public_read" ON public.portfolio_before_after;
CREATE POLICY "portfolio_public_read"
  ON public.portfolio_before_after
  FOR SELECT
  USING (true);

-- Écriture/suppression : seulement via service_role (server actions)
-- Les actions vérifient déjà le user_id côté serveur.
DROP POLICY IF EXISTS "portfolio_service_write" ON public.portfolio_before_after;
CREATE POLICY "portfolio_service_write"
  ON public.portfolio_before_after
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ─── Storage : on réutilise le bucket existant user-uploads ───────────
-- Path convention : {auth_id}/portfolio/{timestamp}-{random}-{side}.{ext}
-- où {side} = "before" ou "after"
-- → pas besoin de nouveau bucket

-- ─── Limite : max 6 paires avant/après par utilisateur ────────────────
-- (enforcement applicatif côté server action, mais on garde un trigger filet)
CREATE OR REPLACE FUNCTION public.portfolio_before_after_limit()
RETURNS trigger AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.portfolio_before_after WHERE user_id = NEW.user_id) >= 6 THEN
    RAISE EXCEPTION 'Limite de 6 réalisations avant/après par profil atteinte.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS portfolio_before_after_limit_trg ON public.portfolio_before_after;
CREATE TRIGGER portfolio_before_after_limit_trg
  BEFORE INSERT ON public.portfolio_before_after
  FOR EACH ROW
  EXECUTE FUNCTION public.portfolio_before_after_limit();

-- ─── updated_at auto ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS portfolio_before_after_touch ON public.portfolio_before_after;
CREATE TRIGGER portfolio_before_after_touch
  BEFORE UPDATE ON public.portfolio_before_after
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

-- ─── Vérification ─────────────────────────────────────────────────────
SELECT 'portfolio_before_after table created' AS status;
