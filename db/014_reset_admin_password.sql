-- =====================================================================
-- 014 — Reset du mot de passe admin (mdp connu, partagé V1+V2)
-- =====================================================================
-- Généré automatiquement par : node supabase/scripts/reset_admin_password.mjs
-- Email : bisecco.support@gmail.com
-- =====================================================================

UPDATE public.users SET password = '$2y$12$7YMtQA4GLIxH5rEUA..8oOaEUrtbPHk5Ca9ggATeHI0Efls49/G9e' WHERE lower(email) = 'bisecco.support@gmail.com';
