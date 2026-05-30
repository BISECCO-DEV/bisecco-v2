import type { Metadata } from "next";
import { FileText, ArrowRight } from "lucide-react";
import { SearchClient, type ArtisanCard } from "./SearchClient";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Rechercher un artisan qualifié",
  description: "Recherchez un artisan qualifié près de chez vous par métier et par ville. Profils vérifiés, avis clients réels.",
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ intent?: string }>;

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

// Petit déterministe (hash léger) pour scatter les artisans sans coordonnées
function hashCity(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

async function fetchAllApprovedArtisans(): Promise<ArtisanCard[]> {
  const supabase = createSupabaseAdminClient();
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
    .order("name");

  if (error || !data) return [];

  const imgUrl = (path: string | null): string | undefined => {
    if (!path) return undefined;
    if (path.startsWith("http")) return path;
    return `https://bisecco.fr/storage/${path.replace(/^\//, "")}`;
  };

  return (data as unknown as Row[])
    .map((u): ArtisanCard | null => {
      const profile = u.artisan_profiles[0];
      if (!profile) return null;
      const reviews = profile.reviews ?? [];
      const avgRating = reviews.length > 0
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 0;

      // Coordonnées : DB d'abord, sinon scatter déterministe autour de l'IDF
      const seed = hashCity(u.city ?? u.name);
      const lat = profile.latitude ?? (48.85 + ((seed % 100) / 100 - 0.5) * 0.6);
      const lng = profile.longitude ?? (2.55 + (((seed >> 8) % 100) / 100 - 0.5) * 1.0);

      return {
        id: u.client_number ?? String(u.id),
        name: u.name.split(" - ")[0] ?? u.name,
        company: profile.company_name ?? null,
        metier: profile.metiers?.name ?? "Artisan",
        city: u.city?.replace(/^\d+\s*/, "") ?? "France",
        rating: Number(avgRating.toFixed(1)),
        reviews: reviews.length,
        avatar: imgUrl(u.profile_photo),
        lat,
        lng,
      };
    })
    .filter((a): a is ArtisanCard => a !== null);
}

export default async function RechercherPage({ searchParams }: { searchParams: SearchParams }) {
  const { intent } = await searchParams;
  const isCvIntent = intent === "cv";

  const artisans = await fetchAllApprovedArtisans();

  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="container-default py-10">
        {isCvIntent ? (
          <>
            {/* Bannière intent CV */}
            <div className="mb-6 bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-2xl p-5 sm:p-6 shadow-[0_10px_30px_-10px_rgba(240,122,47,0.5)] relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0">
                  <FileText size={22} strokeWidth={2.2} />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">Déposer votre CV chez un artisan</h2>
                  <p className="text-white/85 text-sm mt-1 leading-snug">
                    Trouvez l&apos;artisan que vous voulez contacter ci-dessous, puis cliquez sur <strong>« Postuler / Déposer son CV »</strong> directement depuis son profil.
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold bg-white/15 backdrop-blur px-3 py-1.5 rounded-full">
                    <ArrowRight size={12} /> Filtrez par métier et ville pour trouver le bon artisan
                  </div>
                </div>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-ink-700">
              Chez quel artisan souhaitez-vous postuler&nbsp;?
            </h1>
            <p className="text-ink-400 mt-2">
              Cliquez sur un profil pour envoyer votre CV directement.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl md:text-4xl font-bold text-ink-700">
              Trouvez l&apos;artisan parfait
            </h1>
            <p className="text-ink-400 mt-2">
              {artisans.length > 0
                ? `${artisans.length} profil${artisans.length > 1 ? "s" : ""} vérifié${artisans.length > 1 ? "s" : ""} près de chez vous.`
                : "Plus de profils vérifiés près de chez vous."}
            </p>
          </>
        )}

        <SearchClient artisans={artisans} />
      </div>
    </div>
  );
}
