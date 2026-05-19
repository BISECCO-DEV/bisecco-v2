-- =====================================================================
-- 012 — Restaure les hashes bcrypt Laravel des utilisateurs V1
-- =====================================================================
-- Ce fichier est généré automatiquement par :
--   node supabase/scripts/restore_passwords.mjs
--
-- Il restaure la colonne public.users.password (perdue lors de l'import)
-- à partir du dump MySQL d'origine, pour permettre l'auto-migration au login.
--
-- À appliquer dans Supabase Dashboard → SQL Editor.
-- Idempotent : ne met à jour que les lignes où password IS NULL.
-- =====================================================================

UPDATE public.users SET password = '$2y$12$8fIGdK9A13keHCvj74TZs.K10Lny8NkYkClXxFLHchumyGBKMDjLy' WHERE lower(email) = 'bisecco.support@gmail.com' AND password IS NULL;
UPDATE public.users SET password = '$2y$12$cS3pKPzovWL62AihlQlY1uLPBBBPi1zMCVAY5D9GXgOscS0jkqjB2' WHERE lower(email) = 'assistance.endormis@gmail.com' AND password IS NULL;
UPDATE public.users SET password = '$2y$12$42Ju6ArA8sL7lJH1Sz7giOOoNXB632uTKy2h5Fjhhq8sHfSXz9RtO' WHERE lower(email) = 'nero.lorenzo@gmail.com' AND password IS NULL;
UPDATE public.users SET password = '$2y$12$N9I1MP.PQ.l8emJPCKc0U.rlXq.G7HNXfur7bh69KvzXsaytd3IaK' WHERE lower(email) = 'bindagama@hotmail.com' AND password IS NULL;
UPDATE public.users SET password = '$2y$12$eII2R.viIK8EHGUWlJ3d8edvYuPQqAnOR/qEXtpT9/1etIHwPM8ke' WHERE lower(email) = 'gkunarajah@gmail.com' AND password IS NULL;
UPDATE public.users SET password = '$2y$12$liDk3nyuhkL7zdrnj/QSnOXZ7guaISJ.zmJh8wvoZb5IM8E45Z3rq' WHERE lower(email) = 'oliviermontoir@gmail.com' AND password IS NULL;
UPDATE public.users SET password = '$2y$12$x4xZahR.ah0cJ74qLBTH2OHhZH/Zhc8SNPHRp/wBQuEBucFuYUzni' WHERE lower(email) = 'jess700@hotmail.fr' AND password IS NULL;
UPDATE public.users SET password = '$2y$12$nhFJNfHZx5d/dpYs3k5YXOIFMl2Msboogs3AYkBmTwYI/PRuWzn6.' WHERE lower(email) = 'miguel.pinheiro.mp@gmail.com' AND password IS NULL;
UPDATE public.users SET password = '$2y$12$9d1BzR8zO2Onp3mpyiDCFueBhnMyQGDQXhg5NWCjTAXq9wSZ8lQT6' WHERE lower(email) = 'anna.sirufo@gmail.com' AND password IS NULL;
UPDATE public.users SET password = '$2y$12$UndwLLAideak5v2iclwuBudXC2wUSZrYD8RaM2VqYDsMJnbbl1aSm' WHERE lower(email) = 'bennour-naguez-naguez-oagtvv@bisecco.fr' AND password IS NULL;
UPDATE public.users SET password = '$2y$12$ZxBCSvFv8EGgt273065iEuxNb.G26ZkUb3ltri6mMM32V12zQ1KkG' WHERE lower(email) = 'malik-haddad-gkqahz@bisecco.fr' AND password IS NULL;
UPDATE public.users SET password = '$2y$12$cutB3x0O/yoljhziQJod5.xYJW5kHQcMDWDrXrnTzO4JpqBaUrYpi' WHERE lower(email) = 'adtaetc@gmail.com' AND password IS NULL;
UPDATE public.users SET password = '$2y$12$BLJj/1jpBxRhj3WEvfKNyuBPr.hRTEcVaA7x/sMlioOCfaIb/bqXe' WHERE lower(email) = 'siriusautomobiles@gmail.com' AND password IS NULL;
UPDATE public.users SET password = '$2y$12$zP4buFRLDmvCFZfv2x5K5Ovzd0/ygLVC5ggD5Z6ii31NwvfQJKghS' WHERE lower(email) = 'veronica.angie@hotmail.com' AND password IS NULL;
UPDATE public.users SET password = '$2y$12$aD1XnOa4QOuFOqrG66eU5uOavkYVjpNfB7Fxgo.IZXKxrjlDBwmp.' WHERE lower(email) = 'laurent.rn@gmail.com' AND password IS NULL;
UPDATE public.users SET password = '$2y$12$brv293fduwNExv7fS5jMWOut4vj6pAErA9msWynhpZgYJ.0PnuQ8O' WHERE lower(email) = 'agisco.fr@gmail.com' AND password IS NULL;
UPDATE public.users SET password = '$2y$12$//P70gSnLqd8GaYVrRYDEODdzGmf8Bs1zkB68yUxXtmCupG40KaNy' WHERE lower(email) = 'ns.controle77@gmail.com' AND password IS NULL;
