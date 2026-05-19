"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Phone, FileText, Send, CheckCircle2, Upload } from "lucide-react";

export function PostulerForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [useCv, setUseCv] = useState(true);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => router.push("/mon-profil/candidatures"), 2500);
  };

  if (success) {
    return (
      <div className="mt-7 bg-white rounded-3xl shadow-card border border-emerald-200 p-10 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4">
          <CheckCircle2 size={32} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-ink-700">Candidature envoyée !</h2>
        <p className="text-ink-500 mt-2">
          Votre candidature pour <strong>{jobTitle}</strong> a bien été transmise au recruteur.<br />
          Vous recevrez une réponse sous 48h en moyenne.
        </p>
        <p className="text-xs text-ink-400 mt-4">Redirection vers vos candidatures…</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-7 bg-white rounded-3xl shadow-card border border-ink-100 p-7 md:p-9 space-y-6">
      <input type="hidden" value={jobId} />

      {/* Identité */}
      <section>
        <h2 className="text-lg font-bold text-ink-700 mb-4 flex items-center gap-2">
          <User size={16} className="text-brand-500" /> Vos informations
        </h2>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Prénom" placeholder="Marie" required />
            <Field label="Nom" placeholder="Dupont" required />
          </div>
          <Field label="Email" type="email" placeholder="marie.dupont@email.fr" required icon={<Mail size={14} />} />
          <Field label="Téléphone" type="tel" placeholder="06 12 34 56 78" required icon={<Phone size={14} />} />
        </div>
      </section>

      <hr className="border-ink-100" />

      {/* CV */}
      <section>
        <h2 className="text-lg font-bold text-ink-700 mb-4 flex items-center gap-2">
          <FileText size={16} className="text-brand-500" /> Votre CV
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setUseCv(true)}
            className={`p-4 rounded-xl border-2 text-left transition ${useCv ? "bg-brand-50 border-brand-500" : "bg-white border-ink-200 hover:border-brand-300"}`}
          >
            <div className="font-bold text-ink-700 text-sm">Utiliser mon CV Bisecco</div>
            <div className="text-xs text-ink-500 mt-1">Mis à jour il y a 3 jours · Visible par le recruteur</div>
            <Link href="/mon-profil/cv" className="text-xs text-brand-500 font-bold mt-2 inline-block hover:underline">
              Modifier mon CV →
            </Link>
          </button>
          <button
            type="button"
            onClick={() => setUseCv(false)}
            className={`p-4 rounded-xl border-2 text-left transition ${!useCv ? "bg-brand-50 border-brand-500" : "bg-white border-ink-200 hover:border-brand-300"}`}
          >
            <div className="font-bold text-ink-700 text-sm flex items-center gap-1.5"><Upload size={13} /> Importer un CV PDF</div>
            <div className="text-xs text-ink-500 mt-1">Max 2 Mo · PDF uniquement</div>
          </button>
        </div>
      </section>

      <hr className="border-ink-100" />

      {/* Message */}
      <section>
        <h2 className="text-lg font-bold text-ink-700 mb-4">Lettre de motivation (optionnel)</h2>
        <textarea
          rows={6}
          placeholder="Présentez-vous, expliquez votre motivation, vos disponibilités…"
          className="w-full px-4 py-3 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none transition text-sm resize-y"
        />
        <p className="text-xs text-ink-400 mt-2">Un message personnalisé augmente vos chances de réponse de 3x.</p>
      </section>

      <label className="flex items-start gap-3 text-sm text-ink-500">
        <input type="checkbox" required className="mt-1 accent-brand-500" />
        <span>
          J&apos;accepte que mes données soient transmises au recruteur dans le cadre de cette candidature.
        </span>
      </label>

      <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
        {submitting ? "Envoi…" : (<><Send size={15} /> Envoyer ma candidature</>)}
      </button>
    </form>
  );
}

function Field({ label, type = "text", placeholder, required, icon }: { label: string; type?: string; placeholder?: string; required?: boolean; icon?: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-bold text-ink-600 mb-1.5">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">{icon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          required={required}
          className={`w-full ${icon ? "pl-9" : "px-4"} pr-4 py-2.5 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none transition text-sm`}
        />
      </div>
    </div>
  );
}
