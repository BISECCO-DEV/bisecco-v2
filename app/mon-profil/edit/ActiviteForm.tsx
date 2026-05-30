"use client";

import { useActionState, useMemo, useState } from "react";
import { Building2, MapPin, Clock, CheckCircle2, AlertCircle, Save } from "lucide-react";
import { MultiMetierPicker, type MetierPick } from "@/components/ui/MultiMetierPicker";
import { updateActiviteAction, type ArtisanProfileState } from "@/lib/profile/artisan";

type MetierOption = { id: number; name: string };

type Props = {
  metiers: MetierOption[];
  initial: {
    metier_ids: number[];
    company_name: string;
    service_radius: number | null;
    availability: string;
  };
};

export function ActiviteForm({ metiers, initial }: Props) {
  const idToName = useMemo(() => {
    const m = new Map<number, string>();
    metiers.forEach((x) => m.set(x.id, x.name));
    return m;
  }, [metiers]);

  const nameToId = useMemo(() => {
    const m = new Map<string, number>();
    metiers.forEach((x) => m.set(x.name.toLowerCase(), x.id));
    return m;
  }, [metiers]);

  // Initial picks à partir des IDs
  const initialPicks: MetierPick[] = useMemo(
    () =>
      initial.metier_ids
        .map((id) => idToName.get(id))
        .filter((n): n is string => Boolean(n))
        .map((name) => ({ name, slug: null })),
    [initial.metier_ids, idToName],
  );

  const [picks, setPicks] = useState<MetierPick[]>(initialPicks);

  // Calculer les IDs sélectionnés (en ignorant les custom)
  const selectedIds = useMemo(() => {
    return picks
      .map((p) => nameToId.get(p.name.toLowerCase()))
      .filter((id): id is number => typeof id === "number");
  }, [picks, nameToId]);

  const hasInvalid = picks.some((p) => !nameToId.has(p.name.toLowerCase()));

  const [state, formAction, isPending] = useActionState<ArtisanProfileState | undefined, FormData>(
    updateActiviteAction,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-ink-700">Activité & métiers</h2>
        <p className="text-ink-400 text-sm mt-1">
          Choisissez jusqu&apos;à <strong>3 métiers</strong>. Le premier sera votre métier principal.
        </p>
      </div>

      <div>
        <label className="block text-sm font-bold text-ink-600 mb-1.5">
          Vos métiers <span className="text-brand-500">*</span>{" "}
          <span className="font-normal text-ink-400">({picks.length}/3)</span>
        </label>
        <MultiMetierPicker value={picks} onChange={setPicks} max={3} variant="light" />
        <input type="hidden" name="metier_ids" value={JSON.stringify(selectedIds)} />

        {state?.fieldErrors?.metier_ids && (
          <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
            <AlertCircle size={12} /> {state.fieldErrors.metier_ids}
          </p>
        )}
        {hasInvalid && (
          <p className="mt-1 text-xs text-amber-600 flex items-center gap-1">
            <AlertCircle size={12} /> Un ou plusieurs métiers ne sont pas dans le référentiel et seront ignorés.
          </p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          name="company_name"
          label="Nom de la société"
          icon={<Building2 size={15} />}
          defaultValue={initial.company_name}
          placeholder="Dupont Maçonnerie"
        />
        <Field
          name="service_radius"
          label="Rayon d'intervention (km)"
          icon={<MapPin size={15} />}
          type="number"
          defaultValue={initial.service_radius != null ? String(initial.service_radius) : ""}
          placeholder="30"
        />
      </div>

      <Field
        name="availability"
        label="Disponibilité"
        icon={<Clock size={15} />}
        defaultValue={initial.availability}
        placeholder="Sous 48h en semaine"
      />

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-ink-100">
        {state?.ok && (
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600">
            <CheckCircle2 size={14} /> Enregistré
          </span>
        )}
        {state?.error && !state.fieldErrors && (
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-red-600">
            <AlertCircle size={14} /> {state.error}
          </span>
        )}
        <button
          type="submit"
          disabled={isPending || selectedIds.length === 0}
          className="btn-primary disabled:opacity-50"
        >
          {isPending ? "Enregistrement…" : (<><Save size={16} /> Enregistrer</>)}
        </button>
      </div>
    </form>
  );
}

function Field({
  name, label, icon, type = "text", defaultValue, placeholder,
}: {
  name: string;
  label: string;
  icon: React.ReactNode;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-ink-600 mb-1.5">{label}</label>
      <div className="flex items-center gap-2 px-3 rounded-xl bg-ink-50 border-2 border-ink-200 focus-within:border-brand-500 focus-within:bg-white transition">
        <span className="text-ink-300 flex-shrink-0">{icon}</span>
        <input
          name={name}
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="flex-1 bg-transparent py-2.5 outline-none text-sm text-ink-700 placeholder:text-ink-300"
        />
      </div>
    </div>
  );
}
