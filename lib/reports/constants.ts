/**
 * Constantes partagées pour les signalements.
 * Fichier séparé du "use server" (qui n'accepte que des fonctions async).
 */

export const REASONS = ["spam", "fake_profile", "inappropriate", "siren_invalid", "abuse", "other"] as const;

export type ReportReason = (typeof REASONS)[number];

export const REASON_LABELS: Record<ReportReason, string> = {
  spam: "Spam / pub / arnaque",
  fake_profile: "Faux profil (nom, photo, identité)",
  inappropriate: "Contenu inapproprié",
  siren_invalid: "SIREN invalide ou inexistant",
  abuse: "Harcèlement / abus",
  other: "Autre raison",
};
