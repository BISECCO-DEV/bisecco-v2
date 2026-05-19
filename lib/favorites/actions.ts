"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentDbUser } from "@/lib/auth/current-user";

/**
 * Toggle favori sur un artisan.
 * @param artisanId id bigint de l'artisan (public.users.id)
 */
export async function toggleFavoriteAction(artisanId: number): Promise<{ favorited: boolean; error?: string }> {
  const me = await getCurrentDbUser();
  if (!me) return { favorited: false, error: "Connexion requise." };
  if (me.id === artisanId) return { favorited: false, error: "Action invalide." };

  const admin = createSupabaseAdminClient();

  const { data: target } = await admin
    .from("users")
    .select("id, role")
    .eq("id", artisanId)
    .single();
  if (!target || target.role !== "artisan") return { favorited: false, error: "Artisan introuvable." };

  const { data: existing } = await admin
    .from("favorites")
    .select("id")
    .eq("user_id", me.id)
    .eq("artisan_id", artisanId)
    .maybeSingle();

  if (existing) {
    await admin.from("favorites").delete().eq("id", existing.id);
    revalidatePath("/mon-profil/favoris");
    revalidatePath(`/profil/${artisanId}`);
    return { favorited: false };
  }

  await admin.from("favorites").insert({ user_id: me.id, artisan_id: artisanId });
  revalidatePath("/mon-profil/favoris");
  revalidatePath(`/profil/${artisanId}`);
  return { favorited: true };
}

export async function hasFavorited(artisanId: number): Promise<boolean> {
  const me = await getCurrentDbUser();
  if (!me) return false;

  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("favorites")
    .select("id")
    .eq("user_id", me.id)
    .eq("artisan_id", artisanId)
    .maybeSingle();
  return !!data;
}
