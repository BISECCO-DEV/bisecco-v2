import type { Metadata } from "next";
import Link from "next/link";
import { Search, FileText, MessageCircle, ShieldCheck, CreditCard, User, Briefcase, ArrowRight, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Centre d'aide",
  description: "Trouvez les réponses à vos questions sur Bisecco : inscription, devis, paiement, sécurité, RGPD.",
};

const CATEGORIES = [
  { icon: User,         title: "Mon compte",         desc: "Inscription, profil, paramètres",        count: 12, color: "from-blue-400 to-blue-600",       href: "/aide/compte" },
  { icon: Briefcase,    title: "Pour les artisans",  desc: "Inscription, validation SIREN, devis",   count: 18, color: "from-emerald-400 to-emerald-600", href: "/aide/artisans" },
  { icon: FileText,     title: "Devis & contact",    desc: "Demander, comparer, accepter un devis",  count: 8,  color: "from-brand-400 to-brand-600",     href: "/aide/devis" },
  { icon: MessageCircle, title: "Messagerie",         desc: "Envoyer, signaler, modérer",             count: 6,  color: "from-purple-400 to-purple-600",   href: "/aide/messagerie" },
  { icon: CreditCard,   title: "Abonnements Pro",    desc: "Plans, paiement, facturation",           count: 9,  color: "from-amber-400 to-amber-600",     href: "/aide/abonnements" },
  { icon: ShieldCheck,  title: "Sécurité & RGPD",    desc: "Données, vie privée, droits",            count: 7,  color: "from-rose-400 to-rose-600",       href: "/aide/securite" },
];

const POPULAR = [
  { q: "Comment trouver un artisan ?",                href: "/aide/article/trouver-artisan" },
  { q: "Bisecco est-il vraiment gratuit ?",            href: "/aide/article/gratuit" },
  { q: "Comment vérifiez-vous les artisans ?",        href: "/aide/article/verification-siren" },
  { q: "Comment laisser un avis ?",                    href: "/aide/article/laisser-avis" },
  { q: "Que faire en cas de litige avec un artisan ?", href: "/aide/article/litige" },
  { q: "Comment annuler mon abonnement ?",            href: "/aide/article/annuler-abonnement" },
];

export default function AidePage() {
  return (
    <div className="bg-ink-50 min-h-screen pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[300px] rounded-full bg-brand-500/15 blur-[120px]" />
        <div className="container-default text-center relative">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-[0.65rem] font-bold tracking-[0.14em] uppercase">
            <BookOpen size={11} /> Centre d&apos;aide
          </span>
          <h1 className="text-3xl md:text-[2.6rem] font-bold mt-4 tracking-[-0.02em] leading-[1.1]">
            Comment pouvons-nous<br />
            <span className="text-brand-500">vous aider ?</span>
          </h1>
          <p className="mt-4 text-white/65 max-w-xl mx-auto">
            60+ articles pour répondre à toutes vos questions. Et si vous ne trouvez pas, contactez-nous.
          </p>

          {/* Search bar */}
          <div className="mt-7 max-w-xl mx-auto">
            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white shadow-2xl">
              <Search size={18} className="text-ink-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Posez votre question…"
                className="flex-1 bg-transparent outline-none text-ink-700 placeholder:text-ink-400"
              />
              <button className="px-4 py-2 rounded-xl bg-brand-500 text-white text-sm font-bold hover:bg-brand-600 transition">
                Rechercher
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container-default py-12">
        {/* Catégories */}
        <h2 className="text-xl font-bold text-ink-700 mb-5 tracking-tight">Explorez par catégorie</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {CATEGORIES.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="group bg-white rounded-2xl p-6 border border-ink-100 hover:border-brand-300 hover:-translate-y-1 transition"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-4`}>
                <c.icon size={22} className="text-white" />
              </div>
              <h3 className="font-bold text-ink-700">{c.title}</h3>
              <p className="text-sm text-ink-400 mt-1">{c.desc}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-500 group-hover:gap-2 transition-all">
                {c.count} articles <ArrowRight size={11} />
              </div>
            </Link>
          ))}
        </div>

        {/* Articles populaires */}
        <h2 className="text-xl font-bold text-ink-700 mb-5 tracking-tight">Articles populaires</h2>
        <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
          {POPULAR.map((p, i) => (
            <Link
              key={p.href}
              href={p.href}
              className={`flex items-center justify-between px-5 py-4 hover:bg-ink-50/60 transition group ${i > 0 ? "border-t border-ink-100" : ""}`}
            >
              <span className="text-ink-700 font-semibold">{p.q}</span>
              <ArrowRight size={14} className="text-ink-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition" />
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-12 bg-gradient-to-br from-brand-50 to-amber-50/30 rounded-3xl p-8 md:p-10 border border-brand-200/60 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white shadow-card flex items-center justify-center mb-4">
            <MessageCircle size={22} className="text-brand-500" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-ink-700 tracking-tight">
            Vous n&apos;avez pas trouvé votre réponse ?
          </h3>
          <p className="text-sm text-ink-500 mt-2 max-w-md mx-auto">
            Notre équipe vous répond en moins de 24h. Posez-nous votre question, on est là pour vous aider.
          </p>
          <Link href="/contact" className="btn-primary mt-6 inline-flex">
            Contacter le support <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
