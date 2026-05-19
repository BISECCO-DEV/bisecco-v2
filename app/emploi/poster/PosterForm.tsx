"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, MapPin, Euro, Clock, FileText, ArrowRight, Send } from "lucide-react";
import { MetierCombobox } from "@/components/ui/MetierCombobox";

const CONTRACTS = ["CDI", "CDD", "Apprentissage", "Alternance", "Stage", "Intérim", "Freelance"];
const EXPERIENCES = ["Débutant", "1-3 ans", "3-5 ans", "5-10 ans", "10+ ans"];

export function PosterForm() {
  const router = useRouter();
  const [metier, setMetier] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    router.push("/emploi");
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-3xl shadow-card border border-ink-100 p-7 md:p-9 space-y-6">
      {/* Section 1 — Le poste */}
      <section>
        <h2 className="text-lg font-bold text-ink-700 mb-4 flex items-center gap-2">
          <Briefcase size={16} className="text-brand-500" /> Le poste
        </h2>
        <div className="space-y-4">
          <Field label="Intitulé du poste" placeholder="Ex: Apprenti·e boulanger·ère" required />
          <div>
            <label className="block text-sm font-bold text-ink-600 mb-1.5">Métier</label>
            <MetierCombobox value={metier} onChange={setMetier} variant="light" hideLabel placeholder="Sélectionner un métier" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Select label="Type de contrat" options={CONTRACTS} />
            <Select label="Expérience requise" options={EXPERIENCES} />
          </div>
          <Textarea
            label="Description du poste"
            hint="Min. 50 caractères"
            placeholder="Présentez l'entreprise, le contexte, les missions principales…"
            rows={5}
          />
        </div>
      </section>

      <hr className="border-ink-100" />

      {/* Section 2 — Lieu */}
      <section>
        <h2 className="text-lg font-bold text-ink-700 mb-4 flex items-center gap-2">
          <MapPin size={16} className="text-brand-500" /> Lieu de travail
        </h2>
        <div className="grid sm:grid-cols-[140px_1fr] gap-3">
          <Field label="Code postal" placeholder="77100" maxLength={5} required />
          <Field label="Ville" placeholder="Meaux" required />
        </div>
      </section>

      <hr className="border-ink-100" />

      {/* Section 3 — Rémunération */}
      <section>
        <h2 className="text-lg font-bold text-ink-700 mb-4 flex items-center gap-2">
          <Euro size={16} className="text-brand-500" /> Rémunération
        </h2>
        <div className="grid sm:grid-cols-[1fr_1fr_140px] gap-3">
          <Field label="Salaire min." type="number" placeholder="35000" required />
          <Field label="Salaire max." type="number" placeholder="48000" />
          <Select label="Période" options={["an", "mois", "heure", "jour"]} />
        </div>
        <p className="text-xs text-ink-400 mt-2">Les candidats voient une fourchette. Soyez transparent — ça attire mieux.</p>
      </section>

      <hr className="border-ink-100" />

      {/* Section 4 — Durée */}
      <section>
        <h2 className="text-lg font-bold text-ink-700 mb-4 flex items-center gap-2">
          <Clock size={16} className="text-brand-500" /> Durée de publication
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {["7 jours", "14 jours", "30 jours", "60 jours"].map((d, i) => (
            <button
              key={d}
              type="button"
              className={`px-4 py-3 rounded-xl border-2 text-sm font-bold transition ${
                i === 2 ? "bg-brand-50 border-brand-500 text-brand-700" : "bg-white border-ink-200 hover:border-brand-300"
              }`}
            >
              {d}
              {i === 2 && <div className="text-[0.65rem] text-brand-500 font-normal mt-0.5">Recommandé</div>}
            </button>
          ))}
        </div>
      </section>

      <hr className="border-ink-100" />

      {/* Section 5 — Validation */}
      <section className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200">
        <h3 className="font-bold text-ink-700 mb-1 text-sm flex items-center gap-2">
          <FileText size={14} className="text-emerald-600" /> Validation SIREN
        </h3>
        <p className="text-xs text-emerald-700 leading-relaxed">
          Votre offre sera publiée après vérification automatique de votre SIREN via l&apos;API gouv.fr (sous 24h).
        </p>
      </section>

      <label className="flex items-start gap-3 text-sm text-ink-500">
        <input type="checkbox" required className="mt-1 accent-brand-500" />
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

function Field({ label, hint, type = "text", placeholder, maxLength, required }: { label: string; hint?: string; type?: string; placeholder?: string; maxLength?: number; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-bold text-ink-600 mb-1.5">
        {label} {hint && <span className="font-normal text-ink-300">({hint})</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        className="w-full px-4 py-2.5 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none transition text-sm"
      />
    </div>
  );
}

function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label className="block text-sm font-bold text-ink-600 mb-1.5">{label}</label>
      <select className="w-full px-3 py-2.5 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none transition text-sm font-semibold">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Textarea({ label, hint, placeholder, rows = 5 }: { label: string; hint?: string; placeholder?: string; rows?: number }) {
  return (
    <div>
      <label className="block text-sm font-bold text-ink-600 mb-1.5">
        {label} {hint && <span className="font-normal text-ink-300">({hint})</span>}
      </label>
      <textarea
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none transition text-sm resize-y"
      />
    </div>
  );
}
