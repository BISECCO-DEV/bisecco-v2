import { cache } from "react";
import { fetchAllMetiers } from "./metiers";
import type { MetierOption } from "@/lib/metiers";

/**
 * Charge les métiers depuis la DB et les convertit au format attendu par
 * `MetierCombobox` / `MultiMetierPicker`. Mis en cache par requête React
 * pour éviter N hits Supabase si plusieurs composants en ont besoin.
 *
 * Usage : à appeler depuis un Server Component, puis passer en prop
 * `options` au combobox client.
 */
export const getMetierOptions = cache(async (): Promise<MetierOption[]> => {
  try {
    const metiers = await fetchAllMetiers();
    return metiers.map((m) => ({
      name: m.name,
      category: m.category ?? "Autre",
      icon: m.icon ?? "🛠️",
    }));
  } catch (e) {
    console.error("[getMetierOptions] fallback to empty list", e);
    return [];
  }
});
