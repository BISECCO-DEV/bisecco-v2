import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import type { RepostTarget } from "@/lib/feed/fetch";
import { LinkifiedText } from "./LinkifiedText";
import { FeedImageGrid } from "./FeedImageGrid";
import { FeedPostLinkCard } from "./FeedPostLinkCard";

/**
 * Affiche le post original "embarqué" dans un repost.
 * Style : bordure fine, contenu compact, lien vers la fiche complète.
 */
export function RepostEmbed({ target }: { target: RepostTarget }) {
  const author = target.author;
  const displayName = author.company_name || author.name;
  const isPro = author.role === "artisan";
  const profileHref = author.client_number ? `/profil/${author.client_number}` : "#";
  const postHref = `/fil/${target.id}`;

  const avatarUrl =
    author.profile_photo ??
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(displayName)}`;

  return (
    <div className="rounded-2xl border border-ink-200 bg-ink-50/40 overflow-hidden hover:border-brand-200 hover:bg-white transition">
      {/* Header compact */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-2">
        <Link href={profileHref} className="flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarUrl}
            alt=""
            className="w-7 h-7 rounded-full object-cover bg-ink-100 ring-1 ring-white"
          />
        </Link>
        <Link
          href={profileHref}
          className="font-bold text-ink-700 text-[0.82rem] hover:text-brand-600 transition truncate"
        >
          {displayName}
        </Link>
        {isPro && (
          <ShieldCheck size={11} className="text-emerald-500 flex-shrink-0" strokeWidth={3} />
        )}
        <span className="text-ink-300 text-xs">·</span>
        <Link
          href={postHref}
          className="text-[0.7rem] text-ink-400 hover:text-brand-500 font-semibold"
        >
          Voir le post
        </Link>
      </div>

      {/* Contenu */}
      {target.content && (
        <div className="px-4 pb-2">
          <LinkifiedText className="text-[0.85rem] text-ink-600 leading-snug whitespace-pre-wrap break-words line-clamp-6">
            {target.content}
          </LinkifiedText>
        </div>
      )}

      {/* Images */}
      {target.images.length > 0 && (
        <Link href={postHref} className="block hover:opacity-95 transition">
          <FeedImageGrid images={target.images} />
        </Link>
      )}

      {/* Aperçu OG */}
      {target.link_url && (
        <div className="px-4 pb-3 pt-1">
          <FeedPostLinkCard
            url={target.link_url}
            title={target.link_title}
            description={target.link_description}
            image={target.link_image}
            siteName={target.link_site_name}
          />
        </div>
      )}
    </div>
  );
}
