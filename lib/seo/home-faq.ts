/**
 * Items FAQ de la homepage — extraits pour pouvoir être :
 * 1. Affichés par le composant client HomeFaq (UI accordéon)
 * 2. Sérialisés en JSON-LD FAQPage côté Server Component (visibilité crawlers)
 *
 * Schema FAQ doit être présent dans le HTML INITIAL pour être lu par Googlebot
 * et les crawlers IA — d'où l'injection au niveau Server Component plutôt que
 * dans le client component (où le `<script>` n'apparaît qu'après hydratation).
 */

export type HomeFaqCategory = "Tarifs" | "Sécurité" | "Fonctionnement" | "Données";

export type HomeFaqItem = {
  q: string;
  a: string;
  category: HomeFaqCategory;
};

export const HOME_FAQ_ITEMS: HomeFaqItem[] = [
  {
    q: "Bisecco est-il vraiment gratuit ?",
    a: "Oui, 100 % gratuit pour les particuliers et pour les professionnels. Pas de carte bancaire requise à l'inscription, pas de commission sur vos chantiers, pas de frais cachés. Les professionnels peuvent souscrire un service premium optionnel pour booster leur visibilité, mais ce n'est jamais imposé.",
    category: "Tarifs",
  },
  {
    q: "Comment vérifiez-vous les professionnels ?",
    a: "Tous les professionnels doivent fournir leur numéro SIREN à l'inscription. Nous le vérifions automatiquement via l'API officielle Sirene de l'INSEE (recherche-entreprises.api.gouv.fr). Si l'entreprise n'est pas active ou n'existe pas, l'inscription est refusée. Aucun faux profil ne passe.",
    category: "Sécurité",
  },
  {
    q: "Comment fonctionnent les avis clients ?",
    a: "Après chaque mission terminée, le particulier reçoit un email lui demandant de noter le professionnel. Seuls les vrais clients ayant échangé via la messagerie Bisecco peuvent laisser un avis. Aucune note achetée, aucune fraude possible. Les avis négatifs ne sont jamais supprimés sur demande commerciale.",
    category: "Sécurité",
  },
  {
    q: "Combien de temps pour recevoir un devis ?",
    a: "La majorité des professionnels répondent en moins de 24 heures. Vous recevez généralement 2 à 5 propositions de devis par projet. Plus votre description est précise (avec photos, surface, urgence), plus la réponse est rapide · souvent en quelques heures.",
    category: "Fonctionnement",
  },
  {
    q: "Comment se déroule la mise en relation ?",
    a: "Vous décrivez votre projet, vous recevez les devis par email et messagerie. Vous comparez, vous discutez en direct avec les professionnels qui vous intéressent, vous choisissez librement. Bisecco n'intervient jamais dans la transaction ni dans le paiement.",
    category: "Fonctionnement",
  },
  {
    q: "Bisecco prend-il une commission sur les chantiers ?",
    a: "Non, aucune commission n'est prélevée sur vos chantiers ou paiements. Vous travaillez en direct avec le professionnel, sans aucun intermédiaire financier. C'est l'engagement écrit dans nos CGV · la différence fondamentale avec les autres plateformes.",
    category: "Tarifs",
  },
  {
    q: "Mes données personnelles sont-elles sécurisées ?",
    a: "Oui. Bisecco est hébergé en France et conforme RGPD. Vos données ne sont jamais revendues à des tiers, vos échanges sont chiffrés en transit (HTTPS), et vous pouvez à tout moment exporter ou supprimer toutes vos données depuis votre espace personnel · conformément au droit à l'oubli.",
    category: "Données",
  },
  {
    q: "Que faire en cas de litige avec un professionnel ?",
    a: "Bisecco propose une médiation amiable gratuite. Contactez notre service support, nous étudions votre dossier et tentons de trouver un accord avec le professionnel. Si la médiation échoue, nous vous orientons vers le médiateur de la consommation compétent en France.",
    category: "Sécurité",
  },
];
