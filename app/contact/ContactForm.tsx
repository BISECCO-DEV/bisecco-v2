"use client";

import { useState } from "react";
import {
  Send, User, Mail, MessageSquare, ShieldCheck,
  CheckCircle2, AlertCircle, ChevronDown,
} from "lucide-react";
import { submitContactAction } from "@/lib/contact/actions";
import { CtaButton } from "@/components/ui/CtaButton";

const MAX_MESSAGE = 2000;

const USER_TYPES = [
  "Particulier",
  "Professionnel",
  "Autre",
];

const SUBJECTS = [
  "Question générale",
  "Problème technique",
  "Inscription / compte",
  "Vérification SIREN",
  "Partenariat",
  "Suggestion / amélioration",
  "Autre",
];

export function ContactForm() {
  const [message, setMessage] = useState("");
  const [rgpdConsent, setRgpdConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!rgpdConsent) {
      setError("Merci d'accepter le traitement de vos données (RGPD).");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      fd.set("message", message);
      const res = await submitContactAction(fd);
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(res.error);
      }
    } catch {
      setError("Une erreur est survenue. Réessayez ou écrivez-nous à contact@bisecco.fr.");
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
          Merci pour votre message. Notre équipe vous répondra sous{" "}
          <strong className="text-ink-700">24h ouvrées</strong>.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setMessage("");
            setRgpdConsent(false);
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
      id="contact-form"
      onSubmit={onSubmit}
      className="bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(13,30,74,0.12)] border border-ink-100 p-6 lg:p-9 space-y-5"
    >
      {/* On garde "subject" fixe pour la compatibilité backend, le vrai sujet métier est dans "objet" */}
      <input type="hidden" name="subject" value="support" />

      <div className="space-y-1.5">
        <h2 className="text-2xl font-extrabold text-ink-700 tracking-tight">Envoyez-nous un message</h2>
        <p className="text-[0.92rem] text-ink-500">Remplissez le formulaire ci-dessous, nous vous répondons rapidement.</p>
      </div>

      {/* Ligne 1 : Nom + Email */}
      <div className="grid sm:grid-cols-2 gap-4">
        <FloatingField label="Nom complet" required>
          <input
            type="text"
            name="fullName"
            required
            placeholder=" "
            className="peer w-full pt-5 pb-2 px-4 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none text-sm transition"
            onChange={(e) => {
              // Split fullName en first/last pour le backend
              const v = e.target.value.trim();
              const parts = v.split(/\s+/);
              const first = e.currentTarget.form?.elements.namedItem("firstName") as HTMLInputElement | null;
              const last = e.currentTarget.form?.elements.namedItem("lastName") as HTMLInputElement | null;
              if (first) first.value = parts[0] ?? "";
              if (last) last.value = parts.slice(1).join(" ") || parts[0] || "";
            }}
          />
        </FloatingField>
        <FloatingField label="Email" required>
          <input
            type="email"
            name="email"
            required
            placeholder=" "
            className="peer w-full pt-5 pb-2 px-4 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none text-sm transition"
          />
        </FloatingField>
      </div>

      {/* Champs cachés pour matcher l'action existante */}
      <input type="hidden" name="firstName" />
      <input type="hidden" name="lastName" />

      {/* Téléphone + Société (sur 2 colonnes) */}
      <div className="grid sm:grid-cols-2 gap-4">
        <FloatingField label="Téléphone" required>
          <input
            type="tel"
            name="phone"
            required
            placeholder=" "
            pattern="^[0-9 +().-]{8,20}$"
            className="peer w-full pt-5 pb-2 px-4 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none text-sm transition"
          />
        </FloatingField>
        <FloatingField label="Société (optionnel)">
          <input
            type="text"
            name="company"
            placeholder=" "
            className="peer w-full pt-5 pb-2 px-4 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none text-sm transition"
          />
        </FloatingField>
      </div>

      {/* Vous êtes */}
      <FloatingField label="Vous êtes" required>
        <div className="relative">
          <select
            name="userType"
            required
            defaultValue=""
            className="peer w-full pt-5 pb-2 px-4 pr-10 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none text-sm appearance-none cursor-pointer transition"
          >
            <option value="" disabled hidden></option>
            {USER_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
        </div>
      </FloatingField>

      {/* Sujet */}
      <FloatingField label="Sujet" required>
        <div className="relative">
          <select
            name="objet"
            required
            defaultValue=""
            className="peer w-full pt-5 pb-2 px-4 pr-10 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none text-sm appearance-none cursor-pointer transition"
          >
            <option value="" disabled hidden></option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
        </div>
      </FloatingField>

      {/* Message */}
      <FloatingField label="Votre message" required>
        <textarea
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE))}
          required
          minLength={10}
          rows={5}
          placeholder=" "
          className="peer w-full pt-6 pb-3 px-4 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none text-sm resize-y transition"
        />
        <span className="absolute bottom-3 right-4 text-[0.7rem] text-ink-400 font-medium pointer-events-none">
          {message.length} / {MAX_MESSAGE}
        </span>
      </FloatingField>

      {/* RGPD compact */}
      <label className={`flex items-start gap-3 text-[0.82rem] cursor-pointer p-3 rounded-xl transition ${rgpdConsent ? "bg-emerald-50/40" : "bg-ink-50/40 hover:bg-ink-50/70"}`}>
        <input
          type="checkbox"
          checked={rgpdConsent}
          onChange={(e) => setRgpdConsent(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-2 border-ink-300 text-brand-500 focus:ring-brand-500 cursor-pointer flex-shrink-0"
        />
        <span className="flex-1 text-ink-600 leading-snug">
          <ShieldCheck size={12} className="inline -mt-0.5 mr-1 text-emerald-500" />
          J&apos;accepte que mes données soient utilisées pour répondre à ma demande. <strong className="text-ink-700">Aucun partage avec un tiers.</strong> Conforme RGPD.
        </span>
      </label>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <div className="flex">
        <CtaButton
          type="submit"
          variant="primary"
          size="lg"
          icon={Send}
          disabled={submitting || !rgpdConsent}
          className="w-full justify-between"
        >
          {submitting ? "Envoi en cours…" : "Envoyer le message"}
        </CtaButton>
      </div>
    </form>
  );
}

/* ═══════ Floating label field ═══════ */
function FloatingField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block relative">
      {children}
      <span className="absolute left-4 top-1.5 text-[0.7rem] font-semibold text-ink-500 pointer-events-none uppercase tracking-wider">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
    </label>
  );
}

// Re-exports utiles
export { User, Mail, MessageSquare };
