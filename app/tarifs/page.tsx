import type { Metadata } from "next";
import Link from "next/link";
import {
  Check, Sparkles, Shield, Users, Hammer, ArrowRight, Heart, Zap,
} from "lucide-react";
import { CtaButton } from "@/components/ui/CtaButton";
import { JsonLd } from "@/components/ui/JsonLd";

export const metadata: Metadata = {
  title: "Tarifs · 100 % gratuit pour professionnels et particuliers",
  description:
    "Bisecco est gratuit à vie pour les particuliers et les professionnels. Pas de commission sur vos chantiers, pas d'abonnement obligatoire, pas de frais cachés. Découvrez comment on tient ce modèle.",
  alternates: { canonical: "https://bisecco.fr/tarifs" },
  openGraph: {
    title: "Tarifs Bisecco · 100 % gratuit",
    description:
      "Trouver un professionnel ou être trouvé : c'est gratuit, sans commission, à vie. Pas de carte bancaire requise.",
    url: "https://bisecco.fr/tarifs",
  },
};

const FAQ_TARIFS = [
  {
    q: "Bisecco est-il vraiment gratuit pour les professionnels ?",
    a: "Oui. L'inscription, la création du profil, la réception de demandes de devis, la messagerie avec les particuliers et la collecte d'avis sont 100 % gratuites. Aucun engagement, pas de carte bancaire à fournir.",
  },
  {
    q: "Y a-t-il une commission sur les chantiers ?",
    a: "Non. Bisecco ne prend aucune commission sur les missions que vous décrochez. Vous travaillez en direct avec le particulier, le paiement vous revient intégralement.",
  },
  {
    q: "Comment Bisecco se finance alors ?",
    a: "Par un service premium optionnel pour les professionnels qui veulent booster leur visibilité (mise en avant sur les recherches, badge premium, statistiques détaillées). Ce service ne sera disponible qu'en 2027 et restera totalement facultatif.",
  },
  {
    q: "Les particuliers paient-ils quelque chose ?",
    a: "Jamais, sous aucune forme. Rechercher un professionnel, comparer les profils, demander des devis, échanger via la messagerie et publier des avis est gratuit pour les particuliers à vie.",
  },
];

