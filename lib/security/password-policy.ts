/**
 * Politique de mot de passe Bisecco.
 *
 * Règle unique : 8 caractères minimum (200 max).
 * Aucune contrainte de composition (pas d'obligation de majuscule, chiffre,
 * caractère spécial...) : l'utilisateur choisit ce qu'il veut.
 */

export type PasswordCheckResult = {
  ok: boolean;
  error?: string;
  /** Score 0-100 (informatif, pas utilisé pour bloquer) */
  score?: number;
};

/**
 * Vérifie qu'un mot de passe respecte la politique (longueur uniquement).
 *
 * @param password Le mot de passe à valider
 * @param _ctx Contexte optionnel (nom, email) — conservé pour compat, non utilisé
 */
export function checkPasswordStrength(
  password: string,
  _ctx?: { name?: string; email?: string },
): PasswordCheckResult {
  if (!password) {
    return { ok: false, error: "Mot de passe requis." };
  }

  if (password.length < 8) {
    return { ok: false, error: "Le mot de passe doit faire au moins 8 caractères." };
  }

  if (password.length > 200) {
    return { ok: false, error: "Mot de passe trop long (max 200 caractères)." };
  }

  // Score informatif (pour UI feedback live éventuelle) basé sur la longueur.
  let score = 40; // base : politique respectée
  if (password.length >= 12) score += 30;
  if (password.length >= 16) score += 20;
  if (new Set(password).size >= password.length * 0.7) score += 10; // entropie

  return { ok: true, score: Math.min(100, score) };
}
