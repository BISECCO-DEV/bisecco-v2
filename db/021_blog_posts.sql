-- Migration 021 — Table blog_posts pour la publication automatique d'articles.
--
-- À exécuter dans le Dashboard Supabase → SQL Editor.
--
-- Permet à l'agent cron d'INSÉRER des articles sans toucher au code (lib/blog.ts
-- reste pour les articles "historiques" hardcodés, on lit les 2 sources et on
-- merge côté server component si besoin).

create table if not exists public.blog_posts (
  id              bigserial primary key,
  slug            text unique not null,
  title           text not null,
  excerpt         text,
  body            text not null,             -- Markdown ou HTML
  category        text default 'Conseils',
  image_url       text,
  read_time       int,                       -- Estimation en minutes
  author_name     text default 'L''équipe Bisecco',
  author_avatar   text,
  status          text default 'published' check (status in ('draft', 'published', 'archived')),
  published_at    timestamptz default now(),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index if not exists idx_blog_posts_status_published on public.blog_posts(status, published_at desc) where status = 'published';
create index if not exists idx_blog_posts_category on public.blog_posts(category) where status = 'published';

-- RLS : lecture publique, écriture uniquement via service_role
alter table public.blog_posts enable row level security;

create policy "blog_posts_read_public"
  on public.blog_posts for select
  using (status = 'published');

-- Trigger pour updated_at automatique
create or replace function update_blog_posts_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_blog_posts_updated_at on public.blog_posts;
create trigger trg_blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function update_blog_posts_updated_at();
