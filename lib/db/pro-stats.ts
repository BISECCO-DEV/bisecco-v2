import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// ─────────────────────────────────────────────────────────────────────────────
// Stats détaillées pour le dashboard PERSO d'un professionnel.
// Utilisées sur /mon-profil/stats (pros uniquement).
// ─────────────────────────────────────────────────────────────────────────────

export type DailyPoint = {
  date: string;   // ISO yyyy-mm-dd
  label: string;  // ex: "L 16"
  count: number;
};

const DAY_LETTERS = ["D", "L", "M", "M", "J", "V", "S"];

function buildDayBuckets(days: number): { date: string; label: string }[] {
  const now = new Date();
  const buckets: { date: string; label: string }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    d.setHours(0, 0, 0, 0);
    buckets.push({
      date: d.toISOString().slice(0, 10),
      label: `${DAY_LETTERS[d.getDay()]} ${d.getDate()}`,
    });
  }
  return buckets;
}

/** Vues du profil agrégées par jour sur N derniers jours (default 30). */
export async function fetchProDailyViews(userId: number, days = 30): Promise<{
  points: DailyPoint[];
  total: number;
  totalPrev: number; // période précédente (même durée juste avant) pour delta
}> {
  const admin = createSupabaseAdminClient();
  const now = new Date();
  const sinceMs = now.getTime() - days * 86400000;
  const since = new Date(sinceMs);
  since.setHours(0, 0, 0, 0);
  const sincePrev = new Date(sinceMs - days * 86400000);
  sincePrev.setHours(0, 0, 0, 0);

  const [curRes, prevRes] = await Promise.all([
    admin.from("profile_views")
      .select("viewed_at")
      .eq("profile_user_id", userId)
      .gte("viewed_at", since.toISOString()),
    admin.from("profile_views")
      .select("viewed_at", { count: "exact", head: true })
      .eq("profile_user_id", userId)
      .gte("viewed_at", sincePrev.toISOString())
      .lt("viewed_at", since.toISOString()),
  ]);

  const buckets = buildDayBuckets(days);
  const byDate = new Map(buckets.map((b) => [b.date, { ...b, count: 0 } as DailyPoint]));

  for (const row of (curRes.data ?? []) as { viewed_at: string }[]) {
    const day = (row.viewed_at ?? "").slice(0, 10);
    const point = byDate.get(day);
    if (point) point.count++;
  }

  const points = Array.from(byDate.values());
  const total = points.reduce((acc, p) => acc + p.count, 0);
  const totalPrev = prevRes.count ?? 0;

  return { points, total, totalPrev };
}

/** Conversion : vues → contacts (chat) → devis sur N jours (default 30). */
export type ConversionFunnel = {
  views: number;
  contacts: number; // threads initiés sur cette période
  quotes: number;   // devis reçus
  viewToContact: number;  // pct
  contactToQuote: number; // pct
};

export async function fetchProConversionFunnel(userId: number, days = 30): Promise<ConversionFunnel> {
  const admin = createSupabaseAdminClient();
  const sinceIso = new Date(Date.now() - days * 86400000).toISOString();

  const [viewsRes, contactsRes, quotesRes] = await Promise.all([
    admin.from("profile_views")
      .select("id", { count: "exact", head: true })
      .eq("profile_user_id", userId)
      .gte("viewed_at", sinceIso),
    admin.from("message_threads")
      .select("id", { count: "exact", head: true })
      .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
      .gte("created_at", sinceIso),
    admin.from("quote_requests")
      .select("id", { count: "exact", head: true })
      .eq("artisan_id", userId)
      .gte("created_at", sinceIso),
  ]);

  const views = viewsRes.count ?? 0;
  const contacts = contactsRes.count ?? 0;
  const quotes = quotesRes.count ?? 0;

  return {
    views,
    contacts,
    quotes,
    viewToContact: views > 0 ? Math.round((contacts / views) * 1000) / 10 : 0,
    contactToQuote: contacts > 0 ? Math.round((quotes / contacts) * 1000) / 10 : 0,
  };
}

/**
 * Classement du pro dans son métier+ville.
 * Méthode : on liste les pros de la même catégorie+ville, on les classe
 * par nombre de vues sur les 30 derniers jours.
 */
