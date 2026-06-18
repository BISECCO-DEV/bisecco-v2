import { LocalSearch } from "@/components/features/LocalSearch";
import type { Artisan, ParticulierPin } from "@/components/features/LocalSearchMap";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentDbUser } from "@/lib/auth/current-user";
import { getMetierOptions } from "@/lib/db/metier-options";
import { coordsForCity } from "@/lib/geo/city-coords";

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
    latitude: number | null;
    longitude: number | null;
    profile_photo: string | null;
    cover_photo: string | null;
    artisan_profiles: Array<{
      id: number;
      company_name: string | null;
      latitude: number | null;
      longitude: number | null;
      metiers: { name: string; cover_url?: string | null } | null;
      reviews: Array<{ rating: number }>;
    }>;
  };

  // SELECT défensif : si la migration 024 (lat/lng/street_address) n'a pas tourné,
  // on retombe sur le SELECT historique pour ne pas crasher la home.
  let data: Row[] | null = null;
  let error: { message: string } | null = null;
  {
    const r = await supabase
      .from("users")
      .select(`
        id, client_number, name, city, latitude, longitude, profile_photo, cover_photo,
        artisan_profiles!inner (
          id, company_name, latitude, longitude,
          metiers (name, cover_url),
          reviews (rating)
        )
      `)
      .eq("role", "artisan")
      .eq("validation_status", "approved")
      .is("deleted_at", null)
      .eq("artisan_profiles.is_active", true)
      .limit(60);
    if (r.error) {
      // Fallback sans lat/lng users + sans cover_url metiers
      const r2 = await supabase
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
        .limit(60);
      data = r2.data as unknown as Row[] | null;
      error = r2.error;
    } else {
      data = r.data as unknown as Row[];
    }
  }

  // Helper : construit l'URL d'une image stockée côté V1 Laravel sur bisecco.fr
  const imgUrl = (path: string | null): string | undefined => {
    if (!path) return undefined;
    if (path.startsWith("http")) return path;
    // Les photos Laravel sont sur https://bisecco.fr/storage/...
    return `https://bisecco.fr/storage/${path.replace(/^\//, "")}`;
  };

  let artisans: Artisan[] = [];

  if (!error && data) {
    artisans = data
      .map((u): Artisan | null => {
        const profile = u.artisan_profiles[0];
        if (!profile) return null;

        const reviews = profile.reviews ?? [];
        const avgRating = reviews.length > 0
          ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
          : 4.8; // valeur par défaut esthétique pour les nouveaux

        // Cascade de priorité pour les coordonnées :
        // 1. users.latitude/longitude (geocodage exact via API Adresse data.gouv.fr)
        // 2. artisan_profiles.latitude/longitude (legacy / set par admin)
        // 3. Lookup ville dans CITY_COORDS (fallback ~10km de précision)
        // 4. Sinon : skip l'artisan
        const cityCoords = coordsForCity(u.city);
        const lat = u.latitude ?? profile.latitude ?? cityCoords?.[0] ?? null;
        const lng = u.longitude ?? profile.longitude ?? cityCoords?.[1] ?? null;
        if (lat == null || lng == null) return null;

        // Cover : 1. photo perso uploadée 2. cover du métier principal (Pixabay)
        const personalCover = imgUrl(u.cover_photo);
        const metierCover = profile.metiers?.cover_url ?? undefined;
        return {
          id: u.client_number ?? String(u.id),
          user_id: u.id,
          name: u.name.split(" - ")[0] ?? u.name,
          company: profile.company_name ?? u.name,
          metier: profile.metiers?.name ?? "Professionnel",
          city: u.city?.replace(/^\d+\s*/, "") ?? "France",
          rating: Number(avgRating.toFixed(1)),
          reviews: reviews.length,
          lat,
          lng,
          avatar: imgUrl(u.profile_photo),
          cover: personalCover ?? metierCover,
        };
      })
      .filter((a): a is Artisan => a !== null);
  }

  const [me, metierOptions] = await Promise.all([
    getCurrentDbUser(),
    getMetierOptions(),
  ]);

  // Particuliers : pin bleu géolocalisé par ville, mais on n'expose
  // sur la map QUE le prénom (jamais nom de famille ni ville).
  type PartRow = {
    id: number;
    client_number: string | null;
    name: string;
    city: string | null;
    latitude: number | null;
    longitude: number | null;
    profile_photo: string | null;
  };
  // SELECT défensif aussi pour les particuliers
  let partData: PartRow[] | null = null;
  {
    const r = await supabase
      .from("users")
      .select("id, client_number, name, city, latitude, longitude, profile_photo")
      .eq("role", "particulier")
      .eq("validation_status", "approved")
      .is("deleted_at", null)
      .limit(60);
    if (r.error) {
      const r2 = await supabase
        .from("users")
        .select("id, client_number, name, city, profile_photo")
        .eq("role", "particulier")
        .eq("validation_status", "approved")
        .is("deleted_at", null)
        .limit(60);
      partData = (r2.data ?? []).map((p): PartRow => ({
        id: p.id,
        client_number: p.client_number,
        name: p.name,
        city: p.city,
        latitude: null,
        longitude: null,
        profile_photo: p.profile_photo,
      }));
    } else {
      partData = r.data as PartRow[] | null;
    }
  }

  const particuliers: ParticulierPin[] = (partData as PartRow[] | null ?? [])
    .map((p): ParticulierPin | null => {
      // Priorité : coords exactes API Adresse, sinon fallback ville
      const cityCoords = coordsForCity(p.city);
      const lat = p.latitude ?? cityCoords?.[0] ?? null;
      const lng = p.longitude ?? cityCoords?.[1] ?? null;
      if (lat == null || lng == null) return null;
      const prenom = (p.name?.split(/\s+/)[0] ?? p.name ?? "Membre").trim();
      return {
        id: p.client_number ?? String(p.id),
        prenom,
        lat,
        lng,
        avatar: imgUrl(p.profile_photo),
      };
    })
    .filter((p): p is ParticulierPin => p !== null);

  return (
    <LocalSearch
      artisans={artisans}
      particuliers={particuliers}
      currentUserId={me?.id ?? null}
      metierOptions={metierOptions}
    />
  );
}
