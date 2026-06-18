"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type State = "idle" | "loading" | "enabled" | "denied" | "unsupported" | "error";

/**
 * Convertit la clé publique VAPID (base64url) en Uint8Array.
 * Requis par PushManager.subscribe().
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) output[i] = raw.charCodeAt(i);
  return output;
}

export function EnableNotificationsButton({
  vapidPublicKey,
  className = "",
}: {
  vapidPublicKey: string | undefined;
  className?: string;
}) {
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Détection initiale : déjà abonné ? bloqué ? unsupported ?
  useEffect(() => {
    let cancelled = false;

    async function checkInitial() {
      if (typeof window === "undefined") return;
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        if (!cancelled) setState("unsupported");
        return;
      }
      if (Notification.permission === "denied") {
        if (!cancelled) setState("denied");
        return;
      }
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub && !cancelled) setState("enabled");
      } catch {
        // ignore
      }
    }
    checkInitial();
    return () => { cancelled = true; };
  }, []);

  const subscribe = async () => {
    if (!vapidPublicKey) {
      setErrorMsg("Push non configurée — VAPID manquante.");
      setState("error");
      return;
    }
    setState("loading");
    setErrorMsg(null);

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState("denied");
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      // Désabonne d'abord toute ancienne subscription (évite les doublons après changement VAPID)
      const existing = await reg.pushManager.getSubscription();
      if (existing) await existing.unsubscribe();

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
      });

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Erreur serveur");
      }
      setState("enabled");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Erreur");
      setState("error");
    }
  };

  const unsubscribe = async () => {
    setState("loading");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        const endpoint = sub.endpoint;
        await sub.unsubscribe();
        await fetch(`/api/push/subscribe?endpoint=${encodeURIComponent(endpoint)}`, {
          method: "DELETE",
        });
      }
      setState("idle");
    } catch {
      setState("error");
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────
  if (state === "unsupported") {
    return (
      <div className={`flex items-center gap-2 text-xs text-ink-400 ${className}`}>
        <BellOff size={14} /> Notifications non supportées sur ce navigateur
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div className={`flex items-start gap-2 text-xs text-ink-500 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 ${className}`}>
        <AlertCircle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <span>
          Notifications bloquées. Va dans les réglages du navigateur (icône cadenas dans la barre d&apos;adresse) pour les autoriser.
        </span>
      </div>
    );
  }

  if (state === "enabled") {
    return (
      <button
        type="button"
        onClick={unsubscribe}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm hover:bg-emerald-100 transition ${className}`}
      >
        <CheckCircle2 size={14} /> Notifications activées (cliquer pour désactiver)
      </button>
    );
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={subscribe}
        disabled={state === "loading"}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition disabled:opacity-50"
      >
        {state === "loading" ? (
          <><Loader2 size={14} className="animate-spin" /> Activation…</>
        ) : (
          <><Bell size={14} /> Activer les notifications</>
        )}
      </button>
      {errorMsg && (
        <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle size={12} /> {errorMsg}
        </p>
      )}
    </div>
  );
}
