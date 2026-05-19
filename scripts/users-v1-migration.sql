-- ============================================================
-- Migration users V1 (Laravel/MySQL) → V2 (Supabase Auth + public.users)
-- Généré le 2026-05-19T10:55:07.606Z
-- 18 comptes à migrer
-- ============================================================

-- Crée une transaction (rollback automatique si erreur)
BEGIN;

-- ─── bisecco.support@gmail.com (admin) ───
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token
)
SELECT
  '00000000-0000-0000-0000-000000000000'::uuid, gen_random_uuid(), 'authenticated', 'authenticated',
  'bisecco.support@gmail.com', '$2a$12$8fIGdK9A13keHCvj74TZs.K10Lny8NkYkClXxFLHchumyGBKMDjLy',
  NOW(), '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Admin Bisecco","migrated_from":"v1"}'::jsonb,
  '2026-04-18 07:03:59', NOW(),
  FALSE, '', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'bisecco.support@gmail.com');
INSERT INTO public.users (
  email, name, role, validation_status, password,
  phone, city, siren, email_verified_at, created_at, updated_at
)
VALUES (
  'bisecco.support@gmail.com', 'Admin Bisecco', 'admin', 'approved', '$2a$12$8fIGdK9A13keHCvj74TZs.K10Lny8NkYkClXxFLHchumyGBKMDjLy',
  NULL, NULL, NULL,
  NOW(), '2026-04-18 07:03:59', NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ─── assistance.endormis@gmail.com (particulier) ───
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token
)
SELECT
  '00000000-0000-0000-0000-000000000000'::uuid, gen_random_uuid(), 'authenticated', 'authenticated',
  'assistance.endormis@gmail.com', '$2a$12$cS3pKPzovWL62AihlQlY1uLPBBBPi1zMCVAY5D9GXgOscS0jkqjB2',
  NOW(), '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Pedro De Jesus Tavares","migrated_from":"v1"}'::jsonb,
  '2026-04-26 19:53:39', NOW(),
  FALSE, '', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'assistance.endormis@gmail.com');
INSERT INTO public.users (
  email, name, role, validation_status, password,
  phone, city, siren, email_verified_at, created_at, updated_at
)
VALUES (
  'assistance.endormis@gmail.com', 'Pedro De Jesus Tavares', 'particulier', 'approved', '$2a$12$cS3pKPzovWL62AihlQlY1uLPBBBPi1zMCVAY5D9GXgOscS0jkqjB2',
  '0766035018', 'MEAUX', NULL,
  NOW(), '2026-04-26 19:53:39', NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ─── nero.lorenzo@gmail.com (particulier) ───
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token
)
SELECT
  '00000000-0000-0000-0000-000000000000'::uuid, gen_random_uuid(), 'authenticated', 'authenticated',
  'nero.lorenzo@gmail.com', '$2a$12$42Ju6ArA8sL7lJH1Sz7giOOoNXB632uTKy2h5Fjhhq8sHfSXz9RtO',
  NOW(), '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Lorenzo nero","migrated_from":"v1"}'::jsonb,
  '2026-04-26 19:55:20', NOW(),
  FALSE, '', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nero.lorenzo@gmail.com');
INSERT INTO public.users (
  email, name, role, validation_status, password,
  phone, city, siren, email_verified_at, created_at, updated_at
)
VALUES (
  'nero.lorenzo@gmail.com', 'Lorenzo nero', 'particulier', 'approved', '$2a$12$42Ju6ArA8sL7lJH1Sz7giOOoNXB632uTKy2h5Fjhhq8sHfSXz9RtO',
  NULL, 'Meaux', NULL,
  NOW(), '2026-04-26 19:55:20', NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ─── bindagama@hotmail.com (particulier) ───
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token
)
SELECT
  '00000000-0000-0000-0000-000000000000'::uuid, gen_random_uuid(), 'authenticated', 'authenticated',
  'bindagama@hotmail.com', '$2a$12$N9I1MP.PQ.l8emJPCKc0U.rlXq.G7HNXfur7bh69KvzXsaytd3IaK',
  NOW(), '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Binda Gama","migrated_from":"v1"}'::jsonb,
  '2026-04-27 10:07:15', NOW(),
  FALSE, '', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'bindagama@hotmail.com');
