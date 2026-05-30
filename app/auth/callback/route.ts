import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

// URL publique du site (jamais le hostname interne Phusion Passenger).
const PUBLIC_URL =
  process.env.APP_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://bisecco.fr";

/** Route appelée par Supabase après OAuth ou confirmation email/recovery */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/mon-profil";

  // Implicit flow → token dans le hash fragment côté client (impossible à lire côté serveur).
  // On redirige vers une page client qui lira le hash et fera l'échange.
  if (!code) {
    // Si aucun code en query, c'est probablement un implicit flow (hash#access_token).
    // On renvoie vers /auth/exchange qui gère ça côté client.
    return NextResponse.redirect(`${PUBLIC_URL}/auth/exchange?next=${encodeURIComponent(next)}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${PUBLIC_URL}/connexion?error=auth_callback`);
  }

  // Si le user vient de vérifier son email (next=/email-verifie),
  // on vérifie son validation_status admin. Si pending → on le déconnecte
  // pour qu'il ne puisse pas accéder au reste du site avant validation admin.
  if (next === "/email-verifie") {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      const admin = createSupabaseAdminClient();
      const { data: profile } = await admin
        .from("users")
        .select("validation_status")
        .ilike("email", user.email)
        .is("deleted_at", null)
        .maybeSingle();

      if (profile?.validation_status !== "approved") {
        await supabase.auth.signOut();
        return NextResponse.redirect(`${PUBLIC_URL}/email-verifie?status=pending`);
      }
    }
  }

  return NextResponse.redirect(`${PUBLIC_URL}${next}`);
}
