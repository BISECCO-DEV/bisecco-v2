import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre espace Bisecco.",
  robots: { index: false, follow: false },
};

export default function ConnexionPage() {
  return (
    <div className="min-h-[calc(100vh-160px)] bg-ink-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-card border border-ink-100 p-8 sm:p-10">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-card">
              <Image src="/logo.jpg" alt="Bisecco" width={56} height={56} />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-center text-ink-700">
            Bon retour <span className="text-brand-500">parmi nous</span>
          </h1>
          <p className="text-center text-ink-400 text-sm mt-2 mb-7">
            Connectez-vous pour accéder à votre espace Bisecco.
          </p>

          <LoginForm />

          <div className="flex justify-center gap-4 mt-6 text-xs text-ink-300">
            <span>✓ Données chiffrées</span>
            <span>✓ RGPD</span>
            <span>✓ Réseau vérifié</span>
          </div>

          <p className="text-center text-sm text-ink-400 mt-6">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="text-brand-500 font-bold hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
