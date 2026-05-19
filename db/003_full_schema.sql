-- ============================================================================
-- Bisecco — Schéma Postgres pour Supabase
-- Converti depuis les migrations Laravel/MySQL (Option A : port 1:1)
-- ============================================================================
-- À exécuter dans Supabase Dashboard → SQL Editor → New query → coller → Run
-- ============================================================================

-- ─── Helpers : trigger automatique pour updated_at ──────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 1. USERS
-- ============================================================================
CREATE TABLE public.users (
  id                     BIGSERIAL PRIMARY KEY,
  client_number          VARCHAR(20) UNIQUE,
  referral_code          VARCHAR(24) UNIQUE,
  referred_by_user_id    BIGINT REFERENCES public.users(id) ON DELETE SET NULL,
  name                   VARCHAR(255) NOT NULL,
  email                  VARCHAR(255) NOT NULL UNIQUE,
  email_verified_at      TIMESTAMPTZ,
  password               VARCHAR(255),
  oauth_provider         VARCHAR(30),
  oauth_id               VARCHAR(100),
  role                   VARCHAR(20) NOT NULL DEFAULT 'particulier'
                         CHECK (role IN ('admin', 'artisan', 'particulier')),
  phone                  VARCHAR(255),
  city                   VARCHAR(255),
  description            TEXT,
  profile_photo          VARCHAR(255),
  cover_photo            VARCHAR(255),
  -- SIREN / vérification artisan
  siren                  VARCHAR(9),
  siren_status           CHAR(1),
  siren_last_checked_at  TIMESTAMPTZ,
  siren_closed_at        TIMESTAMPTZ,
  validation_status      VARCHAR(20) NOT NULL DEFAULT 'pending'
                         CHECK (validation_status IN ('pending', 'approved', 'rejected')),
  validated_at           TIMESTAMPTZ,
  validated_by           BIGINT REFERENCES public.users(id) ON DELETE SET NULL,
  rejection_reason       TEXT,
  -- Auth Laravel-compat
  remember_token         VARCHAR(100),
  -- Timestamps + soft delete
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at             TIMESTAMPTZ
);

CREATE INDEX users_referred_by_idx ON public.users(referred_by_user_id);
CREATE INDEX users_role_idx ON public.users(role);
CREATE INDEX users_validation_status_idx ON public.users(validation_status);
CREATE INDEX users_city_idx ON public.users(city);
CREATE INDEX users_deleted_at_idx ON public.users(deleted_at);

CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 2. METIERS
-- ============================================================================
CREATE TABLE public.metiers (
  id          BIGSERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  slug        VARCHAR(255) NOT NULL UNIQUE,
  category    VARCHAR(50) NOT NULL
              CHECK (category IN ('batiment', 'facade_equipement',
                                  'services_techniques', 'metiers_bouche',
                                  'services_proximite')),
  description TEXT,
  icon        VARCHAR(255),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER metiers_updated_at BEFORE UPDATE ON public.metiers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 3. ARTISAN_PROFILES
-- ============================================================================
CREATE TABLE public.artisan_profiles (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  metier_id       BIGINT NOT NULL REFERENCES public.metiers(id) ON DELETE CASCADE,
  company_name    VARCHAR(255),
  description     TEXT,
  availability    VARCHAR(255),
  business_hours  VARCHAR(255),
  service_radius  INTEGER,  -- en km
  latitude        DECIMAL(10, 7),
  longitude       DECIMAL(10, 7),
  siret           VARCHAR(255),
  siret_verified  BOOLEAN NOT NULL DEFAULT FALSE,
  rcs_verified    BOOLEAN NOT NULL DEFAULT FALSE,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX artisan_profiles_user_idx ON public.artisan_profiles(user_id);
CREATE INDEX artisan_profiles_metier_idx ON public.artisan_profiles(metier_id);
CREATE INDEX artisan_profiles_is_active_idx ON public.artisan_profiles(is_active);
CREATE INDEX artisan_profiles_geo_idx ON public.artisan_profiles(latitude, longitude);

CREATE TRIGGER artisan_profiles_updated_at BEFORE UPDATE ON public.artisan_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 4. ARTISAN_PROFILE_METIER (pivot many-to-many)
-- ============================================================================
CREATE TABLE public.artisan_profile_metier (
  id                   BIGSERIAL PRIMARY KEY,
  artisan_profile_id   BIGINT NOT NULL REFERENCES public.artisan_profiles(id) ON DELETE CASCADE,
  metier_id            BIGINT NOT NULL REFERENCES public.metiers(id) ON DELETE CASCADE,
  UNIQUE (artisan_profile_id, metier_id)
);

CREATE INDEX artisan_profile_metier_metier_idx ON public.artisan_profile_metier(metier_id);

-- ============================================================================
-- 5. SERVICES
-- ============================================================================
CREATE TABLE public.services (
  id                  BIGSERIAL PRIMARY KEY,
  artisan_profile_id  BIGINT NOT NULL REFERENCES public.artisan_profiles(id) ON DELETE CASCADE,
  name                VARCHAR(255) NOT NULL,
  price               VARCHAR(255),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX services_profile_idx ON public.services(artisan_profile_id);

CREATE TRIGGER services_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 6. GALLERY_IMAGES (étendu à tous les users)
-- ============================================================================
CREATE TABLE public.gallery_images (
  id                  BIGSERIAL PRIMARY KEY,
  artisan_profile_id  BIGINT REFERENCES public.artisan_profiles(id) ON DELETE SET NULL,
  user_id             BIGINT REFERENCES public.users(id) ON DELETE CASCADE,
  image_path          VARCHAR(255) NOT NULL,
  caption             VARCHAR(255),
  sort_order          INTEGER NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX gallery_user_idx ON public.gallery_images(user_id);
CREATE INDEX gallery_profile_idx ON public.gallery_images(artisan_profile_id);

CREATE TRIGGER gallery_images_updated_at BEFORE UPDATE ON public.gallery_images
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 7. REVIEWS
-- ============================================================================
CREATE TABLE public.reviews (
  id                  BIGSERIAL PRIMARY KEY,
  is_flagged          BOOLEAN NOT NULL DEFAULT FALSE,
  artisan_profile_id  BIGINT NOT NULL REFERENCES public.artisan_profiles(id) ON DELETE CASCADE,
  user_id             BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  rating              SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment             TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX reviews_profile_idx ON public.reviews(artisan_profile_id);
CREATE INDEX reviews_user_idx ON public.reviews(user_id);
CREATE INDEX reviews_rating_idx ON public.reviews(rating);

CREATE TRIGGER reviews_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 8. FOLLOWS (particuliers -> artisans, social)
-- ============================================================================
CREATE TABLE public.follows (
  id            BIGSERIAL PRIMARY KEY,
  follower_id   BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  following_id  BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (follower_id, following_id)
);

CREATE INDEX follows_follower_idx ON public.follows(follower_id);
CREATE INDEX follows_following_idx ON public.follows(following_id);

CREATE TRIGGER follows_updated_at BEFORE UPDATE ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 9. ARTISAN_POSTS + LIKES + COMMENTS + CONNECTIONS (réseau social)
-- ============================================================================
CREATE TABLE public.artisan_posts (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  image       VARCHAR(255),
  is_news     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX artisan_posts_user_idx ON public.artisan_posts(user_id);
CREATE INDEX artisan_posts_is_news_idx ON public.artisan_posts(is_news);

CREATE TRIGGER artisan_posts_updated_at BEFORE UPDATE ON public.artisan_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.artisan_post_likes (
  id          BIGSERIAL PRIMARY KEY,
  post_id     BIGINT NOT NULL REFERENCES public.artisan_posts(id) ON DELETE CASCADE,
  user_id     BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (post_id, user_id)
);

CREATE TRIGGER artisan_post_likes_updated_at BEFORE UPDATE ON public.artisan_post_likes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.artisan_post_comments (
  id          BIGSERIAL PRIMARY KEY,
  post_id     BIGINT NOT NULL REFERENCES public.artisan_posts(id) ON DELETE CASCADE,
  user_id     BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX artisan_post_comments_post_idx ON public.artisan_post_comments(post_id);

CREATE TRIGGER artisan_post_comments_updated_at BEFORE UPDATE ON public.artisan_post_comments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.artisan_connections (
  id            BIGSERIAL PRIMARY KEY,
  follower_id   BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  following_id  BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (follower_id, following_id)
);

CREATE TRIGGER artisan_connections_updated_at BEFORE UPDATE ON public.artisan_connections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 10. CHAT (chatbot + support)
-- ============================================================================
CREATE TABLE public.chat_conversations (
  id                BIGSERIAL PRIMARY KEY,
  visitor_id        VARCHAR(64) NOT NULL,
  visitor_name      VARCHAR(255),
  visitor_email     VARCHAR(255),
  page_url          VARCHAR(255),
  status            VARCHAR(20) NOT NULL DEFAULT 'open'
                    CHECK (status IN ('open', 'handled', 'closed', 'bot')),
  human_mode        BOOLEAN NOT NULL DEFAULT FALSE,
  last_activity_at  TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX chat_conversations_visitor_idx ON public.chat_conversations(visitor_id);
CREATE INDEX chat_conversations_status_idx ON public.chat_conversations(status);

CREATE TRIGGER chat_conversations_updated_at BEFORE UPDATE ON public.chat_conversations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.chat_messages (
  id               BIGSERIAL PRIMARY KEY,
  conversation_id  BIGINT NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  body             TEXT NOT NULL,
  sender           VARCHAR(20) NOT NULL CHECK (sender IN ('visitor', 'agent', 'bot')),
  sender_name      VARCHAR(255),
  read_at          TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX chat_messages_conv_idx ON public.chat_messages(conversation_id);

CREATE TRIGGER chat_messages_updated_at BEFORE UPDATE ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 11. PROFILE_VIEWS (analytics simples)
-- ============================================================================
CREATE TABLE public.profile_views (
  id               BIGSERIAL PRIMARY KEY,
  profile_user_id  BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  viewed_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX profile_views_user_viewed_idx ON public.profile_views(profile_user_id, viewed_at);

-- ============================================================================
-- 12. REFERRALS (programme parrainage)
-- ============================================================================
CREATE TABLE public.referrals (
  id                BIGSERIAL PRIMARY KEY,
  referrer_id       BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referred_user_id  BIGINT REFERENCES public.users(id) ON DELETE SET NULL,
  referral_code     VARCHAR(24) NOT NULL,
  channel           VARCHAR(32),  -- android_picker, ios_sms, whatsapp, email, copy_link, native_share
  ip                VARCHAR(45),
  user_agent        VARCHAR(512),
  status            VARCHAR(20) NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'signed_up', 'validated')),
  signed_up_at      TIMESTAMPTZ,
  validated_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX referrals_referrer_status_idx ON public.referrals(referrer_id, status);
CREATE INDEX referrals_code_idx ON public.referrals(referral_code);
CREATE INDEX referrals_status_idx ON public.referrals(status);

CREATE TRIGGER referrals_updated_at BEFORE UPDATE ON public.referrals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 13. MAINTENANCE_SUBSCRIBERS
-- ============================================================================
CREATE TABLE public.maintenance_subscribers (
  id           BIGSERIAL PRIMARY KEY,
  email        VARCHAR(255) NOT NULL UNIQUE,
  token        VARCHAR(64) NOT NULL UNIQUE,
  ip_address   VARCHAR(45),
  notified_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Row Level Security (RLS) — DÉSACTIVÉ par défaut sur tables publiques
-- À activer cas par cas plus tard (auth Supabase)
-- ============================================================================
-- Pour rendre une table lisible publiquement (sans auth) :
--   ALTER TABLE public.metiers ENABLE ROW LEVEL SECURITY;
--   CREATE POLICY "public read" ON public.metiers FOR SELECT USING (true);
-- On configurera ces policies dans une 2e étape, après migration de la data.

-- ============================================================================
-- DONE — Bisecco schema v1
-- ============================================================================
