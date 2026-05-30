"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { loginAction } from "@/lib/auth/actions";
import { CtaButton } from "@/components/ui/CtaButton";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  const [showPwd, setShowPwd] = useState(false);

  return (
    <>
      {/* Erreurs */}
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
          ⚠ {state.error}
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
