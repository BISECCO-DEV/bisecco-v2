import { METIER_OPTIONS } from "@/lib/metiers";
import type { QuoteLine } from "./response-actions";

export type UnitTemplate =
  | "service_pro"      // services intellectuels (dev, photographe, coach…)
  | "service_perso"    // services personne (coiffure, esthé, massage…)
  | "food"             // alimentation / traiteur / événementiel
  | "building_heavy"   // gros œuvre (maçonnerie, charpente, terrassement)
  | "building_light"   // second œuvre (plomberie, élec, peinture, carrelage…)
  | "production"       // pièces sur-mesure (ébéniste, bijoutier, tailleur…)
  | "generic";         // fallback générique

/** Unités proposées dans le <select> de chaque ligne, selon le métier */
export const UNITS_PER_TEMPLATE: Record<UnitTemplate, string[]> = {
  service_pro:    ["forfait", "prestation", "jour", "h", "mois", "u"],
  service_perso:  ["prestation", "séance", "soin", "h", "forfait"],
  food:           ["personne", "menu", "kg", "lot", "forfait", "u"],
  building_heavy: ["m²", "m³", "ml", "u", "jour", "forfait"],
  building_light: ["m²", "ml", "u", "h", "forfait"],
  production:     ["pièce", "u", "forfait", "h"],
  generic:        ["u", "h", "m²", "ml", "jour", "forfait"],
};

/** Suggestions de lignes pré-remplies (pour aider le pro à démarrer rapidement) */
export const LINE_TEMPLATES: Record<UnitTemplate, Array<Omit<QuoteLine, "vat_rate"> & { vat_rate?: number; label_template?: boolean }>> = {
  service_pro: [
    { label: "Prestation de service", quantity: 1, unit: "forfait", unit_price_ht: 0 },
    { label: "Temps de travail", quantity: 1, unit: "jour", unit_price_ht: 0 },
    { label: "Frais de déplacement", quantity: 1, unit: "forfait", unit_price_ht: 0 },
  ],
  service_perso: [
    { label: "Prestation", quantity: 1, unit: "prestation", unit_price_ht: 0 },
    { label: "Soin / Séance", quantity: 1, unit: "séance", unit_price_ht: 0 },
    { label: "Produits utilisés", quantity: 1, unit: "u", unit_price_ht: 0 },
  ],
  food: [
    { label: "Menu / Plat", quantity: 1, unit: "personne", unit_price_ht: 0, vat_rate: 0.10 },
    { label: "Boissons", quantity: 1, unit: "personne", unit_price_ht: 0, vat_rate: 0.20 },
    { label: "Service / Mise en place", quantity: 1, unit: "forfait", unit_price_ht: 0 },
  ],
  building_heavy: [
    { label: "Main d'œuvre", quantity: 1, unit: "h", unit_price_ht: 0 },
    { label: "Matériaux", quantity: 1, unit: "forfait", unit_price_ht: 0 },
    { label: "Évacuation des gravats", quantity: 1, unit: "forfait", unit_price_ht: 0 },
  ],
  building_light: [
    { label: "Main d'œuvre", quantity: 1, unit: "h", unit_price_ht: 0 },
    { label: "Fourniture", quantity: 1, unit: "u", unit_price_ht: 0 },
    { label: "Déplacement", quantity: 1, unit: "forfait", unit_price_ht: 0 },
  ],
  production: [
    { label: "Conception / Modèle", quantity: 1, unit: "forfait", unit_price_ht: 0 },
    { label: "Pièce sur-mesure", quantity: 1, unit: "pièce", unit_price_ht: 0 },
    { label: "Finitions", quantity: 1, unit: "forfait", unit_price_ht: 0 },
  ],
  generic: [
    { label: "Prestation", quantity: 1, unit: "u", unit_price_ht: 0 },
    { label: "Main d'œuvre", quantity: 1, unit: "h", unit_price_ht: 0 },
    { label: "Frais divers", quantity: 1, unit: "forfait", unit_price_ht: 0 },
  ],
};

