"use client";

import { useState } from "react";
import {
  Send, User, Mail, Building2, HelpCircle, Briefcase, Newspaper,
  CheckCircle2, AlertCircle, MessageSquare,
} from "lucide-react";

type Subject = {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  badge?: string;
};

const SUBJECTS: Subject[] = [
  { id: "support",      label: "Support",       description: "J'ai un problème ou une question",          icon: HelpCircle },
  { id: "partenariat",  label: "Partenariat",   description: "Co-marketing, intégration, distribution",   icon: Briefcase },
  { id: "presse",       label: "Presse",        description: "Interview, communiqué, kit média",          icon: Newspaper, badge: "<4h" },
  { id: "recrutement",  label: "Recrutement",   description: "Rejoindre l'équipe Bisecco",                icon: Building2 },
];

const MAX_MESSAGE = 1500;

export function ContactForm() {
  const [subject, setSubject] = useState("support");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      // Demo : simulation latence backend
      await new Promise((r) => setTimeout(r, 1200));
      setSubmitted(true);
    } catch {
      setError("Une erreur est survenue. Réessaie ou écris-nous directement à contact@bisecco.fr.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(13,30,74,0.12)] border border-ink-100 p-8 lg:p-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-[0_8px_24px_-4px_rgba(16,185,129,0.45)] mb-5">
          <CheckCircle2 size={32} strokeWidth={2.2} />
        </div>
        <h2 className="text-2xl font-extrabold text-ink-700 tracking-tight">Message envoyé !</h2>
        <p className="mt-3 text-ink-500 text-[0.95rem] leading-relaxed max-w-md mx-auto">
          Merci pour votre message. Notre équipe vous répondra sous <strong className="text-ink-700">24h ouvrées</strong>,
          parfois plus vite. Vérifiez votre boîte mail (et le dossier spam, au cas où).
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setMessage("");
            setSubject("support");
          }}
          className="mt-7 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink-50 border border-ink-200 text-ink-700 font-bold text-[0.88rem] hover:bg-white hover:border-brand-500 hover:text-brand-500 transition"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(13,30,74,0.12)] border border-ink-100 p-6 sm:p-8 lg:p-10 space-y-7"
    >
      {/* Subject selector — tiles */}
      <fieldset>
        <legend className="text-[0.95rem] font-extrabold text-ink-700 mb-1">
          1. Quel est le sujet de votre demande ?
        </legend>
        <p className="text-[0.82rem] text-ink-400 mb-4">Cela nous aide à router vers la bonne personne plus rapidement.</p>

        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {SUBJECTS.map((s) => {
            const Icon = s.icon;
            const active = subject === s.id;
            return (
              <label key={s.id} className="cursor-pointer">
                <input
                  type="radio"
                  name="subject"
                  value={s.id}
                  checked={active}
                  onChange={() => setSubject(s.id)}
                  className="sr-only peer"
                />
                <div
                  className={`relative h-full p-3.5 rounded-2xl border-2 transition-all ${
                    active
                      ? "border-brand-500 bg-gradient-to-br from-brand-50/80 to-white shadow-[0_8px_20px_-8px_rgba(240,122,47,0.35)]"
                      : "border-ink-100 bg-white hover:border-brand-200 hover:bg-ink-50/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition ${
                        active
                          ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-[0_4px_10px_rgba(240,122,47,0.4),inset_0_1px_0_rgba(255,255,255,0.25)]"
                          : "bg-ink-50 text-ink-500"
                      }`}
                    >
                      <Icon size={16} strokeWidth={2.2} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`font-extrabold text-[0.88rem] ${active ? "text-brand-700" : "text-ink-700"}`}>
                          {s.label}
                        </span>
                        {s.badge && (
                          <span className="text-[0.6rem] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                            {s.badge}
                          </span>
                        )}
                      </div>
                      <div className={`text-[0.74rem] mt-0.5 leading-snug ${active ? "text-ink-600" : "text-ink-400"}`}>
                        {s.description}
                      </div>
                    </div>
                  </div>
                  {/* checkmark */}
                  {active && (
                    <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center">
                      <CheckCircle2 size={11} strokeWidth={3} />
                    </span>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Step 2 : infos perso */}
      <fieldset>
        <legend className="text-[0.95rem] font-extrabold text-ink-700 mb-4">
          2. Vos coordonnées
        </legend>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field icon={User} label="Prénom" name="firstName" placeholder="Marie" required />
            <Field icon={User} label="Nom"    name="lastName"  placeholder="Dupont" required />
          </div>
          <Field icon={Mail} type="email" label="Email" name="email" placeholder="marie.dupont@email.fr" required hint="Pour vous recontacter sous 24h" />
          <Field icon={Building2} label="Entreprise / Société" name="company" placeholder="Optionnel" />
        </div>
      </fieldset>

      {/* Step 3 : message */}
      <fieldset>
        <legend className="text-[0.95rem] font-extrabold text-ink-700 mb-4">
          3. Votre message
        </legend>
        <div>
          <label className="block">
            <span className="text-[0.82rem] font-semibold text-ink-600 mb-1.5 inline-flex items-center gap-1.5">
              <MessageSquare size={12} className="text-ink-400" />
              Détaillez votre demande
              <span className="text-red-500">*</span>
            </span>
            <textarea
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE))}
              required
              rows={6}
              placeholder="Décrivez votre demande, votre contexte et toute information utile…"
              className="w-full px-4 py-3 rounded-xl border-2 border-ink-200 bg-ink-50 focus:border-brand-500 focus:bg-white outline-none text-[0.92rem] resize-y leading-relaxed transition"
            />
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[0.72rem] text-ink-400">Minimum 20 caractères</span>
              <span className={`text-[0.72rem] font-semibold tabular-nums ${message.length > MAX_MESSAGE * 0.9 ? "text-amber-600" : "text-ink-400"}`}>
                {message.length} / {MAX_MESSAGE}
              </span>
            </div>
          </label>
        </div>
      </fieldset>

      {/* Consents */}
      <div className="space-y-2.5 pt-2">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            required
            className="mt-0.5 w-4 h-4 rounded border-ink-300 text-brand-500 focus:ring-brand-500 focus:ring-offset-0 flex-shrink-0"
          />
          <span className="text-[0.82rem] text-ink-500 leading-snug">
            J&apos;accepte que mes informations soient utilisées pour traiter ma demande, conformément à la{" "}
            <a href="/politique-confidentialite" className="text-brand-500 font-bold hover:underline">
              politique de confidentialité
            </a>.
          </span>
        </label>
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 w-4 h-4 rounded border-ink-300 text-brand-500 focus:ring-brand-500 focus:ring-offset-0 flex-shrink-0"
          />
          <span className="text-[0.82rem] text-ink-500 leading-snug">
            Je souhaite recevoir occasionnellement des actualités Bisecco (1 email par mois max, désinscription en 1 clic).
          </span>
        </label>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[0.86rem]">
          <AlertCircle size={16} strokeWidth={2.4} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || message.length < 20}
        className="group relative inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-extrabold text-[0.95rem] shadow-[0_10px_28px_-6px_rgba(240,122,47,0.5),inset_0_1px_0_rgba(255,255,255,0.25)] hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-6px_rgba(240,122,47,0.6),inset_0_1px_0_rgba(255,255,255,0.3)] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all overflow-hidden"
      >
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" aria-hidden />
        {submitting ? (
          <>
            <span className="relative inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="relative">Envoi en cours…</span>
          </>
        ) : (
          <>
            <Send size={16} strokeWidth={2.4} className="relative" />
            <span className="relative">Envoyer mon message</span>
          </>
        )}
      </button>

      <p className="text-center text-[0.75rem] text-ink-400">
        En envoyant ce formulaire, vous acceptez nos{" "}
        <a href="/cgv" className="text-ink-600 font-semibold hover:underline">CGV</a>
        {" "}et notre{" "}
        <a href="/politique-confidentialite" className="text-ink-600 font-semibold hover:underline">politique de confidentialité</a>.
      </p>
    </form>
  );
}

type FieldProps = {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
};

function Field({ icon: Icon, label, name, type = "text", placeholder, required, hint }: FieldProps) {
  return (
    <label className="block">
      <span className="text-[0.82rem] font-semibold text-ink-600 mb-1.5 inline-flex items-center gap-1.5">
        <Icon size={12} className="text-ink-400" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl border-2 border-ink-200 bg-ink-50 focus:border-brand-500 focus:bg-white outline-none text-[0.92rem] transition"
      />
      {hint && <span className="text-[0.72rem] text-ink-400 mt-1 inline-block">{hint}</span>}
    </label>
  );
}
