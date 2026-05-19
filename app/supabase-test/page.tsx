import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { fetchAllMetiers, fetchMetiersGroupedByCategory } from "@/lib/db/metiers";
import { CheckCircle2, XCircle, Database, Key, ShieldCheck, Briefcase } from "lucide-react";

export const metadata: Metadata = {
  title: "Test Supabase",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function runTests() {
  const checks: Array<{ name: string; ok: boolean; detail: string }> = [];

  // 1. Variables d'environnement
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  checks.push({
    name: "NEXT_PUBLIC_SUPABASE_URL",
    ok: !!url && !/xxx|placeholder/i.test(url),
    detail: url ? `${url.slice(0, 35)}...` : "Non définie",
  });
  checks.push({
    name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ok: !!anon && anon.length > 40,
    detail: anon ? `${anon.slice(0, 20)}... (${anon.length} chars)` : "Non définie",
  });
  checks.push({
    name: "SUPABASE_SERVICE_ROLE_KEY",
    ok: !!serviceRole && serviceRole.length > 40,
    detail: serviceRole ? `${serviceRole.slice(0, 20)}... (${serviceRole.length} chars)` : "Non définie",
  });

  // 2. Connexion réelle au projet
  let connectionOk = false;
  let connectionDetail = "Skip — variables manquantes";
  if (url && anon) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.getSession();
      if (error) {
        connectionDetail = `Erreur: ${error.message}`;
      } else {
        connectionOk = true;
        connectionDetail = "Session check OK — Supabase répond";
      }
    } catch (e) {
      connectionDetail = `Exception: ${(e as Error).message}`;
    }
  }
  checks.push({ name: "Connexion à Supabase", ok: connectionOk, detail: connectionDetail });

  return checks;
}

async function tryFetchMetiers(): Promise<
  | { ok: true; total: number; categories: { category: string; count: number; sample: string[] }[] }
  | { ok: false; error: string }
