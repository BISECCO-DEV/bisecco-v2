import { Check, X, Minus, Scale, Sparkles } from "lucide-react";
import { CtaButton } from "@/components/ui/CtaButton";

type Cell = "yes" | "no" | "partial" | string;

type CompetitorCol = {
  name: string;
  logo: string;
  logoUrl?: string;
  highlight?: boolean;
};

type Row = {
  feature: string;
  detail: string;
  cells: Cell[]; // ordre : Bisecco, Pages Jaunes, Habitatpresto
};

const COLUMNS: CompetitorCol[] = [
  { name: "Bisecco",        logo: "B",  logoUrl: "/logo.jpg",                      highlight: true },
  { name: "Pages Jaunes",   logo: "PJ", logoUrl: "/competitors/pagesjaunes.svg" },
  { name: "Habitatpresto",  logo: "H",  logoUrl: "/competitors/habitatpresto.svg" },
];

const ROWS: Row[] = [
  {
    feature: "Commission sur prestations",
    detail: "Pourcentage prélevé sur les missions facturées",
    cells: ["0 %", "5 – 25 %", "Variable"],
  },
  {
    feature: "Vérification SIREN INSEE",
    detail: "Contrôle automatique en temps réel à l'inscription",
    cells: ["yes", "no", "no"],
  },
  {
    feature: "Messagerie directe client-artisan",
    detail: "Sans paywall ni intermédiaire payant",
    cells: ["yes", "no", "partial"],
  },
  {
    feature: "Contacts artisans illimités",
    detail: "Pas d'achat de leads à la pièce",
    cells: ["yes", "yes", "no"],
  },
  {
    feature: "Avis vérifiés clients réels",
    detail: "Modération + lien avec une demande de devis",
    cells: ["yes", "partial", "partial"],
  },
  {
    feature: "Inscription artisan gratuite",
    detail: "Profil complet sans abonnement obligatoire",
    cells: ["yes", "partial", "yes"],
  },
  {
    feature: "Pages locales métier × ville",
    detail: "Optimisation SEO pour la recherche locale",
    cells: ["176 × 200", "Annuaire", "Limité"],
  },
  {
    feature: "Hébergement français · RGPD",
    detail: "Données stockées en France, conforme RGPD",
    cells: ["yes", "yes", "yes"],
  },
];

function CellValue({ value, isBisecco }: { value: Cell; isBisecco: boolean }) {
  const size = "w-8 h-8 sm:w-9 sm:h-9";

  if (value === "yes") {
    return (
      <span
        className={`inline-flex items-center justify-center ${size} rounded-full ${
          isBisecco
            ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-[0_6px_14px_-4px_rgba(240,122,47,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]"
            : "bg-emerald-50 text-emerald-600 border border-emerald-200"
        }`}
        aria-label="Oui"
      >
        <Check size={isBisecco ? 16 : 14} strokeWidth={2.8} />
      </span>
    );
  }

  if (value === "no") {
    return (
      <span
        className={`inline-flex items-center justify-center ${size} rounded-full bg-ink-50 text-ink-300 border border-ink-100`}
        aria-label="Non"
      >
        <X size={14} strokeWidth={2.4} />
      </span>
    );
  }

  if (value === "partial") {
    return (
      <span
        className={`inline-flex items-center justify-center ${size} rounded-full bg-amber-50 text-amber-600 border border-amber-200`}
        aria-label="Partiel"
      >
        <Minus size={14} strokeWidth={2.8} />
      </span>
    );
  }

  return (
    <span
      className={`inline-block px-3 py-1.5 rounded-full text-[0.72rem] sm:text-[0.78rem] font-extrabold tabular-nums whitespace-nowrap ${
        isBisecco
          ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-[0_6px_14px_-4px_rgba(240,122,47,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]"
          : "bg-ink-50 text-ink-500 border border-ink-100"
      }`}
    >
      {value}
    </span>
  );
}

