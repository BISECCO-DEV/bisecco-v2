import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/artisan-info?ref=BS-2026-001 (ou ?ref=42)
 *
 * Résout un identifiant pro (client_number OU id numérique) en infos minimales
 * pour affichage public (bandeau "demande ciblée à X").
 */
export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref")?.trim();
  if (!ref) return NextResponse.json({ error: "missing ref" }, { status: 400 });

  const admin = createSupabaseAdminClient();

  const idMaybe = Number(ref);
  const isNumeric = Number.isFinite(idMaybe) && idMaybe > 0;

  const query = admin
    .from("users")
    .select("id, name, client_number, artisan_profiles(company_name)")
    .eq("role", "artisan")
    .is("deleted_at", null)
    .limit(1);

  const { data } = isNumeric
    ? await query.eq("id", idMaybe).maybeSingle()
    : await query.eq("client_number", ref).maybeSingle();

  if (!data) return NextResponse.json({ error: "not found" }, { status: 404 });

  type ProfileRow = { company_name?: string | null };
  const profile = Array.isArray(data.artisan_profiles)
    ? (data.artisan_profiles[0] as ProfileRow | undefined)
    : (data.artisan_profiles as ProfileRow | null);
  const displayName = profile?.company_name?.trim() || data.name;

  return NextResponse.json({
    id: data.id,
    name: displayName,
    client_number: data.client_number,
  });
}
