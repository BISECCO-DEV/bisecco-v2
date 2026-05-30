---
description: Génère un nouveau template email branded Bisecco
argument-hint: <nom du template> "<sujet de l'email>"
---

Tu dois ajouter un nouveau template email dans `lib/mail/templates.ts`.

L'utilisateur a donné : **$ARGUMENTS**

Procédure :

1. Lire le fichier `lib/mail/templates.ts` pour comprendre la structure (`wrap()`, palette COLORS, exports)
2. Ajouter une nouvelle fonction `export function {nom}Email(opts: {...}): { subject: string; html: string; text: string }` juste AVANT `welcomeEmail`
3. Utiliser :
   - Le helper `wrap(content, preheader)` pour avoir le header + footer Bisecco
   - Les couleurs `COLORS.brand` (orange), `COLORS.ink` (navy), `COLORS.ink600`, `COLORS.bg`
   - Un bouton CTA principal (table HTML, pas div)
   - Pas d'em dashes (—) en français → utiliser des virgules ou tirets simples
4. Échapper le contenu user avec `escapeHtml()` si besoin
5. Texte version texte pur (text) aussi

Template type :

```typescript
export function {nom}Email(opts: { /* params typés */ }): { subject: string; html: string; text: string } {
  const html = wrap(
    `
    <h1 style="font-size:22px;font-weight:800;color:${COLORS.ink};margin:0 0 16px;">TITRE</h1>
    <p style="font-size:15px;line-height:1.6;color:${COLORS.ink600};margin:0 0 20px;">Bonjour,</p>
    <!-- contenu -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
      <tr>
        <td style="background:${COLORS.brand};border-radius:12px;">
          <a href="..." style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:${COLORS.white};text-decoration:none;">
            CTA →
          </a>
        </td>
      </tr>
    </table>
    `,
    "Preheader (apparait sous le sujet dans l'inbox)",
  );
  const text = `Version texte`;
  return { subject: "Sujet du mail", html, text };
}
```

Une fois ajouté, donner à l'utilisateur l'exemple d'appel depuis une server action :

```typescript
import { sendMail } from "@/lib/mail/mailer";
import { {nom}Email } from "@/lib/mail/templates";

const tpl = {nom}Email({ /* params */ });
await sendMail({ to: email, subject: tpl.subject, html: tpl.html, text: tpl.text });
```
