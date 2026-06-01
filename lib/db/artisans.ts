import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";

export type ArtisanCard = {
  id: number;
  client_number: string | null;
  name: string;
  city: string | null;
  description: string | null;
  profile_photo: string | null;
  cover_photo: string | null;
  siren: string | null;
  // Profil enrichi
  company_name: string | null;
  availability: string | null;
  latitude: number | null;
  longitude: number | null;
  // Métiers (depuis la jointure)
  metiers: { id: number; name: string; slug: string; icon: string | null }[];
  // Stats agrégées
  avg_rating: number | null;
  review_count: number;
};

type ArtisanWithRelations = {
  id: number;
  client_number: string | null;
  name: string;
  city: string | null;
  description: string | null;
  profile_photo: string | null;
  cover_photo: string | null;
  siren: string | null;
  artisan_profiles: Array<{
    id: number;
    company_name: string | null;
    availability: string | null;
    latitude: number | null;
    longitude: number | null;
    artisan_profile_metier: Array<{
      metiers: { id: number; name: string; slug: string; icon: string | null } | null;
    }>;
    reviews: Array<{ rating: number; status: string | null; is_flagged: boolean | null }>;
  }>;
};

function normalizeCity(city: string | null): string {
  if (!city) return "";
  return city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-");
}

function flattenArtisan(u: ArtisanWithRelations): ArtisanCard {
  const profile = u.artisan_profiles?.[0];
  // Seuls les avis approuvés (et non signalés) comptent pour la moyenne publique.
  const reviews = (profile?.reviews ?? []).filter(
    (r) => r.status === "approved" && !r.is_flagged,
  );
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null;

  const metiers =
    profile?.artisan_profile_metier
      ?.map((pm) => pm.metiers)
      .filter((m): m is NonNullable<typeof m> => Boolean(m)) ?? [];

  return {
    id: u.id,
    client_number: u.client_number,
    name: u.name,
    city: u.city,
    description: u.description,
    profile_photo: u.profile_photo,
    cover_photo: u.cover_photo,
    siren: u.siren,
    company_name: profile?.company_name ?? null,
    availability: profile?.availability ?? null,
    latitude: profile?.latitude ?? null,
    longitude: profile?.longitude ?? null,
    metiers,
    avg_rating: avgRating,
    review_count: reviews.length,
  };
}

const ARTISAN_SELECT = `
  id, client_number, name, city, description, profile_photo, cover_photo, siren,
  artisan_profiles!inner (
    id, company_name, availability, latitude, longitude,
    artisan_profile_metier (
      metiers (id, name, slug, icon)
    ),
    reviews (rating, status, is_flagged)
  )
`;

/**
 * Récupère les artisans pour un métier (par slug) et une ville (par slug).
 */
export async function fetchArtisansForMetierAndCity(
  metierSlug: string,
  villeSlug: string,
  limit = 50,
): Promise<ArtisanCard[]> {
  const supabase = await createSupabaseServerClient();

  // On filtre côté DB par profil actif + role artisan approuvé (RLS gère le reste)
  const { data, error } = await supabase
    .from("users")
    .select(ARTISAN_SELECT)
    .eq("artisan_profiles.is_active", true)
    .limit(limit);

  if (error) {
    console.error("[fetchArtisansForMetierAndCity]", error);
    return [];
  }

  const all = (data ?? []).map((u) => flattenArtisan(u as unknown as ArtisanWithRelations));

  // Filtrage local par métier et ville (Supabase ne permet pas de filtrer sur
  // les colonnes joined many-to-many facilement, on le fait côté Node)
  return all.filter((a) => {
    const matchMetier = a.metiers.some((m) => m.slug === metierSlug);
    const matchCity = normalizeCity(a.city).includes(villeSlug.toLowerCase());
    return matchMetier && matchCity;
  });
}

/**
 * Récupère tous les artisans pour un métier (sans filtre ville).
 */
export async function fetchArtisansForMetier(
  metierSlug: string,
  limit = 50,
): Promise<ArtisanCard[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("users")
    .select(ARTISAN_SELECT)
    .eq("artisan_profiles.is_active", true)
    .limit(limit);

  if (error) {
    console.error("[fetchArtisansForMetier]", error);
    return [];
  }

  const all = (data ?? []).map((u) => flattenArtisan(u as unknown as ArtisanWithRelations));
  return all.filter((a) => a.metiers.some((m) => m.slug === metierSlug));
}

/**
 * Récupère un artisan par client_number (pour la page profil publique).
 */
export async function fetchArtisanByClientNumber(
  clientNumber: string,
): Promise<ArtisanCard | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("users")
    .select(ARTISAN_SELECT)
    .eq("client_number", clientNumber)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("[fetchArtisanByClientNumber]", error);
    return null;
  }

  return flattenArtisan(data as unknown as ArtisanWithRelations);
}

export type ArtisanProfileDetail = {
  artisan: ArtisanCard;
  services: { id: number; name: string; price: string | null }[];
  gallery: { id: number; image_path: string; caption: string | null }[];
  reviews: {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    author_name: string;
    author_photo: string | null;
  }[];
};

/**
 * Récupère un artisan + ses services, galerie, avis (pour la page profil).
 */
export async function fetchArtisanProfileDetail(
  clientNumber: string,
): Promise<ArtisanProfileDetail | null> {
  const artisan = await fetchArtisanByClientNumber(clientNumber);
  if (!artisan) return null;

  const supabase = await createSupabaseServerClient();

  // Récupère l'artisan_profile_id principal
  const { data: profileRow } = await supabase
    .from("artisan_profiles")
    .select("id")
    .eq("user_id", artisan.id)
    .eq("is_active", true)
    .maybeSingle();

  const profileId = profileRow?.id;

  const [servicesRes, galleryRes, reviewsRes] = await Promise.all([
    profileId
      ? supabase
          .from("services")
          .select("id, name, price")
          .eq("artisan_profile_id", profileId)
          .order("id")
      : Promise.resolve({ data: [] as { id: number; name: string; price: string | null }[] }),
    supabase
      .from("gallery_images")
      .select("id, image_path, caption")
      .eq("user_id", artisan.id)
      .order("sort_order"),
    profileId
      ? supabase
          .from("reviews")
          .select(
            `id, rating, comment, created_at,
             users (name, profile_photo)`,
          )
          .eq("artisan_profile_id", profileId)
          .eq("status", "approved") // ← affiche uniquement les avis validés par l'admin
          .eq("is_flagged", false)
          .order("created_at", { ascending: false })
          .limit(20)
      : Promise.resolve({ data: [] }),
  ]);

  type ReviewRow = {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    users: { name: string; profile_photo: string | null } | null;
  };

  const reviews = ((reviewsRes.data ?? []) as unknown as ReviewRow[]).map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    created_at: r.created_at,
    author_name: r.users?.name ?? "Anonyme",
    author_photo: r.users?.profile_photo ?? null,
  }));

  // Transformer les image_path en URLs publiques Supabase Storage.
  // Pour rétrocompat : si le path est déjà une URL http(s), on le garde tel quel.
  const galleryRows = (galleryRes.data ?? []) as { id: number; image_path: string; caption: string | null }[];
  const gallery = galleryRows.map((g) => {
    let url = g.image_path;
    if (!url.startsWith("http")) {
      const { data: pub } = supabase.storage.from("user-uploads").getPublicUrl(g.image_path);
      url = pub.publicUrl;
    }
    return { id: g.id, image_path: url, caption: g.caption };
  });

  return {
    artisan,
    services: (servicesRes.data ?? []) as { id: number; name: string; price: string | null }[],
    gallery,
    reviews,
  };
}
