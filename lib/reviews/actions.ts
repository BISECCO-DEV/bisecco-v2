"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentDbUser } from "@/lib/auth/current-user";
import { pushNotification } from "@/lib/notifications/actions";
import { sendMail } from "@/lib/mail/mailer";
import { newReviewEmail, newReviewToModerateEmail, reviewApprovedEmail } from "@/lib/mail/templates";

const APP_URL_BASE = process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://bisecco.fr";
const CONTACT_INBOX = process.env.CONTACT_INBOX || "contact@bisecco.fr";

export type ReviewState = { error?: string; success?: string } | undefined;

/** Poster un avis · modération obligatoire avant publication */
export async function submitReviewAction(_prev: ReviewState, formData: FormData): Promise<ReviewState> {
  const me = await getCurrentDbUser();
  if (!me) return { error: "Connexion requise." };

  const artisanIdRaw = formData.get("artisan_id")?.toString();
  const artisanId = parseInt(artisanIdRaw ?? "", 10);
  const ratingRaw = formData.get("rating")?.toString();
  const comment = formData.get("comment")?.toString().trim();
  const quoteRequestIdRaw = formData.get("quote_request_id")?.toString();

  const rating = parseInt(ratingRaw ?? "", 10);
  if (!artisanId) return { error: "Artisan invalide." };
  if (!rating || rating < 1 || rating > 5) return { error: "Note invalide (1-5)." };
  if (!comment || comment.length < 30) return { error: "Commentaire trop court (30 caractères min)." };

  const admin = createSupabaseAdminClient();

  const { data: artisan } = await admin
    .from("users")
    .select("id, name, role, client_number, artisan_profiles(id, company_name)")
    .eq("id", artisanId)
    .single();

  if (!artisan || artisan.role !== "artisan") return { error: "Artisan introuvable." };
  if (me.id === artisanId) return { error: "Vous ne pouvez pas vous noter." };

  const profileRow = Array.isArray(artisan.artisan_profiles)
    ? (artisan.artisan_profiles[0] as { id?: number; company_name?: string | null } | undefined)
    : (artisan.artisan_profiles as { id?: number; company_name?: string | null } | null);
  const profileId = profileRow?.id;
  const artisanDisplayName = profileRow?.company_name?.trim() || artisan.name || "Pro";
  if (!profileId) return { error: "Profil artisan incomplet." };

  const { data: existing } = await admin
    .from("reviews")
    .select("id")
    .eq("artisan_profile_id", profileId)
    .eq("user_id", me.id)
    .maybeSingle();
  if (existing) return { error: "Vous avez déjà laissé un avis pour cet artisan." };

  let quoteId: number | null = null;
  if (quoteRequestIdRaw) {
    const qid = parseInt(quoteRequestIdRaw, 10);
    const { data: q } = await admin
      .from("quote_requests")
      .select("id, client_id, artisan_id")
      .eq("id", qid)
      .single();
    if (q && q.client_id === me.id && q.artisan_id === artisanId) {
      quoteId = q.id;
    }
  }

  // ─── L'avis est créé en STATUS=PENDING : il faut une validation admin
  //     avant qu'il soit visible publiquement. ─────────────────────────
  await admin.from("reviews").insert({
    artisan_profile_id: profileId,
    user_id: me.id,
    quote_request_id: quoteId,
    rating,
    comment,
    status: "pending",
    is_flagged: false,
  });

  // L'URL publique du profil utilise client_number, pas l'id numérique.
  const profilePath = `/profil/${artisan.client_number ?? artisanId}`;

  // ─── Notifier l'ÉQUIPE ADMIN (notif in-app + email) ─────────────────
  // L'artisan ciblé sera notifié SEULEMENT à l'approbation (voir approveReviewAction).
  await notifyAdminsNewReview({
    reviewerName: me.name ?? "Un utilisateur",
    artisanName: artisanDisplayName,
    rating,
    comment: comment ?? null,
  });

  revalidatePath(profilePath);
  revalidatePath("/admin/avis");
  redirect(`${profilePath}?review=submitted`);
}

/**
 * Envoie une notification IN-APP à TOUS les admins + un email à CONTACT_INBOX
 * pour signaler qu'un nouvel avis attend d'être modéré.
 */
