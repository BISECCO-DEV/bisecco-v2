/**
 * Villes prioritaires pour le SEO programmatique.
 *
 * Zone géographique cible : MEAUX + EST FRANCILIEN.
 * Cœur : Seine-et-Marne (Brie, vallée de la Marne, Marne-la-Vallée). Extension
 * Phase 2 : couloir Meaux → Paris (Seine-Saint-Denis), Val-d'Oise est
 * (Argenteuil, Sarcelles…) et Oise limitrophe (Senlis).
 *
 * Stratégie : on étend par cercles concentriques depuis Meaux, en restant sur
 * l'Est/Nord francilien (cohérence géographique). On NE couvre PAS toute l'IDF
 * tant qu'il n'y a pas d'artisans : densité + contenu unique > volume de pages
 * vides (qui se feraient pénaliser par Google).
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

  // ═══════════ Marne-la-Vallée élargie (77) ═══════════
  {
    slug: "vaires-sur-marne",
    name: "Vaires-sur-Marne",
    department: "77",
    postalCode: "77360",
    latitude: 48.8736,
    longitude: 2.6406,
    population: 13000,
    localContext: {
      typeLogement: "pavillons, résidences récentes, habitat en bord de Marne",
      geographie: "commune en bord de Marne, base nautique olympique, RER A",
      specificites: "secteur résidentiel en croissance, mix neuf et rénovation de pavillons",
    },
    nearbyVilles: ["chelles", "noisiel", "champs-sur-marne", "torcy"],
  },
  {
    slug: "champs-sur-marne",
    name: "Champs-sur-Marne",
    department: "77",
    postalCode: "77420",
    latitude: 48.8556,
    longitude: 2.6019,
    population: 26000,
    localContext: {
      typeLogement: "copropriétés, résidences étudiantes, pavillons du vieux village (Cité Descartes)",
      geographie: "pôle scientifique de Marne-la-Vallée, château de Champs, RER A",
      specificites: "demande étudiante et résidentielle, rénovation des copropriétés des années 80",
    },
    nearbyVilles: ["noisiel", "torcy", "vaires-sur-marne", "noisy-le-grand"],
  },
  {
    slug: "noisiel",
    name: "Noisiel",
    department: "77",
    postalCode: "77186",
    latitude: 48.8556,
    longitude: 2.6253,
    population: 16000,
    localContext: {
      typeLogement: "résidences de ville nouvelle, pavillons, logements réhabilités",
      geographie: "ville nouvelle de Marne-la-Vallée, site historique de la chocolaterie Menier",
      specificites: "réhabilitation du parc des années 80, demande résidentielle soutenue",
    },
    nearbyVilles: ["champs-sur-marne", "torcy", "vaires-sur-marne"],
  },
  {
    slug: "thorigny-sur-marne",
    name: "Thorigny-sur-Marne",
    department: "77",
    postalCode: "77400",
    latitude: 48.8825,
    longitude: 2.7100,
    population: 11000,
    localContext: {
      typeLogement: "maisons de coteaux, pavillons, habitat en bord de Marne",
      geographie: "commune en surplomb de la Marne, face à Lagny, RER E",
      specificites: "patrimoine de coteaux, rénovation et extension de pavillons",
    },
    nearbyVilles: ["lagny-sur-marne", "chelles", "vaires-sur-marne"],
  },
  {
    slug: "roissy-en-brie",
    name: "Roissy-en-Brie",
    department: "77",
    postalCode: "77680",
    latitude: 48.7906,
    longitude: 2.6539,
    population: 23000,
    localContext: {
      typeLogement: "pavillons en lotissement, résidences, maisons de ville",
      geographie: "ville résidentielle de la Brie, étangs et forêt Notre-Dame, RER E",
      specificites: "marché pavillonnaire actif, rénovation et aménagement extérieur",
    },
    nearbyVilles: ["ozoir-la-ferriere", "pontault-combault", "torcy"],
  },
  {
    slug: "ozoir-la-ferriere",
    name: "Ozoir-la-Ferrière",
    department: "77",
    postalCode: "77330",
    latitude: 48.7725,
    longitude: 2.6772,
    population: 21000,
    localContext: {
      typeLogement: "pavillons avec jardin, lotissements arborés, maisons individuelles",
      geographie: "ville-jardin de la Brie boisée, forêt d'Armainvilliers, RER E",
      specificites: "tissu pavillonnaire de qualité, demande de rénovation et d'extension",
    },
    nearbyVilles: ["roissy-en-brie", "pontault-combault"],
  },
  {
    slug: "chessy",
    name: "Chessy",
    department: "77",
    postalCode: "77700",
    latitude: 48.8881,
    longitude: 2.7831,
    population: 6000,
    localContext: {
      typeLogement: "résidences récentes du Val d'Europe, pavillons neufs, programmes en construction",
      geographie: "commune de Marne-la-Vallée, secteur Val d'Europe et Disneyland, RER A",
      specificites: "forte dynamique du neuf et de la personnalisation, secteur en plein essor",
    },
    nearbyVilles: ["bussy-saint-georges", "torcy", "lagny-sur-marne"],
  },
  {
    slug: "melun",
    name: "Melun",
    department: "77",
    postalCode: "77000",
    latitude: 48.5392,
    longitude: 2.6603,
    population: 40000,
    localContext: {
      typeLogement: "appartements de centre-ville, hôtels particuliers, pavillons de quartiers",
      geographie: "préfecture de Seine-et-Marne, sur la Seine, île Saint-Étienne médiévale",
      specificites: "patrimoine ancien à entretenir, forte demande de rénovation de centre-ville",
    },
    nearbyVilles: ["pontault-combault", "ozoir-la-ferriere"],
  },
  {
    slug: "provins",
    name: "Provins",
    department: "77",
    postalCode: "77160",
    latitude: 48.5594,
    longitude: 3.2989,
    population: 11000,
    localContext: {
      typeLogement: "maisons médiévales de la ville haute, pavillons de la ville basse, fermes briardes",
      geographie: "cité médiévale classée UNESCO, à l'est de la Seine-et-Marne",
      specificites: "patrimoine protégé (ABF), restauration pierre et charpente, savoir-faire ancien",
    },
    nearbyVilles: ["coulommiers", "melun"],
  },

  // ═══════════ Couloir Meaux → Paris · Seine-Saint-Denis (93) ═══════════
  {
    slug: "noisy-le-grand",
    name: "Noisy-le-Grand",
    department: "93",
    postalCode: "93160",
    latitude: 48.8485,
    longitude: 2.5527,
    population: 69000,
    localContext: {
      typeLogement: "copropriétés du Mont d'Est, résidences modernes, pavillons des quartiers anciens",
      geographie: "porte ouest de la Seine-et-Marne sur la Marne, quartier d'affaires, RER A/E",
      specificites: "rénovation des copropriétés des années 80, demande résidentielle et tertiaire",
    },
    nearbyVilles: ["neuilly-sur-marne", "champs-sur-marne", "chelles", "vaires-sur-marne"],
  },
  {
    slug: "neuilly-sur-marne",
    name: "Neuilly-sur-Marne",
    department: "93",
    postalCode: "93330",
    latitude: 48.8536,
    longitude: 2.5436,
    population: 35000,
    localContext: {
      typeLogement: "pavillons, résidences en bord de Marne, écoquartier Maison-Blanche",
      geographie: "ville en bord de Marne à l'est de Paris, base de loisirs",
      specificites: "secteur en rénovation urbaine, demande de neuf et de réhabilitation",
    },
    nearbyVilles: ["noisy-le-grand", "gagny", "chelles"],
  },
  {
    slug: "gagny",
    name: "Gagny",
    department: "93",
    postalCode: "93220",
    latitude: 48.8814,
    longitude: 2.5300,
    population: 40000,
    localContext: {
      typeLogement: "pavillons individuels, lotissements, petits collectifs",
      geographie: "ville pavillonnaire de l'est parisien, coteaux de l'Aulnoye",
      specificites: "tissu pavillonnaire dense, forte demande de rénovation et d'extension",
    },
    nearbyVilles: ["neuilly-sur-marne", "le-raincy", "chelles", "montfermeil"],
  },
  {
    slug: "le-raincy",
    name: "Le Raincy",
    department: "93",
    postalCode: "93340",
    latitude: 48.8983,
    longitude: 2.5236,
    population: 14500,
    localContext: {
      typeLogement: "hôtels particuliers, villas bourgeoises, maisons de maître",
      geographie: "ville résidentielle cossue, patrimoine de l'église Notre-Dame en béton",
      specificites: "bâti de qualité, exigence de finitions, restauration de maisons anciennes",
    },
    nearbyVilles: ["gagny", "montfermeil", "livry-gargan"],
  },
  {
    slug: "montfermeil",
    name: "Montfermeil",
    department: "93",
    postalCode: "93370",
    latitude: 48.8983,
    longitude: 2.5644,
    population: 27000,
    localContext: {
      typeLogement: "pavillons, ensembles collectifs, lotissements en coteaux",
      geographie: "plateau de l'est parisien, panoramas sur la vallée de la Marne",
      specificites: "rénovation urbaine ANRU, demande pavillonnaire soutenue",
    },
    nearbyVilles: ["le-raincy", "gagny", "chelles"],
  },
  {
    slug: "livry-gargan",
    name: "Livry-Gargan",
    department: "93",
    postalCode: "93190",
    latitude: 48.9189,
    longitude: 2.5392,
    population: 46000,
    localContext: {
      typeLogement: "pavillons individuels, petits immeubles, copropriétés",
      geographie: "ville pavillonnaire au nord-est de Paris, tramway T4",
      specificites: "tissu pavillonnaire majoritaire, rénovation énergétique très demandée",
    },
    nearbyVilles: ["le-raincy", "sevran", "aulnay-sous-bois"],
  },
  {
    slug: "aulnay-sous-bois",
    name: "Aulnay-sous-Bois",
    department: "93",
    postalCode: "93600",
    latitude: 48.9347,
    longitude: 2.4936,
    population: 86000,
    localContext: {
      typeLogement: "pavillons du quartier sud, grands ensembles au nord, zones d'activité",
      geographie: "grande ville de Seine-Saint-Denis, RER B, parc Ballanger",
      specificites: "marché vaste et varié, du pavillon à la copropriété, demande forte",
    },
    nearbyVilles: ["sevran", "livry-gargan", "tremblay-en-france"],
  },
  {
    slug: "sevran",
    name: "Sevran",
    department: "93",
    postalCode: "93270",
    latitude: 48.9403,
    longitude: 2.5267,
    population: 51000,
    localContext: {
      typeLogement: "pavillons, copropriétés, ensembles en rénovation",
      geographie: "ville du nord-est francilien sur le canal de l'Ourcq, RER B",
      specificites: "rénovation urbaine en cours, demande résidentielle mixte",
    },
    nearbyVilles: ["aulnay-sous-bois", "livry-gargan", "tremblay-en-france"],
  },
  {
    slug: "tremblay-en-france",
    name: "Tremblay-en-France",
    department: "93",
    postalCode: "93290",
    latitude: 48.9519,
    longitude: 2.5678,
    population: 37000,
    localContext: {
      typeLogement: "pavillons du Vieux-Pays, résidences du Vert-Galant, zones logistiques",
      geographie: "commune proche de Roissy CDG, entre village et zones d'activité",
      specificites: "demande BtoB (logistique aéroportuaire) et pavillonnaire résidentielle",
    },
    nearbyVilles: ["sevran", "aulnay-sous-bois", "mitry-mory", "villeparisis"],
  },

  // ═══════════ Val-d'Oise est (couloir Roissy / boucle de Seine) ═══════════
  {
    slug: "argenteuil",
    name: "Argenteuil",
    department: "95",
    postalCode: "95100",
    latitude: 48.9474,
    longitude: 2.2474,
    population: 110000,
    localContext: {
      typeLogement: "immeubles modernes, copropriétés des années 60-70, pavillons et maisons de ville",
      geographie: "boucle de la Seine, à 12 km au nord-ouest de Paris, ville dense",
      specificites: "3e ville d'Île-de-France, parc immobilier varié, demande de rénovation très soutenue",
    },
    nearbyVilles: ["sarcelles", "garges-les-gonesse", "gonesse"],
  },
  {
    slug: "sarcelles",
    name: "Sarcelles",
    department: "95",
    postalCode: "95200",
    latitude: 48.9956,
    longitude: 2.3786,
    population: 58000,
    localContext: {
      typeLogement: "grands ensembles emblématiques, pavillons du village, copropriétés",
      geographie: "ville du Val-d'Oise, berceau du grand ensemble, RER D",
      specificites: "réhabilitation de copropriétés et rénovation énergétique très demandées",
    },
    nearbyVilles: ["garges-les-gonesse", "gonesse", "argenteuil"],
  },
  {
    slug: "garges-les-gonesse",
    name: "Garges-lès-Gonesse",
    department: "95",
    postalCode: "95140",
    latitude: 48.9728,
    longitude: 2.4071,
    population: 41000,
    localContext: {
      typeLogement: "ensembles collectifs, pavillons des quartiers résidentiels, copropriétés",
      geographie: "nord-est parisien, proche de l'aéroport du Bourget, axe A1",
      specificites: "rénovation urbaine ANRU, réhabilitation de copropriétés et de parc social",
    },
    nearbyVilles: ["sarcelles", "gonesse", "argenteuil"],
  },
  {
    slug: "gonesse",
    name: "Gonesse",
    department: "95",
    postalCode: "95500",
    latitude: 48.9872,
    longitude: 2.4486,
    population: 26000,
    localContext: {
      typeLogement: "pavillons, grands ensembles, zones d'activité proches Roissy et Le Bourget",
      geographie: "ville du Val-d'Oise entre Roissy et Le Bourget, plaine de France",
      specificites: "demande mixte résidentielle et BtoB, rénovation du parc collectif",
    },
    nearbyVilles: ["sarcelles", "garges-les-gonesse", "tremblay-en-france"],
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
