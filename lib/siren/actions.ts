"use server";

import { verifySiren } from "@/lib/siren";

export type SirenLookupResult =
  | {
      ok: true;
      companyName: string;
      city: string | null;
      postalCode: string | null;
      legalForm: string | null;
      activityCode: string | null;
      active: boolean;
    }
  | { ok: false; error: "invalid" | "not_found" | "closed" | "unknown" };

/**
 * Recherche les infos publiques d'une entreprise à partir de son SIREN.
 * Utilisé côté client (signup artisan) pour pré-remplir le nom de société.
 */
export async function lookupSirenAction(siren: string): Promise<SirenLookupResult> {
  const cleaned = (siren ?? "").replace(/\s/g, "");
  if (!/^\d{9}$/.test(cleaned)) {
    return { ok: false, error: "invalid" };
  }

  const check = await verifySiren(cleaned);
  if (!check.found) return { ok: false, error: "not_found" };
  if (check.status && check.status !== "A") return { ok: false, error: "closed" };
  if (!check.company_name) return { ok: false, error: "unknown" };

  return {
    ok: true,
    companyName: check.company_name,
    city: check.city,
    postalCode: check.postal_code,
    legalForm: check.legal_form,
    activityCode: check.activity_code,
    active: check.status === "A",
  };
}
