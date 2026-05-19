import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Briefcase, Clock, CheckCircle2, XCircle, Eye, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Mes candidatures · Mon profil",
  description: "Suivez l'état de vos candidatures aux offres d'emploi de l'artisanat.",
};

type Status = "envoyee" | "vue" | "entretien" | "acceptee" | "refusee";

const STATUS_CONFIG: Record<Status, { label: string; cls: string; icon: typeof Eye }> = {
  envoyee:  { label: "Envoyée",      cls: "bg-blue-50 text-blue-700 border-blue-200",       icon: Clock },
  vue:      { label: "Vue par le recruteur", cls: "bg-amber-50 text-amber-700 border-amber-200", icon: Eye },
  entretien:{ label: "Entretien proposé",    cls: "bg-purple-50 text-purple-700 border-purple-200", icon: MessageSquare },
  acceptee: { label: "Acceptée",     cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  refusee:  { label: "Refusée",      cls: "bg-red-50 text-red-700 border-red-200",           icon: XCircle },
};

const CANDIDATURES: { id: string; jobId: string; titre: string; entreprise: string; ville: string; contrat: string; date: string; status: Status }[] = [
  { id: "c1", jobId: "j1", titre: "Apprenti·e boulanger·ère",         entreprise: "Boulangerie du Marché", ville: "Meaux",        contrat: "Apprentissage", date: "Il y a 1h",     status: "envoyee"  },
  { id: "c2", jobId: "j2", titre: "Plombier·ère chauffagiste",        entreprise: "Dupont Plomberie",       ville: "Chelles",      contrat: "CDI",           date: "Il y a 2 jours", status: "vue"      },
  { id: "c3", jobId: "j5", titre: "Apprenti·e électricien·ne",        entreprise: "Martin Élec",            ville: "Melun",        contrat: "Alternance",    date: "Il y a 5 jours", status: "entretien"},
  { id: "c4", jobId: "j6", titre: "Menuisier·ère agencement",         entreprise: "Atelier du Bois",        ville: "Bussy-St-Georges", contrat: "CDI",        date: "Il y a 2 sem.",  status: "acceptee" },
  { id: "c5", jobId: "j3", titre: "Compagnon maçon",                  entreprise: "Dupont Maçonnerie",      ville: "Meaux",        contrat: "CDI",           date: "Il y a 3 sem.",  status: "refusee"  },
];

export default function CandidaturesPage() {
  const stats = {
    total: CANDIDATURES.length,
    enCours: CANDIDATURES.filter((c) => ["envoyee", "vue", "entretien"].includes(c.status)).length,
    acceptees: CANDIDATURES.filter((c) => c.status === "acceptee").length,
  };

  return (
    <div className="bg-ink-50 min-h-screen pb-16">
      <div className="container-default py-10">
        <Link href="/mon-profil" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Mon profil
        </Link>

        <div className="mt-5">
          <h1 className="text-3xl font-bold text-ink-700 tracking-tight">
            Mes <span className="text-brand-500">candidatures</span>
          </h1>
          <p className="text-ink-400 mt-2">Suivez en temps réel l&apos;état de vos candidatures.</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-7 mb-8">
          {[
            { label: "Total envoyées", value: stats.total },
            { label: "En cours",        value: stats.enCours },
            { label: "Acceptées",       value: stats.acceptees },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 border border-ink-100">
              <div className="text-3xl font-bold text-ink-700">{s.value}</div>
              <div className="text-xs text-ink-400 mt-1 font-semibold">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {CANDIDATURES.map((c) => {
            const cfg = STATUS_CONFIG[c.status];
            const Icon = cfg.icon;
            return (
              <Link
                key={c.id}
                href={`/emploi/${c.jobId}`}
                className="block bg-white rounded-2xl border border-ink-100 hover:border-brand-300 hover:-translate-y-0.5 transition p-5"
              >
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                    <Briefcase size={20} className="text-brand-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-ink-700 leading-tight">{c.titre}</h3>
                    <div className="text-sm text-ink-500 mt-1">
                      {c.entreprise} · {c.ville} · <span className="text-brand-500 font-semibold">{c.contrat}</span>
                    </div>
                    <div className="text-xs text-ink-400 mt-1.5 flex items-center gap-1">
                      <Clock size={11} /> Candidature {c.date}
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${cfg.cls}`}>
                    <Icon size={12} /> {cfg.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link href="/emploi" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition">
            <Briefcase size={15} /> Voir d&apos;autres offres
          </Link>
        </div>
      </div>
    </div>
  );
}
