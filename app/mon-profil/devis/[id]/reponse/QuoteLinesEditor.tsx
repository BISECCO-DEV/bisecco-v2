"use client";

import { useMemo, useState, useTransition } from "react";
import { Plus, Trash2, Loader2, AlertCircle, CheckCircle2, Send, Wand2 } from "lucide-react";
import { submitQuoteResponseAction, type QuoteLine } from "@/lib/quotes/response-actions";
import { unitsForMetier, lineTemplatesForMetier } from "@/lib/quotes/units-by-metier";

const VAT_OPTIONS = [
  { value: 0.20, label: "20% (taux normal)" },
  { value: 0.10, label: "10% (rénovation logement)" },
  { value: 0.055, label: "5,5% (rénov. énergétique)" },
  { value: 0,    label: "0% (exonéré / franchise)" },
];

type LocalLine = QuoteLine & { _key: string };

let counter = 0;
const makeKey = () => `l${++counter}`;

type Props = {
  quoteRequestId: number;
  /** Nom du métier de la demande (pour adapter unités + templates) */
  metierName?: string | null;
  initial?: {
    lines: QuoteLine[];
    delay_text: string | null;
    valid_until: string | null;
    message: string | null;
    payment_terms: string | null;
  } | null;
};

export function QuoteLinesEditor({ quoteRequestId, metierName, initial }: Props) {
  // Unités + suggestions adaptées au métier de la demande
  const UNITS = useMemo(() => unitsForMetier(metierName), [metierName]);
  const TEMPLATES = useMemo(() => lineTemplatesForMetier(metierName), [metierName]);
  const defaultUnit = UNITS[0] ?? "forfait";

  const [lines, setLines] = useState<LocalLine[]>(
    initial?.lines && initial.lines.length > 0
      ? initial.lines.map((l) => ({ ...l, _key: makeKey() }))
      : [{ label: "", quantity: 1, unit: defaultUnit, unit_price_ht: 0, vat_rate: 0.20, _key: makeKey() }],
  );
  const [delayText, setDelayText] = useState(initial?.delay_text ?? "");
  const [validUntil, setValidUntil] = useState(initial?.valid_until ?? "");
  const [message, setMessage] = useState(initial?.message ?? "");
  const [paymentTerms, setPaymentTerms] = useState(initial?.payment_terms ?? "");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  const addLine = () => {
    setLines((prev) => [
      ...prev,
      { label: "", quantity: 1, unit: defaultUnit, unit_price_ht: 0, vat_rate: 0.20, _key: makeKey() },
    ]);
  };

  /** Charge les suggestions du métier (remplace les lignes vides) */
  const applyTemplates = () => {
    setLines(
      TEMPLATES.map((t) => ({
        label: t.label,
        quantity: t.quantity,
        unit: t.unit,
        unit_price_ht: t.unit_price_ht,
        vat_rate: t.vat_rate ?? 0.20,
        _key: makeKey(),
      })),
    );
  };

  const removeLine = (key: string) => {
    setLines((prev) => prev.filter((l) => l._key !== key));
  };

  const updateLine = (key: string, patch: Partial<LocalLine>) => {
    setLines((prev) => prev.map((l) => (l._key === key ? { ...l, ...patch } : l)));
  };

  const totals = useMemo(() => {
    let ht = 0;
    let ttc = 0;
    for (const l of lines) {
      const lineHt = (Number(l.quantity) || 0) * (Number(l.unit_price_ht) || 0);
      ht += lineHt;
      ttc += lineHt * (1 + (Number(l.vat_rate) || 0));
    }
    return {
      ht: Math.round(ht * 100) / 100,
      ttc: Math.round(ttc * 100) / 100,
    };
  }, [lines]);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.set("quote_request_id", String(quoteRequestId));
    fd.set("lines", JSON.stringify(lines.map(({ _key: _, ...l }) => l)));
    fd.set("delay_text", delayText);
    fd.set("valid_until", validUntil);
    fd.set("message", message);
    fd.set("payment_terms", paymentTerms);

    startTransition(async () => {
      const res = await submitQuoteResponseAction(undefined, fd);
      if (res.error) {
        setError(res.error);
      } else {
        setDone(true);
        setTimeout(() => window.location.reload(), 1500);
      }
    });
  };

  if (done) {
    return (
      <div className="text-center py-10">
        <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-ink-700">Devis envoyé !</h3>
        <p className="text-ink-500 mt-1">Le client va recevoir une notification.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Lignes */}
      <div>
        <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
          <h3 className="font-bold text-ink-700 text-sm uppercase tracking-wider">
            Lignes du devis
          </h3>
          {TEMPLATES.length > 0 && (
            <button
              type="button"
              onClick={applyTemplates}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 border border-brand-200 text-brand-700 hover:bg-brand-100 transition text-xs font-bold"
              title={`Suggestions pour ${metierName ?? "ce métier"}`}
            >
              <Wand2 size={12} /> Suggestions
            </button>
          )}
        </div>
        <div className="space-y-2">
          {lines.map((l, idx) => (
            <div key={l._key} className="grid grid-cols-12 gap-2 items-start p-3 rounded-xl border-2 border-ink-100 bg-white">
              <input
                type="text"
                required
                value={l.label}
                onChange={(e) => updateLine(l._key, { label: e.target.value })}
                placeholder={`Ligne ${idx + 1} — Ex: Pose carrelage salle de bain`}
                className="col-span-12 md:col-span-5 px-3 py-2 rounded-lg bg-ink-50 border border-ink-200 focus:border-brand-500 focus:bg-white outline-none text-sm"
              />
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={l.quantity}
                onChange={(e) => updateLine(l._key, { quantity: Number(e.target.value) })}
                placeholder="Qté"
                className="col-span-3 md:col-span-1 px-2 py-2 rounded-lg bg-ink-50 border border-ink-200 focus:border-brand-500 focus:bg-white outline-none text-sm text-right"
              />
              <select
                value={l.unit}
                onChange={(e) => updateLine(l._key, { unit: e.target.value })}
                className="col-span-3 md:col-span-1 px-2 py-2 rounded-lg bg-ink-50 border border-ink-200 focus:border-brand-500 focus:bg-white outline-none text-sm"
              >
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
              <div className="col-span-6 md:col-span-2 flex items-center bg-ink-50 border border-ink-200 rounded-lg focus-within:border-brand-500 focus-within:bg-white">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={l.unit_price_ht}
                  onChange={(e) => updateLine(l._key, { unit_price_ht: Number(e.target.value) })}
                  placeholder="PU"
                  className="flex-1 px-2 py-2 bg-transparent outline-none text-sm text-right"
                />
                <span className="text-xs text-ink-400 pr-2">€HT</span>
              </div>
              <select
                value={l.vat_rate}
                onChange={(e) => updateLine(l._key, { vat_rate: Number(e.target.value) })}
                className="col-span-9 md:col-span-2 px-2 py-2 rounded-lg bg-ink-50 border border-ink-200 focus:border-brand-500 focus:bg-white outline-none text-xs"
              >
                {VAT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <button
                type="button"
                onClick={() => removeLine(l._key)}
                disabled={lines.length === 1}
                className="col-span-3 md:col-span-1 px-2 py-2 rounded-lg text-ink-400 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Supprimer la ligne"
                title="Supprimer la ligne"
              >
                <Trash2 size={14} className="mx-auto" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addLine}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-ink-200 hover:border-brand-400 text-ink-500 hover:text-brand-600 font-bold text-sm transition"
        >
          <Plus size={14} /> Ajouter une ligne
        </button>
      </div>

      {/* Totaux */}
      <div className="bg-gradient-to-br from-ink-50 to-white rounded-2xl p-5 border-2 border-ink-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-ink-500">Total HT</span>
          <span className="text-lg font-bold text-ink-700 tabular-nums">
            {totals.ht.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
          </span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-ink-200">
          <span className="text-base font-bold text-ink-700">Total TTC</span>
          <span className="text-2xl font-bold text-brand-500 tabular-nums">
            {totals.ttc.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
          </span>
        </div>
      </div>

      {/* Détails */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-1.5">
            Délai d&apos;exécution
          </label>
          <input
            type="text"
            value={delayText}
            onChange={(e) => setDelayText(e.target.value)}
            placeholder="Ex : 2 semaines après signature"
            maxLength={120}
            className="w-full px-3 py-2 rounded-lg bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-1.5">
            Validité de l&apos;offre
          </label>
          <input
            type="date"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-1.5">
          Modalités de paiement
        </label>
        <input
          type="text"
          value={paymentTerms}
          onChange={(e) => setPaymentTerms(e.target.value)}
          placeholder="Ex : 30% à signature, 70% à fin de chantier"
          maxLength={500}
          className="w-full px-3 py-2 rounded-lg bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-ink-600 uppercase tracking-wider mb-1.5">
          Message au client (facultatif)
        </label>
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Précisions sur le chantier, conditions particulières…"
          maxLength={5000}
          className="w-full px-3 py-2 rounded-lg bg-ink-50 border-2 border-ink-200 focus:border-brand-500 focus:bg-white outline-none text-sm resize-y"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1.5">
          <AlertCircle size={14} /> {error}
        </p>
      )}

      <div className="flex justify-end pt-4 border-t border-ink-100">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition disabled:opacity-50"
        >
          {pending ? (
            <><Loader2 size={14} className="animate-spin" /> Envoi…</>
          ) : (
            <><Send size={14} /> Envoyer le devis au client</>
          )}
        </button>
      </div>
    </form>
  );
}
