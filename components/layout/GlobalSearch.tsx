"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, X, ArrowRight, MapPin, Briefcase, FileText, Users, Newspaper } from "lucide-react";
import { METIER_OPTIONS, type MetierOption } from "@/lib/metiers";

type Suggestion = {
  type: "metier" | "page" | "ville";
  label: string;
  sub?: string;
  href: string;
  icon: React.ReactNode;
};

const STATIC_PAGES: Suggestion[] = [
  { type: "page", label: "Trouver un artisan",  sub: "Recherche carte interactive", href: "/rechercher",          icon: <MapPin size={14} /> },
  { type: "page", label: "Tous les métiers",    sub: "Annuaire complet des métiers",      href: "/metiers",             icon: <Briefcase size={14} /> },
  { type: "page", label: "Tous les avis",       sub: "Avis vérifiés des clients",           href: "/avis",                icon: <Users size={14} /> },
  { type: "page", label: "Blog",                sub: "Guides et conseils",          href: "/blog",                icon: <Newspaper size={14} /> },
  { type: "page", label: "Demander un devis",   sub: "Gratuit en 2 minutes",        href: "/devis",               icon: <FileText size={14} /> },
];

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function GlobalSearch({ metierOptions }: { metierOptions?: MetierOption[] } = {}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const metierSource = metierOptions && metierOptions.length > 0 ? metierOptions : METIER_OPTIONS;

  // Open on Ctrl/Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Filtrer les suggestions
  const q = query.toLowerCase();
  const metierMatches: Suggestion[] = q
    ? metierSource
        .filter((m) => m.name.toLowerCase().includes(q))
        .slice(0, 6)
        .map((m) => ({
          type: "metier" as const,
          label: `${m.icon} ${m.name}`,
          sub: `${m.category} · Tous les ${m.name.toLowerCase()}s`,
          href: `/metiers/${slugify(m.name)}`,
          icon: <Briefcase size={14} />,
        }))
    : [];

  const pageMatches: Suggestion[] = q
    ? STATIC_PAGES.filter((p) => p.label.toLowerCase().includes(q) || (p.sub ?? "").toLowerCase().includes(q))
    : STATIC_PAGES;

  return (
    <>
      {/* Trigger icône · header navy (raccourci ⌘K conservé) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-white/70 hover:text-white hover:bg-white/[0.10] transition"
        aria-label="Rechercher (Ctrl+K)"
        title="Rechercher (⌘K)"
      >
        <Search size={18} />
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-ink-900/60 backdrop-blur-md z-[200] flex items-start justify-center px-4 pt-16 sm:pt-24 animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-ink-100 overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header avec input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-ink-100">
              <Search size={18} className="text-ink-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un métier, une page, un artisan…"
                className="flex-1 bg-transparent outline-none text-base text-ink-700 placeholder:text-ink-300"
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-ink-50 border border-ink-200 text-ink-500 font-mono">
                Esc
              </kbd>
              <button onClick={() => setOpen(false)} className="text-ink-400 hover:text-ink-700">
                <X size={16} />
              </button>
            </div>

            {/* Résultats */}
            <div className="max-h-[400px] overflow-y-auto p-2">
              {metierMatches.length > 0 && (
                <>
                  <div className="px-3 py-2 text-[0.65rem] font-bold tracking-[0.14em] uppercase text-ink-400">Métiers</div>
                  {metierMatches.map((s, i) => (
                    <ResultItem key={`m-${i}`} {...s} onClick={() => setOpen(false)} />
                  ))}
                </>
              )}

              {pageMatches.length > 0 && (
                <>
                  <div className="px-3 py-2 mt-2 text-[0.65rem] font-bold tracking-[0.14em] uppercase text-ink-400">Pages</div>
                  {pageMatches.map((s, i) => (
                    <ResultItem key={`p-${i}`} {...s} onClick={() => setOpen(false)} />
                  ))}
                </>
              )}

              {q && metierMatches.length === 0 && pageMatches.length === 0 && (
                <div className="px-4 py-12 text-center text-ink-400">
                  <Search size={24} className="mx-auto text-ink-300 mb-2" />
                  <div className="text-sm">Aucun résultat pour <strong className="text-ink-700">&quot;{query}&quot;</strong></div>
                  <Link href={`/rechercher?q=${encodeURIComponent(query)}`} onClick={() => setOpen(false)} className="text-brand-500 font-bold text-sm mt-2 inline-block">
                    Lancer une recherche complète →
                  </Link>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-ink-100 bg-ink-50/60 text-xs text-ink-400">
              <div className="flex items-center gap-3">
                <span><kbd className="px-1.5 py-0.5 rounded bg-white border border-ink-200 text-[10px] font-mono">↑↓</kbd> Naviguer</span>
                <span><kbd className="px-1.5 py-0.5 rounded bg-white border border-ink-200 text-[10px] font-mono">↵</kbd> Sélectionner</span>
              </div>
              <span>Astuce : <kbd className="px-1.5 py-0.5 rounded bg-white border border-ink-200 text-[10px] font-mono">⌘K</kbd> à tout moment</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ResultItem({ label, sub, href, icon, onClick }: Suggestion & { onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-ink-50 transition group"
    >
      <span className="w-8 h-8 rounded-lg bg-ink-50 group-hover:bg-white border border-ink-100 flex items-center justify-center text-ink-500 flex-shrink-0">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-ink-700">{label}</div>
        {sub && <div className="text-xs text-ink-400 truncate">{sub}</div>}
      </div>
      <ArrowRight size={14} className="text-ink-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition" />
    </Link>
  );
}