export type RankInfo = {
  rank: number | null;          // null si pas classable
  total: number;                // nombre de concurrents directs
  metierName: string | null;
  city: string | null;
  viewsThisMonth: number;
};

export async function fetchProRanking(userId: number): Promise<RankInfo> {
  const admin = createSupabaseAdminClient();

  // Récupère le métier principal + ville du user
  const { data: userRow } = await admin
    .from("users")
    .select("city")
    .eq("id", userId)
    .maybeSingle();

  const city = (userRow?.city as string | null) ?? null;
  if (!city) return { rank: null, total: 0, metierName: null, city: null, viewsThisMonth: 0 };

  // Métier principal via artisan_profiles
  const { data: profile } = await admin
    .from("artisan_profiles")
    .select("metier_id, metiers(name)")
    .eq("user_id", userId)
    .maybeSingle();

  const metierId = (profile?.metier_id as number | undefined) ?? null;
  const metierName = profile?.metiers
    ? (Array.isArray(profile.metiers)
        ? (profile.metiers[0] as { name: string } | undefined)?.name
        : (profile.metiers as { name: string }).name)
    : null;

  if (!metierId) {
    return { rank: null, total: 0, metierName: null, city, viewsThisMonth: 0 };
  }

  // Liste des concurrents : même métier + même ville + approuvés
  const { data: peers } = await admin
    .from("artisan_profiles")
    .select("user_id, users!inner(city, validation_status)")
    .eq("metier_id", metierId);

  type PeerRow = {
    user_id: number;
    users: { city: string | null; validation_status: string } | { city: string | null; validation_status: string }[];
  };

  const peerIds = ((peers ?? []) as PeerRow[])
    .map((p) => {
      const u = Array.isArray(p.users) ? p.users[0] : p.users;
      return u && u.validation_status === "approved" && u.city === city ? p.user_id : null;
    })
    .filter((id): id is number => id !== null);

  if (peerIds.length === 0) {
    return { rank: null, total: 0, metierName: metierName ?? null, city, viewsThisMonth: 0 };
  }

  // Vues sur 30 jours pour tous les concurrents
  const sinceIso = new Date(Date.now() - 30 * 86400000).toISOString();
  const { data: viewsRows } = await admin
    .from("profile_views")
    .select("profile_user_id")
    .in("profile_user_id", peerIds)
    .gte("viewed_at", sinceIso);

  const viewsByUser = new Map<number, number>();
  for (const id of peerIds) viewsByUser.set(id, 0);
  for (const row of (viewsRows ?? []) as { profile_user_id: number }[]) {
    viewsByUser.set(row.profile_user_id, (viewsByUser.get(row.profile_user_id) ?? 0) + 1);
  }

  const ranked = Array.from(viewsByUser.entries())
    .sort((a, b) => b[1] - a[1]); // desc par vues

  const rank = ranked.findIndex(([id]) => id === userId) + 1;
  const viewsThisMonth = viewsByUser.get(userId) ?? 0;

  return {
    rank: rank > 0 ? rank : null,
    total: ranked.length,
    metierName: metierName ?? null,
    city,
    viewsThisMonth,
  };
}

/** Compteurs sociaux : abonnés, favoris, partages des avant/après. */
export type SocialCounts = {
  followers: number;
  favoritedBy: number;
  portfolioPairs: number;
  galleryPhotos: number;
};

export async function fetchProSocialCounts(userId: number): Promise<SocialCounts> {
  const admin = createSupabaseAdminClient();

  const [followersRes, favoritedRes, portfolioRes, galleryRes] = await Promise.all([
    admin.from("user_follows")
      .select("id", { count: "exact", head: true })
      .eq("followed_id", userId),
    admin.from("favorites")
      .select("id", { count: "exact", head: true })
      .eq("artisan_id", userId),
    admin.from("portfolio_before_after")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    admin.from("gallery_images")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
  ]);

  return {
    followers: followersRes.count ?? 0,
    favoritedBy: favoritedRes.count ?? 0,
    portfolioPairs: portfolioRes.count ?? 0,
    galleryPhotos: galleryRes.count ?? 0,
  };
}
