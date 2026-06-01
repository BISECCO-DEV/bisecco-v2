"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/db/current-user";

/** Active ou désactive la maintenance. Admin requis. */
export async function setMaintenanceEnabledAction(
  enabled: boolean,
): Promise<{ ok: boolean; error?: string }> {
  let me;
  try {
    me = await requireAdmin();
  } catch {
    return { ok: false, error: "Admin requis (vérifie que tu es bien connecté)." };
  }
  if (!me.id) return { ok: false, error: "Admin non trouvé en DB." };

  const admin = createSupabaseAdminClient();

  // Pré-check : la table existe-t-elle ?
  const { error: probeError } = await admin
    .from("site_settings")
    .select("key")
    .limit(1);

  if (probeError) {
    if (probeError.message?.includes("does not exist") || probeError.code === "42P01") {
      return {
        ok: false,
        error: "Table site_settings absente. Exécute la migration db/018_site_settings.sql dans Supabase.",
      };
    }
    return { ok: false, error: `DB : ${probeError.message}` };
  }

  const { error } = await admin
    .from("site_settings")
    .upsert(
      {
        key: "maintenance_enabled",
        value: enabled,
        updated_at: new Date().toISOString(),
        updated_by: me.id,
      },
      { onConflict: "key" },
    );

  if (error) {
    console.error("[setMaintenanceEnabledAction]", error);
    return { ok: false, error: error.message };
  }

  // Force le re-render de toutes les pages (le bandeau admin doit refléter l'état)
  revalidatePath("/", "layout");
  return { ok: true };
}
