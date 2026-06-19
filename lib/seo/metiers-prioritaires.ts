/**
 * Top 10 des métiers les plus recherchés en France pour les services à domicile.
 *
 * Source : croisement Google Keyword Planner + Ubersuggest + observations
 * des principales plateformes (Pages Jaunes, Travaux.com, StarOfService).
 *
 * Chaque métier porte des données SEO uniques :
 *   - slug : DOIT correspondre à un slug réel dans la table `metiers`
 *   - tarifMin / tarifMax : fourchette horaire indicative (utilisée dans le contenu)
 *   - urgence : si oui, on met en avant la dispo 24/7 (plombier, électricien, serrurier)
 *   - faq : 5 questions-réponses spécifiques au métier (Schema FAQPage)
 */

export type MetierPrioritaire = {
  slug: string;
  name: string;
  /** Description courte SEO-friendly */
  pitch: string;
  /** Fourchette de tarif horaire indicative en euros (min/max France) */
  tarifMin: number;
  tarifMax: number;
  /** Métier d'urgence (24/7) ? */
  urgence: boolean;
  /** Spécificités locales injectées dans les pages SEO programmatique */
  specificites: string[];
  /** FAQ pour le schema FAQPage (5 questions par métier) */
  faq: Array<{ question: string; answer: string }>;
};

