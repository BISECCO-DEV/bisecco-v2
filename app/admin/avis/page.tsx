import Link from "next/link";
import { Star, AlertTriangle, Trash2, EyeOff, Eye, Check, X } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { toggleReviewFlagAction, deleteReviewAction } from "@/lib/admin/actions";
import { approveReviewAction, rejectReviewAction } from "@/lib/reviews/actions";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ filter?: string; page?: string }>;

type ReviewRow = {
  id: number;
  rating: number;
  comment: string | null;
  is_flagged: boolean;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  users: { id: number; name: string; client_number: string | null } | null;
  artisan_profiles: {
    id: number;
    company_name: string | null;
    users: { id: number; name: string; client_number: string | null } | null;
  } | null;
};

async function fetchReviews(filter: string, page: number) {
  const supabase = createSupabaseAdminClient();
  const perPage = 30;
  const from = (page - 1) * perPage;
  let query = supabase
    .from("reviews")
    .select(
      `id, rating, comment, is_flagged, status, created_at,
       users (id, name, client_number),
       artisan_profiles (id, company_name, users (id, name, client_number))`,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, from + perPage - 1);

  if (filter === "flagged") query = query.eq("is_flagged", true);
  if (filter === "low") query = query.lte("rating", 2);
  if (filter === "pending") query = query.eq("status", "pending");
  if (filter === "approved") query = query.eq("status", "approved");
  if (filter === "rejected") query = query.eq("status", "rejected");

  const { data, count } = await query;
  return {
    rows: (data ?? []) as unknown as ReviewRow[],
    total: count ?? 0,
  };
}

function StarRow({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={12} fill={i < n ? "#f07a2f" : "#e5e7eb"} className={i < n ? "text-brand-500" : "text-ink-200"} />
      ))}
    </div>
  );
}

export default async function AdminAvisPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const filter = params.filter ?? "all";
  const page = parseInt(params.page ?? "1", 10) || 1;
  const { rows, total } = await fetchReviews(filter, page);

  async function approve(formData: FormData) {
    "use server";
    const id = parseInt(formData.get("review_id")?.toString() ?? "0", 10);
    if (id > 0) await approveReviewAction(id);
  }
  async function reject(formData: FormData) {
    "use server";
    const id = parseInt(formData.get("review_id")?.toString() ?? "0", 10);
    if (id > 0) await rejectReviewAction(id);
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-700 tracking-tight flex items-center gap-2">
          <Star size={26} /> Modération des avis
          <span className="ml-2 text-base font-bold text-ink-400">({total})</span>
        </h1>
        <p className="text-ink-500 text-sm mt-1">
          Approuver, masquer ou supprimer les avis signalés.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { value: "all",      label: "Tous",          color: "bg-ink-100 text-ink-700" },
          { value: "pending",  label: "⏳ En attente",  color: "bg-amber-50 text-amber-700 border-amber-200" },
          { value: "approved", label: "✓ Approuvés",   color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
          { value: "rejected", label: "✗ Rejetés",     color: "bg-ink-100 text-ink-600" },
          { value: "flagged",  label: "⚠ Signalés",    color: "bg-red-50 text-red-700 border-red-200" },
          { value: "low",      label: "Note ≤ 2★",     color: "bg-amber-50 text-amber-700 border-amber-200" },
        ].map((f) => (
          <Link
            key={f.value}
            href={`?filter=${f.value}`}
            className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${
              filter === f.value ? `${f.color} border-2` : "bg-white border-ink-200 text-ink-500 hover:border-ink-300"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-ink-100 p-10 text-center">
          <Star size={32} className="mx-auto text-ink-200 mb-2" />
          <p className="text-ink-500 text-sm">Aucun avis dans cette catégorie.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <article
              key={r.id}
              className={`bg-white rounded-2xl p-5 border ${r.is_flagged ? "border-red-200 ring-1 ring-red-100" : "border-ink-100"}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                  r.is_flagged ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                }`}>
                  {r.users?.name.charAt(0).toUpperCase() ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <strong className="text-ink-700 text-sm">{r.users?.name ?? "Anonyme"}</strong>
                    <StarRow n={r.rating} />
                    {r.is_flagged && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-[0.65rem] font-bold uppercase tracking-wider">
                        <AlertTriangle size={9} /> Signalé
                      </span>
                    )}
                    {r.status === "pending" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[0.65rem] font-bold uppercase tracking-wider">
                        ⏳ En attente
                      </span>
                    )}
                    {r.status === "approved" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[0.65rem] font-bold uppercase tracking-wider">
                        ✓ Publié
                      </span>
                    )}
                    {r.status === "rejected" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-ink-100 border border-ink-200 text-ink-600 text-[0.65rem] font-bold uppercase tracking-wider">
                        ✗ Rejeté
                      </span>
                    )}
                  </div>
                  <div className="text-[0.72rem] text-ink-400 mt-0.5">
                    sur{" "}
                    {r.artisan_profiles?.users?.client_number ? (
                      <Link href={`/profil/${r.artisan_profiles.users.client_number}`} className="text-brand-600 font-semibold hover:underline">
                        {r.artisan_profiles?.company_name ?? r.artisan_profiles?.users?.name ?? "·"}
                      </Link>
                    ) : (
                      <span>{r.artisan_profiles?.company_name ?? r.artisan_profiles?.users?.name ?? "·"}</span>
                    )}
                    {" · "}
                    {new Date(r.created_at).toLocaleDateString("fr-FR")}
                  </div>
                  {r.comment && (
                    <p className="mt-2 text-sm text-ink-600 leading-relaxed whitespace-pre-line">{r.comment}</p>
                  )}

                  <div className="flex gap-2 mt-3 flex-wrap">
                    {r.status !== "approved" && (
                      <form action={approve} className="inline">
                        <input type="hidden" name="review_id" value={r.id} />
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition"
                        >
                          <Check size={12} /> Approuver
                        </button>
                      </form>
                    )}
                    {r.status !== "rejected" && (
                      <form action={reject} className="inline">
                        <input type="hidden" name="review_id" value={r.id} />
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-ink-600 border border-ink-200 hover:border-red-500 hover:text-red-700 transition"
                        >
                          <X size={12} /> Rejeter
                        </button>
                      </form>
                    )}

                    <form action={toggleReviewFlagAction} className="inline">
                      <input type="hidden" name="review_id" value={r.id} />
                      <input type="hidden" name="flag" value={r.is_flagged ? "false" : "true"} />
                      <input type="hidden" name="_back" value={`/admin/avis?filter=${filter}`} />
                      <button
                        type="submit"
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          r.is_flagged
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                        }`}
                      >
                        {r.is_flagged ? <><Eye size={12} /> Rétablir</> : <><EyeOff size={12} /> Masquer</>}
                      </button>
                    </form>

                    <form action={deleteReviewAction} className="inline">
                      <input type="hidden" name="review_id" value={r.id} />
                      <input type="hidden" name="_back" value={`/admin/avis?filter=${filter}`} />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition"
                      >
                        <Trash2 size={12} /> Supprimer
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
