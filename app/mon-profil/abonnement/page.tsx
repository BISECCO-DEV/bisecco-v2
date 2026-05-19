import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, Crown, Sparkles, Zap, ShieldCheck, CreditCard, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Mon abonnement",
  robots: { index: false, follow: false },
};

const PLANS = [
  {
    id: "free",     name: "Gratuit", price: 0,  features: ["Profil pro vitrine", "3 services listés", "5 photos galerie", "Messagerie", "SIREN vérifié"],
    cta: "Plan actuel", icon: Sparkles, active: true,
  },
  {
    id: "pro",      name: "Pro",     price: 19, features: ["Tout du Gratuit", "Services illimités", "Photos illimitées", "Badge Pro", "Stats détaillées", "Priorité résultats", "Support prioritaire"],
    cta: "Passer Pro", icon: Zap, popular: true,
  },
  {
    id: "premium",  name: "Premium", price: 49, features: ["Tout du Pro", "Boost SEO local", "Agenda partagé", "Certificat assurance", "Vidéo de présentation", "Mise en avant homepage", "Coaching"],
    cta: "Passer Premium", icon: Crown,
  },
];

export default function AbonnementPage() {
  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="container-default py-10">
        <Link href="/mon-profil" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Mon espace
        </Link>

        {/* Current plan */}
        <div className="bg-white rounded-3xl border border-ink-100 p-6 md:p-8 mt-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-ink-50 flex items-center justify-center">
                <Sparkles size={22} className="text-ink-400" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-ink-50 border border-ink-200 text-ink-500 text-[0.65rem] font-bold uppercase tracking-wider mb-1">
                  Plan actuel
                </span>
                <h1 className="text-2xl font-bold text-ink-700 tracking-tight">Gratuit</h1>
                <p className="text-sm text-ink-400 mt-0.5">Activé depuis le 14 mai 2026</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-ink-700">0€<span className="text-sm font-normal text-ink-400">/mois</span></div>
              <p className="text-xs text-ink-400 mt-1">Aucune facturation</p>
            </div>
          </div>
        </div>

        <div className="mt-8 mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-ink-700 tracking-tight">
            Boostez votre activité <span className="text-brand-500">dès maintenant</span>
          </h2>
          <p className="text-ink-400 mt-2">Sans engagement, annulez à tout moment.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={`relative rounded-3xl p-7 border transition ${
                p.popular
                  ? "bg-gradient-to-br from-ink-800 to-ink-700 text-white border-brand-500 scale-[1.02] shadow-brand-lg"
                  : p.active
                    ? "bg-ink-50/60 border-ink-200"
                    : "bg-white border-ink-100"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-500 text-white text-xs font-bold rounded-full shadow-[0_4px_12px_rgba(240,122,47,0.4)]">
                  🔥 LE PLUS POPULAIRE
                </span>
              )}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                p.popular ? "bg-brand-500/20 border border-brand-500/40" : "bg-brand-50"
              }`}>
                <p.icon size={20} className={p.popular ? "text-brand-400" : "text-brand-500"} />
              </div>
              <h3 className={`text-xl font-bold ${p.popular ? "text-white" : "text-ink-700"}`}>{p.name}</h3>
              <div className={`mt-2 flex items-baseline gap-1 ${p.popular ? "text-white" : "text-ink-700"}`}>
                <span className="text-4xl font-bold tracking-tight">{p.price}€</span>
                <span className={`${p.popular ? "text-white/60" : "text-ink-400"}`}>/mois</span>
              </div>

              <ul className="mt-6 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className={`flex items-start gap-2 text-sm ${p.popular ? "text-white/85" : "text-ink-600"}`}>
                    <Check size={15} className={`flex-shrink-0 mt-0.5 ${p.popular ? "text-brand-400" : "text-brand-500"}`} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                disabled={p.active}
                className={`w-full mt-6 py-3 rounded-xl font-bold transition ${
                  p.active
                    ? "bg-ink-100 text-ink-400 cursor-not-allowed"
                    : p.popular
                      ? "bg-brand-500 text-white hover:bg-brand-600 shadow-[0_8px_20px_rgba(240,122,47,0.35)]"
                      : "bg-ink-700 text-white hover:bg-ink-800"
                }`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Info paiement */}
        <div className="mt-8 grid md:grid-cols-3 gap-3">
          {[
            { icon: ShieldCheck, label: "Paiement sécurisé Stripe" },
            { icon: CreditCard,  label: "CB, virement, prélèvement SEPA" },
            { icon: Zap,         label: "Activation immédiate" },
          ].map((t) => (
            <div key={t.label} className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white border border-ink-100 text-sm text-ink-600">
              <t.icon size={15} className="text-emerald-500 flex-shrink-0" />
              {t.label}
            </div>
          ))}
        </div>

        {/* FAQ rapide */}
        <div className="mt-8 bg-white rounded-2xl border border-ink-100 p-6">
          <h3 className="font-bold text-ink-700 mb-3 text-sm">Questions fréquentes</h3>
          <div className="space-y-3 text-sm">
            <details className="group">
              <summary className="cursor-pointer font-semibold text-ink-700 flex justify-between items-center hover:text-brand-500">
                Puis-je annuler à tout moment ?
                <ArrowRight size={14} className="group-open:rotate-90 transition" />
              </summary>
              <p className="mt-2 text-ink-500 text-sm">Oui, sans engagement. Annulez en 1 clic depuis cette page. Vous gardez l&apos;accès jusqu&apos;à la fin du mois en cours.</p>
            </details>
            <details className="group pt-3 border-t border-ink-100">
              <summary className="cursor-pointer font-semibold text-ink-700 flex justify-between items-center hover:text-brand-500">
                Puis-je changer de plan ?
                <ArrowRight size={14} className="group-open:rotate-90 transition" />
              </summary>
              <p className="mt-2 text-ink-500 text-sm">Oui, à tout moment. L&apos;ajustement de tarif est calculé au prorata.</p>
            </details>
            <details className="group pt-3 border-t border-ink-100">
              <summary className="cursor-pointer font-semibold text-ink-700 flex justify-between items-center hover:text-brand-500">
                Comment se passe la facturation ?
                <ArrowRight size={14} className="group-open:rotate-90 transition" />
              </summary>
              <p className="mt-2 text-ink-500 text-sm">Vous recevez chaque mois une facture par email, conforme à la législation française. TVA incluse.</p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
