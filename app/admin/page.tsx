import Link from "next/link";
import {
  Users, ShieldCheck, Briefcase, Star, Gift, MessageCircle,
  AlertTriangle, TrendingUp, ChevronRight, ArrowRight, Clock,
} from "lucide-react";
import { fetchAdminStats, fetchRecentSignups, fetchPendingArtisans } from "@/lib/db/admin-stats";

export const dynamic = "force-dynamic";

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60_000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h}h`;
  const d = Math.floor(h / 24);
  return `il y a ${d}j`;
}

export default async function AdminDashboardPage() {
  const [stats, recent, pending] = await Promise.all([
    fetchAdminStats(),
    fetchRecentSignups(8),
    fetchPendingArtisans(6),
  ]);

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-700 tracking-tight">
            Dashboard
          </h1>
          <p className="text-ink-500 text-sm mt-1">
            Vue d&apos;ensemble de l&apos;activité Bisecco.
          </p>
        </div>
        {stats.pending_validations > 0 && (
          <Link
            href="/admin/utilisateurs?status=pending"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-800 font-bold text-sm hover:bg-amber-100 transition"
          >
            <AlertTriangle size={15} />
            {stats.pending_validations} artisan{stats.pending_validations > 1 ? "s" : ""} à valider
            <ArrowRight size={13} />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={Users} label="Utilisateurs" value={stats.total_users}
          sub={`${stats.total_artisans} artisans · ${stats.total_particuliers} part.`}
          color="from-blue-500 to-blue-700" href="/admin/utilisateurs"
        />
        <StatCard
          icon={ShieldCheck} label="À valider" value={stats.pending_validations}
          sub={`${stats.approved_artisans} approuvés`}
          color="from-amber-500 to-orange-600" href="/admin/utilisateurs?status=pending"
          highlight={stats.pending_validations > 0}
        />
        <StatCard
          icon={Briefcase} label="Métiers" value={stats.total_metiers}
          sub="dans le référentiel"
          color="from-brand-500 to-brand-600" href="/admin/metiers"
        />
        <StatCard
          icon={Star} label="Avis publiés" value={stats.total_reviews}
          sub={stats.flagged_reviews > 0 ? `⚠ ${stats.flagged_reviews} signalés` : "0 signalés"}
          color="from-yellow-400 to-amber-500" href="/admin/avis"
          highlight={stats.flagged_reviews > 0}
        />
        <StatCard
          icon={MessageCircle} label="Messages chat" value={stats.total_messages}
          sub="total échangés" color="from-emerald-500 to-emerald-700"
        />
        <StatCard
          icon={Gift} label="Parrainages" value={stats.total_referrals}
          sub={`${stats.referrals_signed_up} inscrits · ${stats.referrals_validated} validés`}
          color="from-purple-500 to-pink-600" href="/admin/parrainages"
        />
        <StatCard
          icon={TrendingUp} label="Taux validation"
          value={
            stats.total_artisans > 0
              ? `${Math.round((stats.approved_artisans / stats.total_artisans) * 100)}%`
              : "—"
          }
          sub={`${stats.rejected_artisans} rejetés`}
          color="from-cyan-500 to-blue-600"
        />
        <StatCard
          icon={Users} label="Inscrits 7j"
          value={recent.filter((r) => new Date(r.created_at).getTime() > Date.now() - 7 * 86400000).length}
          sub="derniers 7 jours"
          color="from-indigo-500 to-purple-600"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-3xl border border-ink-100 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-ink-700 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-500" />
              À valider ({stats.pending_validations})
            </h2>
            <Link href="/admin/utilisateurs?status=pending" className="text-xs text-brand-600 font-bold hover:underline">
              Tout voir →
            </Link>
          </div>
          {pending.length === 0 ? (
            <div className="text-center py-8 text-ink-400 text-sm">
              ✅ Aucun artisan en attente
            </div>
          ) : (
            <div className="space-y-2">
              {pending.map((p) => (
                <Link
                  key={p.id} href={`/admin/utilisateurs/${p.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-ink-50 transition group"
                >
                  <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-ink-700 text-sm truncate">{p.name}</div>
                    <div className="text-[0.72rem] text-ink-500 truncate">
                      SIREN {p.siren ?? "—"} · {p.city ?? "Ville ?"} · {timeAgo(p.created_at)}
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-ink-300 group-hover:text-brand-500" />
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white rounded-3xl border border-ink-100 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-ink-700 flex items-center gap-2">
              <Clock size={16} className="text-blue-500" />
              Inscriptions récentes
            </h2>
            <Link href="/admin/utilisateurs" className="text-xs text-brand-600 font-bold hover:underline">
              Tout voir →
            </Link>
          </div>
          <div className="space-y-2">
            {recent.map((r) => (
              <Link
                key={r.id} href={`/admin/utilisateurs/${r.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-ink-50 transition group"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xs ${
                  r.role === "artisan" ? "bg-brand-100 text-brand-700" : "bg-blue-100 text-blue-700"
                }`}>
                  {r.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-ink-700 text-sm truncate">{r.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[0.6rem] font-bold uppercase ${
                      r.role === "artisan" ? "bg-brand-50 text-brand-700" : "bg-blue-50 text-blue-700"
                    }`}>
                      {r.role}
                    </span>
                    {r.validation_status === "pending" && (
                      <span className="px-1.5 py-0.5 rounded text-[0.6rem] font-bold uppercase bg-amber-50 text-amber-700">
                        Pending
                      </span>
                    )}
                  </div>
                  <div className="text-[0.72rem] text-ink-500 truncate">
                    {r.email} · {timeAgo(r.created_at)}
                  </div>
                </div>
                <ChevronRight size={14} className="text-ink-300 group-hover:text-brand-500" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon, label, value, sub, color, href, highlight,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  href?: string;
  highlight?: boolean;
}) {
  const inner = (
    <div className={`bg-white rounded-2xl p-4 sm:p-5 border ${highlight ? "border-amber-300 ring-2 ring-amber-100" : "border-ink-100"} hover:border-brand-200 hover:-translate-y-0.5 transition`}>
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
        <Icon size={18} className="text-white" />
      </div>
      <div className="text-2xl sm:text-3xl font-extrabold text-ink-700 leading-tight">{value}</div>
      <div className="text-xs sm:text-[0.78rem] text-ink-500 font-semibold mt-1">{label}</div>
      {sub && <div className="text-[0.66rem] text-ink-400 mt-0.5 truncate">{sub}</div>}
    </div>
  );
  return href ? <Link href={href} className="block">{inner}</Link> : inner;
}
