"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  MessageCircle, ShieldCheck, Sparkles, HelpCircle, Plus, ArrowRight,
  Mail, Headphones,
} from "lucide-react";

type FaqCategory = "Tous" | "Tarifs" | "Sécurité" | "Fonctionnement" | "Données";

type FaqItem = {
  q: string;
  a: string;
  category: Exclude<FaqCategory, "Tous">;
};

const FAQ: FaqItem[] = [
  {
    q: "Bisecco est-il vraiment gratuit ?",
    a: "Oui, 100 % gratuit pour les particuliers et pour les artisans. Pas de carte bancaire requise à l'inscription, pas de commission sur vos chantiers, pas de frais cachés. Les artisans peuvent souscrire un service premium optionnel pour booster leur visibilité, mais ce n'est jamais imposé.",
    category: "Tarifs",
  },
  {
    q: "Comment vérifiez-vous les artisans ?",
    a: "Tous les artisans doivent fournir leur numéro SIREN à l'inscription. Nous le vérifions automatiquement via l'API officielle Sirene de l'INSEE (recherche-entreprises.api.gouv.fr). Si l'entreprise n'est pas active ou n'existe pas, l'inscription est refusée. Aucun faux profil ne passe.",
    category: "Sécurité",
  },
  {
    q: "Comment fonctionnent les avis clients ?",
    a: "Après chaque mission terminée, le particulier reçoit un email lui demandant de noter l'artisan. Seuls les vrais clients ayant échangé via la messagerie Bisecco peuvent laisser un avis. Aucune note achetée, aucune fraude possible. Les avis négatifs ne sont jamais supprimés sur demande commerciale.",
    category: "Sécurité",
  },
  {
    q: "Combien de temps pour recevoir un devis ?",
    a: "La majorité des artisans répondent en moins de 24 heures. Vous recevez généralement 2 à 5 propositions de devis par projet. Plus votre description est précise (avec photos, surface, urgence), plus la réponse est rapide · souvent en quelques heures.",
    category: "Fonctionnement",
  },
  {
    q: "Comment se déroule la mise en relation ?",
    a: "Vous décrivez votre projet, vous recevez les devis par email et messagerie. Vous comparez, vous discutez en direct avec les artisans qui vous intéressent, vous choisissez librement. Bisecco n'intervient jamais dans la transaction ni dans le paiement.",
    category: "Fonctionnement",
  },
  {
    q: "Bisecco prend-il une commission sur les chantiers ?",
    a: "Non, aucune commission n'est prélevée sur vos chantiers ou paiements. Vous travaillez en direct avec l'artisan, sans aucun intermédiaire financier. C'est l'engagement écrit dans nos CGV · la différence fondamentale avec les autres plateformes.",
    category: "Tarifs",
  },
  {
    q: "Mes données personnelles sont-elles sécurisées ?",
    a: "Oui. Bisecco est hébergé en France et conforme RGPD. Vos données ne sont jamais revendues à des tiers, vos échanges sont chiffrés en transit (HTTPS), et vous pouvez à tout moment exporter ou supprimer toutes vos données depuis votre espace personnel · conformément au droit à l'oubli.",
    category: "Données",
  },
  {
    q: "Que faire en cas de litige avec un artisan ?",
    a: "Bisecco propose une médiation amiable gratuite. Contactez notre service support, nous étudions votre dossier et tentons de trouver un accord avec l'artisan. Si la médiation échoue, nous vous orientons vers le médiateur de la consommation compétent en France.",
    category: "Sécurité",
  },
];

const CATEGORIES: FaqCategory[] = ["Tous", "Tarifs", "Sécurité", "Fonctionnement", "Données"];

const CATEGORY_COLORS: Record<Exclude<FaqCategory, "Tous">, string> = {
  Tarifs:        "bg-emerald-100 text-emerald-700 border-emerald-200",
  Sécurité:      "bg-blue-100 text-blue-700 border-blue-200",
  Fonctionnement:"bg-brand-100 text-brand-700 border-brand-200",
  Données:       "bg-violet-100 text-violet-700 border-violet-200",
};

