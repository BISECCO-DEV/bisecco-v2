import { NextResponse } from "next/server";
import { requireDbAdmin } from "@/lib/auth/current-user";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { geocodeBestMatch } from "@/lib/geo/geocode";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Géocodage retroactif : positionne précisément tous les users (artisans +
 * particuliers) qui n'ont pas encore de lat/lng en DB.
 *
 * Pour chaque user :
 *   1. Construit une query "city" (ou "street_address + city" si dispo)
 *   2. Appelle l'API Adresse data.gouv.fr
 *   3. Stocke lat/lng dans users + (si artisan) dans artisan_profiles
 *
 * Param ?force=1 : re-géocode AUSSI les profils qui ont déjà des coords.
 * Utile après amélioration du geocoder (corrige les profils mal positionnés).
 *
 * Sécurité : admin uniquement.
 */
export async function POST(request: Request) {
  try {
    await requireDbAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }

  const url = new URL(request.url);
  const force = url.searchParams.get("force") === "1";

  const supabase = createSupabaseAdminClient();

  // Sélectionne tous les users avec au moins une ville
  const { data: users, error } = await supabase
    .from("users")
    .select("id, role, name, city, latitude, longitude, street_address")
    .is("deleted_at", null)
    .not("city", "is", null);

  if (error || !users) {
    return NextResponse.json({ ok: false, error: error?.message ?? "DB error" }, { status: 500 });
  }

  let geocoded = 0;
  let skipped = 0;
  let failed = 0;
  const failures: Array<{ id: number; name: string; city: string | null; reason: string }> = [];

  for (const u of users) {
    // Skip si déjà géocodé (sauf mode force)
    if (!force && u.latitude != null && u.longitude != null) {
      skipped++;
      continue;
    }
    if (!u.city || u.city.trim() === "") {
      skipped++;
      continue;
    }

    // Construit la query la plus précise possible
    const queryParts = [u.street_address, u.city].filter(Boolean);
    const query = queryParts.join(" ").trim();

    const result = await geocodeBestMatch(query);

    if (!result) {
      failed++;
      failures.push({ id: u.id, name: u.name, city: u.city, reason: "no_match" });
      continue;
    }

    // Update users
    const { error: updErr } = await supabase
      .from("users")
      .update({
        latitude: result.latitude,
        longitude: result.longitude,
      })
      .eq("id", u.id);

    if (updErr) {
      failed++;
      failures.push({ id: u.id, name: u.name, city: u.city, reason: updErr.message });
      continue;
    }

    // Pour les artisans : sync aussi artisan_profiles.latitude/longitude
    // En mode force, on écrase les coords existantes pour corriger les erreurs.
    if (u.role === "artisan") {
      const profileUpdate = supabase
        .from("artisan_profiles")
        .update({ latitude: result.latitude, longitude: result.longitude })
        .eq("user_id", u.id);
      if (force) {
        await profileUpdate;
      } else {
        await profileUpdate.is("latitude", null);
      }
    }

    geocoded++;

    // Petite pause pour respecter l'API Adresse (rate limit officieux ~50/sec)
    await new Promise((r) => setTimeout(r, 50));
  }

  return NextResponse.json({
    ok: true,
    total: users.length,
    geocoded,
    skipped,
    failed,
    failures: failures.slice(0, 50),
  });
}
