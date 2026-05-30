import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText, Clock, CheckCircle2, X, MessageCircle, MapPin, Filter, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Mes devis",
  robots: { index: false, follow: false },
};

const DEMO_DEVIS = [
  { id: "D-2026-128", title: "Rénovation salle de bain",      artisan: "Jean Dupont",    metier: "Maçon",     city: "Meaux",   amount: 4200, status: "received", date: "Il y a 2 jours",   responses: 3 },
  { id: "D-2026-127", title: "Pose carrelage cuisine 15m²",   artisan: "Hugo Martin",    metier: "Carreleur", city: "Chelles", amount: 1850, status: "quoted",   date: "Il y a 5 jours",   responses: 5 },
  { id: "D-2026-119", title: "Installation chaudière",        artisan: "Marc Lefevre",   metier: "Chauffagiste", city: "Melun", amount: 3400, status: "accepted", date: "Il y a 1 sem.",    responses: 4 },
  { id: "D-2026-103", title: "Peinture salon 25m²",           artisan: "·",              metier: "Peintre",   city: "Meaux",   amount: 0,    status: "open",     date: "Il y a 2 sem.",    responses: 2 },
  { id: "D-2026-098", title: "Pose parquet stratifié 40m²",   artisan: "Pierre Moreau",  metier: "Menuisier", city: "Lagny",   amount: 1200, status: "declined", date: "Il y a 1 mois",    responses: 1 },
  { id: "D-2026-072", title: "Réfection toiture 80m²",        artisan: "Sophie Lambert", metier: "Couvreur",  city: "Nantes",  amount: 8500, status: "completed", date: "Il y a 2 mois",    responses: 7 },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: typeof Clock }> = {
  open:      { label: "En attente",  color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200",   icon: Clock },
  quoted:    { label: "Devis reçus", color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200",    icon: FileText },
  received:  { label: "À comparer",  color: "text-purple-700",  bg: "bg-purple-50",  border: "border-purple-200",  icon: FileText },
  accepted:  { label: "Accepté",     color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: CheckCircle2 },
  completed: { label: "Terminé",     color: "text-ink-600",     bg: "bg-ink-50",     border: "border-ink-200",     icon: CheckCircle2 },
  declined:  { label: "Refusé",      color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200",     icon: X },
};

export default function MesDevisPage() {
  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="container-default py-10">
        <Link href="/mon-profil" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Retour à mon espace
        </Link>

        <div className="flex items-center justify-between gap-4 mt-4 mb-2 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-ink-700 tracking-tight">Mes devis</h1>
            <p className="text-ink-400 mt-1">Suivez l&apos;état de vos demandes et comparez les propositions reçues.</p>
          </div>
          <Link href="/devis" className="btn-primary">
            <FileText size={16} /> Nouvelle demande
          </Link>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
          {[
            { label: "En attente", value: 2, color: "from-amber-400 to-amber-600",   icon: Clock },
            { label: "Reçus",      value: 5, color: "from-blue-400 to-blue-600",     icon: FileText },
            { label: "Acceptés",   value: 1, color: "from-emerald-400 to-emerald-600", icon: CheckCircle2 },
            { label: "Total",      value: 8, color: "from-brand-400 to-brand-600",   icon: FileText },
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

        {/* Filtres */}
        <div className="mt-8 flex items-center justify-between gap-3 flex-wrap bg-white rounded-2xl border border-ink-100 p-4">
          <div className="inline-flex gap-1 bg-ink-50 p-1 rounded-xl">
            {["Tous", "En attente", "Reçus", "Acceptés", "Terminés"].map((f, i) => (
              <button key={f} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${i === 0 ? "bg-white text-ink-700 shadow-card" : "text-ink-400 hover:text-ink-700"}`}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-ink-400">
            <Filter size={13} className="text-brand-500" />
            <span><strong className="text-ink-700">{DEMO_DEVIS.length}</strong> demandes</span>
          </div>
        </div>

        {/* Liste devis */}
        <div className="mt-5 space-y-3">
          {DEMO_DEVIS.map((d) => {
            const status = STATUS_CONFIG[d.status];
            return (
              <article key={d.id} className="bg-white rounded-2xl border border-ink-100 hover:border-brand-200 hover:-translate-y-0.5 transition p-5">
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider ${status.bg} ${status.color} border ${status.border}`}>
                        <status.icon size={10} /> {status.label}
                      </span>
                      <span className="text-[0.7rem] text-ink-400 font-medium">{d.date}</span>
                      <span className="text-[0.7rem] text-ink-300 font-mono">{d.id}</span>
                    </div>
                    <h3 className="font-bold text-ink-700 text-lg leading-tight">{d.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-ink-500 mt-1.5">
                      <span className="inline-flex items-center gap-1"><MapPin size={11} /> {d.city}</span>
                      <span>·</span>
                      <span className="font-semibold text-brand-500">{d.metier}</span>
                      {d.artisan !== "·" && <>
                        <span>·</span>
                        <span>Artisan : <strong className="text-ink-700">{d.artisan}</strong></span>
                      </>}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[0.65rem] font-bold text-ink-400 uppercase tracking-wider">Devis reçus</div>
                    <div className="text-2xl font-bold text-ink-700 tracking-tight">{d.responses}</div>
                  </div>

                  {d.amount > 0 && (
                    <div className="text-right md:border-l md:border-ink-100 md:pl-4">
                      <div className="text-[0.65rem] font-bold text-ink-400 uppercase tracking-wider">Montant</div>
                      <div className="text-xl font-bold text-brand-500 tracking-tight">{d.amount.toLocaleString("fr-FR")} €</div>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 w-full md:w-auto">
                    <Link href={`/mon-profil/devis/${d.id}`} className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 text-white text-sm font-bold hover:bg-brand-600 transition">
                      Voir <ExternalLink size={13} />
                    </Link>
                    {d.artisan !== "·" && (
                      <Link href={`/messagerie/1`} className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-ink-200 text-ink-700 text-sm font-bold hover:border-brand-500 transition">
                        <MessageCircle size={13} /> Message
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
