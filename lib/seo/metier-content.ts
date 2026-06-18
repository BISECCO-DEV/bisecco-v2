/**
 * Contenu enrichi unique par métier pour les pages /metiers/[slug].
 *
 * Problème SEO résolu : sans ce fichier, toutes les pages /metiers/* affichaient
 * le même texte template avec seulement le nom du métier substitué (thin content
 * programmatique, dégradé par le Helpful Content System de Google).
 *
 * Avec ce fichier, chaque métier listé ici a 200-300 mots uniques couvrant :
 * définition, prestations courantes, fourchettes de prix indicatives, conseils
 * pratiques, raisons de choisir un pro vérifié.
 *
 * Les métiers absents de cette table affichent un contenu générique de qualité
 * correcte (pas thin) mais moins ciblé. Priorité de l'enrichissement : top 10
 * volume de recherche.
 */

export type MetierContent = {
  /** Slug du métier (correspond à metiers.slug en DB). */
  slug: string;
  /** Définition courte du métier, citable par les AI (40-60 mots). */
  definition: string;
  /** Liste des prestations habituelles. */
  services: string[];
  /** Fourchette de prix moyens indicatifs en France. */
  prices: { label: string; range: string }[];
  /** 3-4 conseils pratiques pour bien choisir l'artisan. */
  tips: string[];
  /** Paragraphe SEO long (200+ mots) pour densité de contenu. */
  longContent: string;
};

