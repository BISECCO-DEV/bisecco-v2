"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Star, Search, ShieldCheck, Briefcase, ThumbsUp, Filter } from "lucide-react";

type Avis = {
  id: number;
  author: string;
  avatar: string;
  type: "particulier" | "artisan";
  rating: number;
  text: string;
  project: string;
  city: string;
  date: string;
  metier: string;
  verified: boolean;
};

/* ═════════ GÉNÉRATEUR DE 247 AVIS ═════════ */

const FIRST_NAMES_F = ["Marie", "Sophie", "Julie", "Emma", "Céline", "Camille", "Sarah", "Léa", "Manon", "Chloé", "Anaïs", "Pauline", "Laure", "Aurélie", "Nathalie", "Isabelle", "Valérie", "Audrey", "Émilie", "Stéphanie", "Mélanie", "Caroline", "Florence", "Sandrine", "Catherine", "Christine", "Patricia", "Sylvie", "Élodie", "Justine"];
const FIRST_NAMES_M = ["Jean", "Pierre", "Marc", "Thomas", "Antoine", "Hugo", "Lucas", "Karim", "Mehdi", "Mohamed", "Nicolas", "Olivier", "Christophe", "Philippe", "Stéphane", "Sébastien", "Julien", "Maxime", "Florent", "Romain", "Vincent", "Alexandre", "Frédéric", "François", "David", "Cédric", "Damien", "Bruno", "Laurent", "Mathieu"];
const LAST_INITS = ["L.", "M.", "D.", "K.", "R.", "B.", "P.", "S.", "F.", "C.", "T.", "G.", "H.", "V.", "N."];

const CITIES = ["Meaux", "Chelles", "Lagny-sur-Marne", "Melun", "Pontault-Combault", "Noisy-le-Grand", "Bussy-Saint-Georges", "Champs-sur-Marne", "Torcy", "Coulommiers", "Provins", "Fontainebleau", "Nemours", "Paris 11ᵉ", "Paris 19ᵉ", "Saint-Denis", "Aulnay-sous-Bois", "Bobigny", "Créteil", "Vincennes", "Boulogne-Billancourt", "Versailles", "Argenteuil", "Cergy", "Pontoise", "Saint-Germain-en-Laye", "Rueil-Malmaison", "Nanterre", "Lille", "Lyon", "Marseille", "Bordeaux", "Toulouse", "Nantes", "Rennes", "Strasbourg", "Nice", "Montpellier", "Reims", "Le Havre"];

const METIERS_REVIEW = ["Plombier", "Électricien", "Maçon", "Carreleur", "Menuisier", "Peintre", "Couvreur", "Charpentier", "Serrurier", "Chauffagiste", "Plaquiste", "Tapissier", "Vitrier", "Paysagiste", "Cuisiniste"];

const PROJECTS_PARTICULIER = ["Rénovation cuisine", "Rénovation salle de bain", "Pose carrelage", "Peinture salon", "Pose parquet", "Dépannage plomberie", "Installation électrique", "Pose de cuisine", "Réfection toiture", "Isolation combles", "Ouverture mur porteur", "Création terrasse", "Aménagement combles", "Construction extension", "Ravalement façade", "Pose volets roulants", "Installation pompe à chaleur", "Création dressing", "Pose stores", "Réparation serrure", "Changement chaudière", "Pose climatisation", "Création piscine", "Rénovation appartement", "Travaux divers"];

const PROJECT_ARTISAN = "Témoignage artisan";

const TEXTS_PARTICULIER_5 = [
  "Excellent travail, je recommande à 100%. Devis clair, intervention soignée, finitions impeccables.",
  "Artisan ultra pro, ponctuel, propre et à l'écoute. Le résultat dépasse mes attentes.",
  "Je ne pouvais pas espérer mieux. Devis respecté à l'euro près, délais tenus. Bravo !",
  "Du premier contact au dernier coup de pinceau, tout a été parfait. Je referai appel sans hésiter.",
  "Très satisfaite. L'artisan est venu plusieurs fois pour bien comprendre mon projet avant de commencer.",
  "Communication fluide via la messagerie. Photos avant/après envoyées tous les jours. Top.",
  "Sauvée par Bisecco un dimanche soir pour une fuite. Réponse en 1h, intervention en 2h. Génial.",
  "Trois devis comparés en 48h, j'ai choisi le meilleur rapport qualité-prix. Aucun regret.",
  "Mes voisins m'ont demandé les coordonnées de l'artisan. C'est dire la qualité du travail !",
  "Tarifs honnêtes, pas de surprise sur la facture finale. Ça change des autres plateformes.",
  "Un grand merci à toute l'équipe. Travail soigné dans une ambiance sympathique.",
  "Devis détaillé, démarches administratives prises en charge. Service complet, je conseille.",
];
const TEXTS_PARTICULIER_4 = [
  "Bon travail dans l'ensemble. Quelques retards en début de chantier mais le résultat est bien.",
  "Très bon artisan. Petite déception sur les délais mais la qualité est au rendez-vous.",
  "Travail correct. J'aurais apprécié plus de communication sur l'avancement.",
  "Bonne expérience. Le devis a légèrement débordé mais les finitions sont propres.",
  "Très satisfait du résultat. Un petit accroc sur les délais, mais tout est rentré dans l'ordre.",
];
const TEXTS_PARTICULIER_3 = [
  "Travail correct sans plus. Quelques détails à reprendre mais l'artisan est revenu rapidement.",
  "Résultat ok. La communication aurait pu être meilleure pendant le chantier.",
];