INSERT INTO public.users (
  email, name, role, validation_status, password,
  phone, city, siren, email_verified_at, created_at, updated_at
)
VALUES (
  'bindagama@hotmail.com', 'Binda Gama', 'particulier', 'approved', '$2a$12$N9I1MP.PQ.l8emJPCKc0U.rlXq.G7HNXfur7bh69KvzXsaytd3IaK',
  '0624676128', '77139 MARCILLY', NULL,
  NOW(), '2026-04-27 10:07:15', NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ─── gkunarajah@gmail.com (particulier) ───
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token
)
SELECT
  '00000000-0000-0000-0000-000000000000'::uuid, gen_random_uuid(), 'authenticated', 'authenticated',
  'gkunarajah@gmail.com', '$2a$12$eII2R.viIK8EHGUWlJ3d8edvYuPQqAnOR/qEXtpT9/1etIHwPM8ke',
  NOW(), '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Rajah Kuna","migrated_from":"v1"}'::jsonb,
  '2026-04-27 15:19:12', NOW(),
  FALSE, '', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'gkunarajah@gmail.com');
INSERT INTO public.users (
  email, name, role, validation_status, password,
  phone, city, siren, email_verified_at, created_at, updated_at
)
VALUES (
  'gkunarajah@gmail.com', 'Rajah Kuna', 'particulier', 'approved', '$2a$12$eII2R.viIK8EHGUWlJ3d8edvYuPQqAnOR/qEXtpT9/1etIHwPM8ke',
  '0628982443', 'Garges les Gonesse', NULL,
  NOW(), '2026-04-27 15:19:12', NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ─── oliviermontoir@gmail.com (particulier) ───
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token
)
SELECT
  '00000000-0000-0000-0000-000000000000'::uuid, gen_random_uuid(), 'authenticated', 'authenticated',
  'oliviermontoir@gmail.com', '$2a$12$liDk3nyuhkL7zdrnj/QSnOXZ7guaISJ.zmJh8wvoZb5IM8E45Z3rq',
  NOW(), '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Olivier Lambin","migrated_from":"v1"}'::jsonb,
  '2026-04-27 17:38:23', NOW(),
  FALSE, '', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'oliviermontoir@gmail.com');
INSERT INTO public.users (
  email, name, role, validation_status, password,
  phone, city, siren, email_verified_at, created_at, updated_at
)
VALUES (
  'oliviermontoir@gmail.com', 'Olivier Lambin', 'particulier', 'approved', '$2a$12$liDk3nyuhkL7zdrnj/QSnOXZ7guaISJ.zmJh8wvoZb5IM8E45Z3rq',
  NULL, 'Coincy', NULL,
  NOW(), '2026-04-27 17:38:23', NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ─── jess700@hotmail.fr (particulier) ───
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token
)
SELECT
  '00000000-0000-0000-0000-000000000000'::uuid, gen_random_uuid(), 'authenticated', 'authenticated',
  'jess700@hotmail.fr', '$2a$12$x4xZahR.ah0cJ74qLBTH2OHhZH/Zhc8SNPHRp/wBQuEBucFuYUzni',
  NOW(), '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Jessie Clayette","migrated_from":"v1"}'::jsonb,
  '2026-04-28 10:54:01', NOW(),
  FALSE, '', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'jess700@hotmail.fr');
