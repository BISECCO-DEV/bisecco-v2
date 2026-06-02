"use client";

import { useState, useTransition } from "react";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";
import { toggleFollowAction } from "@/lib/follows/actions";

type Props = {
  targetUserId: number;
  initialFollowing: boolean;
  initialFollowerCount: number;
  /** True si l'utilisateur courant est connecté */
  canFollow: boolean;
  /** True si l'utilisateur regarde son propre profil → bouton masqué */
  isOwnProfile: boolean;
  /** Style du bouton : "primary" = orange plein, "outline" = bordure */
  variant?: "primary" | "outline";
};

/**
 * Bouton "Suivre / Abonné" type X/LinkedIn pour les profils.
 *
 * - Non connecté → redirect /connexion avec retour
 * - Sur son propre profil → null
 * - Sinon → toggle abonnement avec update optimiste + compteur live
 */
export function FollowButton({
  targetUserId,
  initialFollowing,
  initialFollowerCount,
  canFollow,
  isOwnProfile,
  variant = "primary",
}: Props) {
  const [following, setFollowing] = useState(initialFollowing);
  const [count, setCount] = useState(initialFollowerCount);
  const [hover, setHover] = useState(false);
  const [pending, startTransition] = useTransition();

  if (isOwnProfile) return null;

  const onClick = () => {
    if (!canFollow) {
      window.location.href = `/connexion?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    // Optimistic
    const wasFollowing = following;
    setFollowing(!wasFollowing);
    setCount((c) => c + (wasFollowing ? -1 : 1));

    startTransition(async () => {
      const res = await toggleFollowAction(targetUserId);
      if (!res.ok) {
        // Rollback
        setFollowing(wasFollowing);
        setCount((c) => c + (wasFollowing ? 1 : -1));
        return;
      }
      setFollowing(res.following);
    });
  };

  // ─── Styles selon état + variante ───
  let className = "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition";
  let label: React.ReactNode;
  let icon: React.ReactNode;

  if (following) {
    icon = hover ? <UserPlus size={15} className="rotate-45" /> : <UserCheck size={15} />;
    label = hover ? "Se désabonner" : "Abonné";
    className += hover
      ? " bg-red-50 text-red-600 border-2 border-red-200"
      : " bg-emerald-50 text-emerald-700 border-2 border-emerald-200";
  } else {
    icon = <UserPlus size={15} />;
    label = "Suivre";
    className += variant === "primary"
      ? " bg-brand-500 hover:bg-brand-600 text-white shadow-[0_6px_18px_-4px_rgba(240,122,47,0.5)]"
      : " bg-white border-2 border-brand-500 text-brand-600 hover:bg-brand-50";
  }

  if (pending) className += " opacity-70 cursor-wait";

  return (
    <div className="inline-flex flex-col items-center gap-1.5">
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        disabled={pending}
        className={className}
        aria-pressed={following}
      >
        {pending ? <Loader2 size={15} className="animate-spin" /> : icon}
        {label}
      </button>
      <span className="text-[0.72rem] text-ink-500 font-semibold tabular-nums">
        {count} abonné{count > 1 ? "s" : ""}
      </span>
    </div>
  );
}
