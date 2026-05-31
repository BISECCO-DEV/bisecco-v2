"use client";

import { useState } from "react";
import {
  User, Briefcase, GraduationCap, Languages, Award, Plus, Trash2,
  Save, MapPin, Calendar,
} from "lucide-react";
import { MetierCombobox } from "@/components/ui/MetierCombobox";
import type { MetierOption } from "@/lib/metiers";
import { saveCvAction } from "@/lib/cv/actions";

type Experience = { id: string; poste: string; entreprise: string; debut: string; fin: string; description: string };
type Formation = { id: string; diplome: string; ecole: string; annee: string };
type Langue = { id: string; nom: string; niveau: string };

type Metier = { id: number; name: string; slug: string; category?: string; icon: string | null };

type InitialCv = {
  cv_data: {
    experiences: Experience[];
    formations: Formation[];
    langues: Langue[];
    competences: string[];
  } | null;
  cv_title: string | null;
  cv_about: string | null;
  cv_search_city: string | null;
  cv_search_radius: number | null;
  cv_available_from: string | null;
  metier: { slug: string; name: string } | null;
} | null;

const NIVEAUX = ["Notions", "Intermédiaire", "Courant", "Bilingue", "Natif"];
const uid = () => Math.random().toString(36).slice(2, 9);

