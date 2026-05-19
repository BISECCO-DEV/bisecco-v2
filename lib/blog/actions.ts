"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentDbUser } from "@/lib/auth/current-user";

export type BlogState = { error?: string; success?: string } | undefined;

export type BlogArticle = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content_html: string;
  image_url: string | null;
  image_alt: string | null;
  author: string;
  read_time: string | null;
  status: "draft" | "published";
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
};

/** Slugifie un titre français pour URL propre */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

async function uniqueSlug(title: string, excludeId?: number): Promise<string> {
  const admin = createSupabaseAdminClient();
  const base = slugify(title);
  let slug = base;
  let i = 1;
  while (true) {
    const q = admin.from("blog_articles").select("id").eq("slug", slug);
    if (excludeId) q.neq("id", excludeId);
    const { data } = await q.maybeSingle();
    if (!data) return slug;
    slug = `${base}-${++i}`;
  }
}

async function requireAdmin() {
  const me = await getCurrentDbUser();
  if (!me) redirect("/connexion");
  if (me!.role !== "admin" && me!.role !== "super_admin") redirect("/");
  const admin = createSupabaseAdminClient();
  return { user: me!, admin };
}

/** Liste publique des articles publiés (pour /blog) */
export async function listPublishedArticles(limit = 50): Promise<BlogArticle[]> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("blog_articles")
    .select("*")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as BlogArticle[];
}

/** Charge un article par slug (uniquement publié pour public) */
export async function getPublishedArticle(slug: string): Promise<BlogArticle | null> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("blog_articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .maybeSingle();
  return (data as BlogArticle) ?? null;
}

/** Admin: création article */
export async function createArticleAction(_prev: BlogState, formData: FormData): Promise<BlogState> {
  const { admin } = await requireAdmin();

  const title = formData.get("title")?.toString().trim();
  const content = formData.get("content_html")?.toString();
  const status = (formData.get("status")?.toString() ?? "draft") as "draft" | "published";

  if (!title || title.length < 5) return { error: "Titre trop court." };
  if (!content || content.length < 20) return { error: "Contenu trop court." };

  const slug = await uniqueSlug(title);
  const publishedAt = formData.get("published_at")?.toString() ||
    (status === "published" ? new Date().toISOString() : null);

  const { error } = await admin.from("blog_articles").insert({
    slug,
    title,
    excerpt: formData.get("excerpt")?.toString().trim() || null,
    content_html: content,
    image_url: formData.get("image_url")?.toString().trim() || null,
    image_alt: formData.get("image_alt")?.toString().trim() || null,
    author: formData.get("author")?.toString().trim() || "L'équipe Bisecco",
    read_time: formData.get("read_time")?.toString().trim() || null,
    status,
    published_at: publishedAt,
    meta_title: formData.get("meta_title")?.toString().trim() || null,
    meta_description: formData.get("meta_description")?.toString().trim() || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

/** Admin: update article */
export async function updateArticleAction(id: number, _prev: BlogState, formData: FormData): Promise<BlogState> {
  const { admin } = await requireAdmin();

  const title = formData.get("title")?.toString().trim();
  if (!title) return { error: "Titre requis." };

  const status = (formData.get("status")?.toString() ?? "draft") as "draft" | "published";
  const slug = formData.get("slug")?.toString().trim() || await uniqueSlug(title, id);

  const update: Record<string, unknown> = {
    title,
    slug,
    excerpt: formData.get("excerpt")?.toString().trim() || null,
    content_html: formData.get("content_html")?.toString() ?? "",
    image_url: formData.get("image_url")?.toString().trim() || null,
    image_alt: formData.get("image_alt")?.toString().trim() || null,
    author: formData.get("author")?.toString().trim() || "L'équipe Bisecco",
    read_time: formData.get("read_time")?.toString().trim() || null,
    status,
    meta_title: formData.get("meta_title")?.toString().trim() || null,
    meta_description: formData.get("meta_description")?.toString().trim() || null,
  };

  const pubRaw = formData.get("published_at")?.toString();
  if (pubRaw) update.published_at = pubRaw;
  else if (status === "published") {
    const { data: existing } = await admin.from("blog_articles").select("published_at").eq("id", id).single();
    if (!existing?.published_at) update.published_at = new Date().toISOString();
  }

  const { error } = await admin.from("blog_articles").update(update).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

/** Admin: delete article */
export async function deleteArticleAction(id: number): Promise<{ ok: boolean }> {
  const { admin } = await requireAdmin();
  await admin.from("blog_articles").delete().eq("id", id);
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return { ok: true };
}
