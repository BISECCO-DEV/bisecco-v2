/**
 * Génération de contenu SEO unique par combinaison métier × ville.
 * Évite le "thin content" qui empêche l'indexation Google.
 * Tout est déterministe pour stabilité du contenu (pas de random).
 */

// Métadonnées des villes principales (quartiers + spécificités locales)
const CITY_DATA: Record<string, {
  name: string;
  region: string;
  population: string;
  neighborhoods: string[];
  hook: string; // Phrase d'accroche spécifique
}> = {
  cannes: {
    name: "Cannes",
    region: "Alpes-Maritimes",
    population: "74 000 habitants",
    neighborhoods: ["La Croisette", "Le Suquet", "La Bocca", "Carnot", "République", "Les Broussailles", "Prado"],
    hook: "Cannes, ville balnéaire emblématique de la Côte d'Azur, accueille de nombreux projets de rénovation haut de gamme et de constructions neuves dans ses quartiers résidentiels.",
  },
  nice: {
    name: "Nice",
    region: "Alpes-Maritimes",
    population: "342 000 habitants",
    neighborhoods: ["Vieux Nice", "Mont Boron", "Cimiez", "Saint-Roch", "Magnan", "Riquier", "Libération"],
    hook: "Capitale de la Côte d'Azur, Nice présente une forte demande en professionnels pour la rénovation d'appartements anciens dans le Vieux Nice et les villas du Mont Boron.",
  },
  paris: {
    name: "Paris",
    region: "Île-de-France",
    population: "2 100 000 habitants",
    neighborhoods: ["Le Marais", "Saint-Germain", "Montmartre", "Bastille", "Champs-Élysées", "Belleville", "Auteuil"],
    hook: "À Paris, les chantiers de rénovation d'immeubles haussmanniens et d'appartements anciens nécessitent des professionnels expérimentés et habitués aux contraintes de la capitale.",
  },
  lyon: {
    name: "Lyon",
    region: "Rhône",
    population: "522 000 habitants",
    neighborhoods: ["Presqu'île", "Croix-Rousse", "Vieux Lyon", "Confluence", "Part-Dieu", "Vaise", "Gerland"],
    hook: "Lyon, ville historique du Rhône, conjugue patrimoine ancien (Vieux Lyon UNESCO) et quartiers modernes (Confluence), avec une forte activité artisanale.",
  },
  marseille: {
    name: "Marseille",
    region: "Bouches-du-Rhône",
    population: "873 000 habitants",
    neighborhoods: ["Vieux-Port", "Le Panier", "La Joliette", "Castellane", "Endoume", "La Plaine", "Pointe Rouge"],
    hook: "Marseille présente une diversité de bâtis (du bastide provençal au logement social années 60) demandant des professionnels aux compétences variées.",
  },
  bordeaux: {
    name: "Bordeaux",
    region: "Gironde",
    population: "260 000 habitants",
    neighborhoods: ["Chartrons", "Saint-Michel", "Bastide", "Saint-Pierre", "Caudéran", "Saint-Augustin"],
    hook: "Bordeaux, classée UNESCO, est en pleine effervescence avec ses rénovations d'échoppes bordelaises et de chartreuses du 18ème siècle.",
  },
  toulouse: {
    name: "Toulouse",
    region: "Haute-Garonne",
    population: "493 000 habitants",
    neighborhoods: ["Capitole", "Saint-Cyprien", "Carmes", "Compans-Caffarelli", "Rangueil", "Borderouge"],
    hook: "Toulouse, la ville rose, voit ses quartiers historiques (Capitole, Carmes) et nouveaux (Andromède, Borderouge) générer une demande artisanale soutenue.",
  },
  nantes: {
    name: "Nantes",
    region: "Loire-Atlantique",
    population: "318 000 habitants",
    neighborhoods: ["Centre-ville", "Doulon", "Île de Nantes", "Chantenay", "Bottière", "Dervallières"],
    hook: "Nantes, métropole dynamique de l'Ouest, multiplie les projets de rénovation énergétique et de transformation des bâtiments industriels.",
  },
  lille: {
    name: "Lille",
    region: "Nord",
    population: "236 000 habitants",
    neighborhoods: ["Vieux-Lille", "Wazemmes", "Vauban", "Saint-Maurice", "Lille-Sud", "Bois-Blancs"],
    hook: "Lille combine briques rouges typiques du Nord et architecture contemporaine, avec des besoins fréquents en rénovation énergétique.",
  },
  meaux: {
    name: "Meaux",
    region: "Seine-et-Marne",
    population: "55 000 habitants",
    neighborhoods: ["Centre historique", "Beauval", "Pierre Collinet", "Hermillon", "Hôtel-Dieu"],
    hook: "Meaux, sous-préfecture dynamique de Seine-et-Marne, voit ses quartiers anciens et son patrimoine architectural générer une activité artisanale soutenue.",
  },
  chelles: {
    name: "Chelles",
    region: "Seine-et-Marne",
    population: "54 000 habitants",
    neighborhoods: ["Centre", "Mont-Chalats", "Coudreaux", "Foch", "Aulnoy"],
    hook: "Chelles, à proximité de Paris, attire de nombreux ménages pour des projets d'extension et de rénovation de pavillons.",
  },
};

