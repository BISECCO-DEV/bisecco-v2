import { FolderKanban } from "lucide-react";
import { ComingSoon } from "../_ComingSoon";

export const metadata = { title: "Projets · Espace pro", robots: { index: false, follow: false } };

export default function ProjetsPage() {
  return (
    <ComingSoon
      title="Projets / Dossiers"
      description="Suis l'avancement de chaque chantier en cours, du devis accepté à la réception finale du client."
      icon={<FolderKanban size={32} className="text-white" />}
      bullets={[
        "Vue Kanban (À planifier / En cours / Terminé)",
        "Pourcentage d'avancement par projet",
        "Stockage des plans et documents associés",
        "Galerie photos avant / pendant / après",
      ]}
    />
  );
}
