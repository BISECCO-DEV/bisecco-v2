import Link from "next/link";
import { MapPin, ShieldCheck, Star, ArrowRight, Sparkles } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { BeforeAfterSlider } from "@/components/features/BeforeAfterSlider";

type ProShowcase = {
  userId: number;
  clientNumber: string | null;
  displayName: string;
  city: string | null;
  metierName: string | null;
  avgRating: number | null;
  reviewCount: number;
  siren: string | null;
  beforeUrl: string;
  afterUrl: string;
  portfolioTitle: string | null;
};

const BUCKET = "user-uploads";

/**
 * Récupère 6 pros qui ont au moins UNE paire avant/après publiée.
 * On prend la paire la plus récente de chacun, et on classe les pros
 * par fraîcheur (dernier portfolio publié).
 */
async function fetchTopPros(): Promise<ProShowcase[]> {
  const admin = createSupabaseAdminClient();

  // Récupère les 30 dernières paires avant/après (pour avoir de la diversité de pros)
  const { data: portfolios } = await admin
    .from("portfolio_before_after")
    .select("id, user_id, before_path, after_path, title, created_at")
    .order("created_at", { ascending: false })
    .limit(30);

  if (!portfolios || portfolios.length === 0) return [];

  // Dedup par user_id : on garde la 1ère paire (la plus récente)
  const seenUsers = new Set<number>();
  const pickedPairs: typeof portfolios = [];
  for (const p of portfolios) {
    if (seenUsers.has(p.user_id)) continue;
    seenUsers.add(p.user_id);
    pickedPairs.push(p);
    if (pickedPairs.length >= 6) break;
  }

  // Récupère les infos users + métier en parallèle
  const userIds = pickedPairs.map((p) => p.user_id);
  const { data: users } = await admin
    .from("users")
    .select("id, client_number, name, city, siren, validation_status, artisan_profiles(company_name, metiers(name))")
    .in("id", userIds)
    .eq("role", "artisan")
    .is("deleted_at", null);

  type UserRow = {
    id: number;
    client_number: string | null;
    name: string;
    city: string | null;
    siren: string | null;
    validation_status: string;
    artisan_profiles?: {
      company_name: string | null;
      metiers?: { name: string } | { name: string }[] | null;
    } | { company_name: string | null; metiers?: unknown }[] | null;
  };

  const usersById = new Map<number, UserRow>();
  for (const u of (users ?? []) as UserRow[]) {
    if (u.validation_status === "approved") usersById.set(u.id, u);
  }

  // Récupère les notes moyennes en agrégé
  const { data: reviewsRaw } = await admin
    .from("reviews")
    .select("artisan_profile_id, rating, artisan_profiles!inner(user_id)")
    .eq("status", "approved")
    .in("artisan_profiles.user_id", userIds);

  type ReviewRow = {
    rating: number;
    artisan_profiles: { user_id: number } | { user_id: number }[];
  };

  const ratingsByUser = new Map<number, { sum: number; count: number }>();
  for (const r of (reviewsRaw ?? []) as ReviewRow[]) {
    const ap = Array.isArray(r.artisan_profiles) ? r.artisan_profiles[0] : r.artisan_profiles;
    if (!ap) continue;
    const userId = ap.user_id;
    const current = ratingsByUser.get(userId) ?? { sum: 0, count: 0 };
    ratingsByUser.set(userId, { sum: current.sum + r.rating, count: current.count + 1 });
  }

  const publicUrl = (path: string) =>
    admin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

  const result: ProShowcase[] = [];
  for (const pair of pickedPairs) {
    const user = usersById.get(pair.user_id);
    if (!user) continue;

    const profile = Array.isArray(user.artisan_profiles)
      ? user.artisan_profiles[0]
      : user.artisan_profiles;

    const metierRaw = profile && "metiers" in (profile as Record<string, unknown>)
      ? (profile as { metiers?: { name: string } | { name: string }[] | null }).metiers
      : null;
    const metier = Array.isArray(metierRaw) ? metierRaw[0] : metierRaw;
    const companyName = (profile as { company_name?: string | null } | null)?.company_name?.trim() || null;

    const ratings = ratingsByUser.get(pair.user_id);

    result.push({
      userId: pair.user_id,
      clientNumber: user.client_number,
      displayName: companyName ?? user.name,
      city: user.city,
      metierName: metier?.name ?? null,
      avgRating: ratings ? Math.round((ratings.sum / ratings.count) * 10) / 10 : null,
      reviewCount: ratings?.count ?? 0,
      siren: user.siren,
      beforeUrl: publicUrl(pair.before_path),
      afterUrl: publicUrl(pair.after_path),
      portfolioTitle: pair.title,
    });
  }

  return result;
}

export async function HomeTopPros() {
  const pros = await fetchTopPros();

  // Pas de pros avec avant/après → on n'affiche rien
  if (pros.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="container-default">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 mb-3">
              <Sparkles size={13} className="text-brand-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                Réalisations vérifiées
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-[-0.025em] text-ink-900">
              Avant / Après · les pros du mois
            </h2>
            <p className="text-ink-500 mt-3 max-w-2xl">
              Glisse le curseur sur chaque réalisation pour voir le résultat. Tous ces pros sont vérifiés SIREN.
            </p>
          </div>
          <Link
            href="/rechercher"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700"
          >
            Voir tous les pros <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pros.map((pro) => {
            const profileHref = pro.clientNumber
              ? `/profil/${pro.clientNumber}`
              : `/profil/${pro.userId}`;
            return (
              <Link
                key={pro.userId}
                href={profileHref}
                className="group block rounded-2xl border border-ink-100 bg-white overflow-hidden hover:border-brand-200 hover:shadow-[0_20px_50px_-25px_rgba(13,30,74,0.25)] transition"
              >
                <BeforeAfterSlider
                  beforeUrl={pro.beforeUrl}
                  afterUrl={pro.afterUrl}
                  alt={pro.portfolioTitle ?? pro.displayName}
                  heightClass="h-60"
                />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-bold text-ink-700 text-base truncate group-hover:text-brand-600 transition">
                        {pro.displayName}
                      </h3>
                      <p className="text-xs text-ink-500 mt-0.5 flex items-center gap-2 flex-wrap">
                        {pro.metierName && (
                          <span className="font-semibold text-brand-600">{pro.metierName}</span>
                        )}
                        {pro.city && (
                          <span className="inline-flex items-center gap-0.5 text-ink-500">
                            <MapPin size={11} /> {pro.city}
                          </span>
                        )}
                      </p>
                    </div>
                    {pro.siren && (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[0.65rem] font-bold flex-shrink-0"
                        title="SIREN vérifié"
                      >
                        <ShieldCheck size={10} /> Vérifié
                      </span>
                    )}
                  </div>

                  {pro.reviewCount > 0 && pro.avgRating !== null && (
                    <div className="mt-3 pt-3 border-t border-ink-100 flex items-center gap-1.5">
                      <Star size={13} fill="#f07a2f" strokeWidth={0} className="text-brand-500" />
                      <span className="text-sm font-bold text-ink-700">{pro.avgRating.toFixed(1)}</span>
                      <span className="text-xs text-ink-400">· {pro.reviewCount} avis</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 md:hidden text-center">
          <Link
            href="/rechercher"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700"
          >
            Voir tous les pros <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
