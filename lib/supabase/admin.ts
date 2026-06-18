import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase ADMIN · service_role key.
 *
 * ⚠️ À N'UTILISER QUE CÔTÉ SERVEUR (Server Components, Route Handlers, Server Actions, scripts).
 * Cette clé bypass TOUTES les Row Level Security policies.
 * Ne JAMAIS l'importer dans un fichier marqué "use client".
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase admin client : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définies dans .env.local",
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

type AdminClient = ReturnType<typeof createSupabaseAdminClient>;

/**
 * Recherche un utilisateur dans auth.users par email — SANS plafond.
 *
 * `listUsers()` est paginé (perPage par défaut = 50). Un simple `.find()` sur la
 * première page rate donc tous les comptes au-delà : login / signup / reset
 * cassent silencieusement à l'échelle. Ce helper parcourt TOUTES les pages.
 *
 * @returns l'objet user auth (ou null si introuvable). Comparaison insensible à la casse.
 */
export async function findAuthUserByEmail(admin: AdminClient, email: string) {
  const target = email.trim().toLowerCase();
  const perPage = 1000;
  // Borne de sécurité (1M comptes max) pour ne jamais boucler à l'infini.
  for (let page = 1; page <= 1000; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error || !data?.users?.length) return null;
    const found = data.users.find((u) => u.email?.toLowerCase() === target);
    if (found) return found;
    if (data.users.length < perPage) return null; // dernière page atteinte
  }
  return null;
}
