"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleFavoriteAction } from "@/lib/favorites/actions";

type Props = {
  artisanId: number;
  initialFavorited: boolean;
  /** Affichage compact (icône seule) ou avec label */
  compact?: boolean;
  /** Surcharge du className conteneur si besoin */
  className?: string;
};

/**
 * Bouton ❤️ favori avec toggle optimiste + Server Action.
 * Si non-authentifié, redirige vers /connexion.
 */
export function FavoriteButton({ artisanId, initialFavorited, compact = false, className }: Props) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const toggle = () => {
    setError(null);
    startTransition(async () => {
      const prev = favorited;
      setFavorited(!prev); // optimistic
      const res = await toggleFavoriteAction(artisanId);
      if (res.error) {
        setFavorited(prev); // rollback
        setError(res.error);
        if (res.error.includes("Connexion")) {
          window.location.href = `/connexion?next=/profil/${artisanId}`;
        }
      } else {
        setFavorited(res.favorited);
      }
    });
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        className={className ?? "w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-ink-700 hover:bg-white shadow-card transition disabled:opacity-50"}
        aria-label={favorited ? "Retirer des favoris" : "Sauvegarder"}
        title={favorited ? "Retirer des favoris" : "Sauvegarder"}
      >
        <Heart size={16} fill={favorited ? "#f07a2f" : "none"} className={favorited ? "text-brand-500" : ""} />
      </button>
    );
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition disabled:opacity-50 ${
          favorited
            ? "bg-brand-50 border-2 border-brand-500 text-brand-600"
            : "bg-white border-2 border-ink-200 text-ink-700 hover:border-brand-500"
        }`}
      >
        <Heart size={14} fill={favorited ? "#f07a2f" : "none"} />
        {favorited ? "Sauvegardé" : "Sauvegarder"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
