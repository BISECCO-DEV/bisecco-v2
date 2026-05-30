"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { submitJobApplicationAction } from "@/lib/emploi/actions";

export function PostulerForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const firstName = (form.elements.namedItem("first_name") as HTMLInputElement).value.trim();
    const lastName = (form.elements.namedItem("last_name") as HTMLInputElement).value.trim();

    const fd = new FormData(form);
    fd.set("job_id", jobId);
    fd.set("full_name", `${firstName} ${lastName}`);

    const res = await submitJobApplicationAction(fd);
    setSubmitting(false);
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/mon-profil/candidatures"), 2500);
    } else {
      setError(res.error);
    }
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
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <section>
        <h2 className="text-lg font-bold text-ink-700 mb-4 flex items-center gap-2">
          <User size={16} className="text-brand-500" /> Vos informations
        </h2>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field name="first_name" label="Prénom" placeholder="Marie" required />
            <Field name="last_name" label="Nom" placeholder="Dupont" required />
          </div>
          <Field name="email" label="Email" type="email" placeholder="marie.dupont@email.fr" required icon={<Mail size={14} />} />
          <Field name="phone" label="Téléphone" type="tel" placeholder="06 12 34 56 78" icon={<Phone size={14} />} />
        </div>
      </section>

      <hr className="border-ink-100" />

      <section>
        <h2 className="text-lg font-bold text-ink-700 mb-4">Lettre de motivation</h2>
        <textarea
          name="message"
          rows={6}
          required
          minLength={30}
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

function Field({ name, label, type = "text", placeholder, required, icon }: { name: string; label: string; type?: string; placeholder?: string; required?: boolean; icon?: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-bold text-ink-600 mb-1.5">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">{icon}</span>}
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className={`w-full ${icon ? "pl-9" : "px-4"} pr-4 py-2.5 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none transition text-sm`}
        />
      </div>
    </div>
  );
}
