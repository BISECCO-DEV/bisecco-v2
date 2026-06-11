"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, X, ArrowRight, MapPin, Briefcase, FileText, Users, Newspaper, User, ShieldCheck } from "lucide-react";
import { METIER_OPTIONS, type MetierOption } from "@/lib/metiers";

type UserResult = {
  id: number;
  display_name: string;
  client_number: string | null;
  role: "artisan" | "particulier";
  city: string | null;
  profile_photo: string | null;
  metier: string | null;
};

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
  const [userResults, setUserResults] = useState<{ artisans: UserResult[]; particuliers: UserResult[] }>({ artisans: [], particuliers: [] });
  const [searchingUsers, setSearchingUsers] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const metierSource = metierOptions && metierOptions.length > 0 ? metierOptions : METIER_OPTIONS;

  // Recherche utilisateurs (debounced 300ms)
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setUserResults({ artisans: [], particuliers: [] });
      return;
    }
    setSearchingUsers(true);
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      fetch(`/api/users/search?q=${encodeURIComponent(query.trim())}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((data) => setUserResults({ artisans: data.artisans ?? [], particuliers: data.particuliers ?? [] }))
        .catch(() => setUserResults({ artisans: [], particuliers: [] }))
        .finally(() => setSearchingUsers(false));
    }, 300);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query]);

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
                placeholder="Rechercher un membre, un métier, une page…"
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
              {/* Artisans (membres) */}
              {userResults.artisans.length > 0 && (
                <>
                  <div className="px-3 py-2 text-[0.65rem] font-bold tracking-[0.14em] uppercase text-ink-400">
                    Artisans
                  </div>
                  {userResults.artisans.map((u) => (
                    <UserResultItem key={`a-${u.id}`} user={u} onClick={() => setOpen(false)} />
                  ))}
                </>
              )}

              {/* Particuliers */}
              {userResults.particuliers.length > 0 && (
                <>
                  <div className="px-3 py-2 mt-2 text-[0.65rem] font-bold tracking-[0.14em] uppercase text-ink-400">
                    Particuliers
                  </div>
                  {userResults.particuliers.map((u) => (
                    <UserResultItem key={`p-${u.id}`} user={u} onClick={() => setOpen(false)} />
                  ))}
                </>
              )}

              {metierMatches.length > 0 && (
                <>
                  <div className="px-3 py-2 mt-2 text-[0.65rem] font-bold tracking-[0.14em] uppercase text-ink-400">Métiers</div>
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

              {q && !searchingUsers && userResults.artisans.length === 0 && userResults.particuliers.length === 0 && metierMatches.length === 0 && pageMatches.length === 0 && (
                <div className="px-4 py-12 text-center text-ink-400">
                  <Search size={24} className="mx-auto text-ink-300 mb-2" />
                  <div className="text-sm">Aucun résultat pour <strong className="text-ink-700">&quot;{query}&quot;</strong></div>
                  <Link href={`/rechercher?q=${encodeURIComponent(query)}`} onClick={() => setOpen(false)} className="text-brand-500 font-bold text-sm mt-2 inline-block">
                    Lancer une recherche complète →
                  </Link>
                </div>
              )}

              {searchingUsers && q && (
                <div className="px-4 py-3 text-xs text-ink-400 text-center">
                  Recherche en cours…
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

function UserResultItem({ user, onClick }: { user: UserResult; onClick: () => void }) {
  // Particulier → /membre/[client_number], Artisan → /profil/[client_number]
  const href = user.role === "artisan"
    ? `/profil/${user.client_number ?? user.id}`
    : `/membre/${user.client_number ?? user.id}`;
  const avatar = user.profile_photo ?? `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.display_name)}`;
  const isPro = user.role === "artisan";
  const sub = user.metier
    ? `${user.metier}${user.city ? ` · ${user.city}` : ""}`
    : user.city ?? (isPro ? "Artisan" : "Particulier");

  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-ink-50 transition group"
    >
      <div className="relative flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={avatar} alt="" className="w-9 h-9 rounded-full object-cover bg-ink-100 border border-ink-200" />
        {isPro && (
          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white inline-flex items-center justify-center">
            <ShieldCheck size={8} className="text-white" strokeWidth={3} />
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-ink-700 truncate">
          {user.display_name}
          <span className={`ml-1.5 text-[0.62rem] font-bold uppercase tracking-wider ${isPro ? "text-brand-600" : "text-blue-600"}`}>
            {isPro ? "Pro" : "Particulier"}
          </span>
        </div>
        <div className="text-xs text-ink-400 truncate">{sub}</div>
      </div>
      <ArrowRight size={14} className="text-ink-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition flex-shrink-0" />
    </Link>
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