// Tarifs moyens 2026 par métier (fourchettes indicatives France)
const METIER_TARIFS: Record<string, { unit: string; min: number; max: number; note?: string }> = {
  plombier: { unit: "€/h", min: 40, max: 80, note: "Intervention dépannage entre 70 et 150 €." },
  electricien: { unit: "€/h", min: 40, max: 70, note: "Devis obligatoire au-delà de 200 €." },
  macon: { unit: "€/h", min: 40, max: 65 },
  peintre: { unit: "€/m²", min: 25, max: 45, note: "Hors peinture spéciale ou rattrapage." },
  carreleur: { unit: "€/m²", min: 40, max: 80, note: "Selon format et complexité de la pose." },
  menuisier: { unit: "€/h", min: 45, max: 75 },
  plaquiste: { unit: "€/m²", min: 25, max: 50 },
  couvreur: { unit: "€/m²", min: 30, max: 70 },
  jardinier: { unit: "€/h", min: 30, max: 55 },
  serrurier: { unit: "€/h", min: 50, max: 90, note: "Forfait dépannage souvent compris entre 80 et 200 €." },
  vitrier: { unit: "€/m²", min: 40, max: 100 },
  chauffagiste: { unit: "€/h", min: 50, max: 90 },
};

export type LocalContent = {
  cityData: typeof CITY_DATA[string] | null;
  intro: string;
  whyHere: string;
  neighborhoodsText: string | null;
  tarifs: { unit: string; min: number; max: number; note?: string } | null;
  faqs: Array<{ question: string; answer: string }>;
};

