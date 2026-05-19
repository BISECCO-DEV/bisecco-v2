import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, Mail, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Demande envoyée",
  robots: { index: false, follow: false },
};

export default function DevisConfirme() {
  return (
    <div className="min-h-[calc(100vh-160px)] bg-ink-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-card border border-ink-100 p-10 max-w-md text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-5">
          <CheckCircle2 size={40} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-ink-700">Demande envoyée !</h1>
        <p className="text-ink-500 mt-2 leading-relaxed">
          Plusieurs artisans vérifiés vont étudier votre projet et vous proposer un devis dans les <strong>24h</strong>.
        </p>

        <div className="text-left mt-7 space-y-3 bg-ink-50 rounded-2xl p-5 border border-ink-100">
          {[
            { icon: Mail,  text: "Vous recevrez les devis par email" },
            { icon: Clock, text: "Réponse moyenne : moins de 24h" },
          ].map((s) => (
            <div key={s.text} className="flex items-center gap-3 text-sm">
              <s.icon size={16} className="text-brand-500 flex-shrink-0" />
              <span className="text-ink-600">{s.text}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-7">
          <Link href="/mon-profil" className="btn-primary flex-1">
            Mon espace
          </Link>
          <Link href="/" className="btn-outline flex-1">
            <Home size={16} /> Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
