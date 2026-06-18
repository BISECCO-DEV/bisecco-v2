"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient, findAuthUserByEmail } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/db/current-user";
import { verifySiren } from "@/lib/siren";
import { sendMail } from "@/lib/mail/mailer";
import { accountApprovedEmail, accountRejectedEmail, accountSuspendedEmail } from "@/lib/mail/templates";

/**
 * Toutes ces actions sont des form-actions React 19 → doivent retourner void.
 * En cas d'erreur, on redirige vers la page courante avec ?error=...
 * En cas de succès, on revalidate et on redirige avec ?msg=...
 */

function feedbackRedirect(formData: FormData, params: Record<string, string>): never {
  const back = String(formData.get("_back") ?? "/admin");
  const url = new URL(back, "http://localhost"); // base ignored
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  redirect(url.pathname + "?" + url.searchParams.toString());
}

export async function approveUserAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const userId = Number(formData.get("user_id"));
  if (!userId) feedbackRedirect(formData, { error: "ID manquant" });

  const supabase = createSupabaseAdminClient();

  // Récupérer infos user pour notification
  const { data: user } = await supabase
    .from("users")
    .select("email, name, role")
    .eq("id", userId)
    .maybeSingle();

  const { error } = await supabase
    .from("users")
    .update({
      validation_status: "approved",
      validated_at: new Date().toISOString(),
      validated_by: admin.id,
      rejection_reason: null,
    })
    .eq("id", userId);

  if (error) feedbackRedirect(formData, { error: error.message });

  await supabase
    .from("referrals")
    .update({ status: "validated", validated_at: new Date().toISOString() })
    .eq("referred_user_id", userId)
    .eq("status", "signed_up");

  // Envoyer email de notification "compte validé"
  if (user?.email && user.name) {
    const role = (user.role === "artisan" ? "artisan" : "particulier") as "particulier" | "artisan";
    const tpl = accountApprovedEmail({ name: user.name, role });
    await sendMail({ to: user.email, subject: tpl.subject, html: tpl.html, text: tpl.text });
  }

  revalidatePath("/admin", "layout");
  feedbackRedirect(formData, { msg: "Compte validé. Email de confirmation envoyé." });
}

export async function rejectUserAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const userId = Number(formData.get("user_id"));
  const reason = String(formData.get("reason") ?? "").trim();
  if (!userId) feedbackRedirect(formData, { error: "ID manquant" });
  if (!reason) feedbackRedirect(formData, { error: "Motif obligatoire" });

  const supabase = createSupabaseAdminClient();
  const { data: user } = await supabase
    .from("users").select("email, name").eq("id", userId).maybeSingle();

  const { error } = await supabase
    .from("users")
    .update({
      validation_status: "rejected",
      validated_at: new Date().toISOString(),
      validated_by: admin.id,
      rejection_reason: reason,
    })
    .eq("id", userId);

  if (error) feedbackRedirect(formData, { error: error.message });

  if (user?.email && user.name) {
    const tpl = accountRejectedEmail({ name: user.name, reason });
    await sendMail({ to: user.email, subject: tpl.subject, html: tpl.html, text: tpl.text });
  }

  revalidatePath("/admin", "layout");
  feedbackRedirect(formData, { msg: "Compte rejeté. Email envoyé." });
}

export async function recheckSirenAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const userId = Number(formData.get("user_id"));
  if (!userId) feedbackRedirect(formData, { error: "ID manquant" });

  const supabase = createSupabaseAdminClient();
  const { data: user } = await supabase
    .from("users").select("siren").eq("id", userId).maybeSingle();
  if (!user?.siren) feedbackRedirect(formData, { error: "Pas de SIREN" });

  const check = await verifySiren(user!.siren!);
  await supabase
    .from("users")
    .update({
      siren_status: check.status,
      siren_last_checked_at: new Date().toISOString(),
      siren_closed_at: check.closed_at,
    })
    .eq("id", userId);

  revalidatePath("/admin", "layout");
  feedbackRedirect(formData, {
    msg: check.found
      ? `SIREN ${check.status === "A" ? "ACTIF" : "CESSÉ"} · ${check.company_name ?? "?"}`
      : "SIREN introuvable au registre",
  });
}

export async function suspendUserAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const userId = Number(formData.get("user_id"));
  if (!userId) feedbackRedirect(formData, { error: "ID manquant" });

  const supabase = createSupabaseAdminClient();
  const { data: user } = await supabase
    .from("users").select("email, name").eq("id", userId).maybeSingle();

  const { error } = await supabase
    .from("users")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) feedbackRedirect(formData, { error: error.message });

  if (user?.email && user.name) {
    const tpl = accountSuspendedEmail({ name: user.name });
    await sendMail({ to: user.email, subject: tpl.subject, html: tpl.html, text: tpl.text });
  }

  revalidatePath("/admin", "layout");
  feedbackRedirect(formData, { msg: "Compte suspendu. Email envoyé." });
}

/**
 * Suppression DÉFINITIVE d'un compte utilisateur (admin only).
 * Supprime en cascade : public.users + auth.users + données liées.
 *
 * ⚠️ Action IRRÉVERSIBLE. Requiert :
 * - Auth admin
 * - Confirmation côté form (champ `confirm_email` doit matcher l'email du user)
 * - Le user ne doit pas être admin/super_admin (sécurité)
 */
