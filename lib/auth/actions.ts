"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomBytes, createHash } from "crypto";
import bcrypt from "bcryptjs";
import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { verifySiren } from "@/lib/siren";
import { sendMail } from "@/lib/mail/mailer";
import { resetPasswordEmail, verifyEmailTemplate, newSignupAdminEmail } from "@/lib/mail/templates";

// Adresse(s) admin qui reçoivent les notifications d'inscription
const ADMIN_NOTIFY_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || "contact@bisecco.fr";

/** Envoie une notification interne à Bisecco quand un nouveau user s'inscrit. */
/**
 * Nettoie un éventuel "orphelin" Supabase Auth : si l'email existe dans auth.users
 * mais qu'il n'y a aucune ligne correspondante dans public.users (active ou soft-deleted),
 * on supprime l'orphelin pour permettre une nouvelle inscription propre.
 * Retourne `{ kind: "real_duplicate" }` si l'email est vraiment utilisé (compte actif),
 * `{ kind: "cleaned" }` si on a nettoyé un orphelin (signup peut continuer),
 * `{ kind: "none" }` si aucun conflit.
 */
async function cleanupOrphanAuthUser(email: string): Promise<{ kind: "real_duplicate" | "cleaned" | "none" }> {
  const admin = createSupabaseAdminClient();

  const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const authUser = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (!authUser) return { kind: "none" };

  // Y a-t-il une ligne dans public.users (active ou soft-deleted) qui matche ?
  const { data: publicUser } = await admin
    .from("users")
    .select("id, deleted_at")
    .ilike("email", email)
    .maybeSingle();

  // Si public.users existe ET pas soft-deleted → vrai doublon
  if (publicUser && !publicUser.deleted_at) {
    return { kind: "real_duplicate" };
  }

  // Sinon (orphelin auth.users ou public.users soft-deleted) → on nettoie
  try {
    await admin.auth.admin.deleteUser(authUser.id);
    // Hard-delete aussi la ligne soft-deleted dans public.users pour repartir propre
    if (publicUser) {
      await admin.from("users").delete().eq("id", publicUser.id);
    }
    return { kind: "cleaned" };
  } catch (e) {
    console.error("[cleanupOrphanAuthUser] failed to clean:", e);
    return { kind: "real_duplicate" };
  }
}

async function notifyAdminOfSignup(opts: {
  name: string;
  email: string;
  role: "particulier" | "artisan";
  phone?: string | null;
  city?: string | null;
  companyName?: string | null;
  siren?: string | null;
  metiers?: string[];
  userId?: number | null;
}): Promise<void> {
  try {
    const tpl = newSignupAdminEmail(opts);
    const result = await sendMail({
      to: ADMIN_NOTIFY_EMAIL,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
    });
    if (!result.ok) {
      console.error("[notifyAdminOfSignup] sendMail failed:", result.error);
    }
  } catch (e) {
    console.error("[notifyAdminOfSignup] error:", e);
  }
}

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1h
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export type AuthState = { error?: string; success?: string } | undefined;

function generateClientNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1_000_000).toString().padStart(6, "0");
  return `BIS-${year}-${random}`;
}

function generateReferralCode(name: string): string {
  const parts = name.trim().split(/[\s\-]+/);
  const initials = ((parts[0]?.[0] ?? "B") + (parts[1]?.[0] ?? "I"))
    .toUpperCase()
    .replace(/[^A-Z]/g, "X")
    .padEnd(2, "X");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `${initials}-${suffix}`;
}

/**
 * Vérifie un hash bcrypt legacy Laravel ($2y$...).
 * Les hashes Laravel utilisent $2y$ ; bcryptjs accepte aussi $2a$/$2b$.
 * On normalise le préfixe pour être safe.
 */
async function verifyLegacyPassword(password: string, hash: string): Promise<boolean> {
  try {
    const normalized = hash.startsWith("$2y$") ? "$2a$" + hash.slice(4) : hash;
    return await bcrypt.compare(password, normalized);
  } catch {
    return false;
  }
}

/**
 * Migre un utilisateur legacy (présent dans public.users mais pas dans auth.users)
 * vers Supabase Auth en réutilisant son mot de passe Laravel vérifié.
 * Retourne true si la migration a réussi.
 */
