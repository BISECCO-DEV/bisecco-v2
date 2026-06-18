/**
 * Rate limiter sliding-window en mémoire.
 *
 * Pourquoi pas Redis : Bisecco tourne sur o2switch mutualisé avec UN seul
 * processus Node.js (Phusion Passenger). En mémoire suffit largement et
 * survit aux restarts (chaque restart = compteurs reset, anti-attaquant
 * c'est OK : pas de bypass possible en attendant).
 *
 * Usage :
 *   import { rateLimit } from "@/lib/security/rate-limit";
 *
 *   // Dans une server action ou route handler :
 *   const limited = await rateLimit({
 *     key: `signup:${ip}`,
 *     limit: 5,
 *     windowMs: 60 * 60 * 1000, // 1h
 *   });
 *   if (limited) {
 *     return { ok: false, error: "Trop de tentatives. Réessayez plus tard." };
 *   }
 */

import { headers } from "next/headers";

type Bucket = { count: number; resetAt: number };

// Map global · partagée par toutes les requêtes du process Node
const buckets = new Map<string, Bucket>();

// Nettoyage périodique (toutes les 5 min) pour éviter d'accumuler les vieilles entrées
let cleanupStarted = false;
function startCleanup() {
  if (cleanupStarted) return;
  cleanupStarted = true;
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }, 5 * 60 * 1000).unref?.();
}

export type RateLimitOpts = {
  /** Clé unique du compteur · ex: "signup:1.2.3.4" */
  key: string;
  /** Nombre max d'actions dans la fenêtre */
  limit: number;
  /** Durée de la fenêtre en ms */
  windowMs: number;
};

export type RateLimitResult = {
  /** true si rate limit atteint (action à BLOQUER) */
  limited: boolean;
  /** Nombre d'actions restantes dans la fenêtre */
  remaining: number;
  /** Timestamp unix du reset de la fenêtre */
  resetAt: number;
};

/**
 * Vérifie + incrémente le compteur. Retourne {limited:true} si la limite est atteinte.
 *
 * Important : appelle bien `await` car la signature est async (compat future Redis).
 */
export async function rateLimit(opts: RateLimitOpts): Promise<RateLimitResult> {
  startCleanup();
  const now = Date.now();
  const existing = buckets.get(opts.key);

  if (!existing || existing.resetAt <= now) {
    // Nouvelle fenêtre
    buckets.set(opts.key, { count: 1, resetAt: now + opts.windowMs });
    return { limited: false, remaining: opts.limit - 1, resetAt: now + opts.windowMs };
  }

  if (existing.count >= opts.limit) {
    return { limited: true, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count++;
  return { limited: false, remaining: opts.limit - existing.count, resetAt: existing.resetAt };
}

/**
 * Récupère l'IP cliente depuis les headers (X-Forwarded-For prioritaire).
 * En cas d'IP introuvable, retourne "unknown" → le rate limiter s'applique
 * à tous les clients sans IP (anti-bypass).
 */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) {
    // Première IP = celle du client réel (les suivantes = proxies)
    return forwardedFor.split(",")[0]!.trim();
  }
  const realIp = h.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

/**
 * Combo helper : rate limit par IP avec préfixe d'action.
 *
 * @example
 *   const result = await rateLimitByIp("signup", { limit: 5, windowMs: 3600000 });
 *   if (result.limited) return { ok: false, error: "Trop de tentatives" };
 */
export async function rateLimitByIp(
  action: string,
  opts: { limit: number; windowMs: number },
): Promise<RateLimitResult> {
  const ip = await getClientIp();
  return rateLimit({ key: `${action}:${ip}`, ...opts });
}
