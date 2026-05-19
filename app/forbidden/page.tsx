import type { Metadata } from "next";
import Link from "next/link";
import { Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Accès refusé",
  robots: { index: false, follow: false },
};

export default function ForbiddenPage() {
  return (
    <div className="min-h-[calc(100vh-160px)] bg-ink-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-card border border-ink-100 p-12 text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-brand-50 mx-auto flex items-center justify-center mb-5">
          <Lock className="text-brand-500" size={36} />
        </div>
        <div className="text-6xl sm:text-7xl font-bold text-ink-700">
          403
        </div>
        <h1 className="text-2xl font-bold text-ink-700 mt-2">Accès refusé</h1>
        <p className="text-ink-400 mt-3">
          Vous n&apos;avez pas les autorisations nécessaires pour accéder à cette page.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-7">
          <Link href="/" className="btn-primary">← Retour à l&apos;accueil</Link>
          <Link href="/connexion" className="btn-outline">Se connecter</Link>
        </div>
      </div>
    </div>
  );
}
