"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCw } from "lucide-react";

/** Bouton "Actualiser" pour relancer les health checks (re-render serveur). */
export function HealthRefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [spinning, setSpinning] = useState(false);

  const refresh = () => {
    setSpinning(true);
    startTransition(() => {
      router.refresh();
      // Laisse l'animation tourner le temps du re-fetch
      setTimeout(() => setSpinning(false), 1200);
    });
  };

  return (
    <button
      type="button"
      onClick={refresh}
      disabled={isPending}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ink-900 text-white text-sm font-bold hover:bg-ink-800 transition disabled:opacity-60"
    >
      <RotateCw size={14} className={spinning ? "animate-spin" : ""} />
      Actualiser
    </button>
  );
}
