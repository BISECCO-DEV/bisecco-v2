"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Info } from "lucide-react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("bsc_cookies")) {
      setVisible(true);
    }
  }, []);

  const choose = (choice: "accept" | "decline") => {
    localStorage.setItem("bsc_cookies", choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[min(780px,calc(100vw-2rem))] animate-slide-up">
      <div className="bg-ink-700 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm text-white/80 flex-1">
          <Info size={20} className="text-brand-500 flex-shrink-0" />
          <span>
            Nous utilisons des cookies pour améliorer votre expérience.{" "}
            <Link
              href="/politique-confidentialite"
              className="text-brand-500 font-bold hover:underline"
            >
              En savoir plus
            </Link>
          </span>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => choose("decline")}
            className="flex-1 sm:flex-initial px-5 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm font-bold hover:bg-white/10 transition"
          >
            Refuser
          </button>
          <button
            onClick={() => choose("accept")}
            className="flex-1 sm:flex-initial btn-primary text-sm py-2 px-5"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
