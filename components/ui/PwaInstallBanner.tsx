"use client";

import { useEffect, useState } from "react";
import { Download, Share, X, Smartphone } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const STORAGE_KEY = "bisecco-pwa-dismissed-until";
const SHOW_DELAY_MS = 8000; // 8 sec après chargement
const SNOOZE_DAYS = 30;

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  // iOS Safari
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window.navigator as any).standalone === true) return true;
  // Chrome / Edge / Firefox
  return window.matchMedia("(display-mode: standalone)").matches;
}

function detectPlatform(): "ios" | "android" | "other" {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua) && !/MSStream/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "other";
}

function isDismissed(): boolean {
  if (typeof window === "undefined") return true;
  const until = window.localStorage.getItem(STORAGE_KEY);
  if (!until) return false;
  return Date.now() < parseInt(until, 10);
}

function dismissFor(days: number) {
  const until = Date.now() + days * 86400000;
  window.localStorage.setItem(STORAGE_KEY, String(until));
}

export function PwaInstallBanner() {
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "other">("other");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Skip si déjà installé ou dismissed récemment
    if (isStandalone() || isDismissed()) return;

    const p = detectPlatform();
    setPlatform(p);

    if (p === "other") return; // Pas de prompt sur desktop

    // Sur Android : capture l'event natif
    if (p === "android") {
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setTimeout(() => setVisible(true), SHOW_DELAY_MS);
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }

    // Sur iOS : on affiche le banner custom après délai (pas d'API native)
    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setVisible(false);
      } else {
        dismissFor(SNOOZE_DAYS);
        setVisible(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    dismissFor(SNOOZE_DAYS);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-[100px] sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-[60] animate-reveal-up"
      role="dialog"
      aria-label="Installer Bisecco"
    >
      <div className="relative bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(13,30,74,0.30)] border border-sand-200 p-5 overflow-hidden">
        {/* Halo brand */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-brand-500/10 blur-2xl pointer-events-none" aria-hidden />

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Fermer"
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full hover:bg-sand-100 grid place-items-center text-ink-400 hover:text-ink-700 transition"
        >
          <X size={14} />
        </button>

        <div className="relative flex items-start gap-3.5 pr-6">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-orange-300 grid place-items-center text-white flex-shrink-0 shadow-[0_4px_12px_rgba(240,122,47,0.35)]">
            <Smartphone size={18} strokeWidth={2.2} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-[0.96rem] text-ink-900 leading-tight">
              Installer Bisecco
            </h3>
            <p className="text-[0.78rem] text-ink-500 mt-1 leading-relaxed">
              {platform === "ios"
                ? "Ajoutez Bisecco à votre écran d'accueil pour un accès direct."
                : "Accédez aux artisans, messages et devis en un clic depuis votre écran d'accueil."}
            </p>

            {platform === "android" ? (
              <button
                type="button"
                onClick={handleInstall}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-tl-lg rounded-tr-lg rounded-br-lg bg-brand-500 text-white font-semibold text-[0.82rem] hover:bg-brand-600 hover:-translate-y-0.5 transition shadow-[0_6px_16px_-4px_rgba(240,122,47,0.45)]"
              >
                <Download size={14} strokeWidth={2.4} />
                Installer maintenant
              </button>
            ) : (
              <div className="mt-3 text-[0.74rem] text-ink-600 bg-sand-50 rounded-lg p-2.5 leading-relaxed">
                Touchez{" "}
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white border border-sand-200 font-semibold">
                  <Share size={11} /> Partager
                </span>
                {" "}puis{" "}
                <strong className="text-ink-900">« Ajouter à l&apos;écran d&apos;accueil »</strong>.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
