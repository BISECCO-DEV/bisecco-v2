import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Briefcase, ShieldCheck, MoreVertical, Star, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin · Professionnels",
  robots: { index: false, follow: false },
};

const ARTISANS = [
  { id: 1, name: "Jean Dupont",   company: "Dupont Maçonnerie", siren: "823 456 789", metier: "Maçon",     rating: 4.8, reviews: 23, plan: "Pro",     joined: "Il y a 3 mois", validated: true,  active: true },
  { id: 2, name: "Hugo Martin",   company: "Martin Carrelage",  siren: "765 432 109", metier: "Carreleur", rating: 4.9, reviews: 41, plan: "Premium", joined: "Il y a 6 mois", validated: true,  active: true },
  { id: 3, name: "Marc Lefevre",  company: "Lefevre Menuiserie",siren: "917 234 567", metier: "Menuisier", rating: 4.7, reviews: 18, plan: "Gratuit", joined: "Il y a 1 an",   validated: true,  active: true },
  { id: 4, name: "Karim Benali",  company: "KB Renovation",     siren: "832 156 789", metier: "Maçon",     rating: 0,   reviews: 0,  plan: "Gratuit", joined: "Il y a 1 mois", validated: false, active: true },
  { id: 5, name: "Pierre Moreau", company: "Moreau Bâtiment",   siren: "654 321 987", metier: "Plombier",  rating: 4.6, reviews: 12, plan: "Pro",     joined: "Il y a 2 mois", validated: true,  active: true },
];

export default function AdminArtisansPage() {
  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="container-default py-10">
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Dashboard admin
        </Link>

        <div className="flex items-center justify-between gap-4 mt-4 mb-8 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-ink-700 tracking-tight flex items-center gap-2">
              <Briefcase size={24} className="text-brand-500" />
              Professionnels
            </h1>
            <p className="text-ink-400 mt-1">Validation SIREN, abonnements, statistiques.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total validés",  value: 247, color: "from-emerald-400 to-emerald-600" },
            { label: "En attente",     value: 3,   color: "from-amber-400 to-amber-600" },
            { label: "Plan Pro",       value: 42,  color: "from-brand-400 to-brand-600" },
            { label: "Plan Premium",   value: 18,  color: "from-purple-400 to-purple-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-ink-100">
              <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${s.color} mb-3`} />
              <div className="text-2xl font-bold text-ink-700">{s.value}</div>
              <div className="text-xs text-ink-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl border border-ink-100 p-3 mb-4 flex items-center gap-2 flex-wrap">
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-ink-50">
            <Search size={14} className="text-ink-300" />
            <input type="text" placeholder="Rechercher (nom, SIREN, métier)…" className="flex-1 bg-transparent outline-none text-sm" />
          </div>
          <select className="px-3 py-2 rounded-xl bg-ink-50 border border-ink-100 text-sm font-semibold outline-none">
            <option>Tous statuts</option>
            <option>Validés</option>
            <option>En attente</option>
          </select>
        </div>

        <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink-50/60 text-[0.7rem] uppercase tracking-wider text-ink-400 border-b border-ink-100">
              <tr>
                <th className="text-left py-3 px-5 font-bold">Professionnel</th>
                <th className="text-left py-3 px-5 font-bold hidden md:table-cell">SIREN</th>
                <th className="text-left py-3 px-5 font-bold hidden lg:table-cell">Note</th>
                <th className="text-left py-3 px-5 font-bold">Plan</th>
                <th className="text-left py-3 px-5 font-bold">Statut</th>
                <th className="w-12" />
              </tr>
            </thead>
            <tbody>
              {ARTISANS.map((a) => (
                <tr key={a.id} className="border-b border-ink-100 last:border-0 hover:bg-ink-50/40">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white font-bold flex items-center justify-center text-sm">
                        {a.name[0]}
                      </div>
                      <div>
                        <strong className="text-ink-700 block">{a.name}</strong>
                        <div className="text-[0.72rem] text-ink-400">{a.company} · {a.metier}</div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-5 font-mono text-ink-600 text-[0.78rem]">{a.siren}</td>
                  <td className="hidden lg:table-cell px-5">
                    {a.reviews > 0 ? (
                      <span className="inline-flex items-center gap-1 text-ink-700 font-semibold">
                        <Star size={11} fill="#f07a2f" className="text-brand-500" /> {a.rating} ({a.reviews})
                      </span>
                    ) : <span className="text-ink-400">·</span>}
                  </td>
                  <td className="px-5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider ${
                      a.plan === "Premium" ? "bg-purple-50 text-purple-700 border border-purple-200"
                      : a.plan === "Pro" ? "bg-brand-50 text-brand-700 border border-brand-200"
                      : "bg-ink-50 text-ink-500 border border-ink-200"
                    }`}>{a.plan}</span>
                  </td>
                  <td className="px-5">
                    {a.validated ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 text-[0.72rem] font-bold">
                        <ShieldCheck size={11} /> Validé
                      </span>
                    ) : (
                      <div className="flex gap-1">
                        <button className="text-[0.7rem] font-bold text-emerald-600 hover:underline">Valider</button>
                        <button className="text-[0.7rem] font-bold text-red-600 hover:underline">Rejeter</button>
                      </div>
                    )}
                  </td>
                  <td className="text-right pr-3">
                    <button className="p-2 hover:bg-ink-100 rounded-lg text-ink-500"><MoreVertical size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
