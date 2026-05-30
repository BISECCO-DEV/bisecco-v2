"use server";

import { headers } from "next/headers";
import { sendMail } from "@/lib/mail/mailer";
import { contactConfirmationEmail, contactAdminEmail } from "@/lib/mail/templates";

const MAX_MESSAGE = 5000;
const ADMIN_INBOX = process.env.CONTACT_INBOX || "contact@bisecco.fr";

export type ContactResult = { ok: true } | { ok: false; error: string };

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function submitContactAction(formData: FormData): Promise<ContactResult> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim() || null;
  const userType = String(formData.get("userType") ?? "").trim() || null;
  const objet = String(formData.get("objet") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!firstName || !lastName) return { ok: false, error: "Nom et prénom requis." };
  if (!email || !email.includes("@")) return { ok: false, error: "Email invalide." };
  if (!phone || phone.replace(/[^0-9]/g, "").length < 8) return { ok: false, error: "Numéro de téléphone invalide." };
  if (!objet || objet.length < 3) return { ok: false, error: "Objet trop court (3 caractères min)." };
  if (!message || message.length < 10) return { ok: false, error: "Message trop court (10 caractères min)." };
  if (message.length > MAX_MESSAGE) return { ok: false, error: `Message trop long (max ${MAX_MESSAGE} caractères).` };

  const h = await headers();
  const ip = (h.get("x-forwarded-for")?.split(",")[0] || h.get("x-real-ip") || "").trim() || null;
  const fullName = `${firstName} ${lastName}`;

  // Email admin avec objet libre + téléphone + profil
  const textHeader = [
    `Objet : ${objet}`,
    `Téléphone : ${phone}`,
    userType ? `Profil : ${userType}` : null,
  ].filter(Boolean).join("\n");

  const adminTpl = contactAdminEmail({
    subject: "support",
    fromName: fullName,
    fromEmail: email,
    company,
    message: `${textHeader}\n\n${message}`,
    ip,
  });

  // Injecter Objet + Téléphone + Profil en haut du tableau HTML
  const extraRows = [
    `<tr><td style="padding:8px 0;border-bottom:1px solid #ececec;"><strong>Objet :</strong> ${escapeHtml(objet)}</td></tr>`,
    `<tr><td style="padding:8px 0;border-bottom:1px solid #ececec;"><strong>Téléphone :</strong> <a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td></tr>`,
    userType ? `<tr><td style="padding:8px 0;border-bottom:1px solid #ececec;"><strong>Profil :</strong> ${escapeHtml(userType)}</td></tr>` : "",
  ].join("");
  const adminHtml = adminTpl.html.replace(
    /<table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:0 0 20px;">/,
    `<table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:0 0 20px;">${extraRows}`,
  );

  const adminRes = await sendMail({
    to: ADMIN_INBOX,
    subject: `[Bisecco · Contact] ${objet} · ${fullName}`,
    html: adminHtml,
    text: adminTpl.text,
    replyTo: email,
  });

  if (!adminRes.ok) {
    console.error("[contact] sendMail to admin failed:", adminRes.error);
    return { ok: false, error: "Échec de l'envoi. Réessaie dans quelques minutes." };
  }

  // Confirmation visiteur
  const userTpl = contactConfirmationEmail({ name: firstName });
  await sendMail({
    to: email,
    subject: userTpl.subject,
    html: userTpl.html,
    text: userTpl.text,
  });

  return { ok: true };
}
