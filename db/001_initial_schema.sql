-- ═════════════════════════════════════════════════════════════
-- Bisecco V2 — Schema initial
-- À exécuter dans Supabase → SQL Editor
-- ═════════════════════════════════════════════════════════════

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ─── ENUMS ───
create type user_role as enum ('particulier', 'artisan', 'admin');
create type validation_status as enum ('pending', 'approved', 'rejected');
create type devis_status as enum ('open', 'quoted', 'accepted', 'declined', 'completed');

-- ─── PROFILES (extends auth.users de Supabase) ───
create table public.profiles (
    id              uuid primary key references auth.users(id) on delete cascade,
    role            user_role not null default 'particulier',
    full_name       text not null,
    avatar_url      text,
    cover_url       text,
    phone           text,
    city            text,
    postal_code     text,
    description     text,
    validation_status validation_status not null default 'approved',
    validated_at    timestamptz,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

create index idx_profiles_role on public.profiles(role);
create index idx_profiles_city on public.profiles(city);

-- ─── METIERS ───
create table public.metiers (
    id          serial primary key,
    name        text not null unique,
    slug        text not null unique,
    icon        text,
    description text,
    created_at  timestamptz not null default now()
);

-- Seeds métiers
insert into public.metiers (name, slug, icon) values
    ('Plombier', 'plombier', '🔧'),
    ('Électricien', 'electricien', '⚡'),
    ('Maçon', 'macon', '🧱'),
    ('Menuisier', 'menuisier', '🪚'),
    ('Peintre', 'peintre', '🎨'),
    ('Couvreur', 'couvreur', '🏠'),
    ('Carreleur', 'carreleur', '◼️'),
    ('Charpentier', 'charpentier', '🪵'),
    ('Serrurier', 'serrurier', '🔐'),
    ('Chauffagiste', 'chauffagiste', '🔥');

-- ─── ARTISAN_PROFILES (1:1 avec profiles si role=artisan) ───
create table public.artisan_profiles (
    id              uuid primary key default uuid_generate_v4(),
    user_id         uuid not null unique references public.profiles(id) on delete cascade,
    company_name    text,
    siren           text unique,
    siren_verified_at timestamptz,
    primary_metier_id integer references public.metiers(id),
    service_radius_km integer default 30,
    business_hours  text,
    availability    text,
    created_at      timestamptz not null default now()
);

create index idx_artisan_profiles_user on public.artisan_profiles(user_id);
create index idx_artisan_profiles_siren on public.artisan_profiles(siren);

-- ─── ARTISAN_METIERS (M:N) ───
create table public.artisan_metiers (
    artisan_profile_id uuid references public.artisan_profiles(id) on delete cascade,
    metier_id          integer references public.metiers(id) on delete cascade,
    primary key (artisan_profile_id, metier_id)
);

-- ─── SERVICES ───
create table public.services (
    id          uuid primary key default uuid_generate_v4(),
    artisan_profile_id uuid not null references public.artisan_profiles(id) on delete cascade,
    title       text not null,
    description text,
    price_from  numeric(10,2),
    created_at  timestamptz not null default now()
);

-- ─── GALLERY ───
create table public.gallery_images (
    id          uuid primary key default uuid_generate_v4(),
    artisan_profile_id uuid not null references public.artisan_profiles(id) on delete cascade,
    image_url   text not null,
    caption     text,
    created_at  timestamptz not null default now()
);

-- ─── REVIEWS ───
create table public.reviews (
    id            uuid primary key default uuid_generate_v4(),
    artisan_id    uuid not null references public.profiles(id) on delete cascade,
    author_id     uuid not null references public.profiles(id) on delete cascade,
    rating        integer not null check (rating between 1 and 5),
    comment       text,
    verified      boolean not null default false,
    created_at    timestamptz not null default now(),
    unique (artisan_id, author_id)
);

create index idx_reviews_artisan on public.reviews(artisan_id);

-- ─── DEVIS (demandes de devis) ───
create table public.devis (
    id            uuid primary key default uuid_generate_v4(),
    requester_id  uuid not null references public.profiles(id) on delete cascade,
    artisan_id    uuid not null references public.profiles(id) on delete cascade,
    title         text not null,
    description   text not null,
    budget_range  text,
    urgency       text,
    photos        text[] default '{}',
    status        devis_status not null default 'open',
    quoted_amount numeric(10,2),
    created_at    timestamptz not null default now(),
    updated_at    timestamptz not null default now()
);

create index idx_devis_requester on public.devis(requester_id);
create index idx_devis_artisan on public.devis(artisan_id);

-- ─── MESSAGES (chat 1:1) ───
create table public.messages (
    id          uuid primary key default uuid_generate_v4(),
    sender_id   uuid not null references public.profiles(id) on delete cascade,
    receiver_id uuid not null references public.profiles(id) on delete cascade,
    content     text not null,
    read_at     timestamptz,
    created_at  timestamptz not null default now()
);

create index idx_messages_conversation on public.messages(sender_id, receiver_id, created_at);

-- ─── TRIGGER auto-create profile on signup ───
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, full_name, role)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        coalesce((new.raw_user_meta_data->>'role')::user_role, 'particulier')
    );
    return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- ─── TRIGGER updated_at ───
create or replace function public.touch_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.touch_updated_at();
create trigger devis_updated_at    before update on public.devis    for each row execute function public.touch_updated_at();
