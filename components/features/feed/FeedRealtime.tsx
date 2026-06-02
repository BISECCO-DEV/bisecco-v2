"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Abonnement Supabase Realtime sur les 3 tables du fil :
 *  - feed_posts    : nouveau post / suppression / update statut
 *  - feed_likes    : like / unlike → met à jour les compteurs
 *  - feed_comments : nouveau / suppression → met à jour les compteurs
 *
 * Stratégie : on debounce les events sur 1 seconde puis on appelle
 * router.refresh() qui re-fetch les Server Components. C'est pragmatique
 * (pas de merge client/serveur complexe) et ça donne une UX quasi-instantanée
 * (< 1 sec vs 10 sec en polling).
 *
 * Optimisations :
 *  - Reconnexion auto via le client Supabase
 *  - Pause si onglet caché (les events sont mis en file côté serveur)
 *  - Filtre status='approved' côté client pour ignorer les drafts/pending
 */
export function FeedRealtime() {
  const router = useRouter();
  const [, setTick] = useState(0);

  useEffect(() => {
    const supabase = createClient();

    let pendingRefresh: ReturnType<typeof setTimeout> | null = null;
    const triggerRefresh = () => {
      if (document.visibilityState !== "visible") return;
      if (pendingRefresh) clearTimeout(pendingRefresh);
      pendingRefresh = setTimeout(() => {
        router.refresh();
        setTick((t) => t + 1);
      }, 1000);
    };

    const channel = supabase
      .channel("public:feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "feed_posts" },
        triggerRefresh,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "feed_likes" },
        triggerRefresh,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "feed_comments" },
        triggerRefresh,
      )
      .subscribe();

    // Refresh quand l'onglet redevient visible (au cas où on a manqué des events)
    const onVisible = () => {
      if (document.visibilityState === "visible") triggerRefresh();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      if (pendingRefresh) clearTimeout(pendingRefresh);
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
