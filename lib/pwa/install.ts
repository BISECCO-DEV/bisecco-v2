/**
 * Singleton client-side qui capture l'événement beforeinstallprompt
 * pour le rendre disponible à plusieurs composants (banner auto + bouton manuel).
 */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Listener = (canInstall: boolean) => void;

class PwaInstallManager {
  private deferred: BeforeInstallPromptEvent | null = null;
  private listeners = new Set<Listener>();
  private initialized = false;

  init() {
    if (this.initialized || typeof window === "undefined") return;
    this.initialized = true;

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferred = e as BeforeInstallPromptEvent;
      this.notify();
    });

    window.addEventListener("appinstalled", () => {
      this.deferred = null;
      this.notify();
    });
  }

  private notify() {
    const can = this.canInstall();
    this.listeners.forEach((l) => l(can));
  }

  canInstall(): boolean {
    return this.deferred !== null;
  }

  /** Détecte si l'app est déjà installée et lancée en standalone. */
  isStandalone(): boolean {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    );
  }

  /** Détecte la plateforme : Android / iOS / Desktop. */
  platform(): "android" | "ios" | "desktop" {
    if (typeof navigator === "undefined") return "desktop";
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/i.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream) {
      return "ios";
    }
    if (/Android/i.test(ua)) return "android";
    return "desktop";
  }

  /** Déclenche le prompt natif Chrome/Android. Retourne true si accepté. */
  async prompt(): Promise<"accepted" | "dismissed" | "unavailable"> {
    if (!this.deferred) return "unavailable";
    try {
      await this.deferred.prompt();
      const choice = await this.deferred.userChoice;
      if (choice.outcome === "accepted") {
        this.deferred = null;
        this.notify();
      }
      return choice.outcome;
    } catch {
      return "dismissed";
    }
  }

  subscribe(l: Listener): () => void {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }
}

export const pwaInstall = new PwaInstallManager();
