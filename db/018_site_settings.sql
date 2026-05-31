-- =====================================================================
-- 018 — Site settings (toggle maintenance depuis l'admin)
-- =====================================================================
-- À appliquer dans Supabase Dashboard → SQL Editor.
-- =====================================================================

create table if not exists public.site_settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now(),
  updated_by  bigint references public.users(id)
);

-- Lecture publique pour le middleware (qui doit savoir si maintenance ON sans auth)
alter table public.site_settings enable row level security;

drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read"
on public.site_settings for select to public using (true);

-- Toutes les écritures via server actions (service_role bypass RLS), pas besoin de policy write.

-- Valeur initiale : maintenance désactivée
insert into public.site_settings (key, value)
values ('maintenance_enabled', 'false'::jsonb)
on conflict (key) do nothing;
