-- =====================================================================
-- 035 — Calendrier de disponibilités du pro
--
-- À exécuter dans Supabase Dashboard → SQL Editor.
--
-- Le pro définit ses créneaux récurrents (par jour de semaine).
-- Le client voit en temps réel sur le profil :
--  - Si le pro est disponible "maintenant"
--  - Les jours/heures de la semaine où il est joignable
-- =====================================================================

-- Créneaux récurrents par jour de la semaine
-- day_of_week : 0 = dimanche, 1 = lundi, … 6 = samedi (compat JS Date.getDay())
CREATE TABLE IF NOT EXISTS public.pro_availability (
  id           bigserial PRIMARY KEY,
  user_id      bigint NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  day_of_week  smallint NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time   time NOT NULL,                          -- ex: '09:00:00'
  end_time     time NOT NULL,                          -- ex: '18:00:00'
  created_at   timestamptz NOT NULL DEFAULT NOW(),
  CHECK (start_time < end_time)
);

CREATE INDEX IF NOT EXISTS pro_availability_user_idx
  ON public.pro_availability (user_id, day_of_week);

-- Préférence globale du pro : "accepte les RDV en ligne ?"
-- Stockée dans users.availability_meta (jsonb) pour rester souple sans nouvelle migration.
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS availability_meta jsonb DEFAULT '{}'::jsonb;

-- ─── RLS : lecture publique, écriture via service_role ────────────────
ALTER TABLE public.pro_availability ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pro_availability_public_read" ON public.pro_availability;
CREATE POLICY "pro_availability_public_read"
  ON public.pro_availability
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "pro_availability_service_write" ON public.pro_availability;
CREATE POLICY "pro_availability_service_write"
  ON public.pro_availability
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

SELECT 'pro_availability table created' AS status;
