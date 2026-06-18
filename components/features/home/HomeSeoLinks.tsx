import Link from "next/link";
import { MapPin, Search } from "lucide-react";
import { METIERS_PRIORITAIRES } from "@/lib/seo/metiers-prioritaires";
import { VILLES_PRIORITAIRES } from "@/lib/seo/villes-prioritaires";

/**
 * Section bas-de-home pour le maillage interne SEO + UX.
 *
 * Liens vers les 500 pages programmatiques (métier × ville) :
 *   - Boost PageRank interne (chaque page reçoit plus de jus de la home)
 *   - UX : un visiteur peut trouver "plombier Cannes" en 1 clic
 *   - SEO : sémantique très claire pour Google sur la couverture du site
 *
 * Stratégie de rendu :
 *   - 10 métiers (top) × 6 villes phares = 60 liens directs
 *   - + Liens "Voir tous les XX à [ville]" et "Voir tous les [métier]"
 *   - Affichage compact en grille pour ne pas alourdir la page
 */
export function HomeSeoLinks() {
  // 6 villes phares en mise en avant
  const VILLES_PHARES = [
    "cannes",
    "nice",
    "antibes",
    "meaux",
    "paris",
    "argenteuil",
  ];

  const villesPhares = VILLES_PHARES
    .map((slug) => VILLES_PRIORITAIRES.find((v) => v.slug === slug))
    .filter((v): v is NonNullable<typeof v> => v !== undefined);

  return (
    <section className="relative bg-ink-50 py-16 sm:py-20 border-t border-ink-100">
      <div className="container-default">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.7rem] font-extrabold tracking-[0.14em] uppercase">
            <Search size={11} strokeWidth={2.8} />
            Trouvez votre professionnel
          </span>
          <h2 className="mt-5 text-[32px] sm:text-[40px] leading-[1.1] font-extrabold text-ink-700 tracking-[-0.025em]">
            <span className="block">Les professionnels <span className="text-brand-500">vérifiés SIREN</span></span>
            <span className="block">près de chez vous</span>
          </h2>
          <p className="mt-4 text-[0.96rem] sm:text-[1.05rem] text-ink-500 leading-relaxed">
            Cliquez sur votre métier dans votre ville pour voir les profils, tarifs et avis.
          </p>
        </div>

        {/* Grille : 1 colonne par ville phare */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {villesPhares.map((ville) => (
            <div
              key={ville.slug}
              className="bg-white rounded-2xl p-5 border border-ink-100 shadow-card"
            >
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-ink-100">
                <MapPin size={14} className="text-brand-500" />
                <span className="font-extrabold text-ink-700 text-sm">{ville.name}</span>
                <span className="text-[0.65rem] text-ink-400 ml-auto">{ville.postalCode}</span>
              </div>
              <ul className="space-y-1.5">
                {METIERS_PRIORITAIRES.slice(0, 6).map((metier) => (
                  <li key={metier.slug}>
                    <Link
                      href={`/metiers/${metier.slug}/${ville.slug}`}
                      className="text-xs text-ink-600 hover:text-brand-500 hover:underline font-medium block truncate"
                      title={`${metier.name} à ${ville.name}`}
                    >
                      {metier.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`/rechercher?ville=${ville.slug}`}
                className="block mt-3 pt-3 border-t border-ink-100 text-[0.7rem] font-extrabold text-brand-500 hover:underline"
              >
                Voir tous les pros →
              </Link>
            </div>
          ))}
        </div>

        {/* Bloc tous les métiers · pour le SEO ultra-complet */}
        <div className="mt-10 bg-white rounded-3xl p-8 border border-ink-100">
          <h3 className="text-base font-bold text-ink-700 mb-4">
            Métiers les plus recherchés
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {METIERS_PRIORITAIRES.map((metier) => (
              <Link
                key={metier.slug}
                href={`/metiers/${metier.slug}`}
                className="px-3 py-2 rounded-lg bg-ink-50 hover:bg-brand-50 text-xs font-semibold text-ink-700 hover:text-brand-700 transition text-center"
              >
                {metier.name}
              </Link>
            ))}
          </div>

          <h3 className="text-base font-bold text-ink-700 mt-8 mb-4">
            Villes couvertes par le réseau Bisecco
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {VILLES_PRIORITAIRES.map((v) => (
              <Link
                key={v.slug}
                href={`/rechercher?ville=${v.slug}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-ink-50 hover:bg-brand-50 text-[0.7rem] font-semibold text-ink-700 hover:text-brand-700 transition"
              >
                <MapPin size={9} />
                {v.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
