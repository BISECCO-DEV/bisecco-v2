"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireUser, requireAdmin } from "@/lib/db/current-user";
import { sendMail } from "@/lib/mail/mailer";
import { feedPostRejectedEmail, feedPostApprovedEmail } from "@/lib/mail/templates";

const KIND_VALUES = ["realisation", "question", "conseil"] as const;
export type FeedKind = (typeof KIND_VALUES)[number];

export type FeedActionState =
  | { ok: true; postId?: number }
  | { ok: false; error: string }
  | undefined;

const APP_URL = process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://bisecco.eu";

// ─────────────────── CREATE POST ───────────────────
export async function createFeedPostAction(
  _prev: FeedActionState,
  formData: FormData,
): Promise<FeedActionState> {
  const user = await requireUser();
  if (!user.id) return { ok: false, error: "Compte non trouvé." };
  if (user.validation_status !== "approved") {
    return { ok: false, error: "Votre compte doit être validé avant de pouvoir poster." };
  }

  const kind = formData.get("kind")?.toString() ?? "";
  const content = formData.get("content")?.toString().trim() ?? "";
  const city = formData.get("city")?.toString().trim() || null;
  const metierIdRaw = formData.get("metier_id")?.toString().trim();
  const imagesRaw = formData.get("images")?.toString() ?? "[]";

  // Aperçu de lien (Open Graph) capturé côté client pendant la rédaction
  const linkUrl = formData.get("link_url")?.toString().trim() || null;
  const linkTitle = formData.get("link_title")?.toString().trim() || null;
  const linkDescription = formData.get("link_description")?.toString().trim() || null;
  const linkImage = formData.get("link_image")?.toString().trim() || null;
  const linkSiteName = formData.get("link_site_name")?.toString().trim() || null;

  if (!KIND_VALUES.includes(kind as FeedKind)) {
    return { ok: false, error: "Type de post invalide." };
  }
  if (content.length < 10 || content.length > 4000) {
    return { ok: false, error: "Le texte doit faire entre 10 et 4000 caractères." };
  }

  let images: string[] = [];
  try {
    const parsed = JSON.parse(imagesRaw);
    if (Array.isArray(parsed)) {
      images = parsed.filter((p): p is string => typeof p === "string").slice(0, 4);
    }
  } catch {
    images = [];
  }

  // Anti-spam léger : max 50 posts/24h (au-delà c'est suspect)
  // Admin bypass : pas de limite pour les comptes admin
  const admin = createSupabaseAdminClient();
  if (user.role !== "admin") {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: recentCount } = await admin
      .from("feed_posts")
      .select("*", { count: "exact", head: true })
      .eq("author_id", user.id)
      .gte("created_at", since);
    if ((recentCount ?? 0) >= 50) {
      return { ok: false, error: "Limite atteinte : 50 posts par 24h. Reviens demain." };
    }
  }

  const metierId = metierIdRaw ? Number(metierIdRaw) : null;

  // Post-modération : publication directe, l'admin peut retirer si problème
  const { data: created, error } = await admin
    .from("feed_posts")
    .insert({
      author_id: user.id,
      kind,
      content,
      city,
      metier_id: Number.isFinite(metierId) ? metierId : null,
      images,
      link_url: linkUrl,
      link_title: linkTitle,
      link_description: linkDescription,
      link_image: linkImage,
      link_site_name: linkSiteName,
      status: "approved",
      approved_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error || !created) {
    console.error("[createFeedPostAction]", error);
    return { ok: false, error: error?.message ?? "Erreur lors de la publication." };
  }

  revalidatePath("/fil");
  revalidatePath("/admin/fil");
  return { ok: true, postId: created.id };
}

// ─────────────────── ADMIN : approve / reject ───────────────────
export async function approveFeedPostAction(postId: number): Promise<{ ok: boolean; error?: string }> {
  const admin_user = await requireAdmin();

  const admin = createSupabaseAdminClient();
  const { data: post, error } = await admin
    .from("feed_posts")
    .update({
      status: "approved",
      approved_by: admin_user.id,
      approved_at: new Date().toISOString(),
      rejection_reason: null,
    })
    .eq("id", postId)
    .select("id, author_id, kind")
    .single();

  if (error || !post) {
    return { ok: false, error: error?.message ?? "Post introuvable." };
  }

  // Notif email à l'auteur
  const { data: author } = await admin
    .from("users")
    .select("email, name")
    .eq("id", post.author_id)
    .maybeSingle();

  if (author?.email) {
    const tpl = feedPostApprovedEmail({
      recipientName: author.name ?? "Vous",
      feedUrl: `${APP_URL}/fil/${post.id}`,
    });
    await sendMail({ to: author.email, subject: tpl.subject, html: tpl.html, text: tpl.text });
  }

  revalidatePath("/fil");
  revalidatePath("/admin/fil");
  return { ok: true };
}

