-- ════════════════════════════════════════════════════════════════════
-- 039 · Historique des health checks (tableau de contrôle admin)
-- À exécuter dans le Dashboard Supabase (SQL Editor).
-- ════════════════════════════════════════════════════════════════════

create table if not exists public.health_checks (
  id          bigint generated always as identity primary key,
  ran_at      timestamptz not null default now(),
  overall     text not null check (overall in ('ok', 'warn', 'error')),
  ok_count    int  not null default 0,
  warn_count  int  not null default 0,
  error_count int  not null default 0,
  results     jsonb not null,
  -- 'cron' (auto 30 min) ou 'manual' (bouton admin)
  source      text not null default 'cron'
);

create index if not exists idx_health_checks_ran_at on public.health_checks (ran_at desc);

-- Table interne : accès uniquement via le service_role (admin client, bypass RLS).
-- On active RLS sans policy publique → personne d'autre ne peut lire.
alter table public.health_checks enable row level security;

-- Purge auto possible plus tard (garder ~30 jours). Pour l'instant, conservation libre.
