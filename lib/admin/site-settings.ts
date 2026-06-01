import { cache } from "react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Lectures du flag maintenance.
 * Ces fonctions sont des utilitaires server-only (pas des Server Actions).
 * → Pas de "use server" en tête, sinon Next.js les sérialise comme actions
 *   et le cache() React ne fonctionne plus.
 */

export const isMaintenanceEnabledFromDb = cache(async (): Promise<boolean> => {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("site_settings")
    .select("value")
    .eq("key", "maintenance_enabled")
    .maybeSingle();

  if (error) {
    console.error("[isMaintenanceEnabledFromDb]", error);
    return false;
  }
  if (!data) return false;
  const v = data.value as unknown;
  return v === true || v === "true";
});

export type SiteSettingsMeta = {
  maintenanceEnabled: boolean;
  updatedAt: string | null;
  updatedByName: string | null;
  tableExists: boolean;
};

export const getMaintenanceSettingMeta = cache(async (): Promise<SiteSettingsMeta> => {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("site_settings")
    .select("value, updated_at, updated_by")
    .eq("key", "maintenance_enabled")
    .maybeSingle();

  // Si la table n'existe pas → on retourne tableExists=false pour que l'UI
  // puisse afficher un warning explicite.
  if (error) {
    console.error("[getMaintenanceSettingMeta]", error);
    return { maintenanceEnabled: false, updatedAt: null, updatedByName: null, tableExists: false };
  }

  if (!data) {
    return { maintenanceEnabled: false, updatedAt: null, updatedByName: null, tableExists: true };
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
    tableExists: true,
  };
});