async function migrateLegacyUser(email: string, password: string): Promise<boolean> {
  const admin = createSupabaseAdminClient();

  // Récupérer le user legacy avec son hash de mot de passe
  const { data: legacy } = await admin
    .from("users")
    .select("id, email, password, name, role, validation_status")
    .ilike("email", email)
    .is("deleted_at", null)
    .maybeSingle();

  if (!legacy || !legacy.password) return false;

  // Vérifier le hash Laravel
  const ok = await verifyLegacyPassword(password, legacy.password);
  if (!ok) return false;

  // Créer l'utilisateur dans Supabase Auth avec le même mot de passe
  const { data: created, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // déjà vérifié par l'inscription d'origine
    user_metadata: {
      full_name: legacy.name,
      role: legacy.role,
      migrated_from_legacy: true,
    },
  });

  if (error || !created.user) {
    // Si l'user existe déjà dans auth.users (test précédent, reset partiel...),
    // on met à jour son mot de passe pour qu'il corresponde au mdp legacy vérifié.
    if (error?.message?.toLowerCase().includes("already")) {
      try {
        const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
        const existing = list.users.find((u) => u.email?.toLowerCase() === email);
        if (existing) {
          await admin.auth.admin.updateUserById(existing.id, { password });
          // Nettoyer le hash legacy
          await admin
            .from("users")
            .update({ password: null, updated_at: new Date().toISOString() })
            .eq("id", legacy.id);
          return true;
        }
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  }

  // Nettoyer le hash legacy (Auth devient source de vérité)
  await admin
    .from("users")
    .update({ password: null, updated_at: new Date().toISOString() })
    .eq("id", legacy.id);

  return true;
}

/** Vérifie que le user a son email confirmé + validation_status = approved */
async function checkAccountAccess(email: string): Promise<{ ok: true } | { ok: false; reason: string }> {
  const admin = createSupabaseAdminClient();

  // 1. Vérifie email confirmé dans auth.users
  const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const authUser = list.users.find((u) => u.email?.toLowerCase() === email);
  if (authUser && !authUser.email_confirmed_at) {
    return {
      ok: false,
      reason: "Votre email n'est pas encore confirmé. Vérifiez votre boîte mail (et vos spams) pour cliquer sur le lien de confirmation.",
    };
  }

  // 2. Vérifie validation_status dans public.users
  const { data: profile } = await admin
    .from("users")
    .select("validation_status")
    .ilike("email", email)
    .is("deleted_at", null)
    .maybeSingle();

  if (profile?.validation_status === "pending") {
    return {
      ok: false,
      reason: "Votre compte est en attente de validation par notre équipe (sous 24h). Vous recevrez un email dès qu'il sera activé.",
    };
  }

  if (profile?.validation_status === "rejected") {
    return {
      ok: false,
      reason: "Votre compte a été refusé. Contactez-nous à contact@bisecco.fr pour plus d'informations.",
    };
  }

  return { ok: true };
}

/** Connexion email/password (avec auto-migration legacy si nécessaire) */
export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  if (!email || !password) return { error: "Email et mot de passe requis." };

  const supabase = await createClient();

  // 1ère tentative : Supabase Auth standard
  const first = await supabase.auth.signInWithPassword({ email, password });

  if (!first.error) {
    // Email + password OK · vérifier que le compte est validé
    const check = await checkAccountAccess(email);
    if (!check.ok) {
      await supabase.auth.signOut();
      return { error: check.reason };
    }
    revalidatePath("/", "layout");
    redirect("/mon-profil");
  }

  // Échec : tenter une migration legacy (user dans public.users avec hash Laravel)
  const migrated = await migrateLegacyUser(email, password);
  if (!migrated) {
    const admin = createSupabaseAdminClient();

    // Vérifier s'il s'agit d'un compte Auth existant mais email non confirmé
    // (cas le plus fréquent quand un user vient de s'inscrire et tente le login)
    const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const authUser = list.users.find((u) => u.email?.toLowerCase() === email);

    if (authUser && !authUser.email_confirmed_at) {
      return {
        error:
          "Votre email n'est pas encore confirmé. Vérifiez votre boîte mail (et les spams) pour cliquer sur le lien d'activation.",
      };
    }

    // Vrai legacy V1 : present dans public.users avec un hash bcrypt Laravel ($2y$...)
    // ET pas (encore) dans auth.users
    if (!authUser) {
      const { data: legacy } = await admin
        .from("users")
        .select("id, password")
        .ilike("email", email)
        .is("deleted_at", null)
        .maybeSingle();

      if (legacy && legacy.password && legacy.password.startsWith("$2y$")) {
        return {
          error:
            "Votre compte a été migré depuis l'ancienne version. Cliquez sur « Mot de passe oublié ? » pour définir votre nouveau mot de passe.",
        };
      }
    }

    return { error: "Email ou mot de passe incorrect." };
  }

  // Re-tenter le sign-in après migration
  const second = await supabase.auth.signInWithPassword({ email, password });
  if (second.error) {
    return { error: "Compte migré, mais erreur de connexion. Réessayez." };
  }

  // Vérifier que le compte est validé
  const check = await checkAccountAccess(email);
  if (!check.ok) {
    await supabase.auth.signOut();
    return { error: check.reason };
  }

  revalidatePath("/", "layout");
  redirect("/mon-profil");
}

