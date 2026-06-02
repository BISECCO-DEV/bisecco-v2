"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { InviteButton } from "@/components/features/InviteButton";
import { isCapacitorApp } from "@/lib/native/platform";

/**
 * Bouton flottant "Inviter mes contacts" visible en permanence en bas à gauche
 * sur mobile (et bas à gauche desktop aussi, en plus discret).
 *
 * - Affiché uniquement si l'utilisateur est connecté (a un referralUrl)
 * - Caché sur les routes auth (connexion, inscription) et admin
 * - Caché en mode coming-soon (composant non chargé)
 * - Caché si une fenêtre de chat est ouverte sur mobile (anti-collision)
 */

type Props = {
  referralUrl: string | null;
};

const HIDDEN_PATHS = [
  "/connexion", "/inscription", "/recuperation-compte",
  "/reinitialiser-mot-de-passe", "/email-verifie", "/admin",
  "/forbidden", "/coming-soon", "/maintenance",
];

// URL de fallback si l'utilisateur n'est pas connecté ou n'a pas de referral_code.
// On invite quand même vers la home → tracking via UTM pour mesurer le viral organique.
const FALLBACK_URL = "https://bisecco.fr/?utm_source=invite&utm_medium=fab";

export function InviteFab({ referralUrl }: Props) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  if (isCapacitorApp()) return null;
  if (pathname && HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;

  // Toujours visible : si pas de referral, utilise une URL générique avec UTM
  const url = referralUrl ?? FALLBACK_URL;

  return (
    <div className="fixed bottom-4 left-4 z-[54] safe-area-bottom">
      <InviteButton
        referralUrl={url}
        variant="fab"
        label="Inviter"
      />
    </div>
  );
}
