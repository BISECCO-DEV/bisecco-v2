import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Détecte si Supabase est réellement configuré (pas juste des placeholders) */
function isSupabaseConfigured(): boolean {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return false;
  // Skip si URL contient des placeholders (xxx, your-project, etc.)
  if (/xxx|your-project|placeholder|example/i.test(SUPABASE_URL)) return false;
  if (SUPABASE_ANON_KEY.length < 40) return false;
  return true;
}

/** Refresh la session Supabase côté middleware (cookies) */
export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });

  // Mode démo (Supabase non configuré) : pas de redirect, accès libre à tout
  if (!isSupabaseConfigured()) {
    return response;
  }

  let response2 = response;
  const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response2 = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response2.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const protectedPaths = ["/mon-profil", "/messagerie", "/admin"];
  const isProtected = protectedPaths.some((p) =>
    request.nextUrl.pathname.startsWith(p)
  );

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/connexion";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  const guestOnlyPaths = ["/connexion", "/inscription"];
  const isGuestOnly = guestOnlyPaths.some(
    (p) => request.nextUrl.pathname === p
  );

  if (isGuestOnly && user) {
    return NextResponse.redirect(new URL("/mon-profil", request.url));
  }

  return response2;
}
