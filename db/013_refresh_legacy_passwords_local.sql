-- =====================================================================
-- 013 — Restaure les hashes bcrypt depuis la V1 LOCALE (SQLite)
-- =====================================================================
-- Ce fichier est généré automatiquement par :
--   node supabase/scripts/extract_sqlite_passwords.mjs
--
-- Source : C:/Users/Laurent/Desktop/bisecco-PROJET/bisecco-PROJET/database/database.sqlite
--
-- Écrase les hashes actuels en base Supabase par ceux de la V1 locale,
-- pour que tes utilisateurs puissent se connecter avec leur vrai mot de passe.
--
-- À appliquer dans Supabase Dashboard → SQL Editor.
-- =====================================================================

UPDATE public.users SET password = '$2y$12$f.HIG4yYDFViJ5BaajG11eDNbCqTTsT8XeWuj30dEew6pt0D1mZ2W' WHERE lower(email) = 'admin@bisecco.fr';
UPDATE public.users SET password = '$2y$12$5RE0TSxeh.Mg.63PwFoYKuPiM4TQHVdtprhEBjpDQKLxl0M6lEso6' WHERE lower(email) = 'lucas.bernard@demo.fr';
UPDATE public.users SET password = '$2y$12$YwHihp6xbAeIlha/5R.GUeKaevqo9iLyYnJL2MckUFe72QRIWs1NK' WHERE lower(email) = 'sophie.lambert@demo.fr';
UPDATE public.users SET password = '$2y$12$yFc7B1aLyEQAlXIquKAnROScllMCRDJAYGlNtlwVFRExLVODsG.FK' WHERE lower(email) = 'emma.delcroix@demo.fr';
UPDATE public.users SET password = '$2y$12$O6i8H3s0gnK7vhXFbTJ26eeGtOcEPJEILiJOUj61UWdalEAfqh/YK' WHERE lower(email) = 'thomas.durand@demo.fr';
UPDATE public.users SET password = '$2y$12$2xJje9y4T7k/dHIwJWsyLeADloWcPClEPFZmiLNjm92jHuleHyGce' WHERE lower(email) = 'marc.lefevre@demo.fr';
UPDATE public.users SET password = '$2y$12$sLwWs700XbhfGc7gurE/8.Al.fQvyE7MODIjV6O9Yx1j2n1P34G/2' WHERE lower(email) = 'karim.benali@demo.fr';
UPDATE public.users SET password = '$2y$12$NmsPviOx.5BXJ9MANfRpfe6u4CxQILYv3n.OkSmC8nsDJCZpivnC2' WHERE lower(email) = 'julie.moreau@demo.fr';
UPDATE public.users SET password = '$2y$12$VixmkyrazBWy5.LKxtFvE.3Y8aFk2B9ZKv.lFzY1VPRKk6CNgAJCO' WHERE lower(email) = 'hugo.martin@demo.fr';
UPDATE public.users SET password = '$2y$12$XNpgAedIMm3y8fOuP7mpKuxiRlWf7dT4wnK.o66FkW2x.oK8f4QZi' WHERE lower(email) = 'admin@bisecco.local';
UPDATE public.users SET password = '$2y$12$W/kvuDJkJOxzcSiFQcN1jezOIil0po10WwdkpxEZcRKLDFPb2V0Ie' WHERE lower(email) = 'bisecco.support@gmail.com';
UPDATE public.users SET password = '$2y$12$VhXNu.NXFtDo7k483cFYsOifSdmcQFBDLSYhdG5gCwqJ/S4gA/BIS' WHERE lower(email) = 'test@bisecco.fr';
UPDATE public.users SET password = '$2y$12$5.OrszdXblWh8DD8myMske//Eq0Z8Xn0k6XsFAL1IjmcX4R1QBzCK' WHERE lower(email) = 'particulier.local.20260424.1@example.test';
UPDATE public.users SET password = '$2y$12$137zCVnCgwAchHl5QBBdj.l9o.IElJALtmSIfhb0q8FEBNhFA2f/a' WHERE lower(email) = 'nero.lorenzo@gmail.com';
UPDATE public.users SET password = '$2y$12$YsEqS8VwnIm.6Qq2fZ0Mz.dSnZn8c1eosb04uhDMEdKlgVqOwm/H2' WHERE lower(email) = 'lorenzonero449@gmail.com';
UPDATE public.users SET password = '$2y$12$hqVzJijdxoH9s0LU7oWulu3HOoQ.pm1G95dWhhFrGU0qF/m0FLE5C' WHERE lower(email) = 'dejesustavaresp@gmail.com';
