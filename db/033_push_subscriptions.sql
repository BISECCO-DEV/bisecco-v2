-- =====================================================================
-- 033 — Push notifications (Web Push API)
--
-- À exécuter dans Supabase Dashboard → SQL Editor.
--
-- Stocke les "abonnements push" du navigateur (endpoint Web Push standard).
-- Un même user peut avoir plusieurs subscriptions (1 par device/navigateur).
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id          bigserial PRIMARY KEY,
  user_id     bigint NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  endpoint    text NOT NULL UNIQUE,    -- URL push fournie par le browser (Apple/Mozilla/Google/etc.)
  p256dh      text NOT NULL,           -- clé publique du browser pour chiffrement
  auth        text NOT NULL,           -- secret d'authentification du browser
  user_agent  text,                    -- pour debugging (ex: "Chrome/Mac")
  created_at  timestamptz NOT NULL DEFAULT NOW(),
  last_used_at timestamptz             -- mis à jour à chaque push envoyée avec succès
);

CREATE INDEX IF NOT EXISTS push_subscriptions_user_idx
  ON public.push_subscriptions (user_id);

-- ─── RLS : tout passe par service_role (server actions) ───────────────
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "push_subscriptions_service_only" ON public.push_subscriptions;
CREATE POLICY "push_subscriptions_service_only"
  ON public.push_subscriptions
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

SELECT 'push_subscriptions table created' AS status;
