/**
 * Pool de sujets rotatifs pour la publication automatique quotidienne.
 *
 * Utilisé par l'agent cron Bisecco. Chaque jour, l'agent prend le sujet
 * dont l'index = (jour de l'année % nombre de sujets) pour assurer une
 * rotation déterministe (pas de redoublons, pas de jours sans contenu).
 *
 * Deux pools :
 *  - FIL_TOPICS : 50 sujets courts pour posts du fil (200-400 mots)
 *  - BLOG_TOPICS : 30 sujets longs pour articles blog (1000-1500 mots)
 */

export type AutoPublishTopic = {
  /** Slug court (utilisé pour éviter les doublons et tracker) */
  slug: string;
  /** Titre ou angle du sujet */
  title: string;
  /** Mots-clés SEO à intégrer naturellement */
  keywords: string[];
  /** Type de post pour le fil */
  kind?: "conseil" | "question" | "realisation";
  /** Métier ciblé (slug en DB) si applicable */
  metierSlug?: string;
};

// ─────────────────── BLOG TOPICS (longue forme, 1000-1500 mots) ───────────────────
export const BLOG_TOPICS: AutoPublishTopic[] = [
  { slug: "verifier-siren-artisan-2026", title: "Comment vérifier le SIREN d'un artisan en 2026 : guide pratique", keywords: ["SIREN artisan", "vérifier SIREN", "artisan vérifié"] },
  { slug: "maprimerenov-conditions-2026", title: "MaPrimeRénov' 2026 : conditions, montants et démarches", keywords: ["MaPrimeRénov", "aide rénovation", "RGE"] },
  { slug: "assurance-decennale-comprendre", title: "L'assurance décennale : ce que tout particulier doit savoir avant d'engager un artisan", keywords: ["assurance décennale", "garantie travaux", "artisan obligation"] },
  { slug: "pompe-a-chaleur-prix-installation", title: "Pompe à chaleur air/eau : prix, installation et aides 2026", keywords: ["pompe à chaleur", "PAC air eau", "prix installation"] },
  { slug: "renover-salle-de-bains-budget", title: "Rénover sa salle de bains : budget, étapes et durée", keywords: ["rénovation salle de bains", "prix salle de bains", "douche italienne"] },
  { slug: "label-rge-artisan-explications", title: "Label RGE : à quoi sert-il et comment vérifier qu'un artisan l'a vraiment", keywords: ["RGE", "qualibat", "label artisan"] },
  { slug: "devis-travaux-comment-comparer", title: "Comparer 3 devis travaux : la checklist pour ne pas se faire avoir", keywords: ["comparer devis", "devis travaux", "estimation chantier"] },
  { slug: "isolation-combles-prix", title: "Isolation des combles perdus : prix, méthodes et aides en 2026", keywords: ["isolation combles", "isolation thermique", "MaPrimeRénov"] },
  { slug: "fenetres-pvc-bois-alu-comparatif", title: "Fenêtres PVC, bois ou alu : le comparatif honnête pour choisir", keywords: ["fenêtres PVC", "menuiserie alu", "fenêtre bois"] },
  { slug: "borne-recharge-vehicule-electrique", title: "Borne de recharge VE à domicile : installation, prix et aides", keywords: ["borne recharge", "IRVE", "véhicule électrique"] },
  { slug: "ouverture-mur-porteur-prix", title: "Ouverture de mur porteur : prix, démarches et précautions", keywords: ["mur porteur", "IPN", "extension maison"] },
  { slug: "ravalement-facade-quand-comment", title: "Ravalement de façade : obligation légale, prix et démarches", keywords: ["ravalement façade", "rénovation extérieure", "DP travaux"] },
  { slug: "extension-maison-prix-m2", title: "Extension de maison : prix au m², démarches et délais en 2026", keywords: ["extension maison", "agrandissement", "permis construire"] },
  { slug: "depannage-plomberie-urgence-prix", title: "Dépannage plomberie en urgence : quel prix juste payer ?", keywords: ["plombier urgence", "dépannage plomberie", "fuite eau"] },
  { slug: "chaudiere-gaz-remplacement-aides", title: "Remplacer sa chaudière gaz : alternatives, aides et calendrier", keywords: ["chaudière gaz", "remplacement chaudière", "interdiction gaz"] },
  { slug: "poele-granules-installation-tarifs", title: "Installer un poêle à granulés : prix, normes et entretien", keywords: ["poêle granulés", "chauffage bois", "DTU 24.1"] },
  { slug: "tatouage-artisan-choisir-tatoueur", title: "Comment choisir son tatoueur : hygiène, style et tarifs", keywords: ["tatoueur", "tatouage hygiène", "artiste tatoueur"] },
  { slug: "cordonnier-pourquoi-faire-reparer", title: "Pourquoi faire réparer ses chaussures plutôt que d'en racheter", keywords: ["cordonnier", "réparation chaussures", "économie circulaire"] },
  { slug: "boucher-charcutier-france-tradition", title: "Boucher de quartier : les vraies différences avec la grande distribution", keywords: ["boucher artisan", "viande qualité", "circuit court"] },
  { slug: "coiffeur-domicile-tarifs-prestations", title: "Coiffeur à domicile : tarifs, prestations et bonnes pratiques", keywords: ["coiffeur domicile", "coupe femme", "balayage"] },
  { slug: "tarifs-electricien-norme-nf-c-15-100", title: "Mise aux normes électriques NF C 15-100 : ce qui change en 2026", keywords: ["NF C 15-100", "électricien", "Consuel"] },
  { slug: "demenageur-prix-prestations-comparatif", title: "Choisir un déménageur professionnel : prix, prestations, assurances", keywords: ["déménageur", "déménagement prix", "service déménagement"] },
  { slug: "esthéticienne-bien-choisir-soins", title: "Esthéticienne à domicile vs en institut : avantages et tarifs comparés", keywords: ["esthéticienne", "soins visage", "épilation"] },
  { slug: "macon-pierre-renovation-batiment-ancien", title: "Rénover une maison en pierre : maçonnerie traditionnelle vs moderne", keywords: ["maison pierre", "rénovation ancien", "maçon traditionnel"] },
  { slug: "carreleur-poser-grand-format-conseils", title: "Carrelage grand format (60×60+) : pourquoi confier la pose à un pro", keywords: ["carreleur", "grand format", "pose carrelage"] },
  { slug: "boulanger-tradition-baguette-difference", title: "Baguette tradition vs baguette classique : ce qui change vraiment", keywords: ["boulanger artisan", "baguette tradition", "pain qualité"] },
  { slug: "couvreur-quand-faire-controler-toiture", title: "Toiture : quand et pourquoi faire contrôler par un couvreur", keywords: ["couvreur", "contrôle toiture", "démoussage"] },
  { slug: "serrurier-arnaques-eviter-2026", title: "Arnaques serrurier : comment se protéger en 2026", keywords: ["serrurier arnaque", "dépannage serrure", "DGCCRF"] },
  { slug: "chauffagiste-pompe-chaleur-qualipac", title: "Pourquoi choisir un chauffagiste QualiPAC pour votre PAC", keywords: ["QualiPAC", "RGE chauffagiste", "pompe à chaleur"] },
  { slug: "menuisier-cuisine-sur-mesure-vs-standard", title: "Cuisine sur mesure vs cuisine standard : ce que ça change vraiment", keywords: ["menuisier cuisine", "cuisine sur mesure", "agencement"] },
];

