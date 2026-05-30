import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "mail.bisecco.fr";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "465", 10);
const SMTP_USER = process.env.SMTP_USER || "contact@bisecco.fr";
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || "";
const MAIL_FROM = process.env.MAIL_FROM || "contact@bisecco.fr";
const MAIL_FROM_NAME = process.env.MAIL_FROM_NAME || "Bisecco";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;
  if (!SMTP_PASSWORD) {
    throw new Error("SMTP_PASSWORD env var missing");
  }
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true pour 465 (SSL), false pour 587 (STARTTLS)
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  return transporter;
}

export type SendMailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

export async function sendMail(opts: SendMailOptions): Promise<{ ok: boolean; error?: string; messageId?: string }> {
  // En dev sans SMTP_PASSWORD : log dans la console au lieu de planter silencieusement
  if (!SMTP_PASSWORD) {
    console.log("\n📧 [mailer DEV · pas de SMTP] Email simulé :");
    console.log("   To       :", opts.to);
    console.log("   Subject  :", opts.subject);
    if (opts.replyTo) console.log("   ReplyTo  :", opts.replyTo);
    console.log("   Text     :", (opts.text ?? "").slice(0, 200).replace(/\n/g, " ⏎ "));
    console.log("   (Pour envoyer de vrais emails en local, ajoute SMTP_HOST/PORT/USER/PASSWORD dans .env.local)\n");
    return { ok: true, messageId: "dev-mock-" + Date.now() };
  }

  try {
    const t = getTransporter();
    const info = await t.sendMail({
      from: `"${MAIL_FROM_NAME}" <${MAIL_FROM}>`,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      replyTo: opts.replyTo,
    });
    return { ok: true, messageId: info.messageId };
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    console.error("[mailer] sendMail failed:", error);
    return { ok: false, error };
  }
}
