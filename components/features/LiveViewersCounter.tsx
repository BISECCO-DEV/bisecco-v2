"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  /** Identifiant unique du profil consulté (ex: client_number ou id user). */
  profileKey: string;
  /** Cache pas tant que le count est <2 (un utilisateur ne se voit pas en double). */
  minToShow?: number;
};

/**
 * Compteur de viewers en temps réel via Supabase Realtime Presence.
 * Pas de table SQL nécessaire · la présence est gérée en mémoire par le channel.
 * Disparaît si seul (= 1 viewer = l'utilisateur lui-même).
 */
export function LiveViewersCounter({ profileKey, minToShow = 2 }: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!profileKey) return;

    const supabase = createClient();
    const channel = supabase.channel(`profile-presence-${profileKey}`, {
      config: {
        presence: { key: `viewer-${Math.random().toString(36).slice(2)}` },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const total = Object.keys(state).length;
        setCount(total);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ at: Date.now() });
        }
      });

    return () => {
      channel.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [profileKey]);

  if (count < minToShow) return null;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[0.78rem] font-semibold">
      <span className="relative flex w-2 h-2">
        <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
        <span className="relative inline-flex rounded-full w-2 h-2 bg-emerald-500" />
      </span>
      <Eye size={12} strokeWidth={2.4} />
      {count} personne{count > 1 ? "s" : ""} consulte{count > 1 ? "nt" : ""} ce profil
    </div>
  );
}
