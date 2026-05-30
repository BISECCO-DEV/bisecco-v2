"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { KeyRound, Lock, AlertCircle } from "lucide-react";
import { validateBypassCodeAction } from "./actions";

export function ComingSoonClient() {
  const params = useSearchParams();
  const [codeAttempts, setCodeAttempts] = useState(0);

  const codeError = params.get("error");

  useEffect(() => {
    if (codeError === "invalid") {
      setCodeAttempts((n) => n + 1);
    }
  }, [codeError]);

  return (
    <div className="mt-10 max-w-md mx-auto space-y-5">
      {/* ═══ Code d'accès ═══ */}
      <div className="bg-white/[0.04] border border-white/[0.10] rounded-3xl p-6 backdrop-blur-md">
        <h2 className="font-extrabold text-white text-lg mb-1 inline-flex items-center gap-2">
          <KeyRound size={16} className="text-brand-400" />
          Accès anticipé
        </h2>
        <p className="text-white/55 text-sm mb-5">
          Vous avez reçu un code d&apos;accès ? Saisissez-le pour entrer dans la plateforme.
        </p>

        <form action={validateBypassCodeAction} className="space-y-3">
          <div className="relative">
            <Lock
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              type="text"
              name="code"
              required
              autoComplete="off"
              placeholder="XXXX-XXXX"
              maxLength={50}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/[0.06] border-2 border-white/[0.10] focus:border-brand-400 focus:bg-white/[0.10] outline-none text-white placeholder-white/40 text-sm font-mono font-bold tracking-[0.10em] backdrop-blur-md transition"
            />
          </div>
          <button
            type="submit"
            disabled={codeAttempts >= 5}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-extrabold text-sm shadow-[0_10px_28px_-6px_rgba(240,122,47,0.5)] hover:-translate-y-0.5 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            <KeyRound size={14} />
            {codeAttempts >= 5 ? "Trop d'essais · réessayez plus tard" : "Valider le code"}
          </button>

          {codeError === "invalid" && (
            <div className="bg-red-500/15 border border-red-500/30 rounded-xl px-3 py-2 text-red-300 text-xs font-semibold inline-flex items-center gap-1.5">
              <AlertCircle size={12} />
              Code incorrect ({codeAttempts}/5 essais)
            </div>
          )}
          {codeError === "empty" && (
            <div className="bg-amber-500/15 border border-amber-500/30 rounded-xl px-3 py-2 text-amber-300 text-xs font-semibold inline-flex items-center gap-1.5">
              <AlertCircle size={12} />
              Veuillez saisir un code
            </div>
          )}

          <p className="text-[0.66rem] text-white/35 text-center pt-1 inline-flex items-center gap-1.5 justify-center w-full">
            <Lock size={9} />
            Connexion chiffrée · Validation côté serveur
          </p>
        </form>
      </div>
    </div>
  );
}
