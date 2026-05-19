import type { Metadata } from "next";
import Link from "next/link";
import { SignalerForm } from "./SignalerForm";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Signaler un problème",
  robots: { index: false, follow: false },
};

export default function SignalerPage() {
  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="container-default max-w-2xl py-12">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Retour
        </Link>

        <div className="mt-4 mb-8 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 flex items-center justify-center mb-3">
            <ShieldAlert size={22} className="text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-ink-700 tracking-tight">Signaler un problème</h1>
          <p className="text-ink-400 mt-2">Aidez-nous à protéger la communauté. Tous les signalements sont étudiés sous 48h.</p>
        </div>

        <SignalerForm />
      </div>
    </div>
  );
}
