"use client";

import { useEffect, useRef, useState } from "react";
import {
  X, ExternalLink, Globe, Loader2, RotateCw, ArrowLeft, Lock,
} from "lucide-react";

/**
 * Viewer de lien externe DANS Bisecco — comme Facebook / Instagram qui
 * gardent l'utilisateur "in-app" quand il clique un lien.
 *
 * Stratégie hybride :
 *  1. Tente de charger le site dans une iframe Bisecco-brandée
 *  2. Si timeout 3 sec (ou si iframe reste vide) → fallback OG card avec
 *     bouton "Ouvrir dans le navigateur" (pour les sites qui bloquent l'embed
 *     via X-Frame-Options : La Poste, banques, Facebook, etc.)
 *
 * Header sticky Bisecco : flèche retour + favicon + domaine + bouton "Ouvrir externe"
 */

type Preview = {
  url: string;
  host: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon: string;
};

const IFRAME_TIMEOUT_MS = 3500;

export function InAppLinkViewer() {
  const [url, setUrl] = useState<string | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [embedChecked, setEmbedChecked] = useState(false);
  const [canEmbed, setCanEmbed] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Listen aux events
  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<{ url: string }>).detail;
      if (!detail?.url) return;
      setIframeLoaded(false);
      setBlocked(false);
      setEmbedChecked(false);
      setCanEmbed(false);
      setPreview(null);
      setUrl(detail.url);
    };
    window.addEventListener("bisecco:open-link", onOpen);
    return () => window.removeEventListener("bisecco:open-link", onOpen);
  }, []);

  // Pre-check : le site autorise-t-il l'iframe ? (X-Frame-Options + CSP)
  // Bascule direct sur OG card si bloqué — évite l'iframe vide
  useEffect(() => {
    if (!url) return;
    const ctrl = new AbortController();
    fetch(`/api/can-embed?url=${encodeURIComponent(url)}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((data: { canEmbed: boolean }) => {
        setCanEmbed(Boolean(data.canEmbed));
        if (!data.canEmbed) setBlocked(true);
      })
      .catch(() => setBlocked(true))
      .finally(() => setEmbedChecked(true));
    return () => ctrl.abort();
  }, [url]);

  // Fetch OG en parallèle (utilisé pour la carte de fallback)
  useEffect(() => {
    if (!url) return;
    const ctrl = new AbortController();
    fetch(`/api/link-preview?url=${encodeURIComponent(url)}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((data: Preview) => setPreview(data))
      .catch(() => {});
    return () => ctrl.abort();
  }, [url]);

  // Lock scroll
  useEffect(() => {
    if (!url) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [url]);

  // ESC pour fermer
  useEffect(() => {
    if (!url) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  // Filet de sécurité : si l'iframe est lancée mais ne charge pas en 3.5s → bloqué
  useEffect(() => {
    if (!url || !canEmbed || iframeLoaded || blocked) return;
    timeoutRef.current = setTimeout(() => {
      if (!iframeLoaded) setBlocked(true);
    }, IFRAME_TIMEOUT_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [url, canEmbed, iframeLoaded, blocked]);

  if (!url) return null;

  const close = () => {
    setUrl(null);
    setIframeLoaded(false);
    setBlocked(false);
    setPreview(null);
  };

  const reload = () => {
    setIframeLoaded(false);
    setBlocked(false);
    if (iframeRef.current) iframeRef.current.src = url;
  };

  const openExternal = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  let host = url;
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    /* ignore */
  }

  return (
    <div className="fixed inset-0 z-[100] bg-ink-900 flex flex-col animate-in fade-in duration-150">
      {/* TOP BAR Bisecco-brandée */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-white border-b border-ink-100 flex-shrink-0 shadow-sm">
        <button
          type="button"
          onClick={close}
          className="w-9 h-9 rounded-xl hover:bg-ink-100 text-ink-700 inline-flex items-center justify-center flex-shrink-0 transition"
          aria-label="Retour à Bisecco"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex-1 min-w-0 flex items-center gap-2 px-2 py-1 rounded-lg bg-ink-50">
          <Lock size={11} className="text-emerald-500 flex-shrink-0" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://www.google.com/s2/favicons?sz=32&domain=${encodeURIComponent(host)}`}
            alt=""
            className="w-3.5 h-3.5 flex-shrink-0 rounded-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="min-w-0">
            <div className="text-[0.78rem] font-bold text-ink-700 truncate leading-tight">{host}</div>
            <div className="text-[0.6rem] text-ink-400 truncate leading-tight">via Bisecco</div>
          </div>
        </div>

        {!blocked && (
          <button
            type="button"
            onClick={reload}
            className="w-9 h-9 rounded-xl hover:bg-ink-100 text-ink-500 inline-flex items-center justify-center flex-shrink-0 transition"
            aria-label="Recharger"
          >
            <RotateCw size={15} />
          </button>
        )}
        <button
          type="button"
          onClick={openExternal}
          className="w-9 h-9 rounded-xl hover:bg-ink-100 text-ink-500 inline-flex items-center justify-center flex-shrink-0 transition"
          aria-label="Ouvrir dans un nouvel onglet"
          title="Ouvrir dans un nouvel onglet"
        >
          <ExternalLink size={15} />
        </button>
        <button
          type="button"
          onClick={close}
          className="w-9 h-9 rounded-xl hover:bg-ink-100 text-ink-700 inline-flex items-center justify-center flex-shrink-0 transition"
          aria-label="Fermer"
        >
          <X size={18} />
        </button>
      </div>

      {/* CONTENU */}
      <div className="flex-1 relative bg-white overflow-hidden">
        {blocked ? (
          <BlockedFallback
            preview={preview}
            url={url}
            host={host}
            onClose={close}
            onOpenExternal={openExternal}
          />
        ) : !embedChecked || !canEmbed ? (
          // En attente du can-embed check (ou pas embeddable mais blocked pas encore set)
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
            <div className="w-10 h-10 rounded-full border-2 border-brand-200 border-t-brand-500 animate-spin" />
            <div className="mt-3 text-xs text-ink-500 font-semibold">
              Vérification de {host}…
            </div>
          </div>
        ) : (
          <>
            {!iframeLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 pointer-events-none">
                <div className="w-10 h-10 rounded-full border-2 border-brand-200 border-t-brand-500 animate-spin" />
                <div className="mt-3 text-xs text-ink-500 font-semibold">
                  Chargement de {host}…
                </div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={url}
              title={`Aperçu de ${host}`}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
              referrerPolicy="no-referrer"
              onLoad={() => setIframeLoaded(true)}
            />
          </>
        )}
      </div>
    </div>
  );
}

function BlockedFallback({
  preview,
  url,
  host,
  onClose,
  onOpenExternal,
}: {
  preview: Preview | null;
  url: string;
  host: string;
  onClose: () => void;
  onOpenExternal: () => void;
}) {
  return (
    <div className="absolute inset-0 overflow-y-auto bg-gradient-to-b from-ink-50 to-white">
      <div className="max-w-md mx-auto p-6 sm:p-8">
        <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(13,30,74,0.25)] border border-ink-100 overflow-hidden">
          {/* Image OG ou fallback */}
          <div className="relative w-full h-44 bg-gradient-to-br from-brand-100 to-ink-100 overflow-hidden">
            {preview?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview.image}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Globe size={56} className="text-ink-300" strokeWidth={1.5} />
              </div>
            )}
          </div>

          <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
              {preview?.favicon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview.favicon} alt="" className="w-4 h-4 rounded-sm" />
              )}
              <span className="text-[0.65rem] font-bold text-ink-500 uppercase tracking-wider">
                {preview?.siteName || host}
              </span>
            </div>
            <h3 className="font-extrabold text-ink-700 text-lg leading-snug">
              {preview?.title || host}
            </h3>
            {preview?.description && (
              <p className="mt-2 text-sm text-ink-500 leading-relaxed">
                {preview.description}
              </p>
            )}

            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
              <Lock size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-[0.78rem] text-amber-800 leading-snug">
                <strong>{host}</strong> ne permet pas d&apos;être affiché dans Bisecco (sécurité du site). Tu peux l&apos;ouvrir dans un nouvel onglet — Bisecco reste ouvert.
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenExternal}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition shadow-[0_8px_22px_-4px_rgba(240,122,47,0.45)]"
            >
              <ExternalLink size={15} />
              Ouvrir {host}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 w-full py-2 text-xs text-ink-500 hover:text-ink-700 font-semibold transition"
            >
              Retour au fil Bisecco
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
