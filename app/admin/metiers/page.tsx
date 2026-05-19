import { Briefcase, Plus, Trash2, Edit3 } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createMetierAction, updateMetierAction, deleteMetierAction } from "@/lib/admin/actions";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string; edit?: string }>;

const CATEGORIES = [
  "Alimentation",
  "Bâtiment",
  "Artisanat traditionnel",
  "Métiers d'art",
  "Services",
  "Textile / mode",
  "Automobile",
];

async function fetchAllMetiers(q?: string) {
  const supabase = createSupabaseAdminClient();
  let query = supabase
    .from("metiers")
    .select("id, name, slug, category, icon, description")
    .order("category", { ascending: true })
    .order("name", { ascending: true });
  if (q) {
    query = query.or(`name.ilike.%${q}%,slug.ilike.%${q}%,category.ilike.%${q}%`);
  }
  const { data } = await query;
  return data ?? [];
}

export default async function AdminMetiersPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const metiers = await fetchAllMetiers(params.q);
  const editId = params.edit ? Number(params.edit) : null;
  const editing = editId ? metiers.find((m) => m.id === editId) : null;

  // Group by category for display
  const byCategory = new Map<string, typeof metiers>();
  for (const m of metiers) {
    if (!byCategory.has(m.category)) byCategory.set(m.category, []);
    byCategory.get(m.category)!.push(m);
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-700 tracking-tight flex items-center gap-2">
          <Briefcase size={26} /> Métiers
          <span className="ml-2 text-base font-bold text-ink-400">({metiers.length})</span>
        </h1>
        <p className="text-ink-500 text-sm mt-1">
          Référentiel des {metiers.length} métiers utilisé par toute la plateforme.
        </p>
      </div>

      {/* Recherche */}
      <form method="GET" className="flex gap-2">
        <input
          type="text" name="q" defaultValue={params.q ?? ""}
          placeholder="Rechercher un métier…"
          className="flex-1 px-4 py-2.5 rounded-xl border border-ink-200 text-sm focus:border-brand-500 outline-none"
        />
        <button type="submit" className="px-5 py-2.5 rounded-xl bg-ink-900 text-white font-bold text-sm hover:bg-ink-800 transition">
          Rechercher
        </button>
      </form>

      {/* Formulaire création/édition */}
      <form
        action={editing ? updateMetierAction : createMetierAction}
        className="bg-white rounded-2xl border border-ink-100 p-5"
      >
        <h2 className="font-extrabold text-ink-700 text-sm mb-4 uppercase tracking-wider flex items-center gap-2">
          {editing ? <Edit3 size={14} /> : <Plus size={14} />}
          {editing ? `Modifier "${editing.name}"` : "Ajouter un métier"}
        </h2>

        {editing && <input type="hidden" name="id" value={editing.id} />}
        <input type="hidden" name="_back" value="/admin/metiers" />

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[0.7rem] font-bold text-ink-500 uppercase tracking-wider mb-1.5">Nom du métier</label>
            <input
              type="text" name="name" required defaultValue={editing?.name ?? ""}
              placeholder="ex: Plombier"
              className="w-full px-3 py-2.5 rounded-xl border border-ink-200 text-sm focus:border-brand-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-[0.7rem] font-bold text-ink-500 uppercase tracking-wider mb-1.5">Catégorie</label>
            <select name="category" required defaultValue={editing?.category ?? ""} className="w-full px-3 py-2.5 rounded-xl border border-ink-200 text-sm bg-white focus:border-brand-500 outline-none">
              <option value="">— Choisir —</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[0.7rem] font-bold text-ink-500 uppercase tracking-wider mb-1.5">Icône (emoji)</label>
            <input
              type="text" name="icon" maxLength={4} defaultValue={editing?.icon ?? ""}
              placeholder="🔧"
              className="w-full px-3 py-2.5 rounded-xl border border-ink-200 text-sm focus:border-brand-500 outline-none"
            />
          </div>
          <div className="flex items-end gap-2">
            <button type="submit" className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition">
              {editing ? "Enregistrer" : "Ajouter"}
            </button>
            {editing && (
              <a href="/admin/metiers" className="px-4 py-2.5 rounded-xl bg-ink-50 border border-ink-200 text-ink-700 font-bold text-sm hover:bg-ink-100 transition">
                Annuler
              </a>
            )}
          </div>
        </div>

        <div className="mt-3">
          <label className="block text-[0.7rem] font-bold text-ink-500 uppercase tracking-wider mb-1.5">Description (optionnel)</label>
          <textarea
            name="description" rows={2} defaultValue={editing?.description ?? ""}
            className="w-full px-3 py-2 rounded-xl border border-ink-200 text-sm focus:border-brand-500 outline-none"
          />
        </div>
      </form>

      {/* Liste groupée par catégorie */}
      <div className="space-y-5">
        {Array.from(byCategory.entries()).map(([cat, items]) => (
          <section key={cat} className="bg-white rounded-2xl border border-ink-100 p-5">
            <h3 className="font-extrabold text-ink-700 text-sm mb-3 uppercase tracking-wider">
              {cat} <span className="text-ink-400 font-bold">({items.length})</span>
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {items.map((m) => (
                <div key={m.id} className="flex items-center gap-2 p-2.5 rounded-xl border border-ink-100 hover:border-brand-200 hover:bg-ink-50/50 transition">
                  <span className="text-xl">{m.icon ?? "📌"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-ink-700 text-sm truncate">{m.name}</div>
                    <div className="text-[0.66rem] text-ink-400 font-mono truncate">{m.slug}</div>
                  </div>
                  <a
                    href={`/admin/metiers?edit=${m.id}#edit`}
                    className="inline-flex items-center justify-center w-7 h-7 rounded-lg hover:bg-blue-50 text-ink-400 hover:text-blue-600 transition"
                    aria-label="Modifier"
                  >
                    <Edit3 size={13} />
                  </a>
                  <form action={deleteMetierAction} className="inline">
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="_back" value="/admin/metiers" />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center w-7 h-7 rounded-lg hover:bg-red-50 text-ink-400 hover:text-red-600 transition"
                      aria-label="Supprimer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
