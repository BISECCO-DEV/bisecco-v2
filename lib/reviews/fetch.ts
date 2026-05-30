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
 * Récupère les derniers avis approuvés pour affichage public homepage.
 * Filtre : status = 'approved', is_flagged = false, comment non vide.
 */
export async function fetchPublicReviews(limit = 12): Promise<PublicReview[]> {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("reviews")
    .select(
      `id, rating, comment, created_at,
       users (name),
       artisan_profiles (
         company_name,
         metiers (name),
         users (name, client_number, city)
       )`,
    )
    .eq("status", "approved")
    .eq("is_flagged", false)
    .not("comment", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  type Row = {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    users: { name: string | null } | null;
    artisan_profiles: {
      company_name: string | null;
      metiers: { name: string | null } | null;
      users: { name: string | null; client_number: string | null; city: string | null } | null;
    } | null;
  };

  return (data as unknown as Row[])
    .filter((r) => r.comment && r.comment.trim().length > 0)
    .map((r) => {
      const authorName = r.users?.name ?? "Client vérifié";
      const artisanName =
        r.artisan_profiles?.company_name ?? r.artisan_profiles?.users?.name ?? "Artisan Bisecco";
      return {
        id: r.id,
        rating: r.rating,
        comment: r.comment!,
        created_at: r.created_at,
        author_name: authorName,
        author_initials: getInitials(authorName),
        artisan_name: artisanName,
        artisan_client_number: r.artisan_profiles?.users?.client_number ?? null,
        artisan_metier: r.artisan_profiles?.metiers?.name ?? null,
        artisan_city: r.artisan_profiles?.users?.city ?? null,
      };
    });
}

/** Stats globales avis (pour bandeau confiance). */
export async function fetchReviewsStats(): Promise<{ count: number; avg: number }> {
  const admin = createSupabaseAdminClient();
  // head: true + count: 'exact' → ne télécharge pas les rows, juste le count.
  const { count } = await admin
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .eq("status", "approved")
    .eq("is_flagged", false);

  if (!count || count === 0) return { count: 0, avg: 0 };

  // Pour la moyenne : on récupère les ratings via une vue agrégée si elle existe,
  // sinon fallback sur un échantillon limité (suffisant pour un affichage public).
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