export function HomeFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [category, setCategory] = useState<FaqCategory>("Tous");

  const filtered = FAQ.filter((f) => category === "Tous" || f.category === category);

  return (
    <section className="relative py-20 sm:py-28 bg-gradient-to-b from-white via-ink-50/40 to-white overflow-hidden">
      {/* Décors */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-brand-500/[0.05] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 -right-32 w-[500px] h-[500px] rounded-full bg-blue-500/[0.05] blur-[140px] pointer-events-none" />
      {/* Grille de points */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #0d1e4a 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container-default relative">
        {/* Header premium */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
            <MessageCircle size={11} strokeWidth={2.8} className="text-brand-500" />
            Questions fréquentes
          </span>
          <h2 className="mt-5 text-[32px] sm:text-[42px] lg:text-[52px] leading-[1.05] font-extrabold text-ink-700 tracking-[-0.025em]">
            Tout ce qu&apos;il faut{" "}
            <span className="relative inline-block">
              <span className="text-brand-500 animate-gradient-flow" style={{ backgroundSize: "200% 100%" }}>
                savoir
              </span>
              <span className="text-brand-500">.</span>
            </span>
          </h2>
          <p className="mt-5 text-[0.96rem] sm:text-[1.05rem] text-ink-500 leading-relaxed">
            Une question rapide&nbsp;? Trouvez la réponse en{" "}
            <strong className="text-ink-700">10 secondes</strong>. Sinon,
            notre équipe répond en moins de <strong className="text-ink-700">24h</strong>.
          </p>

          {/* Mini stats row */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[0.8rem]">
            <div className="flex items-center gap-2 text-ink-500">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-brand-50 border border-brand-200 text-brand-600">
                <HelpCircle size={12} strokeWidth={2.4} />
              </span>
              {FAQ.length} questions
            </div>
            <span className="text-ink-300 hidden sm:inline">·</span>
            <div className="flex items-center gap-2 text-ink-500">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600">
                <ShieldCheck size={12} strokeWidth={2.4} />
              </span>
              Réponses vérifiées
            </div>
            <span className="text-ink-300 hidden sm:inline">·</span>
            <div className="flex items-center gap-2 text-ink-500">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 text-blue-600">
                <Sparkles size={12} strokeWidth={2.4} />
              </span>
              Mises à jour régulières
            </div>
          </div>
        </div>

        {/* Filtres catégories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-3xl mx-auto">
          {CATEGORIES.map((c) => {
            const active = category === c;
            const count = c === "Tous" ? FAQ.length : FAQ.filter((f) => f.category === c).length;
            return (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCategory(c);
                  setOpenIndex(null);
                }}
                className={`inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-[0.82rem] font-bold transition-all ${
                  active
                    ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-[0_4px_12px_rgba(240,122,47,0.4)]"
                    : "bg-white border border-ink-200 text-ink-600 hover:border-brand-300 hover:text-brand-500"
                }`}
                aria-pressed={active}
              >
                {c}
                <span className={`text-[0.66rem] font-extrabold px-1.5 rounded-full ${active ? "bg-white/25" : "bg-ink-100 text-ink-500"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Accordion premium · 2 colonnes (1 col mobile) */}
        {(() => {
          const half = Math.ceil(filtered.length / 2);
          const leftCol = filtered.slice(0, half);
          const rightCol = filtered.slice(half);
          return (
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mx-auto">
              <div className="space-y-2.5 sm:space-y-3">
                {leftCol.map((item, i) => {
                  const idx = i;
                  const isOpen = openIndex === idx;
                  return (
                    <FaqRow
                      key={`${category}-L-${idx}`}
                      index={idx}
                      item={item}
                      isOpen={isOpen}
                      catColor={CATEGORY_COLORS[item.category]}
                      onToggle={() => setOpenIndex(isOpen ? null : idx)}
                    />
                  );
                })}
              </div>
              <div className="space-y-2.5 sm:space-y-3">
                {rightCol.map((item, i) => {
                  const idx = half + i;
                  const isOpen = openIndex === idx;
                  return (
                    <FaqRow
                      key={`${category}-R-${idx}`}
                      index={idx}
                      item={item}
                      isOpen={isOpen}
                      catColor={CATEGORY_COLORS[item.category]}
                      onToggle={() => setOpenIndex(isOpen ? null : idx)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* CTA fin */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 text-white p-7 sm:p-8 text-center">
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-brand-500/25 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-blue-500/15 blur-2xl pointer-events-none" />

            <div className="relative">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-[0_8px_20px_-4px_rgba(240,122,47,0.5)] mb-4">
                <Headphones size={20} strokeWidth={2.2} />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Vous ne trouvez pas votre réponse&nbsp;?
              </h3>
              <p className="mt-2 text-white/65 text-[0.94rem] max-w-md mx-auto">
                Notre équipe support est là pour vous aider. Réponse garantie sous 24h ouvrées.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-extrabold text-[0.88rem] shadow-[0_8px_20px_-4px_rgba(240,122,47,0.5),inset_0_1px_0_rgba(255,255,255,0.25)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-4px_rgba(240,122,47,0.6)] transition-all"
                >
                  <Mail size={14} strokeWidth={2.4} />
                  Nous contacter
                  <ArrowRight size={13} strokeWidth={2.6} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/aide"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.08] border border-white/15 text-white font-bold text-[0.88rem] hover:bg-white/[0.14] transition"
                >
                  <HelpCircle size={14} strokeWidth={2.4} />
                  Centre d&apos;aide complet
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Une ligne FAQ · animation de hauteur avec ref + measure */
function FaqRow({
  index,
  item,
  isOpen,
  catColor,
  onToggle,
}: {
  index: number;
  item: FaqItem;
  isOpen: boolean;
  catColor: string;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  // Re-mesure si la fenêtre change de taille (responsive)
  useEffect(() => {
    if (!isOpen) return;
    const onResize = () => {
      if (contentRef.current) setHeight(contentRef.current.scrollHeight);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isOpen]);

  return (
    <div
      className={`group rounded-2xl border bg-white transition-all duration-300 overflow-hidden ${
        isOpen
          ? "border-brand-300 shadow-[0_10px_30px_-12px_rgba(240,122,47,0.25)]"
          : "border-ink-100 hover:border-brand-200 hover:shadow-[0_4px_14px_-6px_rgba(13,30,74,0.12)]"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
        className="w-full flex items-start gap-4 p-5 sm:p-6 text-left"
      >
        {/* Numéro badge */}
        <span
          className={`flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-xl text-[0.78rem] font-extrabold transition-all ${
            isOpen
              ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-[0_4px_12px_rgba(240,122,47,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]"
              : "bg-ink-50 text-ink-500 group-hover:bg-brand-50 group-hover:text-brand-600"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Question */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full ${catColor} border text-[0.62rem] font-extrabold uppercase tracking-[0.1em]`}
            >
              {item.category}
            </span>
          </div>
          <h3
            className={`font-extrabold text-[1rem] sm:text-[1.05rem] tracking-tight transition-colors ${
              isOpen ? "text-brand-700" : "text-ink-700 group-hover:text-ink-800"
            }`}
          >
            {item.q}
          </h3>
        </div>

        {/* Icon + → × */}
        <span
          className={`flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full border transition-all ${
            isOpen
              ? "bg-brand-500 border-brand-500 text-white rotate-45 shadow-[0_4px_12px_rgba(240,122,47,0.45)]"
              : "bg-white border-ink-200 text-ink-500 group-hover:border-brand-400 group-hover:text-brand-500"
          }`}
        >
          <Plus size={15} strokeWidth={2.6} />
        </span>
      </button>

      {/* Panel · animation hauteur smooth */}
      <div
        id={`faq-panel-${index}`}
        role="region"
        style={{ height: `${height}px` }}
        className="transition-[height] duration-400 ease-[cubic-bezier(.22,.68,0,1.2)] overflow-hidden"
      >
        <div ref={contentRef} className="px-5 sm:px-6 pb-5 sm:pb-6">
          <div className="pl-[52px] -mt-1">
            <div className="pt-4 border-t border-dashed border-ink-100">
              <p className="text-[0.94rem] text-ink-500 leading-relaxed">{item.a}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
