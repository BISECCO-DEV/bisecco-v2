import {
  Hammer, TrendingUp, MessageSquare, BarChart3, ShieldCheck,
  Sparkles, CheckCircle2, Search,
} from "lucide-react";
import { CtaButton } from "@/components/ui/CtaButton";

type Benefit = {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  title: string;
  text: string;
  highlight: string;
  color: string;
};

const BENEFITS: Benefit[] = [
  {
    icon: TrendingUp,
    title: "0 % de commission",
    text: "Vous gardez 100 % de votre chiffre. Pas de prélèvement. Pas de frais cachés.",
    highlight: "100 % à vous",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: MessageSquare,
    title: "Messagerie directe",
    text: "Les particuliers vous écrivent en direct. Vous répondez quand vous voulez, comme vous voulez.",
    highlight: "Sans paywall",
    color: "from-brand-500 to-brand-600",
  },
  {
    icon: Search,
    title: "Profil SEO optimisé",
    text: "Une page par métier et par ville. Google vous trouve. Vos clients aussi.",
    highlight: "189 × 200 villes",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: BarChart3,
    title: "Statistiques en temps réel",
    text: "Visites, contacts, conversions. Vous voyez ce qui marche, vous ajustez.",
    highlight: "Dashboard live",
    color: "from-violet-500 to-violet-600",
  },
];

export function HomeArtisanPitch() {
  return (
    <section className="relative py-20 sm:py-28 bg-gradient-to-b from-ink-50 via-white to-ink-50 overflow-hidden">
      {/* Décors fond (style DA homepage clair) */}
      <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] rounded-full bg-brand-500/[0.06] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 -right-32 w-[500px] h-[500px] rounded-full bg-blue-500/[0.05] blur-[140px] pointer-events-none" />

      <div className="container-default relative">
        {/* ═══════ HEAD CENTRÉ · palette claire ═══════ */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
            <Hammer size={11} strokeWidth={2.8} className="text-brand-500" />
            Pour les professionnels
          </span>
          <h2 className="mt-5 text-[32px] lg:text-[38px] leading-[1.25] font-semibold text-ink-700 tracking-[-0.025em]">
            Vous êtes professionnel&nbsp;?<br />
            <span className="relative inline-block">
              <span className="text-brand-500">
                Voici ce qui change
              </span>
              <span className="text-brand-500">.</span>
            </span>
          </h2>
          <p className="mt-5 text-[0.96rem] sm:text-[1.06rem] text-ink-500 leading-relaxed">
            On a construit Bisecco <strong className="text-ink-700">pour vous</strong>. Sans commission,
            sans paywall, sans intermédiaire entre vous et vos clients.
          </p>
        </div>

        {/* ═══════ 4 BENEFITS · cards dark navy avec hex pattern dedans ═══════ */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="group relative h-full bg-[#0a1d44] rounded-2xl sm:rounded-3xl border border-white/10 hover:border-brand-400/50 p-5 sm:p-6 overflow-hidden transition-all hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-20px_rgba(13,30,74,0.5)] animate-reveal-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Pattern hexagones (intérieur de la carte) */}
                <div
                  className="absolute inset-0 opacity-[0.08] pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='84' height='96' viewBox='0 0 84 96'><path d='M42 0L84 24v48L42 96 0 72V24z' fill='none' stroke='%23ffffff' stroke-width='1.2'/></svg>")`,
                    backgroundSize: "60px 70px",
                  }}
                  aria-hidden
                />

                {/* Halo au hover */}
                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-brand-500/[0.25] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Icon badge */}
                <div className={`relative inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${b.color} text-white shadow-[0_8px_20px_-4px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.25)] group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 mb-4`}>
                  <Icon size={20} strokeWidth={2.2} />
                </div>

                {/* Title */}
                <h3 className="relative font-extrabold text-[1.08rem] text-white tracking-tight">
                  {b.title}
                </h3>

                {/* Highlight chip */}
                <span className="relative inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[0.62rem] font-bold tracking-[0.1em] uppercase">
                  <CheckCircle2 size={9} strokeWidth={3} />
                  {b.highlight}
                </span>

                {/* Description */}
                <p className="relative text-[0.86rem] text-white/70 mt-3 leading-relaxed">{b.text}</p>
              </div>
            );
          })}
        </div>

        {/* ═══════ CTA BANNER (inchangé · orange premium) ═══════ */}
        <div className="mt-12 sm:mt-14 relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-500 p-7 sm:p-9 text-white">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-ink-900/25 blur-3xl pointer-events-none" />

          <div className="relative grid md:grid-cols-[1fr_auto] items-center gap-5">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30 text-white text-[0.62rem] font-extrabold tracking-[0.14em] uppercase backdrop-blur-sm mb-3">
                <Sparkles size={9} strokeWidth={3} />
                Inscription gratuite
              </span>
              <h3 className="text-[1.5rem] sm:text-[1.85rem] font-extrabold tracking-tight leading-tight">
                Rejoignez <span className="underline decoration-2 underline-offset-4">nos professionnels</span> Bisecco.
              </h3>
              <p className="mt-2 text-white/90 text-[0.94rem] max-w-xl">
                Profil créé en 5 minutes · Vérification SIREN auto · Première demande reçue sous 48h.
              </p>

              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[0.78rem] text-white/85">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={11} strokeWidth={2.6} /> Sans carte bancaire
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={11} strokeWidth={2.6} /> Désinscription 1 clic
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={11} strokeWidth={2.6} /> 100 % gratuit à vie
                </span>
              </div>
            </div>

            <CtaButton href="/inscription" variant="dark" size="lg" icon={Hammer}>
              Créer mon profil
            </CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}