export async function rejectFeedPostAction(
  postId: number,
  reason: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!reason || reason.trim().length < 5) {
    return { ok: false, error: "Une raison de rejet est obligatoire (5 caractères min)." };
  }
  const admin_user = await requireAdmin();

  const admin = createSupabaseAdminClient();
  const { data: post, error } = await admin
    .from("feed_posts")
    .update({
      status: "rejected",
      approved_by: admin_user.id,
      approved_at: new Date().toISOString(),
      rejection_reason: reason.trim().slice(0, 500),
    })
    .eq("id", postId)
    .select("id, author_id, content")
    .single();

  if (error || !post) {
    return { ok: false, error: error?.message ?? "Post introuvable." };
  }

  const { data: author } = await admin
    .from("users")
    .select("email, name")
    .eq("id", post.author_id)
    .maybeSingle();

  if (author?.email) {
    const tpl = feedPostRejectedEmail({
      recipientName: author.name ?? "Vous",
      reason: reason.trim(),
      contentExcerpt: post.content.slice(0, 200),
    });
    await sendMail({ to: author.email, subject: tpl.subject, html: tpl.html, text: tpl.text });
  }

  revalidatePath("/admin/fil");
  return { ok: true };
}

export async function removeFeedPostAction(postId: number): Promise<{ ok: boolean }> {
  await requireAdmin();
  const admin = createSupabaseAdminClient();
  await admin.from("feed_posts").update({ status: "removed" }).eq("id", postId);
  revalidatePath("/fil");
  revalidatePath("/admin/fil");
  return { ok: true };
}

/**
 * Suppression d'un post par son propre auteur (ou un admin).
 * Hard-delete : retire aussi likes + commentaires + signalements via cascade.
 */
/**
 * Repartage d'un post — crée un NOUVEAU feed_post avec repost_of_id renseigné.
 * Le commentaire est optionnel (peut être vide).
 *
 * Anti-chaînage : si l'utilisateur repartage un repost, on enregistre l'id du
 * post original (le grand-père), pas l'intermédiaire.
 */
export async function repostFeedPostAction(args: {
  originalPostId: number;
  comment?: string;
}): Promise<{ ok: boolean; error?: string; postId?: number }> {
  const user = await requireUser();
  if (!user.id) return { ok: false, error: "Compte non trouvé." };
  if (user.validation_status !== "approved") {
    return { ok: false, error: "Votre compte doit être validé pour repartager." };
  }

  const comment = (args.comment ?? "").trim().slice(0, 1000);

  const admin = createSupabaseAdminClient();

  // Récupère le post original — si c'est déjà un repost, on cible le grand-père
  const { data: original } = await admin
    .from("feed_posts")
    .select("id, repost_of_id, status, author_id")
    .eq("id", args.originalPostId)
    .maybeSingle();

  if (!original) return { ok: false, error: "Post introuvable." };
  if (original.status !== "approved") {
    return { ok: false, error: "Ce post n'est plus disponible." };
  }
  if (original.author_id === user.id) {
    return { ok: false, error: "Vous ne pouvez pas repartager votre propre post." };
  }

  const targetId = original.repost_of_id ?? original.id;

  // Anti-spam : pas de double-repost du même post par le même user
  const { data: existing } = await admin
    .from("feed_posts")
    .select("id")
    .eq("author_id", user.id)
    .eq("repost_of_id", targetId)
    .limit(1)
    .maybeSingle();
  if (existing) {
    return { ok: false, error: "Vous avez déjà repartagé ce post." };
  }

  const { data: created, error } = await admin
    .from("feed_posts")
    .insert({
      author_id: user.id,
      kind: "question", // repost utilise kind=question par défaut (peu importe)
      content: comment || null,
      images: [],
      repost_of_id: targetId,
      status: "approved",
      approved_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error || !created) {
    return { ok: false, error: error?.message ?? "Erreur lors du repartage." };
  }

  revalidatePath("/fil");
  return { ok: true, postId: created.id };
}

export async function deleteOwnFeedPostAction(
  postId: number,
): Promise<{ ok: boolean; error?: string }> {
  const user = await requireUser();
  if (!user.id) return { ok: false, error: "Non autorisé." };

  const admin = createSupabaseAdminClient();
  const { data: post, error: fetchErr } = await admin
    .from("feed_posts")
    .select("id, author_id")
    .eq("id", postId)
    .maybeSingle();

  if (fetchErr || !post) return { ok: false, error: "Post introuvable." };
  if (post.author_id !== user.id && user.role !== "admin") {
    return { ok: false, error: "Vous n'êtes pas l'auteur de ce post." };
  }

  const { error: delErr } = await admin.from("feed_posts").delete().eq("id", postId);
  if (delErr) return { ok: false, error: "Erreur suppression : " + delErr.message };

  revalidatePath("/fil");
  revalidatePath("/admin/fil");
  return { ok: true };
}

// ─────────────────── LIKE ───────────────────
export async function toggleLikeAction(postId: number): Promise<{ ok: boolean; liked?: boolean }> {
  const user = await requireUser();
  if (!user.id) return { ok: false };

  const admin = createSupabaseAdminClient();
  const { data: existing } = await admin
    .from("feed_likes")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await admin.from("feed_likes").delete().eq("post_id", postId).eq("user_id", user.id);
    revalidatePath("/fil");
    return { ok: true, liked: false };
  } else {
    await admin.from("feed_likes").insert({ post_id: postId, user_id: user.id });
    revalidatePath("/fil");
    return { ok: true, liked: true };
  }
}