export function CVEditor({ initialCv, metiers }: { initialCv: InitialCv; metiers: Metier[] }) {
  const [metierSlug, setMetierSlug] = useState(initialCv?.metier?.slug ?? "");
  const [title, setTitle] = useState(initialCv?.cv_title ?? "");
  const [about, setAbout] = useState(initialCv?.cv_about ?? "");
  const [searchCity, setSearchCity] = useState(initialCv?.cv_search_city ?? "");
  const [searchRadius, setSearchRadius] = useState(String(initialCv?.cv_search_radius ?? "30"));
  const [availableFrom, setAvailableFrom] = useState(initialCv?.cv_available_from ?? "");

  const [experiences, setExperiences] = useState<Experience[]>(
    initialCv?.cv_data?.experiences ?? [{ id: uid(), poste: "", entreprise: "", debut: "", fin: "", description: "" }],
  );
  const [formations, setFormations] = useState<Formation[]>(
    initialCv?.cv_data?.formations ?? [{ id: uid(), diplome: "", ecole: "", annee: "" }],
  );
  const [langues, setLangues] = useState<Langue[]>(
    initialCv?.cv_data?.langues ?? [{ id: uid(), nom: "Français", niveau: "Natif" }],
  );
  const [competences, setCompetences] = useState<string[]>(initialCv?.cv_data?.competences ?? []);
  const [newComp, setNewComp] = useState("");

  // Resolve metier name from slug (for combobox value display)
  const metierName = metiers.find((m) => m.slug === metierSlug)?.name ?? "";

  // Convertit les métiers passés en props vers le format attendu par le combobox
  const metierOptions: MetierOption[] = metiers.map((m) => ({
    name: m.name,
    category: m.category ?? "Autre",
    icon: m.icon ?? "🛠️",
  }));

  const cvJson = JSON.stringify({ experiences, formations, langues, competences });

  return (
    <div className="mt-7 space-y-5">
      <form action={saveCvAction} className="space-y-5">
        {/* Hidden : payload JSON + métier slug */}
        <input type="hidden" name="cv_json" value={cvJson} />
        <input type="hidden" name="metier_slug" value={metierSlug} />

        {/* Identité / métier */}
        <Card icon={<User size={16} />} title="Profil & métier visé">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-ink-600 mb-1.5">Titre du CV</label>
              <input
                type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="ex: Boulanger expérimenté cherche CDI"
                className="w-full px-4 py-3 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none transition text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-ink-600 mb-1.5">Métier visé</label>
              <MetierCombobox
                value={metierName}
                onChange={(name) => {
                  const m = metiers.find((x) => x.name === name);
                  setMetierSlug(m?.slug ?? "");
                }}
                variant="light"
                hideLabel
                placeholder="Sélectionner un métier"
                options={metierOptions}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-bold text-ink-600 mb-1.5">Présentation (2-3 lignes)</label>
            <textarea
              name="about" value={about} onChange={(e) => setAbout(e.target.value)}
              rows={3} maxLength={1000}
              placeholder="Décrivez votre parcours, vos passions, ce qui vous différencie..."
              className="w-full px-4 py-3 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none transition text-sm resize-y"
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-3 mt-4">
            <div>
              <label className="text-sm font-bold text-ink-600 mb-1.5 flex items-center gap-1.5"><MapPin size={13} /> Ville recherchée</label>
              <input
                type="text" name="search_city" value={searchCity} onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Meaux, Paris, Cannes..."
                className="w-full px-4 py-2.5 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-ink-600 mb-1.5 flex items-center gap-1.5"><MapPin size={13} /> Rayon (km)</label>
              <input
                type="number" name="search_radius" value={searchRadius} onChange={(e) => setSearchRadius(e.target.value)}
                min={5} max={300}
                className="w-full px-4 py-2.5 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-ink-600 mb-1.5 flex items-center gap-1.5"><Calendar size={13} /> Disponible à partir de</label>
              <input
                type="date" name="available_from" value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none text-sm"
              />
            </div>
          </div>
        </Card>

        {/* Expériences */}
        <Card
          icon={<Briefcase size={16} />}
          title="Expériences professionnelles"
          action={
            <button
              type="button"
              onClick={() => setExperiences([...experiences, { id: uid(), poste: "", entreprise: "", debut: "", fin: "", description: "" }])}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
            >
              <Plus size={12} /> Ajouter
            </button>
          }
        >
          <div className="space-y-3">
            {experiences.map((e, i) => (
              <div key={e.id} className="bg-ink-50 rounded-xl p-4 border border-ink-100">
                <div className="grid sm:grid-cols-2 gap-3">
                  <SmallField label="Poste" value={e.poste} onChange={(v) => updateAt(experiences, setExperiences, i, "poste", v)} />
                  <SmallField label="Entreprise" value={e.entreprise} onChange={(v) => updateAt(experiences, setExperiences, i, "entreprise", v)} />
                  <SmallField label="Début (mois/année)" value={e.debut} onChange={(v) => updateAt(experiences, setExperiences, i, "debut", v)} placeholder="09/2023" />
                  <SmallField label="Fin (ou 'en cours')" value={e.fin} onChange={(v) => updateAt(experiences, setExperiences, i, "fin", v)} placeholder="06/2025" />
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-bold text-ink-600 mb-1">Missions / réalisations</label>
                  <textarea
                    rows={2}
                    value={e.description}
                    onChange={(ev) => updateAt(experiences, setExperiences, i, "description", ev.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-ink-200 focus:border-brand-500 outline-none transition text-sm resize-y"
                  />
                </div>
                {experiences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setExperiences(experiences.filter((x) => x.id !== e.id))}
                    className="mt-2 text-xs text-red-500 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <Trash2 size={11} /> Supprimer
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Formations */}
        <Card
          icon={<GraduationCap size={16} />}
          title="Formations & diplômes"
          action={
            <button
              type="button"
              onClick={() => setFormations([...formations, { id: uid(), diplome: "", ecole: "", annee: "" }])}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
            >
              <Plus size={12} /> Ajouter
            </button>
          }
        >
          <div className="space-y-3">
            {formations.map((f, i) => (
              <div key={f.id} className="bg-ink-50 rounded-xl p-4 border border-ink-100 grid sm:grid-cols-3 gap-3">
                <SmallField label="Diplôme" value={f.diplome} onChange={(v) => updateAt(formations, setFormations, i, "diplome", v)} />
                <SmallField label="École/CFA" value={f.ecole} onChange={(v) => updateAt(formations, setFormations, i, "ecole", v)} />
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <SmallField label="Année" value={f.annee} onChange={(v) => updateAt(formations, setFormations, i, "annee", v)} />
                  </div>
                  {formations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setFormations(formations.filter((x) => x.id !== f.id))}
                      className="mb-1 w-10 h-10 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Langues */}
        <Card
          icon={<Languages size={16} />}
          title="Langues parlées"
          action={
            <button
              type="button"
              onClick={() => setLangues([...langues, { id: uid(), nom: "", niveau: "Intermédiaire" }])}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
            >
              <Plus size={12} /> Ajouter
            </button>
          }
        >
          <div className="space-y-2">
            {langues.map((l, i) => (
              <div key={l.id} className="flex items-end gap-2">
                <div className="flex-1">
                  <SmallField label="Langue" value={l.nom} onChange={(v) => updateAt(langues, setLangues, i, "nom", v)} />
                </div>
                <div className="w-44">
                  <label className="block text-xs font-bold text-ink-600 mb-1">Niveau</label>
                  <select
                    value={l.niveau}
                    onChange={(e) => updateAt(langues, setLangues, i, "niveau", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-ink-200 focus:border-brand-500 outline-none text-sm"
                  >
                    {NIVEAUX.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                {langues.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setLangues(langues.filter((x) => x.id !== l.id))}
                    className="mb-1 w-10 h-10 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Compétences */}
        <Card icon={<Award size={16} />} title="Compétences clés">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComp}
              onChange={(e) => setNewComp(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (newComp.trim() && competences.length < 30) {
                    setCompetences([...competences, newComp.trim()]);
                    setNewComp("");
                  }
                }
              }}
              placeholder="Tapez puis Entrée (ex: Pétrissage, Soudure...)"
              className="flex-1 px-4 py-2.5 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none text-sm"
            />
            <button
              type="button"
              onClick={() => {
                if (newComp.trim() && competences.length < 30) {
                  setCompetences([...competences, newComp.trim()]);
                  setNewComp("");
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-bold hover:bg-brand-600"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {competences.map((c, i) => (
              <span
                key={`${c}-${i}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-sm font-semibold"
              >
                {c}
                <button
                  type="button"
                  onClick={() => setCompetences(competences.filter((_, idx) => idx !== i))}
                  className="text-brand-500 hover:text-brand-700"
                >
                  ×
                </button>
              </span>
            ))}
            {competences.length === 0 && (
              <p className="text-xs text-ink-400 italic">Aucune compétence ajoutée. Tapez et appuyez sur Entrée.</p>
            )}
          </div>
        </Card>

        {/* Save button */}
        <div className="sticky bottom-4 z-20 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-extrabold shadow-[0_8px_24px_-6px_rgba(240,122,47,0.55)] hover:-translate-y-0.5 transition"
          >
            <Save size={15} /> Enregistrer le CV
          </button>
        </div>
      </form>

    </div>
  );
}

/* ───────── helpers ───────── */

function updateAt<T extends Record<string, string>>(
  arr: T[],
  setter: (a: T[]) => void,
  i: number,
  key: keyof T,
  value: string,
) {
  const next = [...arr];
  next[i] = { ...next[i], [key]: value } as T;
  setter(next);
}

function Card({
  icon, title, action, children,
}: {
  icon: React.ReactNode;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-3xl border border-ink-100 p-6 shadow-card">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="font-extrabold text-ink-700 inline-flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
            {icon}
          </span>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function SmallField({
  label, value, onChange, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-ink-600 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg bg-white border border-ink-200 focus:border-brand-500 outline-none text-sm"
      />
    </div>
  );
}
