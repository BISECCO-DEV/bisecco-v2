"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

type Choice = "accept" | "essential" | "decline";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("bsc_cookies")) {
      setVisible(true);
    }
  }, []);

  const choose = (choice: Choice) => {
    localStorage.setItem("bsc_cookies", choice);
    localStorage.setItem("bsc_cookies_at", new Date().toISOString());
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Préférences cookies"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 pointer-events-none"
    >
      <div className="mx-auto max-w-3xl pointer-events-auto">
        <div className="bg-white border border-ink-100 rounded-2xl shadow-[0_20px_60px_-15px_rgba(13,30,74,0.25)] p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0">
              <Cookie size={18} className="text-brand-500" strokeWidth={2.2} />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-ink-700 tracking-tight">
                Vos préférences cookies
              </h2>
              <p className="text-[0.82rem] text-ink-500 leading-relaxed mt-1">
                Bisecco utilise des cookies pour assurer le fonctionnement du site, mesurer l&apos;audience et
                améliorer votre expérience. Vous pouvez accepter, refuser ou n&apos;autoriser que les cookies
                essentiels.{" "}
                <Link
                  href="/politique-confidentialite"
                  className="text-brand-500 font-semibold hover:underline whitespace-nowrap"
                >
                  En savoir plus
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
            <button
              type="button"
              onClick={() => choose("decline")}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-ink-500 hover:text-ink-700 hover:bg-ink-50 transition order-3 sm:order-1"
            >
              Refuser
            </button>
            <button
              type="button"
              onClick={() => choose("essential")}
              className="px-4 py-2.5 rounded-lg border border-ink-200 text-sm font-semibold text-ink-700 hover:border-ink-300 hover:bg-ink-50 transition order-2"
            >
              Essentiels uniquement
            </button>
            <button
              type="button"
              onClick={() => choose("accept")}
              className="px-5 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-bold hover:bg-brand-600 transition shadow-[0_6px_16px_-4px_rgba(240,122,47,0.4)] order-1 sm:order-3"
            >
              Tout accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
