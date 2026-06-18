"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Loader2, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { saveAvailabilityAction } from "@/lib/availability/actions";
import { DAY_LABELS, type AvailabilitySlot } from "@/lib/availability/utils";

const PRESETS = [
  {
    name: "Bureau classique",
    sub: "Lun–Ven · 9h–18h",
    slots: [1, 2, 3, 4, 5].map((d) => ({ day_of_week: d, start_time: "09:00", end_time: "18:00" })),
  },
  {
    name: "Bureau étendu",
    sub: "Lun–Sam · 8h–19h",
    slots: [1, 2, 3, 4, 5, 6].map((d) => ({ day_of_week: d, start_time: "08:00", end_time: "19:00" })),
  },
  {
    name: "Urgences 24/7",
    sub: "Dim–Sam · 24h/24",
    slots: [0, 1, 2, 3, 4, 5, 6].map((d) => ({ day_of_week: d, start_time: "00:00", end_time: "23:59" })),
  },
];

type LocalSlot = Omit<AvailabilitySlot, "id"> & { _key: string };

let _idCounter = 0;
const makeKey = () => `k${++_idCounter}-${typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().slice(0, 8) : ""}`;

export function AvailabilityEditor({ initial }: { initial: AvailabilitySlot[] }) {
  const [slots, setSlots] = useState<LocalSlot[]>(
    initial.map((s) => ({ ...s, _key: makeKey() })),
  );
  const [savedFeedback, setSavedFeedback] = useState<"ok" | "error" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const addSlot = (day: number) => {
    setSlots((prev) => [
      ...prev,
      { day_of_week: day, start_time: "09:00", end_time: "18:00", _key: makeKey() },
    ]);
  };

  const removeSlot = (key: string) => {
    setSlots((prev) => prev.filter((s) => s._key !== key));
  };

  const updateSlot = (key: string, patch: Partial<LocalSlot>) => {
    setSlots((prev) => prev.map((s) => (s._key === key ? { ...s, ...patch } : s)));
  };

  const applyPreset = (preset: typeof PRESETS[number]) => {
    setSlots(preset.slots.map((s) => ({ ...s, _key: makeKey() })));
  };

  const save = () => {
    setError(null);
    setSavedFeedback(null);
    const payload = slots.map(({ _key: _, ...s }) => s);
    const fd = new FormData();
    fd.set("slots", JSON.stringify(payload));
    startTransition(async () => {
      const res = await saveAvailabilityAction(undefined, fd);
      if (res.ok) {
        setSavedFeedback("ok");
        setTimeout(() => setSavedFeedback(null), 2500);
      } else {
        setError(res.error ?? "Erreur");
        setSavedFeedback("error");
      }
    });
  };

  // Regroupe les slots par jour pour affichage
  const byDay = new Map<number, LocalSlot[]>();
  for (let d = 0; d < 7; d++) byDay.set(d, []);
  for (const s of slots) byDay.get(s.day_of_week)?.push(s);

  // Ordre d'affichage : Lundi → Dimanche
  const displayOrder = [1, 2, 3, 4, 5, 6, 0];

  return (
    <div className="space-y-5">
      {/* Presets */}
      <div>
        <p className="text-xs font-bold text-ink-600 uppercase tracking-wider mb-2">
          Modèles rapides
        </p>
        <div className="grid sm:grid-cols-3 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPreset(p)}
              className="text-left rounded-xl border-2 border-ink-100 px-3 py-2 hover:border-brand-300 hover:bg-brand-50/40 transition"
            >
              <div className="font-bold text-sm text-ink-700">{p.name}</div>
              <div className="text-xs text-ink-400">{p.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Grille jours */}
      <div className="space-y-2">
        {displayOrder.map((d) => {
          const daySlots = byDay.get(d) ?? [];
          return (
            <div
              key={d}
              className={`rounded-xl border-2 p-3 ${daySlots.length === 0 ? "border-ink-100 bg-ink-50/40" : "border-emerald-200 bg-emerald-50/30"}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-ink-700 w-20">{DAY_LABELS[d]}</span>
                  {daySlots.length === 0 && (
                    <span className="text-xs text-ink-400">Fermé</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => addSlot(d)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold text-brand-600 hover:bg-brand-50 transition"
                >
                  <Plus size={11} /> Créneau
                </button>
              </div>

              {daySlots.length > 0 && (
                <div className="mt-2 space-y-2">
                  {daySlots.map((s) => (
                    <div key={s._key} className="flex items-center gap-2 text-sm">
                      <Clock size={13} className="text-emerald-600 flex-shrink-0" />
                      <input
                        type="time"
                        value={s.start_time}
                        onChange={(e) => updateSlot(s._key, { start_time: e.target.value })}
                        className="px-2 py-1 rounded border border-ink-200 bg-white text-sm w-[100px]"
                      />
                      <span className="text-ink-400">→</span>
                      <input
                        type="time"
                        value={s.end_time}
                        onChange={(e) => updateSlot(s._key, { end_time: e.target.value })}
                        className="px-2 py-1 rounded border border-ink-200 bg-white text-sm w-[100px]"
                      />
                      <button
                        type="button"
                        onClick={() => removeSlot(s._key)}
                        className="ml-auto p-1 rounded text-ink-400 hover:text-red-600 hover:bg-red-50"
                        aria-label="Supprimer le créneau"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Save bar */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-ink-100">
        {savedFeedback === "ok" && (
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600">
            <CheckCircle2 size={14} /> Disponibilités enregistrées
          </span>
        )}
        {savedFeedback === "error" && error && (
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-red-600">
            <AlertCircle size={14} /> {error}
          </span>
        )}
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition disabled:opacity-50"
        >
          {pending ? <><Loader2 size={14} className="animate-spin" /> Enregistrement…</> : "Enregistrer mes disponibilités"}
        </button>
      </div>
    </div>
  );
}
