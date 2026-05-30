import type { Metadata } from "next";
import { InscriptionLayout } from "./InscriptionLayout";

export const metadata: Metadata = {
  title: "Inscription · Créer mon compte Bisecco",
  description:
    "Créez votre compte Bisecco en 2 minutes. 100 % gratuit, sans engagement, vérification SIREN automatique pour les artisans.",
  robots: { index: false, follow: false },
};

export default function InscriptionPage() {
  return <InscriptionLayout />;
}
