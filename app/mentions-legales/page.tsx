import type { Metadata } from "next";
import { LegalLayout } from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "Mentions légales · Bisecco",
  description:
    "Mentions légales de Bisecco · Éditeur, hébergeur, propriété intellectuelle, contact.",
};

export default function MentionsLegalesPage() {
  return (
    <LegalLayout
      title="Mentions légales"
      subtitle="Informations légales concernant l'éditeur du site bisecco.fr, conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique."
      updatedAt="2026-05-28"
    >
      <h2>1. Éditeur du site</h2>
      <p>
        Le site <strong>bisecco.fr</strong> est édité par&nbsp;:
      </p>
      <ul>
        <li><strong>Raison sociale&nbsp;:</strong> AGISCO HOLDING SAS</li>
        <li><strong>Forme juridique&nbsp;:</strong> Société par actions simplifiée</li>
        <li><strong>Capital social&nbsp;:</strong> 1 000 €</li>
        <li><strong>Siège social&nbsp;:</strong> 45 Boulevard de la Croisette, 06400 Cannes, France</li>
        <li><strong>RCS&nbsp;:</strong> Cannes 750 463 317</li>
        <li><strong>SIREN&nbsp;:</strong> 750 463 317</li>
        <li><strong>Numéro de TVA intracommunautaire&nbsp;:</strong> FR 27 750463317</li>
        <li><strong>Email de contact&nbsp;:</strong> <a href="mailto:contact@bisecco.fr">contact@bisecco.fr</a></li>
      </ul>

      <h2>2. Directeur de la publication</h2>
      <p>
        Monsieur <strong>Laurent Nero</strong>, Président d&apos;AGISCO HOLDING SAS.
      </p>

      <h2>3. Hébergeur</h2>
      <p>
        Le site est hébergé par&nbsp;:
      </p>
      <ul>
        <li><strong>Société&nbsp;:</strong> o2switch SAS</li>
        <li><strong>Adresse&nbsp;:</strong> Chemin des Pardiaux, 63000 Clermont-Ferrand, France</li>
        <li><strong>RCS Clermont-Ferrand&nbsp;:</strong> 510 909 807</li>
        <li><strong>Téléphone&nbsp;:</strong> +33 (0)4 44 44 60 40</li>
        <li><strong>Site web&nbsp;:</strong> <a href="https://www.o2switch.fr" target="_blank" rel="noopener noreferrer">o2switch.fr</a></li>
      </ul>
      <p>
        Les données utilisateurs sont stockées sur des serveurs Supabase (Amazon Web Services,
        région Europe · Paris&nbsp;: eu-west-3) afin de garantir la conformité RGPD et la
        résidence européenne des données.
      </p>

      <h2>4. Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble du contenu présent sur le site bisecco.fr (textes, logos, images,
        graphismes, vidéos, base de données métiers, code source) est la propriété exclusive
        d&apos;AGISCO HOLDING SAS, ou fait l&apos;objet d&apos;une autorisation d&apos;utilisation.
        Toute reproduction, représentation, modification, publication, adaptation ou exploitation
        de tout ou partie des éléments du site, par quelque procédé que ce soit et sur quelque
        support que ce soit, est interdite sans autorisation écrite préalable.
      </p>
      <p>
        La marque <strong>Bisecco</strong> et son logo sont des marques d&apos;AGISCO HOLDING SAS.
        Toute reproduction non autorisée constitue une contrefaçon sanctionnée par les articles
        L.335-2 et suivants du Code de la propriété intellectuelle.
      </p>

      <h2>5. Données personnelles</h2>
      <p>
        Le traitement des données personnelles est détaillé dans notre{" "}
        <a href="/politique-confidentialite">politique de confidentialité</a>. Conformément au
        Règlement Général sur la Protection des Données (RGPD), vous disposez d&apos;un droit
        d&apos;accès, de rectification, d&apos;opposition, d&apos;effacement et de portabilité
        de vos données personnelles.
      </p>

      <h2>6. Cookies</h2>
      <p>
        Le site bisecco.fr utilise des cookies strictement nécessaires à son fonctionnement
        (session, authentification) ainsi que des cookies de mesure d&apos;audience (avec
        votre consentement). Vous pouvez gérer vos préférences via le bandeau cookies présent
        en bas de page.
      </p>

      <h2>7. Vérification SIREN des artisans</h2>
      <p>
        Bisecco vérifie automatiquement l&apos;inscription au répertoire SIRENE de l&apos;INSEE
        de chaque artisan inscrit sur la plateforme. Cette vérification est réalisée en temps
        réel via l&apos;API publique de l&apos;INSEE et permet d&apos;attribuer le badge
        &laquo;&nbsp;Vérifié SIREN&nbsp;&raquo;.
      </p>

      <h2>8. Limite de responsabilité</h2>
      <p>
        Bisecco est un service de mise en relation. La société AGISCO HOLDING SAS n&apos;est
        partie à aucune relation contractuelle entre les artisans et les particuliers utilisant
        la plateforme. Elle ne saurait être tenue responsable des prestations, devis, travaux,
        litiges ou paiements intervenant entre ces parties.
      </p>

      <h2>9. Droit applicable et juridiction</h2>
      <p>
        Le site bisecco.fr est régi par le droit français. Tout litige relatif à son
        utilisation relève de la compétence exclusive des tribunaux français.
      </p>

      <h2>10. Contact</h2>
      <p>
        Pour toute question relative aux présentes mentions légales ou au fonctionnement du
        site, vous pouvez nous contacter par email à{" "}
        <a href="mailto:contact@bisecco.fr">contact@bisecco.fr</a> ou via la{" "}
        <a href="/contact">page contact</a>.
      </p>
    </LegalLayout>
  );
}
