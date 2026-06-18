"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Send, Loader2, CheckCircle2 } from "lucide-react";
import { loginAction, resendConfirmationEmailAction } from "@/lib/auth/actions";
import { CtaButton } from "@/components/ui/CtaButton";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  const [resendState, resendAction, resendPending] = useActionState(resendConfirmationEmailAction, undefined);
  const [showPwd, setShowPwd] = useState(false);
  const [emailValue, setEmailValue] = useState("");

  // Le message d'erreur de login mentionne-t-il "email pas encore confirmé" ?
  // → on affiche le bouton "Renvoyer l'email de confirmation"
  const showResend = !!state?.error && /pas encore confirmé/i.test(state.error);

  return (
    <>
      {/* Erreurs login */}
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4 leading-relaxed">
          <div className="flex items-start gap-2">
            <span>⚠</span>
            <div className="flex-1">{state.error}</div>
          </div>
          {showResend && (
            <form action={resendAction} className="mt-3 pt-3 border-t border-red-200">
              <input type="hidden" name="email" value={emailValue} />
              <button
                type="submit"
                disabled={resendPending || !emailValue}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-red-300 text-red-700 text-xs font-bold hover:bg-red-100 transition disabled:opacity-50"
              >
                {resendPending ? (
                  <><Loader2 size={12} className="animate-spin" /> Envoi…</>
                ) : (
                  <><Send size={12} /> Renvoyer l&apos;email de confirmation</>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Succès du renvoi d'email */}
      {resendState?.success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3 mb-4 flex items-start gap-2">
          <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
          <div>{resendState.success}</div>
        </div>
      )}

      <form action={action} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-ink-600 mb-1.5">Adresse email</label>
          <div className="flex items-center gap-2 px-3 border-2 border-ink-200 rounded-xl bg-ink-50 focus-within:border-brand-500 focus-within:bg-white transition">
            <Mail size={18} className="text-ink-300" />
            <input
              type="email"
              name="email"
              required
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              placeholder="vous@exemple.fr"
              className="flex-1 bg-transparent py-3 outline-none text-sm text-ink-700"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold text-ink-600">Mot de passe</label>
            <Link href="/recuperation-compte" className="text-xs font-semibold text-brand-500 hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="flex items-center gap-2 px-3 border-2 border-ink-200 rounded-xl bg-ink-50 focus-within:border-brand-500 focus-within:bg-white transition">
            <Lock size={18} className="text-ink-300" />
            <input
              type={showPwd ? "text" : "password"}
              name="password"
              required
              className="flex-1 bg-transparent py-3 outline-none text-sm text-ink-700"
            />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="text-ink-300 hover:text-ink-600">
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-ink-500 cursor-pointer">
          <input type="checkbox" name="remember" className="accent-brand-500" />
          Garder ma session active
        </label>

        <div className="mt-2 flex">
          <CtaButton type="submit" variant="primary" size="lg" disabled={pending} className="w-full justify-between">
            {pending ? "Connexion…" : "Se connecter"}
          </CtaButton>
        </div>
      </form>
    </>
  );
}