export const METIER_CONTENT: Record<string, MetierContent> = {
  // ─────────────────── PLOMBIER ───────────────────
  "plombier": {
    slug: "plombier",
    definition:
      "Le plombier est le professionnel spécialisé dans l'installation, la réparation et la maintenance des systèmes d'eau, de gaz et de sanitaires d'un logement ou d'un bâtiment. Son intervention couvre aussi bien la pose neuve que le dépannage urgent (fuite, débouchage, chauffe-eau en panne).",
    services: [
      "Dépannage urgent (fuite, débouchage, robinetterie)",
      "Installation et remplacement de chauffe-eau (électrique, thermodynamique, gaz)",
      "Pose et rénovation de salle de bains complète",
      "Détection de fuite par caméra thermique",
      "Pose de WC suspendu, lavabo, baignoire, douche italienne",
      "Raccordement et entretien de chaudière gaz",
    ],
    prices: [
      { label: "Dépannage à l'heure", range: "60 à 90 €" },
      { label: "Débouchage canalisation", range: "150 à 300 €" },
      { label: "Pose chauffe-eau (hors fourniture)", range: "200 à 500 €" },
      { label: "Salle de bains complète", range: "3 500 à 12 000 €" },
    ],
    tips: [
      "Demandez systématiquement un devis écrit avant toute intervention non urgente.",
      "Vérifiez l'assurance décennale du plombier pour les gros travaux (canalisations enterrées, chauffage).",
      "Pour une intervention en urgence (nuit/week-end), le tarif majoré peut atteindre +50 à +100 %.",
      "Méfiez-vous des dépanneurs sans devis qui surfacturent : un pro Bisecco vérifié SIREN s'engage à un tarif transparent.",
    ],
    longContent:
      "Faire appel à un plombier qualifié est essentiel pour la durabilité de votre installation et la sécurité de votre logement. Une fuite mal réparée peut entraîner des dégâts d'eau coûteux (en moyenne 1 600 € de sinistre selon la FFA), tandis qu'un raccordement gaz défectueux représente un risque vital. Les plombiers présents sur Bisecco sont tous immatriculés au répertoire SIRENE de l'INSEE et leur statut est vérifié automatiquement à chaque connexion. Vous accédez à leur SIREN, leur année de création, leur zone d'intervention et l'historique de leurs avis clients vérifiés (impossibles à acheter sur Bisecco : seuls les particuliers ayant échangé via la messagerie peuvent noter). Pour les travaux dépassant 2 000 €, vérifiez la présence de l'assurance décennale, obligatoire pour les travaux de plomberie touchant à la structure (encastrement, raccordement enterré, modification de l'évacuation principale). Bisecco vous permet de comparer plusieurs devis gratuitement en 24 heures, sans engagement et sans commission.",
  },

  // ─────────────────── ÉLECTRICIEN ───────────────────
  "electricien": {
    slug: "electricien",
    definition:
      "L'électricien est le professionnel habilité à concevoir, installer et entretenir les installations électriques d'un logement, d'un local professionnel ou d'un bâtiment. Il intervient sur le tableau électrique, les circuits, l'éclairage, les prises, la domotique et la mise en conformité NF C 15-100.",
    services: [
      "Mise aux normes du tableau électrique (NF C 15-100)",
      "Installation et rénovation complète d'un logement",
      "Pose de prises, interrupteurs, points d'éclairage",
      "Installation domotique (volets, alarme, thermostat connecté)",
      "Borne de recharge véhicule électrique (IRVE)",
      "Diagnostic électrique obligatoire (vente ou location)",
    ],
    prices: [
      { label: "Tarif horaire moyen", range: "45 à 75 €" },
      { label: "Remplacement tableau électrique", range: "1 200 à 2 500 €" },
      { label: "Rénovation électrique 70 m²", range: "6 000 à 10 000 €" },
      { label: "Pose borne de recharge VE 7 kW", range: "1 000 à 1 800 €" },
    ],
    tips: [
      "Privilégiez un électricien titulaire de la qualification Qualifelec ou RGE pour bénéficier des aides MaPrimeRénov'.",
      "Pour la pose d'une borne de recharge, le pro doit être habilité IRVE.",
      "Une installation aux normes NF C 15-100 est obligatoire pour la vente d'un logement et pour les assurances.",
      "Méfiez-vous des devis sans détail des fournitures (marque, puissance, garantie).",
    ],
    longContent:
      "L'électricité est le poste de rénovation qui requiert le plus de rigueur réglementaire. Une installation non conforme peut entraîner refus d'assurance, non-vente du bien, voire incendie. Selon l'Observatoire National de la Sécurité Électrique, près d'un tiers des logements français ont au moins une non-conformité dangereuse. Les électriciens présents sur Bisecco sont vérifiés SIREN et nombre d'entre eux affichent leur qualification Qualifelec ou RGE QualiPV/QualiPAC, condition obligatoire pour vous faire bénéficier de MaPrimeRénov' sur les travaux d'efficacité énergétique (chauffage électrique, pompe à chaleur, borne de recharge). La mise aux normes complète d'un logement de 70 m² mobilise généralement 5 à 10 jours de chantier. Le pro doit ouvrir les saignées, remplacer le tableau, tirer de nouveaux câbles conformes (R'2V), poser un disjoncteur différentiel 30 mA par circuit, et obtenir l'attestation de conformité Consuel avant la mise en service ENEDIS. Sur Bisecco, vous demandez votre devis en 2 minutes, recevez plusieurs propositions sous 24 heures et négociez directement avec le professionnel, sans commission ni intermédiaire financier.",
  },

  // ─────────────────── MAÇON ───────────────────
  "macon": {
    slug: "macon",
    definition:
      "Le maçon est le professionnel du gros œuvre qui réalise les fondations, murs, dalles, escaliers et structures porteuses d'un bâtiment. Il intervient en construction neuve, en extension, en surélévation, en ouverture de mur porteur et en rénovation lourde de maçonnerie ancienne.",
    services: [
      "Construction de maison individuelle",
      "Extension et surélévation",
      "Ouverture de mur porteur (avec IPN)",
      "Pose de fondations et dalles béton",
      "Création d'un escalier béton",
      "Rénovation de pierre, parpaing, brique",
    ],
    prices: [
      { label: "Construction neuve au m²", range: "1 200 à 2 200 €" },
      { label: "Extension parpaing au m²", range: "1 500 à 2 500 €" },
      { label: "Ouverture mur porteur (IPN)", range: "2 500 à 6 000 €" },
      { label: "Dalle béton 30 m²", range: "1 500 à 3 500 €" },
    ],
    tips: [
      "Une ouverture de mur porteur nécessite l'étude d'un bureau d'études structure (BET) en amont, à intégrer au budget.",
      "Exigez l'attestation d'assurance décennale du maçon : c'est obligatoire et c'est votre seule protection sur 10 ans.",
      "Pour la construction neuve, le contrat de construction de maison individuelle (CCMI) est protecteur si le maçon est aussi constructeur.",
      "Demandez à voir des chantiers terminés similaires (photos et coordonnées d'anciens clients).",
    ],
    longContent:
      "La maçonnerie est le métier du gros œuvre, le squelette du bâtiment. Tout défaut d'exécution (fondations, mur porteur, dalle) a des conséquences graves sur la durabilité de la construction et peut coûter dix fois plus cher à corriger qu'à bien faire dès le départ. Un maçon professionnel doit obligatoirement avoir une assurance décennale qui couvre les vices structurels pendant 10 ans après la réception du chantier. Sur Bisecco, vous accédez au SIREN vérifié de chaque maçon, à son ancienneté d'activité (un signal de stabilité essentiel sur ce métier où le savoir-faire s'acquiert en années), à ses avis clients authentiques et aux photos de ses réalisations terminées. Pour une extension, comptez 6 à 9 mois entre le permis de construire (déposé dès 20 m² créés en zone urbaine, dès 5 m² parfois) et la livraison clés en mains. Pour une ouverture de mur porteur, le passage par un bureau d'études structure est non négociable : il calcule la dimension de l'IPN (poutre métallique) qui reprend la charge du mur supprimé. Demander 3 devis comparatifs sur Bisecco vous permet d'identifier les écarts anormaux (devis trop bas = risque de cache-misère ou de fournitures bas de gamme).",
  },

  // ─────────────────── MENUISIER ───────────────────
  "menuisier": {
    slug: "menuisier",
    definition:
      "Le menuisier est le professionnel spécialisé dans la fabrication et la pose d'ouvrages en bois ou matériaux dérivés : fenêtres, portes, escaliers, parquets, placards sur mesure, dressing, agencement intérieur. Il travaille aussi l'aluminium et le PVC selon les chantiers.",
    services: [
      "Pose de fenêtres bois, alu, PVC et mixte",
      "Pose de portes intérieures et d'entrée",
      "Création d'escalier sur mesure",
      "Aménagement de combles et placards",
      "Pose de parquet massif ou stratifié",
      "Cuisine et dressing sur mesure",
    ],
    prices: [
      { label: "Pose fenêtre PVC double vitrage", range: "350 à 700 €" },
      { label: "Pose fenêtre bois", range: "700 à 1 200 €" },
      { label: "Escalier bois sur mesure", range: "2 500 à 8 000 €" },
      { label: "Dressing sur mesure 3 m linéaires", range: "1 500 à 4 000 €" },
    ],
    tips: [
      "Pour les fenêtres, vérifiez le coefficient Uw (isolation thermique) : ≤ 1,3 W/m².K pour MaPrimeRénov'.",
      "Un menuisier RGE permet de bénéficier des aides à la rénovation énergétique.",
      "Demandez la garantie décennale pour la pose et la garantie biennale pour les équipements mobiles.",
      "Pour le sur-mesure, attention aux délais de fabrication : compter 6 à 10 semaines entre commande et pose.",
    ],
    longContent:
      "Le menuisier intervient sur des éléments à forte valeur ajoutée : les fenêtres représentent en moyenne 15 % des déperditions thermiques d'un logement et leur remplacement par du double ou triple vitrage performant est l'un des leviers les plus rentables de la rénovation énergétique. Pour bénéficier de MaPrimeRénov' (aide d'État jusqu'à 100 € par fenêtre pour les ménages modestes), votre menuisier doit être titulaire de la qualification RGE Qualibat 3211 ou équivalent. Sur Bisecco, vous accédez à des menuisiers vérifiés SIREN dont vous pouvez consulter le détail de la qualification dans leur profil. Pour le sur-mesure (escalier, dressing, cuisine équipée), le menuisier travaille sur plan personnalisé, ce qui justifie un coût supérieur à la pose de produits standards mais offre une finition adaptée au millimètre. Comptez généralement 8 semaines entre validation du devis et pose. Pour une rénovation complète des menuiseries d'une maison de 100 m² (10 fenêtres en moyenne), le budget se situe entre 8 000 et 18 000 € selon le matériau et le niveau d'isolation choisi. Demander plusieurs devis sur Bisecco vous permet de comparer non seulement les prix mais aussi les marques de menuiseries proposées (Schüco, K-Line, Internorm, etc.) et leurs garanties.",
  },

  // ─────────────────── PEINTRE ───────────────────
  "peintre": {
    slug: "peintre",
    definition:
      "Le peintre en bâtiment est le professionnel qui prépare et applique les revêtements de surface (peinture, enduit, papier peint, tapisserie, lasure) sur les murs, plafonds, façades, boiseries et menuiseries intérieures et extérieures d'un logement.",
    services: [
      "Peinture intérieure (murs, plafonds, boiseries)",
      "Pose de papier peint et toile de verre",
      "Ravalement de façade extérieure",
      "Préparation des supports (enduit, ponçage, rebouchage)",
      "Peinture spécifique (anti-humidité, anti-tag, intumescente)",
      "Décoration murale (effets, patines, fresques)",
    ],
    prices: [
      { label: "Peinture mur au m² (2 couches)", range: "25 à 40 €" },
      { label: "Peinture plafond au m²", range: "30 à 45 €" },
      { label: "Pièce 15 m² complète repeinte", range: "500 à 900 €" },
      { label: "Ravalement façade au m²", range: "30 à 100 €" },
    ],
    tips: [
      "Pour un appartement entier, négociez un forfait au m² plutôt qu'à l'heure : c'est généralement 15 à 25 % moins cher.",
      "Vérifiez que le devis inclut la préparation du support (ponçage, sous-couche), souvent oubliée.",
      "Une peinture acrylique de qualité (classe émission A+) dure 8 à 12 ans : ne sacrifiez pas le rapport qualité/prix sur cette ligne.",
      "Pour un ravalement, vérifiez si une déclaration préalable de travaux en mairie est nécessaire (cas fréquent en zone protégée).",
    ],
    longContent:
      "La peinture est l'un des chantiers les plus visibles d'une rénovation, et celui qui transforme le plus radicalement la perception d'un logement pour un budget modéré. Un travail soigné fait toute la différence : préparation minutieuse du support (rebouchage, enduit, ponçage), application de la sous-couche adaptée au mur, pose de 2 couches de peinture de qualité, soin des angles et raccords. Un peintre rapide qui zappe la préparation et applique une seule couche fine vous garantit un résultat décevant dans les 6 mois (cloquage, traces, blanchiment). Sur Bisecco, vous accédez aux portfolios visuels des peintres : photos avant/après de leurs chantiers terminés, ce qui vous permet de juger de la qualité de finition. Pour les chantiers extérieurs (ravalement de façade), la qualification RGE QualiPro Façade est un gage de sérieux. Un ravalement de façade complet d'une maison de 100 m² (90 m² de façade) coûte entre 3 500 et 9 000 € selon l'état de la façade et la technique employée (peinture, hydrofuge, enduit minéral). Comptez 1 à 2 semaines de chantier. Pour bien préparer votre demande de devis sur Bisecco, mesurez les surfaces à peindre (m² de mur et de plafond pour chaque pièce), précisez le nombre de couleurs souhaitées et joignez des photos de l'état actuel des murs : plus votre demande est précise, plus les devis reçus seront fiables et comparables.",
  },

  // ─────────────────── COUVREUR ───────────────────
  "couvreur": {
    slug: "couvreur",
    definition:
      "Le couvreur est le professionnel chargé de la pose, de l'entretien et de la réparation des toitures et de leurs accessoires (gouttières, faîtages, cheminées, zinguerie). Il travaille la tuile, l'ardoise, le zinc, le bac acier, le bardeau et garantit l'étanchéité de la toiture.",
    services: [
      "Réfection complète de toiture",
      "Remplacement de tuiles cassées ou ardoises",
      "Pose et réparation de gouttières",
      "Démoussage et traitement hydrofuge",
      "Isolation de toiture par l'extérieur (sarking)",
      "Pose de Velux et fenêtres de toit",
    ],
    prices: [
      { label: "Démoussage toiture", range: "10 à 20 €/m²" },
      { label: "Réfection toiture tuile", range: "80 à 150 €/m²" },
      { label: "Réfection toiture ardoise", range: "150 à 250 €/m²" },
      { label: "Remplacement gouttières", range: "40 à 90 €/m linéaire" },
    ],
    tips: [
      "Faites contrôler votre toiture tous les 10 ans : un entretien préventif coûte 10 à 20 fois moins cher qu'une réfection après infiltration.",
      "Un couvreur qualifié RGE Qualibat 3151 ou 3211 vous donne accès aux aides MaPrimeRénov' pour l'isolation par l'extérieur.",
      "L'assurance décennale est obligatoire pour toute intervention de couverture : exigez systématiquement l'attestation.",
      "Méfiez-vous du démarchage à domicile : les arnaques à la toiture sont fréquentes (faux contrôles, devis gonflés).",
    ],
    longContent:
      "La toiture est l'élément le plus exposé aux intempéries d'un bâtiment et celui qui demande la maintenance la plus rigoureuse. Une infiltration non détectée peut endommager la charpente (champignons, mérule), l'isolation, les plafonds, les murs et l'installation électrique. Le coût total d'un sinistre toiture moyen avoisine 8 000 € selon les statistiques d'assureurs. Investir dans un entretien régulier (démoussage tous les 10 ans, contrôle visuel annuel après tempête) prolonge la durée de vie de la toiture de 50 à 80 ans selon le matériau. Sur Bisecco, les couvreurs sont vérifiés SIREN et nombre d'entre eux affichent leur qualification Qualibat (3151 pour la couverture tuiles, 3171 pour zinguerie, 3231 pour isolation thermique des toitures inclinées). Pour une réfection complète, le chantier dure généralement 1 à 3 semaines selon la surface. Le couvreur dépose l'ancienne couverture, remplace les liteaux ou voliges abîmés, pose un écran sous-toiture HPV (Haute Perméabilité à la Vapeur) et reconstitue la couverture neuve. Si vous combinez réfection et isolation par l'extérieur (sarking), vous pouvez bénéficier de MaPrimeRénov' jusqu'à 75 €/m² sous conditions de ressources, ce qui rentabilise rapidement l'opération.",
  },

  // ─────────────────── CARRELEUR ───────────────────
  "carreleur": {
    slug: "carreleur",
    definition:
      "Le carreleur est le professionnel spécialisé dans la pose de carrelage, faïence, mosaïque et pierre naturelle sur sols et murs. Il intervient en construction neuve comme en rénovation, en intérieur (salle de bains, cuisine, séjour) comme en extérieur (terrasse, piscine, bord d'allée).",
    services: [
      "Pose de carrelage au sol (rectifié, grand format, mosaïque)",
      "Pose de faïence murale (cuisine, salle de bains)",
      "Pose de pierre naturelle (marbre, ardoise, travertin)",
      "Création de douche à l'italienne",
      "Pose de carrelage extérieur (terrasse, plage de piscine)",
      "Préparation de support (ragréage, étanchéité SEL)",
    ],
    prices: [
      { label: "Pose carrelage sol au m²", range: "35 à 60 €" },
      { label: "Pose faïence murale au m²", range: "40 à 70 €" },
      { label: "Pose grand format (60×60+)", range: "60 à 100 €/m²" },
      { label: "Douche à l'italienne complète", range: "1 500 à 4 000 €" },
    ],
    tips: [
      "Pour une douche à l'italienne, exigez le procédé SEL (Système d'Étanchéité Liquide) sous le carrelage : c'est la seule protection durable contre les infiltrations.",
      "Le format du carrelage influe fortement sur le coût de pose : un grand format (60×60 ou plus) demande un substrat parfaitement plan.",
      "Prévoyez 10 % de carrelage supplémentaire pour les chutes et casses (15 % pour une pose diagonale).",
      "La pose collée double encollage est obligatoire à partir du format 30×30 cm.",
    ],
    longContent:
      "Le carrelage est l'un des revêtements les plus durables et les plus polyvalents pour un logement : résistant à l'eau, facile d'entretien, durée de vie de 30 à 50 ans selon la qualité. Mais c'est aussi l'un des plus exigeants à poser correctement : un mauvais ragréage du support, une étanchéité bâclée dans une salle de bains, des joints mal calibrés peuvent compromettre durablement la finition et créer des infiltrations coûteuses à réparer. Sur Bisecco, les carreleurs vérifiés SIREN affichent leurs réalisations en photos, ce qui vous permet de juger de la régularité des joints, de l'alignement des carreaux, de la qualité des coupes (notamment autour des sanitaires et des angles). Pour une salle de bains complète avec douche à l'italienne, comptez 8 à 12 jours de chantier (préparation, étanchéité SEL, pose carrelage, joints, séchage). Une faïence murale standard coûte entre 40 et 70 €/m² posée hors fourniture, à doubler pour des matériaux haut de gamme (pierre naturelle, zellige, terrazzo). Demandez systématiquement le coût de la fourniture (faïence + colle + croisillons + joint) séparé du coût de la pose dans le devis : cela vous permet de comparer les professionnels à offre équivalente et éventuellement d'acheter vous-même les matériaux pour économiser.",
  },

  // ─────────────────── SERRURIER ───────────────────
  "serrurier": {
    slug: "serrurier",
    definition:
      "Le serrurier est le professionnel spécialisé dans la pose, la réparation et le dépannage des serrures, verrous, portes blindées et systèmes de fermeture. Il intervient en urgence en cas de perte de clé, claquement de porte ou tentative d'effraction, et en pose neuve pour la sécurisation d'un logement.",
    services: [
      "Ouverture de porte claquée sans destruction",
      "Remplacement de serrure 3, 5 ou 7 points",
      "Pose de porte blindée (A2P)",
      "Installation de cylindre haute sécurité",
      "Reproduction de clé sécurisée",
      "Mise en conformité après cambriolage (constat assurance)",
    ],
    prices: [
      { label: "Ouverture porte claquée jour", range: "80 à 150 €" },
      { label: "Ouverture porte fermée à clé", range: "150 à 250 €" },
      { label: "Remplacement serrure 3 points", range: "200 à 450 €" },
      { label: "Pose porte blindée A2P", range: "1 500 à 3 500 €" },
    ],
    tips: [
      "ATTENTION arnaques : les serruriers d'urgence trouvés sur les pubs Google sont souvent des intermédiaires qui surfacturent (devis à 800-1 500 € pour une ouverture simple). Sur Bisecco, vous accédez à des professionnels locaux vérifiés SIREN avec tarifs transparents.",
      "Exigez un devis écrit AVANT toute intervention, même en urgence : c'est obligatoire au-delà de 100 € (article L113-3 du Code de la consommation).",
      "Pour une porte d'entrée, choisissez une serrure certifiée A2P** (résistance 10 minutes à l'effraction) ou A2P*** (15 minutes).",
      "Après un cambriolage, demandez à votre serrurier une facture détaillée pour le constat d'assurance : c'est remboursable.",
    ],
    longContent:
      "La serrurerie de dépannage est malheureusement le métier le plus exposé aux arnaques en France, avec des situations d'urgence (porte claquée à 22h, perte de clé un dimanche) qui poussent à accepter n'importe quel tarif. La DGCCRF reçoit chaque année plusieurs milliers de plaintes pour facturation abusive (devis à 1 200 € pour 10 minutes d'intervention, pose forcée de matériel non demandé, remplacement de serrure sans nécessité). Le réflexe Bisecco vous protège : tous les serruriers présents sur la plateforme sont des professionnels locaux vérifiés SIREN, dont vous consultez les avis clients authentiques avant de les contacter, et qui s'engagent sur des tarifs transparents. Pour une ouverture de porte claquée, l'intervention dure 10 à 20 minutes et ne nécessite aucune destruction si elle est faite correctement (technique du film de radio, du crochet, de la carte). Un prix juste se situe entre 80 et 150 € en journée, 150 à 250 € en nuit/week-end. Tout devis qui dépasse ces fourchettes pour une simple ouverture est suspect. Pour la sécurisation d'un logement, privilégiez les serrures certifiées A2P (norme française d'assurance) : ce label garantit la résistance à l'effraction selon des tests standardisés. Une porte blindée A2P-BP3 résiste 15 minutes à un cambrioleur outillé, soit largement assez pour le décourager (la plupart abandonnent après 5 minutes).",
  },

  // ─────────────────── CHAUFFAGISTE ───────────────────
  "chauffagiste": {
    slug: "chauffagiste",
    definition:
      "Le chauffagiste est le professionnel spécialisé dans l'installation, l'entretien et le dépannage des systèmes de chauffage : chaudières gaz et fioul, pompes à chaleur, planchers chauffants, radiateurs, ballons d'eau chaude. Il assure aussi les contrôles d'étanchéité gaz obligatoires.",
    services: [
      "Installation chaudière gaz à condensation",
      "Remplacement par pompe à chaleur air/eau",
      "Pose de plancher chauffant hydraulique",
      "Entretien annuel chaudière (obligatoire)",
      "Dépannage urgence (chauffage en panne hiver)",
      "Installation poêle à granulés ou bois",
    ],
    prices: [
      { label: "Entretien annuel chaudière gaz", range: "100 à 180 €" },
      { label: "Installation chaudière gaz condensation", range: "3 500 à 6 000 €" },
      { label: "Pompe à chaleur air/eau (PAC)", range: "10 000 à 18 000 €" },
      { label: "Poêle à granulés posé", range: "4 000 à 8 000 €" },
    ],
    tips: [
      "Pour la pompe à chaleur, choisissez impérativement un chauffagiste RGE QualiPAC : c'est la condition obligatoire pour MaPrimeRénov' (jusqu'à 11 000 € d'aide).",
      "L'entretien annuel de chaudière gaz ou fioul est légalement obligatoire (article R224-41 du Code de l'environnement) : conservez l'attestation.",
      "Avant d'installer une PAC, faites réaliser un dimensionnement précis (calcul de déperdition) : une PAC sous-dimensionnée chauffe mal et surconsomme.",
      "Le crédit d'impôt et MaPrimeRénov' peuvent couvrir 30 à 70 % du coût d'une PAC selon vos revenus.",
    ],
    longContent:
      "Le chauffage représente en moyenne 66 % de la consommation énergétique d'un logement français (source ADEME). Le choix du système de chauffage et la qualité de son installation déterminent donc à la fois votre facture énergétique des 15 à 20 prochaines années et votre empreinte carbone. La transition vers les pompes à chaleur (subventionnée par MaPrimeRénov' jusqu'à 11 000 € pour les ménages très modestes) est l'un des leviers les plus rentables de la rénovation énergétique. Mais elle ne fonctionne que si l'installation est dimensionnée correctement : une PAC trop puissante cycle trop vite et s'use prématurément, une PAC sous-dimensionnée ne chauffe pas suffisamment et fait basculer la résistance d'appoint, ce qui annihile les économies d'énergie. Sur Bisecco, les chauffagistes vérifiés SIREN affichent leur qualification RGE QualiPAC (pompes à chaleur), QualiBois (bois énergie), QualiSol (solaire thermique) ou Qualigaz selon leur spécialité. Cette qualification est obligatoire pour vous faire bénéficier des aides d'État. Pour un remplacement de chaudière gaz par PAC air/eau, le chantier dure 3 à 5 jours et comprend : dépose de l'ancienne chaudière, pose de l'unité extérieure (groupe), pose de l'unité intérieure (module hydraulique + ballon tampon), raccordement au circuit chauffage existant, mise en route et formation. Comptez 12 000 à 18 000 € avant aides, ce qui peut descendre à 4 000-8 000 € reste à charge avec MaPrimeRénov' + CEE.",
  },

  // ─────────────────── COIFFEUR ───────────────────
  "coiffeur": {
    slug: "coiffeur",
    definition:
      "Le coiffeur est le professionnel diplômé du CAP métiers de la coiffure qui réalise coupes, colorations, mèches, balayages, brushings, soins capillaires et coiffures spéciales (mariée, soirée). Il intervient en salon, à domicile ou en mobile selon son mode d'exercice.",
    services: [
      "Coupe femme et homme",
      "Coloration (mèches, balayage, ombré, tie & dye)",
      "Brushing et coiffage spécial événement",
      "Soins capillaires (kératine, botox capillaire, gloss)",
      "Coupe enfant et bébé",
      "Coiffure à domicile",
    ],
    prices: [
      { label: "Coupe homme", range: "15 à 35 €" },
      { label: "Coupe femme", range: "30 à 70 €" },
      { label: "Coupe + couleur", range: "60 à 120 €" },
      { label: "Coupe + balayage + soin", range: "120 à 250 €" },
    ],
    tips: [
      "Pour une coloration importante, prévoyez un essai sur une mèche cachée 48h avant pour vérifier l'absence d'allergie.",
      "Un coiffeur titulaire du BP (Brevet Professionnel) a un niveau technique supérieur, notamment en couleur.",
      "Pour les coiffures de mariée, réservez 6 à 12 mois à l'avance et faites un essai 1 mois avant le jour J.",
      "Demandez systématiquement à voir le portfolio (Instagram, book photos) avant un changement majeur.",
    ],
    longContent:
      "Le coiffeur est l'un des professionnels avec lequel la relation de confiance est la plus importante : votre coupe et votre couleur impactent directement votre image au quotidien, et un résultat raté peut prendre des mois à se rattraper. Sur Bisecco, vous accédez aux portfolios des coiffeurs vérifiés SIREN, à leurs avis clients authentiques et à leurs spécialités (coupe femme courte, balayage, coloration végétale, coiffure homme barbier, coiffure de mariée). Cette transparence vous permet de choisir un pro dont l'esthétique correspond à vos attentes plutôt que de tester à l'aveugle. Pour la coloration, le métier a beaucoup évolué ces dernières années avec l'émergence des techniques de balayage californien, ombré hair, tie & dye, et des colorations végétales sans ammoniaque. Un coiffeur formé sur ces techniques facture généralement 20 à 40 % plus cher qu'un salon classique, mais le résultat dure 3 à 6 mois avant retouche au lieu de 6 semaines pour une coloration permanente. Si vous cherchez un coiffeur à domicile (pratique pour mariage, EHPAD, jeune maman, mobilité réduite), Bisecco vous permet de filtrer par mode d'exercice. Comptez 20 à 40 % de supplément par rapport au tarif salon pour le déplacement à domicile, mais aucun temps d'attente ni transport pour vous.",
  },
};

/** Retourne le contenu enrichi d'un métier, ou null si non défini. */
export function getMetierContent(slug: string): MetierContent | null {
  return METIER_CONTENT[slug.toLowerCase()] ?? null;
}
