"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin, Mail, Phone, User, FileText,
  Upload, X, ArrowRight, ArrowLeft, CheckCircle2, Camera,
} from "lucide-react";
import { MetierCombobox } from "@/components/ui/MetierCombobox";
import { submitPublicQuoteAction } from "@/lib/quotes/public-actions";

const URGENCY = [
  { id: "asap",  label: "Urgent",        sub: "Dans les 48h" },
  { id: "week",  label: "Cette semaine", sub: "Sous 7 jours" },
  { id: "month", label: "Ce mois-ci",    sub: "Sous 30 jours" },
  { id: "flex",  label: "Pas pressé",    sub: "Je prends le temps" },
];

const BUDGET = [
  { id: "low",     label: "< 500€",      sub: "Petits travaux" },
  { id: "mid",     label: "500€ – 2K€",  sub: "Travaux moyens" },
  { id: "high",    label: "2K€ – 10K€",  sub: "Gros chantier" },
  { id: "xl",      label: "+ 10K€",      sub: "Très gros projet" },
  { id: "unknown", label: "Je ne sais pas", sub: "Aidez-moi à estimer" },
];

export function DevisForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [data, setData] = useState({
    metier: "",
    title: "",
    description: "",
    urgency: "",
    budget: "",
    photos: [] as File[],
    city: "",
    postalCode: "",
    fullName: "",
    email: "",
    phone: "",
  });

  const update = <K extends keyof typeof data>(key: K, value: (typeof data)[K]) => {
    setData((d) => ({ ...d, [key]: value }));
  };

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).slice(0, 5 - data.photos.length);
    update("photos", [...data.photos, ...arr]);
  };

  const removePhoto = (i: number) => {
    update(
      "photos",
      data.photos.filter((_, idx) => idx !== i)
    );
  };

  const canNext = () => {
    if (step === 1) return data.metier && data.title && data.description.length >= 20;
    if (step === 2) return data.urgency && data.budget;
    if (step === 3) return data.city && data.postalCode;
    return true;
  };

  const submit = async () => {
    setSubmitting(true);
    setSubmitError(null);

    const res = await submitPublicQuoteAction({
      metier: data.metier,
      title: data.title,
      description: data.description,
      urgency: data.urgency,
      budget: data.budget,
      city: data.city,
      postalCode: data.postalCode,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
    });

    if (res?.error) {
      setSubmitError(res.error);
      setSubmitting(false);
      return;
    }

    // TODO v1.1 : upload photos vers Supabase Storage (bucket 'quote-photos')
    router.push(`/devis/confirme${res?.quoteId ? `?id=${res.quoteId}` : ""}`);
  };

  return (
    <div className="bg-white rounded-3xl shadow-card border border-ink-100 overflow-hidden">
      {/* Stepper */}
      <div className="bg-ink-50/60 border-b border-ink-100 px-8 py-5">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex items-center flex-1 last:flex-none">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition ${
                  step >= n
                    ? "bg-brand-500 text-white shadow-[0_4px_12px_rgba(240,122,47,0.4)]"
                    : "bg-white border-2 border-ink-200 text-ink-300"
                }`}
              >
                {step > n ? <CheckCircle2 size={16} /> : n}
              </div>
              {n < 4 && (
                <div className={`flex-1 h-0.5 mx-2 transition ${step > n ? "bg-brand-500" : "bg-ink-200"}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between max-w-md mx-auto mt-2 text-[0.7rem] font-semibold text-ink-400">
          <span className={step >= 1 ? "text-brand-500" : ""}>Projet</span>
          <span className={step >= 2 ? "text-brand-500" : ""}>Détails</span>
          <span className={step >= 3 ? "text-brand-500" : ""}>Photos</span>
          <span className={step >= 4 ? "text-brand-500" : ""}>Contact</span>
        </div>
      </div>

      <div className="p-8 md:p-10">
        {/* ─── STEP 1 · Projet ─── */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-ink-700">Votre projet</h2>
              <p className="text-sm text-ink-400 mt-1">Décrivez ce dont vous avez besoin.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-ink-600 mb-2">Quel métier ?</label>
              <MetierCombobox
                value={data.metier}
                onChange={(v) => update("metier", v)}
                variant="light"
                hideLabel
                placeholder="Plombier, électricien…"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-ink-600 mb-2">Titre de votre projet</label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Ex : Rénovation salle de bain"
                className="w-full px-4 py-3 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none transition text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-ink-600 mb-2">
                Description détaillée <span className="text-ink-300 font-normal">(min. 20 caractères)</span>
              </label>
              <textarea
                value={data.description}
                onChange={(e) => update("description", e.target.value)}
                rows={5}
                placeholder="Décrivez votre projet : superficie, matériaux souhaités, contraintes…"
                className="w-full px-4 py-3 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none transition text-sm resize-y"
              />
              <div className="text-xs text-ink-400 mt-1 text-right">
                {data.description.length} caractères
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 2 · Urgence + budget ─── */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-ink-700">Quand & combien ?</h2>
              <p className="text-sm text-ink-400 mt-1">Ces infos aident l&apos;artisan à mieux vous répondre.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-ink-600 mb-3">Quelle urgence ?</label>
              <div className="grid grid-cols-2 gap-2">
                {URGENCY.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => update("urgency", u.id)}
                    className={`block p-4 rounded-xl text-left transition ${
                      data.urgency === u.id
                        ? "bg-brand-50 border-2 border-brand-500"
                        : "bg-ink-50/60 border-2 border-ink-100 hover:border-brand-300"
                    }`}
                  >
                    <div className="font-bold text-ink-700 text-base">{u.label}</div>
                    <div className="text-xs text-ink-400 mt-0.5">{u.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-ink-600 mb-3">Budget estimé ?</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BUDGET.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => update("budget", b.id)}
                    className={`p-3 rounded-xl text-left transition ${
                      data.budget === b.id
                        ? "bg-brand-50 border-2 border-brand-500"
                        : "bg-ink-50/60 border-2 border-ink-100 hover:border-brand-300"
                    }`}
                  >
                    <div className="font-bold text-ink-700 text-sm">{b.label}</div>
                    <div className="text-[0.7rem] text-ink-400 mt-0.5">{b.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 3 · Photos ─── */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-ink-700">Photos du projet</h2>
              <p className="text-sm text-ink-400 mt-1">
                Ajoutez jusqu&apos;à 5 photos pour aider l&apos;artisan à mieux comprendre votre besoin.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {data.photos.map((file, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-ink-100 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition"
                    aria-label="Supprimer"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              {data.photos.length < 5 && (
                <label className="aspect-square rounded-2xl border-2 border-dashed border-ink-200 hover:border-brand-500 hover:bg-brand-50/30 flex flex-col items-center justify-center cursor-pointer transition group">
                  <Upload size={24} className="text-ink-300 group-hover:text-brand-500 transition mb-2" />
                  <span className="text-xs font-semibold text-ink-500">Ajouter</span>
                  <span className="text-[0.65rem] text-ink-300 mt-0.5">{data.photos.length}/5</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => onFiles(e.target.files)}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
              <Camera size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-700">
                <strong>Astuce</strong> : prenez plusieurs angles, ajoutez une photo d&apos;ensemble + détails. Les artisans répondent 3x plus vite avec des photos.
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 4 · Contact ─── */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-ink-700">Vos coordonnées</h2>
              <p className="text-sm text-ink-400 mt-1">
                Pour recevoir les devis. On ne partage jamais vos infos avec des tiers.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field icon={<User size={15} />} label="Nom complet" value={data.fullName} onChange={(v) => update("fullName", v)} placeholder="Jean Dupont" />
              <Field icon={<Mail size={15} />} label="Email" type="email" value={data.email} onChange={(v) => update("email", v)} placeholder="vous@exemple.fr" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field icon={<Phone size={15} />} label="Téléphone" hint="optionnel" type="tel" value={data.phone} onChange={(v) => update("phone", v)} placeholder="06 00 00 00 00" />
              <Field icon={<MapPin size={15} />} label="Code postal" value={data.postalCode} onChange={(v) => update("postalCode", v)} placeholder="75001" maxLength={5} />
            </div>
            <Field icon={<MapPin size={15} />} label="Ville" value={data.city} onChange={(v) => update("city", v)} placeholder="Paris" />

            {/* Récap projet */}
            <div className="bg-ink-50/60 rounded-2xl p-5 border border-ink-100">
              <h3 className="font-bold text-ink-700 text-sm mb-3 flex items-center gap-2">
                <FileText size={14} /> Récapitulatif
              </h3>
              <dl className="space-y-1.5 text-sm">
                <Row label="Métier"  value={data.metier || "—"} />
                <Row label="Projet"  value={data.title || "—"} />
                <Row label="Urgence" value={URGENCY.find((u) => u.id === data.urgency)?.label || "—"} />
                <Row label="Budget"  value={BUDGET.find((b) => b.id === data.budget)?.label || "—"} />
                <Row label="Photos"  value={`${data.photos.length} ajoutée${data.photos.length > 1 ? "s" : ""}`} />
              </dl>
            </div>

            <label className="flex items-start gap-3 p-3 cursor-pointer">
              <input type="checkbox" required className="mt-1 accent-brand-500" />
              <span className="text-sm text-ink-500">
                J&apos;accepte les conditions d&apos;utilisation et la politique de confidentialité.
              </span>
            </label>
          </div>
        )}

        {/* Erreur submit */}
        {submitError && (
          <div className="mt-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            ⚠ {submitError}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-ink-100">
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 1}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-ink-200 text-ink-700 font-semibold hover:border-brand-500 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ArrowLeft size={16} /> Retour
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuer <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={submitting || !canNext()}
              className="btn-primary disabled:opacity-50"
            >
              {submitting ? "Envoi…" : "Envoyer mon devis"}
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═════════ FIELD HELPERS ═════════ */
function Field({
  icon, label, hint, value, onChange, placeholder, type = "text", maxLength,
}: {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-ink-600 mb-1.5">
        {label} {hint && <span className="font-normal text-ink-300">({hint})</span>}
      </label>
      <div className="flex items-center gap-2 px-3 rounded-xl bg-ink-50 border-2 border-ink-200 focus-within:border-brand-500 focus-within:bg-white transition">
        <span className="text-ink-300 flex-shrink-0">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="flex-1 bg-transparent py-2.5 outline-none text-sm text-ink-700 placeholder:text-ink-300"
        />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-ink-400">{label}</dt>
      <dd className="font-semibold text-ink-700 text-right">{value}</dd>
    </div>
  );
}
