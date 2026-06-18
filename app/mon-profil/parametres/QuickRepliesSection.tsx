"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Loader2, AlertCircle, MessageSquare, X } from "lucide-react";
import {
  createQuickReplyAction,
  deleteQuickReplyAction,
  type QuickReply,
} from "@/lib/quick-replies/actions";

const MAX = 10;

const SUGGESTIONS = [
  { label: "Accusé réception", body: "Bonjour, j'ai bien reçu votre demande. Je reviens vers vous d'ici 1h avec une proposition. Bonne journée." },
  { label: "Indispo cette semaine", body: "Bonjour, malheureusement je suis complet cette semaine. Je peux vous proposer un créneau la semaine prochaine si ça vous va ?" },
  { label: "Demande de précisions", body: "Bonjour, pour vous faire un devis précis, j'aurais besoin de quelques informations : surface concernée, état actuel, et si possible quelques photos. Merci !" },
  { label: "Visite sur place", body: "Bonjour, je peux passer faire un devis gratuit sur place. Quelle adresse, et quel jour vous arrange ?" },
];

export function QuickRepliesSection({ initial }: { initial: QuickReply[] }) {
  const [items, setItems] = useState<QuickReply[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const create = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createQuickReplyAction(undefined, fd);
      if (res.error) {
        setError(res.error);
      } else {
        window.location.reload();
      }
    });
  };

  const remove = (id: number) => {
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", String(id));
      const res = await deleteQuickReplyAction(undefined, fd);
      if (res.ok) {
        setItems((prev) => prev.filter((it) => it.id !== id));
      } else if (res.error) {
        setError(res.error);
      }
    });
  };

  const useSuggestion = (s: typeof SUGGESTIONS[number]) => {
    const fd = new FormData();
    fd.set("label", s.label);
    fd.set("body", s.body);
    startTransition(async () => {
      const res = await createQuickReplyAction(undefined, fd);
      if (res.error) {
        setError(res.error);
      } else {
        window.location.reload();
      }
    });
  };

  return (
    <div className="px-1 py-2 space-y-4">
      <p className="text-sm text-ink-600">
        Stocke jusqu&apos;à {MAX} réponses types pour répondre à tes clients en 1 clic depuis la messagerie.
      </p>

      {/* Suggestions rapides */}
      {items.length === 0 && (
        <div className="rounded-xl border border-brand-100 bg-brand-50/30 p-3">
          <p className="text-xs font-bold text-ink-600 mb-2">💡 Démarre avec une suggestion :</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => useSuggestion(s)}
                disabled={pending}
                className="text-left rounded-lg border border-ink-100 bg-white px-3 py-2 hover:border-brand-300 transition disabled:opacity-50"
              >
                <div className="text-xs font-bold text-brand-700">{s.label}</div>
                <div className="text-xs text-ink-500 truncate mt-0.5">{s.body}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Liste existante */}
      {items.length > 0 && (
        <ul className="space-y-2">
          {items.map((q) => (
            <li key={q.id} className="flex items-start gap-3 p-3 rounded-xl border border-ink-100 bg-white">
              <div className="w-8 h-8 rounded-lg bg-brand-50 grid place-items-center flex-shrink-0">
                <MessageSquare size={13} className="text-brand-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-ink-700">{q.label}</div>
                <p className="text-xs text-ink-500 mt-1 leading-relaxed line-clamp-3">{q.body}</p>
              </div>
              <button
                type="button"
                onClick={() => remove(q.id)}
                disabled={pending}
                className="p-1.5 rounded-lg text-ink-400 hover:text-red-600 hover:bg-red-50 transition flex-shrink-0 disabled:opacity-50"
                aria-label="Supprimer"
              >
                <Trash2 size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* CTA ajout */}
      {items.length < MAX && !showForm && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-ink-200 hover:border-brand-400 text-sm font-bold text-ink-500 hover:text-brand-600 transition"
        >
          <Plus size={14} /> Créer une nouvelle réponse
        </button>
      )}

      {showForm && (
        <form onSubmit={create} className="rounded-xl border-2 border-brand-200 bg-brand-50/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-ink-700">Nouvelle réponse</h4>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-ink-400 hover:text-ink-700"
              aria-label="Annuler"
            >
              <X size={16} />
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink-600 mb-1">
              Titre court <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="label"
              required
              maxLength={80}
              placeholder="Ex : Accusé réception"
              className="w-full px-3 py-2 rounded-lg bg-white border-2 border-ink-200 focus:border-brand-500 outline-none transition text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink-600 mb-1">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              name="body"
              required
              rows={4}
              maxLength={2000}
              placeholder="Le texte qui sera inséré dans la conversation"
              className="w-full px-3 py-2 rounded-lg bg-white border-2 border-ink-200 focus:border-brand-500 outline-none transition text-sm resize-y"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle size={12} /> {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-brand-200/60">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 rounded-lg bg-white border-2 border-ink-200 text-ink-600 font-bold text-xs"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-brand-500 text-white font-bold text-xs transition disabled:opacity-50"
            >
              {pending ? <><Loader2 size={11} className="animate-spin" /> Création…</> : "Créer"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
