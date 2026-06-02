"use server";

import { fetchApprovedFeed, type FeedKind, type FeedPost } from "./fetch";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/db/current-user";

const PAGE_SIZE = 10;

export type LoadMoreFeedResult = {
  posts: FeedPost[];
  likedIds: number[];
  hasMore: boolean;
};

/**
 * Server action paginée du fil — chargée côté client via IntersectionObserver
 * dans FeedInfiniteList. Retourne 10 posts à partir de `offset`.
 *
 * Renvoie aussi la liste des post_id likés par l'utilisateur courant (limité
 * aux posts retournés) pour que le cœur s'affiche correctement.
 */
export async function loadMoreFeedAction(args: {
  offset: number;
  kind?: FeedKind;
  metierId?: number;
}): Promise<LoadMoreFeedResult> {
  const offset = Math.max(0, Number(args.offset) || 0);
  const posts = await fetchApprovedFeed({ kind: args.kind, metierId: args.metierId }, PAGE_SIZE + 1, offset);

  const hasMore = posts.length > PAGE_SIZE;
  const slice = hasMore ? posts.slice(0, PAGE_SIZE) : posts;

  // Likes de l'utilisateur courant uniquement pour le batch retourné
  let likedIds: number[] = [];
  const user = await getCurrentUser();
  if (user?.id && slice.length > 0) {
    const ids = slice.map((p) => p.id);
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("feed_likes")
      .select("post_id")
      .eq("user_id", user.id)
      .in("post_id", ids);
    likedIds = (data ?? []).map((r) => r.post_id as number);
  }

  return { posts: slice, likedIds, hasMore };
}
