import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type PublicReview = {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  author_name: string;
  author_initials: string;
  artisan_name: string;
  artisan_client_number: string | null;
  artisan_metier: string | null;
  artisan_city: string | null;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "?";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

/**
 * Récupère les derniers avis approuvés pour affichage public.
 *
 * Stratégie BULLETPROOF :
 *  - Pas de nested joins Supabase (souvent buggués / silent fails)
 *  - 5 requêtes séparées : reviews → users (auteurs) → artisan_profiles → users (pros) → metiers
 *  - Merge final en JS
 *  - noStore() pour bypasser tout cache (toujours frais)
 */
export async function fetchPublicReviews(limit = 12): Promise<PublicReview[]> {
  noStore();
  const admin = createSupabaseAdminClient();

  // 1) Avis bruts (filtres minimum)
  const { data: rawReviews, error } = await admin
    .from("reviews")
    .select("id, rating, comment, created_at, user_id, artisan_profile_id")
    .eq("status", "approved")
    .eq("is_flagged", false)
    .not("comment", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.warn("[fetchPublicReviews] reviews query error:", error.message);
    return [];
  }
  if (!rawReviews || rawReviews.length === 0) return [];

  const valid = rawReviews.filter((r) => r.comment && r.comment.trim().length > 0);
  if (valid.length === 0) return [];

  // 2) Auteurs (clients qui ont laissé les avis)
  const authorIds = Array.from(new Set(valid.map((r) => r.user_id).filter((v): v is number => v != null)));
  const authorByIdPromise = authorIds.length === 0
    ? Promise.resolve(new Map<number, { name: string | null }>())
    : admin.from("users").select("id, name").in("id", authorIds).then(({ data }) => {
        return new Map((data ?? []).map((u) => [u.id, { name: u.name }]));
      });

  // 3) Artisan profiles
  const profileIds = Array.from(new Set(valid.map((r) => r.artisan_profile_id).filter((v): v is number => v != null)));
  const profilesPromise = profileIds.length === 0
    ? Promise.resolve([] as Array<{ id: number; user_id: number; company_name: string | null; metier_id: number | null }>)
    : admin
        .from("artisan_profiles")
        .select("id, user_id, company_name, metier_id")
        .in("id", profileIds)
        .then(({ data }) => (data ?? []) as Array<{ id: number; user_id: number; company_name: string | null; metier_id: number | null }>);

  const [authorMap, profiles] = await Promise.all([authorByIdPromise, profilesPromise]);
  const profileMap = new Map(profiles.map((p) => [p.id, p]));

  // 4) Pros (users des artisan profiles)
  const proUserIds = Array.from(new Set(profiles.map((p) => p.user_id).filter((v): v is number => v != null)));
  const prosPromise = proUserIds.length === 0
    ? Promise.resolve(new Map<number, { name: string | null; client_number: string | null; city: string | null }>())
    : admin
        .from("users")
        .select("id, name, client_number, city")
        .in("id", proUserIds)
        .then(({ data }) =>
          new Map((data ?? []).map((u) => [u.id, { name: u.name, client_number: u.client_number, city: u.city }])),
        );

  // 5) Métiers
  const metierIds = Array.from(new Set(profiles.map((p) => p.metier_id).filter((v): v is number => v != null)));
  const metiersPromise = metierIds.length === 0
    ? Promise.resolve(new Map<number, { name: string | null }>())
    : admin
        .from("metiers")
        .select("id, name")
        .in("id", metierIds)
        .then(({ data }) => new Map((data ?? []).map((m) => [m.id, { name: m.name }])));

  const [proMap, metierMap] = await Promise.all([prosPromise, metiersPromise]);

  // 6) Merge final
  return valid.map((r) => {
    const author = r.user_id != null ? authorMap.get(r.user_id) : null;
    const profile = r.artisan_profile_id != null ? profileMap.get(r.artisan_profile_id) : null;
    const pro = profile ? proMap.get(profile.user_id) : null;
    const metier = profile?.metier_id ? metierMap.get(profile.metier_id) : null;

    const authorName = author?.name?.trim() || "Client vérifié";
    const artisanName = profile?.company_name?.trim() || pro?.name?.trim() || "Pro Bisecco";

    return {
      id: r.id,
      rating: r.rating,
      comment: r.comment!.trim(),
      created_at: r.created_at,
      author_name: authorName,
      author_initials: getInitials(authorName),
      artisan_name: artisanName,
      artisan_client_number: pro?.client_number ?? null,
      artisan_metier: metier?.name ?? null,
      artisan_city: pro?.city ?? null,
    };
  });
}

/** Stats globales avis (pour bandeau confiance). */
export async function fetchReviewsStats(): Promise<{ count: number; avg: number }> {
  noStore();
  const admin = createSupabaseAdminClient();
  const { count } = await admin
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .eq("status", "approved")
    .eq("is_flagged", false);

  if (!count || count === 0) return { count: 0, avg: 0 };

  const { data: sample } = await admin
    .from("reviews")
    .select("rating")
    .eq("status", "approved")
    .eq("is_flagged", false)
    .limit(500);

  if (!sample || sample.length === 0) return { count, avg: 0 };

  const sum = sample.reduce((acc, r) => acc + (r.rating ?? 0), 0);
  const avg = Math.round((sum / sample.length) * 10) / 10;
  return { count, avg };
}
