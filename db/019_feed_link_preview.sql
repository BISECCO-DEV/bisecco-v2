-- Migration 019 — Aperçus de lien Open Graph + temps réel sur le fil.
--
-- À exécuter dans le Dashboard Supabase → SQL Editor → New Query.
--
-- Ajoute les colonnes link_* à feed_posts pour stocker l'aperçu OG capturé au
-- moment de la publication (titre, description, image, nom du site).
--
-- Active aussi la publication Realtime sur les 3 tables du fil pour que
-- les abonnements websocket côté client reçoivent les events INSERT/UPDATE/DELETE.

-- ─────────────────── COLONNES OG ───────────────────
alter table public.feed_posts
  add column if not exists link_url text,
  add column if not exists link_title text,
  add column if not exists link_description text,
  add column if not exists link_image text,
  add column if not exists link_site_name text;

create index if not exists idx_feed_posts_link_url on public.feed_posts(link_url) where link_url is not null;

-- ─────────────────── REALTIME ───────────────────
-- Ajoute les tables à la publication 'supabase_realtime' (créée par défaut par Supabase).
-- Si la table est déjà dans la publication, l'ajout est ignoré silencieusement.

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'feed_posts'
  ) then
    alter publication supabase_realtime add table public.feed_posts;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'feed_likes'
  ) then
    alter publication supabase_realtime add table public.feed_likes;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'feed_comments'
  ) then
    alter publication supabase_realtime add table public.feed_comments;
  end if;
end $$;
