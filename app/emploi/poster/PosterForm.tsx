"use client";

import { useState } from "react";
import { Briefcase, MapPin, Euro, Clock, FileText, ArrowRight, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { MetierCombobox } from "@/components/ui/MetierCombobox";
import { submitJobPostingAction } from "@/lib/emploi/actions";

const CONTRACTS = ["CDI", "CDD", "Apprentissage", "Alternance", "Stage", "Intérim", "Freelance"];
const EXPERIENCES = ["Débutant", "1-3 ans", "3-5 ans", "5-10 ans", "10+ ans"];

export function PosterForm() {
  const [metier, setMetier] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    fd.set("metier", metier);
    const res = await submitJobPostingAction(fd);
    setSubmitting(false);
    if (res.ok) {
      setSent(true);
    } else {
      setError(res.error);
    }
  };

  if (sent) {
    return (
      <div className="bg-white rounded-3xl shadow-card border border-ink-100 p-10 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-4">
          <CheckCircle2 size={32} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-ink-700">Offre soumise pour validation</h2>
        <p className="text-ink-500 mt-2 max-w-md mx-auto">
          Votre offre a été envoyée à notre équipe. Après vérification de votre SIREN (sous 24h), elle sera publiée sur la page Emploi.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-3xl shadow-card border border-ink-100 p-7 md:p-9 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <section>
        <h2 className="text-lg font-bold text-ink-700 mb-4 flex items-center gap-2">
          <Briefcase size={16} className="text-brand-500" /> Le poste
        </h2>
        <div className="space-y-4">
          <Field name="title" label="Intitulé du poste" placeholder="Ex: Apprenti·e boulanger·ère" required />
          <div>
            <label className="block text-sm font-bold text-ink-600 mb-1.5">Métier</label>
            <MetierCombobox value={metier} onChange={setMetier} variant="light" hideLabel placeholder="Sélectionner un métier" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Select name="contract" label="Type de contrat" options={CONTRACTS} />
            <Select name="experience" label="Expérience requise" options={EXPERIENCES} />
          </div>
          <Textarea
            name="description"
            label="Description du poste"
            hint="Min. 50 caractères"
            placeholder="Présentez l'entreprise, le contexte, les missions principales…"
            rows={5}
            required
          />
        </div>
      </section>

      <hr className="border-ink-100" />

      <section>
        <h2 className="text-lg font-bold text-ink-700 mb-4 flex items-center gap-2">
          <MapPin size={16} className="text-brand-500" /> Lieu de travail
        </h2>
        <div className="grid sm:grid-cols-[140px_1fr] gap-3">
          <Field name="postal_code" label="Code postal" placeholder="77100" maxLength={5} required />
          <Field name="city" label="Ville" placeholder="Meaux" required />
        </div>
      </section>

      <hr className="border-ink-100" />

      <section>
        <h2 className="text-lg font-bold text-ink-700 mb-4 flex items-center gap-2">
          <Euro size={16} className="text-brand-500" /> Rémunération
        </h2>
        <div className="grid sm:grid-cols-[1fr_1fr_140px] gap-3">
          <Field name="salary_min" label="Salaire min." type="number" placeholder="35000" required />
          <Field name="salary_max" label="Salaire max." type="number" placeholder="48000" />
          <Select name="salary_period" label="Période" options={["an", "mois", "heure", "jour"]} />
        </div>
      </section>

      <hr className="border-ink-100" />

      <section>
        <h2 className="text-lg font-bold text-ink-700 mb-4 flex items-center gap-2">
          <Clock size={16} className="text-brand-500" /> Coordonnées entreprise
        </h2>
        <div className="space-y-3">
          <Field name="company_name" label="Nom de l'entreprise" placeholder="Ex: Boulangerie Dupont" required />
          <Field name="siren" label="SIREN (9 chiffres)" placeholder="123456789" maxLength={9} required />
          <div className="grid sm:grid-cols-2 gap-3">
            <Field name="contact_name" label="Personne à contacter" placeholder="Jean Dupont" required />
            <Field name="contact_email" type="email" label="Email" placeholder="rh@entreprise.fr" required />
          </div>
        </div>
      </section>

      <hr className="border-ink-100" />

      <section className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200">
        <h3 className="font-bold text-ink-700 mb-1 text-sm flex items-center gap-2">
          <FileText size={14} className="text-emerald-600" /> Validation SIREN
        </h3>
        <p className="text-xs text-emerald-700 leading-relaxed">
          Votre offre sera publiée après vérification automatique de votre SIREN via l&apos;API gouv.fr (sous 24h).
        </p>
      </section>

      <label className="flex items-start gap-3 text-sm text-ink-500">
        <input type="checkbox" name="consent" required className="mt-1 accent-brand-500" />
        <span>
          Je certifie que l&apos;offre est réelle et respecte les{" "}
          <a href="/cgv" className="text-brand-500 font-bold hover:underline">conditions d&apos;utilisation</a>{" "}
          de Bisecco (notamment l&apos;interdiction de discrimination).
        </span>
      </label>

      <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
        {submitting ? "Publication…" : (<><Send size={15} /> Publier mon offre</>)}
        {!submitting && <ArrowRight size={14} />}
      </button>
    </form>
  );
}

function Field({ name, label, hint, type = "text", placeholder, maxLength, required }: { name: string; label: string; hint?: string; type?: string; placeholder?: string; maxLength?: number; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-bold text-ink-600 mb-1.5">
        {label} {hint && <span className="font-normal text-ink-300">({hint})</span>}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        className="w-full px-4 py-2.5 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none transition text-sm"
      />
    </div>
  );
}

function Select({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <div>
      <label className="block text-sm font-bold text-ink-600 mb-1.5">{label}</label>
      <select name={name} className="w-full px-3 py-2.5 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none transition text-sm font-semibold">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Textarea({ name, label, hint, placeholder, rows = 5, required }: { name: string; label: string; hint?: string; placeholder?: string; rows?: number; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-bold text-ink-600 mb-1.5">
        {label} {hint && <span className="font-normal text-ink-300">({hint})</span>}
      </label>
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none transition text-sm resize-y"
      />
    </div>
  );
}
