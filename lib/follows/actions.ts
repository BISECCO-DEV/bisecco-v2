"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/db/current-user";
import { pushNotification } from "@/lib/notifications/actions";

export type FollowResult = { ok: true; following: boolean } | { ok: false; error: string };

/**
 * Toggle l'abonnement courant → targetUserId.
 * - Si pas encore abonné → crée la ligne + notification au suivi
 * - Si déjà abonné → supprime la ligne
 * Retourne le nouvel état `following`.
 */
export async function toggleFollowAction(targetUserId: number): Promise<FollowResult> {
  const me = await getCurrentUser();
  if (!me?.id) return { ok: false, error: "Connexion requise." };
  if (me.id === targetUserId) return { ok: false, error: "Vous ne pouvez pas vous abonner à vous-même." };

  const admin = createSupabaseAdminClient();

  // Vérifie la cible existe et n'est pas supprimée
  const { data: target } = await admin
    .from("users")
    .select("id, name, client_number")
    .eq("id", targetUserId)
    .is("deleted_at", null)
    .maybeSingle();
  if (!target) return { ok: false, error: "Utilisateur introuvable." };

  // Existe-t-il déjà ?
  const { data: existing } = await admin
    .from("user_follows")
    .select("id")
    .eq("follower_id", me.id)
    .eq("followed_id", targetUserId)
    .maybeSingle();

  if (existing) {
    // Désabonnement
    await admin.from("user_follows").delete().eq("id", existing.id);
    if (target.client_number) revalidatePath(`/profil/${target.client_number}`);
    return { ok: true, following: false };
  }

  // Abonnement
  const { error } = await admin.from("user_follows").insert({
    follower_id: me.id,
    followed_id: targetUserId,
  });
  if (error) return { ok: false, error: error.message };

  // Notification au user suivi
  try {
    await pushNotification(
      targetUserId,
      "new_follower",
      `${me.display_name || me.name} vous suit maintenant`,
      `Découvrez son profil et abonnez-vous en retour.`,
      me.client_number ? `/profil/${me.client_number}` : "/fil",
      "👥",
    );
  } catch {
    /* notification optionnelle */
  }

  if (target.client_number) revalidatePath(`/profil/${target.client_number}`);
  return { ok: true, following: true };
}

/** Compte les abonnés (followers) d'un utilisateur. */
export async function countFollowers(userId: number): Promise<number> {
  const admin = createSupabaseAdminClient();
  const { count } = await admin
    .from("user_follows")
    .select("*", { count: "exact", head: true })
    .eq("followed_id", userId);
  return count ?? 0;
}

/** Compte les abonnements (qui suit cet utilisateur). */
export async function countFollowing(userId: number): Promise<number> {
  const admin = createSupabaseAdminClient();
  const { count } = await admin
    .from("user_follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", userId);
  return count ?? 0;
}

/** True si followerId suit déjà followedId. */
export async function isFollowing(followerId: number, followedId: number): Promise<boolean> {
  if (followerId === followedId) return false;
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("user_follows")
    .select("id")
    .eq("follower_id", followerId)
    .eq("followed_id", followedId)
    .maybeSingle();
  return Boolean(data);
}
