import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ResetForm } from "./ResetForm";

export const metadata: Metadata = {
  title: "Réinitialiser mon mot de passe",
  robots: { index: false, follow: false },
};

export default function ReinitialiserPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-ink-100">
        <div className="container-default flex items-center h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md overflow-hidden">
              <Image src="/logo.jpg" alt="Bisecco" width={28} height={28} />
            </div>
            <span className="font-display font-semibold text-sm tracking-[0.1em] text-ink-700">BISECCO</span>
          </Link>
        </div>
      </div>

      <div className="px-4 py-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl sm:text-[2.25rem] font-bold text-ink-700 tracking-[-0.02em]">
            Nouveau mot de passe
          </h1>
          <p className="text-ink-400 mt-2">
            Choisissez un nouveau mot de passe sécurisé pour votre compte.
          </p>
          <div className="mt-8">
            <ResetForm />
          </div>
        </div>
      </div>
    </div>
  );
}