INSERT INTO public.users (
  email, name, role, validation_status, password,
  phone, city, siren, email_verified_at, created_at, updated_at
)
VALUES (
  'jess700@hotmail.fr', 'Jessie Clayette', 'particulier', 'approved', '$2a$12$x4xZahR.ah0cJ74qLBTH2OHhZH/Zhc8SNPHRp/wBQuEBucFuYUzni',
  '0668811033', 'Mandelieu la Napoule', NULL,
  NOW(), '2026-04-28 10:54:01', NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ─── miguel.pinheiro.mp@gmail.com (artisan) ───
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token
)
SELECT
  '00000000-0000-0000-0000-000000000000'::uuid, gen_random_uuid(), 'authenticated', 'authenticated',
  'miguel.pinheiro.mp@gmail.com', '$2a$12$nhFJNfHZx5d/dpYs3k5YXOIFMl2Msboogs3AYkBmTwYI/PRuWzn6.',
  NOW(), '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Miguel Pinheiro - AMP BAT","migrated_from":"v1"}'::jsonb,
  '2026-05-19T10:55:07.608Z', NOW(),
  FALSE, '', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'miguel.pinheiro.mp@gmail.com');
INSERT INTO public.users (
  email, name, role, validation_status, password,
  phone, city, siren, email_verified_at, created_at, updated_at
)
VALUES (
  'miguel.pinheiro.mp@gmail.com', 'Miguel Pinheiro - AMP BAT', 'artisan', 'pending', '$2a$12$nhFJNfHZx5d/dpYs3k5YXOIFMl2Msboogs3AYkBmTwYI/PRuWzn6.',
  '0621073702', 'Vinantes', NULL,
  NOW(), '2026-05-19T10:55:07.608Z', NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ─── anna.sirufo@gmail.com (particulier) ───
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token
)
SELECT
  '00000000-0000-0000-0000-000000000000'::uuid, gen_random_uuid(), 'authenticated', 'authenticated',
  'anna.sirufo@gmail.com', '$2a$12$9d1BzR8zO2Onp3mpyiDCFueBhnMyQGDQXhg5NWCjTAXq9wSZ8lQT6',
  NOW(), '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Anna SIRUFO","migrated_from":"v1"}'::jsonb,
  '2026-04-28 15:08:24', NOW(),
  FALSE, '', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'anna.sirufo@gmail.com');
INSERT INTO public.users (
  email, name, role, validation_status, password,
  phone, city, siren, email_verified_at, created_at, updated_at
)
VALUES (
  'anna.sirufo@gmail.com', 'Anna SIRUFO', 'particulier', 'approved', '$2a$12$9d1BzR8zO2Onp3mpyiDCFueBhnMyQGDQXhg5NWCjTAXq9wSZ8lQT6',
  '0781013300', 'CANNES', NULL,
  NOW(), '2026-04-28 15:08:24', NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ─── bennour-naguez-naguez-oagtvv@bisecco.fr (artisan) ───
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token
)
SELECT
  '00000000-0000-0000-0000-000000000000'::uuid, gen_random_uuid(), 'authenticated', 'authenticated',
  'bennour-naguez-naguez-oagtvv@bisecco.fr', '$2a$12$UndwLLAideak5v2iclwuBudXC2wUSZrYD8RaM2VqYDsMJnbbl1aSm',
  NOW(), '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Bennour Naguez (naguez)","migrated_from":"v1"}'::jsonb,
  '2026-04-29 19:19:06', NOW(),
  FALSE, '', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'bennour-naguez-naguez-oagtvv@bisecco.fr');
INSERT INTO public.users (
  email, name, role, validation_status, password,
  phone, city, siren, email_verified_at, created_at, updated_at
)
VALUES (
  'bennour-naguez-naguez-oagtvv@bisecco.fr', 'Bennour Naguez (naguez)', 'artisan', 'approved', '$2a$12$UndwLLAideak5v2iclwuBudXC2wUSZrYD8RaM2VqYDsMJnbbl1aSm',
  NULL, 'Meaux', '501828982',
  NOW(), '2026-04-29 19:19:06', NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ─── malik-haddad-gkqahz@bisecco.fr (artisan) ───
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token
)
SELECT
  '00000000-0000-0000-0000-000000000000'::uuid, gen_random_uuid(), 'authenticated', 'authenticated',
  'malik-haddad-gkqahz@bisecco.fr', '$2a$12$ZxBCSvFv8EGgt273065iEuxNb.G26ZkUb3ltri6mMM32V12zQ1KkG',
  NOW(), '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Malik Haddad","migrated_from":"v1"}'::jsonb,
  '2026-04-29 19:37:28', NOW(),
  FALSE, '', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'malik-haddad-gkqahz@bisecco.fr');
