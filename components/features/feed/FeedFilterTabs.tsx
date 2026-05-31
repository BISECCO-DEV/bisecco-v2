"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { Sparkles, Hammer, HelpCircle, Lightbulb } from "lucide-react";

const TABS = [
  { value: null,           label: "Tout",         icon: Sparkles,   color: "text-ink-600" },
  { value: "realisation",  label: "Réalisations", icon: Hammer,     color: "text-brand-600" },
  { value: "conseil",      label: "Conseils",     icon: Lightbulb,  color: "text-violet-600" },
  { value: "question",     label: "Questions",    icon: HelpCircle, color: "text-blue-600" },
];

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
    <div className="bg-white rounded-2xl border border-ink-100 p-1.5 flex items-center gap-1 overflow-x-auto scrollbar-hide">
      {TABS.map((t) => {
        const isActive = active === t.value;
        const Icon = t.icon;
        return (
          <Link
            key={t.label}
            href={buildHref(t.value)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[0.82rem] font-bold whitespace-nowrap transition flex-shrink-0 ${
              isActive
                ? "bg-ink-900 text-white shadow-sm"
                : `${t.color} hover:bg-ink-50`
            }`}
          >
            <Icon size={13} strokeWidth={2.4} />
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
