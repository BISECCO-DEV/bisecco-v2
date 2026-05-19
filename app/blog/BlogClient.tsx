"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, Clock, X } from "lucide-react";
import { CATEGORIES, type BlogPost, type Category } from "@/lib/blog";

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Guide":       { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200" },
  "Sécurité":    { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "Tendances":   { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200" },
  "Conseils":    { bg: "bg-brand-50",   text: "text-brand-700",   border: "border-brand-200" },
  "Métiers":     { bg: "bg-purple-50",  text: "text-purple-700",  border: "border-purple-200" },
  "Législation": { bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200" },
};

export function BlogClient({ posts }: { posts: BlogPost[] }) {
  const [category, setCategory] = useState<Category>("Tous");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return posts.filter((p) => {
      if (category !== "Tous" && p.category !== category) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [posts, category, query]);

  const reset = () => {
    setCategory("Tous");
    setQuery("");
  };

  return (
    <>
      {/* Search + filters */}
      <div className="flex flex-col lg:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un article, un mot-clé…"
            className="w-full h-12 pl-11 pr-12 rounded-xl bg-white border border-ink-200 focus:border-brand-500 outline-none text-[0.92rem] transition shadow-[0_2px_8px_rgba(13,30,74,0.04)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-ink-50 hover:bg-ink-100 flex items-center justify-center text-ink-500 transition"
              aria-label="Effacer la recherche"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-8 -mt-2">
        {CATEGORIES.map((c) => {
          const active = category === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`inline-flex items-center h-9 px-4 rounded-full text-[0.82rem] font-bold transition-all ${
                active
                  ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-[0_4px_12px_rgba(240,122,47,0.4)]"
                  : "bg-white border border-ink-200 text-ink-600 hover:border-brand-300 hover:text-brand-500"
              }`}
              aria-pressed={active}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-ink-100 p-12 text-center">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-ink-50 items-center justify-center text-ink-400 mb-3">
            <Search size={22} />
          </div>
          <h3 className="font-extrabold text-ink-700 text-lg">Aucun article trouvé</h3>
          <p className="text-ink-500 text-[0.92rem] mt-2 max-w-md mx-auto">
            Aucun article ne correspond à votre recherche. Essayez d&apos;autres mots-clés
            ou parcourez les catégories.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-5 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-[0.86rem] hover:bg-brand-600 transition"
          >
            Voir tous les articles
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <ArticleCard key={p.slug} post={p} />
          ))}
        </div>
      )}

      {/* Compteur résultats */}
      {filtered.length > 0 && (
        <p className="mt-8 text-center text-[0.86rem] text-ink-400">
          {filtered.length} article{filtered.length > 1 ? "s" : ""}
          {category !== "Tous" && (
            <> dans la catégorie <strong className="text-ink-700">{category}</strong></>
          )}
          {query && (
            <> contenant <strong className="text-ink-700">« {query} »</strong></>
          )}
        </p>
      )}
    </>
  );
}

function ArticleCard({ post }: { post: BlogPost }) {
  const cat = CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS["Guide"];
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-ink-100 hover:border-brand-200 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(13,30,74,0.18)] transition-all"
    >
      {/* Cover */}
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${post.cover})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 to-transparent" />
        <span
          className={`absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full ${cat.bg} ${cat.text} ${cat.border} border text-[0.66rem] font-extrabold uppercase tracking-[0.1em] shadow-[0_2px_8px_rgba(0,0,0,0.12)]`}
        >
          {post.category}
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col p-5">
        <h3 className="font-extrabold text-ink-700 text-[1.02rem] leading-snug group-hover:text-brand-500 transition line-clamp-2">
          {post.title}
        </h3>
        <p className="mt-2 text-[0.86rem] text-ink-500 leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.slice(0, 3).map((t) => (
              <span key={t} className="text-[0.66rem] font-semibold text-ink-400 bg-ink-50 px-2 py-0.5 rounded">
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Footer card */}
        <div className="mt-5 pt-4 border-t border-ink-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.author.avatar}
              alt=""
              className="w-7 h-7 rounded-full border border-ink-100 flex-shrink-0"
              loading="lazy"
            />
            <div className="min-w-0">
              <div className="text-[0.72rem] font-bold text-ink-700 truncate">{post.author.name}</div>
              <div className="text-[0.66rem] text-ink-400 truncate">{post.date}</div>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[0.72rem] text-ink-400 font-semibold flex-shrink-0">
            <Clock size={11} />
            {post.readTime}
          </span>
        </div>

        {/* Hover arrow */}
        <span className="mt-3 inline-flex items-center gap-1.5 text-[0.78rem] font-bold text-brand-500 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
          Lire l&apos;article
          <ArrowRight size={12} strokeWidth={2.6} />
        </span>
      </div>
    </Link>
  );
}