/** Inscription email/password + création de la ligne dans public.users */
export async function signupAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();
  const role = (formData.get("role")?.toString() || "particulier") as "particulier" | "artisan";
  const phoneRaw = formData.get("phone")?.toString().trim() || "";

  if (!email || !password) return { error: "Email et mot de passe requis." };
  if (password.length < 8) return { error: "Le mot de passe doit faire 8 caractères minimum." };

  // Téléphone obligatoire pour tous (artisans + particuliers)
  const phoneDigits = phoneRaw.replace(/[^0-9]/g, "");
  if (phoneDigits.length < 8) {
    return { error: "Le numéro de téléphone est obligatoire (8 chiffres minimum)." };
  }

  const admin = createSupabaseAdminClient();

  // ── Cas ARTISAN : SIREN obligatoire ─────────────────────────────
  if (role === "artisan") {
    const fullName = formData.get("full_name")?.toString().trim();
    const companyName = formData.get("company_name")?.toString().trim();
    const sirenRaw = formData.get("siren")?.toString().replace(/\s/g, "");
    const metiersJsonRaw = formData.get("metiers_json")?.toString().trim() || "[]";
    const phone = formData.get("phone")?.toString().trim() || null;
    const city = formData.get("city")?.toString().trim() || null;

    // Parse les métiers (jusqu'à 3, peuvent être custom)
    type MetierPickInput = { name: string; slug: string | null; isCustom?: boolean };
    let metiersPicked: MetierPickInput[] = [];
    try {
      const parsed = JSON.parse(metiersJsonRaw);
      if (Array.isArray(parsed)) {
        metiersPicked = parsed
          .filter((m): m is MetierPickInput => m && typeof m.name === "string")
          .slice(0, 3); // sécurité serveur : max 3
      }
    } catch {
      // ignore
    }

    if (!fullName || !companyName || !sirenRaw || metiersPicked.length === 0) {
      return { error: "Tous les champs entreprise sont obligatoires (au moins 1 métier)." };
    }
    if (!/^\d{9}$/.test(sirenRaw)) {
      return { error: "Le SIREN doit faire 9 chiffres." };
    }

    // Email / SIREN déjà pris ? + nettoyage orphelin Supabase Auth
    const emailCheck = await cleanupOrphanAuthUser(email);
    if (emailCheck.kind === "real_duplicate") {
      return { error: "Un compte existe déjà avec cet email." };
    }

    const { data: dupeSiren } = await admin
      .from("users").select("id").eq("siren", sirenRaw).is("deleted_at", null).maybeSingle();
    if (dupeSiren) return { error: "Un compte existe déjà avec ce SIREN." };

    // Vérification SIREN INSEE
    const sirenCheck = await verifySiren(sirenRaw);
    if (!sirenCheck.found) {
      return { error: "Ce SIREN ne correspond à aucune entreprise enregistrée." };
    }
    if (sirenCheck.status && sirenCheck.status !== "A") {
      return { error: "Cette entreprise est référencée mais cessée." };
    }

    // Résolution des métiers : existants par slug, sinon création custom
    const slugifyName = (s: string) =>
      s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 80);

    const resolvedMetierIds: number[] = [];
    for (const pick of metiersPicked) {
      const slug = pick.slug ?? slugifyName(pick.name);
      // 1) Cherche par slug existant
      const { data: existing } = await admin
        .from("metiers")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

      if (existing?.id) {
        resolvedMetierIds.push(existing.id);
        continue;
      }

      // 2) Pas trouvé → crée un nouveau métier (catégorie "Services" par défaut, à modérer)
      const { data: created } = await admin
        .from("metiers")
        .insert({
          name: pick.name.slice(0, 255),
          slug,
          category: "Services",
          icon: "🔧",
          description: "Métier ajouté par un artisan, en attente de validation admin.",
        })
        .select("id")
        .single();

      if (created?.id) resolvedMetierIds.push(created.id);
    }

    if (resolvedMetierIds.length === 0) {
      return { error: "Impossible de résoudre les métiers. Réessaie." };
    }

    const primaryMetierId = resolvedMetierIds[0]!;

    // Crée le user Supabase Auth · email auto-validé pour les pros (skip vérif).
    // La validation effective passe par l'admin qui approuve validation_status.
    const { data: authUser, error: authErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, role: "artisan" },
    });
    if (authErr || !authUser.user) {
      return { error: authErr?.message ?? "Échec de création du compte." };
    }

    // Crée le user public.users
    // (name = nom du gérant uniquement · company_name est stocké dans artisan_profiles)
    const { data: created, error: createErr } = await admin
      .from("users")
      .insert({
        client_number: generateClientNumber(),
        referral_code: generateReferralCode(companyName || fullName),
        name: fullName,
        email,
        phone,
        city,
        role: "artisan",
        siren: sirenRaw,
        siren_status: sirenCheck.status,
        siren_last_checked_at: new Date().toISOString(),
        validation_status: "pending",
      })
      .select("id")
      .single();

    if (createErr || !created) {
      // Rollback auth user
      await admin.auth.admin.deleteUser(authUser.user.id);
      return { error: "Impossible de créer le profil. Réessaie." };
    }

    // Crée le profil artisan (métier principal = premier de la liste)
    const { data: profile } = await admin
      .from("artisan_profiles")
      .insert({
        user_id: created.id,
        metier_id: primaryMetierId,
        company_name: companyName,
        is_active: true,
      })
      .select("id")
      .single();

    // Insère TOUS les métiers dans la pivot (jusqu'à 3)
    if (profile) {
      const pivotRows = resolvedMetierIds.map((mid) => ({
        artisan_profile_id: profile.id,
        metier_id: mid,
      }));
      await admin.from("artisan_profile_metier").insert(pivotRows);
    }

    // Pas d'email de vérification : l'email est auto-validé pour les pros.
    // L'utilisateur attend juste la validation admin (notif par email à l'approve).

    // Notifier Bisecco de la nouvelle inscription artisan
    await notifyAdminOfSignup({
      name: `${fullName} - ${companyName}`,
      email,
      role: "artisan",
      phone,
      city,
      companyName,
      siren: sirenRaw,
      metiers: metiersPicked.map((m) => m.name),
      userId: created.id,
    });

    // Redirige vers la page de succès dédiée
    redirect(`/inscription/succes?role=artisan&email=${encodeURIComponent(email)}`);
  }

  // ── Cas PARTICULIER ─────────────────────────────────────────────
  const firstName = formData.get("first_name")?.toString().trim() ?? "";
  const lastName = formData.get("last_name")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() || null;
  const city = formData.get("city")?.toString().trim() || null;
  const fullName = `${firstName} ${lastName}`.trim() || email.split("@")[0];

  // Email déjà pris ? + nettoyage orphelin Supabase Auth
  const emailCheckPart = await cleanupOrphanAuthUser(email);
  if (emailCheckPart.kind === "real_duplicate") {
    return { error: "Un compte existe déjà avec cet email." };
  }

  const { data: authUser, error: authErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
    user_metadata: { full_name: fullName, role: "particulier" },
  });
  if (authErr || !authUser.user) {
    return { error: authErr?.message ?? "Échec de création du compte." };
  }

  const { data: createdPart, error: createErr } = await admin
    .from("users")
    .insert({
      client_number: generateClientNumber(),
      referral_code: generateReferralCode(fullName),
      name: fullName,
      email,
      phone,
      city,
      role: "particulier",
      // Particulier : aucune validation manuelle nécessaire (pas de SIREN à vérifier).
      // Le user peut se connecter dès qu'il a confirmé son email.
      validation_status: "approved",
    })
    .select("id")
    .single();

  if (createErr || !createdPart) {
    await admin.auth.admin.deleteUser(authUser.user.id);
    return { error: "Impossible de créer le compte. Réessaie." };
  }

  // Envoyer email de vérification via nodemailer (PAS d'auto-login)
  await sendVerificationEmail(email, fullName, "particulier");

  // Notifier Bisecco de la nouvelle inscription particulier
  await notifyAdminOfSignup({
    name: fullName,
    email,
    role: "particulier",
    phone,
    city,
    userId: createdPart.id,
  });

  // Redirige vers la page de succès dédiée
  redirect(`/inscription/succes?role=particulier&email=${encodeURIComponent(email)}`);
}

