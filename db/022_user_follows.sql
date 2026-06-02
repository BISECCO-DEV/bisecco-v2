-- Migration 022 — Système d'abonnement entre utilisateurs.
--
-- À exécuter dans Supabase Dashboard → SQL Editor.
--
-- Permet à un utilisateur (particulier ou artisan) d'en suivre un autre.
-- Quand A suit B, A reçoit les nouveaux posts du fil de B dans son feed perso
-- (logique d'affichage à venir côté app).
--
-- Contraintes :
--  - Pas de self-follow (check follower_id != followed_id)
--  - Pas de doublon (unique sur le couple)
--  - Cascade on delete : si user supprimé, toutes ses relations partent

create table if not exists public.user_follows (
  id           bigserial primary key,
  follower_id  bigint not null references public.users(id) on delete cascade,
  followed_id  bigint not null references public.users(id) on delete cascade,
  created_at   timestamptz default now() not null,
  unique (follower_id, followed_id),
  check (follower_id <> followed_id)
);

create index if not exists idx_user_follows_follower
  on public.user_follows(follower_id, created_at desc);

create index if not exists idx_user_follows_followed
  on public.user_follows(followed_id, created_at desc);

-- RLS : lecture publique (compteurs visibles), écriture via service_role uniquement
alter table public.user_follows enable row level security;

create policy "user_follows_read_public"
  on public.user_follows for select
  using (true);

-- Realtime pour màj live des compteurs
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'user_follows'
  ) then
    alter publication supabase_realtime add table public.user_follows;
  end if;
end $$;
