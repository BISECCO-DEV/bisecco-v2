import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type DbUser = {
  id: number;            // public.users.id (bigint)
  email: string;
  name: string | null;
  role: "particulier" | "artisan" | "admin" | "super_admin";
  validation_status: string;
  phone: string | null;
  city: string | null;
};

/**
 * Récupère le profil public.users de l'utilisateur connecté (Supabase Auth).
 *
 * Mapping: auth.uid() (UUID) → public.users.id (bigint) via email.
 * Le schéma V2 ne lie pas auth.users et public.users par FK directe —
 * on utilise donc l'email comme clé de jointure.
 *
 * @returns null si non authentifié ou si aucun profil public ne correspond.
 */
export async function getCurrentDbUser(): Promise<DbUser | null> {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser?.email) return null;

  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("users")
    .select("id, email, name, role, validation_status, phone, city")
    .eq("email", authUser.email)
    .is("deleted_at", null)
    .maybeSingle();

  return (data as DbUser) ?? null;
}

/** Lance une erreur si non authentifié. À utiliser quand l'auth est strictement requise. */
export async function requireDbUser(): Promise<DbUser> {
  const user = await getCurrentDbUser();
  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }
  return user;
}

/** Lance une erreur si non admin. */
export async function requireDbAdmin(): Promise<DbUser> {
  const user = await requireDbUser();
  if (user.role !== "admin" && user.role !== "super_admin") {
    throw new Error("FORBIDDEN");
  }
  return user;
}
