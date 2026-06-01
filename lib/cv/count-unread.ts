import { cache } from "react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/** Compte les CVs reçus non lus pour un user artisan. Cached par requête React. */
export const countUnreadCvs = cache(async (userId: number | null): Promise<number> => {
  if (!userId) return 0;
  const admin = createSupabaseAdminClient();
  const { count } = await admin
    .from("cv_submissions")
    .select("id", { count: "exact", head: true })
    .eq("recipient_user_id", userId)
    .eq("status", "new");
  return count ?? 0;
});
