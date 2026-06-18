import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BarChart3, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin · Statistiques",
  robots: { index: false, follow: false },
};

export default function AdminStatsPage() {
  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="container-default py-10">
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Dashboard admin
        </Link>
        <div className="mt-4 mb-8">
          <h1 className="text-3xl font-bold text-ink-700 tracking-tight flex items-center gap-2">
            <BarChart3 size={24} className="text-brand-500" /> Statistiques
          </h1>
          <p className="text-ink-400 mt-1">Vue détaillée de l&apos;activité Bisecco.</p>
        </div>

        <div className="bg-white rounded-2xl border border-ink-100 p-10 text-center max-w-xl mx-auto">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-5">
            <Clock size={26} className="text-brand-500" />
          </div>
          <h2 className="text-xl font-bold text-ink-700">Statistiques bientôt disponibles</h2>
          <p className="text-ink-500 mt-3 leading-relaxed">
            Le suivi du trafic et de l&apos;activité (visiteurs, inscriptions, devis, messages)
            n&apos;est pas encore connecté à de vraies données. Cette page affichera des
            chiffres réels dès que l&apos;analytics sera branché.
          </p>
          <p className="text-xs text-ink-400 mt-5">
            En attendant, les compteurs fiables se trouvent dans les pages
            <Link href="/admin/utilisateurs" className="text-brand-500 font-semibold"> Utilisateurs</Link> et
            <Link href="/admin/devis" className="text-brand-500 font-semibold"> Devis</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
