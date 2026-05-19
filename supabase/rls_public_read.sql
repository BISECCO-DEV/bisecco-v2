-- ============================================================
-- Row Level Security : autoriser la lecture publique des tables "publiques"
-- ============================================================
-- À exécuter dans Supabase SQL Editor
-- Sans ça, l'anon key ne peut RIEN lire (sécurité par défaut Supabase)
-- ============================================================

BEGIN;

-- ─── METIERS (référentiel public, lisible par tous) ───
ALTER TABLE public.metiers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON public.metiers;
CREATE POLICY "Public read" ON public.metiers FOR SELECT USING (true);

-- ─── ARTISAN_PROFILES (annuaire public, sauf désactivés) ───
ALTER TABLE public.artisan_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read active profiles" ON public.artisan_profiles;
CREATE POLICY "Public read active profiles" ON public.artisan_profiles
  FOR SELECT USING (is_active = true);

-- ─── ARTISAN_PROFILE_METIER (pivot, lecture publique) ───
ALTER TABLE public.artisan_profile_metier ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON public.artisan_profile_metier;
CREATE POLICY "Public read" ON public.artisan_profile_metier
  FOR SELECT USING (true);

-- ─── SERVICES (lecture publique) ───
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON public.services;
CREATE POLICY "Public read" ON public.services FOR SELECT USING (true);

-- ─── GALLERY_IMAGES (lecture publique) ───
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON public.gallery_images;
CREATE POLICY "Public read" ON public.gallery_images FOR SELECT USING (true);

-- ─── REVIEWS (lecture publique, sauf flagged) ───
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read non-flagged" ON public.reviews;
CREATE POLICY "Public read non-flagged" ON public.reviews
  FOR SELECT USING (is_flagged = false);

-- ─── USERS (lecture publique des artisans approuvés et actifs uniquement) ───
-- Sécurité : on n'expose pas les particuliers ni les comptes pending/rejected.
-- Pas de password, email, téléphone exposés par défaut (à filtrer dans la query).
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read approved artisans" ON public.users;
CREATE POLICY "Public read approved artisans" ON public.users
  FOR SELECT USING (
    role = 'artisan'
    AND validation_status = 'approved'
    AND deleted_at IS NULL
  );

-- ─── MAINTENANCE_SUBSCRIBERS : pas de lecture publique ───
ALTER TABLE public.maintenance_subscribers ENABLE ROW LEVEL SECURITY;

-- ─── REFERRALS : pas de lecture publique ───
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- ─── CHAT_CONVERSATIONS / MESSAGES : pas de lecture publique ───
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- ─── ARTISAN_POSTS / LIKES / COMMENTS / CONNECTIONS : lecture publique des posts ───
ALTER TABLE public.artisan_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON public.artisan_posts;
CREATE POLICY "Public read" ON public.artisan_posts FOR SELECT USING (true);

ALTER TABLE public.artisan_post_likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON public.artisan_post_likes;
CREATE POLICY "Public read" ON public.artisan_post_likes FOR SELECT USING (true);

ALTER TABLE public.artisan_post_comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON public.artisan_post_comments;
CREATE POLICY "Public read" ON public.artisan_post_comments FOR SELECT USING (true);

ALTER TABLE public.artisan_connections ENABLE ROW LEVEL SECURITY;

-- ─── FOLLOWS / PROFILE_VIEWS : pas de lecture publique ───
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

COMMIT;

-- ============================================================
-- Note : Toutes les WRITES (INSERT/UPDATE/DELETE) restent BLOQUÉES
-- pour l'anon key — il faudra ajouter des policies "auth.uid()"
-- quand on wirera Supabase Auth.
-- Pour l'instant, les WRITES passent par la service_role key (côté serveur).
-- ============================================================
