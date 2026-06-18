import { Receipt } from "lucide-react";
import { ComingSoon } from "../_ComingSoon";

export const metadata = { title: "Facturation · Espace pro", robots: { index: false, follow: false } };

export default function FacturationPage() {
  return (
    <ComingSoon
      title="Facturation pro"
      description="Transforme tes devis acceptés en factures conformes (TVA, SIREN, RCS, médiateur) en un clic. Suivi des règlements et relances auto."
      icon={<Receipt size={32} className="text-white" />}
      bullets={[
        "Conversion devis → facture en 1 clic",
        "Mentions légales auto-générées (CGI, art. L441-10)",
        "Suivi des règlements & relances auto",
        "Export comptable (FEC, CSV)",
      ]}
    />
  );
}
