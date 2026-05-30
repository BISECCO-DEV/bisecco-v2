import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// ─────────────────────────────────────────────────────────────────────────────
// Données spécifiques au nouveau Dashboard Admin v2 (panneaux non-couverts
// par admin-stats.ts : breakdown catégories, activité hebdo, tâches admin).
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  batiment:            "Bâtiment & second œuvre",
  facade_equipement:   "Façade & équipement",
  services_techniques: "Services techniques",
  metiers_bouche:      "Métiers de bouche",
  services_proximite:  "Services à la personne",
};

const CATEGORY_COLORS: Record<string, string> = {
  batiment:            "#f07a2f",
  facade_equipement:   "#1d4ed8",
  services_techniques: "#6d28d9",
  metiers_bouche:      "#b45309",
  services_proximite:  "#15803d",
};

export type TopCategoryRow = {
  key: string;
  label: string;
  color: string;
  count: number;
  percent: number;
};

/**
 * Répartition des artisans approuvés par catégorie de métier.
 * Joint artisan_profiles → metiers pour récupérer la catégorie, agrège côté TS.
 */
export async function fetchTopCategories(): Promise<TopCategoryRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("artisan_profiles")
    .select("metier_id, metiers!inner(category)")
    .limit(5000);

  type Row = { metier_id: number; metiers: { category: string } | { category: string }[] };
  const rows = ((data ?? []) as unknown as Row[]);

  const counts = new Map<string, number>();
  for (const row of rows) {
    const m = Array.isArray(row.metiers) ? row.metiers[0] : row.metiers;
    if (!m?.category) continue;
    counts.set(m.category, (counts.get(m.category) ?? 0) + 1);
  }

  const total = Array.from(counts.values()).reduce((sum, n) => sum + n, 0);
  if (total === 0) return [];

  return Array.from(counts.entries())
    .map(([key, count]) => ({
      key,
      label: CATEGORY_LABELS[key] ?? key,
      color: CATEGORY_COLORS[key] ?? "#8a93a0",
      count,
      percent: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

export type WeeklyActivityPoint = {
  date: string;     // ISO yyyy-mm-dd
  label: string;    // ex: "L 16"
  signups: number;
  messages: number;
  views: number;
};

const DAY_LETTERS = ["D", "L", "M", "M", "J", "V", "S"];

/**
 * Activité agrégée des 7 derniers jours (incluant aujourd'hui).
 * Une seule requête par série, agrégation par jour côté TS.
 */
export async function fetchWeeklyActivity(): Promise<{
  points: WeeklyActivityPoint[];
  totals: { signups: number; messages: number; views: number };
  weekOverWeekDelta: number; // pourcentage vs semaine précédente
}> {
  const supabase = createSupabaseAdminClient();
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);
  const fourteenDaysAgo = new Date(now);
  fourteenDaysAgo.setDate(now.getDate() - 13);
  fourteenDaysAgo.setHours(0, 0, 0, 0);

  const sinceIso = sevenDaysAgo.toISOString();
  const since14Iso = fourteenDaysAgo.toISOString();
  const cutoffIso = sevenDaysAgo.toISOString(); // borne entre semaine -2 et semaine actuelle

  const [signupsRes, messagesRes, viewsRes, signupsPrevRes] = await Promise.all([
    supabase.from("users").select("created_at").gte("created_at", sinceIso).is("deleted_at", null),
    supabase.from("chat_messages").select("created_at").gte("created_at", sinceIso),
    supabase.from("profile_views").select("viewed_at").gte("viewed_at", sinceIso),
    supabase.from("users").select("created_at", { count: "exact", head: true })
      .gte("created_at", since14Iso).lt("created_at", cutoffIso).is("deleted_at", null),
  ]);

  // Préparer les 7 buckets
  const points: WeeklyActivityPoint[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const iso = d.toISOString().slice(0, 10);
    const label = `${DAY_LETTERS[d.getDay()]} ${d.getDate()}`;
    points.push({ date: iso, label, signups: 0, messages: 0, views: 0 });
  }
  const byDate = new Map(points.map((p) => [p.date, p]));

  const bump = (iso: string | null | undefined, key: "signups" | "messages" | "views") => {
    if (!iso) return;
    const day = iso.slice(0, 10);
    const point = byDate.get(day);
    if (point) point[key]++;
  };

  for (const row of (signupsRes.data ?? []) as { created_at: string }[]) bump(row.created_at, "signups");
  for (const row of (messagesRes.data ?? []) as { created_at: string }[]) bump(row.created_at, "messages");
  for (const row of (viewsRes.data ?? []) as { viewed_at: string }[]) bump(row.viewed_at, "views");

  const totals = points.reduce(
    (acc, p) => ({ signups: acc.signups + p.signups, messages: acc.messages + p.messages, views: acc.views + p.views }),
    { signups: 0, messages: 0, views: 0 },
  );

  const prevWeekSignups = signupsPrevRes.count ?? 0;
  const weekOverWeekDelta = prevWeekSignups === 0
    ? (totals.signups > 0 ? 100 : 0)
    : Math.round(((totals.signups - prevWeekSignups) / prevWeekSignups) * 100);

  return { points, totals, weekOverWeekDelta };
}

export type AdminTasks = {
  pendingValidations: number;
  openChatConversations: number;
  flaggedReviews: number;
};

/**
 * Compteurs de tâches admin pour le HeroWelcome.
 * - pendingValidations : artisans en attente de validation
 * - openChatConversations : conversations chat ouvertes nécessitant attention humaine
 * - flaggedReviews : avis signalés à modérer
 */
export async function fetchAdminTasks(): Promise<AdminTasks> {
  const supabase = createSupabaseAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const countQuery = async (table: string, filters?: (q: any) => any): Promise<number> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = supabase.from(table).select("*", { count: "exact", head: true });
    if (filters) query = filters(query);
    const { count } = await query;
    return count ?? 0;
  };

  const [pendingValidations, openChatConversations, flaggedReviews] = await Promise.all([
    countQuery("users", (q) =>
      q.eq("role", "artisan").eq("validation_status", "pending").is("deleted_at", null),
    ),
    countQuery("chat_conversations", (q) => q.eq("status", "open")),
    countQuery("reviews", (q) => q.eq("is_flagged", true)),
  ]);

  return { pendingValidations, openChatConversations, flaggedReviews };
}

export type AdminPipelineRow = {
  id: number;
  name: string;
  email: string;
  company: string | null;
  category: string;
  status: { label: string; color: "ok" | "warn" | "info" | "violet" | "ink" };
};

/**
 * Vue pipeline artisans (toutes statuts confondus, les plus récents en haut).
 * Sert au tableau "Suivi des artisans" du dashboard.
 */
export async function fetchArtisanPipeline(limit = 6): Promise<AdminPipelineRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("users")
    .select(`
      id, name, email, validation_status, siren_status, created_at,
      artisan_profiles ( company_name, metiers ( name, category ) )
    `)
    .eq("role", "artisan")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  type Row = {
    id: number;
    name: string;
    email: string;
    validation_status: string;
    siren_status: string | null;
    artisan_profiles?: {
      company_name: string | null;
      metiers?: { name: string; category: string } | { name: string; category: string }[] | null;
    } | { company_name: string | null; metiers?: unknown }[] | null;
  };

  const STATUS_MAP: Record<string, { label: string; color: AdminPipelineRow["status"]["color"] }> = {
    pending:  { label: "Validation profil", color: "warn" },
    approved: { label: "Validé",            color: "ok" },
    rejected: { label: "Rejeté",            color: "ink" },
  };

  return ((data ?? []) as Row[]).map((row) => {
    const profile = Array.isArray(row.artisan_profiles) ? row.artisan_profiles[0] : row.artisan_profiles;
    const metierRaw = profile && "metiers" in profile ? profile.metiers : null;
    const metier = Array.isArray(metierRaw) ? metierRaw[0] : metierRaw;
    const categoryLabel = metier && typeof metier === "object" && "category" in metier && metier.category
      ? CATEGORY_LABELS[metier.category as string] ?? (metier.category as string)
      : "Catégorie ?";
    const metierName = metier && typeof metier === "object" && "name" in metier ? (metier.name as string) : null;
    const category = metierName ? `${categoryLabel} · ${metierName}` : categoryLabel;

    const status = STATUS_MAP[row.validation_status] ?? STATUS_MAP.pending;

    return {
      id: row.id,
      name: row.name,
      email: row.email,
      company: profile?.company_name ?? null,
      category,
      status,
    };
  });
}
