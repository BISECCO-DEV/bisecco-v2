import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type ProDashboardStats = {
  revenueThisMonth: number;
  revenueLastMonth: number;
  activeProjects: number;
  lateProjects: number;
  tasksToDo: number;
  priorityTasks: number;
  activeClients: number;
  newClientsThisMonth: number;
};

const MS_PER_DAY = 86_400_000;

function startOfMonthIso(d = new Date()): string {
  const x = new Date(d.getFullYear(), d.getMonth(), 1);
  return x.toISOString();
}
function startOfPrevMonthIso(d = new Date()): string {
  const x = new Date(d.getFullYear(), d.getMonth() - 1, 1);
  return x.toISOString();
}

/**
 * Stats globales du tableau de bord pro.
 *  - revenue : somme des total_ttc des devis ACCEPTÉS sur la période
 *  - activeProjects : quote_requests non closed ciblés sur ce pro
 *  - tasksToDo : devis à répondre (status 'new' assignés ou broadcasts éligibles)
 *  - activeClients : clients distincts qui ont contacté ce pro ces 90 derniers jours
 */
export async function fetchProDashboardStats(userId: number): Promise<ProDashboardStats> {
  const admin = createSupabaseAdminClient();
  const now = new Date();
  const sinceCurMonth = startOfMonthIso(now);
  const sincePrevMonth = startOfPrevMonthIso(now);
  const since90 = new Date(now.getTime() - 90 * MS_PER_DAY).toISOString();

  // ─── Revenu : sum total_ttc des devis acceptés ─────────────────────
  const [revCurRes, revPrevRes] = await Promise.all([
    admin
      .from("quote_responses")
      .select("total_ttc")
      .eq("artisan_id", userId)
      .eq("status", "accepted")
      .gte("decided_at", sinceCurMonth),
    admin
      .from("quote_responses")
      .select("total_ttc")
      .eq("artisan_id", userId)
      .eq("status", "accepted")
      .gte("decided_at", sincePrevMonth)
      .lt("decided_at", sinceCurMonth),
  ]);

  const revenueThisMonth = ((revCurRes.data ?? []) as { total_ttc: number }[])
    .reduce((sum, r) => sum + Number(r.total_ttc ?? 0), 0);
  const revenueLastMonth = ((revPrevRes.data ?? []) as { total_ttc: number }[])
    .reduce((sum, r) => sum + Number(r.total_ttc ?? 0), 0);

  // ─── Projets en cours : devis ciblés non closed ────────────────────
  const { data: activeProjectRows } = await admin
    .from("quote_requests")
    .select("id, created_at, urgency, status")
    .eq("artisan_id", userId)
    .neq("status", "closed");
  const activeProjects = activeProjectRows?.length ?? 0;
  const lateProjects = ((activeProjectRows ?? []) as { created_at: string; urgency: string; status: string }[])
    .filter((p) => {
      const age = (Date.now() - new Date(p.created_at).getTime()) / MS_PER_DAY;
      if (p.urgency === "immediate" && age > 2) return true;
      if (p.urgency === "week" && age > 7) return true;
      if (p.urgency === "month" && age > 30) return true;
      return false;
    }).length;

  // ─── Tâches à faire : devis à répondre + nouveaux messages non lus ──
  const [newQuoteRes, threadRes] = await Promise.all([
    admin
      .from("quote_requests")
      .select("id", { count: "exact", head: true })
      .eq("artisan_id", userId)
      .eq("status", "new"),
    admin
      .from("message_threads")
      .select("id, user_a_id, user_b_id, unread_a_count, unread_b_count")
      .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`),
  ]);

  const tasksToDo = (newQuoteRes.count ?? 0);
  const priorityTasks = lateProjects;
  void threadRes;

  // ─── Clients actifs : clients distincts ayant contacté ces 90 derniers jours ─
  const [clientQuoteRes, clientThreadRes] = await Promise.all([
    admin
      .from("quote_requests")
      .select("client_id, created_at")
      .eq("artisan_id", userId)
      .not("client_id", "is", null)
      .gte("created_at", since90),
    admin
      .from("message_threads")
      .select("user_a_id, user_b_id, created_at")
      .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
      .gte("created_at", since90),
  ]);

  const activeClientIds = new Set<number>();
  let newClientsThisMonth = 0;

  for (const row of (clientQuoteRes.data ?? []) as { client_id: number; created_at: string }[]) {
    if (!activeClientIds.has(row.client_id)) {
      activeClientIds.add(row.client_id);
      if (new Date(row.created_at).toISOString() >= sinceCurMonth) newClientsThisMonth++;
    }
  }
  for (const row of (clientThreadRes.data ?? []) as { user_a_id: number; user_b_id: number; created_at: string }[]) {
    const otherId = row.user_a_id === userId ? row.user_b_id : row.user_a_id;
    if (!activeClientIds.has(otherId)) {
      activeClientIds.add(otherId);
      if (new Date(row.created_at).toISOString() >= sinceCurMonth) newClientsThisMonth++;
    }
  }

  return {
    revenueThisMonth: Math.round(revenueThisMonth),
    revenueLastMonth: Math.round(revenueLastMonth),
    activeProjects,
    lateProjects,
    tasksToDo,
    priorityTasks,
    activeClients: activeClientIds.size,
    newClientsThisMonth,
  };
}

/** Chiffre d'affaires par mois sur N derniers mois (defaut 6). */
export async function fetchProRevenueByMonth(userId: number, months = 6): Promise<{ label: string; total: number }[]> {
  const admin = createSupabaseAdminClient();
  const now = new Date();
  const startMonth = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

  const { data } = await admin
    .from("quote_responses")
    .select("total_ttc, decided_at")
    .eq("artisan_id", userId)
    .eq("status", "accepted")
    .gte("decided_at", startMonth.toISOString());

  // Bucketise par mois
  type Bucket = { key: string; label: string; total: number };
  const buckets: Bucket[] = [];
  const MONTH_LABELS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    buckets.push({ key, label: MONTH_LABELS[d.getMonth()]!, total: 0 });
  }
  const byKey = new Map(buckets.map((b) => [b.key, b]));

  for (const row of (data ?? []) as { total_ttc: number; decided_at: string }[]) {
    if (!row.decided_at) continue;
    const d = new Date(row.decided_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const b = byKey.get(key);
    if (b) b.total += Number(row.total_ttc ?? 0);
  }

  return buckets.map(({ label, total }) => ({ label, total: Math.round(total) }));
}

/** Devis récents ciblés sur ce pro (jusqu'à N). */
export async function fetchProRecentQuotes(userId: number, limit = 5) {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("quote_requests")
    .select(`
      id, title, status, urgency, budget_range, city, submitter_name, created_at,
      metier:metier_id(name)
    `)
    .eq("artisan_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  type Row = {
    id: number;
    title: string;
    status: string;
    urgency: string;
    budget_range: string;
    city: string | null;
    submitter_name: string | null;
    created_at: string;
    metier: { name: string | null } | { name: string | null }[] | null;
  };

  return ((data ?? []) as Row[]).map((r) => {
    const m = Array.isArray(r.metier) ? r.metier[0] : r.metier;
    return {
      id: r.id,
      title: r.title,
      status: r.status,
      urgency: r.urgency,
      city: r.city,
      submitterName: r.submitter_name,
      createdAt: r.created_at,
      metierName: m?.name ?? null,
    };
  });
}

/** Activité récente : derniers events (devis reçus, messages, avis). */
export type ActivityItem = {
  id: string;
  type: "quote" | "message" | "review" | "view";
  title: string;
  subtitle: string;
  time: string;
  href: string;
};

export async function fetchProRecentActivity(userId: number, limit = 6): Promise<ActivityItem[]> {
  const admin = createSupabaseAdminClient();
  const sinceIso = new Date(Date.now() - 30 * MS_PER_DAY).toISOString();
  const items: ActivityItem[] = [];

  // Derniers devis reçus
  const { data: quotes } = await admin
    .from("quote_requests")
    .select("id, title, submitter_name, created_at")
    .eq("artisan_id", userId)
    .gte("created_at", sinceIso)
    .order("created_at", { ascending: false })
    .limit(5);
  for (const q of (quotes ?? []) as { id: number; title: string; submitter_name: string | null; created_at: string }[]) {
    items.push({
      id: `q-${q.id}`,
      type: "quote",
      title: `Nouvelle demande de devis`,
      subtitle: `${q.submitter_name ?? "Client"} · ${q.title}`,
      time: q.created_at,
      href: `/mon-profil/devis/${q.id}/reponse`,
    });
  }

  // Derniers messages reçus
  const { data: threads } = await admin
    .from("message_threads")
    .select("id, user_a_id, user_b_id, last_message_at, last_message_preview")
    .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
    .gte("last_message_at", sinceIso)
    .order("last_message_at", { ascending: false })
    .limit(5);
  for (const t of (threads ?? []) as { id: number; user_a_id: number; user_b_id: number; last_message_at: string | null; last_message_preview: string | null }[]) {
    if (!t.last_message_at) continue;
    items.push({
      id: `m-${t.id}`,
      type: "message",
      title: "Nouveau message",
      subtitle: t.last_message_preview?.slice(0, 100) ?? "—",
      time: t.last_message_at,
      href: `/messagerie/${t.id}`,
    });
  }

  items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  return items.slice(0, limit);
}