export default function TarifsPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_TARIFS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="bg-white">
      <JsonLd data={faqLd} />

      {/* ─── HERO ─── */}
      <section className="relative bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-brand-500/20 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />

        <div className="container-default relative py-16 sm:py-20 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
            <Sparkles size={11} /> 100 % gratuit · 0 % commission
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mt-4 tracking-[-0.02em] leading-[1.05]">
            Bisecco est <span className="text-brand-500">gratuit pour tout le monde</span>,
            <br className="hidden sm:block" /> à vie.
          </h1>
          <p className="mt-5 text-white/75 text-lg leading-relaxed">
            Pas de carte bancaire requise. Pas de commission sur vos chantiers.
            Pas d&apos;abonnement obligatoire. Pas de frais cachés.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <CtaButton href="/inscription" variant="primary" size="md">
              Créer mon compte gratuit
            </CtaButton>
            <CtaButton href="/rechercher" variant="white" size="md">
              Trouver un professionnel
            </CtaButton>
          </div>
        </div>
      </section>

      {/* ─── 2 OFFRES SIDE-BY-SIDE ─── */}
      <section className="py-16 sm:py-24 bg-[#fafbfc]">
        <div className="container-default max-w-5xl">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Particuliers */}
            <article className="bg-white rounded-3xl border-2 border-blue-200 p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-[0.65rem] font-extrabold uppercase tracking-wider">
                <Heart size={10} /> Gratuit à vie
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 inline-flex items-center justify-center mb-4">
                <Users size={22} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-ink-700">Particuliers</h2>
              <p className="mt-2 text-ink-500 leading-relaxed text-sm">
                Trouvez un professionnel qualifié près de chez vous et demandez des devis sans dépenser un centime.
              </p>
              <div className="my-6 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-ink-900">0 €</span>
                <span className="text-ink-400 font-semibold">/ à vie</span>
              </div>
              <ul className="space-y-2.5 text-sm text-ink-600">
                <Bullet>Recherche illimitée de professionnels vérifiés SIREN</Bullet>
                <Bullet>Demandes de devis gratuites et illimitées</Bullet>
                <Bullet>Messagerie directe avec les professionnels</Bullet>
                <Bullet>Publication d&apos;avis après chaque mission</Bullet>
                <Bullet>Médiation gratuite en cas de litige</Bullet>
                <Bullet>Aucune carte bancaire requise</Bullet>
              </ul>
              <CtaButton href="/inscription" variant="primary" size="md" className="mt-6 w-full justify-center">
                Créer mon compte particulier
              </CtaButton>
            </article>

            {/* Artisans */}
            <article className="bg-white rounded-3xl border-2 border-brand-300 p-8 relative overflow-hidden shadow-[0_8px_32px_-8px_rgba(240,122,47,0.25)]">
              <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-brand-100 text-brand-700 text-[0.65rem] font-extrabold uppercase tracking-wider">
                <Sparkles size={10} /> Le plus populaire
              </div>
              <div className="w-12 h-12 rounded-2xl bg-brand-100 inline-flex items-center justify-center mb-4">
                <Hammer size={22} className="text-brand-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-ink-700">Professionnels</h2>
              <p className="mt-2 text-ink-500 leading-relaxed text-sm">
                Recevez des demandes de devis qualifiées, sans commission, sans engagement.
              </p>
              <div className="my-6 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-ink-900">0 €</span>
                <span className="text-ink-400 font-semibold">/ à vie · 0 % commission</span>
              </div>
              <ul className="space-y-2.5 text-sm text-ink-600">
                <Bullet>Profil public optimisé SEO avec photos et services</Bullet>
                <Bullet>Vérification SIREN automatique (badge Pro)</Bullet>
                <Bullet>Demandes de devis illimitées</Bullet>
                <Bullet>Messagerie directe avec les particuliers</Bullet>
                <Bullet>Collecte d&apos;avis vérifiés (anti-fraude)</Bullet>
                <Bullet>Aucune commission sur vos chantiers</Bullet>
                <Bullet>Aucun engagement, résiliable à tout moment</Bullet>
              </ul>
              <CtaButton href="/inscription" variant="primary" size="md" className="mt-6 w-full justify-center">
                Créer mon profil professionnel
              </CtaButton>
            </article>
          </div>

          {/* Pas d'engagement banner */}
          <div className="mt-8 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <Shield size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-extrabold text-emerald-900 text-sm">Engagement écrit dans nos CGV</h3>
              <p className="text-[0.85rem] text-emerald-800 mt-1 leading-relaxed">
                La gratuité totale pour les particuliers et l&apos;absence de commission pour les professionnels sont
                garanties contractuellement. Lisez-le noir sur blanc dans nos{" "}
                <Link href="/cgv" className="font-bold underline hover:no-underline">conditions générales</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── COMMENT ON SE FINANCE ─── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container-default max-w-3xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink-100 text-ink-700 text-[0.62rem] font-bold tracking-[0.14em] uppercase">
              La question qu&apos;on nous pose le plus
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-ink-700 tracking-tight">
              Mais comment Bisecco se finance ?
            </h2>
          </div>

          <div className="space-y-5 text-ink-700 leading-relaxed">
            <p>
              C&apos;est la question légitime. Voici la réponse honnête : aujourd&apos;hui, Bisecco est financé
              sur fonds propres par AGISCO HOLDING SAS, sa société éditrice basée à Cannes. L&apos;objectif des
              18 premiers mois est d&apos;atteindre une masse critique de professionnels vérifiés et de particuliers
              actifs, sans biais commercial.
            </p>
            <p>
              À horizon 2027, nous proposerons un <strong>service premium optionnel</strong> aux professionnels qui le
              souhaitent : mise en avant prioritaire dans les résultats de recherche, badge premium, statistiques
              détaillées sur leurs demandes, intégration calendrier pro. Ce service sera{" "}
              <strong>strictement facultatif</strong> : aucun professionnel ne sera désavantagé s&apos;il reste sur l&apos;offre
              gratuite. Les particuliers, eux, ne paieront jamais.
            </p>
            <p>
              Cette approche tranche avec nos concurrents — Pages Jaunes facture les fiches premium 50 à 300 €/mois,
              Habitatpresto prélève 12-25 € par lead, Allopro prend une commission de 10-15 % sur les chantiers.
              Chez Bisecco, le service de base est <strong>vraiment</strong> gratuit. Pas un freemium déguisé.
            </p>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-16 sm:py-24 bg-[#fafbfc]">
        <div className="container-default max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-ink-700">Questions fréquentes</h2>
          </div>
          <div className="space-y-3">
            {FAQ_TARIFS.map((item) => (
              <details
                key={item.q}
                className="group bg-white rounded-2xl border border-ink-100 overflow-hidden"
              >
                <summary className="cursor-pointer px-5 py-4 font-bold text-ink-700 flex items-center justify-between hover:bg-ink-50/50 transition list-none">
                  <span>{item.q}</span>
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 text-brand-700 inline-flex items-center justify-center text-xs font-extrabold group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-4 text-ink-600 text-[0.92rem] leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-brand-500 to-brand-600 text-white">
        <div className="container-default max-w-2xl text-center">
          <Zap size={40} className="mx-auto mb-4 text-white" strokeWidth={2.2} />
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Prêt à démarrer ?
          </h2>
          <p className="mt-3 text-white/90 leading-relaxed">
            Création de compte en moins de 2 minutes. Aucune carte bancaire demandée.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/inscription"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-brand-700 font-extrabold text-sm shadow-[0_8px_24px_-4px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.3)] transition"
            >
              Créer mon compte gratuit <ArrowRight size={16} />
            </Link>
            <Link
              href="/qui-sommes-nous"
              className="text-sm font-bold text-white/90 hover:text-white underline-offset-2 hover:underline"
            >
              En savoir plus sur Bisecco
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <Check size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" strokeWidth={3} />
      <span>{children}</span>
    </li>
  );
}
