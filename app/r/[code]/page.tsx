import { redirect } from "next/navigation";
import { cookies } from "next/headers";

/**
 * Lien de parrainage : /r/[code]
 * Stocke le code dans un cookie puis redirige vers /inscription.
 * Le cookie dure 30 jours pour pouvoir attribuer la conversion même si l'user revient plus tard.
 */
export default async function ReferralRedirect({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const cleanCode = code.trim().slice(0, 64);

  const cookieStore = await cookies();
  cookieStore.set("bisecco_referral", cleanCode, {
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 jours
    path: "/",
  });

  redirect(`/inscription?ref=${encodeURIComponent(cleanCode)}`);
}
