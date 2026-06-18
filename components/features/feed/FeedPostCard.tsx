import Link from "next/link";
import {
  MessageCircle, MapPin, ShieldCheck, Hammer, HelpCircle, Lightbulb, Repeat2,
} from "lucide-react";
import type { FeedPost } from "@/lib/feed/fetch";
import { FeedLikeButton } from "./FeedLikeButton";
import { FeedReportButton } from "./FeedReportButton";
import { FeedShareButton } from "./FeedShareButton";
import { FeedImageGrid } from "./FeedImageGrid";
import { FeedPostContent } from "./FeedPostContent";
import { FeedPostMenu } from "./FeedPostMenu";
import { FeedPostLinkCard } from "./FeedPostLinkCard";
import { FeedPostAutoLinkCard } from "./FeedPostAutoLinkCard";
import { FeedRepostButton } from "./FeedRepostButton";
import { RepostEmbed } from "./RepostEmbed";

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
  /** Id de l'utilisateur connecté (pour afficher le menu Supprimer si auteur). */
  currentUserId?: number | null;
  /** True si l'utilisateur connecté est admin (menu Supprimer en modération). */
  isAdmin?: boolean;
  /** Mode compact (sans bord arrondi top, utilisé dans /fil/[id]) */
  flat?: boolean;
};

export function FeedPostCard({ post, liked, canInteract, currentUserId, isAdmin }: Props) {
  const isOwner = currentUserId != null && post.author.id === currentUserId;
  const showMenu = canInteract && (isOwner || Boolean(isAdmin));
  const isRepost = post.repost_of != null;
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
      {/* Bandeau "a repartagé" si c'est un repost */}
      {isRepost && (
        <div className="px-5 pt-3 -mb-1 flex items-center gap-1.5 text-[0.72rem] text-emerald-700 font-bold">
          <Repeat2 size={12} />
          <span>{displayName} a repartagé</span>
        </div>
      )}
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
                title="Professionnel vérifié SIREN"
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
            <span>{isPro ? "Professionnel" : "Particulier"}</span>
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

        {showMenu && (
          <FeedPostMenu postId={post.id} isOwner={isOwner} isAdmin={Boolean(isAdmin)} />
        )}
      </header>

      {/* ─── CONTENT ─── (LinkedIn-style : tronqué à 3 lignes / 280 chars avec "… voir plus") */}
      {post.content && (
        <div className="px-5 pb-4">
          <FeedPostContent content={post.content} />
        </div>
      )}

      {/* ─── APERÇU DE LIEN OG ─── */}
      {/* Cas 1 : l'aperçu a été capturé à la publication → carte instantanée */}
      {post.link_url ? (
        <div className="px-5 pb-4">
          <FeedPostLinkCard
            url={post.link_url}
            title={post.link_title}
            description={post.link_description}
            image={post.link_image}
            siteName={post.link_site_name}
          />
        </div>
      ) : post.content && /https?:\/\//i.test(post.content) ? (
        // Cas 2 : URL dans le texte mais pas de capture stockée → fetch côté client
        <div className="px-5 pb-4">
          <FeedPostAutoLinkCard content={post.content} />
        </div>
      ) : null}

      {/* ─── POST REPARTAGÉ (embed du post original) ─── */}
      {post.repost_of && (
        <div className="px-5 pb-4">
          <RepostEmbed target={post.repost_of} />
        </div>
      )}

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
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-[0.85rem] font-semibold text-ink-500 hover:bg-ink-50 hover:text-ink-700 transition"
        >
          <MessageCircle size={16} />
          Commenter
        </Link>

        <FeedShareButton postId={post.id} excerpt={post.content} />

        <FeedRepostButton post={post} canInteract={canInteract} isOwner={isOwner} />

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