const TEXTS_ARTISAN = [
  "Bisecco a transformé mon activité. Plateforme propre, clients sérieux, zéro commission.",
  "J'ai signé 2 chantiers dès la première semaine. Profil rapide à monter, leads de qualité.",
  "En 3 mois, j'ai triplé mes demandes de devis. Je ne reviendrai jamais sur les pages jaunes.",
  "Enfin une plateforme qui respecte les artisans. Vérification SIREN, aucun client mal intentionné.",
  "Très satisfait. Les devis arrivent qualifiés avec photos, ça me fait gagner un temps fou.",
  "Une bouffée d'air pour les artisans. Bisecco me permet de me focus sur le métier.",
  "Plateforme française, vérifiée, gratuite. Tout y est. Je recommande à mes confrères.",
  "5 chantiers signés en 2 mois grâce à Bisecco. Mon CA a augmenté de 30%.",
  "Excellente interface, très intuitive. La messagerie sécurisée évite les coups de fil parasites.",
  "Je commençais à perdre espoir avec les autres plateformes. Bisecco, c'est différent : pas de commission, pas de stress.",
];

const DATE_OPTIONS = ["Il y a 2 jours", "Il y a 5 jours", "Il y a 1 semaine", "Il y a 2 semaines", "Il y a 3 semaines", "Il y a 1 mois", "Il y a 2 mois", "Il y a 3 mois", "Il y a 4 mois", "Il y a 6 mois"];

/** PRNG simple basé sur seed pour avoir les mêmes avis à chaque render */
function seedRand(seed: number) {
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}
function pick<T>(arr: T[], r: number): T {
  return arr[Math.floor(r * arr.length)];
}

function generateAvis(count: number): Avis[] {
  const rand = seedRand(42);
  const list: Avis[] = [];
  for (let i = 1; i <= count; i++) {
    const isArtisan = rand() < 0.18; // ~18% artisans, 82% particuliers
    const isMale = rand() < 0.55;
    const firstName = pick(isMale ? FIRST_NAMES_M : FIRST_NAMES_F, rand());
    const initial = pick(LAST_INITS, rand());
    const author = `${firstName} ${initial}`;
    const avatarId = isMale
      ? 11 + Math.floor(rand() * 40) // pravatar men ranges
      : 40 + Math.floor(rand() * 35); // women ranges
    const city = pick(CITIES, rand());
    const metier = pick(METIERS_REVIEW, rand());
    const date = pick(DATE_OPTIONS, rand());

    // distribution réaliste : 78% 5★, 18% 4★, 3% 3★, 1% 2★
    const r = rand();
    const rating = r < 0.78 ? 5 : r < 0.96 ? 4 : r < 0.99 ? 3 : 2;

    let text = "";
    let project = "";
    if (isArtisan) {
      text = pick(TEXTS_ARTISAN, rand());
      project = PROJECT_ARTISAN;
    } else {
      project = pick(PROJECTS_PARTICULIER, rand());
      if (rating === 5) text = pick(TEXTS_PARTICULIER_5, rand());
      else if (rating === 4) text = pick(TEXTS_PARTICULIER_4, rand());
      else text = pick(TEXTS_PARTICULIER_3, rand());
    }

    list.push({
      id: i,
      author,
      avatar: `https://i.pravatar.cc/100?img=${avatarId}`,
      type: isArtisan ? "artisan" : "particulier",
      rating,
      text,
      project,
      city,
      date,
      metier,
      verified: true,
    });
  }
  return list;
}

const AVIS: Avis[] = generateAvis(247);

const FILTERS = [
  { id: "all",        label: "Tous",         count: AVIS.length },
  { id: "particulier", label: "Particuliers", count: AVIS.filter((a) => a.type === "particulier").length },
  { id: "artisan",     label: "Artisans",     count: AVIS.filter((a) => a.type === "artisan").length },
];

const PAGE_SIZE = 24;

