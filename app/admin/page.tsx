import {
  Users, ShieldCheck, Briefcase, TrendingUp,
} from "lucide-react";
import { fetchAdminStats, fetchRecentSignups } from "@/lib/db/admin-stats";
import {
  fetchTopCategories,
  fetchWeeklyActivity,
  fetchAdminTasks,
  fetchArtisanPipeline,
  fetchParticulierPipeline,
} from "@/lib/db/admin-dashboard";
import { requireAdmin } from "@/lib/db/current-user";
import {
  AdminCard,
  KpiCard,
  HeroWelcome,
  MiniCalendar,
  PipelineTable,
  RecentFeed,
  ActivityChart,
  BreakdownList,
  type FeedItem,
  type PipelineRow,
} from "@/components/admin";

export const dynamic = "force-dynamic";

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60_000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `${min}min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}j`;
}

function todayLabel(): string {
  return new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const AVATAR_VARIANTS: Array<PipelineRow["avatarVariant"]> = ["a", "p", "v", "g"];

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();

  const [stats, recent, pipeline, particulierPipeline, tasks, categories, activity] = await Promise.all([
    fetchAdminStats(),
    fetchRecentSignups(8),
    fetchArtisanPipeline(6),
    fetchParticulierPipeline(6),
    fetchAdminTasks(),
    fetchTopCategories(),
    fetchWeeklyActivity(),
  ]);

  // ─── Mapping pour les composants UI ────────────────────────────────────────
  const recentFeedItems: FeedItem[] = recent.map((r) => ({
    id: r.id,
    name: r.name,
    meta: r.email,
    role: r.role === "artisan" ? "artisan" : "particulier",
    timeAgo: timeAgo(r.created_at),
    href: `/admin/utilisateurs/${r.id}`,
  }));

  const pipelineRows: PipelineRow[] = pipeline.map((p, i) => ({
    id: p.id,
    initial: p.name.charAt(0).toUpperCase(),
    avatarVariant: AVATAR_VARIANTS[i % AVATAR_VARIANTS.length],
    name: p.name,
    subtitle: p.company ?? p.email,
    category: p.category,
    status: p.status,
    href: `/admin/utilisateurs/${p.id}`,
  }));

  const particulierPipelineRows: PipelineRow[] = particulierPipeline.map((p, i) => ({
    id: p.id,
    initial: p.name.charAt(0).toUpperCase(),
    avatarVariant: AVATAR_VARIANTS[i % AVATAR_VARIANTS.length],
    name: p.name,
    subtitle: p.email,
    category: p.category,
    status: p.status,
    href: `/admin/utilisateurs/${p.id}`,
  }));

  const validationRate = stats.total_artisans > 0
    ? Math.round((stats.approved_artisans / stats.total_artisans) * 100)
    : 100;

  // Sparklines : 7 derniers points d'activité (mappés sur 0-40 pour le viewBox SVG)
  const buildSpark = (key: "signups" | "messages" | "views"): number[] => {
    const values = activity.points.map((p) => p[key]);
    const max = Math.max(...values, 1);
    return values.map((v) => Math.round((v / max) * 36));
  };

  // Données brutes pour le chart hebdo (normalisées sur 100 pour le SVG)
  const buildSeries = (key: "signups" | "messages" | "views"): number[] => {
    const values = activity.points.map((p) => p[key]);
    const max = Math.max(...activity.points.flatMap((p) => [p.signups, p.messages, p.views]), 1);
    return values.map((v) => (v / max) * 100);
  };

  return (
    <div className="space-y-4 max-w-[1500px]">
      {/* HERO + Mini calendrier */}
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-4">
        <HeroWelcome
          adminName={admin.name.split(" ")[0]}
          todayLabel={capitalize(todayLabel())}
          summary={
            <>
              Vous avez <strong className="text-white">{tasks.pendingValidations} professionnel{tasks.pendingValidations > 1 ? "s" : ""} à valider</strong>
              {" "}et <strong className="text-white">{activity.totals.signups} nouvelle{activity.totals.signups > 1 ? "s" : ""} inscription{activity.totals.signups > 1 ? "s" : ""}</strong> sur les 7 derniers jours.
              {validationRate >= 80 && " Le taux de validation est excellent."}
            </>
          }
          tasks={[
            {
              count: tasks.pendingValidations,
              label: "À valider",
              done: tasks.pendingValidations === 0,
            },
            {
              count: tasks.openChatConversations,
              label: "Conversations chat ouvertes",
            },
            {
              count: tasks.flaggedReviews,
              label: "Avis signalés à modérer",
            },
          ]}
        />
        <MiniCalendar events={[]} />
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <KpiCard
          label="Utilisateurs"
          value={stats.total_users}
          icon={Users}
          iconColor="blue"
          trend={activity.totals.signups > 0
            ? { direction: "up", value: `+${activity.totals.signups}` }
            : { direction: "neutral", value: "stable" }}
          sub={`${stats.total_artisans} professionnels · ${stats.total_particuliers} part.`}
          spark={buildSpark("signups")}
        />
        <KpiCard
          label="À valider"
          value={tasks.pendingValidations}
          icon={ShieldCheck}
          iconColor="orange"
          trend={tasks.pendingValidations === 0
            ? { direction: "neutral", value: "stable" }
            : { direction: "down", value: `${tasks.pendingValidations}` }}
          sub={`${stats.approved_artisans} approuvés`}
        />
        <KpiCard
          label="Métiers"
          value={stats.total_metiers}
          icon={Briefcase}
          iconColor="warn"
          trend={{ direction: "neutral", value: "référentiel" }}
          sub="dans le référentiel"
        />
        <KpiCard
          label="Taux validation"
          value={`${validationRate}%`}
          icon={TrendingUp}
          iconColor="green"
          trend={validationRate >= 80
            ? { direction: "up", value: "excellent" }
            : { direction: "neutral", value: "à suivre" }}
          sub={`${stats.rejected_artisans} rejetés`}
          spark={buildSpark("views")}
        />
      </div>

      {/* Pipeline artisans + particuliers côte à côte
          Le compteur affiche le TOTAL d'inscrits, pas juste les 6 visibles
          (auto-incrémenté à chaque nouvelle inscription via stats temps réel). */}
      <div className="grid lg:grid-cols-2 gap-3.5">
        <AdminCard
          title="Suivi des professionnels"
          count={stats.total_artisans}
          link={{ href: "/admin/utilisateurs?role=artisan", label: "Voir tout" }}
        >
          <PipelineTable rows={pipelineRows} />
        </AdminCard>

        <AdminCard
          title="Suivi des particuliers"
          count={stats.total_particuliers}
          link={{ href: "/admin/utilisateurs?role=particulier", label: "Voir tout" }}
        >
          <PipelineTable rows={particulierPipelineRows} />
        </AdminCard>
      </div>

      {/* Inscriptions récentes en pleine largeur sous les pipelines */}
      <div className="grid grid-cols-1 gap-3.5">
        <AdminCard
          title="Inscriptions récentes"
          count={recentFeedItems.length}
          link={{ href: "/admin/utilisateurs", label: "Tout voir" }}
        >
          <RecentFeed items={recentFeedItems} />
        </AdminCard>
      </div>

      {/* Activity chart + Breakdown */}
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-3.5">
        <div className="bg-white border border-sand-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <h3 className="font-display font-semibold text-[1.05rem] tracking-tight text-ink-900">Activité hebdomadaire</h3>
              <span className="bg-sand-100 px-2 py-0.5 rounded-full text-[0.72rem] font-semibold text-ink-600 font-mono">7j</span>
            </div>
          </div>
          <ActivityChart
            labels={activity.points.map((p) => p.label)}
            series={[
              { label: "Inscriptions", color: "#f07a2f", values: buildSeries("signups") },
              { label: "Messages",     color: "#1d4ed8", values: buildSeries("messages") },
              { label: "Visites",      color: "#8a93a0", values: buildSeries("views") },
            ]}
            stats={[
              { label: "Inscriptions", value: String(activity.totals.signups), color: "#f07a2f" },
              { label: "Messages",     value: String(activity.totals.messages), color: "#1d4ed8" },
              { label: "Visites",      value: String(activity.totals.views) },
              {
                label: "vs s. -1",
                value: `${activity.weekOverWeekDelta >= 0 ? "+" : ""}${activity.weekOverWeekDelta}%`,
                color: activity.weekOverWeekDelta >= 0 ? "#15803d" : "#b91c1c",
              },
            ]}
          />
        </div>

        <AdminCard
          title="Top catégories"
          count={categories.reduce((sum, c) => sum + c.count, 0)}
          link={{ href: "/admin/metiers/covers", label: "Gérer covers" }}
        >
          <BreakdownList rows={categories} emptyLabel="Aucun professionnel approuvé pour l'instant." />
        </AdminCard>
      </div>
    </div>
  );
}
