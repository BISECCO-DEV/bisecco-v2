import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// ─── COMING SOON GATE ───────────────────────────────────────────
const COMING_SOON_ENABLED = process.env.COMING_SOON_ENABLED !== "false";
const BYPASS_COOKIE = "bisecco_bypass";

// ─── MAINTENANCE GATE ────────────────────────────────────────────
// Si MAINTENANCE_ENABLED=true → tout le monde est redirigé vers /maintenance
// (sauf cookie bypass via /coming-soon avec le code admin).
const MAINTENANCE_ENABLED = process.env.MAINTENANCE_ENABLED === "true";

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
];

const PROTECTED_PATHS = ["/mon-profil", "/messagerie", "/admin"];
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

  // ── 1.5. Maintenance gate : prioritaire, bloque TOUT le monde (sauf bypass cookie) ──
  if (MAINTENANCE_ENABLED) {
    const hasBypass = request.cookies.get(BYPASS_COOKIE)?.value === "ok";
    const isPublic = MAINTENANCE_PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
    if (!hasBypass && !isPublic) {
      const url = request.nextUrl.clone();
      url.pathname = "/maintenance";
      url.search = "";
      return copyCookies(response, NextResponse.redirect(url));
    }
  }

  // ── 2. Coming-soon gate : authentifiés + bypass cookie + routes publiques passent ──
  if (COMING_SOON_ENABLED && !user) {
    const hasBypass = request.cookies.get(BYPASS_COOKIE)?.value === "ok";
    const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
    if (!hasBypass && !isPublic) {
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
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|llms.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
