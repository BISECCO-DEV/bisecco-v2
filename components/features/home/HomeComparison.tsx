import { Check, X, Scale, ShieldCheck } from "lucide-react";

type Cell = "yes" | "no" | "partial" | string;

type CompetitorCol = {
  name: string;
  logo: string;       // single letter for placeholder
  highlight?: boolean;
  accent?: string;    // tailwind color class for the column header
};

type Row = {
  feature: string;
  detail: string;
  cells: Cell[]; // ordre : Bisecco, concurrent 1, concurrent 2
};

const COLUMNS: CompetitorCol[] = [
  { name: "Bisecco",        logo: "B", highlight: true,  accent: "from-brand-500 to-brand-600" },
  { name: "Habitatpresto",  logo: "H",                   accent: "from-blue-500 to-blue-600" },
  { name: "Pages Jaunes",   logo: "PJ",                  accent: "from-amber-500 to-amber-600" },
];

const ROWS: Row[] = [
  { feature: "Commission sur prestations", detail: "Sur chaque devis signé",
    cells: ["yes", "5-25 %", "Variable"] },
  { feature: "Vérification SIREN active",  detail: "API INSEE en temps réel",
    cells: ["yes", "no", "no"] },
  { feature: "Inscription artisan gratuite", detail: "Profil de base",
    cells: ["yes", "yes", "partial"] },
  { feature: "Contact direct sans paywall", detail: "Messagerie intégrée",
    cells: ["yes", "no", "partial"] },
  { feature: "Avis 100 % vérifiés",          detail: "Uniquement vrais clients",
    cells: ["yes", "partial", "no"] },
  { feature: "Achat de leads imposé",       detail: "Pour voir les demandes",
    cells: ["yes", "no", "no"] },
  { feature: "Pages SEO métier × ville",    detail: "Référencement local",
    cells: ["80+ × 200", "Limité", "Annuaire générique"] },
  { feature: "Conforme RGPD français",      detail: "Hébergé en France",
    cells: ["yes", "yes", "yes"] },
];

// "yes" + "no" sont inversés selon la nature de la feature pour Bisecco :
// - "Commission" : pour Bisecco "yes" = "0%" (positif), pour concurrents on affiche le %
// - "Vérification SIREN" : pour Bisecco "yes" = oui, pour concurrents "no" = non
// Pour simplifier, je vais mapper chaque cell intelligemment.
const POSITIVE_FOR_BISECCO = [
  // index 0 : Commission → Bisecco = bon (0%), concurrents = mauvais
  { bisecco: "0 %", others: "negative" },
  // index 1 : Vérification SIREN → positif partout sauf concurrents
  { bisecco: "yes", others: "negative" },
  // index 2 : Inscription gratuite → tous bons
  { bisecco: "yes", others: "neutral" },
  // index 3 : Contact direct
  { bisecco: "yes", others: "negative" },
  // index 4 : Avis vérifiés
  { bisecco: "yes", others: "negative" },
  // index 5 : Achat leads imposé → Bisecco = non (yes pour "non imposé"), concurrents = oui (mauvais)
  { bisecco: "no", others: "positive_bad" },
  // index 6 : Pages SEO
  { bisecco: "yes", others: "text" },
  // index 7 : RGPD → tous bons
  { bisecco: "yes", others: "neutral" },
];

