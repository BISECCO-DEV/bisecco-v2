/**
 * Sanitiseur HTML minimaliste pour le rendu sécurisé des articles de blog
 * via dangerouslySetInnerHTML.
 *
 * Pourquoi : le `content_html` de blog_articles est rentré en saisie libre par
 * l'admin. Un HTML mal formé (balises non fermées, balises dangereuses, etc.)
 * peut briser le layout (le </div> du user ferme prématurément le container
 * de la page et affiche le footer au milieu de l'article).
 *
 * Stratégie :
 * 1. Supprime entièrement les balises dangereuses (script, style, iframe, etc.)
 * 2. Supprime les balises de structure de page (html, body, header, footer, main, nav, aside)
 * 3. Convertit les balises non-whitelistées en simple texte
 * 4. Normalise les attributs (supprime onclick, onerror, etc.)
 * 5. Encadre le résultat pour qu'il ne puisse jamais "casser" la page parente
 */

// Tags autorisés (whitelist stricte)
const ALLOWED_TAGS = new Set([
  "p", "br", "hr",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "strong", "em", "b", "i", "u", "s", "mark", "small", "sub", "sup",
  "a",
  "ul", "ol", "li",
  "blockquote", "q", "cite",
  "code", "pre", "kbd", "samp",
  "img", "figure", "figcaption",
  "table", "thead", "tbody", "tfoot", "tr", "td", "th", "caption", "colgroup", "col",
  "div", "span",
]);

// Attributs autorisés par tag (whitelist)
const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel"]),
  img: new Set(["src", "alt", "title", "width", "height", "loading"]),
  th: new Set(["scope", "colspan", "rowspan"]),
  td: new Set(["colspan", "rowspan"]),
  blockquote: new Set(["cite"]),
};

/** Tags à supprimer ENTIÈREMENT avec leur contenu (script, style…) */
const STRIP_ENTIRELY = ["script", "style", "iframe", "object", "embed", "form", "input", "button", "select", "textarea", "link", "meta"];

/** Tags HTML structurels qu'on déplie en simple `div` pour éviter de casser la page */
const UNWRAP_TO_DIV = ["html", "body", "head", "header", "footer", "main", "nav", "aside", "section", "article"];

export function sanitizeBlogHtml(input: string): string {
  if (!input) return "";

  let html = input;

  // 1. Supprime entièrement les balises dangereuses avec leur contenu
  for (const tag of STRIP_ENTIRELY) {
    const re = new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi");
    html = html.replace(re, "");
    // Self-closing variants (script src=...)
    html = html.replace(new RegExp(`<${tag}[^>]*\\/?>`, "gi"), "");
  }

  // 2. Remplace les tags structurels par <div>
  for (const tag of UNWRAP_TO_DIV) {
    html = html.replace(new RegExp(`<${tag}\\b[^>]*>`, "gi"), "<div>");
    html = html.replace(new RegExp(`<\\/${tag}>`, "gi"), "</div>");
  }

  // 3. Supprime tous les attributs event handler (on*) et javascript:
  html = html.replace(/\s+on[a-z]+\s*=\s*"[^"]*"/gi, "");
  html = html.replace(/\s+on[a-z]+\s*=\s*'[^']*'/gi, "");
  html = html.replace(/href\s*=\s*"javascript:[^"]*"/gi, 'href="#"');
  html = html.replace(/href\s*=\s*'javascript:[^']*'/gi, "href='#'");

  // 4. Filtre les balises non-whitelistées (transformation en texte échappé)
  html = html.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (match, tagName) => {
    const lower = tagName.toLowerCase();
    if (ALLOWED_TAGS.has(lower)) {
      // Filtre les attributs selon la whitelist
      return filterAttrs(match, lower);
    }
    // Tag non-autorisé → on l'enlève complètement (pas d'échappement, juste supprimer)
    return "";
  });

  // 5. Force tous les liens externes à être nofollow + target=_blank
  html = html.replace(/<a\b([^>]*)>/gi, (_match, attrs: string) => {
    const cleanAttrs = attrs.replace(/\s+(target|rel)\s*=\s*"[^"]*"/gi, "");
    return `<a${cleanAttrs} target="_blank" rel="noopener noreferrer nofollow ugc">`;
  });

  return html;
}

function filterAttrs(openTag: string, tagName: string): string {
  // Pour les balises de fermeture
  if (openTag.startsWith("</")) return `</${tagName}>`;

  const allowed = ALLOWED_ATTRS[tagName];
  if (!allowed) return `<${tagName}>`;

  // Extrait les attrs name="value"
  const attrRegex = /([a-zA-Z-]+)\s*=\s*"([^"]*)"/g;
  let m: RegExpExecArray | null;
  const keptAttrs: string[] = [];
  while ((m = attrRegex.exec(openTag)) !== null) {
    const name = m[1].toLowerCase();
    if (allowed.has(name)) {
      // Valide les URLs pour éviter javascript:
      if ((name === "href" || name === "src") && /^\s*javascript:/i.test(m[2])) continue;
      keptAttrs.push(`${name}="${m[2].replace(/"/g, "&quot;")}"`);
    }
  }

  return `<${tagName}${keptAttrs.length ? " " + keptAttrs.join(" ") : ""}>`;
}
