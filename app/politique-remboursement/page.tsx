import type { Metadata } from "next";
import { LegalLayout } from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "Politique de remboursement & litiges · Bisecco",
  description:
    "Politique de remboursement et résolution des litiges sur Bisecco. Service gratuit, médiation amiable, recours légaux.",
};

export default function PolitiqueRemboursementPage() {
  return (
    <LegalLayout
      title="Politique de remboursement & litiges"
      subtitle="Bisecco étant une plateforme gratuite pour les professionnels comme pour les particuliers, cette page précise les rares cas où un remboursement peut survenir et la procédure de résolution des litiges."
      updatedAt="2026-05-28"
    >
      <h2>1. Service gratuit pour tous</h2>
      <p>
        La Plateforme Bisecco est <strong>100 % gratuite</strong>, sans abonnement ni
        commission, tant pour les professionnels que pour les particuliers. Aucun moyen de paiement
        n&apos;est demandé à l&apos;inscription.
      </p>
      <p>
        En conséquence, <strong>aucun remboursement n&apos;est applicable</strong> sur le
        service principal de Bisecco, qui n&apos;est facturé à aucun utilisateur.
      </p>

      <h2>2. Services additionnels payants (à venir)</h2>
      <p>
        Bisecco se réserve la possibilité de proposer ultérieurement des services optionnels
        payants (ex. mise en avant premium, statistiques avancées). En cas de souscription à
        un tel service&nbsp;:
      </p>

      <h3>2.1 Droit de rétractation (particuliers)</h3>
      <p>
        Conformément aux articles L.221-18 et suivants du Code de la consommation, le
        particulier dispose d&apos;un <strong>délai de 14 jours</strong> à compter de la
        souscription pour exercer son droit de rétractation, sans avoir à se justifier ni à
        payer de pénalités. Pour exercer ce droit, il suffit d&apos;adresser un courrier ou un
        email à <a href="mailto:contact@bisecco.fr">contact@bisecco.fr</a>.
      </p>

      <h3>2.2 Pas de rétractation pour les professionnels</h3>
      <p>
        Conformément à l&apos;article L.221-3 du Code de la consommation, le droit de
        rétractation n&apos;est <strong>pas applicable aux professionnels</strong> dans le
        cadre de leur activité professionnelle. Néanmoins, en cas d&apos;insatisfaction
        manifeste durant les 14 premiers jours, Bisecco peut accorder un remboursement à
        titre commercial après étude du dossier.
      </p>

      <h3>2.3 Modalités de remboursement</h3>
      <p>
        Le remboursement est effectué dans un délai maximum de <strong>14 jours</strong> à
        compter de la demande, par le même moyen de paiement que celui utilisé lors de
        l&apos;achat, sauf accord exprès pour un autre moyen.
      </p>

      <h2>3. Litiges entre particuliers et professionnels</h2>
      <p>
        Bisecco est un service de mise en relation. AGISCO HOLDING SAS{" "}
        <strong>n&apos;est partie à aucun contrat conclu</strong> entre professionnels et
        particuliers utilisant la Plateforme. Nous ne sommes donc ni responsables des
        prestations, ni des paiements, ni des éventuels litiges commerciaux.
      </p>

      <h3>3.1 Résolution amiable encouragée</h3>
      <p>
        En cas de désaccord, nous recommandons aux parties de privilégier le dialogue direct
        via notre messagerie intégrée. La majorité des litiges trouve une issue amiable
        rapidement quand chaque partie expose calmement son point de vue.
      </p>

      <h3>3.2 Signalement à Bisecco</h3>
      <p>
        Si un comportement vous paraît contraire à nos{" "}
        <a href="/cgv">conditions générales</a> (professionnel injoignable, faux profil,
        prestation non conforme), vous pouvez signaler le problème via&nbsp;:
      </p>
      <ul>
        <li>Le bouton &laquo;&nbsp;Signaler&nbsp;&raquo; sur le profil concerné</li>
        <li>La page <a href="/signaler">/signaler</a></li>
        <li>L&apos;email <a href="mailto:contact@bisecco.fr">contact@bisecco.fr</a></li>
      </ul>
      <p>
        Notre équipe étudie chaque signalement sous 48h ouvrées et prend les mesures
        appropriées (avertissement, modération, suspension du compte).
      </p>

      <h2>4. Médiation de la consommation</h2>
      <p>
        Conformément aux articles L.611-1 et suivants du Code de la consommation, en cas de
        litige non résolu amiablement avec un professionnel, le consommateur peut recourir
        gratuitement à un médiateur de la consommation.
      </p>
      <p>
        Le médiateur compétent peut être saisi via la plateforme officielle&nbsp;:{" "}
        <a
          href="https://www.economie.gouv.fr/mediation-conso"
          target="_blank"
          rel="noopener noreferrer"
        >
          economie.gouv.fr/mediation-conso
        </a>
      </p>

      <h2>5. Garanties légales applicables aux prestations</h2>
      <p>
        Les prestations réalisées par les professionnels sont soumises aux garanties légales du Code
        civil et du Code de la construction&nbsp;:
      </p>
      <ul>
        <li><strong>Garantie de parfait achèvement</strong> (1 an, art. 1792-6 C. civ.)</li>
        <li><strong>Garantie biennale</strong> de bon fonctionnement (2 ans, art. 1792-3 C. civ.)</li>
        <li><strong>Garantie décennale</strong> pour les travaux de construction (10 ans, art. 1792 C. civ.)</li>
      </ul>
      <p>
        Ces garanties s&apos;appliquent directement entre le client et le professionnel,
        indépendamment de Bisecco.
      </p>

      <h2>6. Plateforme européenne de règlement en ligne (RLL)</h2>
      <p>
        En application de l&apos;article 14 du Règlement (UE) n° 524/2013, vous pouvez accéder
        à la plateforme européenne de règlement en ligne des litiges&nbsp;:{" "}
        <a
          href="https://ec.europa.eu/consumers/odr"
          target="_blank"
          rel="noopener noreferrer"
        >
          ec.europa.eu/consumers/odr
        </a>
      </p>

      <h2>7. Recours juridiques</h2>
      <p>
        Si la médiation n&apos;aboutit pas, les parties peuvent saisir les juridictions
        françaises compétentes. Pour les litiges de consommation inférieurs à 5 000 €, le
        tribunal de proximité est compétent.
      </p>

      <h2>8. Contact</h2>
      <p>
        Pour toute question relative à un remboursement, un litige ou une réclamation, vous
        pouvez contacter notre équipe support&nbsp;:
      </p>
      <ul>
        <li>Email&nbsp;: <a href="mailto:contact@bisecco.fr">contact@bisecco.fr</a></li>
        <li>Formulaire&nbsp;: <a href="/contact">page contact</a></li>
        <li>Adresse postale&nbsp;: AGISCO HOLDING SAS, Cannes, France</li>
      </ul>
      <p>
        Notre service support s&apos;engage à répondre sous <strong>48h ouvrées</strong>.
      </p>
    </LegalLayout>
  );
}
