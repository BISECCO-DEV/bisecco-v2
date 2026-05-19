import type { Metadata } from "next";
import Link from "next/link";
import {
  Mail, MapPin, Clock, ShieldCheck, MessageSquare, Send,
  ArrowRight, Zap, HelpCircle,
} from "lucide-react";
import { ContactForm } from "./ContactForm";
import { JsonLd } from "@/components/ui/JsonLd";

export const metadata: Metadata = {
  title: "Contact · Réseau des artisans français",
  description: "Contactez l'équipe Bisecco : support, partenariats, presse, recrutement. Réponse sous 24h ouvrées. Email, téléphone et formulaire en ligne.",
  alternates: { canonical: "/contact" },
};

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Bisecco",
  url: "https://bisecco.fr/contact",
  mainEntity: {
    "@type": "Organization",
    name: "Bisecco",
    email: "contact@bisecco.fr",
    telephone: "+33-1-00-00-00-00",
    address: {
      "@type": "PostalAddress",
      streetAddress: "45 Boulevard de la Croisette",
      postalCode: "06400",
      addressLocality: "Cannes",
      addressCountry: "FR",
    },
    contactPoint: [
      { "@type": "ContactPoint", contactType: "customer support",  email: "contact@bisecco.fr",     availableLanguage: "French" },
      { "@type": "ContactPoint", contactType: "partnerships",      email: "partenariats@bisecco.fr", availableLanguage: "French" },
      { "@type": "ContactPoint", contactType: "press",             email: "presse@bisecco.fr",      availableLanguage: "French" },
    ],
  },
};

