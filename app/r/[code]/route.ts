import { NextResponse, type NextRequest } from "next/server";

/**
 * Lien de parrainage : GET /r/[code]
 *
 * Pourquoi un Route Handler et pas une page : depuis Next.js 15, cookies().set()
 * n'est plus autorisé dans un Server Component (RSC). Seuls les Route Handlers,
 * Server Actions et middleware peuvent muter les cookies. La version précédente
 * en page.tsx levait une exception → 500 quand les invités cliquaient le lien.
 *
 * Stocke le code dans un cookie 30 jours puis redirige vers /inscription
 * avec le code en query string pour pré-remplir / tracker.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const cleanCode = code.trim().slice(0, 64);

  // En prod derrière le reverse proxy o2switch, `request.url` retourne l'URL
  // interne (ice.o2switch.net:3000). On utilise APP_URL (env) en priorité,
  // puis NEXT_PUBLIC_SITE_URL, et en dernier recours l'origin du request.
  const baseUrl =
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://bisecco.fr";

  const target = new URL(`/inscription?ref=${encodeURIComponent(cleanCode)}`, baseUrl);
  const response = NextResponse.redirect(target);

  response.cookies.set("bisecco_referral", cleanCode, {
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 jours
    path: "/",
  });

  return response;
}
