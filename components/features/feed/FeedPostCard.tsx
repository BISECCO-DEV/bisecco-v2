import Link from "next/link";
import {
  MessageCircle, MapPin, ShieldCheck, Hammer, HelpCircle, Lightbulb,
  MoreHorizontal,
} from "lucide-react";
import type { FeedPost } from "@/lib/feed/fetch";
import { FeedLikeButton } from "./FeedLikeButton";
import { FeedReportButton } from "./FeedReportButton";
import { FeedImageGrid } from "./FeedImageGrid";

const KIND_CFG: Record<FeedPost["kind"], { label: string; tint: string; icon: typeof Hammer }> = {
  realisation: { label: "Réalisation",      tint: "text-brand-600",  icon: Hammer },
  question:    { label: "Question travaux", tint: "text-blue-600",   icon: HelpCircle },
  conseil:     { label: "Conseil métier",   tint: "text-violet-600", icon: Lightbulb },
};

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} j`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

type Props = {
  post: FeedPost;
  liked: boolean;
  canInteract: boolean;
  /** Mode compact (sans bord arrondi top, utilisé dans /fil/[id]) */
  flat?: boolean;
};

export function FeedPostCard({ post, liked, canInteract }: Props) {
  const author = post.author;
  const displayName = author.company_name || author.name;
  const kind = KIND_CFG[post.kind];
  const KindIcon = kind.icon;
  const isPro = author.role === "artisan";

  const avatarUrl =
    author.profile_photo ??
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(displayName)}`;

  const profileHref = author.client_number ? `/profil/${author.client_number}` : "#";

  return (
    <article className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(13,30,74,0.04),0_4px_16px_-8px_rgba(13,30,74,0.06)] border border-ink-100/80 overflow-hidden hover:shadow-[0_2px_4px_rgba(13,30,74,0.06),0_12px_24px_-12px_rgba(13,30,74,0.12)] transition-shadow">
      {/* ─── HEADER ─── */}
      <header className="px-5 pt-5 pb-3 flex items-start gap-3">
        <Link href={profileHref} className="flex-shrink-0 group/avatar">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl}
              alt=""
              className="w-12 h-12 rounded-full object-cover bg-ink-100 ring-2 ring-white shadow-sm group-hover/avatar:ring-brand-200 transition"
            />
            {isPro && (
              <span
                title="Artisan vérifié SIREN"
                className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center"
              >
                <ShieldCheck size={10} className="text-white" strokeWidth={3} />
              </span>
            )}
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link
              href={profileHref}
              className="font-bold text-ink-700 text-[0.95rem] hover:text-brand-600 transition truncate leading-tight"
            >
              {displayName}
            </Link>
            <span className={`inline-flex items-center gap-1 text-[0.7rem] font-bold ${kind.tint}`}>
              <KindIcon size={11} strokeWidth={2.6} />
              {kind.label}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[0.78rem] text-ink-400 mt-0.5 flex-wrap">
            <span>{isPro ? "Artisan" : "Particulier"}</span>
            {post.metier && (
              <>
                <span className="text-ink-300">·</span>
                <span className="font-medium text-ink-500">
                  {post.metier.icon} {post.metier.name}
                </span>
              </>
            )}
            {post.city && (
              <>
                <span className="text-ink-300">·</span>
                <span className="inline-flex items-center gap-0.5">
                  <MapPin size={10} /> {post.city}
                </span>
              </>
            )}
            <span className="text-ink-300">·</span>
            <span title={new Date(post.created_at).toLocaleString("fr-FR")}>{timeAgo(post.created_at)}</span>
          </div>
        </div>

        {/* Menu (placeholder) */}
        <button
          type="button"
          className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-ink-50 text-ink-400 inline-flex items-center justify-center transition"
          aria-label="Options"
        >
          <MoreHorizontal size={16} />
        </button>
      </header>

      {/* ─── CONTENT ─── */}
      <div className="px-5 pb-4">
        <p className="text-[0.96rem] text-ink-700 leading-[1.65] whitespace-pre-wrap break-words">
          {post.content}
        </p>
      </div>

      {/* ─── IMAGES (grid intelligent) ─── */}
      {post.images.length > 0 && (
        <Link href={`/fil/${post.id}`} className="block hover:opacity-95 transition">
          <FeedImageGrid images={post.images} />
        </Link>
      )}

      {/* ─── COMPTEURS (subtils, juste au-dessus des actions) ─── */}
      {(post.likes_count > 0 || post.comments_count > 0) && (
        <div className="px-5 pt-3 pb-2 flex items-center justify-between text-[0.78rem] text-ink-400">
          {post.likes_count > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-red-500 inline-flex items-center justify-center text-white text-[10px]">
                ❤
              </span>
              <span className="font-medium">{post.likes_count}</span>
            </span>
          ) : <span />}
          {post.comments_count > 0 && (
            <Link href={`/fil/${post.id}`} className="hover:text-brand-500 transition">
              {post.comments_count} commentaire{post.comments_count > 1 ? "s" : ""}
            </Link>
          )}
        </div>
      )}

      {/* ─── ACTIONS ─── */}
      <div className="px-2 py-1 border-t border-ink-100/70 flex items-center justify-between gap-1">
        <FeedLikeButton postId={post.id} initialLiked={liked} initialCount={post.likes_count} disabled={!canInteract} />

        <Link
          href={`/fil/${post.id}`}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-[0.85rem] font-semibold text-ink-500 hover:bg-ink-50 hover:text-ink-700 transition"
        >
          <MessageCircle size={16} />
          Commenter
        </Link>

        {canInteract ? (
          <div className="px-3">
            <FeedReportButton postId={post.id} />
          </div>
        ) : (
          <Link
            href="/connexion?redirect=/fil"
            className="px-3 text-xs text-ink-400 hover:text-brand-500 font-semibold"
          >
            Se connecter
          </Link>
        )}
      </div>
    </article>
  );
}
