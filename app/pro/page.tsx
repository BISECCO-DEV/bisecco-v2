import type { Metadata } from "next";
import Link from "next/link";
import {
  Search, Bell, ArrowUpRight, ArrowDownRight, Euro, FolderKanban,
  ListChecks, Users, FileText, MessageSquare, Star, Eye, Calendar,
  ChevronRight, Sparkles,
} from "lucide-react";
import { requireUser } from "@/lib/db/current-user";
import {
  fetchProDashboardStats,
  fetchProRevenueByMonth,
  fetchProRecentQuotes,
  fetchProRecentActivity,
  type ActivityItem,
} from "@/lib/db/pro-dashboard";
import { RevenueLineChart } from "./RevenueLineChart";

export const metadata: Metadata = {
  title: "Tableau de bord pro",
  robots: { index: false, follow: false },
};

const URGENCY_LABEL: Record<string, string> = {
  immediate: "Urgent",
  week: "Cette semaine",
  month: "Ce mois",
  flexible: "Flexible",
};

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  new:       { label: "À traiter",  color: "bg-amber-50 text-amber-700 border-amber-200" },
  responded: { label: "Répondu",   color: "bg-blue-50 text-blue-700 border-blue-200" },
  closed:    { label: "Terminé",    color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `il y a ${d} j`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export default async function ProDashboardPage() {
  const user = await requireUser();
  if (!user.id) return null;

  const [stats, revenueByMonth, quotes, activity] = await Promise.all([
    fetchProDashboardStats(user.id),
    fetchProRevenueByMonth(user.id, 6),
    fetchProRecentQuotes(user.id, 5),
    fetchProRecentActivity(user.id, 5),
  ]);

  const revenueDelta = stats.revenueLastMonth > 0
    ? Math.round(((stats.revenueThisMonth - stats.revenueLastMonth) / stats.revenueLastMonth) * 100)
    : (stats.revenueThisMonth > 0 ? 100 : 0);

  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  const firstName = user.display_name.split(/\s+/)[0] ?? "Pro";

  return (
    <div className="p-6 lg:p-8 max-w-[1400px]">
      {/* ═══════════ HEADER ═══════════ */}
      <header className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div>
          <p className="text-sm text-ink-500 capitalize">{today}</p>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-ink-900 tracking-tight mt-0.5">
            Bonjour {firstName} <span className="inline-block">👋</span>
          </h1>
          <p className="text-sm text-ink-500 mt-1">
            Voici un aperçu de ton activité aujourd&apos;hui.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Barre de recherche (placeholder pour l'instant) */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-ink-100 w-[280px]">
            <Search size={15} className="text-ink-400" />
            <input
              type="search"
              placeholder="Rechercher…"
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-ink-300"
              disabled
            />
            <kbd className="text-[0.62rem] font-mono text-ink-400 bg-ink-50 px-1.5 py-0.5 rounded">⌘K</kbd>
          </div>
          <Link
            href="/mon-profil/notifications"
            className="relative w-10 h-10 rounded-xl bg-white border border-ink-100 grid place-items-center hover:bg-ink-50 transition"
          >
            <Bell size={16} className="text-ink-600" />
          </Link>
        </div>
      </header>

      {/* ═══════════ 4 STATS CARDS ═══════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Chiffre d'affaires"
          sub="Ce mois-ci"
          value={stats.revenueThisMonth.toLocaleString("fr-FR", { minimumFractionDigits: 0 }) + " €"}
          delta={revenueDelta}
          deltaLabel="par rapport au mois dernier"
          icon={Euro}
          iconBg="bg-emerald-50 text-emerald-600"
          mini={revenueByMonth.map((m) => m.total)}
        />
        <KpiCard
          label="Projets en cours"
          value={String(stats.activeProjects)}
          warning={stats.lateProjects > 0 ? `${stats.lateProjects} en retard` : null}
          icon={FolderKanban}
          iconBg="bg-blue-50 text-blue-600"
        />
        <KpiCard
          label="Tâches à faire"
          value={String(stats.tasksToDo)}
          warning={stats.priorityTasks > 0 ? `${stats.priorityTasks} prioritaires` : null}
          icon={ListChecks}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <KpiCard
          label="Clients actifs"
          value={String(stats.activeClients)}
          good={stats.newClientsThisMonth > 0 ? `+${stats.newClientsThisMonth} ce mois-ci` : null}
          icon={Users}
          iconBg="bg-purple-50 text-purple-600"
        />
      </div>

      {/* ═══════════ AGENDA + CA GRAPHIQUE ═══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[1fr_1.4fr] gap-4 mb-6">
        {/* Agenda du jour · placeholder pour l'instant */}
        <div className="bg-white rounded-2xl border border-ink-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-ink-700 flex items-center gap-2">
              <Calendar size={16} className="text-brand-500" /> Agenda du jour
            </h2>
            <Link href="/pro/agenda" className="text-xs font-bold text-brand-600 hover:underline">
              Voir tout
            </Link>
          </div>
          <div className="text-center py-10 text-sm text-ink-400">
            <Calendar size={28} className="mx-auto mb-3 text-ink-300" />
            <p>Aucun rendez-vous pour aujourd&apos;hui.</p>
            <p className="text-xs mt-1">Le calendrier interactif arrive bientôt.</p>
          </div>
        </div>

        {/* Graphique CA · vraies données */}
        <div className="bg-white rounded-2xl border border-ink-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-ink-700">Chiffre d&apos;affaires</h2>
            <span className="text-xs font-semibold text-ink-500 bg-ink-50 px-2.5 py-1 rounded-lg">
              6 derniers mois
            </span>
          </div>
          <RevenueLineChart points={revenueByMonth} />
        </div>
      </div>

      {/* ═══════════ DEVIS RÉCENTS + ACTIVITÉ ═══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4">
        {/* Devis récents */}
        <div className="bg-white rounded-2xl border border-ink-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-ink-700">Devis récents</h2>
            <Link href="/mon-profil/devis" className="text-xs font-bold text-brand-600 hover:underline">
              Voir tout
            </Link>
          </div>
          {quotes.length === 0 ? (
            <div className="text-center py-10 text-sm text-ink-400">
              <FileText size={28} className="mx-auto mb-3 text-ink-300" />
              <p>Aucun devis pour l&apos;instant.</p>
              <p className="text-xs mt-1">Tes prochaines demandes apparaîtront ici.</p>
            </div>
          ) : (
            <ul className="divide-y divide-ink-100">
              {quotes.map((q) => {
                const status = STATUS_LABEL[q.status] ?? STATUS_LABEL.new;
                return (
                  <li key={q.id}>
                    <Link
                      href={`/mon-profil/devis/${q.id}/reponse`}
                      className="flex items-start gap-3 py-3 hover:bg-ink-50/40 -mx-2 px-2 rounded-lg transition group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-brand-50 grid place-items-center flex-shrink-0">
                        <FileText size={16} className="text-brand-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-ink-700 text-sm truncate">{q.title}</div>
                        <div className="text-xs text-ink-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                          <span>{q.submitterName ?? "Client"}</span>
                          {q.metierName && (<><span className="text-ink-300">·</span><span>{q.metierName}</span></>)}
                          {q.city && (<><span className="text-ink-300">·</span><span>{q.city}</span></>)}
                          <span className="text-ink-300">·</span>
                          <span>{timeAgo(q.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[0.65rem] font-bold uppercase border ${status.color}`}>
                          {status.label}
                        </span>
                        <span className="hidden md:inline-block text-[0.65rem] text-ink-400 font-medium">
                          {URGENCY_LABEL[q.urgency] ?? q.urgency}
                        </span>
                        <ChevronRight size={14} className="text-ink-300 group-hover:text-brand-500 transition" />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Activité récente */}
        <div className="bg-white rounded-2xl border border-ink-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-ink-700">Activité récente</h2>
          </div>
          {activity.length === 0 ? (
            <div className="text-center py-10 text-sm text-ink-400">
              <Sparkles size={28} className="mx-auto mb-3 text-ink-300" />
              <p>Aucune activité pour l&apos;instant.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {activity.map((a) => <ActivityRow key={a.id} item={a} />)}
            </ul>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-ink-300 mt-10">
        « L&apos;organisation est la clé de la réussite. » — Bonne journée à toi !
      </p>
    </div>
  );
}

// =====================================================================
// Sous-composants
// =====================================================================

function KpiCard({
  label, sub, value, delta, deltaLabel, warning, good, icon: Icon, iconBg, mini,
}: {
  label: string;
  sub?: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  warning?: string | null;
  good?: string | null;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconBg: string;
  mini?: number[];
}) {
  const isUp = (delta ?? 0) >= 0;
  return (
    <article className="bg-white rounded-2xl border border-ink-100 p-5 relative overflow-hidden">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-ink-500">{label}</h3>
          {sub && <p className="text-xs text-ink-400 mt-0.5">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl grid place-items-center flex-shrink-0 ${iconBg}`}>
          <Icon size={17} />
        </div>
      </div>

      <div className="mt-3 text-3xl font-bold text-ink-900 tabular-nums leading-tight">
        {value}
      </div>

      {delta !== undefined && (
        <div className={`mt-2 inline-flex items-center gap-1 text-xs font-bold ${isUp ? "text-emerald-600" : "text-red-600"}`}>
          {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {isUp ? "+" : ""}{delta}% <span className="text-ink-400 font-normal">{deltaLabel}</span>
        </div>
      )}
      {warning && (
        <div className="mt-2 text-xs font-bold text-amber-600">
          {warning}
        </div>
      )}
      {good && !warning && delta === undefined && (
        <div className="mt-2 text-xs font-bold text-emerald-600">
          {good}
        </div>
      )}

      {mini && mini.length > 0 && (mini.some((v) => v > 0)) && (
        <div className="absolute right-3 bottom-3 w-24 h-12 pointer-events-none opacity-60">
          <MiniSpark values={mini} />
        </div>
      )}
    </article>
  );
}

function MiniSpark({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  const w = 100, h = 40;
  const step = w / Math.max(values.length - 1, 1);
  const points = values.map((v, i) => `${i * step},${h - (v / max) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="#10b981"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ACTIVITY_ICONS: Record<ActivityItem["type"], { icon: React.ComponentType<{ size?: number; className?: string }>; bg: string }> = {
  quote:   { icon: FileText,    bg: "bg-brand-50 text-brand-600" },
  message: { icon: MessageSquare, bg: "bg-blue-50 text-blue-600" },
  review:  { icon: Star,        bg: "bg-amber-50 text-amber-600" },
  view:    { icon: Eye,         bg: "bg-emerald-50 text-emerald-600" },
};

function ActivityRow({ item }: { item: ActivityItem }) {
  const v = ACTIVITY_ICONS[item.type];
  const Icon = v.icon;
  return (
    <li>
      <Link
        href={item.href}
        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-ink-50/60 transition"
      >
        <div className={`w-9 h-9 rounded-lg grid place-items-center flex-shrink-0 ${v.bg}`}>
          <Icon size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-ink-700 leading-tight">{item.title}</div>
          <div className="text-xs text-ink-500 mt-0.5 line-clamp-1">{item.subtitle}</div>
        </div>
        <div className="text-[0.7rem] text-ink-400 flex-shrink-0 mt-1">{timeAgo(item.time)}</div>
      </Link>
    </li>
  );
}