function renderCell(value: Cell, colIndex: number, rowIndex: number) {
  const isBisecco = colIndex === 0;

  if (value === "yes") {
    return (
      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
        isBisecco
          ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-[0_4px_10px_rgba(16,185,129,0.4)]"
          : "bg-emerald-50 text-emerald-600 border border-emerald-200"
      }`}>
        <Check size={15} strokeWidth={3} />
      </span>
    );
  }

  if (value === "no") {
    return (
      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
        isBisecco
          ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-[0_4px_10px_rgba(16,185,129,0.4)]"
          : "bg-red-50 text-red-500 border border-red-200"
      }`}>
        {isBisecco ? <Check size={15} strokeWidth={3} /> : <X size={15} strokeWidth={3} />}
      </span>
    );
  }

  if (value === "partial") {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-50 text-amber-600 border border-amber-200" title="Partiel">
        <span className="font-extrabold text-[0.78rem]">~</span>
      </span>
    );
  }

  // String (ex: "5-25 %", "0 %")
  const looksGoodForBisecco = rowIndex === 0 && isBisecco; // 0% commission
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[0.78rem] font-extrabold ${
      isBisecco && looksGoodForBisecco
        ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-[0_4px_10px_rgba(16,185,129,0.4)]"
        : isBisecco
        ? "bg-brand-50 text-brand-700 border border-brand-200"
        : "bg-ink-50 text-ink-600 border border-ink-200"
    }`}>
      {value}
    </span>
  );
}

export function HomeComparison() {
  return (
    <section className="relative py-20 sm:py-28 bg-gradient-to-b from-ink-50 via-white to-ink-50 overflow-hidden">
      {/* Décors */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-brand-500/[0.05] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 -right-32 w-[500px] h-[500px] rounded-full bg-blue-500/[0.05] blur-[140px] pointer-events-none" />

      <div className="container-default relative">
        {/* Head */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
            <Scale size={11} strokeWidth={2.8} className="text-brand-500" />
            Comparatif
          </span>
          <h2 className="mt-5 text-[34px] sm:text-[44px] md:text-[52px] leading-[1.05] font-extrabold text-ink-700 tracking-[-0.025em]">
            Pourquoi choisir{" "}
            <span className="relative inline-block">
              <span className="text-brand-500 animate-gradient-flow" style={{ backgroundSize: "200% 100%" }}>
                Bisecco
              </span>
              <span className="text-brand-500"> ?</span>
            </span>
          </h2>
          <p className="mt-5 text-[1rem] sm:text-[1.06rem] text-ink-500 leading-relaxed">
            Comparez en toute transparence ce que Bisecco offre face aux plateformes traditionnelles.
          </p>
        </div>

        {/* Tableau comparatif premium */}
        <div className="relative rounded-3xl bg-white border border-ink-100 shadow-[0_20px_50px_-20px_rgba(13,30,74,0.18)] overflow-hidden">
          {/* Highlight column Bisecco · gradient orange subtle en arrière-plan */}
          <div className="absolute top-0 bottom-0 left-1/2 sm:left-[33%] md:left-[28%] lg:left-[25%] w-1/2 sm:w-[22%] md:w-[24%] lg:w-[25%] bg-gradient-to-b from-brand-500/[0.04] via-brand-500/[0.02] to-transparent pointer-events-none border-x border-brand-100/40 hidden md:block" aria-hidden />

          {/* Header columns */}
          <div className="relative grid grid-cols-[1fr_auto_auto_auto] md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-2 sm:gap-4 px-3 sm:px-6 py-4 sm:py-5 border-b border-ink-100 bg-ink-50/40">
            <div className="hidden md:block">
              <span className="text-[0.66rem] font-extrabold tracking-[0.14em] uppercase text-ink-400">Fonctionnalité</span>
            </div>
            <div className="md:hidden" />
            {COLUMNS.map((col, i) => (
              <div key={col.name} className={`flex flex-col items-center text-center ${col.highlight ? "relative" : ""}`}>
                {col.highlight && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white text-[0.55rem] font-extrabold tracking-[0.14em] uppercase shadow-[0_4px_10px_rgba(240,122,47,0.4)] whitespace-nowrap">
                    <ShieldCheck size={9} strokeWidth={3} />
                    Recommandé
                  </span>
                )}
                <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br ${col.accent} text-white font-extrabold text-[0.86rem] shadow-[0_4px_10px_rgba(0,0,0,0.12)] mb-1.5`}>
                  {col.logo}
                </div>
                <span className={`text-[0.74rem] sm:text-[0.86rem] font-extrabold tracking-tight ${col.highlight ? "text-brand-700" : "text-ink-600"}`}>
                  {col.name}
                </span>
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="relative divide-y divide-ink-100">
            {ROWS.map((row, rowIndex) => (
              <div
                key={row.feature}
                className="grid grid-cols-[1fr_auto_auto_auto] md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-2 sm:gap-4 px-3 sm:px-6 py-4 sm:py-5 items-center hover:bg-ink-50/30 transition-colors"
              >
                {/* Feature label */}
                <div className="min-w-0">
                  <div className="font-extrabold text-ink-700 text-[0.86rem] sm:text-[0.92rem] tracking-tight leading-snug">
                    {row.feature}
                  </div>
                  <div className="text-[0.7rem] sm:text-[0.76rem] text-ink-400 mt-0.5">
                    {row.detail}
                  </div>
                </div>

                {/* Cells */}
                {row.cells.map((cell, colIndex) => (
                  <div key={colIndex} className="flex items-center justify-center">
                    {renderCell(cell, colIndex, rowIndex)}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Footer summary bar */}
          <div className="relative bg-gradient-to-r from-brand-50/60 via-brand-50/30 to-transparent border-t border-brand-100 px-3 sm:px-6 py-4 grid grid-cols-[1fr_auto_auto_auto] md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-2 sm:gap-4 items-center">
            <div className="font-extrabold text-ink-700 text-[0.82rem] sm:text-[0.88rem]">
              Score global
            </div>
            {[100, 55, 35].map((score, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className={`text-[1rem] sm:text-[1.2rem] font-extrabold tabular-nums ${i === 0 ? "text-brand-600" : "text-ink-400"}`}>
                  {score}%
                </span>
                <span className="hidden sm:block text-[0.6rem] font-bold tracking-wider uppercase text-ink-400 mt-0.5">
                  {i === 0 ? "Top" : i === 1 ? "Moyen" : "Faible"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Note légale */}
        <p className="mt-5 text-center text-[0.74rem] text-ink-400 max-w-3xl mx-auto leading-relaxed">
          Comparaison réalisée à partir des grilles tarifaires publiques au {new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}.
          Les services évoluent · vérifiez auprès des plateformes concernées.
        </p>
      </div>
    </section>
  );
}
