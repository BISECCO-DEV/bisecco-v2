import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";

export type Metier = {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  icon: string | null;
};

export type MetierGrouped = {
  category: string;
  metiers: Metier[];
};

/**
 * Récupère tous les métiers depuis Supabase, triés par nom.
 * Server-side uniquement (Server Components, Route Handlers, Server Actions).
 */
export async function fetchAllMetiers(): Promise<Metier[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
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
 */
export async function fetchMetierBySlug(slug: string): Promise<Metier | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("metiers")
    .select("id, name, slug, category, description, icon")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[fetchMetierBySlug]", error);
    return null;
  }
  return data;
}

/**
 * Compte les métiers (pour stats, debug).
 */
export async function countMetiers(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { count, error } = await supabase
    .from("metiers")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("[countMetiers]", error);
    return 0;
  }
  return count ?? 0;
}
