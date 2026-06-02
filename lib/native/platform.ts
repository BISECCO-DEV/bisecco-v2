/**
 * Helpers de détection de l'environnement natif (Capacitor).
 *
 * Le site Bisecco tourne dans 3 contextes :
 *  1. Navigateur web classique (PC ou mobile)
 *  2. PWA installée (display-mode: standalone)
 *  3. App native Capacitor (Android ou iOS sur les stores)
 *
 * Permet d'adapter l'UI : cacher le bandeau "Installer l'app" si on EST déjà
 * dans l'app, utiliser le partage natif iOS, etc.
 */

declare global {
  interface Window {
    Capacitor?: {
      isNativePlatform?: () => boolean;
      getPlatform?: () => "ios" | "android" | "web";
    };
  }
}

export function isCapacitorApp(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.Capacitor?.isNativePlatform?.());
}

export function getNativePlatform(): "ios" | "android" | "web" {
  if (typeof window === "undefined") return "web";
  return window.Capacitor?.getPlatform?.() ?? "web";
}

export function isPwaStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/** True si on est dans un contexte "app-like" (Capacitor natif OU PWA installée). */
export function isInstalledApp(): boolean {
  return isCapacitorApp() || isPwaStandalone();
}
