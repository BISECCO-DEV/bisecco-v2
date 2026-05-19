"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/db/current-user";
import { verifySiren } from "@/lib/siren";

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

  revalidatePath("/admin", "layout");
  feedbackRedirect(formData, { msg: "Artisan validé." });
}

export async function rejectUserAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const userId = Number(formData.get("user_id"));
  const reason = String(formData.get("reason") ?? "").trim();
  if (!userId) feedbackRedirect(formData, { error: "ID manquant" });
  if (!reason) feedbackRedirect(formData, { error: "Motif obligatoire" });

  const supabase = createSupabaseAdminClient();
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
  revalidatePath("/admin", "layout");
  feedbackRedirect(formData, { msg: "Compte rejeté." });
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
  const { error } = await supabase
    .from("users")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) feedbackRedirect(formData, { error: error.message });
  revalidatePath("/admin", "layout");
  feedbackRedirect(formData, { msg: "Compte suspendu." });
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
