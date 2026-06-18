import { Users } from "lucide-react";
import { ComingSoon } from "../_ComingSoon";

export const metadata = { title: "Clients · Espace pro", robots: { index: false, follow: false } };

export default function ClientsPage() {
  return (
    <ComingSoon
      title="CRM client"
      description="Centralise toutes les coordonnées de tes clients, suis l'historique de tes échanges, devis et chantiers en cours."
      icon={<Users size={32} className="text-white" />}
      bullets={[
        "Fiche client complète (devis, factures, messages)",
        "Suivi des chantiers en cours et terminés",
        "Tags + notes privées par client",
        "Export CSV pour ta comptabilité",
      ]}
    />
  );
}
