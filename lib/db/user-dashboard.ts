import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type UserStats = {
  profileViews: number;        // vues du profil ce mois
  prevMonthViews: number;      // mois précédent (pour delta %)
  unreadMessages: number;      // messages non lus
  totalQuotes: number;         // devis reçus (artisan) ou envoyés (particulier)
  avgRating: number | null;    // note moyenne (artisan uniquement)
  reviewsCount: number;
};

export type UserActivity = {
  id: string;
  type: "message" | "devis" | "review" | "view";
  title: string;
  time: string;                // ISO
  href: string;
};

function timeAgoFr(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `il y a ${d}j`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

/**
 * Stats user pour /mon-profil.
 * - Artisan : vues profil ce mois, messages non lus, devis reçus, note moyenne
 * - Particulier : vues profil (généralement 0), messages non lus, devis envoyés
 */
export async function fetchUserStats(userId: number, role: string): Promise<UserStats> {
  const admin = createSupabaseAdminClient();

  const now = new Date();
  const monthAgoIso = new Date(now.getTime() - 30 * 86400000).toISOString();
  const twoMonthsAgoIso = new Date(now.getTime() - 60 * 86400000).toISOString();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const count = async (table: string, filter: (q: any) => any): Promise<number> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q: any = admin.from(table).select("*", { count: "exact", head: true });
    q = filter(q);
    const { count: n } = await q;
    return n ?? 0;
  };

  // Vues profil mois courant + mois précédent (pour delta)
  const profileViewsP = count("profile_views", (q) =>
    q.eq("profile_user_id", userId).gte("viewed_at", monthAgoIso),
  );
  const prevMonthViewsP = count("profile_views", (q) =>
    q.eq("profile_user_id", userId).gte("viewed_at", twoMonthsAgoIso).lt("viewed_at", monthAgoIso),
  );

  // Messages non lus
  // Pour les particuliers / artisans : threads où l'user est récepteur et messages non lus
  const { data: threads } = await admin
    .from("message_threads")
    .select("id, user_a_id, user_b_id, unread_a_count, unread_b_count")
    .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`);
  const unreadMessages = (threads ?? []).reduce((sum, t) => {
    const isA = t.user_a_id === userId;
    return sum + (isA ? (t.unread_a_count ?? 0) : (t.unread_b_count ?? 0));
  }, 0);

  // Devis : artisan = reçus, particulier = envoyés
  const totalQuotes = role === "artisan"
    ? await count("quote_requests", (q) => q.eq("artisan_id", userId))
    : await count("quote_requests", (q) => q.eq("client_id", userId));

  // Note moyenne (artisan uniquement)
  let avgRating: number | null = null;
  let reviewsCount = 0;
  if (role === "artisan") {
    const { data: profile } = await admin
      .from("artisan_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    const profileId = (profile?.id as number | undefined) ?? -1;
    const { data: reviews } = await admin
      .from("reviews")
      .select("rating")
      .eq("artisan_profile_id", profileId)
      .eq("status", "approved");
    reviewsCount = reviews?.length ?? 0;
    if (reviewsCount > 0) {
      const sum = (reviews as { rating: number }[]).reduce((s, r) => s + r.rating, 0);
      avgRating = Math.round((sum / reviewsCount) * 10) / 10;
    }
  }

  const [profileViews, prevMonthViews] = await Promise.all([profileViewsP, prevMonthViewsP]);

  return {
    profileViews,
    prevMonthViews,
    unreadMessages,
    totalQuotes,
    avgRating,
    reviewsCount,
  };
}

/**
 * Activité récente du user (max 10 derniers événements).
 * Mix de : messages reçus, devis reçus/envoyés, avis reçus, vues récentes.
 */
export async function fetchUserActivity(userId: number, role: string, limit = 8): Promise<UserActivity[]> {
  const admin = createSupabaseAdminClient();
  const sinceIso = new Date(Date.now() - 30 * 86400000).toISOString();

  const events: UserActivity[] = [];

  // Derniers messages reçus
  const { data: threads } = await admin
    .from("message_threads")
    .select("id, user_a_id, user_b_id, last_message_at, last_message_preview")
    .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
    .gte("last_message_at", sinceIso)
    .order("last_message_at", { ascending: false })
    .limit(5);

  for (const t of threads ?? []) {
    if (!t.last_message_at) continue;
    const otherId = t.user_a_id === userId ? t.user_b_id : t.user_a_id;
    const { data: other } = await admin.from("users").select("name").eq("id", otherId).maybeSingle();
    events.push({
      id: `msg-${t.id}`,
      type: "message",
      title: `Nouveau message de ${other?.name ?? "un utilisateur"}`,
      time: t.last_message_at as string,
      href: `/messagerie/${t.id}`,
    });
  }

  // Devis récents
  if (role === "artisan") {
    const { data: quotes } = await admin
      .from("quote_requests")
      .select("id, title, created_at")
      .eq("artisan_id", userId)
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: false })
      .limit(5);
    for (const q of quotes ?? []) {
      events.push({
        id: `quote-${q.id}`,
        type: "devis",
        title: `Nouvelle demande de devis · ${q.title ?? "Sans titre"}`,
        time: q.created_at as string,
        href: "/mon-profil/devis",
      });
    }
  } else {
    const { data: quotes } = await admin
      .from("quote_requests")
      .select("id, title, status, created_at")
      .eq("client_id", userId)
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: false })
      .limit(5);
    for (const q of quotes ?? []) {
      events.push({
        id: `quote-${q.id}`,
        type: "devis",
        title: `Demande envoyée · ${q.title ?? "Sans titre"}`,
        time: q.created_at as string,
        href: "/mon-profil/devis",
      });
    }
  }

  // Avis reçus (artisan)
  if (role === "artisan") {
    const { data: profile } = await admin
      .from("artisan_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    const profileId = (profile?.id as number | undefined) ?? -1;
    const { data: reviews } = await admin
      .from("reviews")
      .select("id, rating, created_at, users:user_id(name)")
      .eq("artisan_profile_id", profileId)
      .eq("status", "approved")
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: false })
      .limit(5);
    for (const r of reviews ?? []) {
      const usrRaw = (r as { users: { name: string } | { name: string }[] | null }).users;
      const reviewer = Array.isArray(usrRaw) ? usrRaw[0]?.name : usrRaw?.name;
      events.push({
        id: `review-${r.id}`,
        type: "review",
        title: `Vous avez reçu un avis ${(r as { rating: number }).rating}★${reviewer ? ` de ${reviewer}` : ""}`,
        time: r.created_at as string,
        href: "/mon-profil/avis",
      });
    }
  }

  // Tri par date desc + cap au limit
  events.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  return events.slice(0, limit).map((e) => ({ ...e, time: timeAgoFr(e.time) }));
}