> {
  try {
    const metiers = await fetchAllMetiers();
    const grouped = await fetchMetiersGroupedByCategory();
    return {
      ok: true,
      total: metiers.length,
      categories: grouped.map((g) => ({
        category: g.category,
        count: g.metiers.length,
        sample: g.metiers.slice(0, 3).map((m) => m.name),
      })),
    };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export default async function SupabaseTestPage() {
  const checks = await runTests();
  const allOk = checks.every((c) => c.ok);
  const metiersResult = allOk ? await tryFetchMetiers() : null;

  return (
    <main className="min-h-[80vh] py-20">
      <div className="container-default max-w-3xl">
        <div className="mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
            <Database size={11} strokeWidth={2.8} />
            Diagnostic
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-ink-700 tracking-tight">
            Test de connexion Supabase
          </h1>
          <p className="mt-2 text-ink-500">
            Vérifie que les variables d&apos;environnement sont correctes et que ton projet Supabase répond.
          </p>
        </div>

        {/* Status global */}
        <div
          className={`mb-8 rounded-2xl p-5 border-2 ${
            allOk
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-amber-50 border-amber-200 text-amber-800"
          }`}
        >
          <div className="flex items-center gap-3 font-bold text-lg">
            {allOk ? <CheckCircle2 size={22} /> : <XCircle size={22} />}
            {allOk ? "Tout est OK — Supabase est prêt à l'emploi" : "Configuration incomplète"}
          </div>
          {!allOk && (
            <p className="mt-2 text-sm">
              Édite <code className="px-1.5 py-0.5 rounded bg-white border text-amber-700 font-mono text-xs">.env.local</code> avec
              les vraies valeurs depuis ton dashboard Supabase, puis redémarre <code className="px-1.5 py-0.5 rounded bg-white border text-amber-700 font-mono text-xs">npm run dev</code>.
            </p>
          )}
        </div>

        {/* Liste détaillée */}
        <div className="space-y-3">
          {checks.map((c) => (
            <div
              key={c.name}
              className={`flex items-start gap-3 p-4 rounded-xl border ${
                c.ok ? "bg-white border-emerald-200" : "bg-white border-red-200"
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {c.ok ? (
                  <CheckCircle2 className="text-emerald-500" size={20} />
                ) : (
                  <XCircle className="text-red-500" size={20} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-ink-700">{c.name}</div>
                <div className="text-xs text-ink-500 mt-0.5 font-mono break-all">{c.detail}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Test de lecture réelle : métiers */}
        {metiersResult && (
          <div className="mt-10 rounded-2xl border-2 p-5 bg-white border-ink-100">
            <h2 className="font-extrabold text-ink-700 text-lg flex items-center gap-2 mb-3">
              <Briefcase size={18} className="text-brand-500" />
              Lecture des métiers depuis Supabase
            </h2>

            {metiersResult.ok ? (
              <>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-4xl font-extrabold text-brand-500">{metiersResult.total}</span>
                  <span className="text-ink-500 text-sm">métiers chargés depuis la base</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {metiersResult.categories.map((c) => (
                    <div key={c.category} className="bg-ink-50 rounded-xl p-3 border border-ink-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-ink-700 text-sm">{c.category}</span>
                        <span className="text-xs font-mono bg-white px-2 py-0.5 rounded text-ink-500 border border-ink-100">
                          {c.count}
                        </span>
                      </div>
                      <div className="text-[0.72rem] text-ink-500 truncate">
                        {c.sample.join(", ")}…
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
                  ✅ Connexion DB + lecture réussies — le V2 lit bien les vraies données Supabase.
                </p>
              </>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="font-bold text-red-700 text-sm mb-1">❌ Lecture impossible</div>
                <code className="text-xs text-red-600 break-all">{metiersResult.error}</code>
                <p className="mt-3 text-xs text-red-700">
                  → Probable cause : les <strong>RLS policies</strong> ne sont pas posées sur la table
                  <code className="px-1 mx-0.5 rounded bg-white border font-mono">metiers</code>.
                  Exécute <code className="px-1 mx-0.5 rounded bg-white border font-mono">supabase/rls_public_read.sql</code> dans Supabase SQL Editor.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Aide */}
        <div className="mt-10 rounded-2xl bg-ink-50 border border-ink-100 p-5">
          <h2 className="font-bold text-ink-700 flex items-center gap-2 mb-3">
            <Key size={16} />
            Où trouver mes clés
          </h2>
          <ol className="text-sm text-ink-600 space-y-1.5 list-decimal list-inside">
            <li>
              Va sur{" "}
              <a
                href="https://supabase.com/dashboard/projects"
                target="_blank"
                rel="noopener"
                className="text-brand-600 font-semibold hover:underline"
              >
                supabase.com/dashboard
              </a>
            </li>
            <li>Sélectionne ton projet → ⚙️ Project Settings → API</li>
            <li>Copie <strong>Project URL</strong>, <strong>anon public</strong> et <strong>service_role</strong></li>
            <li>
              Colle-les dans <code className="px-1 rounded bg-white border font-mono text-xs">.env.local</code> à la racine
              de <code className="px-1 rounded bg-white border font-mono text-xs">bisecco-v2/</code>
            </li>
            <li>Redémarre le serveur (Ctrl+C puis <code className="px-1 rounded bg-white border font-mono text-xs">npm run dev</code>)</li>
          </ol>

          <h2 className="font-bold text-ink-700 flex items-center gap-2 mt-6 mb-3">
            <ShieldCheck size={16} />
            Sécurité
          </h2>
          <ul className="text-sm text-ink-600 space-y-1.5 list-disc list-inside">
            <li><code className="px-1 rounded bg-white border font-mono text-xs">NEXT_PUBLIC_*</code> = exposé au navigateur, OK</li>
            <li><code className="px-1 rounded bg-white border font-mono text-xs">SUPABASE_SERVICE_ROLE_KEY</code> = côté serveur uniquement, ne JAMAIS exposer</li>
            <li><code className="px-1 rounded bg-white border font-mono text-xs">.env.local</code> est dans <code className="px-1 rounded bg-white border font-mono text-xs">.gitignore</code> — ne sera jamais commité</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
