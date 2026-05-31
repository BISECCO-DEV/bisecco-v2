-- =====================================================================
-- 017 — Fil d'actualité (posts + likes + commentaires + signalements)
-- =====================================================================
-- À appliquer dans Supabase Dashboard → SQL Editor.
-- =====================================================================

-- ─────────────────── POSTS ───────────────────
create table if not exists public.feed_posts (
  id                bigserial primary key,
  author_id         bigint not null references public.users(id) on delete cascade,
  kind              text not null check (kind in ('realisation', 'question', 'conseil')),
  content           text not null check (char_length(content) between 10 and 4000),
  images            jsonb not null default '[]'::jsonb, -- array de paths storage
  city              text,
  metier_id         bigint references public.metiers(id) on delete set null,
  status            text not null default 'pending'
                    check (status in ('pending', 'approved', 'rejected', 'removed')),
  rejection_reason  text,
  approved_by       bigint references public.users(id),
  approved_at       timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  likes_count       int not null default 0,
  comments_count    int not null default 0
);

create index if not exists idx_feed_posts_status_created
  on public.feed_posts (status, created_at desc);
create index if not exists idx_feed_posts_author
  on public.feed_posts (author_id, created_at desc);
create index if not exists idx_feed_posts_metier_approved
  on public.feed_posts (metier_id) where status = 'approved';

-- ─────────────────── LIKES ───────────────────
create table if not exists public.feed_likes (
  post_id    bigint not null references public.feed_posts(id) on delete cascade,
  user_id    bigint not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index if not exists idx_feed_likes_user
  on public.feed_likes (user_id, created_at desc);

-- ─────────────────── COMMENTAIRES ───────────────────
create table if not exists public.feed_comments (
  id         bigserial primary key,
  post_id    bigint not null references public.feed_posts(id) on delete cascade,
  author_id  bigint not null references public.users(id) on delete cascade,
  content    text not null check (char_length(content) between 2 and 1500),
  status     text not null default 'visible'
             check (status in ('visible', 'removed')),
  created_at timestamptz not null default now()
);

create index if not exists idx_feed_comments_post
  on public.feed_comments (post_id, created_at)
  where status = 'visible';

-- ─────────────────── SIGNALEMENTS ───────────────────
create table if not exists public.feed_reports (
  id           bigserial primary key,
  post_id      bigint references public.feed_posts(id) on delete cascade,
  comment_id   bigint references public.feed_comments(id) on delete cascade,
  reporter_id  bigint not null references public.users(id) on delete cascade,
  reason       text not null,
  created_at   timestamptz not null default now(),
  resolved_at  timestamptz,
  resolved_by  bigint references public.users(id),
  check (post_id is not null or comment_id is not null)
);

create unique index if not exists idx_feed_reports_unique_post
  on public.feed_reports (post_id, reporter_id) where post_id is not null;
create unique index if not exists idx_feed_reports_unique_comment
  on public.feed_reports (comment_id, reporter_id) where comment_id is not null;

-- ─────────────────── TRIGGERS counts ───────────────────
create or replace function public.tg_feed_likes_count()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    update public.feed_posts
      set likes_count = likes_count + 1
      where id = new.post_id;
  elsif tg_op = 'DELETE' then
    update public.feed_posts
      set likes_count = greatest(0, likes_count - 1)
      where id = old.post_id;
  end if;
  return null;
end $$;

drop trigger if exists tg_feed_likes_count on public.feed_likes;
create trigger tg_feed_likes_count
after insert or delete on public.feed_likes
for each row execute function public.tg_feed_likes_count();

create or replace function public.tg_feed_comments_count()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' and new.status = 'visible' then
    update public.feed_posts
      set comments_count = comments_count + 1
      where id = new.post_id;
  elsif tg_op = 'UPDATE' then
    if old.status = 'visible' and new.status = 'removed' then
      update public.feed_posts
        set comments_count = greatest(0, comments_count - 1)
        where id = new.post_id;
    elsif old.status = 'removed' and new.status = 'visible' then
      update public.feed_posts
        set comments_count = comments_count + 1
        where id = new.post_id;
    end if;
  elsif tg_op = 'DELETE' and old.status = 'visible' then
    update public.feed_posts
      set comments_count = greatest(0, comments_count - 1)
      where id = old.post_id;
  end if;
  return null;
end $$;

drop trigger if exists tg_feed_comments_count on public.feed_comments;
create trigger tg_feed_comments_count
after insert or update or delete on public.feed_comments
for each row execute function public.tg_feed_comments_count();

-- updated_at automatique sur feed_posts
create or replace function public.tg_feed_posts_touch()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists tg_feed_posts_touch on public.feed_posts;
create trigger tg_feed_posts_touch
before update on public.feed_posts
for each row execute function public.tg_feed_posts_touch();

-- ─────────────────── RLS ───────────────────
alter table public.feed_posts    enable row level security;
alter table public.feed_likes    enable row level security;
alter table public.feed_comments enable row level security;
alter table public.feed_reports  enable row level security;

-- Lecture publique des posts approuvés
drop policy if exists "feed_posts_read_approved" on public.feed_posts;
create policy "feed_posts_read_approved"
on public.feed_posts for select to public
using (status = 'approved');

-- L'auteur peut voir ses propres posts (incl. pending/rejected)
drop policy if exists "feed_posts_read_own" on public.feed_posts;
create policy "feed_posts_read_own"
on public.feed_posts for select to authenticated
using (
  author_id in (
    select id from public.users where ilike(email, auth.email())
  )
);

-- Toutes les écritures passent par les server actions (service_role), pas de RLS write.
-- Idem pour comments/likes/reports : on bypass via createSupabaseAdminClient().

-- Lecture publique des commentaires visibles
drop policy if exists "feed_comments_read_visible" on public.feed_comments;
create policy "feed_comments_read_visible"
on public.feed_comments for select to public
using (status = 'visible');

-- Lecture publique du nombre de likes via la colonne count sur feed_posts.
-- La table feed_likes elle-même : lecture authentifiée seulement (pour savoir si je like)
drop policy if exists "feed_likes_read_auth" on public.feed_likes;
create policy "feed_likes_read_auth"
on public.feed_likes for select to authenticated
using (true);
