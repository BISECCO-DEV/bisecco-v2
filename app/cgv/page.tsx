import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CGV · Conditions Générales de Vente",
  description: "Conditions Générales de Vente applicables aux artisans inscrits sur Bisecco. Abonnements, tarifs, résiliation, obligations.",
};

export default function CgvPage() {
  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="container-default py-16 max-w-3xl">
        <h1 className="text-3xl font-bold text-ink-700">Conditions Générales de Vente</h1>
        <p className="text-ink-400 mt-3 text-sm">Dernière mise à jour : 14 mai 2026</p>

        <div className="mt-8 space-y-6 text-ink-600 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-ink-700 mb-2">Article 1 · Objet</h2>
            <p>Les présentes CGV régissent l&apos;utilisation de la plateforme Bisecco par les artisans abonnés à un plan payant (Pro ou Premium).</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-ink-700 mb-2">Article 2 · Tarifs</h2>
            <p>Plan Pro : 19€/mois TTC. Plan Premium : 49€/mois TTC. Les tarifs s&apos;entendent toutes taxes comprises. Bisecco se réserve le droit de modifier ses tarifs avec un préavis de 30 jours.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-ink-700 mb-2">Article 3 · Durée et résiliation</h2>
            <p>L&apos;abonnement est sans engagement. Vous pouvez résilier à tout moment depuis votre espace personnel. La résiliation prend effet à la fin de la période en cours.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-ink-700 mb-2">Article 4 · Obligations de l&apos;artisan</h2>
            <p>L&apos;artisan s&apos;engage à fournir un numéro SIREN valide, des informations exactes, et à respecter la déontologie de sa profession.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-ink-700 mb-2">Article 5 · Données personnelles</h2>
            <p>Conformément au RGPD, vos données sont protégées. Voir notre <a href="/politique-confidentialite" className="text-brand-500 underline">politique de confidentialité</a>.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-ink-700 mb-2">Article 6 · Contact</h2>
            <p>Pour toute question : contact@bisecco.fr</p>
          </section>
        </div>
      </div>
    </div>
  );
}
