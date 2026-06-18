import { Calendar } from "lucide-react";
import { ComingSoon } from "../_ComingSoon";

export const metadata = { title: "Agenda · Espace pro", robots: { index: false, follow: false } };

export default function AgendaPage() {
  return (
    <ComingSoon
      title="Agenda intelligent"
      description="Planifie tes rendez-vous, blocs de travail et déplacements directement depuis Bisecco. Tes créneaux de disponibilités déjà configurés serviront de base."
      icon={<Calendar size={32} className="text-white" />}
      bullets={[
        "Synchronisation Google / Apple Calendar",
        "Rappels par push avant chaque RDV",
        "Réservation en ligne par tes clients",
        "Vue jour / semaine / mois",
      ]}
    />
  );
}