// Mappage métier → template
const METIER_OVERRIDES: Record<string, UnitTemplate> = {
  // Services intellectuels / numériques
  "Développeur informatique": "service_pro",
  "Photographe": "service_pro",
  "Vidéaste": "service_pro",
  "Graphiste": "service_pro",
  "Webmaster": "service_pro",
  "Designer": "service_pro",
  "Consultant": "service_pro",
  "Comptable": "service_pro",
  "Avocat": "service_pro",
  "Conseiller": "service_pro",
  "Coach": "service_pro",
  "Formateur": "service_pro",
  "Traducteur": "service_pro",
  "Rédacteur": "service_pro",

  // Services à la personne
  "Coiffeur": "service_perso",
  "Coiffeuse": "service_perso",
  "Esthéticien": "service_perso",
  "Esthéticienne": "service_perso",
  "Barbier": "service_perso",
  "Maquilleur": "service_perso",
  "Maquilleuse": "service_perso",
  "Massage": "service_perso",
  "Onglerie": "service_perso",
  "Manucure": "service_perso",
  "Pédicure": "service_perso",
  "Tatoueur": "service_perso",
  "Naturopathe": "service_perso",
  "Kinésithérapeute": "service_perso",
  "Ostéopathe": "service_perso",

  // Alimentation / restauration
  "Boulanger": "food",
  "Pâtissier": "food",
  "Chocolatier": "food",
  "Confiseur": "food",
  "Glacier": "food",
  "Biscuitier": "food",
  "Traiteur": "food",
  "Restaurant": "food",
  "Pub": "food",
  "Bar": "food",
  "Boucher": "food",
  "Charcutier": "food",
  "Poissonnier": "food",
  "Caviste": "food",
  "Crémier": "food",
  "Fromager": "food",
  "Primeur": "food",

  // Bâtiment gros œuvre
  "Maçon": "building_heavy",
  "Charpentier": "building_heavy",
  "Couvreur": "building_heavy",
  "Terrassier": "building_heavy",
  "Démolisseur": "building_heavy",
  "Étancheur": "building_heavy",
  "Constructeur": "building_heavy",

  // Bâtiment second œuvre
  "Plombier": "building_light",
  "Électricien": "building_light",
  "Chauffagiste": "building_light",
  "Climaticien": "building_light",
  "Peintre": "building_light",
  "Carreleur": "building_light",
  "Plâtrier": "building_light",
  "Menuisier": "building_light",
  "Serrurier": "building_light",
  "Vitrier": "building_light",
  "Solier": "building_light",
  "Parqueteur": "building_light",
  "Plaquiste": "building_light",
  "Isoleur": "building_light",
  "Façadier": "building_light",
  "Ravaleur": "building_light",
  "Cuisiniste": "building_light",
  "Salle de bain": "building_light",

  // Production / artisanat de fabrication
  "Ébéniste": "production",
  "Tapissier": "production",
  "Bijoutier": "production",
  "Horloger": "production",
  "Joaillier": "production",
  "Tailleur": "production",
  "Couturière": "production",
  "Cordonnier": "production",
  "Maroquinier": "production",
  "Sellier": "production",
  "Verrier": "production",
  "Céramiste": "production",
  "Potier": "production",
  "Sculpteur": "production",
  "Forgeron": "production",
};

const CATEGORY_FALLBACK: Record<string, UnitTemplate> = {
  "Alimentation":              "food",
  "Bâtiment":                  "building_light",
  "Fabrication / Production":  "production",
  "Services":                  "service_pro",
};

/** Trouve le template d'unités pour un nom de métier donné. */
export function templateForMetier(metierName: string | null | undefined): UnitTemplate {
  if (!metierName) return "generic";
  const cleaned = metierName.trim();

  const direct = METIER_OVERRIDES[cleaned];
  if (direct) return direct;

  const ci = Object.keys(METIER_OVERRIDES).find(
    (k) => k.toLowerCase() === cleaned.toLowerCase(),
  );
  if (ci) return METIER_OVERRIDES[ci]!;

  // Fallback : catégorie du métier
  const m = METIER_OPTIONS.find((opt) => opt.name.toLowerCase() === cleaned.toLowerCase());
  if (m) {
    const tpl = CATEGORY_FALLBACK[m.category];
    if (tpl) return tpl;
  }
  return "generic";
}

/** Unités disponibles dans le sélecteur, pour un métier donné. */
export function unitsForMetier(metierName: string | null | undefined): string[] {
  return UNITS_PER_TEMPLATE[templateForMetier(metierName)];
}

/** Suggestions de lignes pour pré-remplir l'éditeur, selon le métier. */
export function lineTemplatesForMetier(metierName: string | null | undefined) {
  return LINE_TEMPLATES[templateForMetier(metierName)];
}
