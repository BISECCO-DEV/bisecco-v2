-- ============================================================
-- Fix: Crée les entrées auth.identities manquantes pour tous les users
-- migrés depuis V1 (sans cette table, login email/password ne marche pas).
--
-- Le provider "email" Supabase Auth attend une ligne dans auth.identities
-- pour chaque user, avec provider_id = email + identity_data { sub, email }.
-- ============================================================

INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  u.id,
  jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true),
  'email',
  u.email,
  NOW(),
  NOW(),
  NOW()
FROM auth.users u
WHERE u.raw_user_meta_data->>'migrated_from' = 'v1'
  AND NOT EXISTS (
    SELECT 1 FROM auth.identities i
    WHERE i.user_id = u.id AND i.provider = 'email'
  );

-- Vérification (à lancer juste après) :
-- SELECT u.email, COUNT(i.id) AS identities
-- FROM auth.users u
-- LEFT JOIN auth.identities i ON i.user_id = u.id
-- WHERE u.raw_user_meta_data->>'migrated_from' = 'v1'
-- GROUP BY u.email;