// ─────────────────── COMMENT ───────────────────
export async function addCommentAction(
  _prev: FeedActionState,
  formData: FormData,
): Promise<FeedActionState> {
  const user = await requireUser();
  if (!user.id) return { ok: false, error: "Connexion requise." };

  const postId = Number(formData.get("post_id"));
  const content = formData.get("content")?.toString().trim() ?? "";

  if (!Number.isFinite(postId)) return { ok: false, error: "Post invalide." };
  if (content.length < 2 || content.length > 1500) {
    return { ok: false, error: "Le commentaire doit faire entre 2 et 1500 caractères." };
  }

  // Vérifier que le post existe et est approuvé
  const admin = createSupabaseAdminClient();
  const { data: post } = await admin
    .from("feed_posts")
    .select("id, status")
    .eq("id", postId)
    .maybeSingle();
  if (!post || post.status !== "approved") {
    return { ok: false, error: "Post introuvable." };
  }

  // Anti-spam léger : 1 commentaire/15s
  const recent = new Date(Date.now() - 15 * 1000).toISOString();
  const { count } = await admin
    .from("feed_comments")
    .select("*", { count: "exact", head: true })
    .eq("author_id", user.id)
    .gte("created_at", recent);
  if ((count ?? 0) >= 1) {
    return { ok: false, error: "Veuillez patienter avant de commenter à nouveau." };
  }

  const { error } = await admin
    .from("feed_comments")
    .insert({ post_id: postId, author_id: user.id, content });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/fil");
  revalidatePath(`/fil/${postId}`);
  return { ok: true };
}

export async function removeCommentAction(commentId: number): Promise<{ ok: boolean }> {
  await requireAdmin();
  const admin = createSupabaseAdminClient();
  await admin.from("feed_comments").update({ status: "removed" }).eq("id", commentId);
  revalidatePath("/fil");
  return { ok: true };
}

// ─────────────────── REPORT ───────────────────
export async function reportPostAction(
  postId: number,
  reason: string,
): Promise<{ ok: boolean; error?: string }> {
  const user = await requireUser();
  if (!user.id) return { ok: false, error: "Connexion requise." };
  if (!reason || reason.trim().length < 5) {
    return { ok: false, error: "Veuillez préciser la raison du signalement." };
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("feed_reports").insert({
    post_id: postId,
    reporter_id: user.id,
    reason: reason.trim().slice(0, 500),
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "Vous avez déjà signalé ce post." };
    }
    return { ok: false, error: error.message };
  }
  revalidatePath("/admin/fil");
  return { ok: true };
}

// ─────────────────── REDIRECT after create ───────────────────
export async function redirectAfterCreate(): Promise<never> {
  redirect("/fil?published=1");
}