/** Génère un lien de confirmation email + envoie l'email via nodemailer */
async function sendVerificationEmail(
  email: string,
  name: string,
  role: "particulier" | "artisan",
): Promise<void> {
  const admin = createSupabaseAdminClient();
  const origin = process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://bisecco.fr";

  // Génère un magic link qui confirmera l'email au clic
  // Le redirect passe par /auth/callback pour échanger le code puis arriver sur /email-verifie
  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: `${origin}/auth/callback?next=/email-verifie` },
  });

  if (error || !data?.properties?.action_link) {
    console.error("[sendVerificationEmail] generateLink failed:", error?.message);
    return;
  }

  const tpl = verifyEmailTemplate({ verifyUrl: data.properties.action_link, name, role });
  const result = await sendMail({ to: email, subject: tpl.subject, html: tpl.html, text: tpl.text });
  if (!result.ok) {
    console.error("[sendVerificationEmail] sendMail failed:", result.error);
  }
}

/**
 * Demande de réinitialisation de mot de passe · système custom.
 * On génère NOTRE token, on stocke son hash en DB, on envoie le mail nous-mêmes.
 * Aucune dépendance aux liens Supabase Auth.
 */
export async function requestPasswordResetAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  if (!email) return { error: "Email requis." };

  const admin = createSupabaseAdminClient();
  const origin = process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://bisecco.fr";
  const successMsg = "Si un compte existe, vous recevrez un email avec un lien de réinitialisation.";

  // Rate limit IP : max 3 demandes par heure depuis la même IP
  try {
    const { headers } = await import("next/headers");
    const h = await headers();
    const ip = (h.get("x-forwarded-for")?.split(",")[0] || h.get("x-real-ip") || "").trim();
    if (ip) {
      const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { count } = await admin
        .from("password_resets")
        .select("*", { count: "exact", head: true })
        .eq("ip_address", ip)
        .gte("created_at", since);
      if ((count ?? 0) >= 3) {
        return { error: "Trop de demandes. Réessayez dans 1h." };
      }
    }
  } catch {
    // ignore
  }

  // 1. Vérifier l'existence du compte (auth.users OU public.users legacy)
  let userName: string | null = null;

  const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const authUser = list.users.find((u) => u.email?.toLowerCase() === email);

  if (!authUser) {
    // Pas dans auth.users → check legacy public.users
    const { data: legacy } = await admin
      .from("users")
      .select("id, name, role, email")
      .ilike("email", email)
      .is("deleted_at", null)
      .maybeSingle();

    if (!legacy) {
      // Aucun compte → réponse uniforme (pas de leak)
      return { success: successMsg };
    }

    // Créer le compte Auth pour user legacy
    userName = legacy.name;
    const tempPassword = `Bsc-${Math.random().toString(36).slice(2)}-${Date.now()}`;
    await admin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { full_name: legacy.name, role: legacy.role, migrated_from_legacy: true },
    });
  } else {
    const { data: profile } = await admin
      .from("users")
      .select("name")
      .ilike("email", email)
      .is("deleted_at", null)
      .maybeSingle();
    userName = profile?.name ?? null;
  }

  // 2. Générer NOTRE token (32 bytes hex = 64 chars)
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS).toISOString();

  // 3. Invalider les anciens tokens non-utilisés pour cet email (sécurité)
  await admin
    .from("password_resets")
    .update({ used_at: new Date().toISOString() })
    .eq("email", email)
    .is("used_at", null);

  // 4. Stocker le hash du token en DB
  let resetIp: string | null = null;
  try {
    const { headers } = await import("next/headers");
    const h = await headers();
    resetIp = (h.get("x-forwarded-for")?.split(",")[0] || h.get("x-real-ip") || "").trim() || null;
  } catch { /* ignore */ }

  const { error: insertErr } = await admin.from("password_resets").insert({
    email,
    token_hash: tokenHash,
    expires_at: expiresAt,
    ip_address: resetIp,
  });

  if (insertErr) {
    console.error("[reset] insert token failed:", insertErr.message);
    return { success: successMsg };
  }

  // 5. Construire le lien vers notre page
  const resetUrl = `${origin}/reinitialiser-mot-de-passe?token=${token}`;

  // 6. Envoyer le mail via nodemailer + o2switch SMTP
  const { subject, html, text } = resetPasswordEmail({ resetUrl, name: userName });
  const result = await sendMail({ to: email, subject, html, text });

  if (!result.ok) {
    console.error("[reset] sendMail failed:", result.error);
  }

  return { success: successMsg };
}