// ─────────────────── FIL TOPICS (courte forme, 200-400 mots) ───────────────────
export const FIL_TOPICS: AutoPublishTopic[] = [
  { slug: "fil-astuce-fuite-robinet", title: "L'astuce méconnue pour détecter une fuite cachée chez soi", keywords: ["fuite eau", "plombier"], kind: "conseil", metierSlug: "plombier" },
  { slug: "fil-quand-appeler-electricien", title: "Quand appeler un électricien : 5 signes à ne jamais ignorer", keywords: ["électricien", "sécurité électrique"], kind: "conseil", metierSlug: "electricien" },
  { slug: "fil-choisir-peinture-piece", title: "Comment choisir la bonne peinture selon la pièce", keywords: ["peinture", "rénovation"], kind: "conseil", metierSlug: "peintre" },
  { slug: "fil-renovation-budget-piece-piece", title: "Rénover pièce par pièce : la stratégie qui marche quand le budget est serré", keywords: ["rénovation", "budget travaux"], kind: "conseil" },
  { slug: "fil-pourquoi-vérifier-siren", title: "Pourquoi vérifier le SIREN d'un artisan avant de signer un devis", keywords: ["SIREN", "artisan vérifié"], kind: "conseil" },
  { slug: "fil-demousser-toiture-fréquence", title: "Démoussage de toiture : tous les combien et pourquoi c'est urgent", keywords: ["toiture", "couvreur"], kind: "conseil", metierSlug: "couvreur" },
  { slug: "fil-changer-fenêtres-quand", title: "Changer ses fenêtres : à quels signes savoir qu'il est temps", keywords: ["fenêtres", "menuisier"], kind: "conseil", metierSlug: "menuisier" },
  { slug: "fil-rge-comprendre-importance", title: "Label RGE : pourquoi c'est crucial pour vos aides en 2026", keywords: ["RGE", "MaPrimeRénov"], kind: "conseil" },
  { slug: "fil-isolation-combles-priorité", title: "Pourquoi isoler vos combles est la priorité n°1 en rénovation", keywords: ["isolation", "combles"], kind: "conseil" },
  { slug: "fil-serrurier-arnaque-warning", title: "Serrurier en urgence : 3 réflexes pour éviter l'arnaque", keywords: ["serrurier", "arnaque"], kind: "conseil", metierSlug: "serrurier" },
  { slug: "fil-douche-italienne-points-attention", title: "Douche à l'italienne : les 4 points techniques à ne jamais négliger", keywords: ["douche italienne", "carreleur"], kind: "conseil", metierSlug: "carreleur" },
  { slug: "fil-chauffage-pompe-chaleur-realite", title: "Pompe à chaleur : ce qu'on ne vous dit pas avant l'installation", keywords: ["pompe à chaleur", "chauffagiste"], kind: "conseil", metierSlug: "chauffagiste" },
  { slug: "fil-coiffeur-couleur-attente", title: "Coloration au salon : à quoi vraiment s'attendre niveau temps et tarif", keywords: ["coiffeur", "coloration"], kind: "conseil", metierSlug: "coiffeur" },
  { slug: "fil-charpente-traitement-prevention", title: "Traitement de charpente : pourquoi le faire avant de voir des dégâts", keywords: ["charpente", "termites"], kind: "conseil" },
  { slug: "fil-coussin-trésor-tapissier", title: "Le tapissier d'ameublement : ce métier méconnu qui sauve vos meubles", keywords: ["tapissier", "rénovation mobilier"], kind: "conseil" },
  { slug: "fil-cordonnier-services-meconnu", title: "Ce que votre cordonnier peut faire que vous n'imaginez pas", keywords: ["cordonnier"], kind: "conseil" },
  { slug: "fil-boulanger-vraie-baguette", title: "Boulanger artisan : comment reconnaître une vraie baguette tradition", keywords: ["boulanger", "baguette tradition"], kind: "conseil", metierSlug: "boulanger" },
  { slug: "fil-elagage-saison-arbres", title: "Élagage : la bonne saison selon l'espèce de votre arbre", keywords: ["élagueur", "jardin"], kind: "conseil" },
  { slug: "fil-deménagement-jour-J-checklist", title: "Le jour J du déménagement : la checklist anti-stress du pro", keywords: ["déménageur", "déménagement"], kind: "conseil" },
  { slug: "fil-photographe-pro-quand-choisir", title: "Quand engager un photographe pro plutôt que faire soi-même", keywords: ["photographe"], kind: "conseil" },
  { slug: "fil-graphiste-vs-canva-difference", title: "Graphiste pro vs outils en ligne : ce qui justifie vraiment le prix", keywords: ["graphiste", "design"], kind: "conseil" },
  { slug: "fil-bijoutier-bague-fiancailles", title: "Bague de fiançailles sur mesure : pourquoi passer par un bijoutier artisan", keywords: ["bijoutier", "bague"], kind: "conseil" },
  { slug: "fil-traiteur-mariage-questions", title: "Choisir son traiteur de mariage : les 7 questions à poser absolument", keywords: ["traiteur", "mariage"], kind: "conseil" },
  { slug: "fil-paysagiste-jardin-printemps", title: "Préparer son jardin au printemps : les 5 gestes du paysagiste", keywords: ["paysagiste", "jardinage"], kind: "conseil" },
  { slug: "fil-architecte-quand-obligatoire", title: "Quand un architecte est obligatoire (et quand vous pouvez éviter)", keywords: ["architecte", "permis construire"], kind: "conseil" },
  { slug: "fil-comptable-artisan-besoin", title: "Artisan : à quel moment de votre activité prendre un expert-comptable", keywords: ["expert-comptable", "artisan"], kind: "conseil" },
  { slug: "fil-fleuriste-bouquet-mariage", title: "Bouquet de mariée : comment briefer son fleuriste pour un résultat parfait", keywords: ["fleuriste", "mariage"], kind: "conseil" },
  { slug: "fil-mecanicien-revision-essentielle", title: "Révision auto : ce qui est vraiment essentiel et ce qui est négociable", keywords: ["mécanicien", "révision auto"], kind: "conseil" },
  { slug: "fil-carrossier-rayure-reparation", title: "Petite rayure sur la carrosserie : DIY ou carrossier ?", keywords: ["carrossier", "réparation auto"], kind: "conseil" },
  { slug: "fil-savoir-faire-bisecco-mission", title: "Pourquoi Bisecco vérifie chaque artisan : notre engagement", keywords: ["Bisecco", "artisan vérifié"], kind: "conseil" },
];

/**
 * Retourne le sujet du jour selon le type et la date.
 * Index basé sur le numéro de jour de l'année → rotation déterministe.
 */
export function topicForDay(pool: AutoPublishTopic[], date: Date): AutoPublishTopic {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return pool[dayOfYear % pool.length];
}