export function generateLocalContent(metierName: string, citySlug: string, artisansCount: number): LocalContent {
  const metierLower = metierName.toLowerCase();
  const metierKey = citySlug
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/-/g, "");

  const cityData = CITY_DATA[metierKey] ?? null;
  const cityLabel = cityData?.name ?? unslugify(citySlug);

  // Cherche aussi le tarif par mot-clé partiel du métier (ex: "plombier-chauffagiste" → "plombier")
  const metierSlug = metierLower.replace(/\s+/g, "-").normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const tarifs = Object.entries(METIER_TARIFS).find(([k]) => metierSlug.includes(k))?.[1] ?? null;

  const intro = cityData
    ? `${cityData.hook} ${artisansCount > 0
        ? `Bisecco référence ${artisansCount} ${metierLower}${artisansCount > 1 ? "s" : ""} vérifié${artisansCount > 1 ? "s" : ""} à ${cityLabel}, prêts à intervenir.`
        : `Bisecco développe son réseau de ${metierLower}s à ${cityLabel} · soyez parmi les premiers à vous inscrire.`}`
    : `Trouvez un ${metierLower} à ${cityLabel} sur Bisecco. ${artisansCount > 0
        ? `${artisansCount} professionnel${artisansCount > 1 ? "s" : ""} vérifié${artisansCount > 1 ? "s" : ""} SIREN référencé${artisansCount > 1 ? "s" : ""} dans la ville.`
        : "Inscrivez-vous pour être contacté dès qu'un professionnel rejoint la zone."}`;

  const whyHere = `À ${cityLabel}${cityData ? ` (${cityData.region}, ${cityData.population})` : ""}, faire appel à un ${metierLower} de confiance est essentiel pour la qualité et la pérennité de vos travaux. Bisecco vérifie systématiquement le numéro SIREN de chaque ${metierLower} référencé via l'API officielle de l'INSEE, garantissant que vous traitez avec une entreprise légalement déclarée et active. Aucun faux profil, aucune publicité trompeuse · juste des professionnels locaux que vous pouvez contacter en direct, sans intermédiaire et sans commission.`;

  const neighborhoodsText = cityData
    ? `Les ${metierLower}s Bisecco interviennent dans tous les quartiers de ${cityLabel}, notamment ${cityData.neighborhoods.slice(0, -1).join(", ")} et ${cityData.neighborhoods[cityData.neighborhoods.length - 1]}. Que vous habitiez en centre-ville ou en périphérie, vous trouvez un professionnel disponible.`
    : null;

  const faqs: Array<{ question: string; answer: string }> = [
    {
      question: `Combien coûte un ${metierLower} à ${cityLabel} en 2026 ?`,
      answer: tarifs
        ? `Le tarif moyen d'un ${metierLower} à ${cityLabel} se situe entre ${tarifs.min} et ${tarifs.max} ${tarifs.unit}. ${tarifs.note ?? ""} Les prix peuvent varier selon la complexité du chantier, la disponibilité du professionnel et la zone géographique précise. Sur Bisecco, vous recevez plusieurs devis gratuits pour comparer en toute transparence.`
        : `Les tarifs d'un ${metierLower} à ${cityLabel} varient selon la nature et l'ampleur de votre projet. Sur Bisecco, vous obtenez plusieurs devis gratuits sous 24h pour comparer objectivement les prix proposés par les professionnels locaux.`,
    },
    {
      question: `Comment vérifier qu'un ${metierLower} à ${cityLabel} est sérieux ?`,
      answer: `Sur Bisecco, chaque ${metierLower} est vérifié automatiquement via son numéro SIREN auprès de l'API officielle de l'INSEE (recherche-entreprises.api.gouv.fr). Vous voyez également les avis clients authentiques, les photos de réalisations et les coordonnées professionnelles. Aucun anonymat possible.`,
    },
    {
      question: `Sous combien de temps puis-je obtenir un devis d'un ${metierLower} à ${cityLabel} ?`,
      answer: `La majorité des ${metierLower}s répondent en moins de 24 heures sur Bisecco. Pour un dépannage urgent, certains professionnels peuvent répondre en quelques heures. Plus votre description est précise (photos, surface, urgence), plus la réponse est rapide et le devis pertinent.`,
    },
    {
      question: `Est-ce que Bisecco prend une commission sur les travaux ?`,
      answer: `Non, jamais. Bisecco est 100 % gratuit pour les particuliers et pour les professionnels. Vous traitez en direct avec le ${metierLower} de votre choix, sans intermédiaire et sans commission prélevée sur vos travaux.`,
    },
    {
      question: `Que faire si je ne suis pas satisfait du ${metierLower} choisi ?`,
      answer: `Bisecco vous permet de comparer plusieurs devis avant de vous engager. Une fois la mission terminée, vous notez le professionnel publiquement · vos commentaires aident les autres particuliers de ${cityLabel} à choisir en toute confiance. En cas de litige, contactez notre support qui vous accompagnera.`,
    },
  ];

  return { cityData, intro, whyHere, neighborhoodsText, tarifs, faqs };
}

function unslugify(s: string): string {
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("-");
}
