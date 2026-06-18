-- =====================================================================
-- 036 — Réponses préenregistrées du pro
--
-- À exécuter dans Supabase Dashboard → SQL Editor.
--
-- Permet au pro de stocker des réponses-types qu'il insère en 1 clic
-- dans une conversation (ex: "Je reviens vers vous sous 1h", "Indisponible
-- cette semaine, on peut programmer la suivante ?").
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.quick_replies (
  id           bigserial PRIMARY KEY,
  user_id      bigint NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  label        varchar(80) NOT NULL,                     -- ex: "Suivi 1h"
  body         text NOT NULL,                            -- contenu du message
  sort_order   int NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT NOW(),
  updated_at   timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS quick_replies_user_idx
  ON public.quick_replies (user_id, sort_order);

-- ─── RLS : tout passe par service_role ───────────────────────────────
ALTER TABLE public.quick_replies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "quick_replies_service_only" ON public.quick_replies;
CREATE POLICY "quick_replies_service_only"
  ON public.quick_replies
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ─── Trigger updated_at auto ─────────────────────────────────────────
DROP TRIGGER IF EXISTS quick_replies_touch ON public.quick_replies;
CREATE TRIGGER quick_replies_touch
  BEFORE UPDATE ON public.quick_replies
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

-- ─── Limite : 10 templates max par user (filet via trigger) ──────────
CREATE OR REPLACE FUNCTION public.quick_replies_limit()
RETURNS trigger AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.quick_replies WHERE user_id = NEW.user_id) >= 10 THEN
    RAISE EXCEPTION 'Limite de 10 réponses préenregistrées par profil atteinte.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS quick_replies_limit_trg ON public.quick_replies;
CREATE TRIGGER quick_replies_limit_trg
  BEFORE INSERT ON public.quick_replies
  FOR EACH ROW
  EXECUTE FUNCTION public.quick_replies_limit();

SELECT 'quick_replies table created' AS status;
