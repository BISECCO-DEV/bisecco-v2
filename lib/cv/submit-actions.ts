"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser, requireUser } from "@/lib/db/current-user";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendMail } from "@/lib/mail/mailer";
import { newCvEmail } from "@/lib/mail/templates";

const APP_URL_BASE = process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://bisecco.eu";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME = ["application/pdf"];
const BUCKET = "cv-submissions";

/**
 * Envoie un CV (PDF) à un artisan via son profil.
 * Accessible aux utilisateurs connectés ET aux visiteurs anonymes.
 */
export async function submitCvAction(formData: FormData): Promise<void> {
  const recipientId = Number(formData.get("recipient_id"));
  if (!recipientId) redirect("/?error=missing_recipient");

  const senderName = String(formData.get("sender_name") ?? "").trim();
  const senderEmail = String(formData.get("sender_email") ?? "").trim().toLowerCase();
  const senderPhone = String(formData.get("sender_phone") ?? "").trim() || null;
  const message = String(formData.get("message") ?? "").trim() || null;
  const backUrl = String(formData.get("_back") ?? "/");

  const file = formData.get("cv_file");
  if (!(file instanceof File) || file.size === 0) {
    redirect(`${backUrl}?cv_error=no_file`);
  }
  const f = file as File;

  if (!senderName || !senderEmail) {
    redirect(`${backUrl}?cv_error=missing_fields`);
  }
  if (f.size > MAX_SIZE) {
    redirect(`${backUrl}?cv_error=too_large`);
  }
  if (!ALLOWED_MIME.includes(f.type)) {
    redirect(`${backUrl}?cv_error=bad_format`);
  }

  const supabase = createSupabaseAdminClient();
  const currentUser = await getCurrentUser();

  // Upload du fichier dans Storage
  const ext = f.name.split(".").pop() ?? "pdf";
  const safeName = f.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
  const storagePath = `${recipientId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const buffer = Buffer.from(await f.arrayBuffer());
  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      contentType: f.type,
      upsert: false,
    });

  if (uploadErr) {
    console.error("[submitCvAction upload]", uploadErr);
    redirect(`${backUrl}?cv_error=upload_failed`);
  }

  // Crée la ligne en DB
  const { error: dbErr } = await supabase.from("cv_submissions").insert({
    recipient_user_id: recipientId,
    sender_user_id: currentUser?.id ?? null,
    sender_name: senderName,
    sender_email: senderEmail,
    sender_phone: senderPhone,
    file_path: storagePath,
    file_name: safeName,
    file_size: f.size,
    file_mime: f.type,
    message,
    status: "new",
  });

  if (dbErr) {
    // Rollback upload
    await supabase.storage.from(BUCKET).remove([storagePath]);
    console.error("[submitCvAction db]", dbErr);
    redirect(`${backUrl}?cv_error=db_failed`);
  }

  // Email à l'artisan destinataire
  const { data: recipient } = await supabase
    .from("users")
    .select("email, name")
    .eq("id", recipientId)
    .maybeSingle();
  if (recipient?.email && recipient.name) {
    const tpl = newCvEmail({
      artisanName: recipient.name,
      candidateName: senderName,
      candidateEmail: senderEmail,
      cvUrl: `${APP_URL_BASE}/mon-profil/cvs-recus`,
    });
    await sendMail({ to: recipient.email, subject: tpl.subject, html: tpl.html, text: tpl.text, replyTo: senderEmail });
  }

  revalidatePath("/mon-profil/cvs-recus");
  redirect(`${backUrl}?cv_sent=1`);
}

/** Marque un CV reçu comme lu */
export async function markCvSubmissionReadAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const submissionId = Number(formData.get("submission_id"));
  if (!submissionId || !user.id) redirect("/mon-profil/cvs-recus");

  const supabase = createSupabaseAdminClient();
  await supabase
    .from("cv_submissions")
    .update({ status: "read", read_at: new Date().toISOString() })
    .eq("id", submissionId)
    .eq("recipient_user_id", user.id);

  revalidatePath("/mon-profil/cvs-recus");
  redirect("/mon-profil/cvs-recus");
}

/** Supprime un CV reçu (DB + Storage) */
export async function deleteCvSubmissionAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const submissionId = Number(formData.get("submission_id"));
  if (!submissionId || !user.id) redirect("/mon-profil/cvs-recus");

  const supabase = createSupabaseAdminClient();
  const { data: row } = await supabase
    .from("cv_submissions")
    .select("file_path, recipient_user_id")
    .eq("id", submissionId)
    .maybeSingle();

  if (!row || row.recipient_user_id !== user.id) {
    redirect("/mon-profil/cvs-recus?error=forbidden");
  }

  await supabase.storage.from("cv-submissions").remove([row!.file_path]);
  await supabase.from("cv_submissions").delete().eq("id", submissionId);

  revalidatePath("/mon-profil/cvs-recus");
  redirect("/mon-profil/cvs-recus?deleted=1");
}

/**
 * Génère une URL signée temporaire (1h) pour télécharger le CV.
 * À utiliser uniquement par l'artisan destinataire.
 */
export async function getCvSubmissionDownloadUrl(submissionId: number): Promise<string | null> {
  const user = await requireUser();
  if (!user.id) return null;

  const supabase = createSupabaseAdminClient();
  const { data: row } = await supabase
    .from("cv_submissions")
    .select("file_path, recipient_user_id")
    .eq("id", submissionId)
    .maybeSingle();

  if (!row || row.recipient_user_id !== user.id) return null;

  const { data: signed } = await supabase.storage
    .from("cv-submissions")
    .createSignedUrl(row.file_path, 60 * 60); // 1h

  return signed?.signedUrl ?? null;
}
