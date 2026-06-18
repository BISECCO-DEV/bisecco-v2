import { ListChecks } from "lucide-react";
import { ComingSoon } from "../_ComingSoon";

export const metadata = { title: "Tâches · Espace pro", robots: { index: false, follow: false } };

export default function TachesPage() {
  return (
    <ComingSoon
      title="Liste de tâches"
      description="Organise ta journée avec une to-do liste pro : priorités, échéances, lien direct vers tes projets et clients."
      icon={<ListChecks size={32} className="text-white" />}
      bullets={[
        "Priorités (Haute / Moyenne / Basse)",
        "Tâches récurrentes hebdomadaires",
        "Rattachement à un projet ou un client",
        "Vue calendrier des échéances",
      ]}
    />
  );
}
