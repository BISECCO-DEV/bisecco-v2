import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, Star, MapPin, ArrowRight, Briefcase, Users, Clock, CheckCircle2 } from "lucide-react";
import { fetchMetierBySlug } from "@/lib/db/metiers";
import { fetchArtisansForMetier } from "@/lib/db/artisans";

type Props = { params: Promise<{ slug: string }> };

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = await fetchMetierBySlug(slug);
  if (!m) return { title: "Métier introuvable" };
  return {
    title: `${m.name} — Trouvez un artisan vérifié`,
    description: `Tous les ${m.name.toLowerCase()}s vérifiés sur Bisecco. SIREN contrôlé, avis clients réels, devis gratuit. Trouvez le bon pro près de chez vous.`,
    alternates: { canonical: `/metiers/${slug}` },
  };
}

export default async function MetierPage({ params }: Props) {
  const { slug } = await params;
  const metier = await fetchMetierBySlug(slug);
  if (!metier) notFound();

  // Stats réelles depuis la base
  const artisans = await fetchArtisansForMetier(slug);
  const reviewedArtisans = artisans.filter((a) => a.avg_rating !== null);
  const totalReviews = reviewedArtisans.reduce((sum, a) => sum + a.review_count, 0);
  const avgRating =
    reviewedArtisans.length > 0
      ? reviewedArtisans.reduce((sum, a) => sum + (a.avg_rating ?? 0), 0) / reviewedArtisans.length
      : 0;
  // Villes uniques où des artisans sont présents
  const cities = Array.from(
    new Set(artisans.map((a) => a.city).filter((c): c is string => Boolean(c))),
  );

  // Villes affichées : villes réelles d'artisans inscrits + villes SEO par défaut
  const SEED_CITIES = ["Meaux", "Chelles", "Lagny-sur-Marne", "Melun", "Pontault-Combault", "Noisy-le-Grand", "Bussy-Saint-Georges", "Champs-sur-Marne", "Torcy", "Coulommiers", "Paris", "Versailles"];
  const allCities = Array.from(new Set([...cities, ...SEED_CITIES]));

  return (
    <div className="bg-ink-50 min-h-screen pb-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[300px] rounded-full bg-brand-500/15 blur-[120px] pointer-events-none" />
        <div className="container-default py-16 relative">
          <Link href="/metiers" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white font-semibold">
            ← Tous les métiers
          </Link>
          <div className="grid md:grid-cols-[1fr_auto] items-end gap-6 mt-6">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-[0.65rem] font-bold tracking-[0.14em] uppercase">
                {metier.icon} {metier.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mt-4 tracking-[-0.02em]">
                <span className="text-brand-500">{metier.name}</span> vérifié<br />
                <span className="text-white/55 font-medium text-3xl md:text-4xl">près de chez vous</span>
              </h1>
              <p className="mt-4 text-white/65 max-w-xl leading-relaxed">
                Tous les {metier.name.toLowerCase()}s référencés sur Bisecco ont leur SIREN contrôlé et leurs avis clients vérifiés.
              </p>
            </div>
            <Link href={`/devis?metier=${slug}`} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-500 text-white font-bold shadow-[0_8px_24px_rgba(240,122,47,0.4)] hover:bg-brand-600 transition">
              Demander un devis <ArrowRight size={16} />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10">
            {[
              { label: `${metier.name}s vérifiés`, value: String(artisans.length), icon: ShieldCheck },
              { label: "Note moyenne",            value: avgRating > 0 ? avgRating.toFixed(1) : "—", icon: Star },
              { label: "Avis publiés",            value: String(totalReviews), icon: Users },
              { label: "Devis sous",              value: "24h", icon: Clock },
            ].map((s) => (
              <div key={s.label}>
                <s.icon size={16} className="text-brand-400 mb-2" />
                <div className="text-2xl font-bold tracking-tight">{s.value}</div>
                <div className="text-xs text-white/55 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container-default py-12">
        {/* Pourquoi un X via Bisecco */}
        <section className="grid md:grid-cols-3 gap-4 mb-12">
          {[
            { icon: ShieldCheck, title: "SIREN vérifié",   text: `Chaque ${metier.name.toLowerCase()} est contrôlé via l'API officielle gouv.fr.`, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200" },
            { icon: Star,        title: "Avis authentiques", text: "Seuls les clients réels peuvent laisser un avis après mission.",            color: "text-amber-500",   bg: "bg-amber-50",   border: "border-amber-200" },
            { icon: CheckCircle2, title: "Devis gratuit",   text: "Recevez plusieurs propositions en 24h, sans engagement.",                  color: "text-brand-500",   bg: "bg-brand-50",   border: "border-brand-200" },
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

        {/* Liste villes — SEO levier */}
        <section>
          <h2 className="text-2xl font-bold text-ink-700 mb-2 tracking-tight">
            {metier.name} par ville
          </h2>
          <p className="text-ink-400 mb-6">Trouvez un {metier.name.toLowerCase()} dans votre commune.</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {allCities.map((city: string) => (
              <Link
                key={city}
                href={`/artisans/${slug}/${slugify(city)}`}
                className="group flex items-center gap-3 p-4 rounded-xl bg-white border border-ink-100 hover:border-brand-300 hover:-translate-y-0.5 transition"
              >
                <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center group-hover:bg-brand-100 transition">
                  <MapPin size={15} className="text-brand-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-ink-700 text-sm truncate">{metier.name} {city}</div>
                  <div className="text-[0.72rem] text-ink-400">Voir les artisans →</div>
                </div>
                <ArrowRight size={14} className="text-ink-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition" />
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 bg-gradient-to-br from-brand-50 to-amber-50/30 rounded-3xl p-10 text-center border border-brand-200/60">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-card mb-4">
            <Briefcase size={24} className="text-brand-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-ink-700 tracking-tight">
            Vous êtes <span className="text-brand-500">{metier.name.toLowerCase()}</span> ?
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
