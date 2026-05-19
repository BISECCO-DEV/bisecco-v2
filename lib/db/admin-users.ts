import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type AdminUserRow = {
  id: number;
  client_number: string | null;
  name: string;
  email: string;
  role: "admin" | "artisan" | "particulier";
  phone: string | null;
  city: string | null;
  siren: string | null;
  siren_status: string | null;
  validation_status: "pending" | "approved" | "rejected" | null;
  created_at: string;
  deleted_at: string | null;
};

export type UsersFilter = {
  q?: string;
  role?: "all" | "admin" | "artisan" | "particulier";
  status?: "all" | "pending" | "approved" | "rejected";
  trashed?: boolean;
  page?: number;
  per_page?: number;
};

export type UsersList = {
  rows: AdminUserRow[];
  total: number;
  page: number;
  per_page: number;
};

export async function fetchUsersList(filter: UsersFilter = {}): Promise<UsersList> {
  const page = filter.page ?? 1;
  const perPage = filter.per_page ?? 25;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const supabase = createSupabaseAdminClient();
  let query = supabase
    .from("users")
    .select(
      "id, client_number, name, email, role, phone, city, siren, siren_status, validation_status, created_at, deleted_at",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filter.role && filter.role !== "all") {
    query = query.eq("role", filter.role);
  }
  if (filter.status && filter.status !== "all") {
    query = query.eq("validation_status", filter.status);
  }
  if (filter.trashed) {
    query = query.not("deleted_at", "is", null);
  } else {
    query = query.is("deleted_at", null);
  }
  if (filter.q) {
    const q = `%${filter.q}%`;
    query = query.or(
      `name.ilike.${q},email.ilike.${q},siren.ilike.${q},client_number.ilike.${q},city.ilike.${q}`,
    );
  }

  const { data, count } = await query;
  return {
    rows: (data ?? []) as AdminUserRow[],
    total: count ?? 0,
    page,
    per_page: perPage,
  };
}

export async function fetchUserDetail(id: number) {
  const supabase = createSupabaseAdminClient();

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("artisan_profiles")
    .select(
      `id, company_name, description, availability, business_hours, service_radius,
       latitude, longitude, siret, siret_verified, rcs_verified, is_active,
       artisan_profile_metier (metiers (id, name, slug, icon, category))`,
    )
    .eq("user_id", id)
    .maybeSingle();

  const { data: gallery } = await supabase
    .from("gallery_images")
    .select("id, image_path, caption")
    .eq("user_id", id)
    .order("sort_order");

  return { user, profile, gallery: gallery ?? [] };
}
