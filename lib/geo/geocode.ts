/**
 * Géocodage via API Adresse (data.gouv.fr).
 *
 * API officielle française, gratuite, illimitée, sans clé.
 * Doc : https://adresse.data.gouv.fr/api-doc/adresse
 *
 * Précision moyenne : ~5 m sur une adresse complète, ~50 m sur une ville.
 */

export type GeocodeResult = {
  /** Coordonnées exactes (lat, lng) */
  latitude: number;
  longitude: number;
  /** Adresse normalisée renvoyée par l'API ("15 Rue d'Antibes 06400 Cannes") */
  label: string;
  /** Code postal seul ("06400") */
  postcode: string;
  /** Nom de la ville normalisé ("Cannes") */
  city: string;
  /** Numéro + rue ("15 Rue d'Antibes") sans CP ni ville */
  street?: string;
  /** Score de pertinence 0..1 */
  score: number;
  /** Type de match : "housenumber" (numéro exact), "street", "locality", "municipality" */
  type: "housenumber" | "street" | "locality" | "municipality" | string;
};

type ApiFeature = {
  geometry: { coordinates: [number, number] }; // [lng, lat]
  properties: {
    label: string;
    score: number;
    type: string;
    postcode?: string;
    city?: string;
    name?: string;
    street?: string;
    housenumber?: string;
  };
};

type ApiResponse = {
  features: ApiFeature[];
};

/**
 * Géocode une requête libre.
 * Renvoie les N meilleurs résultats triés par score.
 *
 * @param query "15 rue d'antibes cannes" ou juste "cannes"
 * @param options.limit 1..20 (default 5)
 * @param options.type filtre sur le type ("municipality", "street", "housenumber", "locality")
 * @param options.autocomplete true = optimisé saisie incrémentale (UI), false = recherche stricte (batch)
 */
export async function geocodeQuery(
  query: string,
  options: {
    limit?: number;
    type?: "housenumber" | "street" | "locality" | "municipality";
    autocomplete?: boolean;
  } = {},
): Promise<GeocodeResult[]> {
  const { limit = 5, type, autocomplete = true } = options;
  const q = query?.trim();
  if (!q || q.length < 3) return [];

  const params = new URLSearchParams({
    q,
    limit: String(Math.min(20, Math.max(1, limit))),
    autocomplete: autocomplete ? "1" : "0",
  });
  if (type) params.set("type", type);

  const url = `https://api-adresse.data.gouv.fr/search/?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      // Cache côté Next.js : 1h par query (les adresses changent peu)
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];

    const data = (await res.json()) as ApiResponse;
    return (data.features ?? []).map((f) => {
      const street = [f.properties.housenumber, f.properties.street ?? f.properties.name].filter(Boolean).join(" ");
      return {
        latitude: f.geometry.coordinates[1],
        longitude: f.geometry.coordinates[0],
        label: f.properties.label,
        postcode: f.properties.postcode ?? "",
        city: f.properties.city ?? f.properties.name ?? "",
        street: street || undefined,
        score: f.properties.score,
        type: f.properties.type,
      };
    });
  } catch (err) {
    console.error("[geocode] API Adresse error:", err);
    return [];
  }
}

/**
 * Détecte si la query contient un numéro de rue (= recherche d'adresse précise).
 * Sinon, c'est probablement juste une ville → on force le type=municipality
 * pour éviter qu'un lieu-dit obscur prenne le dessus sur la commune.
 *
 * Exemple foiré sans ce fix : "Meaux" → API retourne un lieu-dit en 35 (Bretagne)
 * au lieu de la commune Meaux (77).
 */
function looksLikeAddress(query: string): boolean {
  const trimmed = query.trim();
  // Commence par un numéro
  if (/^\d/.test(trimmed)) return true;
  // Contient un numéro suivi d'un type de voie (rue, avenue, etc.)
  if (/\b\d+\s+(rue|avenue|boulevard|bd|impasse|chemin|allée|allee|place|route|rte|quai)\b/i.test(trimmed)) {
    return true;
  }
  return false;
}

/**
 * Géocode une ville (ou adresse) et retourne UNIQUEMENT le meilleur match.
 * Stratégie :
 *   - Si la query ressemble à une adresse (numéro + rue) → recherche libre
 *   - Sinon (juste une ville) → on FORCE type=municipality d'abord pour
 *     attraper la vraie commune ; on retombe sur recherche libre si rien.
 *
 * Utilisé par le rattrapage admin sur les profils existants.
 */
export async function geocodeBestMatch(query: string): Promise<GeocodeResult | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  if (!looksLikeAddress(trimmed)) {
    // Recherche stricte commune (évite les lieux-dits qui foutent le bordel)
    const municipality = await geocodeQuery(trimmed, {
      limit: 1,
      type: "municipality",
      autocomplete: false,
    });
    if (municipality[0]) return municipality[0];

    // Fallback : commune toujours pas trouvée → on tente locality
    const locality = await geocodeQuery(trimmed, {
      limit: 1,
      type: "locality",
      autocomplete: false,
    });
    if (locality[0]) return locality[0];
  }

  // Adresse complète ou aucun match commune → recherche libre
  const free = await geocodeQuery(trimmed, { limit: 1, autocomplete: false });
  return free[0] ?? null;
}
