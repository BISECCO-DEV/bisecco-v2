import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de remboursement & litiges",
  description: "Politique de remboursement et de résolution des litiges entre particuliers et artisans sur la plateforme Bisecco.",
};

export default function RemboursementPage() {
  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="container-default py-16 max-w-3xl">
        <h1 className="text-3xl font-bold text-ink-700">Politique de remboursement & litiges</h1>
        <p className="text-ink-400 mt-3 text-sm">Dernière mise à jour : 14 mai 2026</p>

        <div className="mt-8 space-y-6 text-ink-600 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-ink-700 mb-2">Remboursement des abonnements artisans</h2>
            <p>Conformément à l&apos;article L221-28 du Code de la consommation, en tant que professionnel, vous ne disposez pas du droit de rétractation. Néanmoins, en cas d&apos;insatisfaction durant les 14 premiers jours, contactez notre support pour étudier un remboursement à titre commercial.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-ink-700 mb-2">Litiges entre particulier et artisan</h2>
            <p>Bisecco est un service de mise en relation et n&apos;est pas partie aux contrats de prestation entre artisans et particuliers. En cas de litige, nous proposons gratuitement une médiation amiable.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-ink-700 mb-2">Médiation de la consommation</h2>
            <p>Conformément à l&apos;article L612-1 du Code de la consommation, vous pouvez recourir gratuitement au service de médiation : (à compléter avec le médiateur agréé choisi).</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-ink-700 mb-2">Contact</h2>
            <p>Support : contact@bisecco.fr</p>
          </section>
        </div>
      </div>
    </div>
  );
}
