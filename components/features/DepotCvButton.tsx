"use client";

import { useState, useRef, useEffect } from "react";
import {
  Upload, X, FileText, Send, Loader2, CheckCircle2,
  User, Mail, Phone, Briefcase, MapPin, ShieldCheck, ArrowRight, AlertCircle,
} from "lucide-react";
import { submitCvToBankAction } from "@/lib/cv/bank-actions";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

type Props = {
  /** Texte du bouton trigger. Défaut : "Déposer mon CV" */
  label?: string;
  /** Classes appliquées au bouton trigger */
  className?: string;
  /** Icône à afficher dans le bouton trigger */
  children?: React.ReactNode;
};

export function DepotCvButton({ label = "Déposer mon CV", className, children }: Props) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [rgpd, setRgpd] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!open) {
      setFile(null);
      setError(null);
      setSubmitting(false);
      setDone(false);
      setRgpd(false);
    }
  }, [open]);

  const handleFile = (f: File | null) => {
    setError(null);
    if (!f) return setFile(null);
    if (f.size > MAX_SIZE) {
      setError("Fichier trop volumineux (max 5 Mo).");
      return;
    }
    if (f.type !== "application/pdf") {
      setError("Format invalide. Seul le PDF est accepté.");
      return;
    }
    setFile(f);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!file) {
      setError("Merci de joindre votre CV.");
      return;
    }
    if (!rgpd) {
      setError("Merci d'accepter le traitement de vos données (RGPD).");
      return;
    }
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    fd.set("cv_file", file);
    fd.set("rgpd_consent", "true");
    const res = await submitCvToBankAction(fd);
    setSubmitting(false);
    if (res.ok) {
      setDone(true);
    } else {
      setError(res.error);
    }
  };

  const triggerClass = className || "inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-white font-bold text-[12px] sm:text-[14px] border border-white/30 hover:border-white/60 transition-colors whitespace-nowrap";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={triggerClass}>
        {label}
        {children ?? <ArrowRight size={15} strokeWidth={2.4} className="opacity-60" />}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[200] bg-ink-900/60 backdrop-blur-sm flex items-stretch sm:items-center justify-center p-0 sm:p-4"
          onClick={(e) => { if (e.target === e.currentTarget && !submitting) setOpen(false); }}
        >
          <div className="bg-white sm:rounded-3xl shadow-2xl w-full sm:max-w-xl h-full sm:h-auto sm:max-h-[92vh] flex flex-col overflow-hidden animate-slide-up">

            {/* Header · sticky en haut */}
            <header className="relative bg-gradient-to-br from-ink-800 to-ink-700 text-white px-5 sm:px-6 py-4 sm:py-5 overflow-hidden flex-shrink-0">
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-brand-500/30 blur-2xl" />
              <div className="relative flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white shadow-[0_4px_12px_rgba(240,122,47,0.4)] flex-shrink-0">
                    <FileText size={16} strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-extrabold tracking-tight">Déposer mon CV</h2>
                    <p className="text-[0.75rem] sm:text-[0.82rem] text-white/65 mt-0.5">Visible par les artisans dès validation.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => !submitting && setOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition flex-shrink-0"
                  aria-label="Fermer"
                >
                  <X size={16} />
                </button>
              </div>
            </header>

            {/* Body · scrollable */}
            {done ? (
              <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white mb-4 shadow-[0_8px_24px_-4px_rgba(16,185,129,0.45)]">
                  <CheckCircle2 size={32} strokeWidth={2.2} />
                </div>
                <h3 className="text-xl font-extrabold text-ink-700">CV bien reçu !</h3>
                <p className="mt-2 text-ink-500 text-sm leading-relaxed max-w-sm mx-auto">
                  Notre équipe va valider votre CV sous <strong className="text-ink-700">24h ouvrées</strong>.
                  Une fois approuvé, les artisans inscrits pourront vous contacter directement.
                </p>
                <p className="mt-3 text-[0.75rem] text-ink-400">Un email de confirmation vient de vous être envoyé.</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-7 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink-50 border border-ink-200 text-ink-700 font-bold text-[0.88rem] hover:bg-white hover:border-brand-500 hover:text-brand-500 transition"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={submit} className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 sm:py-6 space-y-4">
                {/* Drop zone file */}
                <div>
                  <label className="block text-[0.75rem] font-bold text-ink-600 mb-1.5 uppercase tracking-wider">
                    Votre CV (PDF, max 5 Mo) <span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                    className="hidden"
                    aria-label="Sélectionner un PDF"
                  />
                  {file ? (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-brand-300 bg-brand-50/40">
                      <div className="w-10 h-10 rounded-lg bg-brand-500 text-white flex items-center justify-center flex-shrink-0">
                        <FileText size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-ink-700 text-sm truncate">{file.name}</div>
                        <div className="text-[0.75rem] text-ink-500">{(file.size / 1024).toFixed(0)} Ko</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setFile(null); if (inputRef.current) inputRef.current.value = ""; }}
                        className="w-8 h-8 rounded-lg hover:bg-red-50 text-ink-400 hover:text-red-600 flex items-center justify-center transition"
                        aria-label="Retirer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      className="w-full flex flex-col items-center justify-center gap-2 px-4 py-7 rounded-xl border-2 border-dashed border-ink-200 bg-ink-50/40 hover:border-brand-400 hover:bg-brand-50/30 transition"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white border border-ink-200 flex items-center justify-center text-brand-500">
                        <Upload size={20} strokeWidth={2.2} />
                      </div>
                      <div className="text-sm font-bold text-ink-700">Cliquer pour choisir un PDF</div>
                      <div className="text-[0.75rem] text-ink-400">ou glisser-déposer ici</div>
                    </button>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <Field icon={User} label="Nom complet" name="sender_name" placeholder="Marie Dupont" required />
                  <Field icon={Mail} type="email" label="Email" name="sender_email" placeholder="marie@email.fr" required />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <Field icon={Phone} type="tel" label="Téléphone" name="sender_phone" placeholder="06 12 34 56 78" />
                  <Field icon={MapPin} label="Ville" name="city" placeholder="Meaux" />
                </div>

                <Field icon={Briefcase} label="Métier recherché" name="metier" placeholder="Ex: Plombier, Boulanger, Carreleur…" />

                <div>
                  <label className="block text-[0.75rem] font-bold text-ink-600 mb-1.5 uppercase tracking-wider">Message (optionnel)</label>
                  <textarea
                    name="message"
                    rows={3}
                    maxLength={1500}
                    placeholder="Présentez-vous brièvement, vos disponibilités, votre zone d'intervention…"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none text-sm resize-y transition"
                  />
                </div>

                {/* RGPD */}
                <label className={`flex items-start gap-3 text-[0.82rem] cursor-pointer p-3 rounded-xl transition ${rgpd ? "bg-emerald-50/40" : "bg-ink-50/40"}`}>
                  <input
                    type="checkbox"
                    checked={rgpd}
                    onChange={(e) => setRgpd(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-2 border-ink-300 text-brand-500 focus:ring-brand-500 cursor-pointer flex-shrink-0"
                  />
                  <span className="flex-1 text-ink-600 leading-snug">
                    <ShieldCheck size={12} className="inline -mt-0.5 mr-1 text-emerald-500" />
                    J&apos;accepte que mon CV soit consulté par les artisans inscrits sur Bisecco. <strong className="text-ink-700">Aucun partage tiers.</strong> Retrait possible à tout moment via contact@bisecco.fr.
                  </span>
                </label>

                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                    <AlertCircle size={14} /> {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || !file || !rgpd}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-bold shadow-[0_8px_20px_-4px_rgba(240,122,47,0.45)] hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {submitting ? (
                    <><Loader2 size={15} className="animate-spin" /> Envoi en cours…</>
                  ) : (
                    <><Send size={15} strokeWidth={2.4} /> Déposer mon CV</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════ Field ═══════ */
function Field({
  icon: Icon, label, name, type = "text", placeholder, required,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[0.7rem] font-bold text-ink-600 mb-1.5 inline-flex items-center gap-1.5 uppercase tracking-wider">
        <Icon size={11} className="text-ink-400" />
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full px-3.5 py-2.5 rounded-xl bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none text-sm transition"
      />
    </label>
  );
}
