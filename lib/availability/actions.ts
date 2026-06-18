"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/db/current-user";
import type { AvailabilitySlot } from "./utils";

export type AvailabilityActionState = { ok?: boolean; error?: string };

/** Format un time 'HH:MM:SS' en 'HH:MM' (sans secondes). */
function trimTime(t: string): string {
  return t.slice(0, 5);
}

/** Liste les créneaux d'un user. */
export async function listAvailability(userId: number): Promise<AvailabilitySlot[]> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("pro_availability")
    .select("id, day_of_week, start_time, end_time")
    .eq("user_id", userId)
    .order("day_of_week", { ascending: true })
    .order("start_time", { ascending: true });

  return ((data ?? []) as { id: number; day_of_week: number; start_time: string; end_time: string }[])
    .map((r) => ({
      id: r.id,
      day_of_week: r.day_of_week,
      start_time: trimTime(r.start_time),
      end_time: trimTime(r.end_time),
    }));
}

export async function listMyAvailability(): Promise<AvailabilitySlot[]> {
  const me = await getCurrentUser();
  if (!me || me.id == null) return [];
  return listAvailability(me.id);
}

/**
 * Remplace TOUS les créneaux du user connecté par la liste fournie.
 *
 * Payload formData :
 *   slots = JSON string : Array<{day_of_week, start_time, end_time}>
 */
export async function saveAvailabilityAction(
  _prev: AvailabilityActionState | undefined,
  formData: FormData,
): Promise<AvailabilityActionState> {
  const me = await getCurrentUser();
  if (!me || me.id == null) return { error: "Connexion requise." };
  if (me.role !== "artisan") return { error: "Réservé aux pros." };

  const raw = String(formData.get("slots") ?? "[]");
  let parsed: Array<{ day_of_week?: unknown; start_time?: unknown; end_time?: unknown }>;
  try {
    parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error();
  } catch {
    return { error: "Format invalide." };
  }

  // Validation
  const cleaned: { user_id: number; day_of_week: number; start_time: string; end_time: string }[] = [];
  for (const slot of parsed) {
    const day = Number(slot.day_of_week);
    const start = String(slot.start_time ?? "");
    const end = String(slot.end_time ?? "");
    if (!Number.isInteger(day) || day < 0 || day > 6) continue;
    if (!/^\d{2}:\d{2}$/.test(start) || !/^\d{2}:\d{2}$/.test(end)) continue;
    if (start >= end) continue;
    cleaned.push({
      user_id: me.id,
      day_of_week: day,
      start_time: `${start}:00`,
      end_time: `${end}:00`,
    });
    if (cleaned.length >= 30) break; // garde-fou
  }

  const admin = createSupabaseAdminClient();
  // Remplacement atomique : delete + insert
  await admin.from("pro_availability").delete().eq("user_id", me.id);
  if (cleaned.length > 0) {
    const { error } = await admin.from("pro_availability").insert(cleaned);
    if (error) return { error: "Erreur lors de l'enregistrement." };
  }

  revalidatePath("/mon-profil/edit");
  revalidatePath(`/profil/${me.client_number}`);
  return { ok: true };
}

