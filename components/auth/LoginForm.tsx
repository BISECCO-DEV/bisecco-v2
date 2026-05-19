"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { loginAction, googleLoginAction } from "@/lib/auth/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  const [showPwd, setShowPwd] = useState(false);

  return (
    <>
      {/* OAuth Google */}
      <form action={googleLoginAction}>
        <button
          type="submit"
          className="w-full relative flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-ink-200 bg-white hover:border-brand-500 transition font-semibold text-ink-700"
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.4H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8a12 12 0 1 1 0-24c3 0 5.7 1.1 7.8 3l5.7-5.7A20 20 0 1 0 44 24c0-1.3-.1-2.6-.4-3.6z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7A20 20 0 0 0 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2L31.4 33A12 12 0 0 1 12.7 28l-6.5 5a20 20 0 0 0 17.8 11z"/>
            <path fill="#1976D2" d="M43.6 20.4H42V20H24v8h11.3a12 12 0 0 1-4 5l6.2 5.2c-.4.4 6.5-4.7 6.5-14.2 0-1.3-.1-2.6-.4-3.6z"/>
          </svg>
          Continuer avec Google
          <span className="absolute -top-2 right-3 bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">⚡ 1 CLIC</span>
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-ink-100" />
        <span className="text-xs text-ink-300 font-semibold tracking-wider uppercase">ou avec votre email</span>
        <div className="flex-1 h-px bg-ink-100" />
      </div>

      {/* Erreurs */}
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
          ⚠ {state.error}
        </div>
      )}

      <form action={action} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-ink-600 mb-1.5">Email ou téléphone</label>
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

        <button type="submit" disabled={pending} className="btn-primary w-full mt-2 py-3.5 disabled:opacity-50">
          {pending ? "Connexion…" : "Se connecter →"}
        </button>
      </form>
    </>
  );
}
