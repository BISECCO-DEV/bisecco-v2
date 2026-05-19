"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const BYPASS_CODE = process.env.COMING_SOON_BYPASS_CODE ?? "BISECCO-2026";
const BYPASS_COOKIE_NAME = "bisecco_bypass";
const BYPASS_COOKIE_VALUE = "ok";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 jours

/** Valide le code d'accès et pose un cookie pour bypasser le coming-soon */
export async function validateBypassCodeAction(formData: FormData): Promise<void> {
  // Case-sensitive : le code peut contenir maj + min (sécurité renforcée)
  const code = String(formData.get("code") ?? "").trim();

  if (!code) {
    redirect("/coming-soon?error=empty");
  }

  // Pause volontaire 800ms pour ralentir le brute-force
  await new Promise((r) => setTimeout(r, 800));

  if (code !== BYPASS_CODE) {
    redirect("/coming-soon?error=invalid");
  }

  const jar = await cookies();
  jar.set(BYPASS_COOKIE_NAME, BYPASS_COOKIE_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  redirect("/");
}

/** Inscription email pour être prévenu du lancement */
export async function subscribeNotifyAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    redirect("/coming-soon?subscribe_error=invalid_email");
  }

  const supabase = createSupabaseAdminClient();

  // Génère un token simple pour désinscription future
  const token = Math.random().toString(36).slice(2, 14) + Date.now().toString(36);

  const { error } = await supabase
    .from("maintenance_subscribers")
    .insert({ email, token });

  // Email déjà inscrit → on traite comme success (UX)
  if (error && !error.message.toLowerCase().includes("duplicate")) {
    console.error("[subscribeNotifyAction]", error);
    redirect("/coming-soon?subscribe_error=db");
  }

  redirect("/coming-soon?subscribed=1");
}
