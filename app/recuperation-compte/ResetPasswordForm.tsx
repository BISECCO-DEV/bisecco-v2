"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle2, ArrowRight, AlertCircle } from "lucide-react";
import { requestPasswordResetAction } from "@/lib/auth/actions";
import type { AuthState } from "@/lib/auth/actions";

export function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(
    requestPasswordResetAction,
    undefined,
  );

  if (state?.success) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-5">
          <CheckCircle2 size={32} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-ink-700">Email envoyé !</h2>
        <p className="text-ink-500 mt-2 text-sm leading-relaxed">
          Si un compte existe pour <strong className="text-ink-700">{email}</strong>, vous recevrez un email avec un lien de réinitialisation dans quelques instants.
        </p>
        <p className="text-xs text-ink-400 mt-4">Pensez à vérifier vos spams.</p>
        <Link href="/connexion" className="mt-7 inline-flex items-center gap-1.5 text-sm font-bold text-brand-500 hover:underline">
          Retour à la connexion <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-ink-600 mb-1.5">Adresse email</label>
        <div className="flex items-center gap-2 px-3 border-2 border-ink-200 rounded-xl bg-ink-50 focus-within:border-brand-500 focus-within:bg-white transition">
          <Mail size={18} className="text-ink-300" />
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="vous@exemple.fr"
            className="flex-1 bg-transparent py-3 outline-none text-sm text-ink-700"
          />
        </div>
      </div>

      {state?.error && (
        <p className="text-sm text-red-600 font-bold flex items-center gap-1.5">
          <AlertCircle size={14} /> {state.error}
        </p>
      )}

      <button type="submit" disabled={isPending || !email} className="btn-primary w-full py-3.5 disabled:opacity-50">
        {isPending ? "Envoi…" : "Envoyer le lien de récupération →"}
      </button>
      <p className="text-center text-sm text-ink-400 pt-2">
        Vous vous souvenez ?{" "}
        <Link href="/connexion" className="text-brand-500 font-bold hover:underline">Se connecter</Link>
      </p>
    </form>
  );
}
