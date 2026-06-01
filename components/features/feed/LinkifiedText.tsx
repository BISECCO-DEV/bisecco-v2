import React from "react";
import Link from "next/link";

const URL_REGEX = /(https?:\/\/[^\s<>"']+)/gi;

// Domaines considérés comme "internes" → navigation in-app (Next.js Link)
const INTERNAL_HOSTS = new Set(["bisecco.eu", "www.bisecco.eu", "bisecco.fr", "www.bisecco.fr"]);

function isInternalUrl(url: string): { internal: boolean; path?: string } {
  try {
    const u = new URL(url);
    if (INTERNAL_HOSTS.has(u.hostname.toLowerCase())) {
      return { internal: true, path: u.pathname + u.search + u.hash };
    }
  } catch {
    // URL invalide
  }
  return { internal: false };
}

/**
 * Affiche du texte en transformant les URLs en liens cliquables.
 * - URLs internes (bisecco.eu / bisecco.fr) → Next.js Link, navigation in-app sans rechargement
 * - URLs externes → <a target="_blank">
 *
 * Sécurisé : pas de dangerouslySetInnerHTML, tout passe par des nodes React.
 */
export function LinkifiedText({ children, className }: { children: string; className?: string }) {
  const parts = children.split(URL_REGEX);

  return (
    <p className={className}>
      {parts.map((part, i) => {
        if (URL_REGEX.test(part)) {
          URL_REGEX.lastIndex = 0;
          // Nettoyage ponctuation trailing
          const trail = part.match(/[.,;!?)\]]+$/)?.[0] ?? "";
          const url = trail ? part.slice(0, -trail.length) : part;
          const { internal, path } = isInternalUrl(url);

          if (internal && path) {
            // Lien interne · ouvre dans la même fenêtre, comme Facebook → soft navigation
            return (
              <React.Fragment key={i}>
                <Link
                  href={path}
                  className="text-brand-600 font-semibold hover:underline break-all"
                >
                  {url}
                </Link>
                {trail}
              </React.Fragment>
            );
          }

          // Lien externe · nouvel onglet
          return (
            <React.Fragment key={i}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer nofollow ugc"
                className="text-brand-600 font-semibold hover:underline break-all"
              >
                {url}
              </a>
              {trail}
            </React.Fragment>
          );
        }
        URL_REGEX.lastIndex = 0;
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </p>
  );
}
