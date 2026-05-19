import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, MessageCircle, MapPin, Briefcase, FileText, CheckCircle2, X, Calendar, Euro, Image as ImageIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Détail du devis",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ id: string }> };

const DEMO_DEVIS = {
  id: "D-2026-128",
  title: "Rénovation salle de bain",
  description: "Bonjour, je souhaite refaire entièrement ma salle de bain de 8m². Refaire la plomberie, poser un nouveau carrelage au sol et aux murs, installer une douche italienne (refusant la baignoire actuelle), remplacer le lavabo et le WC. Délai souhaité : avant fin juin.",
  metier: "Maçon",
  city: "Meaux (77100)",
  urgency: "month",
  budget: "high",
  created: "Il y a 2 jours",
  status: "received",
  photos: [
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?w=800&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop&q=80",
  ],
  proposals: [
    { artisan: "Jean Dupont",   company: "Dupont Maçonnerie",  avatar: "https://i.pravatar.cc/100?img=12", rating: 4.8, amount: 4200, delay: "3 semaines", status: "received", responded: "Il y a 1 jour" },
    { artisan: "Hugo Martin",   company: "Martin Carrelage",   avatar: "https://i.pravatar.cc/100?img=33", rating: 4.9, amount: 3950, delay: "4 semaines", status: "received", responded: "Il y a 2j" },
    { artisan: "Marc Lefevre",  company: "Lefevre & Fils",     avatar: "https://i.pravatar.cc/100?img=68", rating: 4.7, amount: 4800, delay: "2 semaines", status: "received", responded: "Il y a 5h" },
  ],
};

export default async function DevisDetailPage({ params }: Props) {
  await params;
  const d = DEMO_DEVIS;

  return (
    <div className="bg-ink-50 min-h-screen pb-16">
      <div className="container-default max-w-5xl py-10">
        <Link href="/mon-profil/devis" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Mes devis
        </Link>

        {/* Header */}
        <div className="mt-4 mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[0.65rem] font-bold uppercase tracking-wider">
                <FileText size={10} /> À comparer
              </span>
              <span className="text-xs text-ink-400 font-mono">{d.id}</span>
            </div>
            <h1 className="text-3xl font-bold text-ink-700 tracking-tight">{d.title}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-ink-500 flex-wrap">
              <span className="font-semibold text-brand-500">{d.metier}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><MapPin size={11} /> {d.city}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock size={11} /> {d.created}</span>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 transition">
            <X size={14} /> Annuler la demande
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-6">
            {/* Description */}
            <section className="bg-white rounded-2xl border border-ink-100 p-6">
              <h2 className="font-bold text-ink-700 mb-3">Description du projet</h2>
              <p className="text-ink-600 leading-relaxed">{d.description}</p>
            </section>

            {/* Photos */}
            <section className="bg-white rounded-2xl border border-ink-100 p-6">
              <h2 className="font-bold text-ink-700 mb-4 flex items-center gap-2">
                <ImageIcon size={16} /> Photos jointes ({d.photos.length})
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {d.photos.map((src, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden bg-ink-100 cursor-pointer hover:opacity-90 transition">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </section>

            {/* Propositions */}
            <section>
              <h2 className="font-bold text-ink-700 mb-4 flex items-center gap-2">
                {d.proposals.length} propositions reçues
              </h2>
              <div className="space-y-3">
                {d.proposals.map((p, i) => (
                  <article key={i} className="bg-white rounded-2xl border border-ink-100 hover:border-brand-300 hover:-translate-y-0.5 transition p-5">
                    <div className="flex items-start gap-4 flex-wrap">
                      <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.avatar} alt="" className="w-12 h-12 rounded-2xl border border-ink-100" loading="lazy" />
                        <div>
                          <div className="font-bold text-ink-700">{p.artisan}</div>
                          <div className="text-xs text-ink-500">{p.company} · {p.rating}★</div>
                          <div className="text-[0.7rem] text-ink-400 mt-0.5">Répondu {p.responded}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[0.65rem] font-bold tracking-wider text-ink-400 uppercase">Devis</div>
                        <div className="text-2xl font-bold text-brand-500">{p.amount.toLocaleString("fr-FR")} €</div>
                        <div className="text-xs text-ink-400">Délai : {p.delay}</div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition">
                          <CheckCircle2 size={13} /> Accepter
                        </button>
                        <Link href="/messagerie/1" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-ink-200 text-ink-700 text-sm font-bold hover:border-brand-500 transition">
                          <MessageCircle size={13} /> Message
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="bg-white rounded-2xl border border-ink-100 p-5">
              <h3 className="font-bold text-ink-700 text-sm mb-3">Informations</h3>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-center gap-2.5">
                  <Briefcase size={14} className="text-brand-500 flex-shrink-0" />
                  <span className="text-ink-600"><strong>Métier :</strong> {d.metier}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <MapPin size={14} className="text-brand-500 flex-shrink-0" />
                  <span className="text-ink-600"><strong>Ville :</strong> {d.city}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Calendar size={14} className="text-brand-500 flex-shrink-0" />
                  <span className="text-ink-600"><strong>Urgence :</strong> Sous 30 jours</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Euro size={14} className="text-brand-500 flex-shrink-0" />
                  <span className="text-ink-600"><strong>Budget :</strong> 2K€ – 10K€</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-sm text-blue-800">
              <strong className="block mb-1">💡 Astuce</strong>
              Comparez bien les délais et garanties, pas seulement le prix. Le moins cher n&apos;est pas toujours le meilleur.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
