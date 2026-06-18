import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, Headphones } from "lucide-react";
import { ContactForm } from "./ContactForm";
import { ContactMap } from "./ContactMap";
import { JsonLd } from "@/components/ui/JsonLd";
import { CtaButton } from "@/components/ui/CtaButton";

export const metadata: Metadata = {
  title: "Contact · Réseau des professionnels français",
  description: "Contactez l'équipe Bisecco. Réponse sous 24h ouvrées. Email, chat en ligne, support 7j/7.",
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
    address: {
      "@type": "PostalAddress",
      streetAddress: "45 Boulevard de la Croisette",
      postalCode: "06400",
      addressLocality: "Cannes",
      addressCountry: "FR",
    },
  },
};

const INFO_CARDS = [
  {
    eyebrow: "Adresse",
    title: "Nous rendre visite",
    icon: MapPin,
    lines: ["45 Boulevard de la Croisette", "06400 Cannes, France"],
  },
  {
    eyebrow: "Service client",
    title: "Nous appeler",
    icon: Phone,
    lines: ["Lundi – Vendredi 9h – 18h", "Réponse rapide garantie"],
  },
  {
    eyebrow: "Écrivez-nous",
    title: "Email & contact",
    icon: Mail,
    lines: ["contact@bisecco.fr", "Réponse sous 24h ouvrées"],
  },
  {
    eyebrow: "Horaires",
    title: "Heures d'ouverture",
    icon: Clock,
    lines: ["Lun – Ven : 9h – 18h", "Samedi & Dimanche : fermé"],
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactSchema} />

      <div className="bg-sand-50">

        {/* ═══════════ HERO DARK ═══════════ */}
        <section className="relative h-[360px] sm:h-[420px] overflow-hidden">
          {/* Image de fond + overlay sombre */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=2400&h=1200&fit=crop&q=85"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-900/85 via-ink-900/70 to-ink-900/90" aria-hidden />

          <div className="relative h-full container-default flex flex-col items-center justify-center text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white text-[0.66rem] font-semibold tracking-[0.16em] uppercase backdrop-blur-sm mb-5">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-brand-400 animate-ping opacity-75" />
                <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-brand-500" />
              </span>
              Nous contacter
            </span>
            <h1 className="font-display font-semibold text-white text-[58px] sm:text-[88px] lg:text-[108px] leading-none tracking-[-0.025em]">
              Contact
            </h1>
            <p className="mt-5 text-white/70 max-w-lg text-[0.96rem] leading-relaxed">
              Une question, un besoin d&apos;accompagnement ou une suggestion ?
              L&apos;équipe Bisecco vous répond rapidement.
            </p>
          </div>
        </section>

        {/* ═══════════ INFO CARDS ═══════════ */}
        <section className="container-default pt-16 lg:pt-20 mb-16 lg:mb-24">
          <div className="text-center mb-12 lg:mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.66rem] font-bold tracking-[0.16em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" /> Infos pratiques
            </span>
            <h2 className="mt-5 font-display font-semibold text-[30px] lg:text-[44px] leading-[1.1] tracking-[-0.025em] text-ink-900">
              <span className="text-brand-500">Contact</span> & rendez-vous
            </h2>
            <p className="mt-4 text-ink-500 max-w-xl mx-auto text-[0.94rem] leading-relaxed">
              Plusieurs moyens de nous joindre, choisissez celui qui vous convient le mieux.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INFO_CARDS.map((card) => (
              <div
                key={card.eyebrow}
                className="bg-white rounded-2xl border border-sand-200 p-6 hover:border-brand-200 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(13,30,74,0.12)] transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 grid place-items-center text-brand-500 mb-4">
                  <card.icon size={20} strokeWidth={2.2} />
                </div>
                <div className="text-[0.62rem] font-bold tracking-[0.16em] uppercase text-ink-400 mb-1.5">
                  {card.eyebrow}
                </div>
                <h3 className="font-display font-semibold text-[1.1rem] tracking-tight text-brand-500 leading-tight mb-3">
                  {card.title}
                </h3>
                <div className="space-y-1 text-[0.84rem] text-ink-600 leading-relaxed">
                  {card.lines.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ DISCUTONS · illustration + form ═══════════ */}
        <section className="container-default mb-16 lg:mb-24">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-14 items-center">

            {/* Colonne illustration + floating chat card */}
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-sand-100 max-w-[500px] mx-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&h=1125&fit=crop&q=85"
                  alt="Équipe support Bisecco"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating "Chat With Live!" card */}
              <div className="absolute -left-2 lg:-left-6 top-8 lg:top-12 max-w-[210px]">
                <div className="relative bg-gradient-to-br from-brand-500 to-brand-600 rounded-3xl p-5 text-white shadow-[0_20px_40px_-12px_rgba(240,122,47,0.5)]">
                  <div className="w-12 h-12 rounded-full bg-white grid place-items-center text-brand-500 mb-3 shadow-lg">
                    <Headphones size={20} strokeWidth={2.2} />
                  </div>
                  <h3 className="font-display font-semibold text-[1.1rem] leading-tight">
                    Chat en direct
                  </h3>
                  <p className="text-white/85 text-[0.78rem] leading-relaxed mt-1.5 mb-4">
                    Discutez en direct avec notre équipe. Réponse en quelques minutes.
                  </p>
                  <CtaButton
                    href="#chatbot"
                    variant="white"
                    size="sm"
                    icon={Headphones}
                  >
                    Démarrer
                  </CtaButton>
                </div>
              </div>
            </div>

            {/* Colonne formulaire */}
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.66rem] font-bold tracking-[0.16em] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500" /> Formulaire
              </span>
              <h2 className="mt-5 font-display font-semibold text-[30px] lg:text-[44px] leading-[1.1] tracking-[-0.025em] text-ink-900">
                <span className="text-brand-500">Écrivez-nous</span><br />
                & on vous répond.
              </h2>
              <p className="mt-4 text-ink-500 text-[0.94rem] leading-relaxed mb-7">
                Remplissez le formulaire ci-dessous et notre équipe vous répond
                sous <strong className="text-ink-900">24 heures ouvrées</strong>.
              </p>

              <ContactForm />
            </div>
          </div>
        </section>

        {/* ═══════════ MAP FULL-WIDTH ═══════════ */}
        <section className="relative h-[400px] sm:h-[480px] w-full overflow-hidden border-t border-sand-200">
          <ContactMap />
        </section>
      </div>
    </>
  );
}
