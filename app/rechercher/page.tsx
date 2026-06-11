import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowRight, ShieldCheck, Star, CheckCircle2, Briefcase } from "lucide-react";
import { SearchClient, type ArtisanCard, type ParticulierPin } from "./SearchClient";
import { getMetierOptions } from "@/lib/db/metier-options";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { MetiersDirectory, type MetierWithCount } from "@/app/metiers/MetiersDirectory";
import { getCurrentUser } from "@/lib/db/current-user";
import { ParticuliersSection, type ParticulierCard } from "./ParticuliersSection";

async function fetchMetiersWithCounts(): Promise<MetierWithCount[]> {
  const supabase = createSupabaseAdminClient();
  const { data: metiers } = await supabase
    .from("metiers")
    .select("id, name, slug, category, icon, description")
    .order("name", { ascending: true });
  if (!metiers) return [];

  const { data: pivots } = await supabase
    .from("artisan_profile_metier")
    .select("metier_id");

  const counts = new Map<number, number>();
  for (const p of pivots ?? []) {
    counts.set(p.metier_id, (counts.get(p.metier_id) ?? 0) + 1);
  }

  return metiers.map((m) => ({ ...m, artisanCount: counts.get(m.id) ?? 0 }));
}

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

      // Affichage public : on privilégie le nom commercial (entreprise) sur le nom du gérant.
      const commercialName = profile.company_name?.trim() || u.name;
      return {
        id: u.client_number ?? String(u.id),
        name: commercialName.split(" - ")[0] ?? commercialName,
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

async function fetchApprovedParticuliers(limit = 60): Promise<ParticulierCard[]> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("users")
    .select("id, client_number, name, city, profile_photo, created_at")
    .eq("role", "particulier")
    .eq("validation_status", "approved")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map((u) => ({
    id: u.client_number ?? String(u.id),
    name: u.name,
    city: u.city,
    avatar: u.profile_photo,
  }));
}

/** Construit les pins map des particuliers (lat/lng dérivés du hash de la ville). */
function buildParticulierPins(particuliers: ParticulierCard[]): ParticulierPin[] {
  return particuliers
    .filter((p) => p.city)
    .map((p) => {
      const seed = hashCity(p.city ?? p.name);
      // Scatter autour de l'IDF · même heuristique que les artisans sans coords
      const lat = 48.85 + ((seed % 100) / 100 - 0.5) * 0.6;
      const lng = 2.55 + (((seed >> 8) % 100) / 100 - 0.5) * 1.0;
      return {
        id: p.id,
        name: p.name,
        city: p.city ?? "France",
        lat,
        lng,
        avatar: p.avatar ?? undefined,
      };
    });
}

