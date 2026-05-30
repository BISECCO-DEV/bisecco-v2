"use server";

import { sendMail } from "@/lib/mail/mailer";

const ADMIN_INBOX = process.env.CONTACT_INBOX || "contact@bisecco.fr";

export type EmploiResult = { ok: true } | { ok: false; error: string };

/** Soumettre une offre d'emploi · envoyée à admin pour validation manuelle */
export async function submitJobPostingAction(formData: FormData): Promise<EmploiResult> {
  const title = String(formData.get("title") ?? "").trim();
  const metier = String(formData.get("metier") ?? "").trim();
  const contract = String(formData.get("contract") ?? "").trim();
  const experience = String(formData.get("experience") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const postalCode = String(formData.get("postal_code") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const salaryMin = String(formData.get("salary_min") ?? "").trim();
  const salaryMax = String(formData.get("salary_max") ?? "").trim();
  const salaryPeriod = String(formData.get("salary_period") ?? "").trim();
  const companyName = String(formData.get("company_name") ?? "").trim();
  const siren = String(formData.get("siren") ?? "").trim().replace(/\s/g, "");
  const contactName = String(formData.get("contact_name") ?? "").trim();
  const contactEmail = String(formData.get("contact_email") ?? "").trim().toLowerCase();

  if (!title || title.length < 5) return { ok: false, error: "Intitulé du poste trop court." };
  if (!metier) return { ok: false, error: "Sélectionnez un métier." };
  if (!description || description.length < 50) return { ok: false, error: "Description trop courte (50 caractères min)." };
  if (!postalCode || !/^\d{5}$/.test(postalCode)) return { ok: false, error: "Code postal invalide." };
  if (!city) return { ok: false, error: "Ville requise." };
  if (!companyName) return { ok: false, error: "Nom d'entreprise requis." };
  if (!/^\d{9}$/.test(siren)) return { ok: false, error: "SIREN invalide (9 chiffres)." };
  if (!contactName) return { ok: false, error: "Personne à contacter requise." };
  if (!contactEmail.includes("@")) return { ok: false, error: "Email invalide." };

  const html = `
    <h2 style="color:#0d1e4a;font-family:sans-serif;">Nouvelle offre d'emploi à valider</h2>
    <p><strong>Intitulé :</strong> ${escapeHtml(title)}</p>
    <p><strong>Métier :</strong> ${escapeHtml(metier)} · ${escapeHtml(contract)} · ${escapeHtml(experience)}</p>
    <p><strong>Lieu :</strong> ${escapeHtml(postalCode)} ${escapeHtml(city)}</p>
    <p><strong>Salaire :</strong> ${salaryMin}€${salaryMax ? ` – ${salaryMax}€` : ""} / ${salaryPeriod}</p>
    <p><strong>Description :</strong></p>
    <div style="background:#f7f7f5;padding:14px;border-left:4px solid #f07a2f;border-radius:4px;white-space:pre-wrap;">${escapeHtml(description)}</div>
    <hr style="margin:20px 0;border:0;border-top:1px solid #ececec;"/>
    <h3 style="color:#0d1e4a;">Entreprise</h3>
    <p><strong>Société :</strong> ${escapeHtml(companyName)} · SIREN ${escapeHtml(siren)}</p>
    <p><strong>Contact :</strong> ${escapeHtml(contactName)} · <a href="mailto:${escapeHtml(contactEmail)}">${escapeHtml(contactEmail)}</a></p>
  `;
  const text = `Nouvelle offre d'emploi a valider\n\n${title}\n${metier} - ${contract} - ${experience}\n${postalCode} ${city}\nSalaire: ${salaryMin}E${salaryMax ? `-${salaryMax}E` : ""} / ${salaryPeriod}\n\n${description}\n\nSociete: ${companyName} (SIREN ${siren})\nContact: ${contactName} <${contactEmail}>`;

  const res = await sendMail({
    to: ADMIN_INBOX,
    subject: `[Bisecco · Emploi] Nouvelle offre · ${title}`,
    html,
    text,
    replyTo: contactEmail,
  });

  if (!res.ok) return { ok: false, error: "Envoi échoué. Réessayez plus tard." };
  return { ok: true };
}

/** Soumettre une candidature à une offre · envoie au recruteur via contact@bisecco.fr */
export async function submitJobApplicationAction(
  formData: FormData,
): Promise<EmploiResult> {
  const jobId = String(formData.get("job_id") ?? "").trim();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!jobId) return { ok: false, error: "Offre manquante." };
  if (!fullName) return { ok: false, error: "Nom requis." };
  if (!email.includes("@")) return { ok: false, error: "Email invalide." };
  if (!message || message.length < 30) return { ok: false, error: "Message trop court (30 caractères min)." };

  const html = `
    <h2 style="color:#0d1e4a;font-family:sans-serif;">Nouvelle candidature · offre #${escapeHtml(jobId)}</h2>
    <p><strong>Candidat :</strong> ${escapeHtml(fullName)}</p>
    <p><strong>Email :</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
    ${phone ? `<p><strong>Téléphone :</strong> ${escapeHtml(phone)}</p>` : ""}
    <p><strong>Message :</strong></p>
    <div style="background:#f7f7f5;padding:14px;border-left:4px solid #f07a2f;border-radius:4px;white-space:pre-wrap;">${escapeHtml(message)}</div>
  `;
  const text = `Nouvelle candidature pour l'offre #${jobId}\n\nCandidat: ${fullName}\nEmail: ${email}\n${phone ? `Tel: ${phone}\n` : ""}\nMessage:\n${message}`;

  const res = await sendMail({
    to: ADMIN_INBOX,
    subject: `[Bisecco · Candidature] ${fullName} · offre #${jobId}`,
    html,
    text,
    replyTo: email,
  });

  if (!res.ok) return { ok: false, error: "Envoi échoué. Réessayez plus tard." };
  return { ok: true };
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
