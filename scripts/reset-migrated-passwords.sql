-- ============================================================
-- Reset password pour TOUS les comptes migrés depuis V1
-- Mot de passe temporaire : Bisecco2026!
-- À communiquer aux users + leur demander de changer à la 1ère connexion.
-- ============================================================

-- 1. Reset les passwords (sauf siriusautomobiles déjà reseté manuellement)
UPDATE auth.users
SET encrypted_password = crypt('Bisecco2026!', gen_salt('bf', 10)),
    updated_at = NOW()
WHERE raw_user_meta_data->>'migrated_from' = 'v1'
  AND email != 'siriusautomobiles@gmail.com';

-- 2. Vérification : liste de tous les emails affectés
SELECT
  email,
  raw_user_meta_data->>'name' AS nom,
  LEFT(encrypted_password, 7) AS hash_prefix,
  updated_at
FROM auth.users
WHERE raw_user_meta_data->>'migrated_from' = 'v1'
ORDER BY email;

-- ─────────────────────────────────────────────────────────────
-- À communiquer aux users (par email/SMS/whatsapp) :
--
--   Sujet : Mise à jour Bisecco · Votre nouveau mot de passe temporaire
--
--   Bonjour [Prénom],
--
--   Bisecco a migré vers une nouvelle plateforme. Pour des raisons techniques,
--   votre mot de passe a été réinitialisé à :
--
--       Bisecco2026!
--
--   Connectez-vous sur https://bisecco.fr/connexion avec votre email habituel,
--   puis changez ce mot de passe via votre espace personnel.
--
--   Bonne navigation,
--   L'équipe Bisecco
-- ─────────────────────────────────────────────────────────────
