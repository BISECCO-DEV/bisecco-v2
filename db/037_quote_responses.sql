-- =====================================================================
-- 037 — Réponses structurées aux devis
--
-- À exécuter dans Supabase Dashboard → SQL Editor.
--
-- Le pro répond à une quote_request avec un devis structuré :
--  - lignes (poste, quantité, prix unitaire HT, TVA)
--  - total HT/TTC calculés
--  - délais d'exécution
--  - validité de l'offre
-- Le client peut accepter / refuser.
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.quote_responses (
  id                bigserial PRIMARY KEY,
  quote_request_id  bigint NOT NULL REFERENCES public.quote_requests(id) ON DELETE CASCADE,
  artisan_id        bigint NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  client_id         bigint NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  -- Contenu structuré (JSON pour souplesse)
  -- Format : [{ label: string, quantity: number, unit: string, unit_price_ht: number, vat_rate: number }, ...]
  lines             jsonb NOT NULL DEFAULT '[]'::jsonb,

  -- Totaux dénormalisés (pour les requêtes/listes sans parser le JSON)
  total_ht          numeric(10, 2) NOT NULL DEFAULT 0,
  total_ttc         numeric(10, 2) NOT NULL DEFAULT 0,

  -- Métadonnées
  delay_text        varchar(120),                    -- ex: "2 semaines après signature"
  valid_until       date,                            -- date de validité de l'offre
  message           text,                            -- message libre du pro
  payment_terms     text,                            -- ex: "30% à signature, 70% à fin"

  -- Cycle de vie
  status            text NOT NULL DEFAULT 'sent'
                    CHECK (status IN ('sent', 'accepted', 'refused', 'expired', 'withdrawn')),
  sent_at           timestamptz NOT NULL DEFAULT NOW(),
  decided_at        timestamptz,                     -- moment où le client a accepté/refusé
  decision_note     text,                            -- pourquoi le client a refusé (optionnel)

  created_at        timestamptz NOT NULL DEFAULT NOW(),
  updated_at        timestamptz NOT NULL DEFAULT NOW(),

  UNIQUE (quote_request_id)  -- 1 seule réponse par demande
);

CREATE INDEX IF NOT EXISTS quote_responses_artisan_idx
  ON public.quote_responses (artisan_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS quote_responses_client_idx
  ON public.quote_responses (client_id, status, created_at DESC);

-- ─── RLS : tout passe par service_role (server actions) ──────────────
ALTER TABLE public.quote_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "quote_responses_service_only" ON public.quote_responses;
CREATE POLICY "quote_responses_service_only"
  ON public.quote_responses
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ─── Trigger updated_at auto (reuse helper) ──────────────────────────
DROP TRIGGER IF EXISTS quote_responses_touch ON public.quote_responses;
CREATE TRIGGER quote_responses_touch
  BEFORE UPDATE ON public.quote_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

SELECT 'quote_responses table created' AS status;
