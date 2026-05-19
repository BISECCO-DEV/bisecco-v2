-- ============================================================
-- Patch quote_requests : support du broadcast public
-- (demande sans artisan ciblé + soumission par invité non auth)
-- ============================================================

-- Rendre artisan_id nullable (= broadcast à tous les artisans du métier/ville)
ALTER TABLE public.quote_requests
    ALTER COLUMN artisan_id DROP NOT NULL;

-- Rendre client_id nullable aussi (guest submission)
ALTER TABLE public.quote_requests
    ALTER COLUMN client_id DROP NOT NULL;

-- Ajout des champs guest (si non logged-in)
ALTER TABLE public.quote_requests
    ADD COLUMN IF NOT EXISTS submitter_name  VARCHAR(120),
    ADD COLUMN IF NOT EXISTS submitter_phone VARCHAR(30);

-- Index pour récupérer rapidement les broadcasts d'un métier
CREATE INDEX IF NOT EXISTS idx_quotes_broadcast_metier ON public.quote_requests (metier_id, created_at DESC)
    WHERE artisan_id IS NULL;

-- Adapter la policy SELECT : permettre aux artisans de voir les broadcasts de leur métier
DROP POLICY IF EXISTS quotes_select_own ON public.quote_requests;
CREATE POLICY quotes_select_own ON public.quote_requests
    FOR SELECT USING (
        auth.uid() = client_id
        OR auth.uid() = artisan_id
        OR (
            artisan_id IS NULL
            AND EXISTS (
                SELECT 1 FROM public.artisan_profiles ap
                WHERE ap.user_id = auth.uid()
                  AND ap.metier_id = public.quote_requests.metier_id
            )
        )
    );

-- Permettre l'insertion par invités (anon role) — anti-spam géré côté Server Action
DROP POLICY IF EXISTS quotes_insert_client ON public.quote_requests;
CREATE POLICY quotes_insert_anyone ON public.quote_requests
    FOR INSERT WITH CHECK (true);
