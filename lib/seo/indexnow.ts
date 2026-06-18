/**
 * IndexNow — Protocol Microsoft pour notifier Bing, Yandex, Seznam
 * d'une nouvelle URL ou d'une URL modifiée.
 *
 * Avantage : indexation en quelques minutes au lieu de jours.
 *
 * Doc officielle : https://www.indexnow.org/documentation
 *
 * Setup :
 *   1. La clé IndexNow doit être hébergée publiquement à
 *      https://bisecco.fr/{KEY}.txt avec son contenu = la clé elle-même.
 *      → On utilise un Route Handler Next.js pour ça (cf app/[key].txt/route.ts).
 *   2. À chaque action qui crée/modifie une URL publique (nouvel artisan validé,
 *      nouveau post de blog, nouvelle cover métier), on ping IndexNow.
 *
 * Best practice : ne PAS spammer (max ~10000 URLs/jour, max 10000 URLs par ping).
 */

const INDEXNOW_KEY = "bisecco-2026-c8f4e7a1b3d9f6e2a5c8b1d4e7f0a3b6";
const SITE_URL = "https://bisecco.fr";

export function getIndexNowKey(): string {
  return INDEXNOW_KEY;
}

/**
 * Notifie Bing/IndexNow d'une URL nouvelle ou modifiée.
 * Fire-and-forget : on n'attend pas la réponse, on ne bloque pas l'utilisateur.
 *
 * @param urls 1 ou plusieurs URLs absolues (https://bisecco.fr/...) à pousser
 */
export async function pingIndexNow(urls: string | string[]): Promise<void> {
  const urlList = Array.isArray(urls) ? urls : [urls];
  if (urlList.length === 0) return;

  // Filtre : seules les URLs du domaine sont acceptées par IndexNow
  const validUrls = urlList.filter((u) => u.startsWith(SITE_URL));
  if (validUrls.length === 0) return;

  // Skip en dev (pas la peine de spammer Bing avec localhost)
  if (process.env.NODE_ENV !== "production") {
    console.log(`[IndexNow] DEV mode skip · would ping: ${validUrls.length} URLs`);
    return;
  }

  try {
    const body = {
      host: "bisecco.fr",
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: validUrls,
    };

    // Bing IndexNow endpoint (couvre aussi Yandex via leur peering)
    const res = await fetch("https://www.bing.com/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });

    if (res.status === 200 || res.status === 202) {
      console.log(`[IndexNow] ✅ Notified Bing for ${validUrls.length} URLs`);
    } else {
      console.warn(`[IndexNow] ⚠️ HTTP ${res.status} when pinging Bing`);
    }
  } catch (err) {
    // Silent fail — IndexNow ne doit JAMAIS bloquer le flow utilisateur
    console.warn("[IndexNow] ping failed:", err instanceof Error ? err.message : err);
  }
}

/**
 * Génère la liste complète des URLs SEO prioritaires de Bisecco.
 * Utile pour un "reset" complet de l'index Bing après une grosse mise à jour.
 */
export async function getAllPrioritaryUrls(): Promise<string[]> {
  const { getAllMetierPrioritaireSlugs } = await import("./metiers-prioritaires");
  const { getAllVilleSlugs } = await import("./villes-prioritaires");

  const metiers = getAllMetierPrioritaireSlugs();
  const villes = getAllVilleSlugs();

  const urls: string[] = [
    SITE_URL,
    `${SITE_URL}/metiers`,
    `${SITE_URL}/rechercher`,
    `${SITE_URL}/emploi`,
    `${SITE_URL}/blog`,
    `${SITE_URL}/qui-sommes-nous`,
  ];

  // Pages métier × ville (500 URLs)
  for (const m of metiers) {
    urls.push(`${SITE_URL}/metiers/${m}`);
    for (const v of villes) {
      urls.push(`${SITE_URL}/metiers/${m}/${v}`);
    }
  }

  return urls;
}
