-- =====================================================================
-- 011 — Storage buckets pour les photos de profil
-- =====================================================================
-- Crée un bucket `user-uploads` public en lecture, restreint en écriture
-- au propriétaire du dossier (= son user_id).
--
-- Structure attendue dans le bucket :
--   {user_id}/avatar.{ext}        → photo de profil
--   {user_id}/cover.{ext}         → photo de couverture
--   {user_id}/gallery/{uuid}.{ext} → galerie de réalisations
--
-- À appliquer manuellement dans Supabase Dashboard → SQL Editor.
-- =====================================================================

-- 1. Création du bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'user-uploads',
  'user-uploads',
  true, -- lecture publique (les profils sont publics)
  5 * 1024 * 1024, -- 5 MB max par fichier
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 2. RLS policies sur storage.objects
-- (RLS est déjà activé par défaut sur storage.objects)

-- Lecture : public (n'importe qui peut lire les fichiers du bucket)
drop policy if exists "user_uploads_public_read" on storage.objects;
create policy "user_uploads_public_read"
on storage.objects for select
to public
using (bucket_id = 'user-uploads');

-- Insert : l'utilisateur authentifié ne peut écrire que dans son propre dossier
-- Le dossier racine doit correspondre à son auth.uid()
drop policy if exists "user_uploads_owner_insert" on storage.objects;
create policy "user_uploads_owner_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'user-uploads'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Update : pareil, owner only
drop policy if exists "user_uploads_owner_update" on storage.objects;
create policy "user_uploads_owner_update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'user-uploads'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'user-uploads'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Delete : owner only
drop policy if exists "user_uploads_owner_delete" on storage.objects;
create policy "user_uploads_owner_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'user-uploads'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================================
-- Note : on uploadera côté server avec le service_role key qui bypass
-- les RLS, mais on garde ces policies pour autoriser aussi l'upload
-- direct depuis le client si besoin un jour (anon key + auth session).
-- =====================================================================
