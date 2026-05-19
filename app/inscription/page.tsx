import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Inscription",
  description: "Créez votre compte Bisecco en 2 minutes · gratuit, sans engagement.",
  robots: { index: false, follow: false },
};

export default function InscriptionPage() {
  return (
    <div className="min-h-[calc(100vh-160px)] bg-ink-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-3xl shadow-card border border-ink-100 p-8 sm:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl overflow-hidden shadow-card">
                <Image src="/logo.jpg" alt="Bisecco" width={44} height={44} />
              </div>
              <span className="font-display font-bold text-xl tracking-[0.12em] text-ink-700">
                BISECCO
              </span>
            </div>
          </div>

          {/* Titre */}
          <h1 className="text-center text-2xl sm:text-[1.7rem] font-bold text-ink-700 tracking-tight">
            Créer mon profil <span className="text-brand-500">professionnel</span>
          </h1>
          <p className="text-center text-[0.9rem] text-ink-400 mt-1.5 mb-6">
            Gratuit · 2 minutes · Vérification SIREN incluse
          </p>

          <SignupForm />

          <p className="text-center text-sm text-ink-400 mt-6">
            Déjà inscrit ?{" "}
            <Link
              href="/connexion"
              className="text-brand-500 font-bold hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
