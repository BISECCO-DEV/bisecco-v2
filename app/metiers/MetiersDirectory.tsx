"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search, Briefcase, Filter, X, ArrowRight, TrendingUp, Users, MapPin,
} from "lucide-react";

export type MetierWithCount = {
  id: number;
  name: string;
  slug: string;
  category: string;
  icon: string | null;
  description: string | null;
  artisanCount: number;
};

type Props = { metiers: MetierWithCount[] };

const CATEGORY_COLORS: Record<string, string> = {
  "Alimentation":            "from-amber-500 to-orange-600",
  "Bâtiment":                "from-blue-500 to-blue-700",
  "Artisanat traditionnel":  "from-purple-500 to-pink-500",
  "Métiers d'art":           "from-rose-500 to-pink-600",
  "Services":                "from-emerald-500 to-emerald-700",
  "Textile / mode":          "from-fuchsia-500 to-purple-600",
  "Automobile":              "from-slate-600 to-slate-800",
};

const CATEGORY_BG: Record<string, string> = {
  "Alimentation":            "bg-amber-50 text-amber-700 border-amber-200",
  "Bâtiment":                "bg-blue-50 text-blue-700 border-blue-200",
  "Artisanat traditionnel":  "bg-purple-50 text-purple-700 border-purple-200",
  "Métiers d'art":           "bg-rose-50 text-rose-700 border-rose-200",
  "Services":                "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Textile / mode":          "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "Automobile":              "bg-slate-50 text-slate-700 border-slate-200",
};

