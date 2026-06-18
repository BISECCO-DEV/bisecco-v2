import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText, MoreVertical, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin · Devis",
  robots: { index: false, follow: false },
};

const DEVIS = [
  { id: "D-2026-128", title: "Rénovation salle de bain",  client: "Marie L.",  artisan: "Jean Dupont",   metier: "Maçon",     amount: 4200, status: "active",    date: "Il y a 2j" },
  { id: "D-2026-127", title: "Pose carrelage 15m²",       client: "Sophie K.", artisan: "Hugo Martin",   metier: "Carreleur", amount: 1850, status: "quoted",    date: "Il y a 5j" },
  { id: "D-2026-119", title: "Installation chaudière",    client: "Pierre M.", artisan: "Marc Lefevre",  metier: "Chauffagiste", amount: 3400, status: "accepted", date: "Il y a 1 sem." },
  { id: "D-2026-098", title: "Pose parquet 40m²",         client: "Antoine L.",artisan: "Pierre Moreau", metier: "Menuisier", amount: 1200, status: "declined",  date: "Il y a 1 mois" },
];

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  active:    { label: "Actif",    cls: "bg-amber-50 text-amber-700 border-amber-200" },
  quoted:    { label: "Chiffré",  cls: "bg-blue-50 text-blue-700 border-blue-200" },
  accepted:  { label: "Accepté",  cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  declined:  { label: "Refusé",   cls: "bg-red-50 text-red-700 border-red-200" },
};

export default function AdminDevisPage() {
  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="container-default py-10">
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Dashboard admin
        </Link>

        <div className="mt-4 mb-8">
          <h1 className="text-3xl font-bold text-ink-700 tracking-tight flex items-center gap-2">
            <FileText size={24} className="text-brand-500" /> Devis
          </h1>
          <p className="text-ink-400 mt-1">Suivi de toutes les demandes de devis créées sur la plateforme.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total",      value: "1 893" },
            { label: "Cette sem.", value: "47" },
            { label: "Acceptés",   value: "1 234" },
            { label: "Taux conv.", value: "65%" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-ink-100">
              <div className="text-2xl font-bold text-ink-700">{s.value}</div>
              <div className="text-xs text-ink-400">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-ink-100 p-3 mb-4 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-ink-50">
            <Search size={14} className="text-ink-300" />
            <input type="text" placeholder="ID devis, client, professionnel…" className="flex-1 bg-transparent outline-none text-sm" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink-50/60 text-[0.7rem] uppercase tracking-wider text-ink-400 border-b border-ink-100">
              <tr>
                <th className="text-left py-3 px-5 font-bold">ID</th>
                <th className="text-left py-3 px-5 font-bold">Projet</th>
                <th className="text-left py-3 px-5 font-bold hidden lg:table-cell">Parties</th>
                <th className="text-right py-3 px-5 font-bold">Montant</th>
                <th className="text-left py-3 px-5 font-bold">Statut</th>
                <th className="w-12" />
              </tr>
            </thead>
            <tbody>
              {DEVIS.map((d) => {
                const s = STATUS_LABELS[d.status];
                return (
                  <tr key={d.id} className="border-b border-ink-100 last:border-0 hover:bg-ink-50/40">
                    <td className="py-3 px-5 font-mono text-[0.78rem] text-ink-500">{d.id}</td>
                    <td className="px-5">
                      <strong className="text-ink-700 block">{d.title}</strong>
                      <div className="text-[0.72rem] text-ink-400">{d.metier} · {d.date}</div>
                    </td>
                    <td className="hidden lg:table-cell px-5 text-[0.78rem]">
                      <div className="text-ink-700">Client : <strong>{d.client}</strong></div>
                      <div className="text-ink-500">Professionnel : <strong>{d.artisan}</strong></div>
                    </td>
                    <td className="px-5 text-right font-bold text-brand-500">{d.amount.toLocaleString("fr-FR")} €</td>
                    <td className="px-5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider border ${s.cls}`}>
                        {s.label}
                      </span>
                    </td>
                    <td className="text-right pr-3">
                      <button className="p-2 hover:bg-ink-100 rounded-lg text-ink-500"><MoreVertical size={14} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