export async function hardDeleteUserAction(formData: FormData): Promise<void> {
  const me = await requireAdmin();
  const userId = Number(formData.get("user_id"));
  if (!userId) feedbackRedirect(formData, { error: "ID manquant" });

  const supabase = createSupabaseAdminClient();

  // Récupère le user à supprimer
  const { data: target } = await supabase
    .from("users")
    .select("id, email, name, role")
    .eq("id", userId)
    .maybeSingle();

  if (!target) feedbackRedirect(formData, { error: "Utilisateur introuvable" });

  // Sécurité : pas de suppression d'admin/super_admin (protection)
  if (target!.role === "admin" || target!.role === "super_admin") {
    feedbackRedirect(formData, { error: "Impossible de supprimer un admin" });
  }

  // Sécurité : pas d'auto-suppression
  if (target!.id === me.id) {
    feedbackRedirect(formData, { error: "Vous ne pouvez pas supprimer votre propre compte" });
  }

  // 1. Trouver le auth_user_id correspondant via email
  const authUser = await findAuthUserByEmail(supabase, target!.email);

  // 2. Supprimer manuellement les données liées qui ne sont pas en CASCADE
  //    (la plupart sont en ON DELETE CASCADE déjà, mais on nettoie les orphelins)
  await supabase.from("messages").delete().eq("sender_id", target!.id);
  await supabase.from("message_threads").delete().or(`user_a_id.eq.${target!.id},user_b_id.eq.${target!.id}`);
  await supabase.from("quote_requests").delete().or(`client_id.eq.${target!.id},artisan_id.eq.${target!.id}`);
  await supabase.from("reviews").delete().eq("user_id", target!.id);
  await supabase.from("favorites").delete().eq("user_id", target!.id);
  await supabase.from("app_notifications").delete().eq("user_id", target!.id);
  await supabase.from("profile_reports").delete().or(`reporter_id.eq.${target!.id},reported_user_id.eq.${target!.id}`);
  await supabase.from("cv_submissions").delete().or(`recipient_user_id.eq.${target!.id},sender_user_id.eq.${target!.id}`);
  await supabase.from("referrals").delete().or(`referrer_user_id.eq.${target!.id},referred_user_id.eq.${target!.id}`);
  await supabase.from("password_resets").delete().eq("email", target!.email);
  await supabase.from("chat_conversations").delete().eq("user_id", target!.id);

  // 3. Supprimer le profil artisan (cascade vers galerie + métiers)
  await supabase.from("artisan_profiles").delete().eq("user_id", target!.id);

  // 4. Supprimer public.users
  const { error: pubErr } = await supabase.from("users").delete().eq("id", target!.id);
  if (pubErr) {
    feedbackRedirect(formData, { error: `Erreur suppression public.users : ${pubErr.message}` });
  }

  // 5. Supprimer auth.users (si trouvé)
  if (authUser) {
    const { error: authErr } = await supabase.auth.admin.deleteUser(authUser.id);
    if (authErr) {
      console.error("[hardDelete] auth delete failed:", authErr.message);
      // Le public est déjà supprimé, on continue malgré l'erreur auth
    }
  }

  // 6. Log de l'action admin (audit trail)
  await supabase.from("admin_audit_logs").insert({
    admin_id: me.id,
    action: "hard_delete_user",
    target_type: "user",
    target_id: target!.id,
    details: { email: target!.email, name: target!.name, role: target!.role },
  });

  revalidatePath("/admin/utilisateurs", "layout");
  redirect(`/admin/utilisateurs?msg=${encodeURIComponent(`Compte ${target!.email} supprimé définitivement.`)}`);
}

export async function restoreUserAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const userId = Number(formData.get("user_id"));
  if (!userId) feedbackRedirect(formData, { error: "ID manquant" });

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("users").update({ deleted_at: null }).eq("id", userId);

  if (error) feedbackRedirect(formData, { error: error.message });
  revalidatePath("/admin", "layout");
  feedbackRedirect(formData, { msg: "Compte restauré." });
}

export async function toggleReviewFlagAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const reviewId = Number(formData.get("review_id"));
  const flag = formData.get("flag") === "true";
  if (!reviewId) feedbackRedirect(formData, { error: "ID manquant" });

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("reviews").update({ is_flagged: flag }).eq("id", reviewId);

  if (error) feedbackRedirect(formData, { error: error.message });
  revalidatePath("/admin/avis");
  feedbackRedirect(formData, { msg: flag ? "Avis masqué." : "Avis rétabli." });
}

export async function deleteReviewAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const reviewId = Number(formData.get("review_id"));
  if (!reviewId) feedbackRedirect(formData, { error: "ID manquant" });

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("reviews").delete().eq("id", reviewId);

  if (error) feedbackRedirect(formData, { error: error.message });
  revalidatePath("/admin/avis");
  feedbackRedirect(formData, { msg: "Avis supprimé." });
}

export async function createMetierAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const icon = String(formData.get("icon") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;

  if (!name || !category) feedbackRedirect(formData, { error: "Nom et catégorie obligatoires" });

  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("metiers")
    .insert({ name, slug, category, icon, description });

  if (error) feedbackRedirect(formData, { error: error.message });
  revalidatePath("/admin/metiers");
  feedbackRedirect(formData, { msg: `Métier "${name}" créé.` });
}

export async function updateMetierAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const icon = String(formData.get("icon") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;

  if (!id || !name || !category) feedbackRedirect(formData, { error: "Champs manquants" });

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("metiers")
    .update({ name, category, icon, description })
    .eq("id", id);

  if (error) feedbackRedirect(formData, { error: error.message });
  revalidatePath("/admin/metiers");
  feedbackRedirect(formData, { msg: "Métier mis à jour." });
}

export async function deleteMetierAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!id) feedbackRedirect(formData, { error: "ID manquant" });

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("metiers").delete().eq("id", id);

  if (error) feedbackRedirect(formData, { error: error.message });
  revalidatePath("/admin/metiers");
  feedbackRedirect(formData, { msg: "Métier supprimé." });
}
