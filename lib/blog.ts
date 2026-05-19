export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; author?: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  category: "Guide" | "Sécurité" | "Tendances" | "Conseils" | "Métiers" | "Législation";
  author: { name: string; avatar: string; role: string };
  date: string;
  dateIso: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
  content: ContentBlock[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "comment-trouver-un-bon-artisan",
    title: "Comment trouver un bon artisan en 2026 ? Le guide complet",
    excerpt:
      "Les 7 critères essentiels à vérifier avant de signer un devis. Notre méthode complète pour ne pas se tromper, comparer les pros et obtenir un travail de qualité au juste prix.",
    cover: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&h=900&fit=crop&q=80",
    category: "Guide",
    author: { name: "Laurent Nero", avatar: "https://i.pravatar.cc/100?img=33", role: "Fondateur Bisecco" },
    date: "15 mai 2026", dateIso: "2026-05-15",
    readTime: "6 min", tags: ["Devis", "SIREN", "Méthode"], featured: true,
    content: [
      { type: "p", text: "Trouver un artisan de confiance en 2026 reste un défi pour de nombreux particuliers. Entre les arnaques, les devis surprises et les artisans qui ne répondent jamais, voici notre guide pour réussir votre projet du premier coup." },
      { type: "h2", text: "1. Vérifier l'identité de l'artisan" },
      { type: "p", text: "Un artisan sérieux dispose obligatoirement d'un numéro SIREN à 9 chiffres. Vous pouvez le vérifier gratuitement sur le site officiel annuaire-entreprises.data.gouv.fr. Sur Bisecco, cette vérification est automatique pour tous les artisans inscrits via l'API Sirene de l'INSEE." },
      { type: "h2", text: "2. Lire les avis (les vrais)" },
      { type: "p", text: "Méfiez-vous des plateformes où les avis ne sont pas vérifiés. Privilégiez les sites qui ne permettent aux clients de laisser un avis qu'après une mise en relation réelle via la messagerie." },
      { type: "list", items: ["Vérification SIREN auprès de l'INSEE", "Avis clients authentiques (pas anonymes)", "Devis détaillé écrit", "Photos de chantiers passés", "Assurance décennale en cours", "Délai de réponse rapide (< 24h)", "Tarifs transparents et négociables"] },
      { type: "h2", text: "3. Demander plusieurs devis" },
      { type: "p", text: "Ne vous arrêtez jamais au premier devis. Comparez au moins 3 propositions pour comprendre la fourchette de prix du marché. Au-delà du prix, comparez aussi les délais d'intervention, les matériaux proposés et les garanties offertes." },
      { type: "quote", text: "J'ai économisé 600€ en comparant 3 devis pour ma salle de bain. Sans Bisecco, j'aurais signé le premier.", author: "Marie L., Meaux" },
      { type: "h2", text: "4. Vérifier les assurances" },
      { type: "p", text: "Un artisan du bâtiment doit avoir une assurance décennale (obligatoire) et une responsabilité civile professionnelle. Demandez systématiquement les attestations avant de signer le devis. Sans assurance décennale, vous n'avez aucun recours en cas de malfaçon dans les 10 ans qui suivent." },
      { type: "h2", text: "5. Regarder les certifications" },
      { type: "p", text: "Selon le métier, plusieurs labels qualité existent : RGE (Reconnu Garant de l'Environnement) pour la rénovation énergétique, Qualibat pour le bâtiment, Qualifelec pour l'électricité. Ces labels sont obligatoires pour bénéficier des aides MaPrimeRénov' et de l'éco-PTZ." },
      { type: "h3", text: "En résumé" },
      { type: "p", text: "Trouver un bon artisan n'est pas une question de chance, mais de méthode. Vérifiez l'identité, comparez les devis, lisez les avis et exigez la transparence. Sur Bisecco, tous ces critères sont automatiquement contrôlés pour vous." },
    ],
  },
  {
    slug: "verification-siren-artisan",
    title: "Pourquoi vérifier le SIREN d'un artisan est essentiel",
    excerpt:
      "Le numéro SIREN est la garantie légale qu'un artisan est bien déclaré. Voici comment le vérifier en 30 secondes sur les outils officiels gouvernementaux.",
    cover: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&h=900&fit=crop&q=80",
    category: "Sécurité",
    author: { name: "Marie Dubois", avatar: "https://i.pravatar.cc/100?img=47", role: "Responsable qualité" },
    date: "10 mai 2026", dateIso: "2026-05-10",
    readTime: "4 min", tags: ["SIREN", "INSEE", "Vérification"],
    content: [
      { type: "p", text: "Le numéro SIREN (Système d'Identification du Répertoire des Entreprises) est un identifiant unique à 9 chiffres attribué à chaque entreprise française par l'INSEE lors de son immatriculation. C'est la première garantie qu'un artisan est légalement déclaré." },
      { type: "h2", text: "Qu'est-ce que le SIREN exactement ?" },
      { type: "p", text: "Le SIREN identifie l'entreprise dans son ensemble. Il ne change jamais, même si l'entreprise déménage ou modifie son nom. Il est inscrit sur tous les documents officiels : devis, factures, statuts, contrats. Tout artisan exerçant en France métropolitaine ou DOM-TOM doit en avoir un." },
      { type: "h2", text: "Pourquoi cette vérification est-elle critique ?" },
      { type: "p", text: "Faire appel à un artisan non déclaré (travail au noir) vous expose à plusieurs risques majeurs :" },
      { type: "list", items: ["Aucune assurance décennale possible (illégalement souscrite)", "Aucun recours en cas de malfaçon", "Refus d'indemnisation par votre assurance habitation", "Perte des aides MaPrimeRénov' et crédits d'impôt", "Risque de redressement fiscal", "Amende pouvant atteindre 7 500 € pour vous"] },
      { type: "h2", text: "Comment vérifier un SIREN en 30 secondes" },
      { type: "p", text: "Rendez-vous sur annuaire-entreprises.data.gouv.fr, le site officiel du gouvernement. Saisissez le SIREN à 9 chiffres ou le nom de l'entreprise. Vous obtenez immédiatement : date de création, statut juridique, code APE, adresse du siège, état administratif (actif ou cessé)." },
      { type: "quote", text: "Vérifier un SIREN prend 30 secondes. Ne pas le faire peut coûter des milliers d'euros." },
      { type: "h2", text: "Le critère « actif » est crucial" },
      { type: "p", text: "Attention à une confusion fréquente : un SIREN peut exister sans que l'entreprise soit en activité. Vérifiez précisément le champ « État administratif » : il doit indiquer « Active » et non « Cessée ». Un artisan en cessation d'activité n'est plus assuré." },
      { type: "h3", text: "Sur Bisecco, c'est automatique" },
      { type: "p", text: "Chaque artisan inscrit sur Bisecco voit son SIREN contrôlé automatiquement via l'API Sirene de l'INSEE. Le statut actif est vérifié en temps réel et le badge « SIREN vérifié » apparaît sur le profil. Vous gagnez du temps et de la sérénité." },
    ],
  },
  {
    slug: "tendances-renovation-2026",
    title: "Les 8 tendances rénovation à connaître en 2026",
    excerpt:
      "De la rénovation énergétique RE2020 aux matériaux biosourcés, en passant par la domotique et les pompes à chaleur. Le panorama complet du marché.",
    cover: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=1600&h=900&fit=crop&q=80",
    category: "Tendances",
    author: { name: "Pierre Martin", avatar: "https://i.pravatar.cc/100?img=12", role: "Expert rénovation" },
    date: "5 mai 2026", dateIso: "2026-05-05",
    readTime: "8 min", tags: ["Rénovation", "RE2020", "MaPrimeRénov'"],
    content: [
      { type: "p", text: "Le marché de la rénovation explose en 2026, porté par les obligations RE2020, la fin progressive des passoires thermiques et les nouvelles aides MaPrimeRénov'. Voici les 8 tendances qui dominent l'année." },
      { type: "h2", text: "1. La rénovation énergétique globale" },
      { type: "p", text: "Fini les rénovations « pièce par pièce ». Les particuliers font désormais des rénovations globales (isolation + chauffage + ventilation) pour atteindre la classe énergétique B ou C, condition pour louer après 2028 (loi Climat & Résilience)." },
      { type: "h2", text: "2. Les pompes à chaleur en force" },
      { type: "p", text: "Avec la fin programmée des chaudières au fioul (interdites depuis 2022) et au gaz (en discussion), les pompes à chaleur air/eau et géothermiques se généralisent. Aidées jusqu'à 11 000 € par MaPrimeRénov'." },
      { type: "h2", text: "3. Les matériaux biosourcés" },
      { type: "p", text: "Chanvre, ouate de cellulose, fibre de bois, liège : les isolants biosourcés gagnent du terrain face à la laine de verre. Meilleurs en confort d'été, plus écologiques, ils bénéficient d'un bonus dans MaPrimeRénov'." },
      { type: "h2", text: "4. La domotique accessible" },
      { type: "p", text: "Thermostats connectés, volets motorisés, éclairage intelligent : la domotique devient abordable. Compter 1 500-3 000 € pour équiper un logement et économiser 15-25 % d'énergie." },
      { type: "h2", text: "5. Le retour des artisans locaux" },
      { type: "p", text: "Après plusieurs années d'envolée des plateformes nationales, les particuliers reviennent vers les artisans locaux. Réputation, confiance, proximité, et tarifs souvent plus compétitifs." },
      { type: "list", items: ["6. Cuisines XXL en open-space avec îlot central", "7. Salles de bain spa avec douche italienne + balnéo", "8. Façades végétalisées pour climat urbain"] },
      { type: "h3", text: "Quel budget prévoir ?" },
      { type: "p", text: "Pour une rénovation énergétique complète d'une maison de 100 m² : 40 000 à 80 000 € selon l'état initial. Après aides, le reste à charge se situe entre 20 000 et 50 000 €. Demandez plusieurs devis sur Bisecco pour comparer." },
    ],
  },
  {
    slug: "assurance-decennale-artisan",
    title: "Assurance décennale : ce qu'elle couvre vraiment",
    excerpt:
      "Obligatoire pour tout artisan du bâtiment, l'assurance décennale protège le client pendant 10 ans. On vous explique le détail des garanties.",
    cover: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&h=900&fit=crop&q=80",
    category: "Législation",
    author: { name: "Sophie Lambert", avatar: "https://i.pravatar.cc/100?img=29", role: "Juriste BTP" },
    date: "28 avril 2026", dateIso: "2026-04-28",
    readTime: "7 min", tags: ["Assurance", "Décennale", "Loi Spinetta"],
    content: [
      { type: "p", text: "L'assurance décennale est l'une des assurances les plus protectrices du droit français pour les particuliers qui font des travaux. Issue de la loi Spinetta de 1978, elle est obligatoire pour tout artisan du bâtiment et couvre vos travaux pendant 10 ans." },
      { type: "h2", text: "Qui doit la souscrire ?" },
      { type: "p", text: "Tout artisan réalisant des travaux de construction ou de rénovation lourde : maçon, plombier, électricien, chauffagiste, couvreur, menuisier, peintre (sur certains travaux). En revanche, elle n'est pas obligatoire pour les travaux purement esthétiques sans impact structurel." },
      { type: "h2", text: "Ce qu'elle couvre" },
      { type: "p", text: "L'assurance décennale couvre les dommages qui compromettent la solidité de l'ouvrage ou le rendent impropre à sa destination. Concrètement :" },
      { type: "list", items: ["Fissures importantes dans les murs porteurs", "Infiltrations d'eau par la toiture", "Affaissement du plancher", "Défauts d'isolation rendant le logement inhabitable", "Problèmes électriques générant un risque incendie", "Effondrement partiel ou total"] },
      { type: "h2", text: "Ce qu'elle ne couvre pas" },
      { type: "p", text: "Attention, la décennale a des limites : usure normale, défauts esthétiques (rayures, taches), dommages causés par défaut d'entretien, ou travaux réalisés sans permis. Pour ces cas, c'est la garantie biennale (2 ans) ou la garantie de parfait achèvement (1 an) qui s'applique." },
      { type: "quote", text: "Sans attestation décennale, ne signez aucun devis. C'est votre seule protection en cas de gros pépin pendant 10 ans." },
      { type: "h2", text: "Comment vérifier qu'un artisan en a une" },
      { type: "p", text: "Demandez l'attestation d'assurance décennale en cours de validité avant signature. Vérifiez : nom de l'artisan, dates de couverture, activités couvertes (doivent correspondre à votre chantier), nom de l'assureur. Un artisan refusant de la fournir est un signal d'alarme majeur." },
      { type: "h3", text: "Que faire en cas de sinistre ?" },
      { type: "p", text: "Déclarez le sinistre à votre assurance habitation (Dommages-Ouvrage si vous l'avez souscrite) et à l'assurance décennale de l'artisan dans les meilleurs délais. La procédure peut prendre plusieurs mois mais aboutit dans la grande majorité des cas." },
    ],
  },
  {
    slug: "devis-pieges-eviter",
    title: "Devis travaux : les 5 pièges à éviter absolument",
    excerpt:
      "Devis ambigu, sous-traitance cachée, matériaux non spécifiés… Les pratiques douteuses existent. Notre check-list pour signer en sécurité.",
    cover: "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=1600&h=900&fit=crop&q=80",
    category: "Conseils",
    author: { name: "Thomas Roux", avatar: "https://i.pravatar.cc/100?img=8", role: "Médiateur travaux" },
    date: "22 avril 2026", dateIso: "2026-04-22",
    readTime: "5 min", tags: ["Devis", "Pièges", "Négociation"],
    content: [
      { type: "p", text: "Un devis travaux est un contrat. Mal rédigé, il peut vous coûter cher. Voici les 5 pièges les plus fréquents et comment les éviter, par un médiateur travaux qui voit passer des centaines de litiges par an." },
      { type: "h2", text: "1. Le devis trop vague" },
      { type: "p", text: "« Rénovation salle de bain : 8 500 € ». Stop. Un devis doit détailler ligne par ligne : main d'œuvre, matériaux (marque + référence), surface, durée. Sans détail, impossible de contester en cas de dérive du chantier." },
      { type: "h2", text: "2. Les matériaux non spécifiés" },
      { type: "p", text: "« Carrelage 30x30 cm : 850 € ». Quelle marque ? Quel modèle ? Quelle qualité ? L'artisan peut très bien partir sur de l'entrée de gamme alors que vous imaginiez du milieu de gamme. Exigez toujours la référence exacte avec photo si possible." },
      { type: "h2", text: "3. La sous-traitance cachée" },
      { type: "p", text: "Vous signez avec un artisan, et le chantier est réalisé par un sous-traitant inconnu. Légalement, c'est autorisé, mais le devis doit le mentionner. Un sous-traitant non déclaré = pas d'assurance décennale pour lui = aucune protection pour vous." },
      { type: "list", items: ["Exigez les noms des intervenants", "Vérifiez leur SIREN", "Demandez leurs attestations décennales", "Refusez les sous-traitants en cascade"] },
      { type: "h2", text: "4. Le « hors devis » qui dérape" },
      { type: "p", text: "En cours de chantier, l'artisan trouve des « surprises » et propose des suppléments. Stop. Tout supplément doit faire l'objet d'un avenant écrit et signé AVANT exécution. Sans signature préalable, vous pouvez refuser le paiement." },
      { type: "quote", text: "Sur 100 litiges travaux, 80 concernent des suppléments non signés par écrit. La règle d'or : si ce n'est pas écrit, ce n'est pas dû." },
      { type: "h2", text: "5. L'acompte excessif" },
      { type: "p", text: "Méfiez-vous des artisans demandant 50 % ou plus d'acompte. Légalement, rien n'interdit, mais la norme est 30 % à la signature, 30 % au démarrage, 30 % à mi-chantier, 10 % à la réception après levée des réserves." },
      { type: "h3", text: "Notre conseil final" },
      { type: "p", text: "Avant de signer, prenez 24h de réflexion (c'est votre droit). Comparez avec d'autres devis. Et si le doute persiste, demandez l'avis d'un médiateur ou d'une association de consommateurs (CLCV, UFC-Que Choisir)." },
    ],
  },
  {
    slug: "metier-boulanger-artisanal",
    title: "Boulanger artisanal : un métier en pleine renaissance",
    excerpt:
      "Pourquoi le métier de boulanger attire à nouveau ? Témoignages d'artisans, parcours, formation, rémunération. Le portrait complet d'une filière qui recrute.",
    cover: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1600&h=900&fit=crop&q=80",
    category: "Métiers",
    author: { name: "Camille Bernard", avatar: "https://i.pravatar.cc/100?img=44", role: "Journaliste" },
    date: "15 avril 2026", dateIso: "2026-04-15",
    readTime: "9 min", tags: ["Boulanger", "Reconversion", "Formation"],
    content: [
      { type: "p", text: "Le métier de boulanger artisanal vit une véritable renaissance en France. Après des années de déclin face à la grande distribution, les fournils indépendants se multiplient, portés par une nouvelle génération passionnée et un public en quête d'authenticité." },
      { type: "h2", text: "Un secteur qui recrute massivement" },
      { type: "p", text: "Selon la Confédération Nationale de la Boulangerie-Pâtisserie Française, 3 500 postes sont à pourvoir chaque année en boulangerie artisanale. Le secteur compte plus de 33 000 entreprises en France, employant 180 000 personnes." },
      { type: "h2", text: "La formation : du CAP au BM" },
      { type: "p", text: "Plusieurs voies existent pour devenir boulanger :" },
      { type: "list", items: ["CAP Boulanger (2 ans après la 3e, en CFA ou lycée pro)", "Bac pro Boulanger-Pâtissier (3 ans)", "Mention Complémentaire Boulangerie Spécialisée (1 an post-CAP)", "Brevet de Maîtrise (BM) pour ouvrir sa boulangerie"] },
      { type: "h2", text: "Reconversion : pourquoi tant de cadres se lancent ?" },
      { type: "p", text: "30 % des nouvelles installations en boulangerie sont aujourd'hui le fait de personnes en reconversion : anciens ingénieurs, cadres, enseignants. Recherche de sens, contact humain, fierté du fait-main, autonomie professionnelle." },
      { type: "quote", text: "J'étais consultant en stratégie. À 38 ans, j'ai vendu mon appartement parisien pour ouvrir un fournil dans les Vosges. Je travaille 70h/semaine mais je n'ai jamais été aussi heureux.", author: "Thomas, 41 ans" },
      { type: "h2", text: "Quels revenus pour un boulanger ?" },
      { type: "p", text: "Salarié débutant : 1 800-2 200 € net/mois (avec primes de fin d'année). Ouvrier qualifié : 2 200-2 800 € net. Chef boulanger : 2 800-3 500 €. À son compte, un boulanger artisan peut viser 3 500 à 6 000 € net mensuel selon la zone et le savoir-faire, mais avec des charges et investissements importants." },
      { type: "h2", text: "Les défis du métier" },
      { type: "p", text: "Le métier reste exigeant : levée à 3h-4h du matin, station debout 8-10h/jour, chaleur des fours, manutention. Mais la flexibilité des horaires d'apprentissage et les outils modernes (pétrins, fermentation contrôlée) rendent le métier plus accessible." },
      { type: "h3", text: "Vous voulez vous former ou recruter ?" },
      { type: "p", text: "Bisecco met en relation apprentis et boulangers cherchant à transmettre leur savoir-faire. Inscription gratuite, profil vérifié SIREN, contact direct sans commission." },
    ],
  },
  {
    slug: "rge-maprimerenov-2026",
    title: "MaPrimeRénov' 2026 : tout ce qui change",
    excerpt:
      "Nouvelle gouvernance, montants revus, conditions de cumul… Le décryptage complet du nouveau dispositif d'aide à la rénovation énergétique.",
    cover: "https://images.unsplash.com/photo-1623288875253-1ce1ca0c3326?w=1600&h=900&fit=crop&q=80",
    category: "Législation",
    author: { name: "Julie Faure", avatar: "https://i.pravatar.cc/100?img=20", role: "Conseillère France Rénov'" },
    date: "8 avril 2026", dateIso: "2026-04-08",
    readTime: "10 min", tags: ["MaPrimeRénov'", "RGE", "Aides"],
    content: [
      { type: "p", text: "MaPrimeRénov', le principal dispositif d'aide à la rénovation énergétique en France, a été profondément refondu en 2026. Voici l'essentiel à savoir pour ne rien rater des nouvelles règles." },
      { type: "h2", text: "Les deux parcours" },
      { type: "p", text: "MaPrimeRénov' propose désormais 2 parcours bien distincts : le parcours « par geste » pour les travaux ponctuels (changement de chauffage, isolation des combles), et le parcours « rénovation d'ampleur » pour les rénovations globales avec accompagnement obligatoire par un Mon Accompagnateur Rénov'." },
      { type: "h2", text: "Les montants 2026" },
      { type: "p", text: "Les barèmes restent indexés sur 4 catégories de revenus : Bleu (très modestes), Jaune (modestes), Violet (intermédiaires), Rose (supérieurs). Les ménages Roses sont désormais exclus de la plupart des aides « par geste » sauf rénovation d'ampleur." },
      { type: "list", items: ["Pompe à chaleur air/eau : jusqu'à 11 000 €", "Pompe à chaleur géothermique : jusqu'à 15 000 €", "Isolation des combles : 25 €/m² (ménages modestes)", "Isolation des murs : 75 €/m² (ménages modestes)", "Rénovation d'ampleur : jusqu'à 90 % du coût (Bleu)"] },
      { type: "h2", text: "Le label RGE est obligatoire" },
      { type: "p", text: "Pour bénéficier de MaPrimeRénov', l'artisan doit obligatoirement détenir le label RGE (Reconnu Garant de l'Environnement) correspondant à la nature des travaux : RGE QualiPAC pour les pompes à chaleur, RGE QualiBois pour les chaudières bois, RGE Qualisol pour le solaire thermique, etc." },
      { type: "h2", text: "Le cumul des aides" },
      { type: "p", text: "MaPrimeRénov' est cumulable avec : les Certificats d'Économies d'Énergie (CEE), l'éco-PTZ (jusqu'à 50 000 €), le chèque énergie, les aides de votre collectivité. Pas cumulable avec : le crédit d'impôt (qui n'existe plus pour cette finalité)." },
      { type: "quote", text: "En cumulant MaPrimeRénov' + CEE + éco-PTZ, un ménage modeste peut financer 80 à 90 % d'une rénovation énergétique globale. Le reste à charge est très limité." },
      { type: "h2", text: "Comment faire sa demande" },
      { type: "p", text: "1. Faire réaliser un audit énergétique (obligatoire pour rénovation d'ampleur). 2. Choisir un artisan RGE et obtenir son devis. 3. Créer un compte sur maprimerenov.gouv.fr. 4. Déposer la demande AVANT le démarrage des travaux. 5. Une fois l'accord obtenu, lancer les travaux. 6. Envoyer la facture pour paiement." },
      { type: "h3", text: "Trouver un artisan RGE" },
      { type: "p", text: "Sur Bisecco, vous pouvez filtrer les artisans par certification (RGE, Qualibat, Qualifelec). Chaque label affiché est vérifié manuellement avant publication." },
    ],
  },
  {
    slug: "plombier-urgence-bons-reflexes",
    title: "Fuite d'eau le dimanche : les bons réflexes avant d'appeler",
    excerpt:
      "Avant d'appeler un plombier d'urgence (souvent facturé 3x plus cher), 5 gestes à connaître pour limiter les dégâts et obtenir un meilleur devis.",
    cover: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=1600&h=900&fit=crop&q=80",
    category: "Conseils",
    author: { name: "Maxime Garnier", avatar: "https://i.pravatar.cc/100?img=11", role: "Plombier expert" },
    date: "1 avril 2026", dateIso: "2026-04-01",
    readTime: "4 min", tags: ["Plomberie", "Urgence", "Dépannage"],
    content: [
      { type: "p", text: "Une fuite d'eau un dimanche soir, et c'est la panique. Avant de composer le premier numéro de plombier d'urgence (souvent à 250-400 € la simple intervention), prenez 5 minutes pour appliquer ces 5 gestes simples. Vous limiterez les dégâts et obtiendrez un meilleur tarif." },
      { type: "h2", text: "1. Couper l'arrivée d'eau générale" },
      { type: "p", text: "Identifiez votre robinet d'arrêt principal (souvent sous l'évier de cuisine, dans un placard technique ou à l'entrée d'eau du logement). Tournez-le dans le sens des aiguilles d'une montre pour fermer. Si vous ne savez pas où il est, repérez-le dès maintenant — c'est vital." },
      { type: "h2", text: "2. Localiser la fuite précisément" },
      { type: "p", text: "Avant d'appeler, identifiez exactement d'où vient la fuite : robinet, flexible, tuyau apparent, joint silicone, mécanisme WC, ballon d'eau chaude. Cela permet au plombier de venir avec les bonnes pièces et de chiffrer correctement." },
      { type: "h2", text: "3. Photographier pour documenter" },
      { type: "p", text: "Prenez plusieurs photos de la fuite et des dégâts. Indispensable pour : votre assurance habitation, le devis du plombier, et un éventuel litige. Datez et géolocalisez les photos." },
      { type: "list", items: ["Photo de la zone exacte de la fuite", "Photo des dégâts (eau au sol, traces sur les murs)", "Photo du compteur d'eau avant/après", "Photo du robinet d'arrêt fermé"] },
      { type: "h2", text: "4. Comparer 2-3 devis même en urgence" },
      { type: "p", text: "Beaucoup pensent qu'en urgence on n'a pas le choix. Faux. Appelez 2-3 plombiers en parallèle, demandez systématiquement un tarif horaire de l'intervention + frais de déplacement + délai. Les écarts peuvent atteindre 100 % entre le plus cher et le moins cher." },
      { type: "quote", text: "J'ai eu un devis à 380 € et un autre à 150 € pour la même fuite, le même dimanche. Le 2e plombier était mieux noté en plus." },
      { type: "h2", text: "5. Méfiez-vous des « plombiers panneau »" },
      { type: "p", text: "Ces sociétés qui collent des autocollants dans votre boîte aux lettres « SOS Plombier 24h/7j » avec un numéro 09 ou 01 sont souvent des centrales d'appels qui sous-traitent à des artisans peu scrupuleux. Tarifs explosés, factures mystérieuses. Préférez un artisan local vérifié SIREN." },
      { type: "h3", text: "Sur Bisecco" },
      { type: "p", text: "Filtrez les plombiers de votre ville disponibles aujourd'hui, contactez-les directement, comparez les tarifs affichés. Aucune commission, contact direct, 247 avis vérifiés." },
    ],
  },
  {
    slug: "isolation-thermique-prioriser",
    title: "Isolation thermique : par où commencer pour économiser ?",
    excerpt:
      "Combles, murs, sols, fenêtres : l'ordre logique des travaux d'isolation pour maximiser le retour sur investissement. Tableau comparatif inclus.",
    cover: "https://images.unsplash.com/photo-1572297870735-d77ad94e8993?w=1600&h=900&fit=crop&q=80",
    category: "Guide",
    author: { name: "Pierre Martin", avatar: "https://i.pravatar.cc/100?img=12", role: "Expert rénovation" },
    date: "25 mars 2026", dateIso: "2026-03-25",
    readTime: "8 min", tags: ["Isolation", "Énergie", "Travaux"],
    content: [
      { type: "p", text: "Vous voulez réduire votre facture énergétique et améliorer le confort de votre logement ? L'isolation thermique est le levier numéro 1. Mais par où commencer ? Voici l'ordre logique des travaux pour maximiser votre retour sur investissement." },
      { type: "h2", text: "1. Les combles : la priorité absolue" },
      { type: "p", text: "30 % des déperditions thermiques d'une maison passent par le toit. C'est mathématique : la chaleur monte. Isoler les combles est donc le geste prioritaire, et le plus rentable. Coût : 25-50 €/m². Économies : 25-30 % sur la facture chauffage. Amortissement : 3-5 ans." },
      { type: "h2", text: "2. Les murs : second levier majeur" },
      { type: "p", text: "20-25 % des déperditions passent par les murs. Deux techniques : ITE (Isolation Thermique par l'Extérieur, ~150 €/m²) ou ITI (par l'Intérieur, ~75 €/m²). L'ITE est plus efficace (suppression des ponts thermiques) mais nécessite un ravalement de façade." },
      { type: "h2", text: "3. Les fenêtres : à faire si elles datent" },
      { type: "p", text: "10-15 % des déperditions. Le remplacement par du double vitrage récent (Ug ≤ 1,1) est intéressant si vos fenêtres ont plus de 20 ans. Compter 600-1 000 €/fenêtre installée. Aides : MaPrimeRénov' jusqu'à 100 €/fenêtre pour les ménages modestes." },
      { type: "h2", text: "4. Les sols : souvent oubliés" },
      { type: "p", text: "7-10 % des déperditions, surtout en rez-de-chaussée sur vide sanitaire ou sur sol froid. Isolation par dessous (vide sanitaire) ou par dessus (avant pose du revêtement). Coût : 30-60 €/m²." },
      { type: "list", items: ["Combles : ROI 3-5 ans", "Murs (ITE) : ROI 8-12 ans", "Fenêtres : ROI 12-15 ans", "Sols : ROI 6-10 ans"] },
      { type: "h2", text: "Quel isolant choisir ?" },
      { type: "p", text: "Trois grandes familles : minéraux (laine de verre, laine de roche) — peu chers, efficaces ; biosourcés (ouate de cellulose, chanvre, fibre de bois) — meilleurs en confort d'été, plus écologiques ; synthétiques (polystyrène, polyuréthane) — performants en faible épaisseur." },
      { type: "quote", text: "Pour une rénovation globale, prévoyez 100-150 €/m² de surface habitable tous travaux confondus. Avec MaPrimeRénov' et CEE, le reste à charge peut tomber à 30-50 %." },
      { type: "h3", text: "Le bon ordre, le bon artisan" },
      { type: "p", text: "Ne lancez jamais une isolation sans avis d'un thermicien ou d'un audit énergétique. Sur Bisecco, trouvez des artisans RGE proches de chez vous, comparez 3 devis et obtenez les aides MaPrimeRénov' auxquelles vous avez droit." },
    ],
  },
];

export const CATEGORIES = [
  "Tous", "Guide", "Sécurité", "Tendances", "Conseils", "Métiers", "Législation",
] as const;

export type Category = (typeof CATEGORIES)[number];

export function findPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function relatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = findPost(slug);
  if (!current) return BLOG_POSTS.slice(0, limit);
  // Même catégorie en priorité, sinon autres articles
  const sameCategory = BLOG_POSTS.filter((p) => p.slug !== slug && p.category === current.category);
  const others = BLOG_POSTS.filter((p) => p.slug !== slug && p.category !== current.category);
  return [...sameCategory, ...others].slice(0, limit);
}
