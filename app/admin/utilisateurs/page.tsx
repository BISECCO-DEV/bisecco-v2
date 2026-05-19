import Link from "next/link";
import { Search, ShieldCheck, Users, Filter, ChevronRight, ChevronLeft } from "lucide-react";
import { fetchUsersList } from "@/lib/db/admin-users";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  q?: string;
  role?: string;
  status?: string;
  page?: string;
  trashed?: string;
}>;

const ROLE_OPTIONS = [
  { value: "all", label: "Tous rôles" },
  { value: "artisan", label: "Artisans" },
  { value: "particulier", label: "Particuliers" },
  { value: "admin", label: "Admins" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "Tous statuts" },
  { value: "pending", label: "En attente" },
  { value: "approved", label: "Approuvés" },
  { value: "rejected", label: "Rejetés" },
];

function StatusBadge({ status }: { status: string | null }) {
  if (status === "approved")
    return <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[0.66rem] font-bold uppercase tracking-wider">Validé</span>;
  if (status === "pending")
    return <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[0.66rem] font-bold uppercase tracking-wider">En attente</span>;
  if (status === "rejected")
    return <span className="px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-[0.66rem] font-bold uppercase tracking-wider">Rejeté</span>;
  return null;
}

function RoleBadge({ role }: { role: string }) {
  const colors: Record<string, string> = {
    admin: "bg-purple-50 border-purple-200 text-purple-700",
    artisan: "bg-brand-50 border-brand-200 text-brand-700",
    particulier: "bg-blue-50 border-blue-200 text-blue-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full border text-[0.66rem] font-bold uppercase tracking-wider ${colors[role] ?? "bg-ink-50 border-ink-200 text-ink-700"}`}>
      {role}
    </span>
  );
}

export default async function AdminUsersPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10) || 1;
  const filter = {
    q: params.q,
    role: (params.role ?? "all") as "all" | "artisan" | "particulier" | "admin",
    status: (params.status ?? "all") as "all" | "pending" | "approved" | "rejected",
    trashed: params.trashed === "1",
    page,
    per_page: 25,
  };

  const { rows, total, per_page } = await fetchUsersList(filter);
  const totalPages = Math.ceil(total / per_page);

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-700 tracking-tight flex items-center gap-2">
          <Users size={26} /> Utilisateurs
          <span className="ml-2 text-base font-bold text-ink-400">({total})</span>
        </h1>
        <p className="text-ink-500 text-sm mt-1">
          Gérer artisans, particuliers et validations SIREN.
        </p>
      </div>

      {/* Filtres */}
      <form
        method="GET"
        className="bg-white rounded-2xl border border-ink-100 p-4 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-3 items-end"
      >
        <div>
          <label className="block text-[0.7rem] font-bold text-ink-500 uppercase tracking-wider mb-1.5">Recherche</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
            <input
              type="text" name="q" defaultValue={filter.q ?? ""}
              placeholder="Nom, email, SIREN, N° client, ville…"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-ink-200 text-sm focus:border-brand-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[0.7rem] font-bold text-ink-500 uppercase tracking-wider mb-1.5">Rôle</label>
          <select name="role" defaultValue={filter.role} className="px-3 py-2.5 rounded-xl border border-ink-200 text-sm bg-white focus:border-brand-500 outline-none">
            {ROLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[0.7rem] font-bold text-ink-500 uppercase tracking-wider mb-1.5">Statut</label>
          <select name="status" defaultValue={filter.status} className="px-3 py-2.5 rounded-xl border border-ink-200 text-sm bg-white focus:border-brand-500 outline-none">
            {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <button type="submit" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink-900 text-white font-bold text-sm hover:bg-ink-800 transition">
          <Filter size={14} /> Filtrer
        </button>
      </form>

      {/* Tableau */}
      <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 text-ink-500 uppercase text-[0.7rem] tracking-wider">
              <tr>
                <th className="text-left px-4 py-3 font-bold">Utilisateur</th>
                <th className="text-left px-4 py-3 font-bold">Rôle</th>
                <th className="text-left px-4 py-3 font-bold">SIREN</th>
                <th className="text-left px-4 py-3 font-bold">Ville</th>
                <th className="text-left px-4 py-3 font-bold">Statut</th>
                <th className="text-left px-4 py-3 font-bold">Inscrit</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-ink-400">
                    Aucun résultat
                  </td>
                </tr>
              ) : (
                rows.map((u) => (
                  <tr key={u.id} className="hover:bg-ink-50/50 transition">
                    <td className="px-4 py-3">
                      <Link href={`/admin/utilisateurs/${u.id}`} className="font-bold text-ink-700 hover:text-brand-600">
                        {u.name}
                      </Link>
                      <div className="text-[0.72rem] text-ink-500">{u.email}</div>
                      {u.client_number && (
                        <div className="text-[0.66rem] text-ink-400 font-mono">{u.client_number}</div>
                      )}
                    </td>
                    <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                    <td className="px-4 py-3">
                      {u.siren ? (
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-xs text-ink-700">{u.siren}</span>
                          {u.siren_status === "A" && (
                            <ShieldCheck size={12} className="text-emerald-500" />
                          )}
                          {u.siren_status === "C" && (
                            <span className="text-red-500 text-[0.66rem] font-bold">CESSÉ</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-ink-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink-600 text-xs">{u.city ?? "—"}</td>
                    <td className="px-4 py-3"><StatusBadge status={u.validation_status} /></td>
                    <td className="px-4 py-3 text-ink-500 text-xs">
                      {new Date(u.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/utilisateurs/${u.id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-ink-100 text-ink-500 hover:text-brand-600 transition"
                      >
                        <ChevronRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-ink-100 bg-ink-50/50">
            <div className="text-xs text-ink-500">
              Page <strong>{page}</strong> / {totalPages} · {total} résultats
            </div>
            <div className="flex items-center gap-2">
              {page > 1 && (
                <Link
                  href={`?${new URLSearchParams({ q: filter.q ?? "", role: filter.role, status: filter.status, page: String(page - 1) }).toString()}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-ink-200 text-xs font-bold hover:border-brand-300 transition"
                >
                  <ChevronLeft size={12} /> Précédent
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`?${new URLSearchParams({ q: filter.q ?? "", role: filter.role, status: filter.status, page: String(page + 1) }).toString()}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-ink-200 text-xs font-bold hover:border-brand-300 transition"
                >
                  Suivant <ChevronRight size={12} />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
