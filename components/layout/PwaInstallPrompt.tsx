"use client";

import { useEffect, useState } from "react";
import { Download, X, Share2, Plus, Smartphone, Check, MoreVertical } from "lucide-react";
import { pwaInstall } from "@/lib/pwa/install";
import { isCapacitorApp } from "@/lib/native/platform";

/**
 * Popup centrée d'invite à installer l'app.
 * Apparaît automatiquement 4 sec après le chargement sur Android + iPhone.
 *
 * Logique :
 *  - iOS Safari       → bouton "Installer" → guide 3 étapes (Partager → Sur l'écran d'accueil)
 *  - Android Chrome   → si beforeinstallprompt dispo → install natif 1 clic
 *                       sinon → guide menu ⋮ → "Installer l'application"
 *  - Desktop          → pas de popup (sauf ?install=1 pour debug)
 *  - Cas filtrés      → déjà installée (standalone), app Capacitor, dismissed < 14j
 *
 * Forcer l'affichage : ajoute ?install=1 à n'importe quelle URL.
 */

const STORAGE_KEY = "bisecco_pwa_dismissed_v2";
const SHOW_DELAY_MS = 4000;

type Step = "intro" | "ios-guide" | "android-guide" | "installed";

export function PwaInstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<Step>("intro");
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop">("desktop");

  useEffect(() => {
    if (typeof window === "undefined") return;

    pwaInstall.init();
    if (pwaInstall.isStandalone()) return;
    if (isCapacitorApp()) return;

    const force =
      new URLSearchParams(window.location.search).get("install") === "1";

    if (!force) {
      const dismissedAt = localStorage.getItem(STORAGE_KEY);
      if (dismissedAt) {
        const days = (Date.now() - Number(dismissedAt)) / 86400000;
        if (days < 14) return;
      }
    }

    const p = pwaInstall.platform();
    setPlatform(p);

    // Desktop : seulement si forcé (debug)
    if (p === "desktop" && !force) return;

    // iOS + Android : popup garantie après 4 sec
    const t = setTimeout(() => setVisible(true), force ? 300 : SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setVisible(false);
    setStep("intro");
  };

  const handleInstall = async () => {
    if (platform === "ios") {
      setStep("ios-guide");
      return;
    }

    // Android : on tente le prompt natif
    if (pwaInstall.canInstall()) {
      const outcome = await pwaInstall.prompt();
      if (outcome === "accepted") {
        setStep("installed");
        setTimeout(close, 1800);
      } else if (outcome === "dismissed") {
        close();
      }
      return;
    }

    // Android sans beforeinstallprompt → fallback guide manuel
    setStep("android-guide");
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Installer l'application Bisecco"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink-900/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={close}
    >
      <div
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-[0_24px_70px_-10px_rgba(13,30,74,0.45)] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-ink-50/90 hover:bg-ink-100 text-ink-500 inline-flex items-center justify-center transition z-10"
          aria-label="Fermer"
        >
          <X size={16} />
        </button>

        {step === "installed" && <InstalledScreen />}
        {step === "ios-guide" && <IosGuide onClose={close} />}
        {step === "android-guide" && <AndroidGuide onClose={close} />}
        {step === "intro" && (
          <IntroScreen platform={platform} onInstall={handleInstall} onLater={close} />
        )}
      </div>
    </div>
  );
}

function IntroScreen({
  platform,
  onInstall,
  onLater,
}: {
  platform: "ios" | "android" | "desktop";
  onInstall: () => void;
  onLater: () => void;
}) {
  const ctaLabel = platform === "ios" ? "Voir comment installer" : "Installer maintenant";
  const hint =
    platform === "ios"
      ? "Sur iPhone — Safari uniquement"
      : platform === "android"
        ? "Sur Android — installation en 1 tap"
        : "Sur mobile, c'est encore mieux";

  return (
    <>
      <div className="bg-gradient-to-br from-brand-500 to-brand-600 px-6 pt-8 pb-6 text-center">
        <div className="w-20 h-20 rounded-3xl mx-auto overflow-hidden ring-4 ring-white/30 shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon-512.png" alt="Bisecco" className="w-full h-full object-cover" />
        </div>
        <h3 className="font-extrabold text-white text-xl mt-4">Installer Bisecco</h3>
        <p className="text-white/90 text-sm mt-1 leading-snug">
          Accède au site en 1 clic depuis ton écran d&apos;accueil, comme une vraie app.
        </p>
      </div>
      <div className="p-5 space-y-3">
        <div className="space-y-2">
          <Feature icon="⚡" text="Ouverture instantanée en plein écran" />
          <Feature icon="🔔" text="Notifications quand un client te contacte" />
          <Feature icon="📱" text="Icône sur ton écran d'accueil" />
          <Feature icon="💾" text="Marche même sans connexion" />
        </div>
        <button
          type="button"
          onClick={onInstall}
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition shadow-[0_8px_22px_-4px_rgba(240,122,47,0.55)]"
        >
          <Download size={16} />
          {ctaLabel}
        </button>
        <button
          type="button"
          onClick={onLater}
          className="w-full py-2 text-xs text-ink-500 hover:text-ink-700 font-semibold transition"
        >
          Plus tard
        </button>
        <div className="flex items-center justify-center gap-1.5 pt-1 text-[0.68rem] text-ink-400 font-semibold">
          <Smartphone size={11} />
          {hint}
        </div>
      </div>
    </>
  );
}

function IosGuide({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-6">
      <div className="text-center mb-5">
        <div className="w-16 h-16 rounded-2xl mx-auto overflow-hidden ring-2 ring-brand-100 mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon-512.png" alt="Bisecco" className="w-full h-full object-cover" />
        </div>
        <h3 className="font-extrabold text-ink-700 text-lg">Installer sur iPhone</h3>
        <p className="text-sm text-ink-500 mt-1">3 étapes simples</p>
      </div>
      <ol className="space-y-3">
        <StepLi n={1}>
          Appuie sur l&apos;icône{" "}
          <Chip>
            <Share2 size={11} /> Partager
          </Chip>{" "}
          en bas de Safari.
        </StepLi>
        <StepLi n={2}>
          Fais défiler et choisis{" "}
          <Chip>
            <Plus size={11} /> Sur l&apos;écran d&apos;accueil
          </Chip>
          .
        </StepLi>
        <StepLi n={3}>
          Appuie sur <strong>Ajouter</strong> en haut à droite. C&apos;est tout 🎉
        </StepLi>
      </ol>
      <button
        type="button"
        onClick={onClose}
        className="mt-5 w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition"
      >
        J&apos;ai compris
      </button>
    </div>
  );
}

function AndroidGuide({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-6">
      <div className="text-center mb-5">
        <div className="w-16 h-16 rounded-2xl mx-auto overflow-hidden ring-2 ring-brand-100 mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon-512.png" alt="Bisecco" className="w-full h-full object-cover" />
        </div>
        <h3 className="font-extrabold text-ink-700 text-lg">Installer sur Android</h3>
        <p className="text-sm text-ink-500 mt-1">2 étapes simples</p>
      </div>
      <ol className="space-y-3">
        <StepLi n={1}>
          Appuie sur le menu{" "}
          <Chip>
            <MoreVertical size={11} /> ⋮
          </Chip>{" "}
          en haut à droite de Chrome.
        </StepLi>
        <StepLi n={2}>
          Choisis <strong>Installer l&apos;application</strong> (ou <strong>Ajouter à l&apos;écran d&apos;accueil</strong>). C&apos;est tout 🎉
        </StepLi>
      </ol>
      <p className="mt-4 text-[0.72rem] text-ink-400 leading-snug">
        Astuce : utilise Chrome ou Edge. Sur certains navigateurs (Firefox, Samsung Internet), l&apos;option peut s&apos;appeler différemment.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-5 w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition"
      >
        J&apos;ai compris
      </button>
    </div>
  );
}

function InstalledScreen() {
  return (
    <div className="p-8 text-center">
      <div className="w-16 h-16 rounded-2xl mx-auto bg-emerald-50 inline-flex items-center justify-center mb-3">
        <Check size={32} className="text-emerald-500" strokeWidth={3} />
      </div>
      <h3 className="font-extrabold text-ink-700 text-lg">Bisecco installée !</h3>
      <p className="text-sm text-ink-500 mt-1">Retrouve l&apos;icône sur ton écran d&apos;accueil 🎉</p>
    </div>
  );
}

function Feature({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-ink-600">
      <span className="text-lg leading-none flex-shrink-0">{icon}</span>
      <span className="leading-tight">{text}</span>
    </div>
  );
}

function StepLi({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="w-7 h-7 rounded-full bg-brand-500 text-white inline-flex items-center justify-center font-bold text-xs flex-shrink-0">
        {n}
      </span>
      <div className="text-sm text-ink-600 leading-relaxed">{children}</div>
    </li>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-ink-100 font-semibold">
      {children}
    </span>
  );
}