export default async function RechercherPage({ searchParams }: { searchParams: SearchParams }) {
  const { intent } = await searchParams;
  const isCvIntent = intent === "cv";

  const [metierOptions, artisans, metiersWithCounts, currentUser, particuliers] = await Promise.all([
    getMetierOptions(),
    fetchAllApprovedArtisans(),
    fetchMetiersWithCounts(),
    getCurrentUser(),
    fetchApprovedParticuliers(60),
  ]);

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

        <SearchClient
          artisans={artisans}
          particuliers={currentUser ? buildParticulierPins(particuliers) : []}
          metierOptions={metierOptions}
        />

        {/* Section particuliers (auth requise pour respect RGPD) */}
        <ParticuliersSection
          particuliers={particuliers}
          isLoggedIn={!!currentUser}
        />

        {/* ─────── Sections SEO/conversion · inspirées des pages métier ─────── */}

        {/* Trust signals */}
        <section className="grid md:grid-cols-3 gap-4 mt-14">
          {[
            { icon: ShieldCheck, title: "SIREN vérifié",     text: "Chaque artisan est contrôlé via l'API officielle gouv.fr.",     color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200" },
            { icon: Star,        title: "Avis authentiques", text: "Seuls les clients réels peuvent laisser un avis après mission.", color: "text-amber-500",   bg: "bg-amber-50",   border: "border-amber-200" },
            { icon: CheckCircle2,title: "Devis gratuit",     text: "Recevez plusieurs propositions en 24h, sans engagement.",         color: "text-brand-500",   bg: "bg-brand-50",   border: "border-brand-200" },
          ].map((c) => (
            <div key={c.title} className={`p-6 rounded-2xl bg-white border ${c.border}`}>
              <div className={`w-11 h-11 rounded-xl ${c.bg} ${c.color} flex items-center justify-center mb-3`}>
                <c.icon size={20} />
              </div>
              <h3 className="font-bold text-ink-700">{c.title}</h3>
              <p className="text-sm text-ink-500 mt-1 leading-relaxed">{c.text}</p>
            </div>
          ))}
        </section>

        {/* Comment ça marche */}
        <section className="mt-14">
          <h2 className="text-2xl md:text-3xl font-bold text-ink-700 tracking-tight mb-2">
            Comment <span className="text-brand-500">trouver le bon artisan</span> ?
          </h2>
          <p className="text-ink-500 mb-8 max-w-2xl">
            En 3 étapes, identifiez l&apos;artisan vérifié SIREN le plus proche de chez vous.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { num: "1", title: "Filtrez par métier", text: "Plombier, électricien, maçon… Choisissez le métier dont vous avez besoin." },
              { num: "2", title: "Affinez par ville",  text: "Localisez les artisans dans votre commune ou les communes voisines." },
              { num: "3", title: "Contactez en direct", text: "Sans intermédiaire, sans commission. Vous traitez directement avec l'artisan." },
            ].map((s) => (
              <div key={s.num} className="bg-white rounded-2xl p-6 border border-ink-100">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center font-display font-extrabold text-lg shadow-[0_4px_12px_-4px_rgba(240,122,47,0.4)]">
                  {s.num}
                </div>
                <h3 className="font-bold text-ink-700 mt-4">{s.title}</h3>
                <p className="text-sm text-ink-500 mt-1 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Annuaire complet des métiers (même contenu que /metiers) */}
        <section className="mt-14">
          <div className="text-center max-w-2xl mx-auto pb-24 sm:pb-28">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.7rem] font-extrabold tracking-[0.14em] uppercase">
              <Briefcase size={11} strokeWidth={2.8} />
              Annuaire des métiers
            </span>
            <h2 className="mt-4 text-2xl md:text-3xl font-bold text-ink-700 tracking-tight">
              <span className="text-brand-500">{metiersWithCounts.length}</span> métiers artisanaux à portée de clic
            </h2>
            <p className="text-ink-500 mt-2">
              Cherchez parmi tous les métiers Bisecco, filtrez par catégorie, ouvrez la page dédiée pour découvrir les artisans.
            </p>
          </div>
          {/* MetiersDirectory utilise -mt-20 sur sa stats banner pour chevaucher
              une hero · le pb-24 ci-dessus laisse la place qu'il faut pour absorber */}
          <MetiersDirectory metiers={metiersWithCounts} />
        </section>

        {/* CTA artisan · cohérent avec /metiers/[slug] */}
        <section className="mt-14 mb-4 bg-gradient-to-br from-brand-50 to-amber-50/30 rounded-3xl p-10 text-center border border-brand-200/60">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-card mb-4">
            <Briefcase size={24} className="text-brand-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-ink-700 tracking-tight">
            Vous êtes <span className="text-brand-500">artisan</span> ?
          </h2>
          <p className="text-ink-500 mt-2 max-w-md mx-auto">
            Inscrivez-vous gratuitement et recevez des demandes qualifiées dès cette semaine.
          </p>
          <Link href="/inscription" className="btn-primary mt-6 inline-flex">
            Créer mon profil gratuit <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
}
