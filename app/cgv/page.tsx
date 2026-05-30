import type { Metadata } from "next";
import { LegalLayout } from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "CGU · Conditions Générales d'Utilisation · Bisecco",
  description:
    "Conditions Générales d'Utilisation de la plateforme Bisecco · Inscription, obligations, modération, responsabilité.",
};

export default function CgvPage() {
  return (
    <LegalLayout
      title="Conditions Générales d'Utilisation"
      subtitle="Les présentes conditions définissent les modalités d'utilisation de la plateforme Bisecco, éditée par AGISCO HOLDING SAS. L'utilisation du service implique l'acceptation pleine et entière de ces conditions."
      updatedAt="2026-05-28"
    >
      <h2>Article 1 · Objet</h2>
      <p>
        Bisecco (ci-après &laquo;&nbsp;la Plateforme&nbsp;&raquo;) est un service en ligne de mise en
        relation gratuit entre&nbsp;:
      </p>
      <ul>
        <li>Des <strong>artisans français</strong> vérifiés via leur numéro SIREN INSEE</li>
        <li>Des <strong>particuliers</strong> à la recherche de prestations artisanales</li>
      </ul>
      <p>
        La Plateforme ne perçoit <strong>aucune commission</strong> sur les transactions réalisées
        entre artisans et particuliers, et n&apos;intervient pas dans leur relation contractuelle.
      </p>

      <h2>Article 2 · Acceptation des conditions</h2>
      <p>
        L&apos;inscription sur Bisecco vaut acceptation sans réserve des présentes CGU. Les
        utilisateurs reconnaissent en avoir pris connaissance et s&apos;engagent à les respecter.
        Toute modification fera l&apos;objet d&apos;une notification par email.
      </p>

      <h2>Article 3 · Inscription et compte utilisateur</h2>

      <h3>3.1 Conditions d&apos;inscription</h3>
      <p>L&apos;inscription est gratuite et réservée&nbsp;:</p>
      <ul>
        <li>Aux personnes physiques majeures (18 ans ou plus)</li>
        <li>Aux personnes morales représentées par un dirigeant habilité</li>
        <li>Aux artisans disposant d&apos;un numéro SIREN actif</li>
      </ul>

      <h3>3.2 Vérification SIREN (artisans)</h3>
      <p>
        Lors de l&apos;inscription, le numéro SIREN est automatiquement vérifié auprès du
        répertoire SIRENE de l&apos;INSEE. Un numéro invalide, cessé ou non trouvé entraîne
        le refus de l&apos;inscription.
      </p>

      <h3>3.3 Validation administrative</h3>
      <p>
        Chaque inscription fait l&apos;objet d&apos;une validation par notre équipe sous 24h
        ouvrées. Bisecco se réserve le droit de refuser une inscription sans avoir à se justifier,
        notamment en cas&nbsp;:
      </p>
      <ul>
        <li>D&apos;informations manifestement fausses</li>
        <li>De doublons</li>
        <li>D&apos;antécédents incompatibles avec les valeurs de la Plateforme</li>
      </ul>

      <h3>3.4 Sécurité du compte</h3>
      <p>
        L&apos;utilisateur est responsable de la confidentialité de ses identifiants. Toute
        action effectuée depuis son compte est réputée provenir de lui. Toute utilisation
        frauduleuse doit être signalée immédiatement à{" "}
        <a href="mailto:contact@bisecco.fr">contact@bisecco.fr</a>.
      </p>

      <h2>Article 4 · Gratuité du service</h2>
      <p>
        Bisecco est <strong>100 % gratuit à vie</strong> pour les artisans comme pour les
        particuliers. Aucune carte bancaire n&apos;est demandée à l&apos;inscription. Aucune
        commission n&apos;est prélevée sur les missions facturées entre artisans et particuliers.
      </p>
      <p>
        AGISCO HOLDING SAS se réserve le droit de proposer ultérieurement des services additionnels
        payants (ex. mise en avant, statistiques avancées). Ces services seront strictement
        optionnels et n&apos;altéreront pas la gratuité du service de base.
      </p>

      <h2>Article 5 · Obligations des utilisateurs</h2>

      <h3>5.1 Engagements généraux</h3>
      <p>Chaque utilisateur s&apos;engage à&nbsp;:</p>
      <ul>
        <li>Fournir des informations exactes et à jour</li>
        <li>Respecter les lois et règlements en vigueur</li>
        <li>Ne pas porter atteinte à l&apos;ordre public ni aux droits de tiers</li>
        <li>Respecter les autres utilisateurs (pas d&apos;insultes, harcèlement, discrimination)</li>
        <li>Ne pas utiliser la Plateforme à des fins de prospection commerciale massive</li>
      </ul>

      <h3>5.2 Engagements spécifiques aux artisans</h3>
      <ul>
        <li>Détenir les qualifications, assurances et autorisations requises pour exercer leur métier</li>
        <li>Respecter les devis émis et les délais convenus</li>
        <li>Maintenir leur profil à jour</li>
        <li>Répondre dans des délais raisonnables aux demandes de devis</li>
      </ul>

      <h3>5.3 Contenus interdits</h3>
      <p>Sont strictement interdits&nbsp;:</p>
      <ul>
        <li>Tout contenu illicite, diffamatoire, haineux, discriminatoire</li>
        <li>Toute fausse information visant à tromper les utilisateurs</li>
        <li>Tout faux avis (achetés, frauduleux, autopromotionnels)</li>
        <li>Toute violation de droits d&apos;auteur</li>
        <li>Tout contenu publicitaire pour des services concurrents</li>
      </ul>

      <h2>Article 6 · Modération</h2>
      <p>
        Bisecco se réserve le droit de modérer, sans préavis, tout contenu (avis, photos,
        messages) ne respectant pas les présentes CGU ou la loi française. Les sanctions
        peuvent aller du retrait du contenu à la suspension définitive du compte.
      </p>
      <p>
        Tout utilisateur peut signaler un contenu inapproprié via la fonction
        &laquo;&nbsp;Signaler&nbsp;&raquo; disponible sur les profils, messages et avis.
      </p>

      <h2>Article 7 · Avis clients</h2>
      <p>
        Les avis publiés sur Bisecco doivent&nbsp;:
      </p>
      <ul>
        <li>Reposer sur une expérience réelle avec un artisan</li>
        <li>Être objectifs, honnêtes et respectueux</li>
        <li>Ne pas contenir d&apos;informations personnelles de tiers</li>
      </ul>
      <p>
        Chaque avis est modéré par notre équipe sous 24h avant publication. Les avis manifestement
        faux ou contraires aux CGU sont rejetés. L&apos;artisan concerné peut signaler tout avis
        suspect.
      </p>

      <h2>Article 8 · Limite de responsabilité</h2>
      <p>
        Bisecco est uniquement un service de mise en relation. AGISCO HOLDING SAS&nbsp;:
      </p>
      <ul>
        <li>N&apos;est partie à aucun contrat conclu entre artisans et particuliers</li>
        <li>Ne garantit pas la qualité des prestations réalisées</li>
        <li>N&apos;intervient pas dans le règlement des éventuels litiges commerciaux</li>
        <li>Ne saurait être tenue responsable de tout préjudice résultant des prestations</li>
      </ul>
      <p>
        La responsabilité d&apos;AGISCO HOLDING SAS ne pourrait être engagée que pour les
        manquements directs au présent contrat, à l&apos;exclusion de tout dommage indirect.
      </p>

      <h2>Article 9 · Suspension et résiliation</h2>

      <h3>9.1 Résiliation par l&apos;utilisateur</h3>
      <p>
        L&apos;utilisateur peut supprimer son compte à tout moment depuis ses paramètres ou en
        écrivant à <a href="mailto:contact@bisecco.fr">contact@bisecco.fr</a>. La suppression
        est effective sous 7 jours. Les données seront effacées ou anonymisées conformément à
        notre <a href="/politique-confidentialite">politique de confidentialité</a>.
      </p>

      <h3>9.2 Suspension par Bisecco</h3>
      <p>
        Bisecco peut suspendre ou supprimer tout compte sans préavis en cas de violation des
        présentes CGU, sans préjudice de poursuites éventuelles.
      </p>

      <h2>Article 10 · Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble du contenu de la Plateforme (textes, logos, design, code) est protégé
        par le droit d&apos;auteur et reste la propriété d&apos;AGISCO HOLDING SAS. Les contenus
        publiés par les utilisateurs (photos, descriptions, avis) restent leur propriété, mais
        ils accordent à Bisecco une licence non exclusive pour les afficher dans le cadre du
        service.
      </p>

      <h2>Article 11 · Force majeure</h2>
      <p>
        Bisecco ne saurait être tenu responsable d&apos;une interruption de service due à un cas
        de force majeure (panne, attaque informatique, défaillance d&apos;un sous-traitant
        critique).
      </p>

      <h2>Article 12 · Modification des CGU</h2>
      <p>
        Les présentes CGU peuvent être modifiées à tout moment. Toute modification substantielle
        sera notifiée par email avec un préavis de 30 jours. L&apos;utilisation continue du
        service après notification vaut acceptation des nouvelles conditions.
      </p>

      <h2>Article 13 · Droit applicable et juridiction</h2>
      <p>
        Les présentes CGU sont régies par le droit français. Tout litige relèvera de la
        compétence exclusive des tribunaux français. À défaut de résolution amiable, les
        parties privilégieront la médiation avant toute action contentieuse.
      </p>

      <h2>Article 14 · Médiateur de la consommation</h2>
      <p>
        Conformément aux articles L.611-1 et suivants du Code de la consommation, vous pouvez,
        en cas de litige non résolu amiablement, recourir gratuitement à un médiateur de la
        consommation. Le médiateur peut être saisi via{" "}
        <a href="https://www.economie.gouv.fr/mediation-conso" target="_blank" rel="noopener noreferrer">economie.gouv.fr/mediation-conso</a>.
      </p>

      <h2>Article 15 · Contact</h2>
      <p>
        Toute question relative aux présentes CGU peut être adressée à&nbsp;:
        <br />
        <a href="mailto:contact@bisecco.fr">contact@bisecco.fr</a>
        <br />
        AGISCO HOLDING SAS, Cannes, France.
      </p>
    </LegalLayout>
  );
}