export function HomeComparison() {
  return (
    <section className="relative py-20 sm:py-28 bg-gradient-to-b from-ink-50 via-white to-ink-50 overflow-hidden">
      {/* Décors fond cohérents avec autres sections */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-brand-500/[0.06] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 -right-32 w-[500px] h-[500px] rounded-full bg-blue-500/[0.05] blur-[140px] pointer-events-none" />

      <div className="container-default relative">
        {/* ═══════ HEAD · pattern DA standard ═══════ */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
            <Scale size={11} strokeWidth={2.8} className="text-brand-500" />
            Comparatif
          </span>
          <h2 className="mt-5 text-[32px] lg:text-[38px] leading-[1.25] font-semibold text-ink-700 tracking-[-0.025em]">
            Bisecco face aux{" "}
            <span className="relative inline-block">
              <span className="text-brand-500">
                plateformes traditionnelles
              </span>
              <span className="text-brand-500">.</span>
            </span>
          </h2>
          <p className="mt-5 text-[0.96rem] sm:text-[1.06rem] text-ink-500 leading-relaxed">
            Huit critères factuels, mesurés sur les grilles tarifaires et CGV publiques.
            Vérifié au {new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}.
          </p>
        </div>

        {/* ═══════ CARD COMPARATIF · style DA ═══════ */}
        <div className="relative bg-white rounded-3xl border border-ink-100 shadow-[0_24px_60px_-25px_rgba(13,30,74,0.18)] overflow-hidden">
          {/* Background subtil colonne Bisecco */}
          <div
            className="absolute top-0 bottom-0 md:left-[33.3%] md:w-[22.2%] bg-gradient-to-b from-brand-500/[0.06] via-brand-500/[0.02] to-transparent pointer-events-none hidden md:block"
            aria-hidden
          />

          {/* ─── Header ─── */}
          <div className="relative grid grid-cols-[1fr_60px_60px_60px] sm:grid-cols-[1.5fr_1fr_1fr_1fr] gap-x-3 sm:gap-x-4 px-4 sm:px-7 pt-7 sm:pt-8 pb-6 border-b border-ink-100">
            <div className="hidden sm:flex items-end">
              <span className="text-[0.66rem] font-extrabold tracking-[0.14em] uppercase text-ink-400">
                Critère
              </span>
            </div>
            <div className="sm:hidden" />

            {COLUMNS.map((col) => (
              <div
                key={col.name}
                className={`relative flex flex-col items-center text-center ${col.highlight ? "pt-3" : "pt-1"}`}
              >
                {col.highlight && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white text-[0.54rem] sm:text-[0.58rem] font-extrabold tracking-[0.14em] uppercase shadow-[0_6px_14px_-3px_rgba(240,122,47,0.5),inset_0_1px_0_rgba(255,255,255,0.25)] whitespace-nowrap">
                    <Sparkles size={9} strokeWidth={3} />
                    Notre choix
                  </span>
                )}

                {/* Logo dans cercle premium DA */}
                <div
                  className={`relative inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden bg-white mb-2 ${
                    col.highlight
                      ? "border-2 border-brand-300 shadow-[0_8px_20px_-4px_rgba(240,122,47,0.35),inset_0_1px_0_rgba(255,255,255,0.25)]"
                      : "border border-ink-100 shadow-[0_4px_10px_-2px_rgba(13,30,74,0.08)]"
                  }`}
                >
                  {col.logoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={col.logoUrl}
                      alt={col.name}
                      className="w-full h-full object-contain p-1"
                      loading="lazy"
                    />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center bg-gradient-to-br from-ink-700 to-ink-800 text-white font-extrabold text-[0.78rem] sm:text-[0.86rem]">
                      {col.logo}
                    </span>
                  )}
                </div>

                {/* Nom */}
                <span
                  className={`text-[0.7rem] sm:text-[0.82rem] font-extrabold tracking-tight leading-tight ${
                    col.highlight ? "text-brand-700" : "text-ink-600"
                  }`}
                >
                  {col.name}
                </span>
              </div>
            ))}
          </div>

          {/* ─── Rows ─── */}
          <div className="relative divide-y divide-ink-100">
            {ROWS.map((row, rowIdx) => (
              <div
                key={row.feature}
                className="group grid grid-cols-[1fr_60px_60px_60px] sm:grid-cols-[1.5fr_1fr_1fr_1fr] gap-x-3 sm:gap-x-4 px-4 sm:px-7 py-4 sm:py-5 items-center hover:bg-brand-50/30 transition-colors"
              >
                {/* Feature label avec numéro */}
                <div className="min-w-0 pr-2 flex gap-3 sm:gap-4">
                  <span className="text-[0.62rem] font-extrabold tabular-nums text-ink-300 pt-0.5 tracking-wider hidden sm:inline">
                    {String(rowIdx + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <div className="font-extrabold text-ink-700 text-[0.86rem] sm:text-[0.95rem] tracking-tight leading-snug">
                      {row.feature}
                    </div>
                    <div className="text-[0.7rem] sm:text-[0.78rem] text-ink-400 mt-1 leading-snug">
                      {row.detail}
                    </div>
                  </div>
                </div>

                {/* Cells */}
                {row.cells.map((cell, colIndex) => (
                  <div key={colIndex} className="flex items-center justify-center">
                    <CellValue value={cell} isBisecco={colIndex === 0} />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* ─── Footer card · bandeau CTA cohérent DA ─── */}
          <div className="relative bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 px-5 sm:px-7 py-6 sm:py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 overflow-hidden">
            {/* Décor */}
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />

            <div className="relative text-white">
              <div className="font-extrabold text-[1rem] sm:text-[1.1rem] leading-tight tracking-tight">
                Aucun engagement, aucune carte bancaire.
              </div>
              <div className="text-[0.8rem] sm:text-[0.86rem] text-white/70 mt-1.5">
                Créez votre profil ou trouvez votre artisan en 2 minutes.
              </div>
            </div>

            <div className="relative">
              <CtaButton href="/inscription" variant="primary" size="md">
                Rejoindre Bisecco
              </CtaButton>
            </div>
          </div>
        </div>

        {/* ═══════ Légende + note ═══════ */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.72rem] text-ink-500">
          <div className="inline-flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Check size={11} strokeWidth={3} />
            </span>
            Inclus
          </div>
          <div className="inline-flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
              <Minus size={11} strokeWidth={3} />
            </span>
            Limité
          </div>
          <div className="inline-flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-ink-50 text-ink-400 border border-ink-100">
              <X size={11} strokeWidth={3} />
            </span>
            Non disponible
          </div>
        </div>

        <p className="mt-4 text-center text-[0.72rem] text-ink-400 max-w-3xl mx-auto leading-relaxed">
          Comparaison établie à partir des grilles tarifaires et CGV publiques des plateformes concernées.
          Les services évoluent · vérifiez auprès de chaque acteur avant tout engagement.
        </p>
      </div>
    </section>
  );
}