INSERT INTO public.users (
  email, name, role, validation_status, password,
  phone, city, siren, email_verified_at, created_at, updated_at
)
VALUES (
  'malik-haddad-gkqahz@bisecco.fr', 'Malik Haddad', 'artisan', 'approved', '$2a$12$ZxBCSvFv8EGgt273065iEuxNb.G26ZkUb3ltri6mMM32V12zQ1KkG',
  NULL, 'Melun', '983433210',
  NOW(), '2026-04-29 19:37:28', NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ─── adtaetc@gmail.com (particulier) ───
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token
)
SELECT
  '00000000-0000-0000-0000-000000000000'::uuid, gen_random_uuid(), 'authenticated', 'authenticated',
  'adtaetc@gmail.com', '$2a$12$cutB3x0O/yoljhziQJod5.xYJW5kHQcMDWDrXrnTzO4JpqBaUrYpi',
  NOW(), '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Adil Taoufik","migrated_from":"v1"}'::jsonb,
  '2026-04-30 11:22:33', NOW(),
  FALSE, '', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'adtaetc@gmail.com');
INSERT INTO public.users (
  email, name, role, validation_status, password,
  phone, city, siren, email_verified_at, created_at, updated_at
)
VALUES (
  'adtaetc@gmail.com', 'Adil Taoufik', 'particulier', 'approved', '$2a$12$cutB3x0O/yoljhziQJod5.xYJW5kHQcMDWDrXrnTzO4JpqBaUrYpi',
  NULL, '60300 Senlis', NULL,
  NOW(), '2026-04-30 11:22:33', NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ─── siriusautomobiles@gmail.com (artisan) ───
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token
)
SELECT
  '00000000-0000-0000-0000-000000000000'::uuid, gen_random_uuid(), 'authenticated', 'authenticated',
  'siriusautomobiles@gmail.com', '$2a$12$BLJj/1jpBxRhj3WEvfKNyuBPr.hRTEcVaA7x/sMlioOCfaIb/bqXe',
  NOW(), '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Franck Mino - Sirius Automobiles","migrated_from":"v1"}'::jsonb,
  '2026-04-30 16:35:40', NOW(),
  FALSE, '', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'siriusautomobiles@gmail.com');
INSERT INTO public.users (
  email, name, role, validation_status, password,
  phone, city, siren, email_verified_at, created_at, updated_at
)
VALUES (
  'siriusautomobiles@gmail.com', 'Franck Mino - Sirius Automobiles', 'artisan', 'approved', '$2a$12$BLJj/1jpBxRhj3WEvfKNyuBPr.hRTEcVaA7x/sMlioOCfaIb/bqXe',
  '01 60 32 98 19', '77165 Saint Soupplets', '851509372',
  NOW(), '2026-04-30 16:35:40', NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ─── veronica.angie@hotmail.com (particulier) ───
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token
)
SELECT
  '00000000-0000-0000-0000-000000000000'::uuid, gen_random_uuid(), 'authenticated', 'authenticated',
  'veronica.angie@hotmail.com', '$2a$12$zP4buFRLDmvCFZfv2x5K5Ovzd0/ygLVC5ggD5Z6ii31NwvfQJKghS',
  NOW(), '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Angie Cornejo","migrated_from":"v1"}'::jsonb,
  '2026-05-01 12:21:12', NOW(),
  FALSE, '', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'veronica.angie@hotmail.com');
