"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, CheckCircle2, AlertTriangle, ArrowRight, AlertCircle } from "lucide-react";
import { verifyResetTokenAction, completePasswordResetAction } from "@/lib/auth/actions";

export function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenStatus, setTokenStatus] = useState<"checking" | "ok" | "invalid">("checking");
  const [tokenError, setTokenError] = useState<string>("");

  // Vérifie le token au chargement
  useEffect(() => {
    if (!token) {
      setTokenStatus("invalid");
      setTokenError("Lien invalide : aucun token fourni.");
      return;
    }
    verifyResetTokenAction(token).then((res) => {
      if (res.ok) {
        setTokenStatus("ok");
      } else {
        setTokenStatus("invalid");
        setTokenError(res.error);
      }
    });
  }, [token]);

  const strength = (() => {
    if (password.length === 0) return { score: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    if (score <= 2) return { score, label: "Faible", color: "bg-red-500" };
    if (score <= 3) return { score, label: "Moyen", color: "bg-amber-500" };
    if (score <= 4) return { score, label: "Bon", color: "bg-emerald-400" };
    return { score, label: "Excellent", color: "bg-emerald-600" };
  })();

  const match = password.length > 0 && password === confirm;
  const valid = password.length >= 8 && match;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setLoading(true);
    setError(null);

    const res = await completePasswordResetAction(token, password);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setDone(true);
  };

  if (tokenStatus === "checking") {
    return <div className="text-center text-ink-400 text-sm py-8">Vérification du lien…</div>;
  }

  if (tokenStatus === "invalid") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <AlertTriangle size={28} className="text-red-500 mx-auto mb-3" />
        <h2 className="font-bold text-red-700">Lien invalide ou expiré</h2>
        <p className="text-sm text-red-600 mt-2">
          {tokenError || "Ce lien de réinitialisation n'est plus valable. Demandez-en un nouveau."}
        </p>
        <Link href="/recuperation-compte" className="btn-primary mt-5 inline-flex text-sm">
          Recommencer
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-5">
          <CheckCircle2 size={32} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-ink-700">Mot de passe modifié</h2>
        <p className="text-ink-500 mt-2 text-sm leading-relaxed">
          Votre nouveau mot de passe est actif. Vous pouvez vous connecter.
        </p>
        <Link href="/connexion" className="btn-primary mt-7 inline-flex">
          Se connecter <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-ink-600 mb-1.5">Nouveau mot de passe</label>
        <div className="flex items-center gap-2 px-3 border-2 border-ink-200 rounded-xl bg-ink-50 focus-within:border-brand-500 focus-within:bg-white transition">
          <Lock size={18} className="text-ink-300" />
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            placeholder="Min. 8 caractères"
            className="flex-1 bg-transparent py-3 outline-none text-sm text-ink-700"
          />
          <button type="button" onClick={() => setShow(!show)} className="text-ink-400 hover:text-ink-700">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {password.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1.5 bg-ink-100 rounded-full overflow-hidden">
              <div className={`h-full ${strength.color} rounded-full transition-all`} style={{ width: `${(strength.score / 5) * 100}%` }} />
            </div>
            <span className="text-xs font-bold text-ink-500 min-w-[60px] text-right">{strength.label}</span>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-ink-600 mb-1.5">Confirmer</label>
        <div className={`flex items-center gap-2 px-3 border-2 rounded-xl bg-ink-50 transition ${
          confirm.length > 0 && !match ? "border-red-300" : "border-ink-200 focus-within:border-brand-500"
        }`}>
          <Lock size={18} className="text-ink-300" />
          <input
            type={show ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            placeholder="Retapez le mot de passe"
            className="flex-1 bg-transparent py-3 outline-none text-sm text-ink-700"
          />
          {confirm.length > 0 && match && <CheckCircle2 size={16} className="text-emerald-500" />}
        </div>
        {confirm.length > 0 && !match && (
          <p className="text-xs text-red-600 font-semibold mt-1.5">Les mots de passe ne correspondent pas</p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 font-bold flex items-center gap-1.5">
          <AlertCircle size={14} /> {error}
        </p>
      )}

      <button type="submit" disabled={!valid || loading} className="btn-primary w-full py-3.5 disabled:opacity-50">
        {loading ? "Enregistrement…" : "Définir le nouveau mot de passe"}
      </button>
    </form>
  );
}
