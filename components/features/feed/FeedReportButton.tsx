"use client";

import { useState, useTransition } from "react";
import { Flag, X } from "lucide-react";
import { reportPostAction } from "@/lib/feed/actions";

const REASONS = [
  "Spam ou publicité",
  "Contenu offensant ou haineux",
  "Information fausse ou trompeuse",
  "Arnaque ou tentative d'escroquerie",
  "Hors-sujet (n'a rien à faire sur Bisecco)",
  "Autre",
];

export function FeedReportButton({ postId }: { postId: number }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [custom, setCustom] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = () => {
    const finalReason = reason === "Autre" ? custom.trim() : reason;
    if (!finalReason || finalReason.length < 5) {
      setMsg({ ok: false, text: "Veuillez préciser la raison." });
      return;
    }
    startTransition(async () => {
      const res = await reportPostAction(postId, finalReason);
      if (res.ok) {
        setMsg({ ok: true, text: "Merci, signalement enregistré." });
        setTimeout(() => setOpen(false), 1500);
      } else {
        setMsg({ ok: false, text: res.error ?? "Erreur" });
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-xs text-ink-400 hover:text-red-600 transition"
      >
        <Flag size={12} /> Signaler
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] bg-ink-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            <button
              type="button"
              onClick={() => { setOpen(false); setMsg(null); setReason(""); setCustom(""); }}
              className="absolute top-3 right-3 w-8 h-8 rounded-lg hover:bg-ink-100 text-ink-500 inline-flex items-center justify-center"
              aria-label="Fermer"
            >
              <X size={16} />
            </button>

            <h3 className="font-bold text-ink-700 text-lg">Signaler ce post</h3>
            <p className="text-sm text-ink-500 mt-1">
              Notre équipe va examiner votre signalement.
            </p>

            <div className="mt-4 space-y-2">
              {REASONS.map((r) => (
                <label key={r} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="accent-brand-500"
                  />
                  <span className="text-sm text-ink-700">{r}</span>
                </label>
              ))}
            </div>

            {reason === "Autre" && (
              <textarea
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="Précisez (5 caractères min)"
                maxLength={500}
                rows={3}
                className="mt-3 w-full px-3 py-2 rounded-lg border border-ink-200 text-sm focus:border-brand-500 outline-none"
              />
            )}

            {msg && (
              <div className={`mt-3 px-3 py-2 rounded-lg text-sm font-semibold ${msg.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                {msg.text}
              </div>
            )}

            <div className="mt-5 flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => { setOpen(false); setReason(""); setCustom(""); setMsg(null); }}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-ink-600 hover:bg-ink-100"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={pending || !reason}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-bold disabled:opacity-50"
              >
                Signaler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
