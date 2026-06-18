import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Settings, ShieldCheck, Bell, Wrench, Eye, MapPin } from "lucide-react";
import { GeocodeAllButton } from "@/components/features/admin/GeocodeAllButton";

export const metadata: Metadata = {
  title: "Admin · Paramètres",
  robots: { index: false, follow: false },
};

export default function AdminParametresPage() {
  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="container-default py-10">
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Dashboard admin
        </Link>
        <h1 className="text-3xl font-bold text-ink-700 mt-4 tracking-tight flex items-center gap-2">
          <Settings size={24} className="text-brand-500" /> Paramètres plateforme
        </h1>

        <div className="mt-8 space-y-4">
          {/* Maintenance */}
          <section className="bg-white rounded-2xl border border-ink-100 p-6">
            <header className="flex items-center gap-3 mb-4">
              <Wrench size={18} className="text-amber-500" />
              <div>
                <h2 className="font-bold text-ink-700">Mode maintenance</h2>
                <p className="text-xs text-ink-400">Active une page de maintenance pour tous les visiteurs</p>
              </div>
            </header>
            <label className="flex items-center justify-between gap-3 p-3 rounded-xl bg-ink-50 cursor-pointer">
              <span className="text-sm font-semibold text-ink-700">Activer le mode maintenance</span>
              <input type="checkbox" className="accent-brand-500 w-5 h-5" />
            </label>
          </section>

          {/* SEO */}
          <section className="bg-white rounded-2xl border border-ink-100 p-6">
            <header className="flex items-center gap-3 mb-4">
              <Eye size={18} className="text-blue-500" />
              <div>
                <h2 className="font-bold text-ink-700">SEO & indexation</h2>
                <p className="text-xs text-ink-400">Contrôle de l&apos;indexation Google</p>
              </div>
            </header>
            <div className="space-y-2">
              <label className="flex items-center justify-between gap-3 p-3 rounded-xl bg-ink-50 cursor-pointer">
                <span className="text-sm font-semibold text-ink-700">Autoriser l&apos;indexation par les moteurs</span>
                <input type="checkbox" defaultChecked className="accent-brand-500 w-5 h-5" />
              </label>
              <label className="flex items-center justify-between gap-3 p-3 rounded-xl bg-ink-50 cursor-pointer">
                <span className="text-sm font-semibold text-ink-700">Soumettre sitemap à Google Search Console</span>
                <button className="text-xs font-bold text-brand-500 hover:underline">Soumettre</button>
              </label>
            </div>
          </section>

          {/* Modération */}
          <section className="bg-white rounded-2xl border border-ink-100 p-6">
            <header className="flex items-center gap-3 mb-4">
              <ShieldCheck size={18} className="text-emerald-500" />
              <div>
                <h2 className="font-bold text-ink-700">Modération</h2>
                <p className="text-xs text-ink-400">Règles de modération automatique</p>
              </div>
            </header>
            <div className="space-y-2">
              {[
                "Filtrer automatiquement les avis < 20 caractères",
                "Filtrer les insultes (liste de mots interdits)",
                "Mettre en attente les avis 1★ (validation manuelle)",
                "Vérifier l'email avant publication d'un avis",
              ].map((opt) => (
                <label key={opt} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-ink-50 cursor-pointer">
                  <span className="text-sm text-ink-700">{opt}</span>
                  <input type="checkbox" defaultChecked className="accent-brand-500 w-5 h-5" />
                </label>
              ))}
            </div>
          </section>

          {/* Géolocalisation · rattrapage des profils existants */}
          <section className="bg-white rounded-2xl border border-ink-100 p-6">
            <header className="flex items-center gap-3 mb-4">
              <MapPin size={18} className="text-brand-500" />
              <div>
                <h2 className="font-bold text-ink-700">Géolocalisation</h2>
                <p className="text-xs text-ink-400">
                  Géocode tous les profils existants via l&apos;API Adresse data.gouv.fr.
                  Précision ~5m sur les adresses complètes, ~50m sur les villes.
                </p>
              </div>
            </header>
            <GeocodeAllButton />
          </section>

          {/* Notifications */}
          <section className="bg-white rounded-2xl border border-ink-100 p-6">
            <header className="flex items-center gap-3 mb-4">
              <Bell size={18} className="text-purple-500" />
              <div>
                <h2 className="font-bold text-ink-700">Notifications admin</h2>
                <p className="text-xs text-ink-400">Recevez les alertes par email</p>
              </div>
            </header>
            <div className="space-y-2">
              {[
                "Nouveau professionnel en attente de validation",
                "Avis signalé par un utilisateur",
                "Conversation signalée",
                "Pic de trafic anormal",
                "Récap hebdomadaire (lundi 9h)",
              ].map((opt) => (
                <label key={opt} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-ink-50 cursor-pointer">
                  <span className="text-sm text-ink-700">{opt}</span>
                  <input type="checkbox" defaultChecked className="accent-brand-500 w-5 h-5" />
                </label>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
