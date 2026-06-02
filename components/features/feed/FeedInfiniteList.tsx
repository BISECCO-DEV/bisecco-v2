"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FeedPost } from "@/lib/feed/fetch";
import type { FeedKind } from "@/lib/feed/actions";
import { FeedPostCard } from "./FeedPostCard";
import { loadMoreFeedAction } from "@/lib/feed/load-more";

type Props = {
  initialPosts: FeedPost[];
  initialLikedIds: number[];
  canInteract: boolean;
  currentUserId: number | null;
  isAdmin: boolean;
  kind?: FeedKind;
  metierId?: number;
  /** Compteur de "tick" externe (incrémenté par FeedRealtime à chaque nouvel event)
   *  → quand il change, on appelle router.refresh() qui re-fournit `initialPosts` à jour. */
  realtimeTick?: number;
};

const PAGE_SIZE = 10;

/**
 * Liste infinie des posts du fil.
 * - 10 premiers posts en SSR via `initialPosts`
 * - Charge 10 de plus via IntersectionObserver quand le sentinel approche
 * - À chaque nouvel event Realtime (realtimeTick), router.refresh() rafraîchit
 *   les posts initiaux (les "vieux" posts déjà paginés ne bougent pas)
 */
export function FeedInfiniteList({
  initialPosts,
  initialLikedIds,
  canInteract,
  currentUserId,
  isAdmin,
  kind,
  metierId,
  realtimeTick,
}: Props) {
  const router = useRouter();
  const [extraPosts, setExtraPosts] = useState<FeedPost[]>([]);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set(initialLikedIds));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length >= PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Maintient le Set des likes en sync avec les props initiales (router.refresh)
  useEffect(() => {
    setLikedIds(new Set([...initialLikedIds, ...likedIds]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLikedIds]);

  // Realtime tick → refresh SSR pour récupérer les nouveaux posts en tête de liste
  useEffect(() => {
    if (realtimeTick == null || realtimeTick === 0) return;
    router.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realtimeTick]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const offset = initialPosts.length + extraPosts.length;
    try {
      const res = await loadMoreFeedAction({ offset, kind, metierId });
      setExtraPosts((prev) => [...prev, ...res.posts]);
      setLikedIds((prev) => {
        const next = new Set(prev);
        res.likedIds.forEach((id) => next.add(id));
        return next;
      });
      setHasMore(res.hasMore);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, initialPosts.length, extraPosts.length, kind, metierId]);

  // IntersectionObserver pour déclencher loadMore quand le sentinel approche
  useEffect(() => {
    if (!hasMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "600px" },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, [hasMore, loadMore]);

  const allPosts = [...initialPosts, ...extraPosts];

  return (
    <div className="space-y-4">
      {allPosts.map((p) => (
        <FeedPostCard
          key={p.id}
          post={p}
          liked={likedIds.has(p.id)}
          canInteract={canInteract}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
        />
      ))}

      {hasMore && (
        <div ref={sentinelRef} className="flex items-center justify-center py-6">
          {loading ? (
            <div className="inline-flex items-center gap-2 text-sm text-ink-500 font-semibold">
              <Loader2 size={16} className="animate-spin" />
              Chargement…
            </div>
          ) : (
            <div className="h-1" />
          )}
        </div>
      )}

      {!hasMore && allPosts.length > 0 && (
        <div className="text-center py-6 text-xs text-ink-400">
          Vous avez atteint la fin du fil · Plus de posts à venir bientôt.
        </div>
      )}
    </div>
  );
}
