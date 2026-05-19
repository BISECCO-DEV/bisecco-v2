import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// ─── COMING SOON GATE ───────────────────────────────────────────
// Active une vraie page d'attente : tout le site est inaccessible
// sauf si l'utilisateur a un cookie de bypass (code validé).
// Désactivable via la variable d'env COMING_SOON_ENABLED=false
const COMING_SOON_ENABLED = process.env.COMING_SOON_ENABLED !== "false";
const BYPASS_COOKIE = "bisecco_bypass";

// Routes toujours accessibles (même en coming-soon mode)
const PUBLIC_ROUTES = [
  "/coming-soon",
  "/auth/callback",
  "/api/", // toutes les API routes
  "/_next/",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Coming soon gate : si actif, redirige tout vers /coming-soon sauf bypass
  if (COMING_SOON_ENABLED) {
    const hasBypass = request.cookies.get(BYPASS_COOKIE)?.value === "ok";
    const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

    if (!hasBypass && !isPublic) {
      const url = request.nextUrl.clone();
      url.pathname = "/coming-soon";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  const response = await updateSession(request);

  // Headers sécurité (CSP, HSTS, etc.)
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self), payment=(self)"
  );

  // HSTS uniquement en prod (HTTPS)
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
    /*
     * Match toutes les routes SAUF :
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, robots.txt, sitemap.xml, llms.txt
     * - public assets (.svg, .png, .webp, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|llms.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
