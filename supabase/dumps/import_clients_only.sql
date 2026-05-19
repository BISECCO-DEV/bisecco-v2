-- ============================================================
-- Import CLIENTS UNIQUEMENT (sans recréer les métiers V2)
-- À exécuter après bisecco_postgres.sql qui a planté
-- ============================================================
-- Cette version :
-- 1. Ne touche pas à la table metiers (les 290 V2 sont déjà là)
-- 2. Remappe les anciens metier_id MySQL → nouveaux V2 par SLUG
-- 3. Importe les users, profils, services, gallery, chat
-- ============================================================

BEGIN;

-- ── Nettoie ton compte actuel pour libérer l'email ──
DELETE FROM public.users WHERE email = 'bisecco.support@gmail.com';

-- ── 1. USERS (17 lignes, de l'admin + tes artisans + particuliers) ──
INSERT INTO public.users (id, client_number, name, email, email_verified_at, password, oauth_provider, oauth_id, role, phone, city, description, profile_photo, cover_photo, siren, siren_status, siren_last_checked_at, siren_closed_at, validation_status, validated_at, validated_by, rejection_reason, remember_token, created_at, updated_at, deleted_at) VALUES
  (4, 'BIS-2026-000003', 'Admin Bisecco', 'bisecco.support@gmail.com', NULL, NULL, NULL, NULL, 'admin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', '2026-04-19 09:37:11', NULL, NULL, NULL, '2026-04-18 05:03:59', '2026-04-21 07:24:49', NULL),
  (35, 'BIS-2026-000004', 'Pedro De Jesus Tavares', 'assistance.endormis@gmail.com', NULL, NULL, NULL, NULL, 'particulier', '0766035018', 'MEAUX', NULL, 'uploads/v9Copez19Uj0T4MaVnlfEBYFxElTGLQxaEdI6Lcv.png', 'uploads/LwxdS3wPYkOBtFtQ9bdt8iy7Gq1ggpU8SKnpfIpF.png', NULL, NULL, NULL, NULL, 'approved', '2026-04-26 18:00:28', NULL, NULL, NULL, '2026-04-26 17:53:39', '2026-04-26 18:00:28', NULL),
  (36, 'BIS-2026-000005', 'Lorenzo nero', 'nero.lorenzo@gmail.com', NULL, NULL, NULL, NULL, 'particulier', NULL, 'Meaux', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', '2026-04-26 18:00:27', NULL, NULL, NULL, '2026-04-26 17:55:20', '2026-04-26 18:00:27', NULL),
  (40, 'BIS-2026-000009', 'Binda Gama', 'bindagama@hotmail.com', NULL, NULL, NULL, NULL, 'particulier', '0624676128', '77139 MARCILLY', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', '2026-04-27 08:07:49', NULL, NULL, NULL, '2026-04-27 08:07:15', '2026-04-27 08:07:49', NULL),
  (41, 'BIS-2026-000010', 'Rajah Kuna', 'gkunarajah@gmail.com', NULL, NULL, NULL, NULL, 'particulier', '0628982443', 'Garges les Gonesse', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', '2026-04-27 13:19:41', NULL, NULL, NULL, '2026-04-27 13:19:12', '2026-04-27 13:19:41', NULL),
  (42, 'BIS-2026-000011', 'Olivier Lambin', 'oliviermontoir@gmail.com', NULL, NULL, NULL, NULL, 'particulier', NULL, 'Coincy', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', '2026-04-27 15:38:59', NULL, NULL, NULL, '2026-04-27 15:38:23', '2026-04-27 15:38:59', NULL),
  (43, 'BIS-2026-000012', 'Jessie Clayette', 'jess700@hotmail.fr', NULL, NULL, NULL, NULL, 'particulier', '0668811033', 'Mandelieu la Napoule', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', '2026-04-28 08:54:32', NULL, NULL, NULL, '2026-04-28 08:54:01', '2026-04-28 08:54:32', NULL),
  (44, 'BIS-2026-000013', 'Miguel Pinheiro - AMP BAT', 'miguel.pinheiro.mp@gmail.com', '2026-04-28 12:03:34', NULL, NULL, NULL, 'artisan', '0621073702', 'Vinantes', 'Bonjour\n\nPour un travail de serieux et de qualiter', NULL, NULL, '934890187', NULL, NULL, NULL, 'approved', '2026-04-28 12:08:03', NULL, NULL, NULL, '2026-04-28 12:03:34', '2026-04-28 12:14:40', NULL),
  (45, 'BIS-2026-000014', 'Anna SIRUFO', 'anna.sirufo@gmail.com', NULL, NULL, NULL, NULL, 'particulier', '0781013300', 'CANNES', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', '2026-04-29 09:14:41', NULL, NULL, NULL, '2026-04-28 13:08:24', '2026-04-29 09:14:41', NULL),
  (57, 'BIS-2026-000015', 'Bennour Naguez (naguez)', 'bennour-naguez-naguez-oagTvV@bisecco.fr', NULL, NULL, NULL, NULL, 'artisan', NULL, 'Meaux', NULL, 'uploads/qjgSk1pHEyME9wN7ZQnZ2v96O9NZ5KmoEOak3Nez.png', 'uploads/ThXlevx2XWp4zdKMrH3rD6fKCFcnNaPgtfOUDHvB.png', '501828982', NULL, NULL, NULL, 'approved', '2026-04-29 17:19:06', 4, NULL, NULL, '2026-04-29 17:19:06', '2026-04-29 17:19:06', NULL),
  (58, 'BIS-2026-000016', 'Malik Haddad', 'malik-haddad-GkQahZ@bisecco.fr', NULL, NULL, NULL, NULL, 'artisan', NULL, 'Melun', NULL, 'uploads/XjFo98gTnC4REaaX5niee8e2x05CCEmdZDC3oDCA.png', 'uploads/JTHkQSIKGHj9uwdN8WAGT5UhHYtjpce4z69tRvO8.png', '983433210', NULL, NULL, NULL, 'approved', '2026-04-29 17:37:28', 4, NULL, NULL, '2026-04-29 17:37:28', '2026-04-29 17:37:28', NULL),
  (59, 'BIS-2026-000017', 'Adil Taoufik', 'adtaetc@gmail.com', NULL, NULL, NULL, NULL, 'particulier', NULL, '60300 Senlis', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', '2026-04-30 09:23:12', NULL, NULL, NULL, '2026-04-30 09:22:33', '2026-04-30 09:23:12', NULL),
  (60, 'BIS-2026-000018', 'Franck Mino - Sirius Automobiles', 'siriusautomobiles@gmail.com', '2026-04-30 14:35:40', NULL, NULL, NULL, 'artisan', '01 60 32 98 19', '77165 Saint Soupplets', NULL, NULL, NULL, '851509372', NULL, NULL, NULL, 'approved', '2026-04-30 14:59:55', NULL, NULL, NULL, '2026-04-30 14:35:40', '2026-04-30 14:59:55', NULL),
  (63, 'BIS-2026-000020', 'Angie Cornejo', 'veronica.angie@hotmail.com', NULL, NULL, NULL, NULL, 'particulier', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', '2026-05-01 10:22:09', NULL, NULL, NULL, '2026-05-01 10:21:12', '2026-05-01 10:22:09', NULL),
  (64, 'BIS-2026-000021', 'Enzo Nero-Recrosio', 'laurent.rn@gmail.com', '2026-05-01 12:17:31', NULL, NULL, NULL, 'particulier', '0658133313', 'Mandelieu la Napoule', NULL, 'uploads/vlKUjAaKy5an6wtUtYjgn06qEnb2WtobtrFADrVk.jpg', NULL, NULL, NULL, NULL, NULL, 'approved', '2026-05-01 12:17:31', NULL, NULL, NULL, '2026-05-01 12:17:31', '2026-05-01 12:42:01', NULL),
  (65, 'BIS-2026-000022', 'Laurent Nero - Agisco', 'agisco.fr@gmail.com', '2026-05-01 12:32:35', NULL, NULL, NULL, 'artisan', '0658133313', '06400 Cannes', NULL, 'uploads/8p7RUtXe5Bij5zYr5zTNpGuEmoRKqRd4O8OGAO84.png', NULL, '750463317', NULL, NULL, NULL, 'approved', '2026-05-01 12:32:58', NULL, NULL, NULL, '2026-05-01 12:32:35', '2026-05-01 12:54:56', NULL),
  (66, 'BIS-2026-000023', 'Nassim HAMMANI - Ns controle', 'ns.controle77@gmail.com', '2026-05-11 09:09:41', NULL, NULL, NULL, 'artisan', NULL, '77165 Saint-Soupplets', NULL, NULL, NULL, '921752275', NULL, NULL, NULL, 'approved', '2026-05-11 09:11:35', NULL, NULL, NULL, '2026-05-11 09:09:41', '2026-05-11 09:11:35', NULL);

-- ── 2. ARTISAN_PROFILES — remappés vers métiers V2 par SLUG ──
-- AMP BAT (44) → Plombier
INSERT INTO public.artisan_profiles (id, user_id, metier_id, company_name, description, availability, business_hours, service_radius, is_active, created_at, updated_at)
SELECT 15, 44, m.id, 'AMP BAT', E'Bonjour\n\nPour un travail de serieux et de qualiter', 'week', '8 H / 17 H', 100, true, '2026-04-28 12:03:34', '2026-04-28 12:14:40'
FROM public.metiers m WHERE m.slug = 'plombier' LIMIT 1;

-- Bennour Naguez (57) → Plombier
INSERT INTO public.artisan_profiles (id, user_id, metier_id, company_name, description, service_radius, siret, is_active, created_at, updated_at)
SELECT 26, 57, m.id, 'Bennour Naguez', 'Bennour Naguez est une entreprise professionnelle, basée à Meaux.', 30, '501828982', true, '2026-04-29 17:19:06', '2026-04-29 17:19:06'
FROM public.metiers m WHERE m.slug = 'plombier' LIMIT 1;

-- Malik Haddad (58) → Plombier
INSERT INTO public.artisan_profiles (id, user_id, metier_id, company_name, description, service_radius, siret, is_active, created_at, updated_at)
SELECT 27, 58, m.id, 'Malik Haddad (hm Services)', 'Malik Haddad (hm Services) est une entreprise professionnelle, basée à Melun.', 8, '983433210', true, '2026-04-29 17:37:28', '2026-04-29 17:37:28'
FROM public.metiers m WHERE m.slug = 'plombier' LIMIT 1;

-- Sirius Automobiles (60) → Mécanicien automobile (le V2 a "mecanicien-automobile")
INSERT INTO public.artisan_profiles (id, user_id, metier_id, company_name, is_active, created_at, updated_at)
SELECT 28, 60, m.id, 'Sirius Automobiles', true, '2026-04-30 14:35:40', '2026-04-30 14:35:40'
FROM public.metiers m WHERE m.slug = 'mecanicien-automobile' LIMIT 1;

-- Agisco (65) → Informaticien (services)
INSERT INTO public.artisan_profiles (id, user_id, metier_id, company_name, is_active, created_at, updated_at)
SELECT 29, 65, m.id, 'Agisco', true, '2026-05-01 12:32:35', '2026-05-01 12:32:35'
FROM public.metiers m WHERE m.slug = 'informaticien' LIMIT 1;

-- Ns controle (66) → Diagnostiqueur auto
INSERT INTO public.artisan_profiles (id, user_id, metier_id, company_name, is_active, created_at, updated_at)
SELECT 30, 66, m.id, 'Ns controle', true, '2026-05-11 09:09:41', '2026-05-11 09:09:41'
FROM public.metiers m WHERE m.slug = 'diagnostiqueur-auto' LIMIT 1;

-- ── 3. ARTISAN_PROFILE_METIER (lien many-to-many) — remappés ──
INSERT INTO public.artisan_profile_metier (artisan_profile_id, metier_id)
SELECT 15, m.id FROM public.metiers m WHERE m.slug = 'plombier' LIMIT 1;
INSERT INTO public.artisan_profile_metier (artisan_profile_id, metier_id)
SELECT 26, m.id FROM public.metiers m WHERE m.slug = 'plombier' LIMIT 1;
INSERT INTO public.artisan_profile_metier (artisan_profile_id, metier_id)
SELECT 27, m.id FROM public.metiers m WHERE m.slug = 'plombier' LIMIT 1;
INSERT INTO public.artisan_profile_metier (artisan_profile_id, metier_id)
SELECT 28, m.id FROM public.metiers m WHERE m.slug = 'mecanicien-automobile' LIMIT 1;
INSERT INTO public.artisan_profile_metier (artisan_profile_id, metier_id)
SELECT 28, m.id FROM public.metiers m WHERE m.slug = 'carrossier' LIMIT 1;
INSERT INTO public.artisan_profile_metier (artisan_profile_id, metier_id)
SELECT 28, m.id FROM public.metiers m WHERE m.slug = 'peintre-automobile' LIMIT 1;
INSERT INTO public.artisan_profile_metier (artisan_profile_id, metier_id)
SELECT 29, m.id FROM public.metiers m WHERE m.slug = 'informaticien' LIMIT 1;
INSERT INTO public.artisan_profile_metier (artisan_profile_id, metier_id)
SELECT 30, m.id FROM public.metiers m WHERE m.slug = 'diagnostiqueur-auto' LIMIT 1;

-- ── 4. SERVICES (5 lignes) ──
INSERT INTO public.services (id, artisan_profile_id, name, price, created_at, updated_at) VALUES
  (2, 27, 'Débouchage canalisation', '80 €', '2026-04-29 17:37:28', '2026-04-29 17:37:28'),
  (3, 27, 'Réparation fuite d''eau', '90 €', '2026-04-29 17:37:28', '2026-04-29 17:37:28'),
  (4, 27, 'Installation robinetterie', '120 €', '2026-04-29 17:37:28', '2026-04-29 17:37:28'),
  (5, 27, 'Remplacement chauffe-eau', '350 €', '2026-04-29 17:37:28', '2026-04-29 17:37:28'),
  (6, 27, 'Dépannage urgent', '150 €', '2026-04-29 17:37:28', '2026-04-29 17:37:28');

-- ── 5. GALLERY ──
INSERT INTO public.gallery_images (id, artisan_profile_id, user_id, image_path, sort_order, created_at, updated_at) VALUES
  (5, NULL, 36, 'gallery/InAnUWKw83XW2Gh7PM0vKbj7EtnJEyYWaujPc0w2.jpg', 0, '2026-04-26 17:56:08', '2026-04-26 17:56:08');

-- ── 6. CHAT ──
INSERT INTO public.chat_conversations (id, visitor_id, page_url, status, human_mode, last_activity_at, created_at, updated_at) VALUES
  (18, 'Izo1O31gGw78fiBIgiFdBpDC9ZsJnXuFY2gG5W1A', '/', 'open', false, '2026-05-14 20:01:59', '2026-05-14 20:01:59', '2026-05-14 20:01:59');

INSERT INTO public.chat_messages (id, conversation_id, body, sender, sender_name, created_at, updated_at) VALUES
  (32, 18, 'Comment fonctionne Bisecco ?', 'visitor', 'Visiteur', '2026-05-14 20:01:59', '2026-05-14 20:01:59'),
  (33, 18, 'Je note votre demande. Souhaitez-vous trouver un artisan, en savoir plus sur la plateforme ou gérer votre compte ?', 'bot', 'Camille — Conseillère Bisecco', '2026-05-14 20:01:59', '2026-05-14 20:01:59');

-- ── 7. PROFILE_VIEWS ──
INSERT INTO public.profile_views (id, profile_user_id, viewed_at) VALUES
  (4, 44, '2026-04-28 12:10:44'), (5, 44, '2026-04-28 12:12:00'), (6, 44, '2026-04-28 14:23:14'),
  (7, 44, '2026-04-28 14:49:05'), (8, 44, '2026-04-28 14:52:28'), (10, 44, '2026-04-29 06:29:04'),
  (12, 44, '2026-04-29 07:01:08'), (14, 44, '2026-04-29 13:45:11'), (27, 44, '2026-05-01 11:14:13'),
  (37, 44, '2026-05-07 13:28:38'), (43, 44, '2026-05-08 02:36:56'),
  (18, 57, '2026-04-29 17:19:33'), (26, 57, '2026-05-01 10:47:12'), (34, 57, '2026-05-03 08:28:32'),
  (44, 57, '2026-05-08 06:45:41'), (52, 57, '2026-05-13 06:17:54'), (56, 57, '2026-05-14 12:28:26'),
  (57, 57, '2026-05-14 12:28:30'),
  (19, 58, '2026-04-29 17:37:47'), (21, 58, '2026-04-30 09:23:06'), (32, 58, '2026-05-01 19:27:39'),
  (33, 58, '2026-05-01 21:53:38'), (45, 58, '2026-05-08 08:46:49'), (53, 58, '2026-05-13 06:21:08'),
  (55, 58, '2026-05-14 12:28:01'),
  (22, 60, '2026-04-30 15:16:35'), (23, 60, '2026-04-30 15:16:40'), (24, 60, '2026-05-01 10:22:04'),
  (28, 60, '2026-05-01 12:07:58'), (29, 60, '2026-05-01 12:14:19'), (35, 60, '2026-05-03 08:56:14'),
  (42, 60, '2026-05-08 01:07:11'), (47, 60, '2026-05-09 12:11:18'), (49, 60, '2026-05-11 12:24:20'),
  (50, 60, '2026-05-11 12:24:26'), (51, 60, '2026-05-11 16:14:57'), (58, 60, '2026-05-14 20:11:17'),
  (59, 60, '2026-05-16 07:44:04'),
  (30, 65, '2026-05-01 12:35:15'), (31, 65, '2026-05-01 12:56:38'), (36, 65, '2026-05-05 04:26:21'),
  (38, 65, '2026-05-07 15:54:36'), (39, 65, '2026-05-07 15:54:41'), (40, 65, '2026-05-07 15:55:53'),
  (41, 65, '2026-05-07 16:42:14'), (46, 65, '2026-05-09 12:10:55'),
  (48, 66, '2026-05-11 09:17:20'), (54, 66, '2026-05-14 06:43:58');

-- ── 8. Mets le bon admin (réassocie à TON compte Supabase Auth) ──
-- Ce UPDATE garantit que role=admin pour l'email connecté
UPDATE public.users
SET role = 'admin', validation_status = 'approved', validated_at = NOW(), deleted_at = NULL
WHERE LOWER(email) = 'bisecco.support@gmail.com';

-- ── 9. Reset des séquences ──
SELECT setval(pg_get_serial_sequence('public.users', 'id'), COALESCE((SELECT MAX(id) FROM public.users), 1));
SELECT setval(pg_get_serial_sequence('public.artisan_profiles', 'id'), COALESCE((SELECT MAX(id) FROM public.artisan_profiles), 1));
SELECT setval(pg_get_serial_sequence('public.artisan_profile_metier', 'id'), COALESCE((SELECT MAX(id) FROM public.artisan_profile_metier), 1));
SELECT setval(pg_get_serial_sequence('public.services', 'id'), COALESCE((SELECT MAX(id) FROM public.services), 1));
SELECT setval(pg_get_serial_sequence('public.gallery_images', 'id'), COALESCE((SELECT MAX(id) FROM public.gallery_images), 1));
SELECT setval(pg_get_serial_sequence('public.chat_conversations', 'id'), COALESCE((SELECT MAX(id) FROM public.chat_conversations), 1));
SELECT setval(pg_get_serial_sequence('public.chat_messages', 'id'), COALESCE((SELECT MAX(id) FROM public.chat_messages), 1));
SELECT setval(pg_get_serial_sequence('public.profile_views', 'id'), COALESCE((SELECT MAX(id) FROM public.profile_views), 1));

COMMIT;