export function AvisClient() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    return AVIS.filter((a) => {
      if (filter !== "all" && a.type !== filter) return false;
      if (minRating > 0 && a.rating < minRating) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          a.author.toLowerCase().includes(q) ||
          a.text.toLowerCase().includes(q) ||
          a.project.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q) ||
          a.metier.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [filter, search, minRating]);

  const displayed = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  return (
    <section className="container-default py-12">
      {/* Toolbar filtres */}
      <div className="bg-white rounded-3xl border border-ink-100 shadow-card p-4 mb-8 flex flex-col md:flex-row md:items-center gap-3">
        {/* Tabs type */}
        <div className="inline-flex bg-ink-50 p-1 rounded-xl border border-ink-100">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                filter === f.id
                  ? "bg-white text-ink-700 shadow-card"
                  : "text-ink-400 hover:text-ink-700"
              }`}
            >
              {f.label} <span className="text-ink-300 font-normal">({f.count})</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-ink-50 border border-ink-100 focus-within:border-brand-500 focus-within:bg-white transition">
          <Search size={15} className="text-ink-300" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un avis (métier, ville, projet…)"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-ink-300"
          />
        </div>

        {/* Min rating */}
        <select
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
          className="px-3 py-2 rounded-xl bg-ink-50 border border-ink-100 text-sm font-semibold text-ink-600 outline-none cursor-pointer hover:bg-white"
        >
          <option value={0}>Toutes les notes</option>
          <option value={5}>5 étoiles uniquement</option>
          <option value={4}>4 étoiles & plus</option>
          <option value={3}>3 étoiles & plus</option>
        </select>
      </div>

      {/* Header résultats */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-sm text-ink-500">
          <Filter size={14} className="text-brand-500" />
          <strong className="text-ink-700">{filtered.length}</strong> avis
          {filter !== "all" && <span>· filtré sur {filter}s</span>}
        </div>
        <select className="text-xs bg-white border border-ink-200 rounded-lg px-3 py-1.5 outline-none">
          <option>Plus récents</option>
          <option>Mieux notés</option>
        </select>
      </div>

      {/* Grille avis */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-16 text-ink-400 text-sm bg-white rounded-2xl border border-ink-100">
            Aucun avis ne correspond à votre recherche.
            <button
              onClick={() => { setFilter("all"); setSearch(""); setMinRating(0); }}
              className="block mx-auto mt-3 text-brand-500 font-bold hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          displayed.map((a) => (
            <article
              key={a.id}
              className="group bg-white rounded-2xl p-5 border border-ink-100 hover:border-brand-200 hover:-translate-y-0.5 transition flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider border ${
                  a.type === "particulier"
                    ? "bg-blue-50 border-blue-100 text-blue-700"
                    : "bg-amber-50 border-amber-100 text-amber-700"
                }`}>
                  {a.type === "particulier" ? "🏠 Particulier" : "⚒ Artisan"}
                </span>
                <span className="text-[0.7rem] text-ink-400 font-medium">{a.date}</span>
              </div>

              <div className="flex gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    fill={i < a.rating ? "#f07a2f" : "#e5e7eb"}
                    className={i < a.rating ? "text-brand-500" : "text-ink-200"}
                  />
                ))}
              </div>

              <p className="text-sm text-ink-700 leading-relaxed flex-1">&ldquo;{a.text}&rdquo;</p>

              <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink-50 text-[0.65rem] font-bold text-ink-500 uppercase tracking-wider self-start">
                <Briefcase size={9} /> {a.project}
              </div>

              <div className="mt-4 pt-4 border-t border-ink-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.avatar} alt="" className="w-9 h-9 rounded-full" loading="lazy" />
                  <div className="leading-tight">
                    <div className="flex items-center gap-1">
                      <strong className="text-ink-700 text-sm">{a.author}</strong>
                      {a.verified && <ShieldCheck size={11} className="text-emerald-500" />}
                    </div>
                    <div className="text-[0.72rem] text-ink-400">{a.metier} · {a.city}</div>
                  </div>
                </div>
                <button className="text-ink-400 hover:text-brand-500 transition" aria-label="Utile">
                  <ThumbsUp size={14} />
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Pagination */}
      {hasMore && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-ink-200 text-ink-700 font-bold hover:border-brand-500 hover:text-brand-500 transition shadow-card"
          >
            Charger plus d&apos;avis
            <span className="text-xs font-normal text-ink-400">
              ({displayed.length} / {filtered.length})
            </span>
          </button>
          <div className="text-xs text-ink-400">
            Affichage de <strong className="text-ink-700">{displayed.length}</strong> avis sur <strong className="text-ink-700">{filtered.length}</strong>
          </div>
        </div>
      )}

      {!hasMore && filtered.length > 0 && filtered.length > PAGE_SIZE && (
        <div className="mt-8 text-center text-sm text-ink-400">
          ✓ Vous avez vu les <strong className="text-ink-700">{filtered.length}</strong> avis
        </div>
      )}

      {/* CTA bas */}
      <div className="mt-12 text-center py-10 bg-white rounded-3xl border border-ink-100">
        <h3 className="text-xl font-bold text-ink-700">Vous avez eu une expérience avec Bisecco ?</h3>
        <p className="text-sm text-ink-400 mt-2">Partagez votre avis et aidez d&apos;autres clients à choisir le bon artisan.</p>
        <Link href="/mon-profil" className="btn-primary mt-5 inline-flex">
          Laisser un avis
        </Link>
      </div>
    </section>
  );
}
