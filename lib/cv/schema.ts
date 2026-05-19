import { z } from "zod";

const ExperienceSchema = z.object({
  id: z.string(),
  poste: z.string().max(255),
  entreprise: z.string().max(255),
  debut: z.string().max(10),
  fin: z.string().max(10),
  description: z.string().max(2000),
});

const FormationSchema = z.object({
  id: z.string(),
  diplome: z.string().max(255),
  ecole: z.string().max(255),
  annee: z.string().max(10),
});

const LangueSchema = z.object({
  id: z.string(),
  nom: z.string().max(100),
  niveau: z.string().max(50),
});

export const CvDataSchema = z.object({
  experiences: z.array(ExperienceSchema).max(20),
  formations: z.array(FormationSchema).max(10),
  langues: z.array(LangueSchema).max(10),
  competences: z.array(z.string().max(80)).max(30),
});

export type CvData = z.infer<typeof CvDataSchema>;
