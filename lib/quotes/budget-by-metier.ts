// Tranches de budget contextuelles selon le métier sélectionné dans /devis.
// Affichées dynamiquement pour que les particuliers voient des montants réalistes.

import { METIER_OPTIONS } from "@/lib/metiers";

export type BudgetTier = {
  id: string;
  label: string;
  sub: string;
};

/**
 * 4 "templates" de budgets selon la nature de la prestation :
 *  - micro  : petits services (coiffure, esthétique, fleuriste…)
 *  - low    : petits chantiers / interventions (peinture petite surface, plomberie urgence…)
 *  - mid    : chantiers moyens (électricité maison, carrelage salle de bain…)
 *  - high   : gros chantiers (maçonnerie, charpente, rénovation lourde…)
 *  - food   : alimentation / traiteur / événementiel
 *  - prod   : fabrication / production / sur-mesure
 *  - service: services divers (compta, web, conseil…)
 */
const BUDGETS = {
  micro: [
    { id: "low",     label: "Moins de 30 €",   sub: "Prestation courte" },
    { id: "mid",     label: "30 – 100 €",      sub: "Prestation standard" },
    { id: "high",    label: "100 – 300 €",     sub: "Prestation premium" },
    { id: "xl",      label: "+ 300 €",         sub: "Forfait complet" },
    { id: "unknown", label: "Je ne sais pas",  sub: "Conseillez-moi" },
  ],
  low: [
    { id: "low",     label: "Moins de 200 €",  sub: "Petite intervention" },
    { id: "mid",     label: "200 – 800 €",     sub: "Travaux courts" },
    { id: "high",    label: "800 – 3 000 €",   sub: "Travaux moyens" },
    { id: "xl",      label: "+ 3 000 €",       sub: "Chantier important" },
    { id: "unknown", label: "Je ne sais pas",  sub: "Aidez-moi à estimer" },
  ],
  mid: [
    { id: "low",     label: "Moins de 500 €",       sub: "Petits travaux" },
    { id: "mid",     label: "500 – 2 000 €",        sub: "Travaux moyens" },
    { id: "high",    label: "2 000 – 10 000 €",     sub: "Gros chantier" },
    { id: "xl",      label: "+ 10 000 €",           sub: "Très gros projet" },
    { id: "unknown", label: "Je ne sais pas",       sub: "Aidez-moi à estimer" },
  ],
  high: [
    { id: "low",     label: "Moins de 2 000 €",     sub: "Réparation ponctuelle" },
    { id: "mid",     label: "2 000 – 10 000 €",     sub: "Chantier moyen" },
    { id: "high",    label: "10 000 – 50 000 €",    sub: "Gros chantier" },
    { id: "xl",      label: "+ 50 000 €",           sub: "Construction / rénovation lourde" },
    { id: "unknown", label: "Je ne sais pas",       sub: "Conseillez-moi" },
  ],
  food: [
    { id: "low",     label: "Moins de 100 €",       sub: "Quelques personnes" },
    { id: "mid",     label: "100 – 500 €",          sub: "Petit événement" },
    { id: "high",    label: "500 – 2 000 €",        sub: "Réception" },
    { id: "xl",      label: "+ 2 000 €",            sub: "Grand événement" },
    { id: "unknown", label: "Je ne sais pas",       sub: "Conseillez-moi" },
  ],
  prod: [
    { id: "low",     label: "Moins de 200 €",       sub: "Pièce unique simple" },
    { id: "mid",     label: "200 – 1 000 €",        sub: "Sur-mesure standard" },
    { id: "high",    label: "1 000 – 5 000 €",      sub: "Pièce de haute qualité" },
    { id: "xl",      label: "+ 5 000 €",            sub: "Commande exclusive" },
    { id: "unknown", label: "Je ne sais pas",       sub: "Conseillez-moi" },
  ],
  service: [
    { id: "low",     label: "Moins de 200 €",       sub: "Consultation rapide" },
    { id: "mid",     label: "200 – 1 000 €",        sub: "Prestation standard" },
    { id: "high",    label: "1 000 – 5 000 €",      sub: "Mission complète" },
    { id: "xl",      label: "+ 5 000 €",            sub: "Accompagnement long terme" },
    { id: "unknown", label: "Je ne sais pas",       sub: "Aidez-moi à estimer" },
  ],
} as const;

// Surcharge spécifique pour certains métiers où la catégorie n'est pas un
// indicateur fiable (ex : "Coiffeur" tombe dans "Services" mais c'est micro).
const METIER_OVERRIDES: Record<string, keyof typeof BUDGETS> = {
  // Beauté / bien-être
  "Coiffeur": "micro",
  "Coiffeuse": "micro",
  "Esthéticien": "micro",
  "Esthéticienne": "micro",
  "Barbier": "micro",
  "Maquilleur": "micro",
  "Maquilleuse": "micro",
  "Onglerie": "micro",
  "Manucure": "micro",
  "Massage": "micro",
  "Tatoueur": "micro",

  // Fleuriste, photographe etc.
  "Fleuriste": "micro",
  "Photographe": "service",
  "Vidéaste": "service",
  "DJ": "low",
  "Animateur": "low",

  // Bâtiment lourd
  "Maçon": "high",
  "Couvreur": "high",
  "Charpentier": "high",
  "Terrassier": "high",
  "Démolisseur": "high",
  "Promoteur immobilier": "high",
  "Marchand de biens": "high",

  // Bâtiment intervention
  "Plombier": "mid",
  "Électricien": "mid",
  "Chauffagiste": "mid",
  "Carreleur": "mid",
  "Menuisier": "mid",
  "Peintre": "mid",
  "Plâtrier": "mid",
  "Serrurier": "low",
  "Vitrier": "low",

  // Production / fabrication
  "Ébéniste": "prod",
  "Bijoutier": "prod",
  "Horloger": "prod",
  "Tailleur": "prod",
  "Couturière": "prod",
  "Cordonnier": "low",
  "Maroquinier": "prod",

  // Restauration / Bouche
  "Traiteur": "food",
  "Restaurant": "food",
  "Pâtissier": "food",
  "Boulanger": "food",
  "Chocolatier": "food",
  "Boucher": "food",
  "Charcutier": "food",
  "Poissonnier": "food",
  "Glacier": "food",
  "Pub": "food",
  "Bar": "food",
  "Caviste": "food",
};

const CATEGORY_FALLBACK: Record<string, keyof typeof BUDGETS> = {
  "Alimentation": "food",
  "Bâtiment": "mid",
  "Fabrication / Production": "prod",
  "Services": "service",
};

/**
 * Retourne les 5 tranches de budget à afficher pour un nom de métier donné.
 * Si le métier est vide / inconnu → tranches génériques "mid" (les plus couvrantes).
 */
export function budgetsForMetier(metierName: string): readonly BudgetTier[] {
  const cleaned = metierName.trim();
  if (!cleaned) return BUDGETS.mid;

  const direct = METIER_OVERRIDES[cleaned];
  if (direct) return BUDGETS[direct];

  // Lookup case-insensitive sur le mapping
  const ci = Object.keys(METIER_OVERRIDES).find(
    (k) => k.toLowerCase() === cleaned.toLowerCase(),
  );
  if (ci) return BUDGETS[METIER_OVERRIDES[ci]!];

  // Fallback : on cherche la catégorie du métier
  const m = METIER_OPTIONS.find((opt) => opt.name.toLowerCase() === cleaned.toLowerCase());
  if (m) {
    const tpl = CATEGORY_FALLBACK[m.category];
    if (tpl) return BUDGETS[tpl];
  }

  return BUDGETS.mid;
}
