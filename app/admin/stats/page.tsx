import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BarChart3, TrendingUp, Users, FileText, Eye, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin · Statistiques",
  robots: { index: false, follow: false },
};

const KPIS = [
  { label: "Visiteurs uniques (30j)", value: "47 821",  change: "+24%",  color: "from-blue-400 to-blue-600",      icon: Eye },
  { label: "Inscriptions (30j)",      value: "1 247",   change: "+18%",  color: "from-emerald-400 to-emerald-600",icon: Users },
  { label: "Devis créés (30j)",       value: "893",     change: "+34%",  color: "from-brand-400 to-brand-600",    icon: FileText },
  { label: "Messages (30j)",          value: "12 458",  change: "+12%",  color: "from-purple-400 to-purple-600",  icon: MessageCircle },
];

export default function AdminStatsPage() {
  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="container-default py-10">
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Dashboard admin
        </Link>
        <div className="mt-4 mb-8 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-ink-700 tracking-tight flex items-center gap-2">
              <BarChart3 size={24} className="text-brand-500" /> Statistiques
            </h1>
            <p className="text-ink-400 mt-1">Vue détaillée de l&apos;activité Bisecco.</p>
          </div>
          <select className="px-3 py-2 rounded-xl bg-white border border-ink-200 text-sm font-semibold outline-none">
            <option>Derniers 30 jours</option>
            <option>Derniers 7 jours</option>
            <option>3 derniers mois</option>
            <option>1 an</option>
          </select>
        </div>

        {/* KPIs */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {KPIS.map((k) => (
            <div key={k.label} className="bg-white rounded-2xl p-5 border border-ink-100">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${k.color} flex items-center justify-center`}>
                  <k.icon size={20} className="text-white" />
                </div>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <TrendingUp size={11} /> {k.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-ink-700">{k.value}</div>
              <div className="text-xs text-ink-400">{k.label}</div>
            </div>
          ))}
        </div>

        {/* Chart placeholder */}
        <div className="bg-white rounded-2xl border border-ink-100 p-6 mb-6">
          <h2 className="font-bold text-ink-700 mb-1">Trafic 30 derniers jours</h2>
          <p className="text-sm text-ink-400 mb-5">Visiteurs uniques jour par jour</p>
          <div className="flex items-end gap-1 h-48">
            {Array.from({ length: 30 }).map((_, i) => {
              const h = 30 + Math.sin(i / 4) * 25 + Math.random() * 30;
              return (
                <div key={i} className="flex-1 rounded-t hover:opacity-80 transition" style={{
                  height: `${h}%`,
                  background: `linear-gradient(to top, rgba(240,122,47,0.5), rgba(240,122,47,0.9))`,
                }} title={`Jour ${i + 1}`} />
              );
            })}
          </div>
          <div className="flex justify-between mt-3 text-xs text-ink-400">
            <span>30j</span><span>20j</span><span>10j</span><span>Aujourd&apos;hui</span>
          </div>
        </div>

        {/* Top */}
        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-white rounded-2xl border border-ink-100 p-6">
            <h2 className="font-bold text-ink-700 mb-4">Top métiers recherchés</h2>
            <div className="space-y-3">
              {[
                { metier: "Plombier",   count: 1247, pct: 100 },
                { metier: "Électricien", count: 893, pct: 72 },
                { metier: "Maçon",       count: 712, pct: 57 },
                { metier: "Carreleur",   count: 524, pct: 42 },
                { metier: "Menuisier",   count: 401, pct: 32 },
              ].map((m) => (
                <div key={m.metier}>
                  <div className="flex justify-between text-xs mb-1">
                    <strong className="text-ink-700">{m.metier}</strong>
                    <span className="text-ink-400">{m.count}</span>
                  </div>
                  <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full" style={{ width: `${m.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-ink-100 p-6">
            <h2 className="font-bold text-ink-700 mb-4">Top villes</h2>
            <div className="space-y-3">
              {[
                { city: "Meaux",         count: 824, pct: 100 },
                { city: "Chelles",       count: 587, pct: 71 },
                { city: "Lagny-sur-Marne", count: 412, pct: 50 },
                { city: "Melun",         count: 298, pct: 36 },
                { city: "Paris",         count: 234, pct: 28 },
              ].map((c) => (
                <div key={c.city}>
                  <div className="flex justify-between text-xs mb-1">
                    <strong className="text-ink-700">{c.city}</strong>
                    <span className="text-ink-400">{c.count}</span>
                  </div>
                  <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
