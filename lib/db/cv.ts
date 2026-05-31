import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { CvData } from "@/lib/cv/schema";

export async function fetchMyCv(userId: number) {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("users")
    .select(`
      cv_data, cv_metier_id, cv_title, cv_about,
      cv_search_city, cv_search_radius, cv_available_from,
      metier:cv_metier_id (slug, name)
    `)
    .eq("id", userId)
    .maybeSingle();

  return data as unknown as {
    cv_data: CvData | null;
    cv_metier_id: number | null;
    cv_title: string | null;
    cv_about: string | null;
    cv_search_city: string | null;
    cv_search_radius: number | null;
    cv_available_from: string | null;
    metier: { slug: string; name: string } | null;
  } | null;
}
