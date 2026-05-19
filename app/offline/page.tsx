import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { WifiOff, RefreshCw } from "lucide-react";

export const metadata: Metadata = {
  title: "Hors ligne",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="flex items-center gap-3 justify-center mb-10">
          <div className="w-10 h-10 rounded-xl overflow-hidden">
            <Image src="/logo.jpg" alt="Bisecco" width={40} height={40} />
          </div>
          <span className="font-bold text-base tracking-[0.12em] text-ink-700">BISECCO</span>
        </div>

        <div className="w-16 h-16 mx-auto rounded-2xl bg-ink-100 flex items-center justify-center mb-5">
          <WifiOff size={28} className="text-ink-400" />
        </div>

        <h1 className="text-2xl font-bold text-ink-700 tracking-tight">Vous êtes hors ligne</h1>
        <p className="text-ink-500 mt-3 leading-relaxed">
          Bisecco a besoin d&apos;une connexion internet pour afficher cette page. Vérifiez votre connexion et réessayez.
        </p>

        <Link
          href="/"
          className="btn-primary mt-7 inline-flex"
        >
          <RefreshCw size={15} /> Réessayer
        </Link>
      </div>
    </div>
  );
}
