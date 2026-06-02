import Link from "next/link";
import { TrendingUp, Sparkles, Hash, ArrowRight, Shield, Users } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type TopMetier = { id: number; name: string; slug: string; icon: string | null; count: number };

async function fetchTopMetiersInFeed(limit = 5): Promise<TopMetier[]> {
  const admin = createSupabaseAdminClient();
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data: posts } = await admin
    .from("feed_posts")
    .select("metier_id")
    .eq("status", "approved")
    .gte("created_at", since)
    .not("metier_id", "is", null);

  if (!posts || posts.length === 0) return [];

  const counts = new Map<number, number>();
  for (const p of posts) {
    if (p.metier_id) counts.set(p.metier_id, (counts.get(p.metier_id) ?? 0) + 1);
  }

  const topIds = Array.from(counts.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([id]) => id);

  if (topIds.length === 0) return [];

  const { data: metiers } = await admin
    .from("metiers")
    .select("id, name, slug, icon")
    .in("id", topIds);

  return (metiers ?? [])
    .map((m) => ({ ...m, count: counts.get(m.id) ?? 0 }))
    .sort((a, b) => b.count - a.count);
}

async function fetchFeedStats() {
  const admin = createSupabaseAdminClient();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [{ count: weekPosts }, { count: totalPosts }, { count: activeUsers }] = await Promise.all([
    admin.from("feed_posts").select("*", { count: "exact", head: true })
      .eq("status", "approved")
      .gte("created_at", weekAgo),
    admin.from("feed_posts").select("*", { count: "exact", head: true })
      .eq("status", "approved"),
    admin.from("users").select("*", { count: "exact", head: true })
      .eq("validation_status", "approved")
      .is("deleted_at", null),
  ]);

  return {
    weekPosts: weekPosts ?? 0,
    totalPosts: totalPosts ?? 0,
    activeUsers: activeUsers ?? 0,
  };
}

export async function FeedSidebar() {
  const [topMetiers, stats] = await Promise.all([
    fetchTopMetiersInFeed(),
    fetchFeedStats(),
  ]);

  return (
    <aside className="space-y-4 sticky top-24">
      {/* En direct — bandeau live élégant */}
      <div className="bg-white rounded-3xl border border-ink-100 p-5 shadow-[0_2px_8px_-2px_rgba(13,30,74,0.04)]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[0.72rem] font-extrabold text-emerald-700 tracking-wider uppercase">
            En direct
          </span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <StatBlock value={stats.weekPosts} label="cette semaine" />
          <StatBlock value={stats.totalPosts} label="au total" />
          <StatBlock value={stats.activeUsers} label="membres" />
        </div>
      </div>

      {/* Tendances métiers */}
      {topMetiers.length > 0 && (
        <div className="bg-white rounded-3xl border border-ink-100 p-5 shadow-[0_2px_8px_-2px_rgba(13,30,74,0.04)]">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={15} className="text-brand-500" />
            <h3 className="font-extrabold text-ink-700 text-sm">Tendances cette semaine</h3>
          </div>
          <div className="space-y-1">
            {topMetiers.map((m) => (
              <Link
                key={m.id}
                href={`/fil?metier=${m.slug}`}
                className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-brand-50 transition group"
              >
                <span className="text-xl flex-shrink-0">{m.icon ?? "🛠️"}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.86rem] font-bold text-ink-700 group-hover:text-brand-700 truncate transition">
                    #{m.name}
                  </div>
                  <div className="text-[0.7rem] text-ink-400">
                    {m.count} post{m.count > 1 ? "s" : ""} ce mois
                  </div>
                </div>
                <ArrowRight size={12} className="text-ink-300 group-hover:text-brand-500 transition flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CTA invitation — orange éclatant */}
      <div className="relative bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-3xl p-5 overflow-hidden shadow-[0_8px_24px_-6px_rgba(240,122,47,0.45)]">
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <Users size={20} strokeWidth={2.4} />
          <h3 className="mt-3 font-extrabold text-base leading-tight">
            Invitez vos proches
          </h3>
          <p className="text-[0.78rem] text-white/85 mt-1.5 leading-snug">
            Plus on est de monde, plus le fil est riche.
          </p>
          <Link
            href="/parrainage"
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-brand-700 text-[0.78rem] font-extrabold hover:bg-brand-50 transition"
          >
            Inviter <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Footer infos */}
      <div className="px-3 space-y-2 text-[0.72rem] text-ink-400 leading-relaxed">
        <div className="flex items-center gap-1.5 font-bold text-ink-500">
          <Shield size={11} /> Règles du fil
        </div>
        <p>Pas de pub · respect des autres membres · contenu lié à l&apos;artisanat ou aux travaux.</p>
        <div className="pt-2 flex items-center gap-1.5 font-bold text-ink-500">
          <Hash size={11} /> Communauté
        </div>
        <p>Comptes vérifiés SIREN · publication immédiate · modération a posteriori.</p>
      </div>
    </aside>
  );
}

function StatBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="text-xl font-extrabold text-ink-700 tabular-nums leading-none">
        {value}
      </div>
      <div className="text-[0.62rem] text-ink-400 mt-1 uppercase tracking-wider leading-tight">
        {label}
      </div>
    </div>
  );
}
