/**
 * Villes prioritaires pour le SEO programmatique.
 *
 * Zone géographique cible : Côte d'Azur + arrière-pays + Provence Est.
 * Centrée autour de Cannes (siège AGISCO HOLDING SAS).
 *
 * Chaque ville sera combinée aux 10 métiers prioritaires pour générer
 * 300 pages SEO type `/metiers/plombier/cannes` ciblant la longue traîne
 * "[métier] [ville]" — c'est ~80% des recherches commerciales du secteur.
 *
 * Données par ville :
 *   - slug : URL-friendly (kebab-case)
 *   - name : affichage public
 *   - department : code département (06, 83, etc.)
 *   - postalCode : code postal principal
 *   - latitude / longitude : géolocalisation
 *   - population : approx INSEE 2024 (pour priorisation contenu)
 *   - localContext : phrases-clés spécifiques pour enrichir le contenu unique
 *                    (anti-duplicate content)
 *   - nearbyVilles : slugs des villes voisines (maillage interne)
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
    typeLogement: string; // "villas et appartements de standing"
    geographie: string;   // "front de mer méditerranéen"
    specificites: string; // "exposition aux embruns marins"
  };
  /** Slugs des 3-5 villes voisines pour maillage SEO */
  nearbyVilles: string[];
};

export const VILLES_PRIORITAIRES: VillePrioritaire[] = [
  // ═══════════ Cannes + zone immédiate ═══════════
  {
    slug: "cannes",
    name: "Cannes",
    department: "06",
    postalCode: "06400",
    latitude: 43.5528,
    longitude: 7.0174,
    population: 74285,
    localContext: {
      typeLogement: "appartements en résidence, villas de prestige et maisons de ville",
      geographie: "front de mer Croisette, collines du Suquet, quartiers résidentiels",
      specificites: "exposition aux embruns marins, climat méditerranéen humide en hiver, forte saisonnalité touristique",
    },
    nearbyVilles: ["le-cannet", "mougins", "mandelieu-la-napoule", "vallauris", "antibes"],
  },
  {
    slug: "le-cannet",
    name: "Le Cannet",
    department: "06",
    postalCode: "06110",
    latitude: 43.5764,
    longitude: 7.0186,
    population: 42158,
    localContext: {
      typeLogement: "maisons individuelles, petits collectifs et villas familiales",
      geographie: "ville résidentielle adossée à la colline, en surplomb de Cannes",
      specificites: "patrimoine architectural Belle Époque, nombreux quartiers pavillonnaires",
    },
    nearbyVilles: ["cannes", "mougins", "vallauris", "mandelieu-la-napoule"],
  },
  {
    slug: "mougins",
    name: "Mougins",
    department: "06",
    postalCode: "06250",
    latitude: 43.6000,
    longitude: 7.0000,
    population: 19948,
    localContext: {
      typeLogement: "villas avec piscine, propriétés de prestige, mas provençaux",
      geographie: "village perché provençal, domaines résidentiels en collines",
      specificites: "forte demande artisanat de luxe, restauration de patrimoine historique",
    },
    nearbyVilles: ["cannes", "le-cannet", "valbonne", "grasse", "roquefort-les-pins"],
  },
  {
    slug: "mandelieu-la-napoule",
    name: "Mandelieu-la-Napoule",
    department: "06",
    postalCode: "06210",
    latitude: 43.5466,
    longitude: 6.9355,
    population: 22669,
    localContext: {
      typeLogement: "appartements en résidence balnéaire, villas en bord de mer",
      geographie: "littoral entre mer et massif de l'Estérel, port de plaisance",
      specificites: "humidité saline, érosion façades, demande forte en climatisation",
    },
    nearbyVilles: ["cannes", "theoule-sur-mer", "auribeau-sur-siagne", "pegomas"],
  },
  {
    slug: "vallauris",
    name: "Vallauris",
    department: "06",
    postalCode: "06220",
    latitude: 43.5800,
    longitude: 7.0500,
    population: 26802,
    localContext: {
      typeLogement: "maisons traditionnelles, petits immeubles, quartier balnéaire Golfe-Juan",
      geographie: "entre Cannes et Antibes, façade maritime et arrière-pays",
      specificites: "patrimoine céramique Picasso, ateliers d'art, demande artisanat traditionnel",
    },
    nearbyVilles: ["cannes", "antibes", "le-cannet", "biot"],
  },

  // ═══════════ Antibes + Sophia-Antipolis ═══════════
  {
    slug: "antibes",
    name: "Antibes",
    department: "06",
    postalCode: "06600",
    latitude: 43.5808,
    longitude: 7.1239,
    population: 73798,
    localContext: {
      typeLogement: "appartements anciens dans la vieille ville, villas Cap d'Antibes, résidences modernes",
      geographie: "port Vauban, vieille ville fortifiée, Cap d'Antibes résidentiel",
      specificites: "rénovation de bâtis anciens, demande spécialiste pierre et fer forgé",
    },
    nearbyVilles: ["vallauris", "biot", "juan-les-pins", "villeneuve-loubet"],
  },
  {
    slug: "juan-les-pins",
    name: "Juan-les-Pins",
    department: "06",
    postalCode: "06160",
    latitude: 43.5675,
    longitude: 7.1059,
    population: 17500,
    localContext: {
      typeLogement: "appartements de standing en bord de mer, villas pieds dans l'eau",
      geographie: "station balnéaire de la Côte d'Azur, pinède, plages de sable",
      specificites: "forte demande saisonnière, entretien piscines et climatisation",
    },
    nearbyVilles: ["antibes", "cap-d-antibes", "biot", "vallauris"],
  },
  {
    slug: "biot",
    name: "Biot",
    department: "06",
    postalCode: "06410",
    latitude: 43.6303,
    longitude: 7.0925,
    population: 9772,
    localContext: {
      typeLogement: "villas, mas provençaux, lotissements résidentiels",
      geographie: "village perché entre Antibes et Sophia-Antipolis",
      specificites: "patrimoine verrerie d'art, ateliers traditionnels, demande forte rénovation",
    },
    nearbyVilles: ["antibes", "valbonne", "villeneuve-loubet", "vallauris"],
  },
  {
    slug: "valbonne",
    name: "Valbonne",
    department: "06",
    postalCode: "06560",
    latitude: 43.6403,
    longitude: 7.0080,
    population: 13352,
    localContext: {
      typeLogement: "villas modernes, résidences haut de gamme, propriétés en bois",
      geographie: "Sophia-Antipolis, technopole et villages typiques",
      specificites: "clientèle internationale et cadres tech, exigence qualité haut de gamme",
    },
    nearbyVilles: ["mougins", "biot", "antibes", "grasse", "roquefort-les-pins"],
  },
  {
    slug: "roquefort-les-pins",
    name: "Roquefort-les-Pins",
    department: "06",
    postalCode: "06330",
    latitude: 43.6597,
    longitude: 7.0011,
    population: 7137,
    localContext: {
      typeLogement: "villas avec grands terrains, propriétés équestres",
      geographie: "arrière-pays cannois, pinèdes et coteaux",
      specificites: "entretien grands jardins, élagage, piscines, fortes superficies",
    },
    nearbyVilles: ["valbonne", "mougins", "le-rouret", "opio"],
  },

  // ═══════════ Nice + zone niçoise ═══════════
  {
    slug: "nice",
    name: "Nice",
    department: "06",
    postalCode: "06000",
    latitude: 43.7102,
    longitude: 7.2620,
    population: 343304,
    localContext: {
      typeLogement: "immeubles haussmanniens, appartements vieux Nice, résidences modernes",
      geographie: "promenade des Anglais, vieille ville, collines Cimiez et Mont Boron",
      specificites: "5e ville de France, forte densité, parc immobilier ancien, rénovation continue",
    },
    nearbyVilles: ["saint-laurent-du-var", "cagnes-sur-mer", "villefranche-sur-mer", "la-trinite"],
  },
  {
    slug: "saint-laurent-du-var",
    name: "Saint-Laurent-du-Var",
    department: "06",
    postalCode: "06700",
    latitude: 43.6699,
    longitude: 7.1768,
    population: 30049,
    localContext: {
      typeLogement: "appartements modernes, résidences en bord de Var",
      geographie: "embouchure du Var, port Saint-Laurent, zones commerciales",
      specificites: "ville carrefour, aéroport Nice à proximité, demande pro et résidentielle",
    },
    nearbyVilles: ["nice", "cagnes-sur-mer", "la-gaude", "villeneuve-loubet"],
  },
  {
    slug: "cagnes-sur-mer",
    name: "Cagnes-sur-Mer",
    department: "06",
    postalCode: "06800",
    latitude: 43.6644,
    longitude: 7.1486,
    population: 51686,
    localContext: {
      typeLogement: "appartements en résidence, villas Haut-de-Cagnes, maisons de ville",
      geographie: "trois zones : front de mer, centre-ville, village médiéval Haut-de-Cagnes",
      specificites: "patrimoine médiéval, rénovation pierre, hippodrome, demande variée",
    },
    nearbyVilles: ["saint-laurent-du-var", "villeneuve-loubet", "nice", "vence"],
  },
  {
    slug: "villeneuve-loubet",
    name: "Villeneuve-Loubet",
    department: "06",
    postalCode: "06270",
    latitude: 43.6586,
    longitude: 7.1230,
    population: 15994,
    localContext: {
      typeLogement: "marina Baie des Anges (résidences pyramides), villas, lotissements",
      geographie: "littoral entre Antibes et Cagnes, marina futuriste",
      specificites: "fort taux résidences secondaires, demande saisonnière, expertise piscines",
    },
    nearbyVilles: ["antibes", "cagnes-sur-mer", "biot", "saint-laurent-du-var"],
  },

  // ═══════════ Arrière-pays + Grasse + Vence ═══════════
  {
    slug: "grasse",
    name: "Grasse",
    department: "06",
    postalCode: "06130",
    latitude: 43.6584,
    longitude: 6.9224,
    population: 50396,
    localContext: {
      typeLogement: "maisons de ville en pierre, mas provençaux, lotissements modernes",
      geographie: "capitale mondiale du parfum, ville en gradins en arrière-pays",
      specificites: "patrimoine ancien important, restauration de bâtisses, climat plus frais qu'en littoral",
    },
    nearbyVilles: ["mougins", "valbonne", "auribeau-sur-siagne", "le-rouret", "pegomas"],
  },
  {
    slug: "vence",
    name: "Vence",
    department: "06",
    postalCode: "06140",
    latitude: 43.7211,
    longitude: 7.1119,
    population: 18931,
    localContext: {
      typeLogement: "mas en pierre, villas avec jardins, maisons provençales",
      geographie: "village médiéval en arrière-pays niçois, baous calcaires",
      specificites: "patrimoine Matisse, demande artisanat d'art, climat de moyenne altitude",
    },
    nearbyVilles: ["saint-paul-de-vence", "tourrettes-sur-loup", "cagnes-sur-mer", "la-gaude"],
  },
  {
    slug: "saint-paul-de-vence",
    name: "Saint-Paul-de-Vence",
    department: "06",
    postalCode: "06570",
    latitude: 43.6967,
    longitude: 7.1217,
    population: 3471,
    localContext: {
      typeLogement: "villas de prestige, propriétés rurales, demeures patrimoniales",
      geographie: "village médiéval perché, l'un des plus beaux villages de France",
      specificites: "clientèle artistique et internationale, restauration de pierre, jardins méditerranéens",
    },
    nearbyVilles: ["vence", "tourrettes-sur-loup", "la-colle-sur-loup", "cagnes-sur-mer"],
  },
  {
    slug: "auribeau-sur-siagne",
    name: "Auribeau-sur-Siagne",
    department: "06",
    postalCode: "06810",
    latitude: 43.6056,
    longitude: 6.9133,
    population: 3000,
    localContext: {
      typeLogement: "villas avec terrain, mas provençaux, propriétés rurales",
      geographie: "village perché de l'arrière-pays cannois, vallée de la Siagne",
      specificites: "tissu de petits professionnels, demande locale tournée vers la rénovation",
    },
    nearbyVilles: ["pegomas", "mougins", "grasse", "la-roquette-sur-siagne"],
  },
  {
    slug: "pegomas",
    name: "Pégomas",
    department: "06",
    postalCode: "06580",
    latitude: 43.6011,
    longitude: 6.9322,
    population: 7717,
    localContext: {
      typeLogement: "lotissements pavillonnaires, maisons individuelles avec jardin",
      geographie: "vallée de la Siagne, arrière-pays cannois résidentiel",
      specificites: "forte croissance démographique, neuf et rénovation, espaces verts",
    },
    nearbyVilles: ["mandelieu-la-napoule", "auribeau-sur-siagne", "mougins", "la-roquette-sur-siagne"],
  },

  // ═══════════ Var voisin (Saint-Raphaël, Fréjus, Sainte-Maxime) ═══════════
  {
    slug: "frejus",
    name: "Fréjus",
    department: "83",
    postalCode: "83600",
    latitude: 43.4332,
    longitude: 6.7370,
    population: 54023,
    localContext: {
      typeLogement: "appartements en résidence, villas en bord de mer, vieux Fréjus pierre",
      geographie: "ville antique romaine, port Fréjus, base nature",
      specificites: "patrimoine romain à protéger, longue façade littorale, demande variée",
    },
    nearbyVilles: ["saint-raphael", "puget-sur-argens", "roquebrune-sur-argens"],
  },
  {
    slug: "saint-raphael",
    name: "Saint-Raphaël",
    department: "83",
    postalCode: "83700",
    latitude: 43.4250,
    longitude: 6.7689,
    population: 35042,
    localContext: {
      typeLogement: "appartements en résidence, villas balnéaires, propriétés Cap-Esterel",
      geographie: "littoral varois adossé au massif de l'Estérel, criques et corniches",
      specificites: "humidité maritime, forte saisonnalité, expertise piscines et terrasses",
    },
    nearbyVilles: ["frejus", "agay", "boulouris", "le-trayas"],
  },

  // ═══════════ Monaco / Menton (frontière Est) ═══════════
  {
    slug: "menton",
    name: "Menton",
    department: "06",
    postalCode: "06500",
    latitude: 43.7765,
    longitude: 7.5051,
    population: 28830,
    localContext: {
      typeLogement: "appartements anciens Belle Époque, villas, vieille ville italianisante",
      geographie: "perle de la France, frontière italienne, microclimat doux",
      specificites: "patrimoine architectural, demande restauration pierre et stucs, peu de gel",
    },
    nearbyVilles: ["roquebrune-cap-martin", "beausoleil", "monaco"],
  },
  {
    slug: "monaco",
    name: "Monaco",
    department: "98",
    postalCode: "98000",
    latitude: 43.7384,
    longitude: 7.4246,
    population: 39150,
    localContext: {
      typeLogement: "résidences haut de gamme, penthouses, immeubles luxe",
      geographie: "Principauté, densité urbaine extrême, urbanisme vertical",
      specificites: "marché premium, exigence qualité maximale, professionnels accrédités",
    },
    nearbyVilles: ["beausoleil", "cap-d-ail", "roquebrune-cap-martin"],
  },
  {
    slug: "beausoleil",
    name: "Beausoleil",
    department: "06",
    postalCode: "06240",
    latitude: 43.7367,
    longitude: 7.4203,
    population: 13705,
    localContext: {
      typeLogement: "résidences en surplomb de Monaco, immeubles, villas",
      geographie: "ville frontalière de Monaco, en hauteur",
      specificites: "clientèle expatriée monégasque, exigence finitions haut de gamme",
    },
    nearbyVilles: ["monaco", "roquebrune-cap-martin", "cap-d-ail"],
  },

  // ═══════════ Arrière-pays plus éloigné (pour SEO niche) ═══════════
  {
    slug: "tourrettes-sur-loup",
    name: "Tourrettes-sur-Loup",
    department: "06",
    postalCode: "06140",
    latitude: 43.7117,
    longitude: 7.0586,
    population: 4170,
    localContext: {
      typeLogement: "maisons en pierre, villas avec terrasses, mas isolés",
      geographie: "village perché aux portes de Vence, vallée du Loup",
      specificites: "cité médiévale d'artistes, patrimoine bâti ancien, demande savoir-faire pierre",
    },
    nearbyVilles: ["vence", "saint-paul-de-vence", "le-bar-sur-loup", "gourdon"],
  },
  {
    slug: "carros",
    name: "Carros",
    department: "06",
    postalCode: "06510",
    latitude: 43.7889,
    longitude: 7.1858,
    population: 11339,
    localContext: {
      typeLogement: "lotissements modernes, villas, immeubles récents",
      geographie: "vallée du Var, zone industrielle importante",
      specificites: "tissu artisanal pro fort, demande BtoB + résidentielle",
    },
    nearbyVilles: ["la-gaude", "saint-jeannet", "le-broc", "gattieres"],
  },
  {
    slug: "la-gaude",
    name: "La Gaude",
    department: "06",
    postalCode: "06610",
    latitude: 43.7344,
    longitude: 7.1675,
    population: 6783,
    localContext: {
      typeLogement: "villas avec grands terrains, lotissements résidentiels",
      geographie: "collines de l'arrière-pays niçois, vue mer",
      specificites: "fort taux propriétaires, demande entretien jardins, piscines, fortes superficies",
    },
    nearbyVilles: ["saint-jeannet", "vence", "saint-laurent-du-var", "cagnes-sur-mer"],
  },
  {
    slug: "saint-jeannet",
    name: "Saint-Jeannet",
    department: "06",
    postalCode: "06640",
    latitude: 43.7536,
    longitude: 7.1483,
    population: 4147,
    localContext: {
      typeLogement: "villas, maisons en pierre, propriétés viticoles",
      geographie: "village perché, vignoble de Bellet, baou de Saint-Jeannet",
      specificites: "demande artisanale ciblée, restauration patrimoniale, viticulture",
    },
    nearbyVilles: ["la-gaude", "vence", "carros", "gattieres"],
  },
  {
    slug: "theoule-sur-mer",
    name: "Théoule-sur-Mer",
    department: "06",
    postalCode: "06590",
    latitude: 43.5083,
    longitude: 6.9417,
    population: 1494,
    localContext: {
      typeLogement: "villas pieds dans l'eau, résidences avec vue mer, propriétés exclusives",
      geographie: "corniche d'Or, criques rouges de l'Estérel, baie de La Napoule",
      specificites: "clientèle exigeante, accès parfois difficile, expertise environnement marin",
    },
    nearbyVilles: ["mandelieu-la-napoule", "miramar", "saint-raphael", "anthéor"],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // ÎLE-DE-FRANCE + OISE — zone des artisans actuels Bisecco
  // (Meaux, Chelles, Senlis, Argenteuil, Garges, Saint-Soupplets…)
  // ═══════════════════════════════════════════════════════════════════════

  // ═══════════ Seine-et-Marne (77) — cœur du business ═══════════
  {
    slug: "meaux",
    name: "Meaux",
    department: "77",
    postalCode: "77100",
    latitude: 48.9601,
    longitude: 2.8782,
    population: 56450,
    localContext: {
      typeLogement: "mix maisons de ville centre historique, pavillons résidentiels, immeubles",
      geographie: "préfecture de Seine-et-Marne, Brie nord, méandre de la Marne",
      specificites: "patrimoine médiéval cathédrale, demande rénovation continue, zones péri-urbaines en expansion",
    },
    nearbyVilles: ["saint-soupplets", "claye-souilly", "villeparisis", "coulommiers"],
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
      geographie: "ville résidentielle proche Paris, bordée par la Marne, parc forestier",
      specificites: "forte croissance démographique, demande très soutenue en rénovation pavillon",
    },
    nearbyVilles: ["villeparisis", "vaires-sur-marne", "lagny-sur-marne", "noisy-le-grand"],
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
      typeLogement: "pavillons individuels avec terrain, maisons rurales rénovées",
      geographie: "village de la Brie, plaine agricole, à 35 km au NE de Paris",
      specificites: "tissu de petits professionnels locaux, demande tournée rénovation et extension",
    },
    nearbyVilles: ["meaux", "marcilly", "claye-souilly", "dammartin-en-goele"],
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
      specificites: "demande artisanale de proximité, rénovation de longères et bâtisses anciennes",
    },
    nearbyVilles: ["saint-soupplets", "meaux", "marchemoret", "dammartin-en-goele"],
  },
  {
    slug: "lagny-sur-marne",
    name: "Lagny-sur-Marne",
    department: "77",
    postalCode: "77400",
    latitude: 48.8730,
    longitude: 2.7170,
    population: 22095,
    localContext: {
      typeLogement: "appartements centre-ville, pavillons résidentiels, maisons en pierre",
      geographie: "sur la Marne, à 25 km de Paris, ville d'art et d'histoire",
      specificites: "patrimoine bâti ancien à entretenir, demande rénovation centre-ville",
    },
    nearbyVilles: ["thorigny-sur-marne", "chelles", "bussy-saint-georges", "torcy"],
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
      geographie: "ville nouvelle de Marne-la-Vallée, en pleine croissance",
      specificites: "constructions neuves, finitions et personnalisations très demandées",
    },
    nearbyVilles: ["lagny-sur-marne", "torcy", "champs-sur-marne", "noisiel"],
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
      geographie: "ville résidentielle est-parisienne, RER E, axe A4",
      specificites: "marché actif sur la rénovation pavillon et extension",
    },
    nearbyVilles: ["roissy-en-brie", "ozoir-la-ferriere", "emerainville", "noisiel"],
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
      typeLogement: "pavillons et collectifs, zones résidentielles et industrielles",
      geographie: "proximité aéroport Roissy CDG, axe A104 et RER B",
      specificites: "ville carrefour, demande BtoB + résidentielle, forte mobilité",
    },
    nearbyVilles: ["villeparisis", "claye-souilly", "tremblay-en-france", "le-mesnil-amelot"],
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
      geographie: "Seine-et-Marne ouest, axe RER B, proximité Roissy",
      specificites: "rénovation thermique fortement demandée sur patrimoine 70-90",
    },
    nearbyVilles: ["chelles", "mitry-mory", "claye-souilly", "vaujours"],
  },
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
      geographie: "Brie nord, en bord de la Beuvronne, RER B accessible",
      specificites: "centre-ville en mutation, forte demande rénovation et extension",
    },
    nearbyVilles: ["meaux", "villeparisis", "annet-sur-marne", "thieux"],
  },

  // ═══════════ Oise (60) — Senlis, Compiègne, Beauvais ═══════════
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
      geographie: "ville royale médiévale, à 40 km au N de Paris, forêt de Chantilly proche",
      specificites: "patrimoine architectural protégé ABF, demande restauration pierre et toitures",
    },
    nearbyVilles: ["chantilly", "creil", "compiegne", "fleurines"],
  },
  {
    slug: "compiegne",
    name: "Compiègne",
    department: "60",
    postalCode: "60200",
    latitude: 49.4148,
    longitude: 2.8266,
    population: 40308,
    localContext: {
      typeLogement: "appartements anciens centre-ville, hôtels particuliers, pavillons quartiers résidentiels",
      geographie: "ville impériale en bord d'Oise, forêt de Compiègne, pôle universitaire",
      specificites: "patrimoine impérial, demande forte rénovation haut de gamme, restauration pierre",
    },
    nearbyVilles: ["margny-les-compiegne", "venette", "lacroix-saint-ouen", "noyon"],
  },

  // ═══════════ Val-d'Oise (95) + Yvelines (78) ═══════════
  {
    slug: "argenteuil",
    name: "Argenteuil",
    department: "95",
    postalCode: "95100",
    latitude: 48.9474,
    longitude: 2.2474,
    population: 110210,
    localContext: {
      typeLogement: "mix immeubles modernes, copropriétés années 60-70, pavillons et maisons de ville",
      geographie: "boucle de la Seine, 12 km au NO de Paris, ville dense",
      specificites: "3e ville d'IDF, parc immobilier varié, demande rénovation très soutenue",
    },
    nearbyVilles: ["bezons", "colombes", "sannois", "saint-gratien"],
  },
  {
    slug: "cergy",
    name: "Cergy",
    department: "95",
    postalCode: "95000",
    latitude: 49.0353,
    longitude: 2.0666,
    population: 65000,
    localContext: {
      typeLogement: "résidences ville nouvelle, lofts, appartements modernes, pavillons quartiers anciens",
      geographie: "préfecture du Val-d'Oise, ville nouvelle, axe A15 et RER A",
      specificites: "parc immobilier 80-90 à rénover thermiquement, finitions modernes recherchées",
    },
    nearbyVilles: ["pontoise", "osny", "vaureal", "saint-ouen-l-aumone"],
  },
  {
    slug: "pontoise",
    name: "Pontoise",
    department: "95",
    postalCode: "95300",
    latitude: 49.0489,
    longitude: 2.1019,
    population: 31477,
    localContext: {
      typeLogement: "centre historique en pierre, pavillons coteaux, immeubles collectifs",
      geographie: "ville médiévale en surplomb de l'Oise, à 30 km au NO de Paris",
      specificites: "patrimoine ancien, demande restauration pierre et zinc, marché stable",
    },
    nearbyVilles: ["cergy", "saint-ouen-l-aumone", "osny", "ennery"],
  },
  {
    slug: "garges-les-gonesse",
    name: "Garges-lès-Gonesse",
    department: "95",
    postalCode: "95140",
    latitude: 48.9728,
    longitude: 2.4071,
    population: 41014,
    localContext: {
      typeLogement: "ensembles collectifs, pavillons quartiers résidentiels, copropriétés",
      geographie: "nord-est parisien, proche aéroport Le Bourget, axe A1",
      specificites: "ANRU en cours, rénovation copropriétés et réhabilitation parc social",
    },
    nearbyVilles: ["sarcelles", "gonesse", "saint-brice-sous-foret", "villiers-le-bel"],
  },
  {
    slug: "versailles",
    name: "Versailles",
    department: "78",
    postalCode: "78000",
    latitude: 48.8014,
    longitude: 2.1301,
    population: 85771,
    localContext: {
      typeLogement: "hôtels particuliers, appartements haussmanniens, maisons bourgeoises, immeubles",
      geographie: "préfecture des Yvelines, château royal classé UNESCO, ville haut de gamme",
      specificites: "clientèle exigeante, demande artisanat haut de gamme, restauration patrimoniale",
    },
    nearbyVilles: ["le-chesnay-rocquencourt", "viroflay", "saint-cyr-l-ecole", "buc"],
  },
  {
    slug: "saint-germain-en-laye",
    name: "Saint-Germain-en-Laye",
    department: "78",
    postalCode: "78100",
    latitude: 48.8979,
    longitude: 2.0935,
    population: 44737,
    localContext: {
      typeLogement: "maisons bourgeoises, hôtels particuliers, appartements anciens centre",
      geographie: "boucle de la Seine, château royal, forêt, ville résidentielle prestigieuse",
      specificites: "patrimoine ancien à entretenir, exigence finitions haut de gamme",
    },
    nearbyVilles: ["le-pecq", "poissy", "le-vesinet", "marly-le-roi"],
  },

  // ═══════════ Paris + Hauts-de-Seine ═══════════
  {
    slug: "paris",
    name: "Paris",
    department: "75",
    postalCode: "75000",
    latitude: 48.8566,
    longitude: 2.3522,
    population: 2102650,
    localContext: {
      typeLogement: "appartements haussmanniens, immeubles 1930, ateliers d'artistes, lofts",
      geographie: "capitale, 20 arrondissements, parc immobilier ancien dense",
      specificites: "interventions rapides en copropriété, expertise petites surfaces et bâtis anciens",
    },
    nearbyVilles: ["boulogne-billancourt", "neuilly-sur-seine", "saint-denis", "vincennes"],
  },
  {
    slug: "boulogne-billancourt",
    name: "Boulogne-Billancourt",
    department: "92",
    postalCode: "92100",
    latitude: 48.8350,
    longitude: 2.2410,
    population: 124444,
    localContext: {
      typeLogement: "immeubles Art Déco, appartements rénovés, résidences modernes Île Seguin",
      geographie: "1re ville des Hauts-de-Seine, à l'ouest de Paris, en bord de Seine",
      specificites: "clientèle exigeante, marché immobilier très actif, finitions soignées",
    },
    nearbyVilles: ["issy-les-moulineaux", "neuilly-sur-seine", "sevres", "meudon"],
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
