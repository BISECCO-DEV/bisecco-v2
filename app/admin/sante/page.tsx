import type { Metadata } from "next";
import { Activity, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { runHealthChecks, type CheckStatus } from "@/lib/admin/health";
import { HealthRefreshButton } from "@/components/admin/HealthRefreshButton";

export const metadata: Metadata = { title: "Santé du système" };
export const dynamic = "force-dynamic";

const STATUS_UI: Record<CheckStatus, { icon: typeof CheckCircle2; color: string; bg: string; label: string }> = {
  ok:    { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", label: "OK" },
  warn:  { icon: AlertTriangle, color: "text-amber-600",  bg: "bg-amber-50 border-amber-200",   label: "À surveiller" },
  error: { icon: XCircle,      color: "text-red-600",     bg: "bg-red-50 border-red-200",       label: "Problème" },
};

export default async function SantePage() {
  const report = await runHealthChecks();
  const categories = [...new Set(report.checks.map((c) => c.category))];

  const overall = STATUS_UI[report.overall];
  const ranAt = new Date(report.ranAt).toLocaleString("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <div className="max-w-4xl">
      {/* En-tête */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-ink-700 tracking-tight flex items-center gap-2">
            <Activity size={24} className="text-brand-500" /> Santé du système
          </h1>
          <p className="text-ink-400 mt-1">
            Vérification automatique toutes les 30 min · dernière exécution : <strong>{ranAt}</strong>
          </p>
        </div>
        <HealthRefreshButton />
      </div>

      {/* Bandeau global */}
      <div className={`rounded-2xl border p-5 mb-6 flex items-center gap-4 ${overall.bg}`}>
        <overall.icon size={28} className={overall.color} />
        <div className="flex-1">
          <div className={`font-bold text-lg ${overall.color}`}>
            {report.overall === "ok" && "Tout fonctionne ✅"}
            {report.overall === "warn" && "Quelques points à surveiller"}
            {report.overall === "error" && "Un ou plusieurs problèmes détectés"}
          </div>
          <div className="text-sm text-ink-500 mt-0.5">
            {report.summary.ok} OK · {report.summary.warn} à surveiller · {report.summary.error} problème(s)
            {" "}sur {report.summary.total} vérifications
          </div>
        </div>
      </div>

      {/* Checklist par catégorie */}
      <div className="space-y-6">
        {categories.map((cat) => (
          <section key={cat}>
            <h2 className="text-[0.7rem] font-extrabold tracking-[0.14em] uppercase text-ink-400 mb-2 px-1">
              {cat}
            </h2>
            <div className="bg-white rounded-2xl border border-ink-100 divide-y divide-ink-100 overflow-hidden">
              {report.checks
                .filter((c) => c.category === cat)
                .map((c) => {
                  const ui = STATUS_UI[c.status];
                  return (
                    <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                      <ui.icon size={18} className={`${ui.color} flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-ink-700 text-sm">{c.label}</div>
                        <div className="text-xs text-ink-500 mt-0.5">{c.detail}</div>
                      </div>
                      <span
                        className={`text-[0.65rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${ui.bg} ${ui.color} flex-shrink-0`}
                      >
                        {ui.label}
                      </span>
                    </div>
                  );
                })}
            </div>
          </section>
        ))}
      </div>

      <p className="text-xs text-ink-400 mt-6">
        💡 Une alerte email est envoyée automatiquement si un check passe au rouge.
      </p>
    </div>
  );
}
