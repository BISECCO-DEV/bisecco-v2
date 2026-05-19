"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { setServicesAction, type ServiceRow } from "@/lib/profile/artisan";

type Service = { name: string; price: string };

export function ServicesForm({ initial }: { initial: ServiceRow[] }) {
  const [services, setServices] = useState<Service[]>(
    initial.length > 0
      ? initial.map((s) => ({ name: s.name, price: s.price ?? "" }))
      : [{ name: "", price: "" }],
  );
  const [feedback, setFeedback] = useState<{ ok?: boolean; error?: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const add = () => setServices([...services, { name: "", price: "" }]);
  const remove = (i: number) => setServices(services.filter((_, idx) => idx !== i));
  const update = (i: number, key: keyof Service, value: string) => {
    const next = [...services];
    next[i] = { ...next[i], [key]: value };
    setServices(next);
  };

  const save = () => {
    setFeedback(null);
    const payload = services
      .map((s) => ({ name: s.name.trim(), price: s.price.trim() }))
      .filter((s) => s.name.length > 0);

    const fd = new FormData();
    fd.append("services", JSON.stringify(payload));

    startTransition(async () => {
      const result = await setServicesAction(undefined, fd);
      setFeedback(result.ok ? { ok: true } : { error: result.error });
    });
  };

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink-700">Services & tarifs</h2>
          <p className="text-ink-400 text-sm mt-1">Ajoutez vos prestations avec un prix indicatif (ex : « 50 € / m² »).</p>
        </div>
        <button
          type="button"
          onClick={add}
          disabled={services.length >= 20}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-500 hover:text-brand-600 disabled:opacity-50"
        >
          <Plus size={14} /> Ajouter
        </button>
      </div>

      <div className="space-y-3">
        {services.map((s, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_180px_auto] gap-3 items-end p-4 rounded-xl bg-ink-50/60 border border-ink-100"
          >
            <div>
              <label className="block text-[0.7rem] font-bold text-ink-400 uppercase tracking-wider mb-1">
                Service
              </label>
              <input
                type="text"
                value={s.name}
                onChange={(e) => update(i, "name", e.target.value)}
                placeholder="Ex : Pose de carrelage"
                className="w-full px-3 py-2 rounded-lg bg-white border border-ink-200 focus:border-brand-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-[0.7rem] font-bold text-ink-400 uppercase tracking-wider mb-1">
                Tarif (libre)
              </label>
              <input
                type="text"
                value={s.price}
                onChange={(e) => update(i, "price", e.target.value)}
                placeholder="50 € / m²"
                className="w-full px-3 py-2 rounded-lg bg-white border border-ink-200 focus:border-brand-500 outline-none text-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="p-2 text-ink-400 hover:text-red-500 transition"
              aria-label="Supprimer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-8 text-ink-400 text-sm bg-ink-50/60 rounded-xl border border-dashed border-ink-200">
          Aucun service.{" "}
          <button type="button" onClick={add} className="text-brand-500 font-bold">
            Ajouter le premier
          </button>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-ink-100">
        {feedback?.ok && (
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600">
            <CheckCircle2 size={14} /> Enregistré
          </span>
        )}
        {feedback?.error && (
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-red-600">
            <AlertCircle size={14} /> {feedback.error}
          </span>
        )}
        <button type="button" onClick={save} disabled={pending} className="btn-primary disabled:opacity-50">
          {pending ? "Enregistrement…" : (<><Save size={16} /> Enregistrer la liste</>)}
        </button>
      </div>
    </section>
  );
}
