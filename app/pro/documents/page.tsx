import { FileText } from "lucide-react";
import { ComingSoon } from "../_ComingSoon";

export const metadata = { title: "Documents · Espace pro", robots: { index: false, follow: false } };

export default function DocumentsPage() {
  return (
    <ComingSoon
      title="Coffre-fort documents"
      description="Stocke tes attestations (décennale, RGE), modèles de devis et tous tes documents pros au même endroit, accessibles partout."
      icon={<FileText size={32} className="text-white" />}
      bullets={[
        "Attestation décennale + RGE",
        "Modèles de devis et factures",
        "Photos chantiers organisées par projet",
        "Partage sécurisé avec tes clients",
      ]}
    />
  );
}
