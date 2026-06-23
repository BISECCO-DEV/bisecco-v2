import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { verifySmtp } from "@/lib/mail/mailer";

/**
 * Health checks Bisecco — vérifie l'état de tout le site en temps réel.
 *
 * Utilisé par :
 *   - la page admin /admin/sante (affichage checklist)
 *   - le cron /api/cron/health-check (exécution toutes les 30 min + alerte email)
 *
 * Chaque check est isolé (try/catch) : un check qui plante n'empêche pas les autres.
 */

export type CheckStatus = "ok" | "warn" | "error";

export type HealthCheck = {
  id: string;
  category: string;
  label: string;
  status: CheckStatus;
  detail: string;
};

export type HealthReport = {
  ranAt: string;
  checks: HealthCheck[];
  summary: { ok: number; warn: number; error: number; total: number };
  /** Statut global : error si au moins un rouge, warn si au moins un orange, sinon ok. */
  overall: CheckStatus;
};

type AdminClient = ReturnType<typeof createSupabaseAdminClient>;

/** Compte les lignes d'une table (head only) · lève si erreur DB (table absente…). */
async function countRows(
  supabase: AdminClient,
  table: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter?: (q: any) => any,
): Promise<number> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q: any = supabase.from(table).select("*", { count: "exact", head: true });
  if (filter) q = filter(q);
  const { count, error } = await q;
  if (error) throw new Error(error.message);
  return count ?? 0;
}

/** Exécute un check en l'isolant : toute exception → statut "error". */
async function runOne(
  id: string,
  category: string,
  label: string,
  fn: () => Promise<{ status: CheckStatus; detail: string }>,
): Promise<HealthCheck> {
  try {
    const { status, detail } = await fn();
    return { id, category, label, status, detail };
  } catch (e) {
    return {
      id,
      category,
      label,
      status: "error",
      detail: e instanceof Error ? e.message : "Erreur inconnue",
    };
  }
}

