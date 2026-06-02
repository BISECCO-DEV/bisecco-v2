import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type FeedKind = "realisation" | "question" | "conseil";
export type FeedStatus = "pending" | "approved" | "rejected" | "removed";

export type FeedPostAuthor = {
  id: number;
  name: string;
  company_name: string | null;
  profile_photo: string | null;
  role: "admin" | "artisan" | "particulier";
  client_number: string | null;
};

export type RepostTarget = {
  id: number;
  kind: FeedKind;
  content: string | null;
  images: string[];
  created_at: string;
  link_url: string | null;
  link_title: string | null;
  link_description: string | null;
  link_image: string | null;
  link_site_name: string | null;
  author: FeedPostAuthor;
};

export type FeedPost = {
  id: number;
  kind: FeedKind;
  content: string;
  images: string[];
  city: string | null;
  metier_id: number | null;
  status: FeedStatus;
  rejection_reason: string | null;
  created_at: string;
  approved_at: string | null;
  likes_count: number;
  comments_count: number;
  // Aperçu Open Graph capturé à la publication (si l'auteur a collé un lien)
  link_url: string | null;
  link_title: string | null;
  link_description: string | null;
  link_image: string | null;
  link_site_name: string | null;
  // Repartage : si renseigné, ce post est un repost du post repost_of (embed)
  repost_of_id: number | null;
  repost_of: RepostTarget | null;
  author: FeedPostAuthor;
  metier: { id: number; name: string; slug: string; icon: string | null } | null;
};

export type FeedComment = {
  id: number;
  content: string;
  created_at: string;
  author: {
    id: number;
    name: string;
    company_name: string | null;
    profile_photo: string | null;
    role: "admin" | "artisan" | "particulier";
  };
};

type RawAuthor = {
  id: number;
  name: string;
  profile_photo: string | null;
  role: string;
  client_number: string | null;
  artisan_profiles: { company_name: string | null }[] | null;
} | null;

type RepostRow = {
  id: number;
  kind: FeedKind;
  content: string | null;
  images: string[] | null;
  created_at: string;
  link_url: string | null;
  link_title: string | null;
  link_description: string | null;
  link_image: string | null;
  link_site_name: string | null;
  author: RawAuthor;
} | null;

type PostRow = {
  id: number;
  kind: FeedKind;
  content: string;
  images: string[] | null;
  city: string | null;
  metier_id: number | null;
  status: FeedStatus;
  rejection_reason: string | null;
  created_at: string;
  approved_at: string | null;
  likes_count: number;
  comments_count: number;
  link_url: string | null;
  link_title: string | null;
  link_description: string | null;
  link_image: string | null;
  link_site_name: string | null;
  repost_of_id: number | null;
  repost_of: RepostRow;
  author: RawAuthor;
  metier: { id: number; name: string; slug: string; icon: string | null } | null;
};

function normalizeAuthor(a: RawAuthor): FeedPostAuthor {
  if (!a) {
    return { id: 0, name: "Utilisateur", company_name: null, profile_photo: null, role: "particulier", client_number: null };
  }
  const company = a.artisan_profiles?.[0]?.company_name?.trim() || null;
  return {
    id: a.id,
    name: a.name,
    company_name: company,
    profile_photo: a.profile_photo,
    role: (a.role as FeedPostAuthor["role"]) ?? "particulier",
    client_number: a.client_number,
  };
}

function normalizeRepostTarget(r: RepostRow): RepostTarget | null {
  if (!r) return null;
  return {
    id: r.id,
    kind: r.kind,
    content: r.content,
    images: Array.isArray(r.images) ? r.images : [],
    created_at: r.created_at,
    link_url: r.link_url,
    link_title: r.link_title,
    link_description: r.link_description,
    link_image: r.link_image,
    link_site_name: r.link_site_name,
    author: normalizeAuthor(r.author),
  };
}

const POST_SELECT = `
  id, kind, content, images, city, metier_id, status, rejection_reason,
  created_at, approved_at, likes_count, comments_count,
  link_url, link_title, link_description, link_image, link_site_name,
  repost_of_id,
  author:author_id (
    id, name, profile_photo, role, client_number,
    artisan_profiles ( company_name )
  ),
  metier:metier_id ( id, name, slug, icon ),
  repost_of:repost_of_id (
    id, kind, content, images, created_at,
    link_url, link_title, link_description, link_image, link_site_name,
    author:author_id (
      id, name, profile_photo, role, client_number,
      artisan_profiles ( company_name )
    )
  )
`;

export type FeedFilter = {
  kind?: FeedKind;
  metierId?: number;
  city?: string;
};

