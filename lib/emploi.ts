export type ContractType = "CDI" | "CDD" | "Apprentissage" | "Alternance" | "Stage" | "Intérim" | "Freelance";
export type ExperienceLevel = "Débutant" | "1-3 ans" | "3-5 ans" | "5-10 ans" | "10+ ans";

export type JobOffer = {
  id: string;
  title: string;
  metier: string;
  company: string;
  companyAvatar: string;
  city: string;
  postalCode: string;
  contractType: ContractType;
  salaryMin?: number;
  salaryMax?: number;
  salaryPeriod: "an" | "mois" | "heure" | "jour";
  experience: ExperienceLevel;
  description: string;
  missions: string[];
  profile: string[];
  benefits: string[];
  postedAt: string;
  expiresAt: string;
  applications: number;
  verified: boolean;
  urgent?: boolean;
};

export const JOB_OFFERS: JobOffer[] = [
  {
    id: "j1",
    title: "Apprenti·e boulanger·ère",
    metier: "Boulanger",
    company: "Boulangerie du Marché",
    companyAvatar: "https://i.pravatar.cc/150?img=22",
    city: "Meaux",
    postalCode: "77100",
    contractType: "Apprentissage",
    salaryMin: 750, salaryMax: 1200, salaryPeriod: "mois",
    experience: "Débutant",
    description: "Boulangerie artisanale familiale (3 employés) recherche son·sa futur·e apprenti·e pour la rentrée 2026. Formation en alternance CAP Boulangerie.",
    missions: ["Préparation des pâtes selon recettes traditionnelles", "Cuisson au four à bois", "Aide au pétrissage et façonnage", "Mise en vitrine et accueil clientèle"],
    profile: ["Motivé·e, ponctuel·le", "Aime travailler tôt le matin (4h-12h)", "Sens de l'hygiène", "Pas de prérequis sauf brevet des collèges"],
    benefits: ["Formation rémunérée CAP", "Tickets resto", "Pain offert", "Possibilité CDI après formation"],
    postedAt: "Il y a 2 jours",
    expiresAt: "Dans 1 mois",
    applications: 7,
    verified: true,
    urgent: true,
  },
  {
    id: "j2",
    title: "Plombier·ère chauffagiste expérimenté·e",
    metier: "Plombier",
    company: "Dupont Plomberie",
    companyAvatar: "https://i.pravatar.cc/150?img=12",
    city: "Chelles",
    postalCode: "77500",
    contractType: "CDI",
    salaryMin: 35000, salaryMax: 48000, salaryPeriod: "an",
    experience: "3-5 ans",
    description: "Entreprise familiale de plomberie (8 personnes) recrute un·e plombier·ère autonome pour interventions chez particuliers et professionnels. Véhicule de service fourni.",
    missions: ["Installation sanitaire complète", "Dépannage chauffage gaz et fuel", "Pose chaudière, ballon", "Suivi de chantier"],
    profile: ["CAP/BEP Plomberie minimum", "Permis B obligatoire", "Autonome, soigneux", "Bon relationnel client"],
    benefits: ["Véhicule de service", "Mutuelle premium", "Prime annuelle", "Outillage fourni", "Formation continue"],
    postedAt: "Il y a 5 jours",
    expiresAt: "Dans 3 sem.",
    applications: 12,
    verified: true,
  },
  {
    id: "j3",
    title: "Compagnon maçon",
    metier: "Maçon",
    company: "Dupont Maçonnerie",
    companyAvatar: "https://i.pravatar.cc/150?img=33",
    city: "Meaux",
    postalCode: "77100",
    contractType: "CDI",
    salaryMin: 2200, salaryMax: 2800, salaryPeriod: "mois",
    experience: "5-10 ans",
    description: "Recherche compagnon maçon expérimenté pour chantiers de rénovation et construction neuve en Île-de-France.",
    missions: ["Pose de pierres et briques", "Coulage de béton", "Lecture de plans", "Encadrement d'un apprenti"],
    profile: ["10 ans d'expérience minimum", "Permis B", "Lecture de plans"],
    benefits: ["Mutuelle", "Tickets resto", "Prime de fin d'année"],
    postedAt: "Il y a 1 sem.",
    expiresAt: "Dans 2 sem.",
    applications: 5,
    verified: true,
  },
  {
    id: "j4",
    title: "Vendeur·euse en boucherie",
    metier: "Boucher",
    company: "Boucherie Lefevre",
    companyAvatar: "https://i.pravatar.cc/150?img=68",
    city: "Lagny-sur-Marne",
    postalCode: "77400",
    contractType: "CDI",
    salaryMin: 1850, salaryMax: 2100, salaryPeriod: "mois",
    experience: "Débutant",
    description: "Boucherie traditionnelle recrute un·e vendeur·euse pour accueil clientèle et service au comptoir.",
    missions: ["Accueil et conseil client", "Service au comptoir", "Encaissement", "Mise en vitrine"],
    profile: ["Souriant·e, motivé·e", "Sens du contact", "Pas de formation requise"],
    benefits: ["Tickets resto", "Mutuelle", "13ᵉ mois"],
    postedAt: "Il y a 1 sem.",
    expiresAt: "Dans 1 mois",
    applications: 3,
    verified: true,
  },
  {
    id: "j5",
    title: "Apprenti·e électricien·ne",
    metier: "Électricien",
    company: "Martin Élec",
    companyAvatar: "https://i.pravatar.cc/150?img=44",
    city: "Melun",
    postalCode: "77000",
    contractType: "Alternance",
    salaryMin: 800, salaryMax: 1400, salaryPeriod: "mois",
    experience: "Débutant",
    description: "PME électricité (12 salariés) recrute pour BTS Électrotechnique en alternance.",
    missions: ["Installation courants forts et faibles", "Tirage de câbles", "Pose de tableau électrique", "Diagnostics pannes"],
    profile: ["Inscrit·e en BTS Électrotechnique", "Permis B apprécié", "Motivé·e"],
    benefits: ["Formation rémunérée", "Mutuelle d'entreprise", "Outillage fourni"],
    postedAt: "Il y a 3 jours",
    expiresAt: "Dans 2 sem.",
    applications: 18,
    verified: true,
    urgent: true,
  },
  {
    id: "j6",
    title: "Menuisier·ère agencement",
    metier: "Menuisier",
    company: "Atelier du Bois",
    companyAvatar: "https://i.pravatar.cc/150?img=11",
    city: "Bussy-Saint-Georges",
    postalCode: "77600",
    contractType: "CDI",
    salaryMin: 2400, salaryMax: 3000, salaryPeriod: "mois",
    experience: "3-5 ans",
    description: "Atelier de menuiserie haut de gamme recherche un·e menuisier·ère pour agencement cuisine, dressing, mobilier sur mesure.",
    missions: ["Lecture de plans 3D", "Fabrication en atelier", "Pose chez le client", "Finitions soignées"],
    profile: ["CAP Menuiserie minimum", "Expérience agencement", "Soigneux·euse", "Permis B"],
    benefits: ["Atelier ultra équipé", "Projets variés", "Mutuelle", "Tickets resto"],
    postedAt: "Il y a 4 jours",
    expiresAt: "Dans 1 mois",
    applications: 9,
    verified: true,
  },
];

export function findJob(id: string): JobOffer | undefined {
  return JOB_OFFERS.find((j) => j.id === id);
}
