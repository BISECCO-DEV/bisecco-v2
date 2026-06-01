import React from "react";

const URL_REGEX = /(https?:\/\/[^\s<>"']+)/gi;

/**
 * Affiche du texte en transformant les URLs en liens cliquables.
 * Sécurisé contre XSS : on ne touche jamais à dangerouslySetInnerHTML,
 * tout passe par des nodes React.
 */
export function LinkifiedText({ children, className }: { children: string; className?: string }) {
  // Split par URL · les groupes capturés via () sont gardés dans l'array
  const parts = children.split(URL_REGEX);

  return (
    <p className={className}>
      {parts.map((part, i) => {
        if (URL_REGEX.test(part)) {
          // Reset regex global pour le prochain test
          URL_REGEX.lastIndex = 0;
          // Nettoyage : retire ponctuation trailing courante (. , ; ) ! ?)
          const trail = part.match(/[.,;!?)\]]+$/)?.[0] ?? "";
          const url = trail ? part.slice(0, -trail.length) : part;
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
