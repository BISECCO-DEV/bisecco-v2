import { NextResponse } from "next/server";
import { runHealthChecks } from "@/lib/admin/health";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendMail } from "@/lib/mail/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Endpoint déclenché par un CRON o2switch toutes les 30 minutes.
 * Lance tous les health checks, historise le résultat, et envoie une
 * ALERTE EMAIL si au moins un check passe au rouge.
 *
 * Sécurisé par CRON_SECRET, accepté de deux façons (au choix dans le cron) :
 *   - en-tête : Authorization: Bearer ${CRON_SECRET}
 *   - query   : ?key=${CRON_SECRET}
 *
 * Configuration o2switch (cPanel → Tâches Cron) :
 *   *\/30 * * * * curl -s "https://bisecco.fr/api/cron/health-check?key=VOTRE_CRON_SECRET" > /dev/null 2>&1
 */
function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  if (req.headers.get("authorization") === `Bearer ${secret}`) return true;
  return new URL(req.url).searchParams.get("key") === secret;
}

async function handle(req: Request) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ ok: false, error: "CRON_SECRET not configured" }, { status: 500 });
  }
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const report = await runHealthChecks();

  // Historisation (best effort — n'empêche pas la réponse)
  try {
    const supabase = createSupabaseAdminClient();
    await supabase.from("health_checks").insert({
      ran_at: report.ranAt,
      overall: report.overall,
      ok_count: report.summary.ok,
      warn_count: report.summary.warn,
      error_count: report.summary.error,
      results: report.checks,
      source: "cron",
    });
  } catch (e) {
    console.error("[health-check] historisation échouée:", e);
  }

  // Alerte email si au moins un check rouge
  if (report.overall === "error") {
    const failing = report.checks.filter((c) => c.status === "error");
    const to = process.env.CONTACT_INBOX || process.env.MAIL_FROM || "contact@bisecco.fr";
    const appUrl = process.env.APP_URL || "https://bisecco.fr";
    const rows = failing
      .map((c) => `<li><strong>${c.label}</strong> (${c.category}) — ${c.detail}</li>`)
      .join("");
    await sendMail({
      to,
      subject: `🔴 Bisecco · ${failing.length} problème(s) détecté(s)`,
      html:
        `<div style="font-family:system-ui,sans-serif;color:#0d1e4a">` +
        `<h2 style="color:#dc2626">${failing.length} problème(s) sur le site</h2>` +
        `<ul style="line-height:1.6">${rows}</ul>` +
        `<p><a href="${appUrl}/admin/sante" style="color:#f07a2f;font-weight:bold">Ouvrir le tableau de contrôle →</a></p>` +
        `</div>`,
      text:
        `${failing.length} problème(s) :\n` +
        failing.map((c) => `- ${c.label} (${c.category}) : ${c.detail}`).join("\n") +
        `\n\n${appUrl}/admin/sante`,
    }).catch((e) => console.error("[health-check] alerte email échouée:", e));
  }

  return NextResponse.json({ ok: true, ...report });
}

export async function GET(req: Request) {
  return handle(req);
}
export async function POST(req: Request) {
  return handle(req);
}
