import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { CvData } from "@/lib/cv/schema";

export type CvWithUser = {
  id: number;
  client_number: string | null;
  name: string;
  city: string | null;
  profile_photo: string | null;
  cv_data: CvData | null;
  cv_metier_id: number | null;
  cv_title: string | null;
  cv_about: string | null;
  cv_search_city: string | null;
  cv_search_radius: number | null;
  cv_available_from: string | null;
  cv_updated_at: string | null;
  metier: { id: number; name: string; slug: string; icon: string | null; category: string } | null;
};

export type CvFilter = {
  metierSlug?: string;
  city?: string;
  q?: string;
};

export async function fetchPublishedCvs(filter: CvFilter = {}): Promise<CvWithUser[]> {
  const supabase = createSupabaseAdminClient();

  let query = supabase
    .from("users")
    .select(`
      id, client_number, name, city, profile_photo,
      cv_data, cv_metier_id, cv_title, cv_about,
      cv_search_city, cv_search_radius, cv_available_from, cv_updated_at,
      metier:cv_metier_id (id, name, slug, icon, category)
    `)
    .eq("cv_published", true)
    .is("deleted_at", null)
    .order("cv_updated_at", { ascending: false });

  if (filter.metierSlug) {
    const { data: m } = await supabase
      .from("metiers")
      .select("id")
      .eq("slug", filter.metierSlug)
      .maybeSingle();
    if (m) query = query.eq("cv_metier_id", m.id);
  }
  if (filter.city) {
    query = query.ilike("cv_search_city", `%${filter.city}%`);
  }
  if (filter.q) {
    const q = `%${filter.q}%`;
    query = query.or(`name.ilike.${q},cv_title.ilike.${q},cv_about.ilike.${q}`);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[fetchPublishedCvs]", error);
    return [];
  }

  return (data ?? []) as unknown as CvWithUser[];
}

export async function fetchCvById(userId: number): Promise<CvWithUser | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("users")
    .select(`
      id, client_number, name, city, profile_photo,
      cv_data, cv_metier_id, cv_title, cv_about,
      cv_search_city, cv_search_radius, cv_available_from, cv_updated_at,
      metier:cv_metier_id (id, name, slug, icon, category)
    `)
    .eq("id", userId)
    .eq("cv_published", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !data) return null;
  return data as unknown as CvWithUser;
}

export async function fetchMyCv(userId: number) {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("users")
    .select(`
      cv_data, cv_metier_id, cv_published, cv_title, cv_about,
      cv_search_city, cv_search_radius, cv_available_from,
      metier:cv_metier_id (slug, name)
    `)
    .eq("id", userId)
    .maybeSingle();

  return data as unknown as {
    cv_data: CvData | null;
    cv_metier_id: number | null;
    cv_published: boolean;
    cv_title: string | null;
    cv_about: string | null;
    cv_search_city: string | null;
    cv_search_radius: number | null;
    cv_available_from: string | null;
    metier: { slug: string; name: string } | null;
  } | null;
}
