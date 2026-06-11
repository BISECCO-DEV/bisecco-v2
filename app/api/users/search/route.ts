import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentDbUser } from "@/lib/auth/current-user";

/**
 * Recherche d'utilisateurs (artisans + particuliers) par nom ou société.
 *
 * GET /api/users/search?q=jean
 *
 * Auth : utilisateur connecté requis (les visiteurs non-loggés peuvent
 * chercher des artisans via /rechercher mais pas les particuliers).
 *
 * Retourne : { artisans: [...], particuliers: [...] } limité à 10 chacun.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SearchResult = {
  id: number;
  name: string;
  display_name: string;
  client_number: string | null;
  role: "artisan" | "particulier";
  city: string | null;
  profile_photo: string | null;
  metier: string | null;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  if (q.length < 2) {
    return NextResponse.json({ artisans: [], particuliers: [] });
  }

  // Auth check : la recherche de particuliers est réservée aux membres connectés
  const me = await getCurrentDbUser();
  const includeParticuliers = !!me;

  const admin = createSupabaseAdminClient();
  const ilikePattern = `%${q}%`;

  // Recherche artisans (publique) avec leur company_name + name
  const { data: artisansRaw } = await admin
    .from("users")
    .select(`
      id, name, client_number, city, profile_photo,
      artisan_profiles ( company_name, metiers ( name ) )
    `)
    .eq("role", "artisan")
    .eq("validation_status", "approved")
    .is("deleted_at", null)
    .or(`name.ilike.${ilikePattern},client_number.ilike.${ilikePattern}`)
    .limit(10);

  const artisans: SearchResult[] = ((artisansRaw ?? []) as unknown as Array<{
    id: number;
    name: string;
    client_number: string | null;
    city: string | null;
    profile_photo: string | null;
    artisan_profiles?: { company_name: string | null; metiers?: { name: string } | null } | null;
  }>).map((u) => ({
    id: u.id,
    name: u.name,
    display_name: u.artisan_profiles?.company_name?.trim() || u.name,
    client_number: u.client_number,
    role: "artisan",
    city: u.city,
    profile_photo: u.profile_photo,
    metier: u.artisan_profiles?.metiers?.name ?? null,
  }));

  // Recherche particuliers (uniquement si connecté)
  let particuliers: SearchResult[] = [];
  if (includeParticuliers) {
    const { data: partRaw } = await admin
      .from("users")
      .select("id, name, client_number, city, profile_photo")
      .eq("role", "particulier")
      .eq("validation_status", "approved")
      .is("deleted_at", null)
      .ilike("name", ilikePattern)
      .limit(10);

    particuliers = (partRaw ?? []).map((u) => ({
      id: u.id,
      name: u.name,
      display_name: u.name,
      client_number: u.client_number,
      role: "particulier" as const,
      city: u.city,
      profile_photo: u.profile_photo,
      metier: null,
    }));
  }

  return NextResponse.json({ artisans, particuliers });
}