export async function runHealthChecks(): Promise<HealthReport> {
  const supabase = createSupabaseAdminClient();
  const BASE = process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://bisecco.fr";

  const checks = await Promise.all([
    // ─── Infrastructure ───────────────────────────────────────────────
    runOne("db", "Infrastructure", "Base de données", async () => {
      const n = await countRows(supabase, "users");
      return { status: "ok", detail: `Connexion OK · ${n} comptes` };
    }),

    runOne("env", "Infrastructure", "Variables d'environnement", async () => {
      const required = [
        "NEXT_PUBLIC_SUPABASE_URL",
        "SUPABASE_SERVICE_ROLE_KEY",
        "APP_URL",
        "SMTP_HOST",
        "SMTP_USER",
        "SMTP_PASSWORD",
        "CRON_SECRET",
      ];
      const missing = required.filter((k) => !process.env[k]);
      if (missing.length) {
        return { status: "error", detail: `Manquantes : ${missing.join(", ")}` };
      }
      return { status: "ok", detail: `${required.length} variables critiques présentes` };
    }),

    runOne("smtp", "Infrastructure", "Serveur mail (SMTP)", async () => {
      const r = await verifySmtp();
      return r.ok
        ? { status: "ok", detail: "Connexion au serveur mail OK · les emails partent" }
        : { status: "error", detail: r.error ?? "Connexion SMTP impossible" };
    }),

    runOne("storage", "Infrastructure", "Stockage (Supabase Storage)", async () => {
      const { data, error } = await supabase.storage.listBuckets();
      if (error) throw new Error(error.message);
      return { status: "ok", detail: `${data?.length ?? 0} buckets accessibles` };
    }),

    // ─── Données & fonctionnalités ────────────────────────────────────
    runOne("users", "Données", "Comptes utilisateurs", async () => {
      const [pros, parts, pending] = await Promise.all([
        countRows(supabase, "users", (q) => q.eq("role", "artisan").is("deleted_at", null)),
        countRows(supabase, "users", (q) => q.eq("role", "particulier").is("deleted_at", null)),
        countRows(supabase, "users", (q) =>
          q.eq("validation_status", "pending").is("deleted_at", null),
        ),
      ]);
      return { status: "ok", detail: `${pros} pros · ${parts} particuliers · ${pending} en attente` };
    }),

    runOne("artisan_profiles", "Données", "Profils artisans", async () => {
      const n = await countRows(supabase, "artisan_profiles", (q) => q.eq("is_active", true));
      return { status: "ok", detail: `${n} profils actifs` };
    }),

    runOne("metiers", "Données", "Métiers", async () => {
      const n = await countRows(supabase, "metiers");
      return n > 0
        ? { status: "ok", detail: `${n} métiers` }
        : { status: "warn", detail: "Aucun métier en base" };
    }),

    runOne("quotes", "Données", "Devis", async () => {
      const n = await countRows(supabase, "quote_requests");
      return { status: "ok", detail: `${n} demandes de devis` };
    }),

    runOne("messages", "Données", "Messagerie", async () => {
      const [threads, msgs] = await Promise.all([
        countRows(supabase, "message_threads"),
        countRows(supabase, "messages"),
      ]);
      return { status: "ok", detail: `${threads} conversations · ${msgs} messages` };
    }),

    runOne("reviews", "Données", "Avis", async () => {
      const pending = await countRows(supabase, "reviews", (q) => q.eq("status", "pending"));
      return pending > 0
        ? { status: "warn", detail: `${pending} avis en attente de modération` }
        : { status: "ok", detail: "Aucun avis en attente" };
    }),

    runOne("blog", "Données", "Blog", async () => {
      const n = await countRows(supabase, "blog_posts", (q) => q.eq("status", "published"));
      return n > 0
        ? { status: "ok", detail: `${n} articles publiés` }
        : { status: "warn", detail: "Aucun article publié" };
    }),

    runOne("errors", "Données", "Erreurs récentes (24 h)", async () => {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const n = await countRows(supabase, "error_logs", (q) =>
        q.eq("status", "open").gte("last_seen_at", since),
      );
      if (n === 0) return { status: "ok", detail: "Aucune erreur enregistrée sur 24 h" };
      if (n < 5) return { status: "warn", detail: `${n} erreur(s) sur 24 h` };
      return { status: "error", detail: `${n} erreurs sur 24 h — à investiguer` };
    }),

    // ─── Cohérence (bugs silencieux) ──────────────────────────────────
    runOne("pending_old", "Cohérence", "Comptes en attente > 2 jours", async () => {
      const cutoff = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
      const n = await countRows(supabase, "users", (q) =>
        q.eq("validation_status", "pending").is("deleted_at", null).lt("created_at", cutoff),
      );
      return n > 0
        ? { status: "warn", detail: `${n} compte(s) à valider depuis +2 jours` }
        : { status: "ok", detail: "Validations à jour" };
    }),

    // ─── SEO / Public ─────────────────────────────────────────────────
    runOne("sitemap", "SEO / Public", "Sitemap", async () => {
      const res = await fetch(`${BASE}/sitemap.xml`, { cache: "no-store" });
      if (!res.ok) return { status: "error", detail: `HTTP ${res.status}` };
      const xml = await res.text();
      const urls = (xml.match(/<url>/g) ?? []).length;
      return { status: "ok", detail: `Accessible · ${urls} URLs` };
    }),

    runOne("gates", "SEO / Public", "Mode du site", async () => {
      const comingSoon = process.env.COMING_SOON_ENABLED !== "false";
      const maintEnv = process.env.MAINTENANCE_ENABLED === "true";
      let maintDb = false;
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "maintenance_enabled")
          .maybeSingle();
        maintDb = data?.value === true || data?.value === "true";
      } catch {
        /* table absente : on ignore */
      }
      const maintenance = maintEnv || maintDb;
      if (maintenance) return { status: "warn", detail: "⚠️ MAINTENANCE ACTIVE (site fermé au public)" };
      if (comingSoon) return { status: "warn", detail: "Mode coming-soon actif (accès via code bypass)" };
      return { status: "ok", detail: "Site ouvert au public" };
    }),
  ]);

  const ok = checks.filter((c) => c.status === "ok").length;
  const warn = checks.filter((c) => c.status === "warn").length;
  const error = checks.filter((c) => c.status === "error").length;
  const overall: CheckStatus = error > 0 ? "error" : warn > 0 ? "warn" : "ok";

  return {
    ranAt: new Date().toISOString(),
    checks,
    summary: { ok, warn, error, total: checks.length },
    overall,
  };
}
