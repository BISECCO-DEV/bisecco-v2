"use server";

import { headers } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentDbUser } from "@/lib/auth/current-user";
import { sendMail } from "@/lib/mail/mailer";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME = ["application/pdf"];
const BUCKET = "cv-submissions";
const ADMIN_INBOX = process.env.CONTACT_INBOX || "contact@bisecco.fr";
const APP_URL_BASE = process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://bisecco.fr";

export type CvBankResult = { ok: true } | { ok: false; error: string };

/**
 * Dépôt d'un CV dans la banque publique.
 * Accessible aux visiteurs anonymes ET aux utilisateurs connectés.
 * Modération admin obligatoire avant publication (status: pending).
 */
export async function submitCvToBankAction(formData: FormData): Promise<CvBankResult> {
  const senderName = String(formData.get("sender_name") ?? "").trim();
  const senderEmail = String(formData.get("sender_email") ?? "").trim().toLowerCase();
  const senderPhone = String(formData.get("sender_phone") ?? "").trim() || null;
  const metier = String(formData.get("metier") ?? "").trim() || null;
  const city = String(formData.get("city") ?? "").trim() || null;
  const message = String(formData.get("message") ?? "").trim() || null;
  const rgpdConsent = formData.get("rgpd_consent") === "on" || formData.get("rgpd_consent") === "true";

  if (!senderName || senderName.length < 2) return { ok: false, error: "Nom requis." };
  if (!senderEmail || !senderEmail.includes("@")) return { ok: false, error: "Email invalide." };
  if (!rgpdConsent) return { ok: false, error: "Merci d'accepter le traitement de vos données (RGPD)." };

  const file = formData.get("cv_file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Merci de joindre votre CV (PDF)." };
  }
  const f = file as File;

  if (f.size > MAX_SIZE) {
    return { ok: false, error: "Fichier trop volumineux (max 5 Mo)." };
  }
  if (!ALLOWED_MIME.includes(f.type)) {
    return { ok: false, error: "Format invalide. Seul le PDF est accepté." };
  }

  // Anti-spam léger : pas plus de 3 dépôts par email / 24h
  const supabase = createSupabaseAdminClient();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: recent } = await supabase
    .from("cv_bank")
    .select("*", { count: "exact", head: true })
    .eq("sender_email", senderEmail)
    .gte("created_at", since);
  if ((recent ?? 0) >= 3) {
    return { ok: false, error: "Trop de dépôts récents. Réessayez plus tard." };
  }

  const currentUser = await getCurrentDbUser();
  const h = await headers();
  const ip = (h.get("x-forwarded-for")?.split(",")[0] || h.get("x-real-ip") || "").trim() || null;
  const ua = (h.get("user-agent") || "").slice(0, 500) || null;

  // Upload fichier
  const ext = f.name.split(".").pop() ?? "pdf";
  const safeName = f.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
  const storagePath = `bank/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const buffer = Buffer.from(await f.arrayBuffer());
  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      contentType: f.type,
      upsert: false,
    });

  if (uploadErr) {
    console.error("[cv-bank upload]", uploadErr);
    return { ok: false, error: "Échec du téléversement. Réessayez." };
  }

  // Insert DB
  const { error: dbErr } = await supabase.from("cv_bank").insert({
    sender_user_id: currentUser?.id ?? null,
    sender_name: senderName.slice(0, 120),
    sender_email: senderEmail.slice(0, 191),
    sender_phone: senderPhone?.slice(0, 30) ?? null,
    metier: metier?.slice(0, 80) ?? null,
    city: city?.slice(0, 80) ?? null,
    message: message?.slice(0, 1500) ?? null,
    file_path: storagePath,
    file_name: safeName,
    file_size: f.size,
    file_mime: f.type,
    status: "pending",
    ip_address: ip,
    user_agent: ua,
  });

  if (dbErr) {
    // Rollback upload
    await supabase.storage.from(BUCKET).remove([storagePath]);
    console.error("[cv-bank db]", dbErr);
    return { ok: false, error: "Erreur d'enregistrement. Réessayez." };
  }

  // Email confirmation au candidat
  const userHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:30px;background:#f7f7f5;">
      <div style="background:white;border-radius:16px;padding:32px;">
        <h1 style="color:#0d1e4a;font-size:22px;margin:0 0 16px;">CV bien reçu ✓</h1>
        <p style="color:#3c4566;line-height:1.6;">Bonjour ${senderName.split(" ")[0]},</p>
        <p style="color:#3c4566;line-height:1.6;">
          Nous avons bien reçu votre CV dans la banque Bisecco. Notre équipe le validera sous <strong>24h ouvrées</strong>.
          Une fois approuvé, les artisans inscrits pourront le consulter.
        </p>
        <div style="background:#f7f7f5;border-left:4px solid #f07a2f;padding:14px 18px;border-radius:0 8px 8px 0;margin:20px 0;font-size:13px;color:#3c4566;">
          <strong>Vous serez recontacté</strong> directement par les artisans intéressés par votre profil, à l'adresse <strong>${senderEmail}</strong>.
        </div>
        <p style="font-size:12px;color:#7a8095;">Pour modifier ou retirer votre CV, écrivez à contact@bisecco.fr.</p>
      </div>
    </div>
  `;
  await sendMail({
    to: senderEmail,
    subject: "Votre CV a bien été reçu · Bisecco",
    html: userHtml,
    text: `Bonjour ${senderName.split(" ")[0]},\n\nVotre CV a bien ete recu dans la banque Bisecco. Validation sous 24h ouvrees.\n\nLes artisans interesses vous contacteront directement.`,
  });

  // Email admin
  const adminHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:30px;background:#f7f7f5;">
      <div style="background:white;border-radius:16px;padding:32px;">
        <h1 style="color:#0d1e4a;font-size:20px;margin:0 0 16px;">Nouveau CV reçu · à modérer</h1>
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:0 0 20px;">
          <tr><td style="padding:6px 0;border-bottom:1px solid #ececec;"><strong>Nom :</strong> ${senderName}</td></tr>
          <tr><td style="padding:6px 0;border-bottom:1px solid #ececec;"><strong>Email :</strong> <a href="mailto:${senderEmail}">${senderEmail}</a></td></tr>
          ${senderPhone ? `<tr><td style="padding:6px 0;border-bottom:1px solid #ececec;"><strong>Téléphone :</strong> ${senderPhone}</td></tr>` : ""}
          ${metier ? `<tr><td style="padding:6px 0;border-bottom:1px solid #ececec;"><strong>Métier :</strong> ${metier}</td></tr>` : ""}
          ${city ? `<tr><td style="padding:6px 0;border-bottom:1px solid #ececec;"><strong>Ville :</strong> ${city}</td></tr>` : ""}
          <tr><td style="padding:6px 0;border-bottom:1px solid #ececec;"><strong>Fichier :</strong> ${safeName} (${Math.round(f.size / 1024)} Ko)</td></tr>
        </table>
        ${message ? `<p style="color:#3c4566;"><strong>Message :</strong></p><div style="background:#f7f7f5;padding:14px;border-radius:6px;white-space:pre-wrap;font-size:13px;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>` : ""}
        <p style="margin:20px 0 0;">
          <a href="${APP_URL_BASE}/admin/cv-bank" style="background:#f07a2f;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">
            Modérer dans l'admin →
          </a>
        </p>
      </div>
    </div>
  `;
  await sendMail({
    to: ADMIN_INBOX,
    subject: `[Bisecco · CV bank] Nouveau CV de ${senderName}`,
    html: adminHtml,
    text: `Nouveau CV recu dans la banque Bisecco\n\nNom: ${senderName}\nEmail: ${senderEmail}\n${senderPhone ? `Tel: ${senderPhone}\n` : ""}${metier ? `Metier: ${metier}\n` : ""}${city ? `Ville: ${city}\n` : ""}Fichier: ${safeName}\n\n${message ?? ""}\n\nModerer: ${APP_URL_BASE}/admin/cv-bank`,
    replyTo: senderEmail,
  });

  return { ok: true };
}
