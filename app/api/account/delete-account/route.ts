import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/db/current-user";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import { sendMail } from "@/lib/mail/mailer";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * Suppression de compte RGPD · Article 17 (droit à l'oubli).
 *
 * Process :
 *   1. Vérifier la confirmation textuelle ("SUPPRIMER" obligatoire)
 *   2. Soft delete public.users (deleted_at = now())
 *   3. Anonymise les data sensibles (email, name, phone, photos URLs)
 *   4. Hard delete dans auth.users (Supabase Auth) → coupe la session
 *   5. Email de confirmation envoyé à l'ex-adresse
 *
 * On ne hard-delete PAS public.users car ça cascade-supprimerait les
 * messages, avis, posts d'autres users qui référencent ce user_id.
 * À la place : anonymisation = données perso retirées, traces gardées.
 *
 * Pour effacement complet (artisan qui veut tout supprimer), faut passer
 * par le support contact@bisecco.fr (procédure manuelle).
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    return NextResponse.json({ ok: false, error: "NON_AUTHENTIFIE" }, { status: 401 });
  }

  let body: { confirm?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Body JSON invalide" }, { status: 400 });
  }

  // Sécurité : exige une confirmation textuelle pour éviter les suppressions accidentelles
  if (body.confirm !== "SUPPRIMER") {
    return NextResponse.json(
      { ok: false, error: 'Tapez "SUPPRIMER" en majuscules pour confirmer.' },
      { status: 400 },
    );
  }

  const admin = createSupabaseAdminClient();
  const uid = user.id;
  const exEmail = user.email;
  const exName = user.name;

  // 1. Soft delete + anonymisation public.users
  const anonymized = {
    email: `deleted-${uid}@bisecco.fr.invalid`,
    name: "Utilisateur supprimé",
    phone: null,
    city: null,
    description: null,
    profile_photo: null,
    cover_photo: null,
    street_address: null,
    latitude: null,
    longitude: null,
    siren: null,
    deleted_at: new Date().toISOString(),
  };
  const { error: updErr } = await admin.from("users").update(anonymized).eq("id", uid);
  if (updErr) {
    return NextResponse.json({ ok: false, error: `DB : ${updErr.message}` }, { status: 500 });
  }

  // 2. Hard delete auth.users (coupe la session côté Supabase)
  try {
    await admin.auth.admin.deleteUser(user.auth_id);
  } catch (err) {
    console.error("[delete-account] auth.admin.deleteUser failed", err);
    // Pas bloquant : public.users est déjà anonymisé
  }

  // 3. Sign out la session courante côté server
  try {
    const server = await createSupabaseServerClient();
    await server.auth.signOut();
  } catch {
    // ignore
  }

  // 4. Email de confirmation à l'ex-adresse
  if (exEmail) {
    try {
      await sendMail({
        to: exEmail,
        subject: "Votre compte Bisecco a été supprimé",
        text: `Bonjour ${exName},\n\nVotre compte Bisecco a bien été supprimé conformément à votre demande (Article 17 RGPD - Droit à l'oubli).\n\nVos données personnelles ont été anonymisées. Si vous changez d'avis, vous pouvez créer un nouveau compte à tout moment.\n\nPour toute question : contact@bisecco.fr\n\nL'équipe Bisecco`,
        html: `<div style="font-family:Manrope,sans-serif;color:#0d1e4a"><h2>Compte supprimé</h2><p>Bonjour ${exName},</p><p>Votre compte Bisecco a bien été <strong>supprimé</strong> conformément à votre demande (Article 17 RGPD).</p><p>Vos données personnelles ont été anonymisées.</p><p>Si vous changez d'avis, vous pouvez créer un nouveau compte à tout moment.</p><p>Pour toute question : <a href="mailto:contact@bisecco.fr">contact@bisecco.fr</a></p><p style="color:#64748b">L'équipe Bisecco</p></div>`,
      });
    } catch (err) {
      console.error("[delete-account] mail failed", err);
    }
  }

  return NextResponse.json({ ok: true });
}