function normalizeStr(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function MetiersDirectory({ metiers }: Props) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of metiers) {
      map.set(m.category, (map.get(m.category) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [metiers]);

  const filtered = useMemo(() => {
    const q = normalizeStr(query.trim());
    return metiers.filter((m) => {
      const matchCategory = activeCategory === "all" || m.category === activeCategory;
      if (!matchCategory) return false;
      if (!q) return true;
      return (
        normalizeStr(m.name).includes(q) ||
        normalizeStr(m.category).includes(q) ||
        (m.description && normalizeStr(m.description).includes(q))
      );
    });
  }, [metiers, query, activeCategory]);

  // Group filtered metiers by category (alphabétique au sein de chaque cat)
  const grouped = useMemo(() => {
    const map = new Map<string, MetierWithCount[]>();
    for (const m of filtered) {
      if (!map.has(m.category)) map.set(m.category, []);
      map.get(m.category)!.push(m);
    }
    return Array.from(map.entries())
      .map(([cat, items]) => ({
        category: cat,
        items: items.sort((a, b) => a.name.localeCompare(b.name, "fr")),
      }))
      .sort((a, b) => a.category.localeCompare(b.category, "fr"));
  }, [filtered]);

  const popularMetiers = useMemo(() => {
    return [...metiers]
      .filter((m) => m.artisanCount > 0)
      .sort((a, b) => b.artisanCount - a.artisanCount)
      .slice(0, 8);
  }, [metiers]);

  return (
    <>
      {/* Stats banner · chevauche la frontière navy/gris */}
      <div className="container-default -mt-20 sm:-mt-24 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { value: metiers.length, label: "Métiers couverts", icon: Briefcase, color: "from-brand-500 to-brand-600" },
            { value: categories.length, label: "Catégories", icon: Filter, color: "from-blue-500 to-blue-700" },
            { value: metiers.reduce((s, m) => s + m.artisanCount, 0), label: "Artisans inscrits", icon: Users, color: "from-emerald-500 to-emerald-700" },
            { value: "Tous les jours", label: "Nouveau métiers", icon: TrendingUp, color: "from-purple-500 to-pink-500", isString: true },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 sm:p-5 border border-ink-100 shadow-card">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-[0_4px_14px_rgba(0,0,0,0.15)]`}>
                <s.icon size={17} className="text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-ink-700 leading-tight">
                {s.isString ? s.value : (s.value as number)}
              </div>
              <div className="text-[0.78rem] text-ink-500 font-semibold mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Métiers populaires (top 8) */}
      {popularMetiers.length > 0 && (
        <section className="container-default mt-16 sm:mt-20">
          <div className="flex items-center gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.66rem] font-extrabold tracking-wider uppercase">
              <TrendingUp size={10} strokeWidth={2.8} /> Populaires
            </span>
            <h2 className="font-extrabold text-ink-700 text-lg">Métiers les plus demandés</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
            {popularMetiers.map((m) => (
              <Link
                key={m.id}
                href={`/metiers/${m.slug}`}
                className="group bg-white rounded-2xl p-4 border border-ink-100 hover:border-brand-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_-10px_rgba(13,30,74,0.18)] transition"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${CATEGORY_COLORS[m.category] ?? "from-ink-500 to-ink-700"} flex items-center justify-center text-2xl shadow-card flex-shrink-0`}>
                    {m.icon ?? "🛠️"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-extrabold text-ink-700 text-sm group-hover:text-brand-600 truncate">
                      {m.name}
                    </div>
                    <div className="text-[0.7rem] text-ink-500 mt-0.5 inline-flex items-center gap-1">
                      <Users size={9} /> {m.artisanCount} artisan{m.artisanCount > 1 ? "s" : ""}
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-ink-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Search + filters */}
      <section className="container-default mt-16 sm:mt-20">
        <div className="bg-white rounded-3xl border border-ink-100 p-5 sm:p-6 shadow-card">
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 text-brand-600">
              <Search size={18} strokeWidth={2.4} />
            </span>
            <div>
              <h2 className="font-extrabold text-ink-700 text-lg">Trouver un métier</h2>
              <p className="text-xs text-ink-500">Tapez quelques lettres ou filtrez par catégorie</p>
            </div>
          </div>

          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Plombier, boulanger, électricien..."
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl border-2 border-ink-100 focus:border-brand-500 outline-none text-sm font-medium bg-ink-50/40"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-ink-100 hover:bg-ink-200 text-ink-500 flex items-center justify-center"
                aria-label="Effacer"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mt-5">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-full text-xs font-extrabold border-2 transition ${
                activeCategory === "all"
                  ? "bg-ink-900 text-white border-ink-900"
                  : "bg-white text-ink-500 border-ink-200 hover:border-ink-300"
              }`}
            >
              Tous ({metiers.length})
            </button>
            {categories.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setActiveCategory(c.name)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold border-2 transition ${
                  activeCategory === c.name
                    ? `${CATEGORY_BG[c.name] ?? "bg-brand-50 text-brand-700 border-brand-300"} border-current`
                    : "bg-white text-ink-500 border-ink-200 hover:border-ink-300"
                }`}
              >
                {c.name} <span className="opacity-60">({c.count})</span>
              </button>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-ink-100 flex items-center justify-between text-sm">
            <span className="text-ink-500">
              <strong className="text-ink-700">{filtered.length}</strong> métier{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
            </span>
            {(query || activeCategory !== "all") && (
              <button
                onClick={() => { setQuery(""); setActiveCategory("all"); }}
                className="text-xs text-brand-600 font-bold hover:underline"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Liste groupée par catégorie */}
      <section className="container-default mt-10 sm:mt-12 pb-16">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-ink-100 p-12 text-center">
            <Search size={32} className="text-ink-200 mx-auto mb-3" />
            <h3 className="font-extrabold text-ink-700 text-lg">Aucun métier trouvé</h3>
            <p className="text-ink-500 text-sm mt-1.5">
              Essaie avec d&apos;autres mots-clés ou réinitialise les filtres.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {grouped.map((g) => (
              <div key={g.category}>
                <div className="flex items-center justify-between gap-3 mb-5">
                  <h3 className="text-2xl font-extrabold text-ink-700 tracking-tight">
                    {g.category}
                    <span className="ml-2 text-base font-bold text-ink-400">({g.items.length})</span>
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-[0.66rem] font-extrabold uppercase tracking-wider border ${CATEGORY_BG[g.category] ?? "bg-ink-50 border-ink-200 text-ink-700"}`}>
                    {g.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {g.items.map((m) => (
                    <Link
                      key={m.id}
                      href={`/metiers/${m.slug}`}
                      className="group relative bg-white rounded-2xl p-4 border border-ink-100 hover:border-brand-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_-10px_rgba(13,30,74,0.18)] transition overflow-hidden"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">{m.icon ?? "🛠️"}</div>
                        <div className="min-w-0 flex-1">
                          <div className="font-extrabold text-ink-700 text-[0.92rem] leading-tight group-hover:text-brand-600 truncate">
                            {m.name}
                          </div>
                          {m.artisanCount > 0 ? (
                            <div className="text-[0.66rem] text-emerald-700 font-bold mt-1 inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {m.artisanCount} pro{m.artisanCount > 1 ? "s" : ""}
                            </div>
                          ) : (
                            <div className="text-[0.66rem] text-ink-400 mt-1">À pourvoir</div>
                          )}
                        </div>
                      </div>
                      <ArrowRight
                        size={12}
                        className="absolute bottom-3 right-3 text-ink-200 group-hover:text-brand-500 group-hover:translate-x-0.5 transition"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA artisans */}
      <section className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-500/15 blur-3xl pointer-events-none" />
        <div className="container-default relative text-center max-w-2xl">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-400 text-[0.7rem] font-extrabold tracking-[0.14em] uppercase">
            <Briefcase size={11} strokeWidth={2.8} /> Vous êtes pro
          </span>
          <h2 className="mt-5 text-[28px] sm:text-[40px] font-extrabold tracking-[-0.025em] leading-[1.05]">
            Votre métier n&apos;est pas
            <br /> dans la liste ?
          </h2>
          <p className="mt-4 text-white/70">
            On peut l&apos;ajouter en 24h. Demandez-nous, c&apos;est gratuit.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-7">
            <Link
              href="/inscription"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-bold shadow-[0_10px_30px_-8px_rgba(240,122,47,0.55)] hover:-translate-y-0.5 transition"
            >
              Inscrire mon entreprise <ArrowRight size={14} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.08] border border-white/[0.18] text-white font-bold hover:bg-white/[0.14] backdrop-blur-md transition"
            >
              <MapPin size={14} /> Demander un métier
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
