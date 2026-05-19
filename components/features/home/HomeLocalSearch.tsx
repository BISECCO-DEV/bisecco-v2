import { LocalSearch } from "@/components/features/LocalSearch";
import type { Artisan } from "@/components/features/LocalSearchMap";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Server component qui fetch les artisans réels depuis Supabase
 * et les passe au composant client LocalSearch (avec map + auto-scroll).
 * Seuls les artisans approuvés et actifs sont affichés.
 */
export async function HomeLocalSearch() {
  const supabase = createSupabaseAdminClient();

  type Row = {
    id: number;
    client_number: string | null;
    name: string;
    city: string | null;
    profile_photo: string | null;
    cover_photo: string | null;
    artisan_profiles: Array<{
      id: number;
      company_name: string | null;
      latitude: number | null;
      longitude: number | null;
      metiers: { name: string } | null;
      reviews: Array<{ rating: number }>;
    }>;
  };

  const { data, error } = await supabase
    .from("users")
    .select(`
      id, client_number, name, city, profile_photo, cover_photo,
      artisan_profiles!inner (
        id, company_name, latitude, longitude,
        metiers (name),
        reviews (rating)
      )
    `)
    .eq("role", "artisan")
    .eq("validation_status", "approved")
    .is("deleted_at", null)
    .eq("artisan_profiles.is_active", true)
    .limit(24);

  // Helper : construit l'URL d'une image stockée côté V1 Laravel sur bisecco.fr
  const imgUrl = (path: string | null): string | undefined => {
    if (!path) return undefined;
    if (path.startsWith("http")) return path;
    // Les photos Laravel sont sur https://bisecco.fr/storage/...
    return `https://bisecco.fr/storage/${path.replace(/^\//, "")}`;
  };

  let artisans: Artisan[] = [];

  if (!error && data) {
    artisans = (data as unknown as Row[])
      .map((u): Artisan | null => {
        const profile = u.artisan_profiles[0];
        if (!profile) return null;

        const reviews = profile.reviews ?? [];
        const avgRating = reviews.length > 0
          ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
          : 4.8; // valeur par défaut esthétique pour les nouveaux

        // Coordonnées par défaut autour de l'Île-de-France si non renseignées
        const lat = profile.latitude ?? (48.85 + (Math.random() - 0.5) * 0.6);
        const lng = profile.longitude ?? (2.55 + (Math.random() - 0.5) * 1.0);

        return {
          id: u.client_number ?? String(u.id),
          name: u.name.split(" - ")[0] ?? u.name,
          company: profile.company_name ?? u.name,
          metier: profile.metiers?.name ?? "Artisan",
          city: u.city?.replace(/^\d+\s*/, "") ?? "France",
          rating: Number(avgRating.toFixed(1)),
          reviews: reviews.length,
          lat,
          lng,
          avatar: imgUrl(u.profile_photo),
          cover: imgUrl(u.cover_photo),
        };
      })
      .filter((a): a is Artisan => a !== null);
  }

  return <LocalSearch artisans={artisans} />;
}
