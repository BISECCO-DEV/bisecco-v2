import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowRight, ShieldCheck, Star, CheckCircle2, Briefcase } from "lucide-react";
import { SearchClient, type ArtisanCard } from "./SearchClient";
import { getMetierOptions } from "@/lib/db/metier-options";
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

export default async function RechercherPage({ searchParams }: { searchParams: SearchParams }) {
  const { intent } = await searchParams;
  const metierOptions = await getMetierOptions();
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

        <SearchClient artisans={artisans} metierOptions={metierOptions} />

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

        {/* Top métiers · vers les pages dédiées */}
        <section className="mt-14">
          <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-ink-700 tracking-tight">
                Explorer par <span className="text-brand-500">métier</span>
              </h2>
              <p className="text-ink-500 mt-1">Découvrez tous les artisans d&apos;un métier précis avec des pages dédiées.</p>
            </div>
            <Link href="/metiers" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:underline">
              Tous les métiers <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              { slug: "plombier",     name: "Plombier",     emoji: "🔧" },
              { slug: "electricien",  name: "Électricien",  emoji: "⚡" },
              { slug: "macon",        name: "Maçon",        emoji: "🧱" },
              { slug: "menuisier",    name: "Menuisier",    emoji: "🪵" },
              { slug: "peintre",      name: "Peintre",      emoji: "🎨" },
              { slug: "couvreur",     name: "Couvreur",     emoji: "🏠" },
              { slug: "chauffagiste", name: "Chauffagiste", emoji: "🔥" },
              { slug: "carreleur",    name: "Carreleur",    emoji: "🔲" },
            ].map((m) => (
              <Link
                key={m.slug}
                href={`/metiers/${m.slug}`}
                className="group flex items-center gap-3 p-4 rounded-xl bg-white border border-ink-100 hover:border-brand-300 hover:-translate-y-0.5 transition"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-xl group-hover:bg-brand-100 transition">
                  {m.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-ink-700 text-sm truncate">{m.name}</div>
                  <div className="text-[0.7rem] text-ink-400">Voir les artisans →</div>
                </div>
              </Link>
            ))}
          </div>
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
