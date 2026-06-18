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
  street_address: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  profile_photo: string | null;
  cover_photo: string | null;
  siren: string | null;
  validation_status: "pending" | "approved" | "rejected" | null;
  /** Pros : accepte d'être contacté par email (défaut true). */
  contact_via_email: boolean;
  /** Pros : accepte d'être contacté par téléphone (défaut false, requiert un numéro). */
  contact_via_phone: boolean;
  /** Pros : email PUBLIC affiché sur le profil (si différent de l'email du compte). */
  public_contact_email: string | null;
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

  // SELECT défensif : on tente avec les nouvelles colonnes (latitude, longitude,
  // street_address). Si la migration 024 n'a pas tourné → fallback sur SELECT
  // historique. Évite le crash 500 du site entier en cas d'oubli de migration.
  let profile: Record<string, unknown> | null = null;
  {
    const { data, error } = await admin
      .from("users")
      .select(
        "id, client_number, referral_code, name, role, phone, city, street_address, latitude, longitude, description, profile_photo, cover_photo, siren, validation_status, contact_via_email, contact_via_phone, public_contact_email",
      )
      .ilike("email", authUser.email!)
      .is("deleted_at", null)
      .maybeSingle();
    if (!error) {
      profile = data as Record<string, unknown> | null;
    } else {
      // Colonnes lat/lng/street_address manquantes → on retombe sur l'ancien SELECT
      const { data: legacy } = await admin
        .from("users")
        .select(
          "id, client_number, referral_code, name, role, phone, city, description, profile_photo, cover_photo, siren, validation_status",
        )
        .ilike("email", authUser.email!)
        .is("deleted_at", null)
        .maybeSingle();
      profile = legacy as Record<string, unknown> | null;
    }
  }

  // Si artisan → on récupère le nom commercial dans artisan_profiles
  let company_name: string | null = null;
  const profileId = profile?.id as number | undefined;
  const profileRole = profile?.role as string | undefined;
  if (profileId && profileRole === "artisan") {
    const { data: artisan } = await admin
      .from("artisan_profiles")
      .select("company_name")
      .eq("user_id", profileId)
      .maybeSingle();
    company_name = (artisan?.company_name as string | null)?.trim() || null;
  }

  const name = (profile?.name as string | undefined) ?? (authUser.user_metadata?.full_name as string) ?? authUser.email ?? "Utilisateur";
  const role = ((profile?.role as CurrentUser["role"]) ?? (authUser.user_metadata?.role as CurrentUser["role"]) ?? "particulier") as CurrentUser["role"];
  const display_name = role === "artisan" && company_name ? company_name : name;

  return {
    auth_id: authUser.id,
    email: authUser.email ?? "",
    email_verified: Boolean(authUser.email_confirmed_at),
    id: profileId ?? null,
    client_number: (profile?.client_number as string | null) ?? null,
    referral_code: (profile?.referral_code as string | null) ?? null,
    name,
    display_name,
    company_name,
    role,
    phone: (profile?.phone as string | null) ?? null,
    city: (profile?.city as string | null) ?? null,
    street_address: (profile?.street_address as string | null) ?? null,
    latitude: (profile?.latitude as number | null) ?? null,
    longitude: (profile?.longitude as number | null) ?? null,
    description: (profile?.description as string | null) ?? null,
    profile_photo: (profile?.profile_photo as string | null) ?? null,
    cover_photo: (profile?.cover_photo as string | null) ?? null,
    siren: (profile?.siren as string | null) ?? null,
    validation_status: (profile?.validation_status as CurrentUser["validation_status"]) ?? null,
    contact_via_email: profile?.contact_via_email === false ? false : true,
    contact_via_phone: profile?.contact_via_phone === true,
    public_contact_email: (profile?.public_contact_email as string | null) ?? null,
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
