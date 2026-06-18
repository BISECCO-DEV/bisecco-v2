import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type Metier = {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  icon: string | null;
  cover_url?: string | null;
  cover_alt?: string | null;
};

export type MetierGrouped = {
  category: string;
  metiers: Metier[];
};

/**
 * Récupère tous les métiers depuis Supabase, triés par nom.
 * On utilise l'admin client : table de référence en lecture publique légitime,
 * pas besoin de dépendre des RLS policies.
 */
export async function fetchAllMetiers(): Promise<Metier[]> {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("metiers")
    .select("id, name, slug, category, description, icon")
    .order("name", { ascending: true });

  if (error) {
    console.error("[fetchAllMetiers]", error);
    throw new Error(`Impossible de charger les métiers : ${error.message}`);
  }

  return data ?? [];
}

/**
 * Récupère les métiers groupés par catégorie.
 */
export async function fetchMetiersGroupedByCategory(): Promise<MetierGrouped[]> {
  const metiers = await fetchAllMetiers();
  const byCategory = new Map<string, Metier[]>();

  for (const m of metiers) {
    if (!byCategory.has(m.category)) {
      byCategory.set(m.category, []);
    }
    byCategory.get(m.category)!.push(m);
  }

  return Array.from(byCategory.entries())
    .map(([category, metiers]) => ({ category, metiers }))
    .sort((a, b) => a.category.localeCompare(b.category, "fr"));
}

/**
 * Récupère un métier par son slug (pour pages métier).
 * SELECT défensif : retombe sur l'ancien si migration 025 (cover_url) pas faite.
 */
export async function fetchMetierBySlug(slug: string): Promise<Metier | null> {
  const admin = createSupabaseAdminClient();
  const withCover = await admin
    .from("metiers")
    .select("id, name, slug, category, description, icon, cover_url, cover_alt")
    .eq("slug", slug)
    .maybeSingle();
  if (withCover.error) {
    const fallback = await admin
      .from("metiers")
      .select("id, name, slug, category, description, icon")
      .eq("slug", slug)
      .maybeSingle();
    if (fallback.error) {
      console.error("[fetchMetierBySlug]", fallback.error);
      return null;
    }
    return fallback.data;
  }
  return withCover.data;
}

/**
 * Compte les métiers (pour stats, debug).
 */
export async function countMetiers(): Promise<number> {
  const admin = createSupabaseAdminClient();
  const { count, error } = await admin
    .from("metiers")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("[countMetiers]", error);
    return 0;
  }
  return count ?? 0;
}