export const METIERS_PRIORITAIRES: MetierPrioritaire[] = [
  // ═══════════ 1. PLOMBIER ═══════════
  {
    slug: "plombier",
    name: "Plombier",
    pitch:
      "Installation, dépannage et rénovation sanitaire. Le métier le plus recherché en service à domicile.",
    tarifMin: 45,
    tarifMax: 90,
    urgence: true,
    specificites: [
      "Dépannage fuite et urgences 24/7",
      "Installation chauffe-eau et chaudière",
      "Rénovation complète salle de bain",
      "Détection de fuite non destructive",
      "Pose et remplacement de robinetterie",
    ],
    faq: [
      {
        question: "Combien coûte une intervention de plombier ?",
        answer:
          "En France, un plombier facture entre 45€ et 90€ de l'heure selon la zone géographique. Le déplacement coûte 30 à 80€. Une fuite simple est généralement réglée en 1h. Une urgence en soirée ou le week-end est facturée 50 à 100% plus cher.",
      },
      {
        question: "Comment trouver un plombier en urgence ?",
        answer:
          "Sur Bisecco, tous nos plombiers sont vérifiés SIREN et beaucoup proposent un service d'urgence 24/7. Filtrez par disponibilité et contactez-les directement via la messagerie intégrée, sans intermédiaire.",
      },
      {
        question: "Quels travaux peut faire un plombier ?",
        answer:
          "Installation et entretien de canalisations, robinetterie, chauffe-eau, chaudière, sanitaires (WC, lavabo, douche, baignoire), raccordement machine à laver, détection de fuites, débouchage, ventilation VMC.",
      },
      {
        question: "Comment savoir si un plombier est qualifié ?",
        answer:
          "Vérifiez son numéro SIREN (consultable gratuitement sur societe.com), demandez sa carte d'assurance décennale, et regardez les avis clients. Sur Bisecco, tous les professionnels ont leur SIREN contrôlé automatiquement contre l'INSEE.",
      },
      {
        question: "Faut-il un devis pour des travaux de plomberie ?",
        answer:
          "Oui, dès 150€ de travaux le devis écrit est légalement obligatoire. Demandez toujours au moins 2 devis pour comparer. Sur Bisecco la demande de devis est gratuite et sans engagement.",
      },
    ],
  },

  // ═══════════ 2. ÉLECTRICIEN ═══════════
  {
    slug: "electricien",
    name: "Électricien",
    pitch: "Installation, mise aux normes et dépannage électrique. Indispensable et fortement recherché.",
    tarifMin: 40,
    tarifMax: 80,
    urgence: true,
    specificites: [
      "Mise aux normes NF C 15-100",
      "Installation tableau électrique",
      "Borne de recharge véhicule électrique IRVE",
      "Domotique et automatisation",
      "Dépannage panne secteur",
    ],
    faq: [
      {
        question: "Combien coûte un électricien à l'heure ?",
        answer:
          "Un électricien facture en moyenne 40 à 80€ de l'heure en France, déplacement non inclus (15 à 60€). Une mise aux normes complète d'un appartement coûte entre 80 et 120€ par m².",
      },
      {
        question: "Quand faire appel à un électricien qualifié ?",
        answer:
          "Pour toute intervention sur le tableau électrique, la mise aux normes (vente immobilière), l'installation de prises ou luminaires complexes, la pose d'une borne IRVE. Évitez le bricolage : un défaut électrique = 25% des incendies domestiques.",
      },
      {
        question: "Mon électricien doit-il être certifié ?",
        answer:
          "Pour les bornes de recharge VE il doit être qualifié IRVE. Pour la rénovation énergétique, RGE est obligatoire pour bénéficier des aides. Sur Bisecco, ces certifications sont visibles sur le profil de chaque pro.",
      },
      {
        question: "Que faire en cas de panne électrique générale ?",
        answer:
          "Vérifiez votre disjoncteur général, puis appelez un électricien en urgence. Si vous êtes en immeuble, contactez d'abord le syndic. Bisecco référence les électriciens disponibles 24/7 dans votre zone.",
      },
      {
        question: "Comment vérifier la qualification de mon électricien ?",
        answer:
          "Vérifiez son SIREN, sa carte d'assurance décennale obligatoire, son inscription Qualifelec ou Consuel selon les travaux. Sur Bisecco, le SIREN est contrôlé automatiquement à l'inscription.",
      },
    ],
  },

  // ═══════════ 3. MAÇON ═══════════
  {
    slug: "macon",
    name: "Maçon",
    pitch: "Gros œuvre, fondations, murs porteurs et extensions. Le pilier de la construction.",
    tarifMin: 40,
    tarifMax: 70,
    urgence: false,
    specificites: [
      "Construction murs porteurs et fondations",
      "Extension de maison et surélévation",
      "Création d'ouverture (porte, fenêtre)",
      "Restauration de bâti ancien en pierre",
      "Pose de parpaings, briques et carrelage de sol",
    ],
    faq: [
      {
        question: "Combien coûte un maçon par jour ?",
        answer:
          "Un maçon facture 40 à 70€ de l'heure ou 350 à 500€ par jour (8h). Pour un mur porteur, comptez 100 à 200€ par m². Une extension simple revient à 1 500 à 2 500€ par m².",
      },
      {
        question: "Faut-il un permis pour faire venir un maçon ?",
        answer:
          "Selon les travaux : pas de permis pour < 5m² ou rénovation simple. Déclaration préalable pour 5 à 20m² (40m² en zone urbaine). Permis de construire pour > 20m² (40m² en zone urbaine) ou modification de façade.",
      },
      {
        question: "Quels travaux fait un maçon ?",
        answer:
          "Fondations, dalles, murs en parpaing/brique/pierre, ouvertures (portes, fenêtres), extensions, surélévations, terrasses, piscines, restauration de murs anciens. C'est le métier du gros œuvre.",
      },
      {
        question: "Quelle assurance pour un maçon ?",
        answer:
          "L'assurance décennale est obligatoire (10 ans sur les ouvrages structurels). Demandez-lui systématiquement avant de signer. Sur Bisecco, c'est l'un des champs visibles sur tout profil pro.",
      },
      {
        question: "Comment choisir le bon maçon ?",
        answer:
          "3 critères : ancienneté du SIREN (au moins 3 ans pour les gros chantiers), avis vérifiés, visite d'un chantier en cours ou récent. Le moins cher des 3 devis n'est pas toujours le meilleur.",
      },
    ],
  },

  // ═══════════ 4. PEINTRE EN BÂTIMENT ═══════════
  {
    slug: "peintre-en-batiment",
    name: "Peintre en bâtiment",
    pitch: "Peinture intérieure, extérieure, revêtements muraux et finitions. Très recherché en rénovation.",
    tarifMin: 30,
    tarifMax: 50,
    urgence: false,
    specificites: [
      "Peinture intérieure mate, satinée, velours",
      "Ravalement de façade",
      "Pose papier peint et toile de verre",
      "Enduits décoratifs et techniques (chaux, béton ciré)",
      "Traitement humidité et anti-moisissures",
    ],
    faq: [
      {
        question: "Combien coûte un peintre au m² ?",
        answer:
          "En France, comptez 25 à 45€ par m² de murs peints (préparation, sous-couche, 2 couches finition). Plafond : 30 à 50€/m². Ravalement extérieur : 35 à 70€/m² selon le support et la finition.",
      },
      {
        question: "Quelle peinture choisir pour mon mur ?",
        answer:
          "Acrylique pour pièces sèches (chambres, salons). Glycéro ou hydro-glycéro pour pièces humides (cuisine, salle de bain). Mat pour les défauts du mur, satiné pour entretien facile, brillant pour les boiseries.",
      },
      {
        question: "Faut-il préparer les murs avant peinture ?",
        answer:
          "Oui, c'est 60% du résultat final. Reboucher fissures, poncer, dépoussiérer, appliquer une sous-couche. Un bon peintre prépare avant de peindre — fuyez ceux qui peignent directement sur l'ancien.",
      },
      {
        question: "Comment estimer mon devis peinture ?",
        answer:
          "Multipliez votre surface au sol par 2,5 pour avoir la surface de murs. Ajoutez 1× pour le plafond. Multipliez par 25€/m² (entrée de gamme) à 50€/m² (haut de gamme). Pour une chambre de 12m² : 1 000 à 2 500€.",
      },
      {
        question: "Quelle saison pour ravaler ma façade ?",
        answer:
          "Printemps et automne sont idéaux (températures 10-25°C, peu d'humidité). Évitez juillet-août (chaleur fissure les enduits) et décembre-février (gel + humidité). En Île-de-France, mai-juin et septembre-octobre sont les meilleures périodes.",
      },
    ],
  },

  // ═══════════ 5. MENUISIER ═══════════
  {
    slug: "menuisier",
    name: "Menuisier",
    pitch: "Création et pose de menuiseries bois, escaliers, parquets et agencement sur mesure.",
    tarifMin: 40,
    tarifMax: 80,
    urgence: false,
    specificites: [
      "Pose de fenêtres bois, alu, PVC",
      "Cuisine et dressing sur mesure",
      "Parquet massif et stratifié",
      "Escaliers en bois et rampes",
      "Portes intérieures et placards intégrés",
    ],
    faq: [
      {
        question: "Combien coûte un menuisier à l'heure ?",
        answer:
          "Un menuisier facture entre 40 et 80€ de l'heure. Pour de la pose, le tarif est souvent forfaitaire : 150 à 400€ par fenêtre, 100 à 300€ par porte, 30 à 80€/m² de parquet posé.",
      },
      {
        question: "Quelle différence entre menuisier et charpentier ?",
        answer:
          "Le menuisier travaille les ouvrages plus fins : portes, fenêtres, meubles, parquets, escaliers. Le charpentier réalise les structures lourdes : charpentes de toit, ossatures bois. Pour une extension, on a besoin des deux.",
      },
      {
        question: "Bois, PVC ou aluminium pour mes fenêtres ?",
        answer:
          "Bois : authentique, bonne isolation, entretien régulier. PVC : économique, sans entretien, isole bien. Alu : design moderne, durable, isolation moyenne (sauf rupture de pont thermique). Mixte alu/bois : haut de gamme.",
      },
      {
        question: "Faut-il être RGE pour changer mes fenêtres ?",
        answer:
          "Oui, pour bénéficier des aides (MaPrimeRénov', CEE, TVA 5,5%), votre menuisier doit être certifié RGE. Sur Bisecco, la certification RGE est mise en avant sur les profils des professionnels qui la possèdent.",
      },
      {
        question: "Faire faire un meuble sur mesure ou acheter en magasin ?",
        answer:
          "Sur mesure : adapté à l'espace, durable (15-30 ans), valorise le bien (+5% à la revente). Standard : moins cher (-30 à 60%), mais dimensions imposées et durée de vie 5-10 ans. Pour cuisine et dressing, le sur mesure se rentabilise vite.",
      },
    ],
  },

  // ═══════════ 6. COUVREUR ═══════════
  {
    slug: "couvreur",
    name: "Couvreur",
    pitch: "Toiture, charpente, étanchéité et zinguerie. Métier technique, fortement recherché.",
    tarifMin: 40,
    tarifMax: 75,
    urgence: true,
    specificites: [
      "Rénovation complète de toiture",
      "Pose tuiles, ardoises, zinc",
      "Démoussage et nettoyage de toit",
      "Réparation gouttières et descentes",
      "Étanchéité toiture-terrasse",
    ],
    faq: [
      {
        question: "Combien coûte une rénovation de toiture ?",
        answer:
          "Selon les matériaux : tuiles canal 80-130€/m², ardoises 150-250€/m², zinc 100-180€/m². Pour 100m² de toit, comptez 8 000 à 25 000€ tout compris (matériaux + main d'œuvre + démontage ancien).",
      },
      {
        question: "Quand refaire ma toiture ?",
        answer:
          "Tuiles : 50-70 ans. Ardoises : 80-100 ans. Zinc : 40-60 ans. Signes d'alerte : tuiles cassées/manquantes, mousses importantes, infiltrations, gouttières débordantes. Un diagnostic annuel après 30 ans est conseillé.",
      },
      {
        question: "Faut-il un couvreur en urgence après une tempête ?",
        answer:
          "Oui, dès que possible pour éviter les infiltrations qui détruisent l'isolation et la charpente. Photographiez les dégâts et appelez votre assurance + un couvreur de confiance. Bisecco référence les couvreurs disponibles 24/7.",
      },
      {
        question: "Faut-il une déclaration pour refaire ma toiture ?",
        answer:
          "Pour une réfection à l'identique : aucune déclaration. Pour un changement de matériau, couleur ou pente : déclaration préalable obligatoire en mairie. En zone protégée (ABF), accord obligatoire des Bâtiments de France.",
      },
      {
        question: "Démoussage : tous les combien de temps ?",
        answer:
          "Tous les 5 à 10 ans selon l'exposition. Toiture humide ou ombragée (fréquent en Île-de-France) : tous les 5 ans. Toiture bien exposée et dégagée : tous les 8-10 ans. Coût : 8 à 15€/m².",
      },
    ],
  },

  // ═══════════ 7. CARRELEUR ═══════════
  {
    slug: "carreleur",
    name: "Carreleur",
    pitch: "Pose de carrelage, faïence, mosaïque sol et mur. Cœur de la rénovation salle de bain et cuisine.",
    tarifMin: 35,
    tarifMax: 65,
    urgence: false,
    specificites: [
      "Pose carrelage grand format (60×60, 80×80, 120×60)",
      "Faïence murale salle de bain",
      "Préparation chape et ragréage",
      "Pose terrasse extérieure",
      "Réalisation joints et plinthes",
    ],
    faq: [
      {
        question: "Combien coûte la pose de carrelage au m² ?",
        answer:
          "Pose simple : 30 à 50€/m² (hors fourniture). Pose grand format ou diagonale : 50 à 80€/m². Préparation (ragréage, dépose ancien) : 15 à 30€/m² en supplément.",
      },
      {
        question: "Quel carrelage choisir pour ma salle de bain ?",
        answer:
          "Grès cérame antidérapant pour le sol (norme R10 minimum). Faïence ou grès cérame pour les murs. Format 30×60 ou 60×60 = tendance et faciles d'entretien. Évitez les très petits carreaux (joints difficiles à nettoyer).",
      },
      {
        question: "Pose droite ou diagonale ?",
        answer:
          "Pose droite : plus rapide, économique, recommandée pour petites pièces (agrandit visuellement). Pose diagonale : élégante, masque les défauts de la pièce, mais 15-30% plus chère et génère plus de chutes.",
      },
      {
        question: "Combien de temps prend une pose de carrelage ?",
        answer:
          "Sol salle de bain 5m² : 1 jour. Sol cuisine 15m² : 2 jours. Sol séjour 30m² : 3-4 jours. Plus le séchage (24-48h avant les joints, 48h supplémentaires avant utilisation). Prévoyez 1 semaine minimum.",
      },
      {
        question: "Carrelage ou parquet pour mon salon ?",
        answer:
          "Carrelage : durable (30+ ans), facile à nettoyer, compatible chauffage au sol, idéal en climat chaud (frais en été). Parquet : chaleureux, isolant, plus valorisant à la revente mais sensible à l'humidité et plus fragile.",
      },
    ],
  },

  // ═══════════ 8. SERRURIER ═══════════
  {
    slug: "serrurier",
    name: "Serrurier",
    pitch: "Ouverture de porte, remplacement de serrure, blindage et urgences 24/7. Très forte demande locale.",
    tarifMin: 60,
    tarifMax: 150,
    urgence: true,
    specificites: [
      "Ouverture de porte 24/7",
      "Pose serrure haute sécurité (A2P)",
      "Blindage de porte",
      "Reproduction de clé spéciale",
      "Coffre-fort et armoire forte",
    ],
    faq: [
      {
        question: "Combien coûte un serrurier en urgence ?",
        answer:
          "Une ouverture de porte simple : 80 à 200€ en journée, 150 à 400€ la nuit ou le dimanche. Remplacement complet de serrure : 200 à 500€ selon la marque. Méfiez-vous des annonces 'à partir de 39€' : c'est souvent du leurre.",
      },
      {
        question: "Que faire si je suis enfermé dehors ?",
        answer:
          "Vérifiez d'abord toutes les ouvertures (fenêtres, voisins, gardien). Si impossible : appelez UN seul serrurier vérifié (pas de pub Google sponsorisée, c'est souvent des arnaques). Sur Bisecco, tous nos serruriers sont SIREN vérifié.",
      },
      {
        question: "Comment éviter les arnaques serruriers ?",
        answer:
          "Évitez les annonces sponsorisées Google et les flyers boîte aux lettres. Demandez TOUJOURS un devis écrit avant intervention. Vérifiez le SIREN sur societe.com. Si on vous force la main : appelez la police.",
      },
      {
        question: "Quelle serrure pour ma porte d'entrée ?",
        answer:
          "Minimum : 3 points + cylindre A2P*. Idéal : 5 points + cylindre A2P** (résiste 10 minutes au crochetage). Marques recommandées : Vachette, Bricard, Picard, Fichet, Heracles. Comptez 200-600€ pose comprise.",
      },
      {
        question: "Faut-il blinder ma porte d'entrée ?",
        answer:
          "Oui si vous êtes au rez-de-chaussée, en zone à risque, ou si votre porte est en bois fin. Un blindage coûte 800 à 2 500€ et rend la porte 5 à 10× plus résistante à l'effraction. Souvent obligé par les assurances.",
      },
    ],
  },

  // ═══════════ 9. CHAUFFAGISTE ═══════════
  {
    slug: "chauffagiste",
    name: "Chauffagiste",
    pitch:
      "Installation, entretien et dépannage chaudière, pompe à chaleur, plancher chauffant. Marché en pleine transition énergétique.",
    tarifMin: 45,
    tarifMax: 90,
    urgence: true,
    specificites: [
      "Pompe à chaleur air/eau et air/air",
      "Chaudière gaz à condensation",
      "Plancher chauffant hydraulique",
      "Maintenance et entretien annuel",
      "Diagnostic et rénovation énergétique",
    ],
    faq: [
      {
        question: "Quel est le prix d'une pompe à chaleur ?",
        answer:
          "PAC air/air (climatisation réversible) : 5 000 à 12 000€. PAC air/eau : 10 000 à 18 000€. PAC géothermique : 15 000 à 30 000€. Aides : MaPrimeRénov' + CEE peuvent couvrir 30 à 60% du coût.",
      },
      {
        question: "Est-il obligatoire d'entretenir sa chaudière ?",
        answer:
          "Oui, légalement obligatoire chaque année pour les chaudières au gaz, fioul, bois (décret 2009-649). Coût : 100 à 200€ par an. Sans entretien, votre assurance ne couvre pas un sinistre.",
      },
      {
        question: "Chauffage gaz, électrique ou pompe à chaleur ?",
        answer:
          "Électrique : moins cher à installer, cher à l'usage (15 à 20€/m²/an). Gaz : équilibré (12 à 16€/m²/an), mais arrêt des aides en cours. PAC : investissement initial fort mais 4 à 6€/m²/an, sur 15-20 ans c'est le moins cher.",
      },
      {
        question: "Quelles aides pour changer mon chauffage ?",
        answer:
          "MaPrimeRénov' (2 000 à 11 000€ selon revenus), CEE (300 à 5 000€), TVA 5,5%, éco-PTZ (jusqu'à 50 000€). Cumul possible. Votre chauffagiste doit être RGE pour activer ces aides.",
      },
      {
        question: "Quand changer ma chaudière ?",
        answer:
          "Durée de vie moyenne : 15 à 20 ans (gaz), 25-30 ans (fioul). Signes : pannes fréquentes, consommation en hausse de +20%, classe énergétique D ou E. Anticipez avant la panne pour bénéficier des aides en saison creuse (été).",
      },
    ],
  },

  // ═══════════ 10. JARDINIER / PAYSAGISTE ═══════════
  {
    slug: "jardinier-artisanal",
    name: "Jardinier",
    pitch:
      "Entretien, élagage, aménagement de jardin et terrasse. Demande très forte dans les zones pavillonnaires d'Île-de-France.",
    tarifMin: 30,
    tarifMax: 55,
    urgence: false,
    specificites: [
      "Tonte et entretien régulier",
      "Élagage et abattage arbres",
      "Aménagement paysager complet",
      "Installation arrosage automatique",
      "Création terrasse bois et composite",
    ],
    faq: [
      {
        question: "Combien coûte un jardinier à l'heure ?",
        answer:
          "Entre 25 et 55€ de l'heure. Forfait tonte : 30 à 80€ pour < 500m², 60 à 150€ pour 500-2000m². Avec crédit d'impôt 50% (services à la personne), le coût réel est divisé par 2.",
      },
      {
        question: "Le crédit d'impôt s'applique-t-il à mon jardinier ?",
        answer:
          "Oui pour l'entretien régulier (tonte, taille, désherbage) dans la limite de 5 000€/an. Non pour les gros travaux d'aménagement. Votre jardinier doit être déclaré service à la personne (SAP) — visible sur son profil Bisecco.",
      },
      {
        question: "Quand élaguer mes arbres ?",
        answer:
          "Arbres caducs (chênes, érables, mûriers) : hiver, hors gel. Conifères (cyprès, pins, sapins) : fin d'été. Fruitiers : après récolte. Évitez le printemps (montée de sève). En Île-de-France : novembre à mars, hors épisodes de gel intense.",
      },
      {
        question: "Tonte de pelouse : quelle fréquence ?",
        answer:
          "Printemps-été (mars-octobre) : toutes les 1 à 2 semaines. Hiver : tonte généralement à l'arrêt de novembre à février. Hauteur de coupe : 4-5 cm en été (résistance à la sécheresse), 3 cm en automne.",
      },
      {
        question: "Aménager un jardin : par où commencer ?",
        answer:
          "1) Étude de votre sol et exposition. 2) Plan paysager (zones de vie, circulation). 3) Choix des plantes adaptées au climat. 4) Système d'arrosage. 5) Plantation. Comptez 30 à 100€/m² pour un aménagement complet selon le standing.",
      },
    ],
  },
];

/**
 * Récupère un métier prioritaire par son slug.
 */
export function getMetierPrioritaire(slug: string): MetierPrioritaire | null {
  return METIERS_PRIORITAIRES.find((m) => m.slug === slug) ?? null;
}

/**
 * Liste de tous les slugs prioritaires (pour generateStaticParams).
 */
export function getAllMetierPrioritaireSlugs(): string[] {
  return METIERS_PRIORITAIRES.map((m) => m.slug);
}
