import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combine className conditionnellement (clsx + tailwind-merge) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convertit un texte en slug URL-friendly.
 * Ex: "Sirius Automobiles" → "sirius-automobiles"
 */
export function slugify(text: string, maxLength = 60): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, maxLength);
}

/**
 * Construit le chemin URL d'un profil artisan avec un slug lisible.
 * Ex: artisanProfilePath("Sirius Automobiles", "BIS-2026-000018")
 *  → "/profil/sirius-automobiles-bis-2026-000018"
 */
export function artisanProfilePath(name: string | null | undefined, clientNumber: string | null | undefined): string {
  const cn = (clientNumber ?? "").toUpperCase();
  if (!cn) return "/rechercher";
  const slug = slugify(name ?? "");
  return slug
    ? `/profil/${slug}-${cn.toLowerCase()}`
    : `/profil/${cn.toLowerCase()}`;
}

/**
 * Extrait le client_number à partir d'un slug d'URL.
 * Accepte :
 *  - "sirius-automobiles-bis-2026-000018" → "BIS-2026-000018"
 *  - "BIS-2026-000018"                    → "BIS-2026-000018"
 *  - "bis-2026-000018"                    → "BIS-2026-000018"
 *
 * Retourne null si aucun pattern reconnu.
 */
export function extractClientNumber(slugOrId: string | null | undefined): string | null {
  if (!slugOrId) return null;
  const match = slugOrId.match(/(BIS-\d{4}-\d+)$/i);
  if (match) return match[1].toUpperCase();
  return null;
}
