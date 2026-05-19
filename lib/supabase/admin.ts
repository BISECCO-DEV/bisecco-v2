import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase ADMIN — service_role key.
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
