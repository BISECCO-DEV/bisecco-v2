/**
 * Calcule le numéro de TVA intracommunautaire français à partir du SIREN.
 *
 * Formule officielle :
 *   TVA = "FR" + clé(2 chiffres) + SIREN(9 chiffres)
 *   clé = (12 + 3 × (SIREN mod 97)) mod 97
 */
export function vatNumberFromSiren(siren: string | null | undefined): string | null {
  if (!siren) return null;
  const clean = siren.replace(/\s/g, "");
  if (!/^\d{9}$/.test(clean)) return null;
  const sirenNum = parseInt(clean, 10);
  const key = (12 + 3 * (sirenNum % 97)) % 97;
  return `FR${String(key).padStart(2, "0")}${clean}`;
}

/** Formate un SIREN en groupes de 3 chiffres pour la lisibilité : 123456789 → 123 456 789 */
export function formatSiren(siren: string | null | undefined): string {
  if (!siren) return "";
  const clean = siren.replace(/\s/g, "");
  if (!/^\d{9}$/.test(clean)) return clean;
  return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6, 9)}`;
}

/** Génère un numéro de devis pro à partir de l'id : DEV-2026-000123 */
export function formatQuoteNumber(id: number, sentAtIso?: string | null): string {
  const year = sentAtIso ? new Date(sentAtIso).getFullYear() : new Date().getFullYear();
  return `DEV-${year}-${String(id).padStart(6, "0")}`;
}