INSERT INTO public.users (
  email, name, role, validation_status, password,
  phone, city, siren, email_verified_at, created_at, updated_at
)
VALUES (
  'veronica.angie@hotmail.com', 'Angie Cornejo', 'particulier', 'approved', '$2a$12$zP4buFRLDmvCFZfv2x5K5Ovzd0/ygLVC5ggD5Z6ii31NwvfQJKghS',
  NULL, NULL, NULL,
  NOW(), '2026-05-01 12:21:12', NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ─── laurent.rn@gmail.com (particulier) ───
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token
)
SELECT
  '00000000-0000-0000-0000-000000000000'::uuid, gen_random_uuid(), 'authenticated', 'authenticated',
  'laurent.rn@gmail.com', '$2a$12$aD1XnOa4QOuFOqrG66eU5uOavkYVjpNfB7Fxgo.IZXKxrjlDBwmp.',
  NOW(), '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Enzo Nero-Recrosio","migrated_from":"v1"}'::jsonb,
  '2026-05-01 14:17:31', NOW(),
  FALSE, '', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'laurent.rn@gmail.com');
INSERT INTO public.users (
  email, name, role, validation_status, password,
  phone, city, siren, email_verified_at, created_at, updated_at
)
VALUES (
  'laurent.rn@gmail.com', 'Enzo Nero-Recrosio', 'particulier', 'approved', '$2a$12$aD1XnOa4QOuFOqrG66eU5uOavkYVjpNfB7Fxgo.IZXKxrjlDBwmp.',
  '0658133313', 'Mandelieu la Napoule', NULL,
  NOW(), '2026-05-01 14:17:31', NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ─── agisco.fr@gmail.com (artisan) ───
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token
)
SELECT
  '00000000-0000-0000-0000-000000000000'::uuid, gen_random_uuid(), 'authenticated', 'authenticated',
  'agisco.fr@gmail.com', '$2a$12$brv293fduwNExv7fS5jMWOut4vj6pAErA9msWynhpZgYJ.0PnuQ8O',
  NOW(), '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Laurent Nero - Agisco","migrated_from":"v1"}'::jsonb,
  '2026-05-01 14:32:35', NOW(),
  FALSE, '', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'agisco.fr@gmail.com');
INSERT INTO public.users (
  email, name, role, validation_status, password,
  phone, city, siren, email_verified_at, created_at, updated_at
)
VALUES (
  'agisco.fr@gmail.com', 'Laurent Nero - Agisco', 'artisan', 'approved', '$2a$12$brv293fduwNExv7fS5jMWOut4vj6pAErA9msWynhpZgYJ.0PnuQ8O',
  '0658133313', '06400 Cannes', '750463317',
  NOW(), '2026-05-01 14:32:35', NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ─── ns.controle77@gmail.com (artisan) ───
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token
)
SELECT
  '00000000-0000-0000-0000-000000000000'::uuid, gen_random_uuid(), 'authenticated', 'authenticated',
  'ns.controle77@gmail.com', '$2a$12$//P70gSnLqd8GaYVrRYDEODdzGmf8Bs1zkB68yUxXtmCupG40KaNy',
  NOW(), '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Nassim HAMMANI - Ns controle","migrated_from":"v1"}'::jsonb,
  '2026-05-11 11:09:41', NOW(),
  FALSE, '', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ns.controle77@gmail.com');
INSERT INTO public.users (
  email, name, role, validation_status, password,
  phone, city, siren, email_verified_at, created_at, updated_at
)
VALUES (
  'ns.controle77@gmail.com', 'Nassim HAMMANI - Ns controle', 'artisan', 'approved', '$2a$12$//P70gSnLqd8GaYVrRYDEODdzGmf8Bs1zkB68yUxXtmCupG40KaNy',
  NULL, '77165 Saint-Soupplets', '921752275',
  NOW(), '2026-05-11 11:09:41', NOW()
)
ON CONFLICT (email) DO NOTHING;

COMMIT;

-- Vérification rapide :
-- SELECT COUNT(*) FROM auth.users WHERE raw_user_meta_data->>'migrated_from' = 'v1';
-- SELECT email, role, validation_status FROM public.users ORDER BY id DESC LIMIT 30;