"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentDbUser } from "@/lib/auth/current-user";
import { pushNotification } from "@/lib/notifications/actions";
import { sendMail } from "@/lib/mail/mailer";
import { newReviewEmail } from "@/lib/mail/templates";

const APP_URL_BASE = process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://bisecco.fr";

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
    .select("id, role, client_number, artisan_profiles(id)")
    .eq("id", artisanId)
    .single();

  if (!artisan || artisan.role !== "artisan") return { error: "Artisan introuvable." };
  if (me.id === artisanId) return { error: "Vous ne pouvez pas vous noter." };

  const profileId = Array.isArray(artisan.artisan_profiles)
    ? (artisan.artisan_profiles[0] as { id?: number } | undefined)?.id
    : (artisan.artisan_profiles as { id?: number } | null)?.id;
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

  await pushNotification(
    artisanId,
    "review_received",
    "Nouvel avis sur votre profil",
    `Vous avez reçu une note ${rating}/5`,
    profilePath,
    "⭐",
  );

  revalidatePath(profilePath);
  redirect(`${profilePath}?review=submitted`);
}

/** Admin: approuve un avis */
export async function approveReviewAction(reviewId: number) {
  const me = await getCurrentDbUser();
  if (!me || (me.role !== "admin" && me.role !== "super_admin")) return { ok: false };

  const admin = createSupabaseAdminClient();
  const { data: review } = await admin
    .from("reviews")
    .select("id, user_id, artisan_profile_id, artisan_profiles(user_id)")
    .eq("id", reviewId)
    .single();

  await admin.from("reviews")
    .update({ status: "approved", moderated_at: new Date().toISOString(), moderated_by: me.id })
    .eq("id", reviewId);

  if (review?.user_id) {
    const artisanUserId = Array.isArray(review.artisan_profiles)
      ? (review.artisan_profiles[0] as { user_id?: number } | undefined)?.user_id
      : (review.artisan_profiles as { user_id?: number } | null)?.user_id;
    await pushNotification(
      review.user_id,
      "review_approved",
      "Votre avis a été publié",
      "Il est désormais visible sur le profil de l'artisan.",
      artisanUserId ? `/profil/${artisanUserId}` : "/mon-profil/avis",
      "✅",
    );

    // Email à l'artisan ciblé pour l'informer du nouvel avis publié
    if (artisanUserId) {
      const { data: full } = await admin
        .from("reviews")
        .select("rating, comment, artisan_profiles(users(name, email, client_number))")
        .eq("id", reviewId)
        .maybeSingle();
      type ProfileUser = { name: string | null; email: string | null; client_number: string | null };
      const profileUsersRaw = full && (full as unknown as { artisan_profiles: { users: ProfileUser | ProfileUser[] } | null }).artisan_profiles?.users;
      const profileUser: ProfileUser | undefined = Array.isArray(profileUsersRaw) ? profileUsersRaw[0] : profileUsersRaw ?? undefined;
      if (profileUser?.email && profileUser.name) {
        const tpl = newReviewEmail({
          profileName: profileUser.name,
          rating: (full as unknown as { rating: number }).rating,
          comment: (full as unknown as { comment: string | null }).comment,
          profileUrl: `${APP_URL_BASE}/profil/${profileUser.client_number ?? artisanUserId}`,
        });
        await sendMail({ to: profileUser.email, subject: tpl.subject, html: tpl.html, text: tpl.text });
      }
    }
  }

  revalidatePath("/admin/avis");
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
