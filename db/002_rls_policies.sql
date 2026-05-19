-- ═════════════════════════════════════════════════════════════
-- Bisecco V2 — Row Level Security
-- À exécuter APRÈS 001_initial_schema.sql
-- ═════════════════════════════════════════════════════════════

-- Helper : check si user courant est admin
create or replace function public.is_admin()
returns boolean as $$
    select exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'admin'
    );
$$ language sql security definer stable;

-- ─── PROFILES ───
alter table public.profiles enable row level security;

create policy "profiles_select_public" on public.profiles
    for select using (true); -- profils publics visibles par tous

create policy "profiles_update_own" on public.profiles
    for update using (auth.uid() = id);

create policy "profiles_admin_all" on public.profiles
    for all using (public.is_admin());

-- ─── METIERS (lecture publique) ───
alter table public.metiers enable row level security;
create policy "metiers_select_public" on public.metiers for select using (true);
create policy "metiers_admin_write" on public.metiers for all using (public.is_admin());

-- ─── ARTISAN_PROFILES ───
alter table public.artisan_profiles enable row level security;

create policy "artisan_profiles_select_public" on public.artisan_profiles
    for select using (true);

create policy "artisan_profiles_insert_own" on public.artisan_profiles
    for insert with check (auth.uid() = user_id);

create policy "artisan_profiles_update_own" on public.artisan_profiles
    for update using (auth.uid() = user_id);

create policy "artisan_profiles_admin_all" on public.artisan_profiles
    for all using (public.is_admin());

-- ─── ARTISAN_METIERS ───
alter table public.artisan_metiers enable row level security;

create policy "artisan_metiers_select_public" on public.artisan_metiers
    for select using (true);

create policy "artisan_metiers_manage_own" on public.artisan_metiers
    for all using (
        exists (
            select 1 from public.artisan_profiles
            where id = artisan_profile_id and user_id = auth.uid()
        )
    );

-- ─── SERVICES & GALLERY ───
alter table public.services enable row level security;
create policy "services_select_public" on public.services for select using (true);
create policy "services_manage_own" on public.services for all using (
    exists (select 1 from public.artisan_profiles where id = artisan_profile_id and user_id = auth.uid())
);

alter table public.gallery_images enable row level security;
create policy "gallery_select_public" on public.gallery_images for select using (true);
create policy "gallery_manage_own" on public.gallery_images for all using (
    exists (select 1 from public.artisan_profiles where id = artisan_profile_id and user_id = auth.uid())
);

-- ─── REVIEWS ───
alter table public.reviews enable row level security;

create policy "reviews_select_public" on public.reviews for select using (true);

create policy "reviews_insert_authenticated" on public.reviews
    for insert with check (auth.uid() = author_id and auth.uid() <> artisan_id);

create policy "reviews_update_own" on public.reviews
    for update using (auth.uid() = author_id);

create policy "reviews_delete_own" on public.reviews
    for delete using (auth.uid() = author_id);

create policy "reviews_admin_all" on public.reviews for all using (public.is_admin());

-- ─── DEVIS ───
alter table public.devis enable row level security;

create policy "devis_select_party" on public.devis
    for select using (auth.uid() = requester_id or auth.uid() = artisan_id);

create policy "devis_insert_requester" on public.devis
    for insert with check (auth.uid() = requester_id);

create policy "devis_update_party" on public.devis
    for update using (auth.uid() = requester_id or auth.uid() = artisan_id);

create policy "devis_admin_all" on public.devis for all using (public.is_admin());

-- ─── MESSAGES ───
alter table public.messages enable row level security;

create policy "messages_select_party" on public.messages
    for select using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "messages_insert_authenticated" on public.messages
    for insert with check (auth.uid() = sender_id);

create policy "messages_update_receiver_read" on public.messages
    for update using (auth.uid() = receiver_id);

create policy "messages_admin_all" on public.messages for all using (public.is_admin());
