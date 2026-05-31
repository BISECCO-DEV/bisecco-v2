import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft, FileText, Clock, CheckCircle2, X, MessageCircle,
  MapPin, Filter, ExternalLink,
} from "lucide-react";
import { requireUser } from "@/lib/db/current-user";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Mes devis",
  robots: { index: false, follow: false },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: typeof Clock }> = {
  new:       { label: "En attente",  color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200",   icon: Clock },
  responded: { label: "Devis reçu",  color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200",    icon: FileText },
  closed:    { label: "Terminé",     color: "text-ink-600",     bg: "bg-ink-50",     border: "border-ink-200",     icon: CheckCircle2 },
  cancelled: { label: "Annulé",      color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200",     icon: X },
};

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Il y a ${days} j`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `Il y a ${weeks} sem.`;
  const months = Math.floor(days / 30);
  if (months < 12) return `Il y a ${months} mois`;
  return `Il y a ${Math.floor(months / 12)} an${months >= 24 ? "s" : ""}`;
}

type QuoteRow = {
  id: number;
  title: string;
  city: string | null;
  status: string;
  created_at: string;
  artisan_id: number | null;
  metier_id: number | null;
  artisan: { id: number; name: string | null; client_number: string | null; artisan_profiles: { company_name: string | null }[] | null } | null;
  metier: { name: string | null } | null;
};

export default async function MesDevisPage() {
  const user = await requireUser();
  const isArtisan = user.role === "artisan";

  const admin = createSupabaseAdminClient();
  const filterCol = isArtisan ? "artisan_id" : "client_id";

  const { data, error } = await admin
    .from("quote_requests")
    .select(`
      id, title, city, status, created_at, artisan_id, metier_id,
      artisan:artisan_id ( id, name, client_number, artisan_profiles ( company_name ) ),
      metier:metier_id ( name )
    `)
    .eq(filterCol, user.id ?? 0)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) console.error("[mes-devis]", error);

  const rows = (data ?? []) as unknown as QuoteRow[];

  const counts = {
    waiting: rows.filter((r) => r.status === "new").length,
    received: rows.filter((r) => r.status === "responded").length,
    closed:   rows.filter((r) => r.status === "closed").length,
    total:    rows.length,
  };

  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="container-default py-10">
        <Link href="/mon-profil" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Retour à mon espace
        </Link>

        <div className="flex items-center justify-between gap-4 mt-4 mb-2 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-ink-700 tracking-tight">
              {isArtisan ? "Demandes de devis reçues" : "Mes demandes de devis"}
            </h1>
            <p className="text-ink-400 mt-1">
              {isArtisan
                ? "Les demandes envoyées par les particuliers à votre entreprise."
                : "Suivez l'état de vos demandes et comparez les propositions reçues."}
            </p>
          </div>
          {!isArtisan && (
            <Link href="/rechercher" className="btn-primary">
              <FileText size={16} /> Nouvelle demande
            </Link>
          )}
        </div>

        {/* Stats cards · données réelles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
          {[
            { label: "En attente",   value: counts.waiting,  color: "from-amber-400 to-amber-600",   icon: Clock },
            { label: "Reçus",        value: counts.received, color: "from-blue-400 to-blue-600",     icon: FileText },
            { label: "Terminés",     value: counts.closed,   color: "from-emerald-400 to-emerald-600", icon: CheckCircle2 },
            { label: "Total",        value: counts.total,    color: "from-brand-400 to-brand-600",   icon: FileText },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-ink-100">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                <s.icon size={18} className="text-white" />
              </div>
              <div className="text-2xl font-bold text-ink-700">{s.value}</div>
              <div className="text-xs text-ink-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {rows.length === 0 ? (
          <div className="mt-8 bg-white rounded-3xl border border-ink-100 p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
              <FileText size={26} className="text-brand-500" />
            </div>
            <h2 className="text-lg font-bold text-ink-700">
              {isArtisan ? "Aucune demande pour l'instant" : "Vous n'avez pas encore demandé de devis"}
            </h2>
            <p className="text-sm text-ink-500 mt-2 max-w-md mx-auto leading-relaxed">
              {isArtisan
                ? "Les demandes de devis envoyées par les particuliers apparaîtront ici."
                : "Trouvez un artisan vérifié près de chez vous et envoyez-lui une demande directement depuis son profil."}
            </p>
            {!isArtisan && (
              <Link href="/rechercher" className="btn-primary mt-6 inline-flex">
                <FileText size={16} /> Trouver un artisan
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Filtre header */}
            <div className="mt-8 flex items-center justify-end gap-3 flex-wrap bg-white rounded-2xl border border-ink-100 p-4">
              <div className="flex items-center gap-2 text-xs text-ink-400">
                <Filter size={13} className="text-brand-500" />
                <span><strong className="text-ink-700">{rows.length}</strong> demande{rows.length > 1 ? "s" : ""}</span>
              </div>
            </div>

            {/* Liste devis · vraies données Supabase */}
            <div className="mt-5 space-y-3">
              {rows.map((d) => {
                const status = STATUS_CONFIG[d.status] ?? STATUS_CONFIG.new;
                const company = d.artisan?.artisan_profiles?.[0]?.company_name?.trim();
                const artisanLabel = company || d.artisan?.name || null;
                const metierName = d.metier?.name ?? null;
                const profileHref = d.artisan?.client_number ? `/profil/${d.artisan.client_number}` : null;
                return (
                  <article key={d.id} className="bg-white rounded-2xl border border-ink-100 hover:border-brand-200 hover:-translate-y-0.5 transition p-5">
                    <div className="flex items-start gap-4 flex-wrap">
                      <div className="flex-1 min-w-[200px]">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider ${status.bg} ${status.color} border ${status.border}`}>
                            <status.icon size={10} /> {status.label}
                          </span>
                          <span className="text-[0.7rem] text-ink-400 font-medium">{timeAgo(d.created_at)}</span>
                          <span className="text-[0.7rem] text-ink-300 font-mono">D-{String(d.id).padStart(6, "0")}</span>
                        </div>
                        <h3 className="font-bold text-ink-700 text-lg leading-tight">{d.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-ink-500 mt-1.5 flex-wrap">
                          {d.city && (
                            <>
                              <span className="inline-flex items-center gap-1"><MapPin size={11} /> {d.city}</span>
                              <span>·</span>
                            </>
                          )}
                          {metierName && <span className="font-semibold text-brand-500">{metierName}</span>}
                          {artisanLabel && (
                            <>
                              <span>·</span>
                              <span>
                                {isArtisan ? "Client" : "Artisan"} : <strong className="text-ink-700">{artisanLabel}</strong>
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 w-full md:w-auto">
                        {profileHref && !isArtisan && (
                          <Link href={profileHref} className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 text-white text-sm font-bold hover:bg-brand-600 transition">
                            Voir l&apos;artisan <ExternalLink size={13} />
                          </Link>
                        )}
                        <Link href="/messagerie" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-ink-200 text-ink-700 text-sm font-bold hover:border-brand-500 transition">
                          <MessageCircle size={13} /> Message
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
