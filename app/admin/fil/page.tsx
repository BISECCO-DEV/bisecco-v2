import type { Metadata } from "next";
import Link from "next/link";
import { Flag, CheckCircle2, ShieldCheck, MapPin, ExternalLink, Clock } from "lucide-react";
import { fetchReportedPosts, fetchRecentApprovedForAdmin, type FeedPost } from "@/lib/feed/fetch";
import { feedImagePublicUrl } from "@/components/features/feed/image-url";
import { AdminFeedRemoveButton } from "./AdminFeedRemoveButton";

export const metadata: Metadata = {
  title: "Modération Fil",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ tab?: string }>;

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  return `${days} j`;
}

const KIND_LABEL = {
  realisation: "Réalisation",
  question: "Question",
  conseil: "Conseil",
};

export default async function AdminFilPage({ searchParams }: { searchParams: SearchParams }) {
  const { tab } = await searchParams;
  const activeTab = tab === "recent" ? "recent" : "reported";

  const [reported, recent] = await Promise.all([
    fetchReportedPosts(30),
    fetchRecentApprovedForAdmin(30),
  ]);

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-ink-700 tracking-tight">Fil d&apos;actualité · modération</h1>
          <p className="text-ink-500 text-sm mt-1">
            Les posts sont publiés directement. Retirez ceux qui ne respectent pas les règles.
          </p>
        </div>
        <Link href="/fil" className="text-sm text-brand-600 font-semibold hover:underline whitespace-nowrap">
          Voir le fil public →
        </Link>
      </header>

      {/* Onglets */}
      <div className="flex items-center gap-1 bg-white rounded-xl border border-ink-100 p-1.5 w-fit">
        <Link
          href="/admin/fil"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition ${
            activeTab === "reported"
              ? "bg-red-500 text-white shadow-sm"
              : "text-ink-600 hover:bg-ink-50"
          }`}
        >
          <Flag size={14} />
          Signalés
          {reported.length > 0 && (
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[0.65rem] font-extrabold ${
              activeTab === "reported" ? "bg-white text-red-600" : "bg-red-100 text-red-700"
            }`}>
              {reported.length}
            </span>
          )}
        </Link>
        <Link
          href="/admin/fil?tab=recent"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition ${
            activeTab === "recent"
              ? "bg-ink-900 text-white shadow-sm"
              : "text-ink-600 hover:bg-ink-50"
          }`}
        >
          <Clock size={14} />
          Récents
        </Link>
      </div>

      {/* Contenu onglet */}
      {activeTab === "reported" ? (
        reported.length === 0 ? (
          <EmptyState
            icon={<CheckCircle2 size={32} className="text-emerald-500" />}
            title="Aucun signalement"
            text="Aucun post n'a été signalé. Tout va bien !"
          />
        ) : (
          <div className="space-y-4">
            {reported.map((p) => (
              <ModeratedPostCard
                key={p.id}
                post={p}
                reportsCount={p.reportsCount}
                reasons={p.reasons}
              />
            ))}
          </div>
        )
      ) : recent.length === 0 ? (
        <EmptyState
          icon={<Clock size={32} className="text-ink-400" />}
          title="Aucun post"
          text="Aucune publication dans le fil pour l'instant."
        />
      ) : (
        <div className="space-y-4">
          {recent.map((p) => (
            <ModeratedPostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="bg-white rounded-2xl border border-ink-100 p-10 text-center">
      <div className="flex justify-center mb-3">{icon}</div>
      <h2 className="font-bold text-ink-700">{title}</h2>
      <p className="text-sm text-ink-500 mt-1">{text}</p>
    </div>
  );
}

function ModeratedPostCard({
  post,
  reportsCount,
  reasons,
}: {
  post: FeedPost;
  reportsCount?: number;
  reasons?: string[];
}) {
  const author = post.author;
  const displayName = author.company_name || author.name;
  const avatar = author.profile_photo ?? `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(displayName)}`;
  const isReported = (reportsCount ?? 0) > 0;

  return (
    <article className={`bg-white rounded-2xl border overflow-hidden ${isReported ? "border-red-200" : "border-ink-100"}`}>
      {isReported && (
        <div className="bg-red-50 px-4 py-2.5 border-b border-red-200">
          <div className="flex items-center gap-2 text-xs font-bold text-red-800">
            <Flag size={12} /> {reportsCount} signalement{(reportsCount ?? 0) > 1 ? "s" : ""}
          </div>
          {reasons && reasons.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {Array.from(new Set(reasons)).slice(0, 5).map((r, i) => (
                <span key={i} className="inline-block px-2 py-0.5 rounded-md bg-white border border-red-200 text-[0.7rem] text-red-700 font-semibold">
                  {r}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={avatar} alt="" className="w-10 h-10 rounded-full object-cover bg-ink-100" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-ink-700 text-sm truncate">{displayName}</span>
                {author.role === "artisan" && <ShieldCheck size={12} className="text-emerald-500" />}
                <span className="text-[0.7rem] px-1.5 py-0.5 rounded-full bg-ink-100 text-ink-600 font-semibold">
                  {KIND_LABEL[post.kind]}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[0.7rem] text-ink-400 mt-0.5">
                <span>{author.role}</span>
                {post.metier && <span>· {post.metier.icon} {post.metier.name}</span>}
                {post.city && <span className="inline-flex items-center gap-0.5">· <MapPin size={9} /> {post.city}</span>}
                <span>· il y a {timeAgo(post.created_at)}</span>
              </div>
            </div>
          </div>
          <Link
            href={`/fil/${post.id}`}
            target="_blank"
            className="inline-flex items-center gap-1 text-xs text-brand-600 font-semibold hover:underline flex-shrink-0"
          >
            Voir <ExternalLink size={11} />
          </Link>
        </div>

        <p className="text-sm text-ink-700 leading-relaxed whitespace-pre-wrap break-words bg-ink-50/50 rounded-xl p-3">
          {post.content}
        </p>

        {post.images.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {post.images.map((path, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={feedImagePublicUrl(path)}
                alt=""
                className="w-full h-24 object-cover rounded-lg border border-ink-100"
              />
            ))}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-ink-100 flex items-center justify-between gap-2">
          <div className="text-xs text-ink-400">
            {post.likes_count} like{post.likes_count > 1 ? "s" : ""} · {post.comments_count} commentaire{post.comments_count > 1 ? "s" : ""}
          </div>
          <AdminFeedRemoveButton postId={post.id} />
        </div>
      </div>
    </article>
  );
}