export async function fetchApprovedFeed(
  filter: FeedFilter = {},
  limit = 10,
  offset = 0,
): Promise<FeedPost[]> {
  const admin = createSupabaseAdminClient();
  let q = admin
    .from("feed_posts")
    .select(POST_SELECT)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (filter.kind) q = q.eq("kind", filter.kind);
  if (filter.metierId) q = q.eq("metier_id", filter.metierId);
  if (filter.city) q = q.ilike("city", `%${filter.city}%`);

  const { data, error } = await q;
  if (error) {
    console.error("[fetchApprovedFeed]", error);
    return [];
  }
  return (data as unknown as PostRow[]).map((p) => ({
    ...p,
    images: Array.isArray(p.images) ? p.images : [],
    author: normalizeAuthor(p.author),
    metier: p.metier ?? null,
    repost_of: normalizeRepostTarget(p.repost_of),
  }));
}

export async function fetchPendingFeed(limit = 100): Promise<FeedPost[]> {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("feed_posts")
    .select(POST_SELECT)
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("[fetchPendingFeed]", error);
    return [];
  }
  return (data as unknown as PostRow[]).map((p) => ({
    ...p,
    images: Array.isArray(p.images) ? p.images : [],
    author: normalizeAuthor(p.author),
    metier: p.metier ?? null,
    repost_of: normalizeRepostTarget(p.repost_of),
  }));
}

/** Posts approuvés récents pour le panneau admin. */
export async function fetchRecentApprovedForAdmin(limit = 50): Promise<FeedPost[]> {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("feed_posts")
    .select(POST_SELECT)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[fetchRecentApprovedForAdmin]", error);
    return [];
  }
  return (data as unknown as PostRow[]).map((p) => ({
    ...p,
    images: Array.isArray(p.images) ? p.images : [],
    author: normalizeAuthor(p.author),
    metier: p.metier ?? null,
    repost_of: normalizeRepostTarget(p.repost_of),
  }));
}

/** Posts signalés (au moins 1 signalement non résolu). */
export async function fetchReportedPosts(limit = 50): Promise<Array<FeedPost & { reportsCount: number; reasons: string[] }>> {
  const admin = createSupabaseAdminClient();

  // Récupère les ids des posts signalés avec count
  const { data: reports } = await admin
    .from("feed_reports")
    .select("post_id, reason")
    .not("post_id", "is", null)
    .is("resolved_at", null);

  if (!reports || reports.length === 0) return [];

  const counts = new Map<number, { count: number; reasons: string[] }>();
  for (const r of reports as { post_id: number; reason: string }[]) {
    const cur = counts.get(r.post_id) ?? { count: 0, reasons: [] };
    cur.count += 1;
    cur.reasons.push(r.reason);
    counts.set(r.post_id, cur);
  }

  const ids = Array.from(counts.keys()).slice(0, limit);
  if (ids.length === 0) return [];

  const { data } = await admin
    .from("feed_posts")
    .select(POST_SELECT)
    .in("id", ids)
    .neq("status", "removed");

  return (data as unknown as PostRow[]).map((p) => {
    const info = counts.get(p.id) ?? { count: 0, reasons: [] };
    return {
      ...p,
      images: Array.isArray(p.images) ? p.images : [],
      author: normalizeAuthor(p.author),
      metier: p.metier ?? null,
      repost_of: normalizeRepostTarget(p.repost_of),
      reportsCount: info.count,
      reasons: info.reasons,
    };
  });
}

export async function fetchPostById(id: number): Promise<FeedPost | null> {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("feed_posts")
    .select(POST_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  const row = data as unknown as PostRow;
  return {
    ...row,
    images: Array.isArray(row.images) ? row.images : [],
    author: normalizeAuthor(row.author),
    metier: row.metier ?? null,
    repost_of: normalizeRepostTarget(row.repost_of),
  };
}

export async function fetchCommentsForPost(postId: number): Promise<FeedComment[]> {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("feed_comments")
    .select(`
      id, content, created_at,
      author:author_id (
        id, name, profile_photo, role,
        artisan_profiles ( company_name )
      )
    `)
    .eq("post_id", postId)
    .eq("status", "visible")
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  return data.map((c) => {
    const a = c.author as unknown as PostRow["author"];
    const author = normalizeAuthor(a);
    return {
      id: c.id,
      content: c.content,
      created_at: c.created_at,
      author: {
        id: author.id,
        name: author.name,
        company_name: author.company_name,
        profile_photo: author.profile_photo,
        role: author.role,
      },
    };
  });
}

/** Liste des post_ids likés par un user (pour cocher les boutons like). */
export async function fetchLikedPostIds(userId: number, postIds: number[]): Promise<Set<number>> {
  if (postIds.length === 0) return new Set();
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("feed_likes")
    .select("post_id")
    .eq("user_id", userId)
    .in("post_id", postIds);
  return new Set((data ?? []).map((r) => r.post_id as number));
}

/** Compte les posts pending pour le badge admin. */
export async function countPendingPosts(): Promise<number> {
  const admin = createSupabaseAdminClient();
  const { count } = await admin
    .from("feed_posts")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");
  return count ?? 0;
}
