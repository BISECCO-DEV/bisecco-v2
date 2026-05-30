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

export const JOB_OFFERS: JobOffer[] = [];

export function findJob(id: string): JobOffer | undefined {
  return JOB_OFFERS.find((j) => j.id === id);
}
