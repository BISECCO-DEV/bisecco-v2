import { NextResponse } from "next/server";
import { sendWeeklyDigests } from "@/lib/mail/digest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Endpoint déclenché par un CRON o2switch chaque lundi matin.
 * Sécurisé par Authorization: Bearer ${CRON_SECRET}.
 *
 * Configuration o2switch :
 *   crontab -e
 *   0 9 * * 1 curl -s -X POST https://bisecco.fr/api/cron/weekly-digest \
 *     -H "Authorization: Bearer YOUR_CRON_SECRET" > /dev/null 2>&1
 *
 * Variable d'environnement requise : CRON_SECRET (chaîne aléatoire ~32 chars).
 */
export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return NextResponse.json({ ok: false, error: "CRON_SECRET not configured" }, { status: 500 });
  }
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await sendWeeklyDigests();
    return NextResponse.json({ ok: true, ...result, ranAt: new Date().toISOString() });
  } catch (e) {
    console.error("Weekly digest failed:", e);
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "unknown" },
      { status: 500 },
    );
  }
}
