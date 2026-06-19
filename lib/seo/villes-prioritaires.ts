/**
 * Villes prioritaires pour le SEO programmatique.
 *
 * Zone géographique cible : MEAUX + autour de Meaux.
 * Seine-et-Marne nord/centre (Brie, vallée de la Marne, Marne-la-Vallée) +
 * Oise limitrophe (Senlis). C'est la zone réelle d'activité Bisecco.
 *
 * Stratégie : pour un site neuf et peu autoritaire, on CONCENTRE la longue
 * traîne "[métier] [ville]" sur un micro-territoire (~30 km autour de Meaux)
 * plutôt que de s'éparpiller. Densité géographique > étalement national.
 *
 * Chaque ville est combinée aux 10 métiers prioritaires pour générer des pages
 * type `/metiers/plombier/meaux`.
 *
 * Données par ville :
 *   - slug : URL-friendly (kebab-case)
 *   - name : affichage public
 *   - department : code département (77, 60…)
 *   - postalCode : code postal principal
 *   - latitude / longitude : géolocalisation (approx)
 *   - population : approx INSEE 2024 (pour priorisation contenu)
 *   - localContext : phrases-clés spécifiques pour enrichir le contenu unique
 *                    (anti-duplicate content)
 *   - nearbyVilles : slugs des villes voisines (maillage interne · doivent
 *                    exister dans cette liste pour ne pas créer de lien 404)
 */

export type VillePrioritaire = {
  slug: string;
  name: string;
  department: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  population: number;
  /** Phrases contextuelles uniques · injectées dans le contenu pour anti-duplicate */
  localContext: {
    typeLogement: string;
    geographie: string;
    specificites: string;
  };
  /** Slugs des 3-5 villes voisines pour maillage SEO (présentes dans cette liste) */
  nearbyVilles: string[];
};

