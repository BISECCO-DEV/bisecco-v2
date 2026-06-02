-- Migration 020 — Repartage (repost) des posts du fil.
--
-- À exécuter dans le Dashboard Supabase → SQL Editor → New Query.
--
-- Ajoute la colonne repost_of_id sur feed_posts. Quand un utilisateur
-- repartage un post existant, on crée un NOUVEAU feed_post avec :
--   - author_id = utilisateur qui repartage
--   - content   = son commentaire éventuel (peut être vide)
--   - repost_of_id = id du post original
--
-- Pas de chaînage : on ne peut pas repartager un repost. Si un user clique
-- "Repartager" sur un repost, on enregistre l'id du post original (le grand-père).

alter table public.feed_posts
  add column if not exists repost_of_id bigint references public.feed_posts(id) on delete set null;

create index if not exists idx_feed_posts_repost_of_id
  on public.feed_posts(repost_of_id)
  where repost_of_id is not null;

-- Pour les feed_posts qui ont repost_of_id renseigné, le content peut être vide.
-- (On laisse la contrainte existante : not null, min 10 chars). Si la validation
-- côté server-action veut autoriser un commentaire vide pour les reposts, elle
-- doit le faire au niveau applicatif (placeholder espace), ou on autorise ici :
alter table public.feed_posts alter column content drop not null;
