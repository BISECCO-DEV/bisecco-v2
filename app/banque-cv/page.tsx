import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText, Search, MapPin, Briefcase, Calendar, ArrowRight, Filter,
  Lock, KeyRound, Sparkles, GraduationCap,
} from "lucide-react";
import { getCurrentUser } from "@/lib/db/current-user";
import { fetchPublishedCvs } from "@/lib/db/cv";
import { fetchAllMetiers } from "@/lib/db/metiers";

export const metadata: Metadata = {
  title: "Banque de CV — Bisecco Pro",
  description:
    "Trouvez votre prochain employé ou apprenti dans l'artisanat. CVs vérifiés, filtrables par métier et ville.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ metier?: string; ville?: string; q?: string }>;

function timeAgo(iso: string | null): string {
  if (!iso) return "—";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days < 1) return "Aujourd'hui";
  if (days < 7) return `Il y a ${days}j`;
  if (days < 30) return `Il y a ${Math.floor(days / 7)} sem.`;
  return `Il y a ${Math.floor(days / 30)} mois`;
}

export default async function BanqueCVPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await getCurrentUser();
  const isAuthorized = user?.role === "artisan" || user?.role === "admin";

  // ── GATE pour non-pros ──
  if (!isAuthorized) {
    return <GatedBanqueCV />;
  }

  const params = await searchParams;
  const [cvs, metiers] = await Promise.all([
    fetchPublishedCvs({ metierSlug: params.metier, city: params.ville, q: params.q }),
    fetchAllMetiers(),
  ]);

  return (
    <main className="bg-ink-50 min-h-screen pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 text-white py-14 relative overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[500px] h-[300px] rounded-full bg-brand-500/15 blur-[120px] pointer-events-none" />
        <div className="container-default relative">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-[0.7rem] font-extrabold tracking-[0.14em] uppercase">
            <Sparkles size={11} strokeWidth={2.8} />
            Réservé aux pros
          </span>
          <h1 className="mt-5 text-[32px] sm:text-[44px] font-extrabold tracking-[-0.025em] leading-[1.05]">
            <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 bg-clip-text text-transparent">
              Banque de CV
            </span>{" "}
            Bisecco
          </h1>
          <p className="mt-3 text-white/70 max-w-2xl">
            Trouvez votre prochain <strong className="text-white">employé</strong>,{" "}
            <strong className="text-white">apprenti</strong> ou{" "}
            <strong className="text-white">stagiaire</strong> dans l&apos;artisanat. Contact direct, aucun frais.
          </p>
          <p className="mt-2 text-xs text-white/45">
            <Lock size={10} className="inline mb-0.5" /> {cvs.length} CV{cvs.length > 1 ? "s" : ""} visibles uniquement par les artisans/admins authentifiés
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="container-default mt-8">
        <form
          method="GET"
          className="bg-white rounded-2xl border border-ink-100 p-4 shadow-card flex flex-col sm:flex-row gap-3 items-stretch sm:items-end"
        >
          <div className="flex-1">
            <label className="block text-[0.7rem] font-extrabold text-ink-500 uppercase tracking-wider mb-1.5">
              Recherche
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
              <input
                type="text" name="q" defaultValue={params.q ?? ""}
                placeholder="Nom, mot-clé, expérience…"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-ink-200 text-sm focus:border-brand-500 outline-none"
              />
            </div>
          </div>

          <div className="w-full sm:w-56">
            <label className="block text-[0.7rem] font-extrabold text-ink-500 uppercase tracking-wider mb-1.5">
              Métier
            </label>
            <select
              name="metier"
              defaultValue={params.metier ?? ""}
              className="w-full px-3 py-2.5 rounded-xl border border-ink-200 text-sm bg-white focus:border-brand-500 outline-none"
            >
              <option value="">Tous les métiers</option>
              {metiers.map((m) => (
                <option key={m.id} value={m.slug}>{m.icon ? `${m.icon} ` : ""}{m.name}</option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-48">
            <label className="block text-[0.7rem] font-extrabold text-ink-500 uppercase tracking-wider mb-1.5">
              Ville
            </label>
            <input
              type="text" name="ville" defaultValue={params.ville ?? ""}
              placeholder="Meaux, Paris…"
              className="w-full px-3 py-2.5 rounded-xl border border-ink-200 text-sm focus:border-brand-500 outline-none"
            />
          </div>

          <button type="submit" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink-900 text-white font-bold text-sm hover:bg-ink-800 transition">
            <Filter size={14} /> Filtrer
          </button>
        </form>
      </div>

      {/* Liste CVs */}
      <div className="container-default mt-8">
        {cvs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-ink-100 p-12 text-center">
            <FileText size={36} className="text-ink-200 mx-auto mb-3" />
            <h2 className="font-extrabold text-ink-700 text-lg">Aucun CV ne correspond</h2>
            <p className="text-ink-500 text-sm mt-1.5 max-w-md mx-auto">
              {(params.metier || params.ville || params.q)
                ? "Essaie d'élargir les filtres (autre métier, autre ville)."
                : "La banque de CV est encore vide. Les premiers candidats arrivent bientôt."}
            </p>
            {(params.metier || params.ville || params.q) && (
              <Link href="/banque-cv" className="mt-4 inline-block text-sm text-brand-600 font-bold hover:underline">
                Réinitialiser les filtres
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-ink-500">
                <strong className="text-ink-700">{cvs.length}</strong> CV{cvs.length > 1 ? "s" : ""}{" "}
                {params.metier && ` — ${metiers.find((m) => m.slug === params.metier)?.name ?? params.metier}`}
                {params.ville && ` à ${params.ville}`}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cvs.map((cv) => {
                const avatarUrl = cv.profile_photo
                  ? cv.profile_photo.startsWith("http")
                    ? cv.profile_photo
                    : `https://bisecco.fr/storage/${cv.profile_photo}`
                  : `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(cv.name)}`;
                const expCount = cv.cv_data?.experiences?.length ?? 0;
                const compCount = cv.cv_data?.competences?.length ?? 0;
                return (
                  <Link
                    key={cv.id}
                    href={`/cv/${cv.id}`}
                    className="group bg-white rounded-2xl border border-ink-100 p-5 hover:border-brand-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-15px_rgba(13,30,74,0.2)] transition"
                  >
                    <div className="flex items-start gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={avatarUrl}
                        alt=""
                        className="w-14 h-14 rounded-2xl object-cover bg-ink-100 flex-shrink-0 border border-ink-100"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-extrabold text-ink-700 group-hover:text-brand-600 truncate">
                          {cv.name}
                        </div>
                        {cv.cv_title && (
                          <div className="text-xs text-ink-500 mt-0.5 line-clamp-1">{cv.cv_title}</div>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-[0.7rem] flex-wrap">
                          {cv.metier && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-50 border border-brand-200 text-brand-700 font-bold">
                              {cv.metier.icon} {cv.metier.name}
                            </span>
                          )}
                          {cv.cv_search_city && (
                            <span className="inline-flex items-center gap-1 text-ink-500">
                              <MapPin size={10} /> {cv.cv_search_city}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {cv.cv_about && (
                      <p className="mt-3 text-xs text-ink-500 line-clamp-2 leading-relaxed">{cv.cv_about}</p>
                    )}

                    <div className="mt-4 pt-3 border-t border-ink-100 flex items-center justify-between text-[0.66rem]">
                      <div className="flex items-center gap-3 text-ink-400">
                        <span className="inline-flex items-center gap-1 font-semibold">
                          <Briefcase size={9} /> {expCount} exp.
                        </span>
                        <span className="inline-flex items-center gap-1 font-semibold">
                          <GraduationCap size={9} /> {compCount} comp.
                        </span>
                      </div>
                      <span className="text-ink-400">{timeAgo(cv.cv_updated_at)}</span>
                    </div>

                    <span className="mt-3 inline-flex items-center gap-1 text-[0.72rem] text-brand-600 font-bold opacity-0 group-hover:opacity-100 transition">
                      Voir le CV complet <ArrowRight size={11} />
                    </span>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

/* ───────── Gated version pour visiteurs / particuliers ───────── */
function GatedBanqueCV() {
  return (
    <main className="bg-ink-50 min-h-screen">
      <section className="relative bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 text-white overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full bg-brand-500/15 blur-[140px] pointer-events-none" />
        <div className="container-default relative py-24 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-brand-500/15 border border-brand-500/30 mb-6 backdrop-blur-md">
            <KeyRound size={32} className="text-brand-400" strokeWidth={2.2} />
          </div>

          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-[0.72rem] font-extrabold tracking-[0.14em] uppercase">
            <Sparkles size={11} strokeWidth={2.8} />
            Banque de CV Pro
          </span>

          <h1 className="mt-6 text-[32px] sm:text-[44px] leading-[1.05] font-extrabold tracking-[-0.025em]">
            Recrutez des{" "}
            <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 bg-clip-text text-transparent">
              talents artisanaux
            </span>
          </h1>

          <p className="mt-6 text-[1rem] text-white/70 leading-[1.6]">
            La banque de CV Bisecco est <strong className="text-white">réservée aux artisans recruteurs vérifiés SIREN</strong>.
            Inscrivez-vous gratuitement pour accéder à des centaines de candidats prêts à rejoindre votre équipe.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link
              href="/inscription"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-extrabold shadow-[0_10px_30px_-8px_rgba(240,122,47,0.55)] hover:-translate-y-0.5 transition"
            >
              M&apos;inscrire comme artisan <ArrowRight size={16} />
            </Link>
            <Link
              href="/connexion?redirect=/banque-cv"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/[0.08] border border-white/[0.18] text-white font-bold hover:bg-white/[0.14] backdrop-blur-md transition"
            >
              J&apos;ai déjà un compte
            </Link>
          </div>

          <div className="mt-10 grid sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
            {[
              { icon: Sparkles, label: "100 % gratuit" },
              { icon: Briefcase, label: "Filtré par métier" },
              { icon: MapPin, label: "Recherche locale" },
            ].map((b) => (
              <div key={b.label} className="bg-white/[0.06] border border-white/[0.10] rounded-2xl p-4 text-center">
                <b.icon size={16} className="text-brand-400 mx-auto mb-2" />
                <div className="text-sm font-bold text-white">{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bloc pour particuliers : publier son CV */}
      <section className="py-14 bg-white border-t border-ink-100">
        <div className="container-default max-w-3xl text-center">
          <Calendar size={28} className="text-brand-500 mx-auto mb-3" />
          <h2 className="text-xl font-extrabold text-ink-700">Vous cherchez un emploi ?</h2>
          <p className="mt-2 text-sm text-ink-500 max-w-xl mx-auto">
            Créez votre CV gratuit sur Bisecco et publiez-le dans la banque pour être contacté
            directement par les artisans recruteurs de votre région.
          </p>
          <Link
            href="/mon-profil/cv"
            className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-ink-900 text-white font-bold text-sm hover:bg-ink-800 transition"
          >
            Créer mon CV <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}