export const VILLES_PRIORITAIRES: VillePrioritaire[] = [
  // ═══════════ Meaux + couronne immédiate (cœur du business) ═══════════
  {
    slug: "meaux",
    name: "Meaux",
    department: "77",
    postalCode: "77100",
    latitude: 48.9601,
    longitude: 2.8782,
    population: 56450,
    localContext: {
      typeLogement: "maisons de ville du centre historique, pavillons résidentiels, immeubles collectifs",
      geographie: "préfecture de Seine-et-Marne, Brie nord, méandre de la Marne",
      specificites: "patrimoine médiéval autour de la cathédrale, demande de rénovation continue, quartiers péri-urbains en expansion",
    },
    nearbyVilles: ["nanteuil-les-meaux", "trilport", "saint-soupplets", "claye-souilly", "crecy-la-chapelle"],
  },
  {
    slug: "nanteuil-les-meaux",
    name: "Nanteuil-lès-Meaux",
    department: "77",
    postalCode: "77100",
    latitude: 48.9261,
    longitude: 2.8847,
    population: 7600,
    localContext: {
      typeLogement: "pavillons individuels avec jardin, lotissements récents, maisons briardes",
      geographie: "commune résidentielle accolée au sud de Meaux, coteaux de la Brie",
      specificites: "forte demande sur la rénovation et l'extension de pavillons, secteur en croissance",
    },
    nearbyVilles: ["meaux", "trilport", "crecy-la-chapelle"],
  },
  {
    slug: "trilport",
    name: "Trilport",
    department: "77",
    postalCode: "77470",
    latitude: 48.9556,
    longitude: 2.9447,
    population: 4900,
    localContext: {
      typeLogement: "pavillons individuels, maisons de bourg, habitat en bord de Marne",
      geographie: "commune à l'est de Meaux, au confluent de la Marne et du Marne-canal",
      specificites: "demande artisanale de proximité, rénovation de maisons anciennes et neuf pavillonnaire",
    },
    nearbyVilles: ["meaux", "nanteuil-les-meaux", "la-ferte-sous-jouarre"],
  },
  {
    slug: "saint-soupplets",
    name: "Saint-Soupplets",
    department: "77",
    postalCode: "77165",
    latitude: 49.0500,
    longitude: 2.8333,
    population: 3286,
    localContext: {
      typeLogement: "pavillons individuels avec terrain, maisons rurales rénovées, longères briardes",
      geographie: "village de la Brie, plaine agricole, à 12 km au nord de Meaux",
      specificites: "tissu de petits professionnels locaux, demande tournée vers la rénovation et l'extension",
    },
    nearbyVilles: ["meaux", "marcilly", "dammartin-en-goele", "claye-souilly"],
  },
  {
    slug: "marcilly",
    name: "Marcilly",
    department: "77",
    postalCode: "77139",
    latitude: 49.0362,
    longitude: 2.8773,
    population: 1100,
    localContext: {
      typeLogement: "maisons individuelles, petits hameaux, propriétés rurales avec dépendances",
      geographie: "village rural au nord de Meaux, Brie nord, terres agricoles",
      specificites: "demande artisanale de proximité, rénovation de longères et de bâtisses anciennes",
    },
    nearbyVilles: ["saint-soupplets", "meaux", "dammartin-en-goele"],
  },

  // ═══════════ Vallée de la Marne / Brie (est et sud de Meaux) ═══════════
  {
    slug: "crecy-la-chapelle",
    name: "Crécy-la-Chapelle",
    department: "77",
    postalCode: "77580",
    latitude: 48.8597,
    longitude: 2.9092,
    population: 4400,
    localContext: {
      typeLogement: "maisons anciennes le long des canaux, pavillons, propriétés briardes",
      geographie: "« Venise briarde », réseau de canaux du Grand Morin, au sud-est de Meaux",
      specificites: "patrimoine bâti ancien à entretenir (humidité, pierres meulières), forte attractivité résidentielle",
    },
    nearbyVilles: ["meaux", "coulommiers", "lagny-sur-marne", "nanteuil-les-meaux"],
  },
  {
    slug: "coulommiers",
    name: "Coulommiers",
    department: "77",
    postalCode: "77120",
    latitude: 48.8156,
    longitude: 3.0875,
    population: 14800,
    localContext: {
      typeLogement: "maisons de ville en pierre meulière, pavillons résidentiels, fermes briardes",
      geographie: "capitale de la Brie des Morin, sur le Grand Morin, à 25 km au sud-est de Meaux",
      specificites: "patrimoine ancien important, demande restauration pierre et toiture, bassin de vie autonome",
    },
    nearbyVilles: ["crecy-la-chapelle", "meaux", "la-ferte-sous-jouarre"],
  },
  {
    slug: "la-ferte-sous-jouarre",
    name: "La Ferté-sous-Jouarre",
    department: "77",
    postalCode: "77260",
    latitude: 48.9486,
    longitude: 3.1264,
    population: 9500,
    localContext: {
      typeLogement: "maisons en meulière, pavillons en coteaux, habitat en bord de Marne",
      geographie: "confluent de la Marne et du Petit Morin, à l'est de Meaux, vallée encaissée",
      specificites: "patrimoine des meulières, rénovation de bâtis anciens, demande de proximité soutenue",
    },
    nearbyVilles: ["trilport", "meaux", "coulommiers"],
  },

  // ═══════════ Marne-la-Vallée (sud-ouest de Meaux) ═══════════
  {
    slug: "lagny-sur-marne",
    name: "Lagny-sur-Marne",
    department: "77",
    postalCode: "77400",
    latitude: 48.8730,
    longitude: 2.7170,
    population: 22095,
    localContext: {
      typeLogement: "appartements de centre-ville, pavillons résidentiels, maisons en pierre",
      geographie: "ville d'art et d'histoire sur la Marne, à 25 km de Paris, secteur Marne-la-Vallée",
      specificites: "patrimoine bâti ancien à entretenir, forte demande de rénovation de centre-ville",
    },
    nearbyVilles: ["chelles", "bussy-saint-georges", "torcy", "crecy-la-chapelle"],
  },
  {
    slug: "bussy-saint-georges",
    name: "Bussy-Saint-Georges",
    department: "77",
    postalCode: "77600",
    latitude: 48.8400,
    longitude: 2.7000,
    population: 27880,
    localContext: {
      typeLogement: "pavillons récents, résidences modernes, lotissements neufs",
      geographie: "ville nouvelle de Marne-la-Vallée, en forte croissance, RER A",
      specificites: "constructions neuves, finitions et personnalisations très demandées",
    },
    nearbyVilles: ["lagny-sur-marne", "torcy", "pontault-combault"],
  },
  {
    slug: "torcy",
    name: "Torcy",
    department: "77",
    postalCode: "77200",
    latitude: 48.8506,
    longitude: 2.6531,
    population: 23700,
    localContext: {
      typeLogement: "résidences de ville nouvelle, pavillons, copropriétés des années 80-90",
      geographie: "pôle de Marne-la-Vallée, base de loisirs, RER A, axe A4",
      specificites: "rénovation thermique du parc 80-90, demande résidentielle et copropriétés",
    },
    nearbyVilles: ["bussy-saint-georges", "lagny-sur-marne", "pontault-combault"],
  },
  {
    slug: "pontault-combault",
    name: "Pontault-Combault",
    department: "77",
    postalCode: "77340",
    latitude: 48.7903,
    longitude: 2.6094,
    population: 38894,
    localContext: {
      typeLogement: "pavillons en lotissement, résidences collectives modernes",
      geographie: "ville résidentielle de l'est parisien, RER E, axe A4",
      specificites: "marché actif sur la rénovation de pavillon et l'extension",
    },
    nearbyVilles: ["torcy", "bussy-saint-georges", "lagny-sur-marne"],
  },

  // ═══════════ Couloir RER B / Roissy (ouest et nord-ouest de Meaux) ═══════════
  {
    slug: "claye-souilly",
    name: "Claye-Souilly",
    department: "77",
    postalCode: "77410",
    latitude: 48.9444,
    longitude: 2.6964,
    population: 12648,
    localContext: {
      typeLogement: "pavillons résidentiels, maisons traditionnelles, lotissements récents",
      geographie: "Brie nord en bord de Beuvronne, entre Meaux et Roissy, axe RN3",
      specificites: "centre-ville en mutation, forte demande de rénovation et d'extension",
    },
    nearbyVilles: ["meaux", "villeparisis", "mitry-mory", "dammartin-en-goele"],
  },
  {
    slug: "villeparisis",
    name: "Villeparisis",
    department: "77",
    postalCode: "77270",
    latitude: 48.9472,
    longitude: 2.6092,
    population: 26240,
    localContext: {
      typeLogement: "pavillons individuels, copropriétés des années 70-90, maisons de ville",
      geographie: "Seine-et-Marne ouest, axe RER B, proximité de Roissy",
      specificites: "rénovation thermique fortement demandée sur le patrimoine 70-90",
    },
    nearbyVilles: ["chelles", "mitry-mory", "claye-souilly"],
  },
  {
    slug: "mitry-mory",
    name: "Mitry-Mory",
    department: "77",
    postalCode: "77290",
    latitude: 48.9833,
    longitude: 2.6167,
    population: 19920,
    localContext: {
      typeLogement: "pavillons et petits collectifs, zones résidentielles et industrielles",
      geographie: "proximité de l'aéroport Roissy CDG, axe A104 et RER B",
      specificites: "ville carrefour, demande mixte BtoB et résidentielle, forte mobilité",
    },
    nearbyVilles: ["villeparisis", "claye-souilly", "dammartin-en-goele"],
  },
  {
    slug: "dammartin-en-goele",
    name: "Dammartin-en-Goële",
    department: "77",
    postalCode: "77230",
    latitude: 49.0556,
    longitude: 2.6850,
    population: 9700,
    localContext: {
      typeLogement: "maisons de bourg, pavillons, propriétés rurales du plateau",
      geographie: "plateau du Multien, point haut entre Meaux et Roissy, à 18 km de Meaux",
      specificites: "demande de proximité, rénovation de maisons anciennes et neuf pavillonnaire",
    },
    nearbyVilles: ["saint-soupplets", "mitry-mory", "claye-souilly", "senlis"],
  },
  {
    slug: "chelles",
    name: "Chelles",
    department: "77",
    postalCode: "77500",
    latitude: 48.8853,
    longitude: 2.5928,
    population: 54478,
    localContext: {
      typeLogement: "pavillons individuels, petits collectifs, lotissements modernes",
      geographie: "ville résidentielle proche de Paris, bordée par la Marne, parc forestier",
      specificites: "forte croissance démographique, demande très soutenue en rénovation de pavillon",
    },
    nearbyVilles: ["villeparisis", "mitry-mory", "lagny-sur-marne", "torcy"],
  },

  // ═══════════ Oise limitrophe ═══════════
  {
    slug: "senlis",
    name: "Senlis",
    department: "60",
    postalCode: "60300",
    latitude: 49.2065,
    longitude: 2.5856,
    population: 14755,
    localContext: {
      typeLogement: "maisons en pierre du centre médiéval, manoirs périphériques, pavillons",
      geographie: "ville royale médiévale, à 30 km au nord de Meaux, forêt de Chantilly proche",
      specificites: "patrimoine architectural protégé (ABF), demande de restauration pierre et toitures",
    },
    nearbyVilles: ["dammartin-en-goele", "claye-souilly"],
  },
];

/**
 * Récupère une ville par son slug.
 */
export function getVillePrioritaire(slug: string): VillePrioritaire | null {
  return VILLES_PRIORITAIRES.find((v) => v.slug === slug) ?? null;
}

/**
 * Liste de tous les slugs (pour generateStaticParams).
 */
export function getAllVilleSlugs(): string[] {
  return VILLES_PRIORITAIRES.map((v) => v.slug);
}
