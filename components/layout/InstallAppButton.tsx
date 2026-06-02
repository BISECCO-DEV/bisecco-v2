"use client";

import { useEffect, useState } from "react";
import { Download, Smartphone, Share2, Plus, X, Check } from "lucide-react";
import { pwaInstall } from "@/lib/pwa/install";
import { isCapacitorApp } from "@/lib/native/platform";

type Variant = "default" | "compact" | "menu";

type Props = {
  variant?: Variant;
  /** Si true, force l'affichage même quand l'app est déjà installée (utile pour debug). */
  alwaysShow?: boolean;
  className?: string;
};

/**
 * Bouton "Installer l'app" toujours visible (à mettre dans un menu, sidebar, footer, etc).
 * - Android : prompt natif via beforeinstallprompt
 * - iOS : ouvre une modale guide "Share → Sur l'écran d'accueil"
 * - Déjà installé : caché par défaut (sauf alwaysShow)
 */
export function InstallAppButton({ variant = "default", alwaysShow = false, className = "" }: Props) {
  const [mounted, setMounted] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [platform, setPlatform] = useState<"android" | "ios" | "desktop">("desktop");
  const [iosModal, setIosModal] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    pwaInstall.init();
    setPlatform(pwaInstall.platform());
    setInstalled(pwaInstall.isStandalone());
    setCanInstall(pwaInstall.canInstall());
    return pwaInstall.subscribe(setCanInstall);
  }, []);

  // Masque le bouton si déjà installé (sauf alwaysShow)
  if (!mounted) return null;
  if (installed && !alwaysShow) return null;
  // Dans l'app native Capacitor → cacher (déjà installé par définition)
  if (isCapacitorApp()) return null;

  // Caché sur desktop si le navigateur ne supporte pas l'install (sauf alwaysShow)
  if (platform === "desktop" && !canInstall && !alwaysShow) return null;

  const onClick = async () => {
    if (platform === "ios") {
      setIosModal(true);
      return;
    }
    if (canInstall) {
      const outcome = await pwaInstall.prompt();
      if (outcome === "accepted") {
        setToast("App installée ✓");
        setTimeout(() => setToast(null), 3000);
      }
    } else {
      // Fallback : explique selon la plateforme
      setToast(
        platform === "desktop"
          ? "Sur ordinateur, l'install est plus utile sur mobile. Scannez bisecco.fr depuis votre téléphone."
          : "Votre navigateur ne propose pas l'installation. Essayez Chrome/Safari à jour.",
      );
      setTimeout(() => setToast(null), 4000);
    }
  };

  const baseClasses = {
    default:
      "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition shadow-[0_6px_18px_-4px_rgba(240,122,47,0.5)]",
    compact:
      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition",
    menu:
      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-ink-700 hover:bg-brand-50 hover:text-brand-600 transition w-full",
  };

  return (
    <>
      <button type="button" onClick={onClick} className={`${baseClasses[variant]} ${className}`}>
        {variant === "menu" ? (
          <>
            <Smartphone size={15} />
            <span className="flex-1 text-left">Installer l&apos;app</span>
            <span className="px-1.5 py-0.5 rounded-full bg-brand-500 text-white text-[0.6rem] font-extrabold tracking-wider uppercase">
              {platform === "ios" ? "iOS" : platform === "android" ? "Android" : "PWA"}
            </span>
          </>
        ) : variant === "compact" ? (
          <>
            <Download size={13} /> Installer
          </>
        ) : (
          <>
            <Download size={15} /> Installer l&apos;app
          </>
        )}
      </button>

      {/* Toast feedback */}
      {toast && (
        <div className="fixed inset-x-0 bottom-4 z-[110] flex justify-center pointer-events-none">
          <div className="bg-ink-900 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 pointer-events-auto max-w-md">
            <Check size={14} className="text-emerald-400" />
            {toast}
          </div>
        </div>
      )}

      {/* Modale guide iOS */}
      {iosModal && (
        <div className="fixed inset-0 z-[110] bg-ink-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 relative">
            <button
              type="button"
              onClick={() => setIosModal(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-lg hover:bg-ink-100 text-ink-500 inline-flex items-center justify-center"
              aria-label="Fermer"
            >
              <X size={16} />
            </button>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl mx-auto overflow-hidden ring-2 ring-brand-100 mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icon-512.png" alt="Bisecco" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-extrabold text-ink-700 text-lg">Installer Bisecco sur iPhone</h3>
              <p className="text-sm text-ink-500 mt-1">3 étapes simples</p>
            </div>

            <ol className="mt-5 space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-brand-500 text-white inline-flex items-center justify-center font-bold text-xs flex-shrink-0">
                  1
                </span>
                <div className="text-sm text-ink-600 leading-relaxed">
                  Appuie sur l&apos;icône{" "}
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-ink-100 font-semibold">
                    <Share2 size={11} /> Partager
                  </span>{" "}
                  en bas de Safari.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-brand-500 text-white inline-flex items-center justify-center font-bold text-xs flex-shrink-0">
                  2
                </span>
                <div className="text-sm text-ink-600 leading-relaxed">
                  Fais défiler et choisis{" "}
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-ink-100 font-semibold">
                    <Plus size={11} /> Sur l&apos;écran d&apos;accueil
                  </span>
                  .
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-brand-500 text-white inline-flex items-center justify-center font-bold text-xs flex-shrink-0">
                  3
                </span>
                <div className="text-sm text-ink-600 leading-relaxed">
                  Appuie sur <strong>Ajouter</strong> en haut à droite. C&apos;est tout 🎉
                </div>
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setIosModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition"
            >
              J&apos;ai compris
            </button>
          </div>
        </div>
      )}
    </>
  );
}
