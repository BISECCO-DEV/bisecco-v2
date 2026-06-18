import { Clock } from "lucide-react";
import { computeAvailabilityStatus, DAY_LABELS, DAY_SHORT, type AvailabilitySlot } from "@/lib/availability/utils";

type Props = {
  slots: AvailabilitySlot[];
  variant?: "compact" | "full";
};

/**
 * Server component pur (pas de "use client").
 * Calcule le statut "dispo maintenant" au moment du render serveur.
 *
 * Variantes :
 *  - compact : badge "Disponible jusqu'à 18h" / "Fermé · ouvre demain 9h"
 *  - full    : carte avec planning détaillé semaine
 */
export function AvailabilityWidget({ slots, variant = "full" }: Props) {
  if (slots.length === 0) return null;

  const status = computeAvailabilityStatus(slots);

  // ─── Variante COMPACT ──────────────────────────────────────────────
  if (variant === "compact") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.72rem] font-bold ${
          status.isOpenNow
            ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
            : "bg-ink-50 border border-ink-100 text-ink-600"
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${status.isOpenNow ? "bg-emerald-500 animate-pulse" : "bg-ink-300"}`} />
        {status.isOpenNow
          ? `Ouvert jusqu'à ${status.currentSlotEnd?.slice(0, 5)}`
          : status.nextSlot
          ? `Ouvre ${status.nextSlot.day.toLowerCase()} ${status.nextSlot.start.slice(0, 5)}`
          : "Disponibilités sur demande"}
      </span>
    );
  }

  // ─── Variante FULL ─────────────────────────────────────────────────
  // Regroupe par jour pour affichage
  const byDay = new Map<number, AvailabilitySlot[]>();
  for (let d = 0; d < 7; d++) byDay.set(d, []);
  for (const s of slots) byDay.get(s.day_of_week)?.push(s);
  const displayOrder = [1, 2, 3, 4, 5, 6, 0];

  return (
    <div className="bg-white rounded-2xl p-5 border border-ink-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-ink-700 text-sm flex items-center gap-2">
          <Clock size={14} className="text-brand-500" /> Disponibilités
        </h3>
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[0.65rem] font-bold ${
            status.isOpenNow ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-ink-50 text-ink-500 border border-ink-100"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.isOpenNow ? "bg-emerald-500 animate-pulse" : "bg-ink-300"}`} />
          {status.isOpenNow ? "Ouvert" : "Fermé"}
        </span>
      </div>

      {!status.isOpenNow && status.nextSlot && (
        <p className="text-xs text-ink-500 mb-3 pb-3 border-b border-ink-100">
          Prochaine ouverture · <strong className="text-ink-700">{status.nextSlot.day} {status.nextSlot.start.slice(0, 5)}</strong>
        </p>
      )}
      {status.isOpenNow && status.currentSlotEnd && (
        <p className="text-xs text-emerald-700 mb-3 pb-3 border-b border-emerald-100">
          Disponible jusqu&apos;à <strong>{status.currentSlotEnd.slice(0, 5)}</strong>
        </p>
      )}

      <ul className="space-y-1.5">
        {displayOrder.map((d) => {
          const dSlots = byDay.get(d) ?? [];
          const isEmpty = dSlots.length === 0;
          return (
            <li key={d} className="flex items-center justify-between text-xs">
              <span className={`font-semibold w-14 ${isEmpty ? "text-ink-400" : "text-ink-700"}`}>
                {DAY_SHORT[d]}
              </span>
              <span className={isEmpty ? "text-ink-400" : "text-ink-700"}>
                {isEmpty
                  ? "—"
                  : dSlots
                      .map((s) => `${s.start_time.slice(0, 5)}–${s.end_time.slice(0, 5)}`)
                      .join(", ")}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Silence "DAY_LABELS unused" si pas utilisé dans cette variante
void DAY_LABELS;
