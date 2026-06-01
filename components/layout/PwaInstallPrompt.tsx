"use client";

import { useEffect, useState } from "react";
import { Download, X, Share2, Plus } from "lucide-react";
import { pwaInstall } from "@/lib/pwa/install";

/**
 * Bandeau d'invite à installer · auto-affiché 6-10s après le chargement.
 * - Android : déclenche le prompt natif via pwaInstall.prompt()
 * - iOS : ouvre la modale guide
 * - Caché si déjà installé ou refusé il y a moins de 14 jours
 *
 * Note : utilise le même singleton pwaInstall que le bouton manuel
 * pour garantir un seul état partagé.
 */

const STORAGE_KEY = "bisecco_pwa_dismissed";

export function PwaInstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [iosGuideOpen, setIosGuideOpen] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop">("desktop");

  useEffect(() => {
    if (typeof window === "undefined") return;

    pwaInstall.init();
    if (pwaInstall.isStandalone()) return;

    const dismissedAt = localStorage.getItem(STORAGE_KEY);
    if (dismissedAt) {
      const days = (Date.now() - Number(dismissedAt)) / 86400000;
      if (days < 14) return;
    }

    const p = pwaInstall.platform();
    setPlatform(p);

    if (p === "android") {
      // Attends que le prompt soit dispo
      const unsub = pwaInstall.subscribe((can) => {
        if (can) setTimeout(() => setVisible(true), 6000);
      });
      // Cas où l'event est déjà fired avant montage
      if (pwaInstall.canInstall()) setTimeout(() => setVisible(true), 6000);
      return unsub;
    }

    if (p === "ios") {
      const t = setTimeout(() => setVisible(true), 10000);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setVisible(false);
    setIosGuideOpen(false);
  };

  const install = async () => {
    if (platform === "ios") {
      setIosGuideOpen(true);
      return;
    }
    const outcome = await pwaInstall.prompt();
    if (outcome === "accepted") setVisible(false);
    else if (outcome === "dismissed") dismiss();
  };

  if (!visible) return null;

  return (
    <>
      <div
        role="dialog"
        aria-label="Installer Bisecco sur votre écran d'accueil"
        className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 sm:px-4 sm:pb-4 pointer-events-none animate-in slide-in-from-bottom-2 duration-500"
      >
        <div className="mx-auto max-w-md pointer-events-auto">
          <div className="bg-white rounded-2xl border border-ink-100 shadow-[0_18px_50px_-15px_rgba(13,30,74,0.35)] p-4 flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-brand-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon-app.png" alt="Bisecco" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-ink-700 text-sm leading-tight">Installer Bisecco</div>
              <p className="text-[0.78rem] text-ink-500 mt-0.5 leading-snug">
                {platform === "ios"
                  ? "Ajoute Bisecco à ton écran d'accueil pour y accéder en un clic."
                  : "Accède au site en un clic depuis ton écran d'accueil, comme une vraie app."}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={install}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition"
                >
                  <Download size={13} /> Installer
                </button>
                <button
                  type="button"
                  onClick={dismiss}
                  className="px-2 py-1.5 text-xs text-ink-500 hover:text-ink-700 font-semibold transition"
                >
                  Plus tard
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={dismiss}
              className="text-ink-400 hover:text-ink-600 flex-shrink-0"
              aria-label="Fermer"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>

      {iosGuideOpen && (
        <div className="fixed inset-0 z-[100] bg-ink-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 relative">
            <button
              type="button"
              onClick={dismiss}
              className="absolute top-3 right-3 w-8 h-8 rounded-lg hover:bg-ink-100 text-ink-500 inline-flex items-center justify-center"
              aria-label="Fermer"
            >
              <X size={16} />
            </button>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl mx-auto overflow-hidden ring-2 ring-brand-100 mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icon-app.png" alt="Bisecco" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-extrabold text-ink-700 text-lg">Installer Bisecco sur iPhone</h3>
              <p className="text-sm text-ink-500 mt-1">3 étapes simples</p>
            </div>
            <ol className="mt-5 space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-brand-500 text-white inline-flex items-center justify-center font-bold text-xs flex-shrink-0">1</span>
                <div className="text-sm text-ink-600 leading-relaxed">
                  Appuie sur l&apos;icône{" "}
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-ink-100 font-semibold">
                    <Share2 size={11} /> Partager
                  </span>{" "}
                  en bas de Safari.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-brand-500 text-white inline-flex items-center justify-center font-bold text-xs flex-shrink-0">2</span>
                <div className="text-sm text-ink-600 leading-relaxed">
                  Choisis{" "}
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-ink-100 font-semibold">
                    <Plus size={11} /> Sur l&apos;écran d&apos;accueil
                  </span>
                  .
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-brand-500 text-white inline-flex items-center justify-center font-bold text-xs flex-shrink-0">3</span>
                <div className="text-sm text-ink-600 leading-relaxed">
                  Appuie sur <strong>Ajouter</strong> en haut à droite. C&apos;est tout 🎉
                </div>
              </li>
            </ol>
            <button
              type="button"
              onClick={dismiss}
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
