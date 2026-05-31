import Link from "next/link";
import { TrendingUp, Sparkles, Hash, ArrowRight } from "lucide-react";
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

  const [{ count: weekPosts }, { count: totalPosts }] = await Promise.all([
    admin.from("feed_posts").select("*", { count: "exact", head: true })
      .eq("status", "approved")
      .gte("created_at", weekAgo),
    admin.from("feed_posts").select("*", { count: "exact", head: true })
      .eq("status", "approved"),
  ]);

  return {
    weekPosts: weekPosts ?? 0,
    totalPosts: totalPosts ?? 0,
  };
}

export async function FeedSidebar() {
  const [topMetiers, stats] = await Promise.all([
    fetchTopMetiersInFeed(),
    fetchFeedStats(),
  ]);

  return (
    <aside className="space-y-4 sticky top-[120px]">
      {/* Stats compactes */}
      <div className="bg-gradient-to-br from-ink-800 to-ink-900 text-white rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-brand-500/20 blur-2xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[0.62rem] font-bold tracking-[0.12em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Cette semaine
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight">{stats.weekPosts}</span>
            <span className="text-xs text-white/65">publication{stats.weekPosts > 1 ? "s" : ""}</span>
          </div>
          <div className="mt-1 text-[0.78rem] text-white/55">
            {stats.totalPosts} au total depuis le lancement
          </div>
        </div>
      </div>

      {/* Tendances métiers */}
      {topMetiers.length > 0 && (
        <div className="bg-white rounded-2xl border border-ink-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 inline-flex items-center justify-center">
              <TrendingUp size={15} />
            </span>
            <h3 className="font-extrabold text-ink-700 text-sm">Métiers tendances</h3>
          </div>
          <div className="space-y-2">
            {topMetiers.map((m, i) => (
              <Link
                key={m.id}
                href={`/fil?metier=${m.slug}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-ink-50 transition group"
              >
                <span className="text-[0.7rem] font-extrabold text-ink-300 w-4">#{i + 1}</span>
                <span className="text-base flex-shrink-0">{m.icon ?? "🛠️"}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-ink-700 group-hover:text-brand-600 truncate transition">
                    {m.name}
                  </div>
                  <div className="text-[0.66rem] text-ink-400">
                    {m.count} post{m.count > 1 ? "s" : ""}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Encart "Qui peut publier ?" */}
      <div className="bg-white rounded-2xl border border-ink-100 p-5">
        <h3 className="font-extrabold text-ink-700 text-sm mb-3">Qui peut publier ?</h3>
        <ul className="space-y-2.5 text-[0.78rem] text-ink-600 leading-relaxed">
          <li className="flex gap-2">
            <span className="text-brand-500 font-bold flex-shrink-0">→</span>
            <span><strong className="text-ink-700">Artisans</strong> : partagez vos chantiers, donnez vos conseils, répondez aux questions.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-500 font-bold flex-shrink-0">→</span>
            <span><strong className="text-ink-700">Particuliers</strong> : posez vos questions travaux, demandez des conseils avant un projet.</span>
          </li>
        </ul>
      </div>

      {/* CTA invitation */}
      <div className="bg-gradient-to-br from-brand-50 to-amber-50 rounded-2xl border border-brand-200 p-5">
        <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-brand-500 text-white shadow-[0_4px_12px_rgba(240,122,47,0.3)]">
          <Sparkles size={15} />
        </div>
        <h3 className="mt-3 font-extrabold text-ink-700 text-sm leading-tight">
          Faites grandir la communauté
        </h3>
        <p className="text-xs text-ink-600 mt-1.5 leading-relaxed">
          Invitez vos proches · artisans ou particuliers. Plus de membres = un fil plus riche pour tout le monde.
        </p>
        <Link
          href="/parrainage"
          className="mt-3 inline-flex items-center gap-1.5 text-[0.76rem] font-extrabold text-brand-700 hover:underline"
        >
          Inviter un proche <ArrowRight size={11} />
        </Link>
      </div>

      {/* Règles communautaires (footer mini) */}
      <div className="text-[0.7rem] text-ink-400 px-2 leading-relaxed">
        <div className="flex items-center gap-1.5 mb-1.5 font-semibold text-ink-500">
          <Hash size={10} /> Règles du fil
        </div>
        Modération en amont · pas de publicité · respect des autres membres · contenu lié aux travaux et à l&apos;artisanat.
      </div>
    </aside>
  );
}
