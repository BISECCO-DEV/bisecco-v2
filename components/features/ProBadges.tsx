import { Award } from "lucide-react";
import type { ProBadge } from "@/lib/badges/compute";

const COLOR_CLASSES: Record<ProBadge["color"], string> = {
  gold:    "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 text-amber-700",
  purple:  "bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 text-purple-700",
  emerald: "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200 text-emerald-700",
  blue:    "bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200 text-blue-700",
  orange:  "bg-gradient-to-br from-brand-50 to-amber-50 border-brand-200 text-brand-700",
};

export function ProBadges({ badges }: { badges: ProBadge[] }) {
  if (badges.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-5 border border-ink-100">
      <h3 className="font-bold text-ink-700 text-sm flex items-center gap-2 mb-3">
        <Award size={14} className="text-amber-500" /> Badges
      </h3>
      <ul className="space-y-2">
        {badges.map((b) => (
          <li
            key={b.key}
            className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 ${COLOR_CLASSES[b.color]}`}
          >
            <span className="text-xl leading-none flex-shrink-0">{b.emoji}</span>
            <div className="min-w-0">
              <div className="font-bold text-sm leading-tight">{b.label}</div>
              <div className="text-xs opacity-80 mt-0.5 leading-snug">{b.description}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
