import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Briefcase, Users, Eye, Edit3, Pause, Plus, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Mes offres d'emploi · Espace recruteur",
  description: "Gérez vos offres d'emploi publiées sur Bisecco et suivez les candidatures reçues.",
};

type OfferStatus = "active" | "pause" | "expiree";

const OFFRES: { id: string; titre: string; ville: string; contrat: string; postedAt: string; status: OfferStatus; vues: number; candidatures: number; expire: string }[] = [
  { id: "j1", titre: "Apprenti·e boulanger·ère", ville: "Meaux",   contrat: "Apprentissage", postedAt: "Il y a 2 jours",  status: "active",  vues: 142, candidatures: 7,  expire: "Dans 28 jours" },
  { id: "j3", titre: "Compagnon maçon",          ville: "Meaux",   contrat: "CDI",           postedAt: "Il y a 1 sem.",  status: "active",  vues: 87,  candidatures: 5,  expire: "Dans 21 jours" },
  { id: "j9", titre: "Aide-cuisinier·ère",       ville: "Chelles", contrat: "CDD",           postedAt: "Il y a 1 mois",  status: "expiree", vues: 213, candidatures: 14, expire: "Expirée" },
];

const STATUS_CFG: Record<OfferStatus, { label: string; cls: string }> = {
  active:  { label: "Active",  cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  pause:   { label: "En pause", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  expiree: { label: "Expirée",  cls: "bg-ink-100 text-ink-500 border-ink-200" },
};

export default function MesOffresPage() {
  return (
    <div className="bg-ink-50 min-h-screen pb-16">
      <div className="container-default py-10">
        <Link href="/mon-profil" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Mon profil
        </Link>

        <div className="mt-5 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-ink-700 tracking-tight">
              Mes <span className="text-brand-500">offres d&apos;emploi</span>
            </h1>
            <p className="text-ink-400 mt-2">Gérez vos publications et suivez les candidatures.</p>
          </div>
          <Link href="/emploi/poster" className="btn-primary">
            <Plus size={15} /> Nouvelle offre
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-7 mb-8">
          {[
            { label: "Offres actives",    value: OFFRES.filter((o) => o.status === "active").length },
            { label: "Vues totales",      value: OFFRES.reduce((a, o) => a + o.vues, 0) },
            { label: "Candidatures",      value: OFFRES.reduce((a, o) => a + o.candidatures, 0) },
            { label: "Taux conversion",   value: "13%" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 border border-ink-100">
              <div className="text-3xl font-bold text-ink-700">{s.value}</div>
              <div className="text-xs text-ink-400 mt-1 font-semibold">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Liste */}
        <div className="space-y-3">
          {OFFRES.map((o) => {
            const cfg = STATUS_CFG[o.status];
            return (
              <div key={o.id} className="bg-white rounded-2xl border border-ink-100 p-5">
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                    <Briefcase size={20} className="text-brand-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-ink-700 leading-tight">{o.titre}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[0.65rem] font-bold uppercase tracking-wider ${cfg.cls}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <div className="text-sm text-ink-500 flex items-center gap-3 flex-wrap">
                      <span className="inline-flex items-center gap-1"><MapPin size={11} /> {o.ville}</span>
                      <span>·</span>
                      <span>{o.contrat}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1"><Clock size={11} /> {o.postedAt}</span>
                    </div>

                    <div className="flex gap-4 mt-3 text-xs text-ink-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Eye size={12} className="text-ink-400" /> <strong className="text-ink-700">{o.vues}</strong> vues
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Users size={12} className="text-brand-500" /> <strong className="text-ink-700">{o.candidatures}</strong> candidature{o.candidatures > 1 ? "s" : ""}
                      </span>
                      <span className="text-ink-400">· {o.expire}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 w-full sm:w-auto">
                    <Link
                      href={`/mon-profil/offres/${o.id}/candidatures`}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 text-white text-sm font-bold hover:bg-brand-600 transition"
                    >
                      <Users size={13} /> Voir candidatures ({o.candidatures})
                    </Link>
                    <div className="flex gap-2">
                      <Link href={`/emploi/${o.id}`} className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-ink-200 text-ink-700 text-xs font-bold hover:border-brand-500 transition">
                        <Eye size={11} /> Voir
                      </Link>
                      <button className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-ink-200 text-ink-700 text-xs font-bold hover:border-brand-500 transition">
                        <Edit3 size={11} /> Modifier
                      </button>
                      {o.status === "active" && (
                        <button className="px-3 py-1.5 rounded-lg bg-white border border-ink-200 text-ink-500 text-xs font-bold hover:border-amber-500 hover:text-amber-600 transition">
                          <Pause size={11} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
