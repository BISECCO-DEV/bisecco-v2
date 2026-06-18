"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/db/current-user";

export type BlockActionState = { ok?: boolean; error?: string };

export type BlockedUser = {
  id: number;
  name: string;
  city: string | null;
  role: string;
  reason: string | null;
  blockedAt: string;
};

/** Bloque un user. La conversation reste en DB, mais devient inaccessible. */
export async function blockUserAction(
  _prev: BlockActionState | undefined,
  formData: FormData,
): Promise<BlockActionState> {
  const me = await getCurrentUser();
  if (!me || me.id == null) return { error: "Connexion requise." };

  const blockedId = Number(formData.get("blocked_id"));
  const reason = String(formData.get("reason") ?? "").trim().slice(0, 500) || null;

  if (!Number.isFinite(blockedId) || blockedId <= 0) return { error: "Utilisateur invalide." };
  if (blockedId === me.id) return { error: "Vous ne pouvez pas vous bloquer vous-même." };

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("user_blocks")
    .upsert(
      { blocker_id: me.id, blocked_id: blockedId, reason },
      { onConflict: "blocker_id,blocked_id" },
    );

  if (error) return { error: "Impossible de bloquer cet utilisateur." };

  revalidatePath("/messagerie");
  revalidatePath("/mon-profil/parametres");
  return { ok: true };
}

/** Débloque un user. */
export async function unblockUserAction(
  _prev: BlockActionState | undefined,
  formData: FormData,
): Promise<BlockActionState> {
  const me = await getCurrentUser();
  if (!me || me.id == null) return { error: "Connexion requise." };

  const blockedId = Number(formData.get("blocked_id"));
  if (!Number.isFinite(blockedId)) return { error: "ID invalide." };

  const admin = createSupabaseAdminClient();
  await admin
    .from("user_blocks")
    .delete()
    .eq("blocker_id", me.id)
    .eq("blocked_id", blockedId);

  revalidatePath("/messagerie");
  revalidatePath("/mon-profil/parametres");
  return { ok: true };
}

/** Liste des users bloqués par le user connecté. */
export async function listBlockedUsers(): Promise<BlockedUser[]> {
  const me = await getCurrentUser();
  if (!me || me.id == null) return [];

  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("user_blocks")
    .select("blocked_id, reason, created_at, users!user_blocks_blocked_id_fkey(name, city, role)")
    .eq("blocker_id", me.id)
    .order("created_at", { ascending: false });

  type Row = {
    blocked_id: number;
    reason: string | null;
    created_at: string;
    users: { name: string; city: string | null; role: string } | { name: string; city: string | null; role: string }[] | null;
  };

  return ((data ?? []) as Row[]).map((r) => {
    const u = Array.isArray(r.users) ? r.users[0] : r.users;
    return {
      id: r.blocked_id,
      name: u?.name ?? "Utilisateur",
      city: u?.city ?? null,
      role: u?.role ?? "particulier",
      reason: r.reason,
      blockedAt: r.created_at,
    };
  });
}

/**
 * Helper synchrone (utilisable dans d'autres server actions) :
 * vérifie si A a bloqué B ou si B a bloqué A.
 */
export async function isBlockedBetween(userIdA: number, userIdB: number): Promise<boolean> {
  const admin = createSupabaseAdminClient();
  const { count } = await admin
    .from("user_blocks")
    .select("id", { count: "exact", head: true })
    .or(`and(blocker_id.eq.${userIdA},blocked_id.eq.${userIdB}),and(blocker_id.eq.${userIdB},blocked_id.eq.${userIdA})`);
  return (count ?? 0) > 0;
}
