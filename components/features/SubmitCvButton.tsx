"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, FileText, Send, Loader2, CheckCircle2 } from "lucide-react";
import { submitCvAction } from "@/lib/cv/submit-actions";

type Props = {
  recipientId: number;
  recipientName: string;
  backUrl: string;
  defaultName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
};

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export function SubmitCvButton({
  recipientId, recipientName, backUrl,
  defaultName = "", defaultEmail = "", defaultPhone = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setFile(null);
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  const handleFile = (f: File | null) => {
    setError(null);
    if (!f) {
      setFile(null);
      return;
    }
    if (f.type !== "application/pdf") {
      setError("Le fichier doit être au format PDF.");
      return;
    }
    if (f.size > MAX_SIZE) {
      setError("Le fichier dépasse 5 MB.");
      return;
    }
    setFile(f);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white border-2 border-brand-200 text-brand-700 text-sm font-bold hover:bg-brand-50 transition"
      >
        <Upload size={14} /> Envoyer mon CV
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-stretch sm:items-center justify-center bg-ink-900/60 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={() => !submitting && setOpen(false)}
        >
          <div
            className="w-full sm:max-w-lg bg-white sm:rounded-3xl shadow-2xl animate-slide-up h-full sm:h-auto sm:max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header sticky en haut */}
            <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-ink-100 flex items-start justify-between gap-3 flex-shrink-0">
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-extrabold text-ink-700">Envoyer mon CV</h2>
                <p className="mt-1 text-xs sm:text-sm text-ink-500 truncate">
                  À <strong className="text-ink-700">{recipientName}</strong> · PDF, 5 MB max
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={submitting}
                className="p-1.5 rounded-lg hover:bg-ink-50 text-ink-400 hover:text-ink-700 transition disabled:opacity-40 flex-shrink-0"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>

            <form action={submitCvAction} onSubmit={() => setSubmitting(true)} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              <input type="hidden" name="recipient_id" value={recipientId} />
              <input type="hidden" name="_back" value={backUrl} />

              {/* Zone upload */}
              <div>
                <label className="block text-xs font-extrabold text-ink-500 uppercase tracking-wider mb-2">
                  Votre CV (PDF)
                </label>
                <input
                  ref={inputRef}
                  type="file"
                  name="cv_file"
                  accept="application/pdf,.pdf"
                  required
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                  className="hidden"
                />
                {file ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border-2 border-emerald-200">
                    <FileText size={20} className="text-emerald-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-emerald-800 text-sm truncate">{file.name}</div>
                      <div className="text-[0.7rem] text-emerald-600">{(file.size / 1024).toFixed(0)} KB</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setFile(null); if (inputRef.current) inputRef.current.value = ""; }}
                      className="text-emerald-600 hover:text-emerald-800"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="w-full p-6 rounded-xl border-2 border-dashed border-ink-200 hover:border-brand-400 hover:bg-brand-50/30 transition text-center"
                  >
                    <Upload size={24} className="mx-auto mb-2 text-ink-400" />
                    <div className="font-bold text-ink-700 text-sm">Choisir un fichier PDF</div>
                    <div className="text-xs text-ink-400 mt-1">ou glissez-déposez · 5 MB max</div>
                  </button>
                )}
              </div>

              {/* Coordonnées */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-ink-500 uppercase tracking-wider mb-1.5">
                    Votre nom *
                  </label>
                  <input
                    type="text" name="sender_name" required maxLength={255}
                    defaultValue={defaultName}
                    placeholder="Jean Dupont"
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-ink-100 focus:border-brand-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-ink-500 uppercase tracking-wider mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email" name="sender_email" required maxLength={255}
                    defaultValue={defaultEmail}
                    placeholder="vous@email.fr"
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-ink-100 focus:border-brand-500 outline-none text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-extrabold text-ink-500 uppercase tracking-wider mb-1.5">
                  Téléphone <span className="font-normal text-ink-400">(optionnel)</span>
                </label>
                <input
                  type="tel" name="sender_phone" maxLength={20}
                  defaultValue={defaultPhone}
                  placeholder="06 12 34 56 78"
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-ink-100 focus:border-brand-500 outline-none text-sm"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-extrabold text-ink-500 uppercase tracking-wider mb-1.5">
                  Message <span className="font-normal text-ink-400">(optionnel)</span>
                </label>
                <textarea
                  name="message" rows={3} maxLength={1000}
                  placeholder="Bonjour, je suis intéressé(e) par un poste chez vous…"
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-ink-100 focus:border-brand-500 outline-none text-sm resize-y"
                />
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-3 py-2 text-sm font-semibold">
                  ⚠ {error}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white border-2 border-ink-200 text-ink-700 font-bold text-sm hover:bg-ink-50 transition disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!file || !!error || submitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-bold text-sm shadow-[0_6px_18px_-4px_rgba(240,122,47,0.5)] hover:-translate-y-0.5 transition disabled:opacity-40 disabled:translate-y-0"
                >
                  {submitting ? (
                    <><Loader2 size={14} className="animate-spin" /> Envoi en cours…</>
                  ) : (
                    <><Send size={14} /> Envoyer mon CV</>
                  )}
                </button>
              </div>

              <p className="text-[0.7rem] text-ink-400 leading-relaxed">
                <CheckCircle2 size={11} className="inline mb-0.5 text-emerald-500" />{" "}
                Votre CV est privé. Seul {recipientName} y aura accès. Vous serez recontacté(e) par email s&apos;il est intéressé.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
