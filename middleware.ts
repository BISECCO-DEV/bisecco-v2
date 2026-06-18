import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// ─── COMING SOON GATE ───────────────────────────────────────────
const COMING_SOON_ENABLED = process.env.COMING_SOON_ENABLED !== "false";
const BYPASS_COOKIE = "bisecco_bypass";

// ─── MAINTENANCE GATE ────────────────────────────────────────────
// Si MAINTENANCE_ENABLED=true (env) → toggle FORCÉ ON (override admin DB).
// Sinon : on lit le flag dans la table public.site_settings, modifiable par l'admin.
const MAINTENANCE_ENV_FORCE = process.env.MAINTENANCE_ENABLED === "true";

/** Lit le flag maintenance depuis la DB via REST Supabase (compatible Edge).
 *  Cache HTTP 15s côté Next.js pour éviter de hit la DB à chaque requête. */
async function fetchMaintenanceFromDb(): Promise<boolean> {
  // Pendant le build statique, on ne hit pas la DB (sinon PageNotFoundError sur /_error).
  if (process.env.NEXT_PHASE === "phase-production-build") return false;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return false;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/site_settings?key=eq.maintenance_enabled&select=value`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        next: { revalidate: 15 },
      },
    );
    if (!res.ok) return false;
    const rows = (await res.json()) as { value: unknown }[];
    const v = rows[0]?.value;
    return v === true || v === "true";
  } catch {
    return false;
  }
}

const MAINTENANCE_PUBLIC_ROUTES = [
  "/maintenance",
  "/coming-soon", // permet de saisir le code bypass admin
  "/_next/",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
  "/api/",
];

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const PUBLIC_ROUTES = [
  "/coming-soon",
  "/connexion",
  "/inscription",
  "/recuperation-compte",
  "/reinitialiser-mot-de-passe",
  "/email-verifie",
  "/auth/callback",
  "/auth/exchange",
  "/api/",
  "/_next/",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
  "/r/", // Liens de parrainage : doivent être accessibles sans bypass coming-soon
];

// Routes accessibles uniquement aux membres connectés.
// Le visiteur anonyme est redirigé vers /connexion?redirect=...
const PROTECTED_PATHS = [
  "/mon-profil",
  "/messagerie",
  "/admin",
  "/fil",
  "/emploi",
  "/partenaires",
  "/contact",
];
const GUEST_ONLY_PATHS = ["/connexion", "/inscription"];

function isSupabaseConfigured(): boolean {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return false;
  if (/xxx|your-project|placeholder|example/i.test(SUPABASE_URL)) return false;
  if (SUPABASE_ANON_KEY.length < 40) return false;
  return true;
}

/** Recopie les cookies de `source` (réponse pass-through Supabase) sur `target` (redirect). */
function copyCookies(source: NextResponse, target: NextResponse): NextResponse {
  source.cookies.getAll().forEach((c) => {
    target.cookies.set(c);
  });
  return target;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 0. Force HTTPS + domaine canonique bisecco.fr ──
  // - Redirige http:// → https:// (sécurité critique)
  // - Redirige bisecco.com/.eu/.it → bisecco.fr (SEO + branding consolidé)
  // - Skip pour healthchecks et en dev
  if (process.env.NODE_ENV === "production") {
    const proto = request.headers.get("x-forwarded-proto");
    const host = request.headers.get("host") ?? request.nextUrl.host;
    const hostLower = host.toLowerCase();
    const isHttp = proto === "http";
    // Bisecco a plusieurs TLDs (.com .eu .it) qui doivent tous renvoyer sur .fr
    const isAltDomain =
      /^(?:www\.)?bisecco\.(com|eu|it)$/.test(hostLower) ||
      hostLower === "www.bisecco.fr";

    if (isHttp || isAltDomain) {
      const url = request.nextUrl.clone();
      url.protocol = "https:";
      url.host = "bisecco.fr";
      // Redirect 301 permanent · Google passe le PageRank au domaine canonique
      return NextResponse.redirect(url, 301);
    }
  }

  let response = NextResponse.next({ request });

  // ── 1. Refresh session Supabase + récupère le user ──
  let user: { id: string } | null = null;

  if (isSupabaseConfigured()) {
    const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const { data } = await supabase.auth.getUser();
    user = data.user ? { id: data.user.id } : null;
  }

  // ── 1.5. Maintenance gate : env force ON > DB setting ──
  const maintenanceFromDb = MAINTENANCE_ENV_FORCE ? false : await fetchMaintenanceFromDb();
  const maintenanceActive = MAINTENANCE_ENV_FORCE || maintenanceFromDb;

  if (maintenanceActive) {
    const hasBypass = request.cookies.get(BYPASS_COOKIE)?.value === "ok";
    const isPublic = MAINTENANCE_PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
    // Les admins connectés bypassent automatiquement pour pouvoir désactiver.
    const isAdminPath = pathname.startsWith("/admin");
    if (!hasBypass && !isPublic && !isAdminPath) {
      const url = request.nextUrl.clone();
      url.pathname = "/maintenance";
      url.search = "";
      return copyCookies(response, NextResponse.redirect(url));
    }
  }

  // ── 2. Coming-soon gate : authentifiés + bypass cookie + routes publiques passent ──
  // Les crawlers SEO/AI bypassent aussi pour permettre l'indexation et la citation.
  if (COMING_SOON_ENABLED && !user) {
    const hasBypass = request.cookies.get(BYPASS_COOKIE)?.value === "ok";
    const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
    const ua = request.headers.get("user-agent") ?? "";
    const isCrawler = /googlebot|bingbot|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebookexternalhit|twitterbot|linkedinbot|slackbot|whatsapp|telegrambot|gptbot|oai-searchbot|chatgpt-user|claudebot|claude-web|perplexitybot|perplexity-user|cohere-ai|google-extended|applebot|applebot-extended|amazonbot|bytespider|ccbot|petalbot|mojeekbot|seznambot|ahrefsbot|semrushbot|mj12bot|dotbot|rogerbot|screaming frog/i.test(ua);
    if (!hasBypass && !isPublic && !isCrawler) {
      const url = request.nextUrl.clone();
      url.pathname = "/coming-soon";
      url.search = "";
      return copyCookies(response, NextResponse.redirect(url));
    }
  }

  // ── 3. Routes protégées (auth obligatoire) ──
  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p)) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/connexion";
    url.searchParams.set("redirect", pathname);
    return copyCookies(response, NextResponse.redirect(url));
  }

  // ── 4. Guest-only : redirige les loggés hors de /connexion et /inscription ──
  if (GUEST_ONLY_PATHS.includes(pathname) && user) {
    return copyCookies(response, NextResponse.redirect(new URL("/mon-profil", request.url)));
  }

  // ── 5. Headers sécurité ──
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self), payment=(self)"
  );

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|llms.txt|\\.well-known|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
