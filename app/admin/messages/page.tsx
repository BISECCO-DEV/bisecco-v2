import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageCircle, AlertTriangle, MoreVertical, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin · Messages",
  robots: { index: false, follow: false },
};

const THREADS = [
  { id: 1, between: "Marie L. ↔ Jean Dupont",  lastMessage: "Je peux passer demain à 10h.",     flagged: false, count: 12, date: "Il y a 5min" },
  { id: 2, between: "Sophie K. ↔ Hugo Martin", lastMessage: "Voici le devis détaillé en PDF.",  flagged: false, count: 8,  date: "Il y a 2h" },
  { id: 3, between: "Anonymous ↔ Karim B.",    lastMessage: "Pourquoi tu me bloques connard ?", flagged: true,  count: 24, date: "Hier" },
];

export default function AdminMessagesPage() {
  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="container-default py-10">
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Dashboard admin
        </Link>
        <div className="mt-4 mb-8">
          <h1 className="text-3xl font-bold text-ink-700 tracking-tight flex items-center gap-2">
            <MessageCircle size={24} className="text-brand-500" /> Messages
          </h1>
          <p className="text-ink-400 mt-1">Conversations signalées et modération anti-harcèlement.</p>
        </div>

        <div className="bg-white rounded-2xl border border-ink-100 p-3 mb-4 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-ink-50">
            <Search size={14} className="text-ink-300" />
            <input type="text" placeholder="Rechercher dans les conversations…" className="flex-1 bg-transparent outline-none text-sm" />
          </div>
          <select className="px-3 py-2 rounded-xl bg-ink-50 border border-ink-100 text-sm font-semibold outline-none">
            <option>Toutes</option>
            <option>Signalées uniquement</option>
          </select>
        </div>

        <div className="space-y-3">
          {THREADS.map((t) => (
            <article key={t.id} className={`bg-white rounded-2xl border p-5 ${t.flagged ? "border-red-200" : "border-ink-100"}`}>
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <strong className="text-ink-700">{t.between}</strong>
                    {t.flagged && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-[0.65rem] font-bold">
                        <AlertTriangle size={9} /> Signalé
                      </span>
                    )}
                    <span className="text-xs text-ink-400">· {t.count} messages</span>
                    <span className="text-xs text-ink-300 ml-auto">{t.date}</span>
                  </div>
                  <p className="text-sm text-ink-500 italic line-clamp-1">&ldquo;{t.lastMessage}&rdquo;</p>
                </div>
                <button className="p-2 hover:bg-ink-100 rounded-lg text-ink-500"><MoreVertical size={14} /></button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