/** Vérifie qu'un token reset est valide (existe, non utilisé, non expiré). */
export async function verifyResetTokenAction(token: string): Promise<{ ok: true; email: string } | { ok: false; error: string }> {
  if (!token || token.length !== 64) {
    return { ok: false, error: "Token invalide." };
  }

  const admin = createSupabaseAdminClient();
  const tokenHash = hashToken(token);

  const { data: row } = await admin
    .from("password_resets")
    .select("email, expires_at, used_at")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (!row) return { ok: false, error: "Lien invalide." };
  if (row.used_at) return { ok: false, error: "Ce lien a déjà été utilisé." };
  if (new Date(row.expires_at).getTime() < Date.now()) {
    return { ok: false, error: "Ce lien a expiré. Demandez-en un nouveau." };
  }

  return { ok: true, email: row.email as string };
}

/** Définit le nouveau mot de passe après vérification du token. */
export async function completePasswordResetAction(
  token: string,
  newPassword: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!newPassword || newPassword.length < 8) {
    return { ok: false, error: "Le mot de passe doit faire 8 caractères minimum." };
  }

  const verify = await verifyResetTokenAction(token);
  if (!verify.ok) return verify;

  const admin = createSupabaseAdminClient();

  // Récupère le user Auth via email
  const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const authUser = list.users.find((u) => u.email?.toLowerCase() === verify.email);
  if (!authUser) return { ok: false, error: "Utilisateur introuvable." };

  // Update password ET confirme l'email automatiquement.
  // Reset password = preuve d'accès au compte → on peut confirmer l'email en même temps,
  // sinon l'utilisateur reste bloqué à la connexion après reset.
  const { error: updErr } = await admin.auth.admin.updateUserById(authUser.id, {
    password: newPassword,
    email_confirm: true,
  });
  if (updErr) return { ok: false, error: "Impossible de modifier le mot de passe." };

  // Marque le token comme utilisé
  await admin
    .from("password_resets")
    .update({ used_at: new Date().toISOString() })
    .eq("token_hash", hashToken(token));

  // Nettoie le password hash legacy si présent
  await admin
    .from("users")
    .update({ password: null, updated_at: new Date().toISOString() })
    .ilike("email", verify.email);

  return { ok: true };
}

/** Déconnexion */
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

/** Connexion OAuth Google */
export async function googleLoginAction() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://bisecco.fr"}/auth/callback`,
    },
  });

  if (error || !data.url) redirect("/connexion?error=oauth");
  redirect(data.url);
}
