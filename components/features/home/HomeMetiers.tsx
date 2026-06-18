import Link from "next/link";
import { ArrowRight, Briefcase, Sparkles, TrendingUp } from "lucide-react";
import { CtaButton } from "@/components/ui/CtaButton";

type Metier = {
  slug: string;
  name: string;
  emoji: string;
  description: string;
  trending?: boolean;
  isNew?: boolean;
};

const METIERS: Metier[] = [
  { slug: "plombier",                  name: "Plombier",                  emoji: "🔧", description: "Dépannage fuite d'eau, installation sanitaire, chauffe-eau et débouchage 24/7.", trending: true },
  { slug: "electricien",               name: "Électricien",               emoji: "⚡", description: "Installation, mise aux normes, dépannage tableau électrique et domotique certifiée.", trending: true },
  { slug: "macon",                     name: "Maçon",                     emoji: "🧱", description: "Construction neuve, extension, rénovation de murs et travaux de gros œuvre.", },
  { slug: "menuisier",                 name: "Menuisier",                 emoji: "🪵", description: "Pose de fenêtres, portes, parquet, agencement sur-mesure intérieur et extérieur.", },
  { slug: "peintre",                   name: "Peintre",                   emoji: "🎨", description: "Peinture intérieure et façade, enduits décoratifs, ravalement et papier peint.", },
  { slug: "couvreur",                  name: "Couvreur",                  emoji: "🏠", description: "Réfection de toiture, étanchéité, démoussage et isolation des combles par l'extérieur.", },
  { slug: "developpeur-informatique",  name: "Développeur informatique",  emoji: "💻", description: "Création de site web, application mobile, e-commerce et logiciel sur-mesure pour votre activité.", isNew: true },
  { slug: "carreleur",                 name: "Carreleur",                 emoji: "🔲", description: "Pose de carrelage, faïence, mosaïque, sol et mur, salle de bain et cuisine.", },
  { slug: "chauffagiste",              name: "Chauffagiste",              emoji: "🔥", description: "Installation et entretien de chaudière, pompe à chaleur et plancher chauffant.", trending: true },
  { slug: "serrurier",                 name: "Serrurier",                 emoji: "🔑", description: "Ouverture de porte, changement de serrure, blindage et dépannage en urgence 24/7.", },
  { slug: "boulanger",                 name: "Boulanger",                 emoji: "🥖", description: "Pain artisanal, baguette tradition, viennoiseries et pâtisseries faites maison.", },
  { slug: "boucher",                   name: "Boucher",                   emoji: "🥩", description: "Viandes de qualité, charcuterie maison, traiteur et conseils de cuisson sur-mesure.", },
];

export function HomeMetiers() {
  return (
    <section className="relative py-20 sm:py-28 bg-white overflow-hidden">
      {/* Décors */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[400px] rounded-full bg-brand-500/[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/[0.05] blur-[100px] pointer-events-none" />

      <div className="container-default relative">
        {/* Head */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
            <Briefcase size={11} strokeWidth={2.8} className="text-brand-500" />
            Métiers populaires
          </span>
          <h2 className="mt-5 text-[32px] lg:text-[38px] leading-[1.25] font-semibold text-ink-700 tracking-[-0.025em]">
            Trouvez le bon{" "}
            <span className="relative inline-block">
              <span className="text-brand-500 animate-gradient-flow" style={{ backgroundSize: "200% 100%" }}>
                métier
              </span>
              <span className="text-brand-500">.</span>
            </span>
          </h2>
          <p className="mt-5 text-[1rem] sm:text-[1.06rem] text-ink-500 leading-relaxed">
            Plus de <strong className="text-ink-700">189 métiers</strong> couverts, des professionnels
            <strong className="text-ink-700"> vérifiés SIREN</strong> dans toute la France.
          </p>
        </div>

        {/* Grid 2/3/4/6 colonnes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
          {METIERS.map((m) => (
            <Link
              key={m.slug}
              href={`/metiers/${m.slug}`}
              className="group relative bg-white rounded-2xl border border-ink-100 hover:border-brand-300 p-4 sm:p-5 transition-all hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(13,30,74,0.18)] overflow-hidden"
            >
              {/* Décor coin orange au hover */}
              <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-brand-500/[0.10] opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 pointer-events-none" />

              {/* Badge trending ou nouveau si applicable */}
              {m.isNew ? (
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[0.58rem] font-extrabold tracking-wider uppercase">
                  <Sparkles size={8} strokeWidth={2.6} />
                  Nouveau
                </span>
              ) : m.trending && (
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-[0.58rem] font-extrabold tracking-wider uppercase">
                  <TrendingUp size={8} strokeWidth={2.6} />
                  Hot
                </span>
              )}

              {/* Emoji icon dans cercle */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 text-2xl group-hover:scale-110 group-hover:bg-brand-100 group-hover:border-brand-200 transition-all duration-300" aria-hidden>
                {m.emoji}
              </div>

              {/* Nom + description */}
              <h3 className="mt-3 font-extrabold text-ink-700 text-[0.95rem] sm:text-[1rem] tracking-tight group-hover:text-brand-600 transition-colors">
                {m.name}
              </h3>
              <p className="text-[0.74rem] sm:text-[0.78rem] text-ink-400 mt-1 leading-snug line-clamp-2">{m.description}</p>

              {/* Flèche qui apparaît au hover */}
              <span className="absolute bottom-3 right-3 inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand-500 text-white opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-[0_4px_12px_rgba(240,122,47,0.4)]">
                <ArrowRight size={13} strokeWidth={2.6} />
              </span>
            </Link>
          ))}
        </div>

        {/* Voir tous les métiers */}
        <div className="mt-10 text-center">
          <CtaButton href="/metiers" variant="white" size="md">
            Voir plus de 189 métiers
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
