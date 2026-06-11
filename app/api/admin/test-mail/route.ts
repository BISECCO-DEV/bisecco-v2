import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mail/mailer";
import { requireDbAdmin } from "@/lib/auth/current-user";

/**
 * Diagnostic SMTP — admin uniquement.
 *
 * GET /api/admin/test-mail?to=ton@email.com
 *
 * Envoie un email de test depuis le serveur de prod et retourne le résultat
 * détaillé (success + messageId, ou erreur SMTP exacte).
 *
 * Utile pour vérifier en 5 sec si SMTP fonctionne sans passer par tout le
 * flux d'inscription.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // Auth admin via le système Bisecco
  try {
    await requireDbAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden (admin only)" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const to = searchParams.get("to") || "contact@bisecco.fr";

  // Inventaire des env vars (pour debug)
  const envStatus = {
    SMTP_HOST: process.env.SMTP_HOST ? "✅ set" : "❌ missing",
    SMTP_PORT: process.env.SMTP_PORT ?? "(default 465)",
    SMTP_USER: process.env.SMTP_USER ? "✅ set" : "❌ missing",
    SMTP_PASSWORD: process.env.SMTP_PASSWORD ? `✅ set (${process.env.SMTP_PASSWORD.length} chars)` : "❌ missing",
    MAIL_FROM: process.env.MAIL_FROM ?? "(default contact@bisecco.fr)",
    APP_URL: process.env.APP_URL ?? "(default https://bisecco.fr)",
  };

  const startedAt = Date.now();
  const result = await sendMail({
    to,
    subject: `[Test SMTP] Diagnostic Bisecco ${new Date().toLocaleString("fr-FR")}`,
    html: `
      <h2>Diagnostic SMTP réussi 🎉</h2>
      <p>Cet email a été envoyé depuis le serveur de production Bisecco à <strong>${to}</strong>.</p>
      <p>Si tu lis ce mail, ton SMTP fonctionne parfaitement. Le bug d'email validation est ailleurs (peut-être côté Supabase generateLink).</p>
      <p><strong>Env vars :</strong></p>
      <pre>${JSON.stringify(envStatus, null, 2)}</pre>
      <p>Test lancé depuis /api/admin/test-mail</p>
    `,
    text: `Test SMTP Bisecco réussi. Envoyé à ${to} le ${new Date().toLocaleString("fr-FR")}.`,
  });

  return NextResponse.json({
    durationMs: Date.now() - startedAt,
    envStatus,
    sendMailResult: result,
    instruction: result.ok
      ? `✅ SMTP fonctionne. Vérifie ta boîte ${to} (et les spams).`
      : `❌ SMTP CASSÉ. Cause : ${result.error}. Corrige les env vars SMTP sur cPanel.`,
  });
}
