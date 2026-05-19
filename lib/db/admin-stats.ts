import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type AdminStats = {
  total_users: number;
  total_artisans: number;
  total_particuliers: number;
  pending_validations: number;
  approved_artisans: number;
  rejected_artisans: number;
  total_metiers: number;
  total_reviews: number;
  flagged_reviews: number;
  total_messages: number;
  total_referrals: number;
  referrals_signed_up: number;
  referrals_validated: number;
};

export async function fetchAdminStats(): Promise<AdminStats> {
  const supabase = createSupabaseAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const countQuery = async (table: string, filters?: (q: any) => any): Promise<number> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = supabase.from(table).select("*", { count: "exact", head: true });
    if (filters) query = filters(query);
    const { count } = await query;
    return count ?? 0;
  };

  const [
    total_users,
    total_artisans,
    total_particuliers,
    pending_validations,
    approved_artisans,
    rejected_artisans,
    total_metiers,
    total_reviews,
    flagged_reviews,
    total_messages,
    total_referrals,
    referrals_signed_up,
    referrals_validated,
  ] = await Promise.all([
    countQuery("users", (q) => q.is("deleted_at", null)),
    countQuery("users", (q) => q.eq("role", "artisan").is("deleted_at", null)),
    countQuery("users", (q) => q.eq("role", "particulier").is("deleted_at", null)),
    countQuery("users", (q) =>
      q.eq("role", "artisan").eq("validation_status", "pending").is("deleted_at", null),
    ),
    countQuery("users", (q) =>
      q.eq("role", "artisan").eq("validation_status", "approved").is("deleted_at", null),
    ),
    countQuery("users", (q) =>
      q.eq("role", "artisan").eq("validation_status", "rejected").is("deleted_at", null),
    ),
    countQuery("metiers"),
    countQuery("reviews"),
    countQuery("reviews", (q) => q.eq("is_flagged", true)),
    countQuery("chat_messages"),
    countQuery("referrals"),
    countQuery("referrals", (q) => q.eq("status", "signed_up")),
    countQuery("referrals", (q) => q.eq("status", "validated")),
  ]);

  return {
    total_users,
    total_artisans,
    total_particuliers,
    pending_validations,
    approved_artisans,
    rejected_artisans,
    total_metiers,
    total_reviews,
    flagged_reviews,
    total_messages,
    total_referrals,
    referrals_signed_up,
    referrals_validated,
  };
}

export type RecentSignup = {
  id: number;
  name: string;
  email: string;
  role: string;
  validation_status: string | null;
  siren: string | null;
  city: string | null;
  created_at: string;
};

export async function fetchRecentSignups(limit = 10): Promise<RecentSignup[]> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("users")
    .select("id, name, email, role, validation_status, siren, city, created_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as RecentSignup[];
}

export type PendingArtisan = {
  id: number;
  name: string;
  email: string;
  siren: string | null;
  siren_status: string | null;
  city: string | null;
  created_at: string;
};

export async function fetchPendingArtisans(limit = 20): Promise<PendingArtisan[]> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("users")
    .select("id, name, email, siren, siren_status, city, created_at")
    .eq("role", "artisan")
    .eq("validation_status", "pending")
    .is("deleted_at", null)
    .order("created_at", { ascending: true })
    .limit(limit);
  return (data ?? []) as PendingArtisan[];
}
