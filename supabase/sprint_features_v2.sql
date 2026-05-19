-- ============================================================
-- BISECCO V2 — Migration Sprint A→AA (port depuis V1 Laravel)
-- À exécuter dans Supabase SQL Editor en une seule fois.
-- Idempotent : utilise IF NOT EXISTS partout.
-- ============================================================

-- =============================================================
-- 1. QUOTE_REQUESTS (Sprint A V1)
-- =============================================================
CREATE TABLE IF NOT EXISTS public.quote_requests (
    id              BIGSERIAL PRIMARY KEY,
    client_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    artisan_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    metier_id       BIGINT REFERENCES public.metiers(id) ON DELETE SET NULL,
    title           VARCHAR(200) NOT NULL,
    description     TEXT NOT NULL,
    city            VARCHAR(120),
    postal_code     VARCHAR(10),
    urgency         TEXT NOT NULL DEFAULT 'flexible' CHECK (urgency IN ('immediate','week','month','flexible')),
    budget_range    TEXT NOT NULL DEFAULT 'unknown'  CHECK (budget_range IN ('under_500','500_2000','2000_5000','5000_10000','over_10000','unknown')),
    contact_phone   VARCHAR(30),
    contact_email   VARCHAR(191) NOT NULL,
    status          TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','seen','responded','closed')),
    seen_at         TIMESTAMPTZ,
    responded_at    TIMESTAMPTZ,
    closed_at       TIMESTAMPTZ,
    photos          JSONB DEFAULT '[]'::jsonb,
    ip_address      INET,
    user_agent      VARCHAR(500),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quotes_artisan_status ON public.quote_requests (artisan_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_client ON public.quote_requests (client_id, created_at DESC);

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS quotes_select_own ON public.quote_requests;
CREATE POLICY quotes_select_own ON public.quote_requests
    FOR SELECT USING (auth.uid() = client_id OR auth.uid() = artisan_id);

DROP POLICY IF EXISTS quotes_insert_client ON public.quote_requests;
CREATE POLICY quotes_insert_client ON public.quote_requests
    FOR INSERT WITH CHECK (auth.uid() = client_id);

DROP POLICY IF EXISTS quotes_update_artisan ON public.quote_requests;
CREATE POLICY quotes_update_artisan ON public.quote_requests
    FOR UPDATE USING (auth.uid() = artisan_id OR auth.uid() = client_id);


-- =============================================================
-- 2. REVIEWS enrichissement (Sprint C V1)
-- =============================================================
ALTER TABLE public.reviews
    ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending','approved','rejected')),
    ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS moderated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS moderation_note TEXT,
    ADD COLUMN IF NOT EXISTS quote_request_id BIGINT REFERENCES public.quote_requests(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews (status, created_at DESC);


-- =============================================================
-- 3. FAVORITES (Sprint Q V1)
-- =============================================================
CREATE TABLE IF NOT EXISTS public.favorites (
    id          BIGSERIAL PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    artisan_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, artisan_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites (user_id, created_at DESC);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS favorites_select_own ON public.favorites;
CREATE POLICY favorites_select_own ON public.favorites
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS favorites_insert_own ON public.favorites;
CREATE POLICY favorites_insert_own ON public.favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS favorites_delete_own ON public.favorites;
CREATE POLICY favorites_delete_own ON public.favorites
    FOR DELETE USING (auth.uid() = user_id);


-- =============================================================
-- 4. APP_NOTIFICATIONS (Sprint M V1)
-- =============================================================
CREATE TABLE IF NOT EXISTS public.app_notifications (
    id          BIGSERIAL PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type        VARCHAR(50) NOT NULL,
    title       VARCHAR(200) NOT NULL,
    message     TEXT,
    action_url  VARCHAR(500),
    icon        VARCHAR(30),
    read_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.app_notifications (user_id, read_at, created_at DESC);

ALTER TABLE public.app_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS notifications_select_own ON public.app_notifications;
CREATE POLICY notifications_select_own ON public.app_notifications
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS notifications_update_own ON public.app_notifications;
CREATE POLICY notifications_update_own ON public.app_notifications
    FOR UPDATE USING (auth.uid() = user_id);


-- =============================================================
-- 5. PROFILE_REPORTS (Sprint G V1)
-- =============================================================
CREATE TABLE IF NOT EXISTS public.profile_reports (
    id                  BIGSERIAL PRIMARY KEY,
    reporter_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reporter_email      VARCHAR(191),
    reported_user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reason              TEXT NOT NULL DEFAULT 'other'
        CHECK (reason IN ('spam','fake_profile','inappropriate','siren_invalid','abuse','other')),
    detail              TEXT,
    status              TEXT NOT NULL DEFAULT 'new'
        CHECK (status IN ('new','reviewed','resolved','dismissed')),
    admin_note          TEXT,
    handled_by          UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    handled_at          TIMESTAMPTZ,
    ip_address          INET,
    user_agent          VARCHAR(500),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON public.profile_reports (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_reported ON public.profile_reports (reported_user_id, status);

-- RLS: insert public (auth + anon), select admin only (vérif via service_role côté server)
ALTER TABLE public.profile_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS reports_insert_anyone ON public.profile_reports;
CREATE POLICY reports_insert_anyone ON public.profile_reports
    FOR INSERT WITH CHECK (true);


-- =============================================================
-- 6. ADMIN_AUDIT_LOGS (Sprint X V1)
-- =============================================================
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id              BIGSERIAL PRIMARY KEY,
    admin_id        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action          VARCHAR(80) NOT NULL,
    target_type     VARCHAR(80),
    target_id       BIGINT,
    target_label    VARCHAR(200),
    metadata        JSONB,
    ip_address      INET,
    user_agent      VARCHAR(500),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_admin ON public.admin_audit_logs (admin_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_target ON public.admin_audit_logs (target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON public.admin_audit_logs (action);


-- =============================================================
-- 7. ERROR_LOGS (Sprint T V1)
-- =============================================================
CREATE TABLE IF NOT EXISTS public.error_logs (
    id              BIGSERIAL PRIMARY KEY,
    fingerprint     CHAR(40) NOT NULL UNIQUE,
    level           VARCHAR(20) NOT NULL DEFAULT 'error',
    exception_class VARCHAR(191),
    message         TEXT NOT NULL,
    file            VARCHAR(500),
    line            INTEGER,
    trace           TEXT,
    url             VARCHAR(500),
    method          VARCHAR(10),
    user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address      INET,
    user_agent      VARCHAR(500),
    count           INTEGER NOT NULL DEFAULT 1,
    status          TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','resolved','ignored')),
    first_seen_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_errors_status ON public.error_logs (status, last_seen_at DESC);


-- =============================================================
-- 8. NEWSLETTER_SUBSCRIBERS (Sprint W V1)
-- =============================================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id                  BIGSERIAL PRIMARY KEY,
    email               VARCHAR(191) NOT NULL UNIQUE,
    name                VARCHAR(120),
    audience            TEXT NOT NULL DEFAULT 'both' CHECK (audience IN ('particulier','artisan','both')),
    status              TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','unsubscribed')),
    confirmation_token  VARCHAR(80) UNIQUE,
    unsubscribe_token   VARCHAR(80) NOT NULL UNIQUE,
    confirmed_at        TIMESTAMPTZ,
    unsubscribed_at     TIMESTAMPTZ,
    source              VARCHAR(50),
    ip_address          INET,
    user_agent          VARCHAR(500),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_status_audience ON public.newsletter_subscribers (status, audience);


-- =============================================================
-- 9. BLOG_ARTICLES (Sprint E V1)
-- =============================================================
CREATE TABLE IF NOT EXISTS public.blog_articles (
    id                  BIGSERIAL PRIMARY KEY,
    slug                VARCHAR(200) NOT NULL UNIQUE,
    title               VARCHAR(250) NOT NULL,
    excerpt             VARCHAR(500),
    content_html        TEXT NOT NULL,
    image_url           VARCHAR(500),
    image_alt           VARCHAR(250),
    author              VARCHAR(120) NOT NULL DEFAULT 'L''équipe Bisecco',
    read_time           VARCHAR(20),
    status              TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
    published_at        TIMESTAMPTZ,
    meta_title          VARCHAR(200),
    meta_description    VARCHAR(250),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_published ON public.blog_articles (status, published_at DESC);

ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS blog_public_read ON public.blog_articles;
CREATE POLICY blog_public_read ON public.blog_articles
    FOR SELECT USING (status = 'published' AND published_at <= NOW());


-- =============================================================
-- TRIGGERS updated_at sur les nouvelles tables
-- =============================================================
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS quotes_touch ON public.quote_requests;
CREATE TRIGGER quotes_touch BEFORE UPDATE ON public.quote_requests
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS reports_touch ON public.profile_reports;
CREATE TRIGGER reports_touch BEFORE UPDATE ON public.profile_reports
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS errors_touch ON public.error_logs;
CREATE TRIGGER errors_touch BEFORE UPDATE ON public.error_logs
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS newsletter_touch ON public.newsletter_subscribers;
CREATE TRIGGER newsletter_touch BEFORE UPDATE ON public.newsletter_subscribers
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS blog_touch ON public.blog_articles;
CREATE TRIGGER blog_touch BEFORE UPDATE ON public.blog_articles
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
