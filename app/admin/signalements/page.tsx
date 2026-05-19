import Link from "next/link";
import { Flag, AlertTriangle, CheckCircle2, XCircle, Clock } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { handleReportAction } from "@/lib/reports/actions";
import { REASON_LABELS } from "@/lib/reports/constants";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ status?: string }>;

type ReportRow = {
  id: number;
  reason: keyof typeof REASON_LABELS;
  detail: string | null;
  status: "new" | "reviewed" | "resolved" | "dismissed";
  admin_note: string | null;
  handled_at: string | null;
  ip_address: string | null;
  reporter_email: string | null;
  created_at: string;
  reporter: { id: number; name: string; email: string } | null;
  reported_user: { id: number; name: string; email: string; role: string } | null;
  handler: { id: number; name: string } | null;
};

const STATUS_CONFIG = {
  new:       { label: "Nouveau",   color: "bg-amber-50 text-amber-700 border-amber-200",   Icon: Clock },
  reviewed:  { label: "Examiné",   color: "bg-blue-50 text-blue-700 border-blue-200",      Icon: AlertTriangle },
  resolved:  { label: "Résolu",    color: "bg-emerald-50 text-emerald-700 border-emerald-200", Icon: CheckCircle2 },
  dismissed: { label: "Rejeté",    color: "bg-ink-100 text-ink-600 border-ink-200",        Icon: XCircle },
};

async function loadReports(status: string): Promise<{ rows: ReportRow[]; counts: Record<string, number> }> {
  const admin = createSupabaseAdminClient();

  // Counts par status (header + filtres)
  const { data: countsData } = await admin
    .from("profile_reports")
    .select("status");
  const counts: Record<string, number> = {};
  (countsData ?? []).forEach((r: { status: string }) => {
    counts[r.status] = (counts[r.status] ?? 0) + 1;
  });

  let q = admin
    .from("profile_reports")
    .select(`
      id, reason, detail, status, admin_note, handled_at, ip_address, reporter_email, created_at,
      reporter:reporter_id ( id, name, email ),
      reported_user:reported_user_id ( id, name, email, role ),
      handler:handled_by ( id, name )
    `)
    .order("created_at", { ascending: false })
    .limit(100);

  if (status !== "all") {
    q = q.eq("status", status);
  }

  const { data } = await q;
  return { rows: (data ?? []) as unknown as ReportRow[], counts };
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diffSec < 60) return "À l'instant";
  if (diffSec < 3600) return `Il y a ${Math.floor(diffSec / 60)} min`;
  if (diffSec < 86400) return `Il y a ${Math.floor(diffSec / 3600)} h`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminReportsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const status = params.status ?? "new";
  const { rows, counts } = await loadReports(status);

  async function handle(formData: FormData) {
    "use server";
    const id = parseInt(formData.get("report_id")?.toString() ?? "0", 10);
    const newStatus = formData.get("status")?.toString() as "reviewed" | "resolved" | "dismissed";
    const note = formData.get("note")?.toString().trim() || undefined;
    if (id > 0 && newStatus) {
      await handleReportAction(id, newStatus, note);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-700 tracking-tight flex items-center gap-2">
          <Flag size={26} className="text-red-500" /> Signalements
          <span className="ml-2 text-base font-bold text-ink-400">({Object.values(counts).reduce((a, b) => a + b, 0)})</span>
        </h1>
        <p className="text-ink-500 text-sm mt-1">
          Modérer les profils signalés par les visiteurs.
        </p>
      </header>

      {/* Onglets status */}
      <div className="flex flex-wrap gap-2">
        {(["new", "reviewed", "resolved", "dismissed", "all"] as const).map((s) => {
          const cfg = s === "all" ? { label: "Tous", color: "bg-ink-100 text-ink-700" } : STATUS_CONFIG[s];
          const count = s === "all" ? Object.values(counts).reduce((a, b) => a + b, 0) : (counts[s] ?? 0);
          const active = status === s;
          return (
            <Link
              key={s}
              href={`?status=${s}`}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold border transition ${
                active ? `${cfg.color} border-2` : "bg-white border-ink-200 text-ink-500 hover:border-ink-300"
              }`}
            >
              {cfg.label} <span className="opacity-65">({count})</span>
            </Link>
          );
        })}
      </div>

      {/* Liste */}
      {rows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-ink-100 p-10 text-center">
          <Flag size={32} className="mx-auto text-ink-200 mb-2" />
          <p className="text-ink-500 text-sm">Aucun signalement dans cette catégorie.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => {
            const cfg = STATUS_CONFIG[r.status];
            return (
              <article key={r.id} className="bg-white rounded-2xl border border-ink-100 p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.7rem] font-bold uppercase tracking-wider border ${cfg.color}`}>
                        <cfg.Icon size={11} /> {cfg.label}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-[0.7rem] font-bold">
                        {REASON_LABELS[r.reason] ?? r.reason}
                      </span>
                    </div>
                    <h3 className="font-bold text-ink-700">
                      Profil signalé :{" "}
                      {r.reported_user ? (
                        <Link href={`/profil/${r.reported_user.id}`} target="_blank" className="text-brand-500 hover:underline">
                          {r.reported_user.name}
                        </Link>
                      ) : (
                        <span className="text-ink-400">Utilisateur supprimé</span>
                      )}
                      {r.reported_user?.role && (
                        <span className="ml-2 text-xs font-medium text-ink-400">({r.reported_user.role})</span>
                      )}
                    </h3>
                    <p className="text-xs text-ink-400 mt-1">
                      Par <strong className="text-ink-600">{r.reporter?.name ?? r.reporter_email ?? "Anonyme"}</strong>
                      {" · "}
                      {formatDate(r.created_at)}
                      {r.ip_address && (
                        <span className="ml-2 font-mono text-[0.7rem] text-ink-300">IP {r.ip_address}</span>
                      )}
                    </p>
                  </div>
                </div>

                {r.detail && (
                  <p className="text-sm text-ink-600 bg-ink-50/60 px-4 py-3 rounded-xl border border-ink-100 leading-relaxed whitespace-pre-line mb-3">
                    {r.detail}
                  </p>
                )}

                {r.admin_note && (
                  <div className="bg-amber-50 border-l border-amber-300 px-3 py-2 rounded-r text-xs text-amber-800 mb-3">
                    <strong>Note admin :</strong> {r.admin_note}
                    {r.handler && (
                      <span className="ml-2 text-amber-600">— {r.handler.name}{r.handled_at && `, ${formatDate(r.handled_at)}`}</span>
                    )}
                  </div>
                )}

                {/* Actions modération */}
                <form action={handle} className="flex items-center gap-2 flex-wrap">
                  <input type="hidden" name="report_id" value={r.id} />
                  <input
                    type="text"
                    name="note"
                    placeholder="Note interne (optionnel)"
                    maxLength={2000}
                    className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg bg-ink-50 border border-ink-200 focus:border-brand-400 focus:bg-white outline-none text-xs"
                  />
                  <button
                    type="submit"
                    name="status"
                    value="reviewed"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-xs font-bold transition"
                  >
                    Examiné
                  </button>
                  <button
                    type="submit"
                    name="status"
                    value="resolved"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold transition"
                  >
                    <CheckCircle2 size={12} /> Résolu (action prise)
                  </button>
                  <button
                    type="submit"
                    name="status"
                    value="dismissed"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-ink-600 border border-ink-200 hover:border-ink-300 text-xs font-bold transition"
                  >
                    <XCircle size={12} /> Rejeter
                  </button>
                </form>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
