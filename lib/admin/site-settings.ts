"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/db/current-user";

/**
 * Lit le flag maintenance depuis la DB.
 * Cached par requête React (via cache()).
 */
export const isMaintenanceEnabledFromDb = cache(async (): Promise<boolean> => {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("site_settings")
    .select("value")
    .eq("key", "maintenance_enabled")
    .maybeSingle();

  if (!data) return false;
  // value est stocké en JSONB : true/false (bool natif) ou "true"/"false" (string)
  const v = data.value as unknown;
  return v === true || v === "true";
});

export type SiteSettingsMeta = {
  maintenanceEnabled: boolean;
  updatedAt: string | null;
  updatedByName: string | null;
};

export const getMaintenanceSettingMeta = cache(async (): Promise<SiteSettingsMeta> => {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("site_settings")
    .select("value, updated_at, updated_by")
    .eq("key", "maintenance_enabled")
    .maybeSingle();

  if (!data) {
    return { maintenanceEnabled: false, updatedAt: null, updatedByName: null };
  }

  let updatedByName: string | null = null;
  if (data.updated_by) {
    const { data: user } = await admin
      .from("users")
      .select("name")
      .eq("id", data.updated_by)
      .maybeSingle();
    updatedByName = user?.name ?? null;
  }

  const v = data.value as unknown;
  return {
    maintenanceEnabled: v === true || v === "true",
    updatedAt: data.updated_at,
    updatedByName,
  };
});

/** Active ou désactive la maintenance. Admin requis. */
export async function setMaintenanceEnabledAction(enabled: boolean): Promise<{ ok: boolean; error?: string }> {
  const me = await requireAdmin();
  if (!me.id) return { ok: false, error: "Admin non trouvé." };

  const admin = createSupabaseAdminClient();
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
