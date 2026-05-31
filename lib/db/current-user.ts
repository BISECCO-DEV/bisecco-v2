import { redirect } from "next/navigation";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type CurrentUser = {
  // Auth Supabase
  auth_id: string;
  email: string;
  email_verified: boolean;
  // Profil public.users
  id: number | null;
  client_number: string | null;
  referral_code: string | null;
  /** Nom du gérant (personne physique) · usage administratif / paramètres. */
  name: string;
  /** Nom commercial (entreprise) si artisan, sinon name. À utiliser pour tout affichage public. */
  display_name: string;
  /** Nom de l'entreprise (artisan uniquement). */
  company_name: string | null;
  role: "admin" | "artisan" | "particulier";
  phone: string | null;
  city: string | null;
  description: string | null;
  profile_photo: string | null;
  cover_photo: string | null;
  siren: string | null;
  validation_status: "pending" | "approved" | "rejected" | null;
};

/**
 * Récupère l'utilisateur Supabase Auth + sa ligne public.users.
 * Retourne null si non connecté.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  // On utilise le client admin pour lire la ligne public.users de l'utilisateur,
  // car RLS bloque la lecture des admins/particuliers depuis le client anon.
  // C'est safe : c'est le user authentifié qui lit SON propre profil.
  const admin = createSupabaseAdminClient();
  const { data: profile } = await admin
    .from("users")
    .select(
      "id, client_number, referral_code, name, role, phone, city, description, profile_photo, cover_photo, siren, validation_status",
    )
    .ilike("email", authUser.email!)
    .is("deleted_at", null)
    .maybeSingle();

  // Si artisan → on récupère le nom commercial dans artisan_profiles
  let company_name: string | null = null;
  if (profile?.id && profile.role === "artisan") {
    const { data: artisan } = await admin
      .from("artisan_profiles")
      .select("company_name")
      .eq("user_id", profile.id)
      .maybeSingle();
    company_name = (artisan?.company_name as string | null)?.trim() || null;
  }

  const name = profile?.name ?? (authUser.user_metadata?.full_name as string) ?? authUser.email ?? "Utilisateur";
  const role = (profile?.role as CurrentUser["role"]) ?? (authUser.user_metadata?.role as CurrentUser["role"]) ?? "particulier";
  const display_name = role === "artisan" && company_name ? company_name : name;

  return {
    auth_id: authUser.id,
    email: authUser.email ?? "",
    email_verified: Boolean(authUser.email_confirmed_at),
    id: profile?.id ?? null,
    client_number: profile?.client_number ?? null,
    referral_code: profile?.referral_code ?? null,
    name,
    display_name,
    company_name,
    role,
    phone: profile?.phone ?? null,
    city: profile?.city ?? null,
    description: profile?.description ?? null,
    profile_photo: profile?.profile_photo ?? null,
    cover_photo: profile?.cover_photo ?? null,
    siren: profile?.siren ?? null,
    validation_status: profile?.validation_status ?? null,
  };
}

/**
 * Garde de route : retourne le user ou redirige vers /connexion.
 */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?redirect=/mon-profil");
  return user!;
}

/**
 * Garde de route admin : retourne le user si role=admin, sinon redirige.
 */
export async function requireAdmin(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?redirect=/admin");
  if (user!.role !== "admin") redirect("/forbidden");
  return user!;
}
