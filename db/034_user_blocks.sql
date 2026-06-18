-- =====================================================================
-- 034 — Système de blocage entre utilisateurs
--
-- À exécuter dans Supabase Dashboard → SQL Editor.
--
-- Un user peut bloquer un autre user. Une fois bloqué :
--  - Plus aucun message ne peut transiter dans les 2 sens
--  - Le bloqueur ne voit plus les messages du bloqué dans sa messagerie
--  - Le bloqué ne peut plus initier une nouvelle conversation
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.user_blocks (
  id           bigserial PRIMARY KEY,
  blocker_id   bigint NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  blocked_id   bigint NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reason       text,                                  -- optionnel : motif
  created_at   timestamptz NOT NULL DEFAULT NOW(),
  UNIQUE (blocker_id, blocked_id),
  CHECK (blocker_id <> blocked_id)
);

CREATE INDEX IF NOT EXISTS user_blocks_blocker_idx
  ON public.user_blocks (blocker_id, created_at DESC);
CREATE INDEX IF NOT EXISTS user_blocks_blocked_idx
  ON public.user_blocks (blocked_id);

-- ─── RLS : tout passe par service_role (server actions) ───────────────
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_blocks_service_only" ON public.user_blocks;
CREATE POLICY "user_blocks_service_only"
  ON public.user_blocks
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

SELECT 'user_blocks table created' AS status;
