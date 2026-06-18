/** Templates HTML brandés Bisecco · orange + navy + manrope */

const COLORS = {
  brand: "#f07a2f",
  brandDark: "#d35e1a",
  ink: "#0d1e4a",
  ink600: "#3c4566",
  ink400: "#7a8095",
  bg: "#f7f7f5",
  white: "#ffffff",
};

function wrap(content: string, preheader: string = ""): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1.0" />
<title>Bisecco</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Arial,sans-serif;color:${COLORS.ink};">
  <span style="display:none!important;color:transparent;visibility:hidden;height:0;width:0;font-size:1px;line-height:1px;mso-hide:all;">${preheader}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLORS.bg};padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:${COLORS.white};border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(13,30,74,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,${COLORS.ink} 0%,#1a2d5c 100%);padding:32px 32px 28px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td style="background:#ffffff;border-radius:12px;padding:6px;line-height:0;">
                    <img src="https://bisecco.fr/logo.jpg" alt="Bisecco" width="36" height="36" style="display:block;border-radius:8px;" />
                  </td>
                  <td style="padding-left:14px;text-align:left;">
                    <div style="font-size:22px;font-weight:700;color:${COLORS.white};letter-spacing:0.04em;line-height:1;">
                      BISECCO
                    </div>
                    <div style="font-size:10px;color:${COLORS.brand};font-weight:700;letter-spacing:0.18em;margin-top:5px;text-transform:uppercase;">
                      Réseau de professionnels français vérifiés
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px 24px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;border-top:1px solid #ececec;text-align:center;font-size:12px;color:${COLORS.ink400};line-height:1.6;">
              <p style="margin:0 0 8px;">
                <strong style="color:${COLORS.ink600};">Bisecco</strong> · L'annuaire des professionnels français vérifiés
              </p>
              <p style="margin:0;">
                <a href="https://bisecco.fr" style="color:${COLORS.brand};text-decoration:none;">bisecco.fr</a>
                ·
                <a href="mailto:contact@bisecco.fr" style="color:${COLORS.brand};text-decoration:none;">contact@bisecco.fr</a>
              </p>
              <p style="margin:12px 0 0;font-size:11px;color:${COLORS.ink400};">
                Vous recevez cet email suite à une action sur votre compte Bisecco.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function resetPasswordEmail(opts: { resetUrl: string; name?: string | null }): { subject: string; html: string; text: string } {
  const greeting = opts.name ? `Bonjour ${opts.name},` : "Bonjour,";

  const html = wrap(
    `
    <h1 style="font-size:22px;font-weight:800;color:${COLORS.ink};margin:0 0 16px;">Réinitialisation de votre mot de passe</h1>
    <p style="font-size:15px;line-height:1.6;color:${COLORS.ink600};margin:0 0 20px;">${greeting}</p>
    <p style="font-size:15px;line-height:1.6;color:${COLORS.ink600};margin:0 0 24px;">
      Vous avez demandé la réinitialisation de votre mot de passe Bisecco. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 28px;">
      <tr>
        <td style="background:${COLORS.brand};border-radius:12px 12px 12px 0;">
          <a href="${opts.resetUrl}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:${COLORS.white};text-decoration:none;">
            Réinitialiser mon mot de passe →
          </a>
        </td>
      </tr>
    </table>
    <p style="font-size:13px;line-height:1.6;color:${COLORS.ink400};margin:0 0 8px;">
      Ou copiez-collez ce lien dans votre navigateur :
    </p>
    <p style="font-size:12px;line-height:1.5;color:${COLORS.brand};margin:0 0 28px;word-break:break-all;">
      <a href="${opts.resetUrl}" style="color:${COLORS.brand};text-decoration:underline;">${opts.resetUrl}</a>
    </p>
    <div style="background:${COLORS.bg};border-radius:8px;padding:16px 18px;margin:0 0 16px;">
      <p style="font-size:13px;line-height:1.5;color:${COLORS.ink600};margin:0;">
        <strong>⏱ Ce lien expire dans 1 heure</strong> pour des raisons de sécurité.
      </p>
    </div>
    <p style="font-size:13px;line-height:1.6;color:${COLORS.ink400};margin:0;">
      Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email · votre mot de passe ne sera pas changé.
    </p>
    `,
    "Réinitialisez votre mot de passe Bisecco",
  );

  const text = `${greeting}

Vous avez demandé la réinitialisation de votre mot de passe Bisecco.

Cliquez sur ce lien pour choisir un nouveau mot de passe (valable 1h) :
${opts.resetUrl}

Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.

· L'équipe Bisecco
https://bisecco.fr`;

  return {
    subject: "Réinitialisation de votre mot de passe Bisecco",
    html,
    text,
  };
}

export function verifyEmailTemplate(opts: { verifyUrl: string; name?: string | null; role: "particulier" | "artisan" }): { subject: string; html: string; text: string } {
  const greeting = opts.name ? `Bonjour ${opts.name},` : "Bonjour,";
  const roleLabel = opts.role === "artisan" ? "professionnel" : "particulier";

  const html = wrap(
    `
    <h1 style="font-size:22px;font-weight:800;color:${COLORS.ink};margin:0 0 16px;">Vérifiez votre email</h1>
    <p style="font-size:15px;line-height:1.6;color:${COLORS.ink600};margin:0 0 16px;">${greeting}</p>
    <p style="font-size:15px;line-height:1.6;color:${COLORS.ink600};margin:0 0 24px;">
      Merci pour votre inscription en tant que <strong>${roleLabel}</strong> sur Bisecco. Pour finaliser la création de votre compte, confirmez votre adresse email en cliquant sur le bouton ci-dessous.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 28px;">
      <tr>
        <td style="background:${COLORS.brand};border-radius:12px 12px 12px 0;">
          <a href="${opts.verifyUrl}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:${COLORS.white};text-decoration:none;">
            Confirmer mon email →
          </a>
        </td>
      </tr>
    </table>
    <p style="font-size:13px;line-height:1.6;color:${COLORS.ink400};margin:0 0 8px;">Ou copiez-collez ce lien dans votre navigateur :</p>
    <p style="font-size:12px;line-height:1.5;color:${COLORS.brand};margin:0 0 28px;word-break:break-all;">
      <a href="${opts.verifyUrl}" style="color:${COLORS.brand};text-decoration:underline;">${opts.verifyUrl}</a>
    </p>
    <div style="background:${COLORS.bg};border-radius:8px;padding:16px 18px;margin:0;">
      <p style="font-size:13px;line-height:1.5;color:${COLORS.ink600};margin:0;">
        <strong>Prochaine étape :</strong> Après confirmation, notre équipe validera votre compte sous 24h. Vous recevrez un email dès qu'il sera activé.
      </p>
    </div>
    `,
    "Confirmez votre email Bisecco",
  );

  const text = `${greeting}

Confirmez votre email Bisecco en cliquant sur ce lien :
${opts.verifyUrl}

Apres confirmation, notre equipe validera votre compte sous 24h.

· L'equipe Bisecco`;

  return {
    subject: "Confirmez votre email Bisecco",
    html,
    text,
  };
}

export function accountApprovedEmail(opts: { name: string; role: "particulier" | "artisan" }): { subject: string; html: string; text: string } {
  const isArtisan = opts.role === "artisan";
  const html = wrap(
    `
    <h1 style="font-size:24px;font-weight:800;color:${COLORS.ink};margin:0 0 16px;">Votre compte est validé ✓</h1>
    <p style="font-size:15px;line-height:1.6;color:${COLORS.ink600};margin:0 0 20px;">
      Bonjour ${opts.name}, votre compte ${isArtisan ? "professionnel" : "particulier"} sur Bisecco est maintenant activé. Vous pouvez vous connecter et profiter de toutes les fonctionnalités.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 28px;">
      <tr>
        <td style="background:${COLORS.brand};border-radius:12px 12px 12px 0;">
          <a href="https://bisecco.fr/connexion" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:${COLORS.white};text-decoration:none;">
            Me connecter maintenant →
          </a>
        </td>
      </tr>
    </table>
    ${isArtisan
      ? `<div style="background:${COLORS.bg};border-radius:8px;padding:16px 18px;margin:0;">
          <p style="font-size:13px;line-height:1.5;color:${COLORS.ink600};margin:0;">
            <strong>Conseil :</strong> Complétez votre profil (photos, description, zone d'intervention) pour recevoir vos premiers leads rapidement.
          </p>
        </div>`
      : ""}
    `,
    "Compte Bisecco validé",
  );
  const text = `Bonjour ${opts.name},\n\nVotre compte Bisecco est validé. Connectez-vous : https://bisecco.fr/connexion\n\n· L'equipe Bisecco`;
  return {
    subject: "Votre compte Bisecco est validé ✓",
    html,
    text,
  };
}

/** Email confirmation envoyé au visiteur qui a soumis le formulaire de contact */
export function contactConfirmationEmail(opts: { name: string }): { subject: string; html: string; text: string } {
  const html = wrap(
    `
    <h1 style="font-size:22px;font-weight:800;color:${COLORS.ink};margin:0 0 16px;">Message bien reçu ✓</h1>
    <p style="font-size:15px;line-height:1.6;color:${COLORS.ink600};margin:0 0 20px;">Bonjour ${opts.name},</p>
    <p style="font-size:15px;line-height:1.6;color:${COLORS.ink600};margin:0 0 20px;">
      Nous avons bien reçu votre message. Notre équipe vous répondra sous <strong>24h ouvrées</strong>, souvent plus rapidement.
    </p>
    <div style="background:${COLORS.bg};border-radius:8px;padding:16px 18px;margin:0 0 24px;">
      <p style="font-size:13px;line-height:1.5;color:${COLORS.ink600};margin:0;">
        <strong>En attendant :</strong> vous pouvez parcourir les professionnels disponibles près de chez vous, ou consulter notre FAQ.
      </p>
    </div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
      <tr>
        <td style="background:${COLORS.brand};border-radius:12px 12px 12px 0;">
          <a href="https://bisecco.fr" style="display:inline-block;padding:12px 26px;font-size:14px;font-weight:700;color:${COLORS.white};text-decoration:none;">
            Retour sur Bisecco →
          </a>
        </td>
      </tr>
    </table>
    `,
    "Votre message a été reçu",
  );
  const text = `Bonjour ${opts.name},\n\nNous avons bien recu votre message. Reponse sous 24h ouvrees.\n\n· L'equipe Bisecco\nhttps://bisecco.fr`;
  return { subject: "Nous avons bien reçu votre message", html, text };
}

/** Email envoyé à l'admin avec le contenu de la demande */
export function contactAdminEmail(opts: {
  subject: string;
  fromName: string;
  fromEmail: string;
  company: string | null;
  message: string;
  ip: string | null;
}): { subject: string; html: string; text: string } {
  const subjectLabels: Record<string, string> = {
    support: "Support",
    partenariat: "Partenariat",
    presse: "Presse",
    recrutement: "Recrutement",
  };
  const subjectLabel = subjectLabels[opts.subject] ?? opts.subject;

  const html = wrap(
    `
    <h1 style="font-size:22px;font-weight:800;color:${COLORS.ink};margin:0 0 16px;">
      Nouvelle demande de contact
    </h1>
    <div style="background:${COLORS.brand};color:${COLORS.white};padding:8px 14px;border-radius:8px;display:inline-block;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 20px;">
      ${subjectLabel}
    </div>
    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:0 0 20px;">
      <tr><td style="padding:8px 0;border-bottom:1px solid #ececec;"><strong style="color:${COLORS.ink};">Nom :</strong> <span style="color:${COLORS.ink600};">${opts.fromName}</span></td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #ececec;"><strong style="color:${COLORS.ink};">Email :</strong> <a href="mailto:${opts.fromEmail}" style="color:${COLORS.brand};text-decoration:none;">${opts.fromEmail}</a></td></tr>
      ${opts.company ? `<tr><td style="padding:8px 0;border-bottom:1px solid #ececec;"><strong style="color:${COLORS.ink};">Société :</strong> <span style="color:${COLORS.ink600};">${opts.company}</span></td></tr>` : ""}
      ${opts.ip ? `<tr><td style="padding:8px 0;border-bottom:1px solid #ececec;"><strong style="color:${COLORS.ink};">IP :</strong> <code style="color:${COLORS.ink400};font-size:12px;">${opts.ip}</code></td></tr>` : ""}
    </table>
    <h2 style="font-size:14px;font-weight:700;color:${COLORS.ink};margin:0 0 8px;text-transform:uppercase;letter-spacing:0.08em;">Message :</h2>
    <div style="background:${COLORS.bg};border-left:4px solid ${COLORS.brand};padding:16px 20px;border-radius:0 8px 8px 0;font-size:14px;line-height:1.6;color:${COLORS.ink600};white-space:pre-wrap;">
${opts.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
    </div>
    <p style="font-size:13px;color:${COLORS.ink400};margin:20px 0 0;">
      Répondez directement à cet email pour contacter <strong>${opts.fromName}</strong>.
    </p>
    `,
    `Contact ${subjectLabel} · ${opts.fromName}`,
  );
  const text = `Nouvelle demande de contact - ${subjectLabel}

Nom: ${opts.fromName}
Email: ${opts.fromEmail}
${opts.company ? `Societe: ${opts.company}\n` : ""}${opts.ip ? `IP: ${opts.ip}\n` : ""}
Message:
${opts.message}`;
  return {
    subject: `[Bisecco · ${subjectLabel}] ${opts.fromName}`,
    html,
    text,
  };
}

/** Email envoyé au user dont le compte a été refusé */
export function accountRejectedEmail(opts: { name: string; reason: string }): { subject: string; html: string; text: string } {
  const html = wrap(
    `
    <h1 style="font-size:22px;font-weight:800;color:${COLORS.ink};margin:0 0 16px;">Votre demande n'a pas été retenue</h1>
    <p style="font-size:15px;line-height:1.6;color:${COLORS.ink600};margin:0 0 20px;">Bonjour ${opts.name},</p>
    <p style="font-size:15px;line-height:1.6;color:${COLORS.ink600};margin:0 0 20px;">
      Après examen, notre équipe n'a pas pu valider votre compte Bisecco. Voici la raison :
    </p>
    <div style="background:#fef2f2;border-left:4px solid #dc2626;padding:16px 20px;border-radius:0 8px 8px 0;font-size:14px;line-height:1.6;color:#991b1b;margin:0 0 20px;">
      ${opts.reason}
    </div>
    <p style="font-size:14px;line-height:1.6;color:${COLORS.ink600};margin:0 0 20px;">
      Si vous pensez qu'il s'agit d'une erreur ou que la situation a changé, contactez-nous à
      <a href="mailto:contact@bisecco.fr" style="color:${COLORS.brand};text-decoration:none;font-weight:700;">contact@bisecco.fr</a>.
    </p>
    `,
    "Votre demande Bisecco",
  );
  const text = `Bonjour ${opts.name},\n\nVotre compte Bisecco n'a pas pu etre valide.\n\nRaison: ${opts.reason}\n\nContactez-nous: contact@bisecco.fr`;
  return { subject: "Votre demande Bisecco n'a pas été retenue", html, text };
}

/** Email envoyé quand un compte est suspendu */
export function accountSuspendedEmail(opts: { name: string }): { subject: string; html: string; text: string } {
  const html = wrap(
    `
    <h1 style="font-size:22px;font-weight:800;color:${COLORS.ink};margin:0 0 16px;">Votre compte a été suspendu</h1>
    <p style="font-size:15px;line-height:1.6;color:${COLORS.ink600};margin:0 0 20px;">Bonjour ${opts.name},</p>
    <p style="font-size:15px;line-height:1.6;color:${COLORS.ink600};margin:0 0 20px;">
      Votre compte Bisecco a été suspendu par notre équipe de modération. Vous ne pouvez temporairement plus vous connecter.
    </p>
    <p style="font-size:14px;line-height:1.6;color:${COLORS.ink600};margin:0;">
      Pour comprendre la raison ou faire appel, contactez-nous à
      <a href="mailto:contact@bisecco.fr" style="color:${COLORS.brand};text-decoration:none;font-weight:700;">contact@bisecco.fr</a>.
    </p>
    `,
    "Compte Bisecco suspendu",
  );
  const text = `Bonjour ${opts.name},\n\nVotre compte Bisecco a ete suspendu.\n\nContactez-nous: contact@bisecco.fr`;
  return { subject: "Votre compte Bisecco a été suspendu", html, text };
}

/** Email envoyé à l'artisan ciblé par une demande de devis */
export function newQuoteEmail(opts: {
  artisanName: string;
  particulierName: string;
  metierName: string;
  city: string | null;
  description: string;
  quoteUrl: string;
}): { subject: string; html: string; text: string } {
  const html = wrap(
    `
    <h1 style="font-size:22px;font-weight:800;color:${COLORS.ink};margin:0 0 16px;">Nouvelle demande de devis 💼</h1>
    <p style="font-size:15px;line-height:1.6;color:${COLORS.ink600};margin:0 0 20px;">Bonjour ${opts.artisanName},</p>
    <p style="font-size:15px;line-height:1.6;color:${COLORS.ink600};margin:0 0 20px;">
      Vous avez reçu une nouvelle demande de devis sur Bisecco pour <strong>${opts.metierName}</strong>${opts.city ? ` à <strong>${opts.city}</strong>` : ""}.
    </p>
    <div style="background:${COLORS.bg};border-radius:8px;padding:16px 20px;margin:0 0 24px;">
      <p style="font-size:13px;line-height:1.5;color:${COLORS.ink400};margin:0 0 6px;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;">Demande de</p>
      <p style="font-size:15px;font-weight:700;color:${COLORS.ink};margin:0 0 14px;">${opts.particulierName}</p>
      <p style="font-size:13px;line-height:1.5;color:${COLORS.ink400};margin:0 0 6px;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;">Description</p>
      <p style="font-size:14px;line-height:1.6;color:${COLORS.ink600};margin:0;white-space:pre-wrap;">${opts.description.slice(0, 500)}${opts.description.length > 500 ? "…" : ""}</p>
    </div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
      <tr>
        <td style="background:${COLORS.brand};border-radius:12px 12px 12px 0;">
          <a href="${opts.quoteUrl}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:${COLORS.white};text-decoration:none;">
            Voir la demande →
          </a>
        </td>
      </tr>
    </table>
    `,
    "Nouvelle demande de devis Bisecco",
  );
  const text = `Bonjour ${opts.artisanName},\n\nNouvelle demande de devis pour ${opts.metierName}${opts.city ? ` a ${opts.city}` : ""}.\n\nDe: ${opts.particulierName}\n\n${opts.description.slice(0, 300)}\n\nVoir: ${opts.quoteUrl}`;
  return { subject: `Nouvelle demande de devis · ${opts.metierName}`, html, text };
}

/** Email envoyé au profil qui reçoit un avis */
export function newReviewEmail(opts: { profileName: string; rating: number; comment: string | null; profileUrl: string }): { subject: string; html: string; text: string } {
  const stars = "★".repeat(opts.rating) + "☆".repeat(5 - opts.rating);
  const html = wrap(
    `
    <h1 style="font-size:22px;font-weight:800;color:${COLORS.ink};margin:0 0 16px;">Vous avez reçu un nouvel avis ⭐</h1>
    <p style="font-size:15px;line-height:1.6;color:${COLORS.ink600};margin:0 0 20px;">Bonjour ${opts.profileName},</p>
    <div style="background:${COLORS.bg};border-radius:8px;padding:20px;margin:0 0 24px;text-align:center;">
      <p style="font-size:32px;color:#f59e0b;margin:0 0 8px;letter-spacing:0.1em;">${stars}</p>
      <p style="font-size:14px;font-weight:700;color:${COLORS.ink};margin:0;">${opts.rating}/5</p>
      ${opts.comment ? `<p style="font-size:14px;line-height:1.6;color:${COLORS.ink600};margin:14px 0 0;font-style:italic;">« ${opts.comment.slice(0, 300)}${opts.comment.length > 300 ? "…" : ""} »</p>` : ""}
    </div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
      <tr>
        <td style="background:${COLORS.brand};border-radius:12px 12px 12px 0;">
          <a href="${opts.profileUrl}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:${COLORS.white};text-decoration:none;">
            Voir mon profil →
          </a>
        </td>
      </tr>
    </table>
    `,
    "Nouvel avis sur Bisecco",
  );
  const text = `Bonjour ${opts.profileName},\n\nNouvel avis ${opts.rating}/5 sur votre profil.\n${opts.comment ? `"${opts.comment}"\n` : ""}\nVoir: ${opts.profileUrl}`;
  return { subject: `Nouvel avis ${opts.rating}★ sur votre profil Bisecco`, html, text };
}

/** Email envoyé à l'admin (équipe modération) à chaque nouvel avis */
export function newReviewToModerateEmail(opts: {
  reviewerName: string;
  artisanName: string;
  rating: number;
  comment: string | null;
  moderationUrl: string;
}): { subject: string; html: string; text: string } {
  const stars = "★".repeat(opts.rating) + "☆".repeat(5 - opts.rating);
  const html = wrap(
    `
    <h1 style="font-size:22px;font-weight:800;color:${COLORS.ink};margin:0 0 16px;">Nouvel avis à modérer 🛡️</h1>
    <p style="font-size:15px;line-height:1.6;color:${COLORS.ink600};margin:0 0 20px;">
      <strong>${opts.reviewerName}</strong> vient de publier un avis sur <strong>${opts.artisanName}</strong>.
    </p>
    <div style="background:${COLORS.bg};border-radius:8px;padding:20px;margin:0 0 24px;">
      <p style="font-size:24px;color:#f59e0b;margin:0 0 6px;letter-spacing:0.08em;">${stars}</p>
      <p style="font-size:13px;font-weight:700;color:${COLORS.ink};margin:0 0 12px;">${opts.rating}/5</p>
      ${opts.comment ? `<p style="font-size:14px;line-height:1.6;color:${COLORS.ink600};margin:0;font-style:italic;">« ${opts.comment.slice(0, 500)}${opts.comment.length > 500 ? "…" : ""} »</p>` : `<p style="font-size:13px;color:${COLORS.ink400};margin:0;">(Pas de commentaire)</p>`}
    </div>
    <p style="font-size:14px;line-height:1.6;color:${COLORS.ink600};margin:0 0 18px;">
      L'avis n'est PAS encore visible sur la fiche du pro. Approuve-le ou rejette-le depuis le panneau admin :
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
      <tr>
        <td style="background:${COLORS.brand};border-radius:12px 12px 12px 0;">
          <a href="${opts.moderationUrl}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:${COLORS.white};text-decoration:none;">
            Modérer cet avis →
          </a>
        </td>
      </tr>
    </table>
    `,
    "Avis à modérer",
  );
  const text = `Nouvel avis a moderer\n\nReviewer: ${opts.reviewerName}\nPro: ${opts.artisanName}\nNote: ${opts.rating}/5\n${opts.comment ? `"${opts.comment}"\n` : ""}\nModerer: ${opts.moderationUrl}`;
  return {
    subject: `[Bisecco] Avis ${opts.rating}★ à modérer · ${opts.artisanName}`,
    html,
    text,
  };
}

/** Email envoyé au client quand son avis a été publié */
export function reviewApprovedEmail(opts: {
  clientName: string;
  artisanName: string;
  profileUrl: string;
}): { subject: string; html: string; text: string } {
  const html = wrap(
    `
    <h1 style="font-size:22px;font-weight:800;color:${COLORS.ink};margin:0 0 16px;">Ton avis est en ligne ✅</h1>
    <p style="font-size:15px;line-height:1.6;color:${COLORS.ink600};margin:0 0 20px;">Bonjour ${opts.clientName},</p>
    <p style="font-size:15px;line-height:1.6;color:${COLORS.ink600};margin:0 0 20px;">
      Bonne nouvelle : ton avis sur <strong>${opts.artisanName}</strong> vient d'être validé par notre équipe.
      Il est désormais visible publiquement sur sa fiche Bisecco.
    </p>
    <p style="font-size:14px;line-height:1.6;color:${COLORS.ink400};margin:0 0 20px;">
      Merci de contribuer à un annuaire de confiance pour les particuliers comme toi.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
      <tr>
        <td style="background:${COLORS.brand};border-radius:12px 12px 12px 0;">
          <a href="${opts.profileUrl}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:${COLORS.white};text-decoration:none;">
            Voir le profil →
          </a>
        </td>
      </tr>
    </table>
    `,
    "Avis publié",
  );
  const text = `Ton avis sur ${opts.artisanName} est en ligne.\n\nVoir: ${opts.profileUrl}`;
  return {
    subject: `Ton avis sur ${opts.artisanName} est en ligne`,
    html,
    text,
  };
}

/** Email envoyé à l'artisan quand il reçoit un CV */
export function newCvEmail(opts: { artisanName: string; candidateName: string; candidateEmail: string; cvUrl: string }): { subject: string; html: string; text: string } {
  const html = wrap(
    `
    <h1 style="font-size:22px;font-weight:800;color:${COLORS.ink};margin:0 0 16px;">Nouveau CV reçu 📄</h1>
    <p style="font-size:15px;line-height:1.6;color:${COLORS.ink600};margin:0 0 20px;">Bonjour ${opts.artisanName},</p>
    <p style="font-size:15px;line-height:1.6;color:${COLORS.ink600};margin:0 0 24px;">
      <strong>${opts.candidateName}</strong> (<a href="mailto:${opts.candidateEmail}" style="color:${COLORS.brand};text-decoration:none;">${opts.candidateEmail}</a>) vous a envoyé son CV via Bisecco.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
      <tr>
        <td style="background:${COLORS.brand};border-radius:12px 12px 12px 0;">
          <a href="${opts.cvUrl}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:${COLORS.white};text-decoration:none;">
            Consulter les CV reçus →
          </a>
        </td>
      </tr>
    </table>
    `,
    "Nouveau CV sur Bisecco",
  );
  const text = `Bonjour ${opts.artisanName},\n\n${opts.candidateName} (${opts.candidateEmail}) vous a envoye son CV.\n\nVoir: ${opts.cvUrl}`;
  return { subject: `Nouveau CV reçu de ${opts.candidateName}`, html, text };
}

/** Email opt-in newsletter */
export function newsletterOptInEmail(opts: { confirmUrl: string }): { subject: string; html: string; text: string } {
  const html = wrap(
    `
    <h1 style="font-size:22px;font-weight:800;color:${COLORS.ink};margin:0 0 16px;">Confirmez votre inscription</h1>
    <p style="font-size:15px;line-height:1.6;color:${COLORS.ink600};margin:0 0 24px;">
      Merci de vous inscrire à la newsletter Bisecco. Confirmez votre adresse en cliquant ci-dessous (RGPD oblige).
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 24px;">
      <tr>
        <td style="background:${COLORS.brand};border-radius:12px 12px 12px 0;">
          <a href="${opts.confirmUrl}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:${COLORS.white};text-decoration:none;">
            Confirmer mon inscription →
          </a>
        </td>
      </tr>
    </table>
    <p style="font-size:12px;color:${COLORS.ink400};margin:0;">
      Si vous n'êtes pas à l'origine de cette inscription, ignorez simplement cet email.
    </p>
    `,
    "Confirmez votre inscription newsletter Bisecco",
  );
  const text = `Confirmez votre inscription a la newsletter Bisecco:\n${opts.confirmUrl}`;
  return { subject: "Confirmez votre inscription · Newsletter Bisecco", html, text };
}

/** Notification interne envoyée à Bisecco quand un nouveau user s'inscrit. */
export function newSignupAdminEmail(opts: {
  name: string;
  email: string;
  role: "particulier" | "artisan";
  phone?: string | null;
  city?: string | null;
  // Si artisan
  companyName?: string | null;
  siren?: string | null;
  metiers?: string[];
  // ID public.users pour lien admin
  userId?: number | null;
}): { subject: string; html: string; text: string } {
  const isArtisan = opts.role === "artisan";
  const roleLabel = isArtisan ? "🛠️ Professionnel" : "🏠 Particulier";
  const adminLink = opts.userId ? `https://bisecco.fr/admin/utilisateurs/${opts.userId}` : "https://bisecco.fr/admin/utilisateurs";

  const detailRow = (label: string, value: string | null | undefined) => value
    ? `<tr>
        <td style="padding:8px 0;font-size:13px;color:${COLORS.ink400};font-weight:600;width:130px;">${label}</td>
        <td style="padding:8px 0;font-size:14px;color:${COLORS.ink};font-weight:500;">${value}</td>
      </tr>`
    : "";

  const html = wrap(
    `
    <div style="display:inline-block;padding:6px 14px;border-radius:999px;background:${isArtisan ? "#fef0e6" : "#dbeafe"};color:${isArtisan ? COLORS.brand : "#1d4ed8"};font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px;">
      ${roleLabel} · Nouvelle inscription
    </div>
    <h1 style="font-size:22px;font-weight:800;color:${COLORS.ink};margin:0 0 6px;">${opts.name}</h1>
    <p style="font-size:14px;color:${COLORS.ink400};margin:0 0 22px;">vient de créer un compte sur Bisecco.</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border-top:1px solid #ececec;border-bottom:1px solid #ececec;margin:0 0 22px;">
      ${detailRow("Email", opts.email)}
      ${detailRow("Téléphone", opts.phone)}
      ${detailRow("Ville", opts.city)}
      ${isArtisan ? detailRow("Société", opts.companyName) : ""}
      ${isArtisan ? detailRow("SIREN", opts.siren) : ""}
      ${isArtisan && opts.metiers && opts.metiers.length > 0 ? detailRow("Métiers", opts.metiers.join(", ")) : ""}
      ${detailRow("Statut", isArtisan ? "⏳ Validation requise (SIREN vérifié)" : "⏳ Email à confirmer")}
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px;">
      <tr>
        <td style="background:${COLORS.brand};border-radius:12px 12px 12px 0;">
          <a href="${adminLink}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:700;color:${COLORS.white};text-decoration:none;">
            Voir dans l'admin →
          </a>
        </td>
      </tr>
    </table>

    <p style="font-size:12px;color:${COLORS.ink400};margin:18px 0 0;line-height:1.5;">
      ${isArtisan
        ? "Action requise : valider ou rejeter ce profil professionnel dans le dashboard admin."
        : "Aucune action requise. L'utilisateur confirmera son email en cliquant sur le lien reçu."}
    </p>
    `,
    `Nouvelle inscription ${opts.role} : ${opts.name}`,
  );

  const text = `Nouvelle inscription Bisecco

${roleLabel} : ${opts.name}
Email : ${opts.email}
${opts.phone ? `Téléphone : ${opts.phone}` : ""}
${opts.city ? `Ville : ${opts.city}` : ""}
${isArtisan && opts.companyName ? `Société : ${opts.companyName}` : ""}
${isArtisan && opts.siren ? `SIREN : ${opts.siren}` : ""}
${isArtisan && opts.metiers && opts.metiers.length > 0 ? `Métiers : ${opts.metiers.join(", ")}` : ""}

Voir dans l'admin : ${adminLink}`;

  return {
    subject: `${roleLabel} · Nouvelle inscription · ${opts.name}`,
    html,
    text,
  };
}

export function welcomeEmail(opts: { name: string; role: "particulier" | "artisan" }): { subject: string; html: string; text: string } {
  const isArtisan = opts.role === "artisan";
  const html = wrap(
    `
    <h1 style="font-size:24px;font-weight:800;color:${COLORS.ink};margin:0 0 16px;">Bienvenue sur Bisecco, ${opts.name} 👋</h1>
    <p style="font-size:15px;line-height:1.6;color:${COLORS.ink600};margin:0 0 20px;">
      ${isArtisan
        ? "Votre compte professionnel est créé. Votre profil sera vérifié sous 24h via votre SIREN."
        : "Votre compte est créé. Vous pouvez maintenant trouver des professionnels vérifiés près de chez vous."}
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 28px;">
      <tr>
        <td style="background:${COLORS.brand};border-radius:12px 12px 12px 0;">
          <a href="https://bisecco.fr/mon-profil" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:${COLORS.white};text-decoration:none;">
            ${isArtisan ? "Compléter mon profil →" : "Découvrir Bisecco →"}
          </a>
        </td>
      </tr>
    </table>
    `,
    `Bienvenue sur Bisecco, ${opts.name}`,
  );
  const text = `Bienvenue sur Bisecco, ${opts.name} !\n\nVotre compte est créé.\n\nhttps://bisecco.fr/mon-profil`;
  return {
    subject: "Bienvenue sur Bisecco 👋",
    html,
    text,
  };
}

export function feedPostApprovedEmail(opts: { recipientName: string; feedUrl: string }): { subject: string; html: string; text: string } {
  const html = wrap(
    `
      <p style="margin:0 0 12px;font-size:15px;color:${COLORS.ink600};">Bonjour ${opts.recipientName},</p>
      <h1 style="margin:0 0 18px;font-size:22px;font-weight:800;color:${COLORS.ink};line-height:1.3;">
        Votre publication est en ligne ✨
      </h1>
      <p style="margin:0 0 22px;font-size:15px;color:${COLORS.ink600};line-height:1.6;">
        Notre équipe a validé votre post. Il est désormais visible dans le fil d'actualité de Bisecco par toute la communauté.
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
        <tr><td style="background:${COLORS.brand};border-radius:10px;">
          <a href="${opts.feedUrl}" style="display:inline-block;padding:13px 26px;color:${COLORS.white};font-weight:700;text-decoration:none;font-size:14px;">
            Voir ma publication →
          </a>
        </td></tr>
      </table>
      <p style="margin:18px 0 0;font-size:13px;color:${COLORS.ink400};">Merci de contribuer à la communauté Bisecco.</p>
    `,
    "Votre post a été validé",
  );
  const text = `Bonjour ${opts.recipientName},\n\nVotre post a été approuvé et est désormais visible : ${opts.feedUrl}\n\nMerci de contribuer à Bisecco.`;
  return { subject: "Votre publication est en ligne ✨", html, text };
}

export function feedPostRejectedEmail(opts: {
  recipientName: string;
  reason: string;
  contentExcerpt: string;
}): { subject: string; html: string; text: string } {
  const html = wrap(
    `
      <p style="margin:0 0 12px;font-size:15px;color:${COLORS.ink600};">Bonjour ${opts.recipientName},</p>
      <h1 style="margin:0 0 18px;font-size:22px;font-weight:800;color:${COLORS.ink};line-height:1.3;">
        Votre publication n'a pas été retenue
      </h1>
      <p style="margin:0 0 18px;font-size:15px;color:${COLORS.ink600};line-height:1.6;">
        Après examen par notre équipe, votre publication ne pourra pas être mise en ligne pour la raison suivante :
      </p>
      <div style="background:#fff4ed;border-left:4px solid ${COLORS.brand};padding:14px 18px;margin:0 0 22px;border-radius:6px;">
        <p style="margin:0;font-size:14px;color:${COLORS.ink};font-weight:600;">${opts.reason}</p>
      </div>
      <p style="margin:0 0 8px;font-size:13px;color:${COLORS.ink400};font-weight:600;">Extrait de votre post :</p>
      <p style="margin:0 0 22px;font-size:14px;color:${COLORS.ink600};font-style:italic;background:#f7f7f5;padding:12px 16px;border-radius:8px;">
        "${opts.contentExcerpt}${opts.contentExcerpt.length >= 200 ? "…" : ""}"
      </p>
      <p style="margin:0 0 12px;font-size:14px;color:${COLORS.ink600};line-height:1.6;">
        Vous pouvez republier un contenu reformulé qui respecte nos règles d'utilisation. Pour toute question, contactez-nous à <a href="mailto:contact@bisecco.fr" style="color:${COLORS.brand};">contact@bisecco.fr</a>.
      </p>
    `,
    "Publication non retenue",
  );
  const text = `Bonjour ${opts.recipientName},\n\nVotre publication n'a pas été retenue.\nRaison : ${opts.reason}\n\nExtrait : "${opts.contentExcerpt}"\n\nContact : contact@bisecco.fr`;
  return { subject: "Publication non retenue · Bisecco", html, text };
}