const FAQ = [
  {
    q: "Quel est le délai de réponse ?",
    a: "Notre équipe vous répond sous 24 heures ouvrées (du lundi au vendredi). Les demandes urgentes envoyées en weekend sont traitées le lundi matin en priorité.",
  },
  {
    q: "Comment Bisecco vérifie-t-il les artisans ?",
    a: "Chaque artisan inscrit voit son numéro SIREN contrôlé via l'API officielle Sirene de l'INSEE. Seuls les artisans avec une entreprise déclarée et active obtiennent le badge \"SIREN vérifié\".",
  },
  {
    q: "Bisecco prend-il une commission sur les chantiers ?",
    a: "Non, jamais. La plateforme est 100 % gratuite pour les particuliers comme pour les artisans. Nous proposons uniquement des services premium optionnels (pack visibilité) que les artisans peuvent souscrire volontairement.",
  },
  {
    q: "Comment supprimer mon compte ?",
    a: "Vous pouvez supprimer votre compte à tout moment depuis votre espace personnel ou par simple email à contact@bisecco.fr. Vos données sont effacées sous 30 jours conformément au RGPD.",
  },
  {
    q: "Vous êtes un journaliste ?",
    a: "Contactez directement presse@bisecco.fr pour toute demande d'interview, communiqué de presse ou kit média. Réponse sous 4h ouvrées.",
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactSchema} />

      <div className="bg-gradient-to-b from-ink-50 via-white to-ink-50 min-h-screen">

        {/* ═══════════ HERO ═══════════ */}
        <section className="relative bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-brand-500/15 blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-32 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.04),transparent_60%)] pointer-events-none" />

          <div className="container-default relative py-16 lg:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.12] backdrop-blur-md text-white/95 text-[0.72rem] font-bold tracking-[0.10em] uppercase">
                <MessageSquare size={11} strokeWidth={2.6} className="text-brand-400" />
                Contact direct · Réponse sous 24h
              </span>
              <h1 className="mt-5 text-[40px] sm:text-[48px] lg:text-[56px] leading-[1.05] font-extrabold tracking-[-0.025em] text-white">
                Une question ?<br />
                <span className="text-brand-500">
                  Notre équipe vous écoute.
                </span>
              </h1>
              <p className="mt-6 text-[1.08rem] lg:text-[1.18rem] text-white/75 max-w-2xl mx-auto leading-relaxed">
                Support, partenariats, presse, recrutement… Nous répondons à toutes vos demandes
                sous <strong className="text-white">24 heures ouvrées</strong>. Pour les urgences,
                contactez-nous directement par téléphone.
              </p>

              {/* Trust chips */}
              <div className="mt-7 flex flex-wrap justify-center gap-2">
                {[
                  { icon: Zap,         label: "Réponse < 24h" },
                  { icon: ShieldCheck, label: "Données RGPD" },
                  { icon: HelpCircle,  label: "Support 7j/7" },
                ].map((chip) => (
                  <span
                    key={chip.label}
                    className="inline-flex items-center gap-1.5 pl-2.5 pr-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.10] text-[0.82rem] font-semibold text-white/90 backdrop-blur-sm"
                  >
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-500/20 text-brand-400">
                      <chip.icon size={11} strokeWidth={2.8} />
                    </span>
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ FORM + SIDEBAR ═══════════ */}
        <section className="container-default py-14 lg:py-20">
          <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-10 max-w-6xl mx-auto">

            {/* ─── Formulaire ─── */}
            <ContactForm />

            {/* ─── Sidebar premium ─── */}
            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">

              {/* Carte Email */}
              <a
                href="mailto:contact@bisecco.fr"
                className="group block bg-white rounded-2xl border border-ink-100 p-5 hover:border-brand-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(13,30,74,0.12)] transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white shadow-[0_4px_12px_rgba(240,122,47,0.35)] flex-shrink-0">
                    <Mail size={18} strokeWidth={2.2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[0.65rem] font-bold tracking-[0.14em] uppercase text-ink-400 mb-1">Email général</div>
                    <div className="font-bold text-ink-700 text-[0.94rem]">contact@bisecco.fr</div>
                    <div className="text-[0.78rem] text-ink-400 mt-1">Réponse sous 24h ouvrées</div>
                  </div>
                  <ArrowRight size={15} className="text-ink-300 group-hover:translate-x-0.5 group-hover:text-brand-500 transition flex-shrink-0 mt-1" />
                </div>
              </a>

              {/* Carte Adresse */}
              <div className="bg-white rounded-2xl border border-ink-100 p-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <MapPin size={18} strokeWidth={2.2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[0.65rem] font-bold tracking-[0.14em] uppercase text-ink-400 mb-1">Adresse</div>
                    <div className="font-bold text-ink-700 text-[0.94rem] leading-tight">AGISCO HOLDING SAS</div>
                    <div className="text-[0.86rem] text-ink-500 mt-1 leading-snug">
                      45 Boulevard de la Croisette<br />
                      06400 Cannes, France
                    </div>
                  </div>
                </div>
              </div>

              {/* Carte Horaires + Statut équipe */}
              <div className="bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 rounded-2xl p-5 text-white overflow-hidden relative">
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-brand-500/20 blur-2xl pointer-events-none" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="relative flex items-center justify-center">
                      <span className="absolute inline-flex w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
                      <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
                    </span>
                    <span className="text-[0.7rem] font-bold tracking-[0.12em] uppercase text-emerald-300">
                      Équipe en ligne
                    </span>
                  </div>
                  <div className="font-bold text-[0.96rem] mb-1">Délai moyen de réponse</div>
                  <div className="flex items-baseline gap-2">
                    <Clock size={14} className="text-brand-400" />
                    <span className="text-2xl font-extrabold tracking-tight">3h 42</span>
                    <span className="text-[0.78rem] text-white/55">sur les 7 derniers jours</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 text-[0.78rem] text-white/65 space-y-1">
                    <div className="flex justify-between"><span>Lun – Ven</span><strong className="text-white/90">9h – 18h</strong></div>
                    <div className="flex justify-between"><span>Samedi</span><strong className="text-white/90">10h – 14h</strong></div>
                    <div className="flex justify-between"><span>Dimanche</span><span className="text-white/40">Fermé</span></div>
                  </div>
                </div>
              </div>

            </aside>
          </div>
        </section>

        {/* ═══════════ FAQ ═══════════ */}
        <section className="container-default pb-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.65rem] font-bold tracking-[0.14em] uppercase">
                <HelpCircle size={11} />
                FAQ
              </span>
              <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-ink-700 tracking-tight">
                Questions fréquentes
              </h2>
              <p className="mt-2 text-ink-500 text-[0.95rem]">
                Vous trouverez peut-être votre réponse ici, plus rapidement.
              </p>
            </div>

            <div className="space-y-3">
              {FAQ.map((item, i) => (
                <details
                  key={i}
                  className="group bg-white rounded-2xl border border-ink-100 hover:border-brand-200 transition-colors overflow-hidden"
                >
                  <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none">
                    <span className="font-bold text-ink-700 text-[0.95rem] flex-1">{item.q}</span>
                    <span className="w-7 h-7 rounded-full bg-ink-50 group-hover:bg-brand-50 group-open:bg-brand-500 group-open:text-white text-ink-500 flex items-center justify-center transition-all flex-shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" className="group-open:rotate-45 transition-transform">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-5 pb-5 -mt-1 text-ink-500 text-[0.92rem] leading-relaxed border-t border-ink-50 pt-4">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>

            {/* CTA résiduel */}
            <div className="mt-10 text-center bg-gradient-to-br from-brand-50/60 via-white to-brand-50/40 rounded-3xl border border-brand-100 p-8">
              <h3 className="text-xl font-extrabold text-ink-700">Vous ne trouvez pas la réponse ?</h3>
              <p className="text-ink-500 mt-2 text-[0.94rem]">
                Notre équipe support est là pour vous aider · réponse sous 24h.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="mailto:contact@bisecco.fr"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-bold shadow-[0_8px_20px_-4px_rgba(240,122,47,0.45)] hover:-translate-y-0.5 transition-all"
                >
                  <Send size={15} strokeWidth={2.4} />
                  Écrire un email
                </a>
                <Link
                  href="/aide"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-ink-200 text-ink-700 font-bold hover:border-brand-500 hover:text-brand-500 transition"
                >
                  <HelpCircle size={15} strokeWidth={2.4} />
                  Centre d&apos;aide
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
