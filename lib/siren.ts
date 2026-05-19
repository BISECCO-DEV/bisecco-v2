/**
 * Vérification SIREN via l'API publique recherche-entreprises.api.gouv.fr
 * Pas de clé API requise, rate-limit 7 req/sec.
 */

export type SirenCheckResult = {
  found: boolean;
  status: string | null; // "A" = Actif, "C" = Cessé, null = inconnu
  company_name: string | null;
  legal_form: string | null;
  activity_code: string | null; // NAF
  address: string | null;
  city: string | null;
  postal_code: string | null;
  closed_at: string | null;
};

const API_BASE = "https://recherche-entreprises.api.gouv.fr/search";

function isValidSiren(siren: string): boolean {
  if (!/^\d{9}$/.test(siren)) return false;
  // Algorithme de Luhn pour SIREN
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let n = parseInt(siren[i]!, 10);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
}

export async function verifySiren(rawSiren: string): Promise<SirenCheckResult> {
  const siren = rawSiren.replace(/\s/g, "");

  const empty: SirenCheckResult = {
    found: false,
    status: null,
    company_name: null,
    legal_form: null,
    activity_code: null,
    address: null,
    city: null,
    postal_code: null,
    closed_at: null,
  };

  if (!isValidSiren(siren)) {
    return empty;
  }

  try {
    const url = `${API_BASE}?q=${siren}&page=1&per_page=1`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      // ISR : cache 1h côté Next (revérification annuelle suffit pour SIREN)
      next: { revalidate: 3600 },
    });
    if (!res.ok) return empty;

    const data = (await res.json()) as {
      results?: Array<{
        siren: string;
        nom_complet?: string;
        nature_juridique?: string;
        activite_principale?: string;
        etat_administratif?: string;
        date_cessation?: string;
        siege?: {
          adresse?: string;
          libelle_commune?: string;
          code_postal?: string;
        };
      }>;
    };

    const match = data.results?.find((r) => r.siren === siren);
    if (!match) return empty;

    return {
      found: true,
      status: match.etat_administratif ?? null,
      company_name: match.nom_complet ?? null,
      legal_form: match.nature_juridique ?? null,
      activity_code: match.activite_principale ?? null,
      address: match.siege?.adresse ?? null,
      city: match.siege?.libelle_commune ?? null,
      postal_code: match.siege?.code_postal ?? null,
      closed_at: match.date_cessation ?? null,
    };
  } catch (e) {
    console.error("[verifySiren]", e);
    return empty;
  }
}
