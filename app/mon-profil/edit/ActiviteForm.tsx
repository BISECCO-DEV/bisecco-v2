"use client";

import { useActionState, useMemo, useState } from "react";
import { Building2, MapPin, Clock, CheckCircle2, AlertCircle, Save } from "lucide-react";
import { MetierCombobox } from "@/components/ui/MetierCombobox";
import { updateActiviteAction, type ArtisanProfileState } from "@/lib/profile/artisan";

type MetierOption = { id: number; name: string };

type Props = {
  metiers: MetierOption[];
  initial: {
    metier_id: number | null;
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

  const [metierLabel, setMetierLabel] = useState<string>(
    initial.metier_id != null ? (idToName.get(initial.metier_id) ?? "") : "",
  );
  const metierId = nameToId.get(metierLabel.toLowerCase()) ?? null;

  const [state, formAction, isPending] = useActionState<ArtisanProfileState | undefined, FormData>(
    updateActiviteAction,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-ink-700">Activité & métier</h2>
        <p className="text-ink-400 text-sm mt-1">Définissez votre métier principal et votre zone d&apos;intervention.</p>
      </div>

      <div>
        <label className="block text-sm font-bold text-ink-600 mb-1.5">
          Métier principal <span className="text-brand-500">*</span>
        </label>
        <MetierCombobox
          value={metierLabel}
          onChange={setMetierLabel}
          variant="light"
          hideLabel
          placeholder="Choisir un métier"
        />
        <input type="hidden" name="metier_id" value={metierId ?? ""} />
        {state?.fieldErrors?.metier_id && (
          <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
            <AlertCircle size={12} /> {state.fieldErrors.metier_id}
          </p>
        )}
        {metierLabel && metierId == null && (
          <p className="mt-1 text-xs text-amber-600 flex items-center gap-1">
            <AlertCircle size={12} /> Métier non reconnu · sélectionnez-le dans la liste déroulante.
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
        <button type="submit" disabled={isPending || metierId == null} className="btn-primary disabled:opacity-50">
          {isPending ? "Enregistrement…" : (<><Save size={16} /> Enregistrer</>)}
        </button>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  icon,
  type = "text",
  defaultValue,
  placeholder,
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
