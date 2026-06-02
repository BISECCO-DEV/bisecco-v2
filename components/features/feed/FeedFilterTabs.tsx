"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

const TABS = [
  { value: null, label: "Tout" },
  { value: "realisation", label: "Réalisations" },
  { value: "conseil", label: "Conseils" },
  { value: "question", label: "Questions" },
];

/**
 * Tabs minimalistes style X / Threads : texte uniquement, indicateur barre orange
 * sous l'onglet actif. Pas d'icône, pas de fond, juste typographie.
 */
export function FeedFilterTabs() {
  const sp = useSearchParams();
  const pathname = usePathname();
  const active = sp.get("kind");

  const buildHref = (kind: string | null) => {
    const params = new URLSearchParams(sp.toString());
    if (kind) params.set("kind", kind);
    else params.delete("kind");
    const q = params.toString();
    return q ? `${pathname}?${q}` : pathname;
  };

  return (
    <nav
      aria-label="Filtrer le fil"
      className="flex items-center gap-1 overflow-x-auto scrollbar-hide -mx-1 px-1"
    >
      {TABS.map((t) => {
        const isActive = active === t.value;
        return (
          <Link
            key={t.label}
            href={buildHref(t.value)}
            className={`relative inline-flex items-center px-4 py-3 text-[0.86rem] font-bold whitespace-nowrap transition flex-shrink-0 ${
              isActive
                ? "text-ink-900"
                : "text-ink-400 hover:text-ink-700"
            }`}
          >
            {t.label}
            <span
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] rounded-full transition-all ${
                isActive
                  ? "w-12 bg-brand-500"
                  : "w-0 bg-transparent"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