async function notifyAdminsNewReview(opts: {
  reviewerName: string;
  artisanName: string;
  rating: number;
  comment: string | null;
}): Promise<void> {
  try {
    const admin = createSupabaseAdminClient();
    const moderationUrl = `${APP_URL_BASE}/admin/avis?filter=pending`;

    // 1) Notif in-app à tous les admins
    const { data: admins } = await admin
      .from("users")
      .select("id")
      .eq("role", "admin")
      .is("deleted_at", null);

    if (admins && admins.length > 0) {
      await Promise.all(
        admins.map((a) =>
          pushNotification(
            a.id,
            "review_to_moderate",
            "Nouvel avis à modérer",
            `${opts.reviewerName} a noté ${opts.artisanName} (${opts.rating}/5)`,
            "/admin/avis?filter=pending",
            "🛡️",
          ),
        ),
      );
    }

    // 2) Email à la boîte contact (équipe modération)
    const tpl = newReviewToModerateEmail({
      reviewerName: opts.reviewerName,
      artisanName: opts.artisanName,
      rating: opts.rating,
      comment: opts.comment,
      moderationUrl,
    });
    await sendMail({ to: CONTACT_INBOX, subject: tpl.subject, html: tpl.html, text: tpl.text });
  } catch {
    // best-effort : on ne bloque jamais la création de l'avis sur ces notifs
  }
}

/** Admin: approuve un avis */
export async function approveReviewAction(reviewId: number) {
  const me = await getCurrentDbUser();
  if (!me || (me.role !== "admin" && me.role !== "super_admin")) return { ok: false };

  const admin = createSupabaseAdminClient();
  const { data: review } = await admin
    .from("reviews")
    .select("id, rating, comment, user_id, artisan_profile_id, artisan_profiles(user_id, company_name, users(name, email, client_number))")
    .eq("id", reviewId)
    .single();

  await admin.from("reviews")
    .update({ status: "approved", moderated_at: new Date().toISOString(), moderated_by: me.id })
    .eq("id", reviewId);

  type ProfileUser = { name: string | null; email: string | null; client_number: string | null };
  type ProfileRow = { user_id?: number; company_name?: string | null; users: ProfileUser | ProfileUser[] | null };

  const profileRow = Array.isArray(review?.artisan_profiles)
    ? (review!.artisan_profiles[0] as unknown as ProfileRow | undefined)
    : (review?.artisan_profiles as unknown as ProfileRow | null);
  const artisanUserId = profileRow?.user_id;
  const profileUsersRaw = profileRow?.users;
  const proUser: ProfileUser | undefined = Array.isArray(profileUsersRaw)
    ? profileUsersRaw[0]
    : profileUsersRaw ?? undefined;
  const proDisplayName = profileRow?.company_name?.trim() || proUser?.name || "Pro";
  const proPublicUrl = `${APP_URL_BASE}/profil/${proUser?.client_number ?? artisanUserId ?? ""}`;

  // ─── 1) Notif + email à l'ARTISAN qui a reçu l'avis ─────────────────
  if (artisanUserId) {
    await pushNotification(
      artisanUserId,
      "review_received",
      `Nouvel avis ${review!.rating}★ sur votre profil`,
      review?.comment?.slice(0, 100) ?? `Note ${review?.rating}/5`,
      `/profil/${proUser?.client_number ?? artisanUserId}`,
      "⭐",
    );

    if (proUser?.email && proUser.name) {
      const tpl = newReviewEmail({
        profileName: proUser.name,
        rating: review!.rating,
        comment: review!.comment,
        profileUrl: proPublicUrl,
      });
      await sendMail({ to: proUser.email, subject: tpl.subject, html: tpl.html, text: tpl.text }).catch(() => null);
    }
  }

  // ─── 2) Notif + email au CLIENT qui a posté l'avis ──────────────────
  if (review?.user_id) {
    await pushNotification(
      review.user_id,
      "review_approved",
      "Ton avis a été publié",
      `Il est désormais visible sur le profil de ${proDisplayName}.`,
      `/profil/${proUser?.client_number ?? artisanUserId ?? ""}`,
      "✅",
    );

    const { data: client } = await admin
      .from("users")
      .select("name, email")
      .eq("id", review.user_id)
      .maybeSingle();
    if (client?.email && client.name) {
      const tpl = reviewApprovedEmail({
        clientName: client.name,
        artisanName: proDisplayName,
        profileUrl: proPublicUrl,
      });
      await sendMail({ to: client.email, subject: tpl.subject, html: tpl.html, text: tpl.text }).catch(() => null);
    }
  }

  revalidatePath("/admin/avis");
  revalidatePath(`/profil/${proUser?.client_number ?? artisanUserId ?? ""}`);
  return { ok: true };
}

/** Admin: rejette un avis */
export async function rejectReviewAction(reviewId: number, note?: string) {
  const me = await getCurrentDbUser();
  if (!me || (me.role !== "admin" && me.role !== "super_admin")) return { ok: false };

  const admin = createSupabaseAdminClient();
  await admin.from("reviews")
    .update({
      status: "rejected",
      moderated_at: new Date().toISOString(),
      moderated_by: me.id,
      moderation_note: note ?? null,
    })
    .eq("id", reviewId);

  revalidatePath("/admin/avis");
  return { ok: true };
}
