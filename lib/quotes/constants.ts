/**
 * Constantes partagées pour les devis.
 * Fichier séparé du "use server" (qui n'accepte que des fonctions async).
 */

export const URGENCY = ["immediate", "week", "month", "flexible"] as const;
export type Urgency = (typeof URGENCY)[number];

export const BUDGET = ["under_500", "500_2000", "2000_5000", "5000_10000", "over_10000", "unknown"] as const;
export type BudgetRange = (typeof BUDGET)[number];

export const URGENCY_LABELS: Record<Urgency, string> = {
  immediate: "Immédiat (sous 48h)",
  week: "Cette semaine",
  month: "Ce mois-ci",
  flexible: "Flexible",
};

export const BUDGET_LABELS: Record<BudgetRange, string> = {
  under_500: "< 500 €",
  "500_2000": "500 – 2 000 €",
  "2000_5000": "2 000 – 5 000 €",
  "5000_10000": "5 000 – 10 000 €",
  over_10000: "> 10 000 €",
  unknown: "À définir",
};
