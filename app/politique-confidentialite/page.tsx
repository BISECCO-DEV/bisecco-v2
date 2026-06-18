import type { Metadata } from "next";
import { LegalLayout } from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "Politique de confidentialité · Bisecco",
  description:
    "Politique de protection des données personnelles de Bisecco · Conformité RGPD, droits utilisateurs, durée de conservation.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalLayout
      title="Politique de confidentialité"
      subtitle="AGISCO HOLDING SAS, éditrice de Bisecco, s'engage à protéger vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés."
      updatedAt="2026-05-28"
    >
      <h2>1. Responsable du traitement</h2>
      <p>
        Le responsable du traitement des données collectées sur bisecco.fr est&nbsp;:
      </p>
      <ul>
        <li><strong>AGISCO HOLDING SAS</strong></li>
        <li>Siège social&nbsp;: Cannes, France</li>
        <li>Représentée par&nbsp;: Laurent Nero, Président</li>
        <li>Contact RGPD&nbsp;: <a href="mailto:contact@bisecco.fr">contact@bisecco.fr</a></li>
      </ul>

      <h2>2. Données collectées</h2>
      <p>Bisecco collecte les catégories de données suivantes&nbsp;:</p>

      <h3>2.1 Données d&apos;inscription (professionnels et particuliers)</h3>
      <ul>
        <li>Nom, prénom</li>
        <li>Adresse email (utilisée comme identifiant de connexion)</li>
        <li>Mot de passe (chiffré via bcrypt, jamais stocké en clair)</li>
        <li>Numéro de téléphone</li>
        <li>Ville et code postal</li>
      </ul>

      <h3>2.2 Données spécifiques aux professionnels</h3>
      <ul>
        <li>Numéro SIREN/SIRET (vérifié auprès de l&apos;INSEE)</li>
        <li>Nom de la société</li>
        <li>Métier(s) exercé(s)</li>
        <li>Zone d&apos;intervention, disponibilité</li>
        <li>Photo de profil, photo de couverture, galerie de réalisations</li>
        <li>Description publique de l&apos;activité</li>
      </ul>

      <h3>2.3 Données d&apos;usage</h3>
      <ul>
        <li>Historique des messages, devis demandés et reçus</li>
        <li>Avis publiés et reçus</li>
        <li>Date et heure des connexions</li>
        <li>Adresse IP (à des fins de sécurité uniquement)</li>
      </ul>

      <h2>3. Finalités du traitement</h2>
      <p>Vos données personnelles sont collectées et traitées pour les finalités suivantes&nbsp;:</p>
      <ul>
        <li><strong>Création et gestion de votre compte</strong> sur la plateforme</li>
        <li><strong>Vérification d&apos;identité professionnelle</strong> (professionnels) via le répertoire SIRENE</li>
        <li><strong>Mise en relation</strong> entre professionnels et particuliers</li>
        <li><strong>Envoi de notifications</strong> (nouveaux messages, devis, avis reçus)</li>
        <li><strong>Modération</strong> des contenus et lutte contre la fraude</li>
        <li><strong>Amélioration du service</strong> (statistiques anonymisées)</li>
        <li><strong>Respect des obligations légales</strong> (facturation, comptabilité, conservation des contrats)</li>
      </ul>

      <h2>4. Base légale du traitement</h2>
      <p>
        Les traitements reposent sur les bases légales suivantes selon le RGPD&nbsp;:
      </p>
      <ul>
        <li><strong>Exécution du contrat</strong> (art. 6.1.b) pour la création de compte et la mise en relation</li>
        <li><strong>Consentement</strong> (art. 6.1.a) pour les communications marketing et les cookies non essentiels</li>
        <li><strong>Intérêt légitime</strong> (art. 6.1.f) pour la sécurité et la prévention de la fraude</li>
        <li><strong>Obligation légale</strong> (art. 6.1.c) pour la conservation des données comptables et fiscales</li>
      </ul>

      <h2>5. Durée de conservation</h2>
      <table>
        <thead>
          <tr>
            <th>Donnée</th>
            <th>Durée</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Compte utilisateur actif</td>
            <td>Tant que le compte est actif</td>
          </tr>
          <tr>
            <td>Compte utilisateur inactif</td>
            <td>3 ans après la dernière connexion (anonymisation ensuite)</td>
          </tr>
          <tr>
            <td>Messages et devis</td>
            <td>3 ans (preuve commerciale)</td>
          </tr>
          <tr>
            <td>Données comptables</td>
            <td>10 ans (obligation légale)</td>
          </tr>
          <tr>
            <td>Logs de connexion</td>
            <td>1 an</td>
          </tr>
          <tr>
            <td>Cookies analytics</td>
            <td>13 mois maximum</td>
          </tr>
        </tbody>
      </table>

      <h2>6. Destinataires des données</h2>
      <p>Vos données sont accessibles uniquement&nbsp;:</p>
      <ul>
        <li>Au personnel autorisé d&apos;AGISCO HOLDING SAS (modération, support)</li>
        <li>À nos sous-traitants techniques (hébergement, envoi d&apos;emails), liés par contrat RGPD</li>
        <li>Aux autorités compétentes en cas de réquisition judiciaire</li>
      </ul>
      <p>
        <strong>Vos données ne sont jamais vendues à des tiers.</strong>
      </p>

      <h2>7. Sous-traitants</h2>
      <ul>
        <li><strong>Supabase</strong> (base de données, hébergement) · Amazon Web Services région Paris (eu-west-3)</li>
        <li><strong>o2switch</strong> (hébergement applicatif) · Clermont-Ferrand, France</li>
        <li><strong>INSEE</strong> (vérification SIRENE) · données publiques uniquement</li>
      </ul>

      <h2>8. Transferts hors UE</h2>
      <p>
        Aucun transfert de vos données hors de l&apos;Union européenne. L&apos;ensemble de
        l&apos;infrastructure est localisée en France ou en région européenne AWS.
      </p>

      <h2>9. Vos droits</h2>
      <p>Conformément au RGPD, vous disposez des droits suivants&nbsp;:</p>
      <ul>
        <li><strong>Droit d&apos;accès</strong> à vos données</li>
        <li><strong>Droit de rectification</strong> en cas de données erronées</li>
        <li><strong>Droit à l&apos;effacement</strong> (&laquo;&nbsp;droit à l&apos;oubli&nbsp;&raquo;)</li>
        <li><strong>Droit d&apos;opposition</strong> au traitement</li>
        <li><strong>Droit à la portabilité</strong> de vos données (export)</li>
        <li><strong>Droit de retrait du consentement</strong> à tout moment</li>
        <li><strong>Droit de définir des directives post-mortem</strong></li>
      </ul>
      <p>
        Pour exercer ces droits, contactez-nous à{" "}
        <a href="mailto:contact@bisecco.fr">contact@bisecco.fr</a>. Nous vous répondrons
        sous <strong>30 jours maximum</strong>.
      </p>

      <h2>10. Réclamation auprès de la CNIL</h2>
      <p>
        Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une
        réclamation auprès de la Commission Nationale de l&apos;Informatique et des Libertés
        (CNIL)&nbsp;:
      </p>
      <ul>
        <li>3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07</li>
        <li><a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a></li>
      </ul>

      <h2>11. Sécurité</h2>
      <p>
        Bisecco met en œuvre les mesures techniques et organisationnelles suivantes pour
        protéger vos données&nbsp;:
      </p>
      <ul>
        <li>Chiffrement TLS 1.3 pour toutes les communications</li>
        <li>Mots de passe hachés via bcrypt</li>
        <li>Authentification déléguée via Supabase Auth</li>
        <li>Contrôle d&apos;accès basé sur les rôles (RBAC) avec Row Level Security</li>
        <li>Sauvegardes quotidiennes chiffrées</li>
        <li>Audits réguliers des accès</li>
      </ul>

      <h2>12. Cookies</h2>
      <p>
        Bisecco utilise trois catégories de cookies&nbsp;:
      </p>
      <ul>
        <li><strong>Essentiels</strong>&nbsp;: session, authentification, panier (toujours actifs)</li>
        <li><strong>Préférences</strong>&nbsp;: langue, thème, consentement cookies</li>
        <li><strong>Mesure d&apos;audience</strong>&nbsp;: optionnels, soumis à votre consentement</li>
      </ul>
      <p>
        Vous pouvez modifier vos préférences à tout moment via le bandeau en bas de page.
      </p>

      <h2>13. Modifications de la politique</h2>
      <p>
        La présente politique peut être modifiée à tout moment pour refléter les évolutions
        du service ou de la législation. Vous serez informé(e) par email de toute modification
        substantielle.
      </p>
    </LegalLayout>
  );
}
