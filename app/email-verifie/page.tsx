import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Home, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Email vérifié",
  robots: { index: false, follow: false },
};

export default function EmailVerifie() {
  return (
    <div className="min-h-[calc(100vh-160px)] bg-ink-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-card border border-ink-100 p-10 max-w-md text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-5">
          <CheckCircle2 size={40} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-ink-700 tracking-tight">Email vérifié !</h1>
        <p className="text-ink-500 mt-3 leading-relaxed">
          Votre adresse email a été confirmée. Vous pouvez maintenant profiter de toutes les fonctionnalités de Bisecco.
        </p>

        <div className="flex flex-col gap-2 mt-7">
          <Link href="/mon-profil" className="btn-primary">
            <User size={16} /> Aller sur mon profil
          </Link>
          <Link href="/" className="btn-outline">
            <Home size={16} /> Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
